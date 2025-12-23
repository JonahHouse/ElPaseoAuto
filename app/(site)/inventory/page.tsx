import { Suspense } from "react";
import Link from "next/link";
import VehicleFilters from "@/components/inventory/VehicleFilters";
import VehicleGrid from "@/components/inventory/VehicleGrid";
import Button from "@/components/ui/Button";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { getRandomHeaderImage } from "@/lib/headerImages";

interface SearchParams {
  make?: string;
  bodyStyle?: string;
  minYear?: string;
  maxYear?: string;
  minPrice?: string;
  maxPrice?: string;
  sort?: string;
}

async function getVehicles(searchParams: SearchParams) {
  const { make, bodyStyle, minYear, maxYear, minPrice, maxPrice, sort } = searchParams;

  // Build where clause
  const where: Prisma.VehicleWhereInput = {
    isSold: false,
    images: {
      some: {},
    },
  };

  if (make) {
    where.make = make;
  }

  if (bodyStyle) {
    where.bodyStyle = bodyStyle;
  }

  if (minYear || maxYear) {
    where.year = {};
    if (minYear) where.year.gte = parseInt(minYear);
    if (maxYear) where.year.lte = parseInt(maxYear);
  }

  if (minPrice || maxPrice) {
    where.price = {};
    if (minPrice) where.price.gte = parseInt(minPrice);
    if (maxPrice) where.price.lte = parseInt(maxPrice);
  }

  // Build orderBy
  let orderBy: Prisma.VehicleOrderByWithRelationInput[] = [
    { isFeatured: "desc" },
    { createdAt: "desc" },
  ];

  switch (sort) {
    case "oldest":
      orderBy = [{ createdAt: "asc" }];
      break;
    case "price-low":
      orderBy = [{ price: "asc" }];
      break;
    case "price-high":
      orderBy = [{ price: "desc" }];
      break;
    case "mileage-low":
      orderBy = [{ mileage: "asc" }];
      break;
    case "year-new":
      orderBy = [{ year: "desc" }];
      break;
    case "year-old":
      orderBy = [{ year: "asc" }];
      break;
  }

  const vehicles = await prisma.vehicle.findMany({
    where,
    include: {
      images: {
        orderBy: { position: "asc" },
      },
    },
    orderBy,
  });

  // Convert Decimal to number for serialization
  return vehicles.map((v) => ({
    id: v.id,
    vin: v.vin,
    year: v.year,
    make: v.make,
    model: v.model,
    trim: v.trim,
    price: v.price ? Number(v.price) : null,
    mileage: v.mileage,
    exteriorColor: v.exteriorColor,
    bodyStyle: v.bodyStyle,
    isFeatured: v.isFeatured,
    images: v.images.map((img) => ({
      url: img.url,
      isPrimary: img.isPrimary,
    })),
  }));
}

async function getFilterOptions() {
  const vehicles = await prisma.vehicle.findMany({
    where: {
      isSold: false,
      images: {
        some: {},
      },
    },
    select: {
      make: true,
      bodyStyle: true,
    },
  });

  const makes = [...new Set(vehicles.map((v) => v.make))].sort();
  const bodyStyles = [...new Set(vehicles.map((v) => v.bodyStyle).filter(Boolean))] as string[];

  return { makes, bodyStyles };
}

export const metadata = {
  title: "Inventory | El Paseo Auto Group",
  description:
    "Browse our selection of luxury and exotic vehicles at El Paseo Auto Group in Palm Desert.",
};

interface PageProps {
  searchParams: Promise<SearchParams>;
}

export default async function InventoryPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const [vehicles, filterOptions] = await Promise.all([
    getVehicles(params),
    getFilterOptions(),
  ]);
  const heroImage = getRandomHeaderImage();

  return (
    <div>
      {/* Hero Section */}
      <section className="relative py-20">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat grayscale"
          style={{ backgroundImage: `url('${heroImage}')` }}
        />
        <div className="absolute inset-0 bg-black/75" />
        <div className="relative container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-gold uppercase tracking-[0.2em] text-sm font-medium mb-4">
              Our Collection
            </p>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-white font-semibold mb-6">
              Browse Our Inventory
            </h1>
            <p className="text-gray-light text-lg leading-relaxed mb-8">
              Explore our curated selection of exceptional luxury and exotic vehicles.
              Each automobile has been carefully inspected and is ready for its new owner.
            </p>
            <Link href="/sell-your-car">
              <Button size="lg">Sell Your Car</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Inventory Content */}
      <div className="bg-off-white py-16">
        <div className="container mx-auto px-4 lg:px-8">

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:col-span-1">
            <Suspense fallback={<div className="bg-white p-6 rounded-sm shadow-luxury animate-pulse h-96" />}>
              <VehicleFilters options={filterOptions} />
            </Suspense>
          </aside>

          {/* Vehicle Grid */}
          <div className="lg:col-span-3">
            {/* Results Count */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray">
                Showing <span className="font-medium text-charcoal">{vehicles.length}</span> vehicles
              </p>
            </div>

            <VehicleGrid vehicles={vehicles} />
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
