import VehicleCard from "./VehicleCard";

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
  isFeatured?: boolean;
  isSold?: boolean;
}

interface VehicleGridProps {
  vehicles: Vehicle[];
}

export default function VehicleGrid({ vehicles }: VehicleGridProps) {
  if (vehicles.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-off-white mb-6">
          <svg
            className="w-8 h-8 text-gray-light"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <h3 className="font-display text-xl text-charcoal font-semibold mb-2">
          No Vehicles Found
        </h3>
        <p className="text-gray max-w-md mx-auto">
          We couldn&apos;t find any vehicles matching your criteria. Try adjusting
          your filters or check back soon for new inventory.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {vehicles.map((vehicle) => (
        <VehicleCard key={vehicle.id} vehicle={vehicle} />
      ))}
    </div>
  );
}
