import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const reportId = parseInt(id);
  const body = await request.json();

  if (isNaN(reportId)) {
    return NextResponse.json({ error: "Invalid report ID" }, { status: 400 });
  }

  const comp = await prisma.priceComp.create({
    data: {
      reportId,
      year: body.year,
      make: body.make,
      model: body.model,
      trim: body.trim || null,
      mileage: body.mileage || null,
      price: body.price,
      source: body.source || null,
      sourceUrl: body.sourceUrl || null,
      imageUrl: body.imageUrl || null,
      notes: body.notes || null,
    },
  });

  return NextResponse.json({
    ...comp,
    price: Number(comp.price),
  });
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const searchParams = request.nextUrl.searchParams;
  const compId = searchParams.get("compId");

  if (!compId) {
    return NextResponse.json({ error: "Comp ID is required" }, { status: 400 });
  }

  await prisma.priceComp.delete({
    where: { id: parseInt(compId) },
  });

  return NextResponse.json({ success: true });
}
