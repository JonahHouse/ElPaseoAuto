import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { scrapeInventory } from "@/lib/scraper";
import { syncVehicles, createScrapeLog, updateScrapeLog } from "@/lib/sync";

// Simple auth check - in production, use proper authentication
async function isAuthorized(request: NextRequest): Promise<boolean> {
  // Check session cookie (for admin panel)
  const cookieStore = await cookies();
  const authCookie = cookieStore.get("admin_auth");
  if (authCookie?.value === "authenticated") {
    return true;
  }

  const authHeader = request.headers.get("Authorization");
  const apiKey = request.headers.get("X-API-Key");
  const adminPassword = process.env.ADMIN_PASSWORD;

  // Check for API key
  if (apiKey && apiKey === adminPassword) {
    return true;
  }

  // Check for Basic auth
  if (authHeader?.startsWith("Basic ")) {
    const base64 = authHeader.slice(6);
    const decoded = Buffer.from(base64, "base64").toString("utf-8");
    const [, password] = decoded.split(":");
    return password === adminPassword;
  }

  // For Vercel cron jobs
  const cronSecret = request.headers.get("X-Vercel-Cron-Secret");
  if (cronSecret && cronSecret === process.env.CRON_SECRET) {
    return true;
  }

  return false;
}

export async function POST(request: NextRequest) {
  // Auth check
  if (!(await isAuthorized(request))) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  // Create scrape log
  const log = await createScrapeLog();

  try {
    // Run the scraper
    const vehicles = await scrapeInventory();

    await updateScrapeLog(log.id, {
      status: "syncing",
      vehiclesFound: vehicles.length,
    });

    // Sync to database
    const result = await syncVehicles(vehicles);

    await updateScrapeLog(log.id, {
      status: "completed",
      vehiclesFound: vehicles.length,
      vehiclesAdded: result.added,
      vehiclesUpdated: result.updated,
      vehiclesRemoved: result.removed,
    });

    return NextResponse.json({
      success: true,
      logId: log.id,
      message: "Scrape completed successfully",
      stats: {
        found: vehicles.length,
        added: result.added,
        updated: result.updated,
        removed: result.removed,
      },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";

    await updateScrapeLog(log.id, {
      status: "failed",
      errorMessage,
    });

    console.error("Scrape failed:", error);

    return NextResponse.json(
      {
        success: false,
        logId: log.id,
        error: "Scrape failed",
        message: errorMessage,
      },
      { status: 500 }
    );
  }
}

// GET endpoint to check scrape status
export async function GET(request: NextRequest) {
  if (!(await isAuthorized(request))) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const { searchParams } = new URL(request.url);
  const logId = searchParams.get("logId");

  if (logId) {
    const { PrismaClient } = await import("@prisma/client");
    const prisma = new PrismaClient();

    const log = await prisma.scrapeLog.findUnique({
      where: { id: parseInt(logId) },
    });

    await prisma.$disconnect();

    if (!log) {
      return NextResponse.json({ error: "Log not found" }, { status: 404 });
    }

    return NextResponse.json(log);
  }

  return NextResponse.json({ status: "ready" });
}
