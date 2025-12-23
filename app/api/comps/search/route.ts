import { NextRequest, NextResponse } from "next/server";

const AUTO_DEV_API_KEY = process.env.AUTO_DEV_API_KEY;
const AUTO_DEV_BASE_URL = "https://api.auto.dev/listings";

interface AutoDevListing {
  vin: string;
  vehicle: {
    year: number;
    make: string;
    model: string;
    trim?: string;
    drivetrain?: string;
    engine?: string;
    fuel?: string;
    transmission?: string;
    exteriorColor?: string;
    interiorColor?: string;
  };
  retailListing?: {
    price: number;
    miles: number;
    dealer: string;
    city?: string;
    state?: string;
    zip?: string;
    vdp: string;
    primaryImage?: string;
    used: boolean;
    cpo: boolean;
    carfaxUrl?: string;
  };
  history?: {
    accidents: boolean;
    ownerCount: number;
  } | null;
}

interface SearchResult {
  vin: string;
  year: number;
  make: string;
  model: string;
  trim: string | null;
  mileage: number | null;
  price: number;
  source: string;
  sourceUrl: string;
  imageUrl: string | null;
  location: string;
  drivetrain: string | null;
  exteriorColor: string | null;
  cpo: boolean;
  accidents: boolean | null;
  ownerCount: number | null;
  carfaxUrl: string | null;
}

export async function GET(request: NextRequest) {
  if (!AUTO_DEV_API_KEY) {
    return NextResponse.json(
      { error: "AUTO_DEV_API_KEY not configured" },
      { status: 500 }
    );
  }

  const searchParams = request.nextUrl.searchParams;
  const year = searchParams.get("year");
  const minYear = searchParams.get("minYear");
  const maxYear = searchParams.get("maxYear");
  const make = searchParams.get("make");
  const model = searchParams.get("model");
  const limit = searchParams.get("limit") || "100";

  if (!make || !model) {
    return NextResponse.json(
      { error: "make and model are required" },
      { status: 400 }
    );
  }

  // Build the query URL
  const params = new URLSearchParams();

  // Year range or exact year
  if (minYear && maxYear) {
    // Use single year format if min equals max (API returns more results this way)
    if (minYear === maxYear) {
      params.set("vehicle.year", minYear);
    } else {
      params.set("vehicle.year", `${minYear}-${maxYear}`);
    }
  } else if (year) {
    params.set("vehicle.year", year);
  }
  params.set("vehicle.make", make);
  params.set("vehicle.model", model);
  // Note: trim is intentionally not included - naming varies too much between sources
  // Note: no location filter - searching nationwide

  // Only get used vehicles with prices
  params.set("retailListing.price", "1-9999999"); // Exclude $0 listings

  // Pagination
  params.set("limit", limit);

  const url = `${AUTO_DEV_BASE_URL}?${params.toString()}`;

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${AUTO_DEV_API_KEY}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Auto.dev API error:", errorData);
      return NextResponse.json(
        { error: errorData.error || "Failed to fetch listings" },
        { status: response.status }
      );
    }

    const data = await response.json();
    const listings: AutoDevListing[] = data.data || [];

    // Transform to our format and dedupe by VIN
    const seenVins = new Set<string>();
    const results: SearchResult[] = listings
      .filter((listing) => listing.retailListing && listing.retailListing.price > 0)
      .map((listing) => ({
        vin: listing.vin,
        year: listing.vehicle.year,
        make: listing.vehicle.make,
        model: listing.vehicle.model,
        trim: listing.vehicle.trim || null,
        mileage: listing.retailListing?.miles || null,
        price: listing.retailListing?.price || 0,
        source: listing.retailListing?.dealer || "Unknown Dealer",
        sourceUrl: listing.retailListing?.vdp || "",
        imageUrl: listing.retailListing?.primaryImage || null,
        location:
          listing.retailListing?.city && listing.retailListing?.state
            ? `${listing.retailListing.city}, ${listing.retailListing.state}`
            : "",
        drivetrain: listing.vehicle.drivetrain || null,
        exteriorColor: listing.vehicle.exteriorColor || null,
        cpo: listing.retailListing?.cpo || false,
        accidents: listing.history?.accidents ?? null,
        ownerCount: listing.history?.ownerCount ?? null,
        carfaxUrl: listing.retailListing?.carfaxUrl || null,
      }))
      .filter((result) => {
        if (seenVins.has(result.vin)) {
          return false;
        }
        seenVins.add(result.vin);
        return true;
      })
      .sort((a, b) => a.price - b.price); // Sort by price ascending

    return NextResponse.json({
      results,
      count: results.length,
      query: { year, make, model },
    });
  } catch (error) {
    console.error("Error fetching from auto.dev:", error);
    return NextResponse.json(
      { error: "Failed to search listings" },
      { status: 500 }
    );
  }
}
