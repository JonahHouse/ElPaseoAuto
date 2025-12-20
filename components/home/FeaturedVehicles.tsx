import Link from "next/link";
import VehicleCard from "@/components/inventory/VehicleCard";
import Button from "@/components/ui/Button";

interface VehicleImage {
  url: string;
  isPrimary: boolean;
}

interface Vehicle {
  id: number;
  vin: string;
  year: number;
  make: string;
  model: string;
  trim?: string | null;
  price?: number | null;
  mileage?: number | null;
  exteriorColor?: string | null;
  images: VehicleImage[];
}

interface FeaturedVehiclesProps {
  vehicles: Vehicle[];
}

export default function FeaturedVehicles({ vehicles }: FeaturedVehiclesProps) {
  if (vehicles.length === 0) {
    return null;
  }

  return (
    <section className="py-20 bg-off-white">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-14">
          <p className="text-gold uppercase tracking-[0.2em] text-sm font-medium mb-4">
            Our Collection
          </p>
          <h2 className="font-display text-4xl md:text-5xl text-charcoal font-semibold mb-4">
            Featured Vehicles
          </h2>
          <p className="text-gray max-w-2xl mx-auto">
            Explore our hand-selected inventory of exceptional automobiles,
            each meticulously inspected and ready for their new home.
          </p>
        </div>

        {/* Vehicle Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {vehicles.map((vehicle) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link href="/inventory">
            <Button variant="secondary" size="lg">
              View All Vehicles
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
