import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    // Parse query parameters
    const make = searchParams.get("make");
    const bodyStyle = searchParams.get("bodyStyle");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const minYear = searchParams.get("minYear");
    const maxYear = searchParams.get("maxYear");
    const featured = searchParams.get("featured");
    const sort = searchParams.get("sort") || "newest";
    const limit = parseInt(searchParams.get("limit") || "12");
    const offset = parseInt(searchParams.get("offset") || "0");

    // Build where clause
    const where: Record<string, unknown> = {
      isSold: false,
    };

    if (make) where.make = make;
    if (bodyStyle) where.bodyStyle = bodyStyle;
    if (featured === "true") where.isFeatured = true;

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) (where.price as Record<string, number>).gte = parseFloat(minPrice);
      if (maxPrice) (where.price as Record<string, number>).lte = parseFloat(maxPrice);
    }

    if (minYear || maxYear) {
      where.year = {};
      if (minYear) (where.year as Record<string, number>).gte = parseInt(minYear);
      if (maxYear) (where.year as Record<string, number>).lte = parseInt(maxYear);
    }

    // Build order by
    let orderBy: Record<string, string> = { createdAt: "desc" };
    switch (sort) {
      case "oldest":
        orderBy = { createdAt: "asc" };
        break;
      case "price-low":
        orderBy = { price: "asc" };
        break;
      case "price-high":
        orderBy = { price: "desc" };
        break;
      case "mileage-low":
        orderBy = { mileage: "asc" };
        break;
      case "year-new":
        orderBy = { year: "desc" };
        break;
      case "year-old":
        orderBy = { year: "asc" };
        break;
    }

    // Fetch vehicles
    const [vehicles, total] = await Promise.all([
      prisma.vehicle.findMany({
        where,
        orderBy,
        take: limit,
        skip: offset,
        include: {
          images: {
            orderBy: { position: "asc" },
          },
        },
      }),
      prisma.vehicle.count({ where }),
    ]);

    return NextResponse.json({
      vehicles,
      total,
      page: Math.floor(offset / limit) + 1,
      perPage: limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Error fetching vehicles:", error);
    return NextResponse.json(
      { error: "Failed to fetch vehicles" },
      { status: 500 }
    );
  }
}
