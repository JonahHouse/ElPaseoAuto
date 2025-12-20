import prisma from "./db";
import { ScrapedVehicle } from "./scraper";

interface SyncResult {
  added: number;
  updated: number;
  removed: number;
}

export async function syncVehicles(scrapedVehicles: ScrapedVehicle[]): Promise<SyncResult> {
  let added = 0;
  let updated = 0;
  let removed = 0;

  // Get existing VINs
  const existingVehicles = await prisma.vehicle.findMany({
    select: { vin: true, isSold: true },
  });
  const existingVinSet = new Set(existingVehicles.map((v) => v.vin));
  const scrapedVinSet = new Set(scrapedVehicles.map((v) => v.vin));

  // Process scraped vehicles
  for (const vehicle of scrapedVehicles) {
    const vehicleData = {
      vin: vehicle.vin,
      stockNumber: vehicle.stockNumber,
      year: vehicle.year,
      make: vehicle.make,
      model: vehicle.model,
      trim: vehicle.trim,
      price: vehicle.price,
      mileage: vehicle.mileage,
      exteriorColor: vehicle.exteriorColor,
      interiorColor: vehicle.interiorColor,
      transmission: vehicle.transmission,
      fuelType: vehicle.fuelType,
      bodyStyle: vehicle.bodyStyle,
      drivetrain: vehicle.drivetrain,
      engine: vehicle.engine,
      shortDescription: vehicle.shortDescription,
      longDescription: vehicle.longDescription,
      features: vehicle.features,
      sourceUrl: vehicle.sourceUrl,
      isSold: false, // Reset sold status since it's in current inventory
    };

    if (existingVinSet.has(vehicle.vin)) {
      // Update existing vehicle
      await prisma.vehicle.update({
        where: { vin: vehicle.vin },
        data: vehicleData,
      });

      // Update images
      await updateVehicleImages(vehicle.vin, vehicle.images);
      updated++;
    } else {
      // Create new vehicle
      const newVehicle = await prisma.vehicle.create({
        data: vehicleData,
      });

      // Add images
      if (vehicle.images.length > 0) {
        await prisma.vehicleImage.createMany({
          data: vehicle.images.map((url, index) => ({
            vehicleId: newVehicle.id,
            url,
            position: index,
            isPrimary: index === 0,
          })),
        });
      }
      added++;
    }
  }

  // Mark vehicles not in current scrape as sold
  for (const existing of existingVehicles) {
    if (!scrapedVinSet.has(existing.vin) && !existing.isSold) {
      await prisma.vehicle.update({
        where: { vin: existing.vin },
        data: { isSold: true },
      });
      removed++;
    }
  }

  return { added, updated, removed };
}

async function updateVehicleImages(vin: string, imageUrls: string[]) {
  const vehicle = await prisma.vehicle.findUnique({
    where: { vin },
    select: { id: true },
  });

  if (!vehicle) return;

  // Delete all existing images and replace with fresh scrape
  // This ensures correct ordering and removes stale images
  await prisma.vehicleImage.deleteMany({
    where: { vehicleId: vehicle.id },
  });

  // Add images with correct positions
  if (imageUrls.length > 0) {
    await prisma.vehicleImage.createMany({
      data: imageUrls.map((url, index) => ({
        vehicleId: vehicle.id,
        url,
        position: index,
        isPrimary: index === 0,
      })),
    });
  }
}

export async function createScrapeLog() {
  return prisma.scrapeLog.create({
    data: {
      startedAt: new Date(),
      status: "running",
    },
  });
}

export async function updateScrapeLog(
  id: number,
  data: {
    status: string;
    vehiclesFound?: number;
    vehiclesAdded?: number;
    vehiclesUpdated?: number;
    vehiclesRemoved?: number;
    errorMessage?: string;
  }
) {
  return prisma.scrapeLog.update({
    where: { id },
    data: {
      ...data,
      completedAt: data.status !== "running" ? new Date() : undefined,
    },
  });
}
