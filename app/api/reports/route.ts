import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const status = searchParams.get("status");

  const where: { status?: string } = {};

  if (status && status !== "all") {
    where.status = status;
  }

  const reports = await prisma.priceReport.findMany({
    where,
    include: {
      _count: {
        select: { comps: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  // Convert Decimal to number for JSON serialization
  const serializedReports = reports.map((report) => ({
    ...report,
    suggestedPrice: report.suggestedPrice ? Number(report.suggestedPrice) : null,
    priceRangeLow: report.priceRangeLow ? Number(report.priceRangeLow) : null,
    priceRangeHigh: report.priceRangeHigh ? Number(report.priceRangeHigh) : null,
  }));

  return NextResponse.json(serializedReports);
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  // Generate slug from year, make, model, and timestamp
  const baseSlug = `${body.year}-${body.make}-${body.model}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  const timestamp = Date.now().toString(36);
  const slug = `${baseSlug}-${timestamp}`;

  const report = await prisma.priceReport.create({
    data: {
      slug,
      vehicleId: body.vehicleId || null,
      year: body.year,
      make: body.make,
      model: body.model,
      trim: body.trim || null,
      vin: body.vin || null,
      mileage: body.mileage || null,
      condition: body.condition || null,
      notes: body.notes || null,
      ownerName: body.ownerName || null,
      ownerEmail: body.ownerEmail || null,
      ownerPhone: body.ownerPhone || null,
      suggestedPrice: body.suggestedPrice || null,
      priceRangeLow: body.priceRangeLow || null,
      priceRangeHigh: body.priceRangeHigh || null,
      status: body.status || "draft",
    },
  });

  return NextResponse.json({
    ...report,
    suggestedPrice: report.suggestedPrice ? Number(report.suggestedPrice) : null,
    priceRangeLow: report.priceRangeLow ? Number(report.priceRangeLow) : null,
    priceRangeHigh: report.priceRangeHigh ? Number(report.priceRangeHigh) : null,
  });
}
