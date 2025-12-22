import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const reportId = parseInt(id);

  if (isNaN(reportId)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  const report = await prisma.priceReport.findUnique({
    where: { id: reportId },
    include: {
      comps: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!report) {
    return NextResponse.json({ error: "Report not found" }, { status: 404 });
  }

  // Convert Decimal to number for JSON serialization
  return NextResponse.json({
    ...report,
    suggestedPrice: report.suggestedPrice ? Number(report.suggestedPrice) : null,
    priceRangeLow: report.priceRangeLow ? Number(report.priceRangeLow) : null,
    priceRangeHigh: report.priceRangeHigh ? Number(report.priceRangeHigh) : null,
    comps: report.comps.map((comp) => ({
      ...comp,
      price: Number(comp.price),
    })),
  });
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const reportId = parseInt(id);
  const body = await request.json();

  if (isNaN(reportId)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  const report = await prisma.priceReport.update({
    where: { id: reportId },
    data: {
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

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const reportId = parseInt(id);

  if (isNaN(reportId)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  await prisma.priceReport.delete({
    where: { id: reportId },
  });

  return NextResponse.json({ success: true });
}
