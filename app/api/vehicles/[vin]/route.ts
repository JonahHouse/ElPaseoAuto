import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

interface RouteParams {
  params: Promise<{ vin: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { vin } = await params;

    const vehicle = await prisma.vehicle.findUnique({
      where: { vin },
      include: {
        images: {
          orderBy: { position: "asc" },
        },
      },
    });

    if (!vehicle) {
      return NextResponse.json(
        { error: "Vehicle not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(vehicle);
  } catch (error) {
    console.error("Error fetching vehicle:", error);
    return NextResponse.json(
      { error: "Failed to fetch vehicle" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { vin } = await params;
    const body = await request.json();

    const vehicle = await prisma.vehicle.update({
      where: { vin },
      data: {
        isFeatured: body.isFeatured,
        isSold: body.isSold,
      },
    });

    return NextResponse.json(vehicle);
  } catch (error) {
    console.error("Error updating vehicle:", error);
    return NextResponse.json(
      { error: "Failed to update vehicle" },
      { status: 500 }
    );
  }
}
