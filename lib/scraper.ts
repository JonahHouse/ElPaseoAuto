import * as cheerio from "cheerio";
import puppeteer, { Browser } from "puppeteer";

const SOURCE_URL = process.env.SOURCE_SITE_URL || "https://www.elpaseoauto.com";

export interface ScrapedVehicle {
  vin: string;
  stockNumber?: string;
  year: number;
  make: string;
  model: string;
  trim?: string;
  price?: number;
  mileage?: number;
  exteriorColor?: string;
  interiorColor?: string;
  transmission?: string;
  fuelType?: string;
  bodyStyle?: string;
  drivetrain?: string;
  engine?: string;
  shortDescription?: string;
  longDescription?: string;
  features: string[];
  images: string[];
  sourceUrl: string;
}

interface ListingData {
  url: string;
  stockNumber: string;
  year: number;
  make: string;
  model: string;
  bodyStyle: string;
  engine: string;
  trim: string;
}

// Parse price from string like "$142,000"
function parsePrice(priceStr: string): number | undefined {
  const cleaned = priceStr.replace(/[,$\s]/g, "");
  const match = cleaned.match(/\d+/);
  return match ? parseInt(match[0]) : undefined;
}

// Parse mileage from string
function parseMileage(mileageStr: string): number | undefined {
  const cleaned = mileageStr.replace(/[,\s]/g, "");
  const match = cleaned.match(/\d+/);
  return match ? parseInt(match[0]) : undefined;
}

// Extract DWS field value by icon class
function extractDwsField($: ReturnType<typeof cheerio.load>, iconClass: string): string {
  const fieldWrap = $(`.dws-icons-feature-${iconClass}`).closest(".dws-vehicle-fields-wrap");
  return fieldWrap.find(".dws-vehicle-fields-value").text().trim();
}

// Fetch HTML using Puppeteer (headless browser)
async function fetchHtmlWithPuppeteer(browser: Browser, url: string): Promise<string> {
  const page = await browser.newPage();

  try {
    await page.setViewport({ width: 1920, height: 1080 });
    await page.setUserAgent(
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    );

    await page.goto(url, {
      waitUntil: "networkidle2",
      timeout: 30000
    });

    // Wait for content to load
    await new Promise((resolve) => setTimeout(resolve, 1500));

    return await page.content();
  } finally {
    await page.close();
  }
}

// Get vehicle data from inventory listing page (including data attributes)
async function getVehicleListingsFromBrowser(browser: Browser): Promise<ListingData[]> {
  const listings: ListingData[] = [];

  console.log(`Fetching inventory page: ${SOURCE_URL}/inventory`);

  const html = await fetchHtmlWithPuppeteer(browser, `${SOURCE_URL}/inventory`);
  const $ = cheerio.load(html);

  // Find all vehicle sliders with data attributes
  $(".vlp-image-slider[data-vehicle-stock-number]").each((_, el) => {
    const $slider = $(el);

    const stockNumber = $slider.attr("data-vehicle-stock-number") || "";
    const year = parseInt($slider.attr("data-vehicle-year") || "0");
    const make = $slider.attr("data-vehicle-make") || "";
    const model = $slider.attr("data-vehicle-model") || "";
    const bodyStyle = $slider.attr("data-vehicle-body-type") || "";
    const engine = $slider.attr("data-vehicle-engine") || "";
    const trim = $slider.attr("data-vehicle-trim") || "";

    // Find the detail URL for this vehicle
    const $wrapper = $slider.closest(".dws-listing-vehicle-info-wrapper, .item-vehicle");
    let detailUrl = "";

    $wrapper.find("a.view-details-link, a.view-details-button").each((_, link) => {
      const href = $(link).attr("href");
      if (href && href.includes("/inventory/")) {
        detailUrl = href.startsWith("http") ? href : `${SOURCE_URL}${href}`;
      }
    });

    // Fallback: look for any inventory link nearby
    if (!detailUrl) {
      $wrapper.find("a[href*='/inventory/']").each((_, link) => {
        const href = $(link).attr("href");
        if (href && href.includes(`/${stockNumber.toLowerCase()}`)) {
          detailUrl = href.startsWith("http") ? href : `${SOURCE_URL}${href}`;
        }
      });
    }

    if (stockNumber && detailUrl) {
      listings.push({
        url: detailUrl,
        stockNumber,
        year,
        make,
        model,
        bodyStyle,
        engine,
        trim,
      });
    }
  });

  console.log(`Found ${listings.length} vehicles with data attributes`);
  return listings;
}

// Scrape a single vehicle detail page (for VIN, price, mileage, images)
async function scrapeVehicleDetailWithBrowser(
  browser: Browser,
  listing: ListingData
): Promise<ScrapedVehicle | null> {
  try {
    console.log(`Scraping: ${listing.year} ${listing.make} ${listing.model} - ${listing.url}`);
    const html = await fetchHtmlWithPuppeteer(browser, listing.url);
    const $ = cheerio.load(html);

    // Extract VIN from DWS field
    let vin = extractDwsField($, "vin");

    // Fallback: try stock number
    if (!vin) {
      vin = listing.stockNumber.toUpperCase();
    }

    if (!vin) {
      console.warn(`No VIN found for ${listing.url}`);
      return null;
    }

    // Extract additional fields from detail page
    const mileageText = extractDwsField($, "mileage");
    const transmissionText = extractDwsField($, "transmission");
    const drivetrainText = extractDwsField($, "drivetrain");

    // Get price from DWS price field
    const priceText = $(".dws-vdp-single-field-value-vehicleprice").first().text().trim();

    // Extract images from DWS slider (data-thumb attribute has image URLs)
    // Use .lslide to skip clone elements used for infinite scroll
    // Upgrade from 1024/768 thumbnails to 1920/1080 for higher resolution
    const images: string[] = [];
    $(".dws-media-slide-image.lslide[data-thumb]").each((_, el) => {
      const thumb = $(el).attr("data-thumb");
      if (thumb && !images.includes(thumb)) {
        // Upgrade resolution from 1024/768 to 1920/1080
        const highRes = thumb.replace("/1024/768/", "/1920/1080/");
        images.push(highRes);
      }
    });

    // Extract vehicle description from seller notes
    let longDescription = "";
    let shortDescription = "";
    const sellerNotesEl = $(".dws-vdp-seller-notes-container");
    if (sellerNotesEl.length > 0) {
      // Get all paragraph text, filtering out empty ones
      const paragraphs: string[] = [];
      sellerNotesEl.find("p").each((_, el) => {
        const text = $(el).text().trim();
        if (text && text.length > 1) {
          paragraphs.push(text);
        }
      });

      // The first paragraph is typically a summary/headline
      if (paragraphs.length > 0) {
        shortDescription = paragraphs[0];
      }

      // The full description includes the main content paragraphs
      // Skip the last paragraph if it's the disclaimer
      const disclaimerKeywords = ["informational purposes", "cannot guarantee", "subject to prior sale"];
      const filteredParagraphs = paragraphs.filter(
        (p) => !disclaimerKeywords.some((keyword) => p.toLowerCase().includes(keyword))
      );

      longDescription = filteredParagraphs.join("\n\n");
    }

    // Build the vehicle object with data from listing + detail page
    const vehicle: ScrapedVehicle = {
      vin,
      stockNumber: listing.stockNumber || undefined,
      year: listing.year,
      make: listing.make || "Unknown",
      model: listing.model || "Unknown",
      trim: listing.trim || undefined,
      price: parsePrice(priceText),
      mileage: parseMileage(mileageText),
      exteriorColor: undefined,
      interiorColor: undefined,
      transmission: transmissionText || undefined,
      fuelType: undefined,
      bodyStyle: listing.bodyStyle || undefined,
      drivetrain: drivetrainText || undefined,
      engine: listing.engine || undefined,
      shortDescription: shortDescription || undefined,
      longDescription: longDescription || undefined,
      features: [],
      images,
      sourceUrl: listing.url,
    };

    console.log(`  -> ${vehicle.year} ${vehicle.make} ${vehicle.model} - $${vehicle.price || "N/A"} - ${images.length} images`);

    return vehicle;
  } catch (error) {
    console.error(`Error scraping ${listing.url}:`, error);
    return null;
  }
}

// Main scrape function using Puppeteer
export async function scrapeInventory(): Promise<ScrapedVehicle[]> {
  const vehicles: ScrapedVehicle[] = [];

  console.log("Launching browser...");
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-accelerated-2d-canvas",
      "--disable-gpu",
    ],
  });

  try {
    // Get vehicle data from inventory listing (includes year, make, model from data attributes)
    const listings = await getVehicleListingsFromBrowser(browser);
    console.log(`Found ${listings.length} vehicle listings`);

    // Scrape each vehicle detail page for VIN, price, images
    for (const listing of listings) {
      const vehicle = await scrapeVehicleDetailWithBrowser(browser, listing);
      if (vehicle) {
        vehicles.push(vehicle);
      }
      // Rate limiting
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    console.log(`Successfully scraped ${vehicles.length} vehicles`);
  } finally {
    await browser.close();
    console.log("Browser closed");
  }

  return vehicles;
}

// Legacy exports for compatibility
export async function getInventoryUrls(): Promise<string[]> {
  const browser = await puppeteer.launch({ headless: true });
  try {
    const listings = await getVehicleListingsFromBrowser(browser);
    return listings.map(l => l.url);
  } finally {
    await browser.close();
  }
}

export async function scrapeVehicleDetail(url: string): Promise<ScrapedVehicle | null> {
  const browser = await puppeteer.launch({ headless: true });
  try {
    // Create a basic listing from URL
    const urlParts = url.match(/\/inventory\/([^/]+)\/([^/]+)\/([^/]+)/);
    const listing: ListingData = {
      url,
      stockNumber: urlParts?.[3] || "",
      year: 0,
      make: urlParts?.[1]?.replace(/-/g, " ").toUpperCase() || "",
      model: urlParts?.[2]?.replace(/-/g, " ").toUpperCase() || "",
      bodyStyle: "",
      engine: "",
      trim: "",
    };
    return await scrapeVehicleDetailWithBrowser(browser, listing);
  } finally {
    await browser.close();
  }
}
