import { notFound } from "next/navigation";
import Link from "next/link";
import VehicleGallery from "@/components/inventory/VehicleGallery";
import VehicleSpecs from "@/components/inventory/VehicleSpecs";
import VehicleInquiryForm from "@/components/inventory/VehicleInquiryForm";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { prisma } from "@/lib/prisma";

async function getVehicle(vin: string) {
  const vehicle = await prisma.vehicle.findUnique({
    where: { vin },
    include: {
      images: {
        orderBy: { position: "asc" },
      },
    },
  });

  if (!vehicle) return null;

  // Convert Decimal to number and format for client
  return {
    id: vehicle.id,
    vin: vehicle.vin,
    stockNumber: vehicle.stockNumber,
    year: vehicle.year,
    make: vehicle.make,
    model: vehicle.model,
    trim: vehicle.trim,
    price: vehicle.price ? Number(vehicle.price) : null,
    msrp: vehicle.msrp ? Number(vehicle.msrp) : null,
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
    features: (vehicle.features as string[]) || [],
    isFeatured: vehicle.isFeatured,
    isSold: vehicle.isSold,
    images: vehicle.images.map((img) => ({
      id: img.id,
      url: img.url,
      position: img.position,
      isPrimary: img.isPrimary,
    })),
  };
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);
}

function formatMileage(mileage: number): string {
  return new Intl.NumberFormat("en-US").format(mileage);
}

interface PageProps {
  params: Promise<{ vin: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { vin } = await params;
  const vehicle = await getVehicle(vin);

  if (!vehicle) {
    return { title: "Vehicle Not Found | El Paseo Auto Group" };
  }

  const title = `${vehicle.year} ${vehicle.make} ${vehicle.model} ${vehicle.trim || ""} | El Paseo Auto Group`;

  return {
    title,
    description: vehicle.shortDescription || vehicle.longDescription?.slice(0, 160),
  };
}

export default async function VehicleDetailPage({ params }: PageProps) {
  const { vin } = await params;
  const vehicle = await getVehicle(vin);

  if (!vehicle) {
    notFound();
  }

  const title = `${vehicle.year} ${vehicle.make} ${vehicle.model}`;
  const fullTitle = vehicle.trim ? `${title} ${vehicle.trim}` : title;

  return (
    <div className="pt-32 bg-off-white min-h-screen">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <ol className="flex items-center gap-2 text-sm">
            <li>
              <Link href="/" className="text-gray hover:text-gold transition-colors">
                Home
              </Link>
            </li>
            <li className="text-gray-light">/</li>
            <li>
              <Link href="/inventory" className="text-gray hover:text-gold transition-colors">
                Inventory
              </Link>
            </li>
            <li className="text-gray-light">/</li>
            <li className="text-charcoal font-medium">{title}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Gallery & Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Gallery */}
            <VehicleGallery images={vehicle.images} title={fullTitle} />

            {/* Title & Price (Mobile) */}
            <div className="lg:hidden">
              <div className="flex gap-2 mb-3">
                {vehicle.isFeatured && <Badge variant="gold">Featured</Badge>}
                {vehicle.isSold && <Badge variant="error">Sold</Badge>}
              </div>
              <h1 className="font-display text-3xl text-charcoal font-semibold mb-2">
                {fullTitle}
              </h1>
              {vehicle.shortDescription && (
                <p className="text-gray text-sm mb-3 leading-relaxed">
                  {vehicle.shortDescription}
                </p>
              )}
              <p className="font-display text-3xl text-gold font-semibold mb-4">
                {vehicle.price ? formatPrice(vehicle.price) : "Call for Price"}
              </p>
              {vehicle.msrp && vehicle.price && vehicle.msrp > vehicle.price && (
                <p className="text-gray text-sm">
                  MSRP: <span className="line-through">{formatPrice(vehicle.msrp)}</span>
                  <span className="text-green-600 ml-2">
                    Save {formatPrice(vehicle.msrp - vehicle.price)}
                  </span>
                </p>
              )}
            </div>

            {/* Description */}
            {vehicle.longDescription && (
              <div className="bg-white rounded-sm shadow-luxury p-6">
                <h3 className="font-display text-xl text-charcoal font-semibold mb-4">
                  Description
                </h3>
                <div className="space-y-4">
                  {vehicle.longDescription.split("\n\n").map((paragraph, index) => (
                    <p key={index} className="text-gray leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            )}

            {/* Specs */}
            <VehicleSpecs vehicle={vehicle} />

            {/* Features */}
            {vehicle.features && vehicle.features.length > 0 && (
              <div className="bg-white rounded-sm shadow-luxury p-6">
                <h3 className="font-display text-xl text-charcoal font-semibold mb-4">
                  Features
                </h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {vehicle.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-gray">
                      <svg
                        className="w-5 h-5 text-gold flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Price Card (Desktop) */}
            <div className="hidden lg:block bg-white rounded-sm shadow-luxury p-6">
              <div className="flex gap-2 mb-3">
                {vehicle.isFeatured && <Badge variant="gold">Featured</Badge>}
                {vehicle.isSold && <Badge variant="error">Sold</Badge>}
              </div>
              <h1 className="font-display text-2xl text-charcoal font-semibold mb-2">
                {fullTitle}
              </h1>
              {vehicle.shortDescription && (
                <p className="text-gray text-sm mb-3 leading-relaxed">
                  {vehicle.shortDescription}
                </p>
              )}
              <p className="font-display text-3xl text-gold font-semibold mb-2">
                {vehicle.price ? formatPrice(vehicle.price) : "Call for Price"}
              </p>
              {vehicle.msrp && vehicle.price && vehicle.msrp > vehicle.price && (
                <p className="text-gray text-sm mb-4">
                  MSRP: <span className="line-through">{formatPrice(vehicle.msrp)}</span>
                  <span className="text-green-600 ml-2">
                    Save {formatPrice(vehicle.msrp - vehicle.price)}
                  </span>
                </p>
              )}
              <div className="flex flex-wrap gap-4 text-sm text-gray mt-4 pt-4 border-t border-gray-light/20">
                {vehicle.mileage && (
                  <span>{formatMileage(vehicle.mileage)} miles</span>
                )}
                {vehicle.exteriorColor && <span>{vehicle.exteriorColor}</span>}
              </div>
            </div>

            {/* Inquiry Form */}
            <VehicleInquiryForm vehicleTitle={fullTitle} vehicleId={vehicle.id} />

            {/* Back to Inventory */}
            <Link href="/inventory">
              <Button variant="outline" className="w-full">
                ← Back to Inventory
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
