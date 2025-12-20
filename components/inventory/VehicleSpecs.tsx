interface Vehicle {
  year: number;
  make: string;
  model: string;
  trim?: string | null;
  mileage?: number | null;
  exteriorColor?: string | null;
  interiorColor?: string | null;
  transmission?: string | null;
  fuelType?: string | null;
  bodyStyle?: string | null;
  drivetrain?: string | null;
  engine?: string | null;
  vin: string;
  stockNumber?: string | null;
}

interface VehicleSpecsProps {
  vehicle: Vehicle;
}

function formatMileage(mileage: number): string {
  return new Intl.NumberFormat("en-US").format(mileage);
}

export default function VehicleSpecs({ vehicle }: VehicleSpecsProps) {
  const specs = [
    { label: "Year", value: vehicle.year },
    { label: "Make", value: vehicle.make },
    { label: "Model", value: vehicle.model },
    { label: "Trim", value: vehicle.trim },
    { label: "Mileage", value: vehicle.mileage ? `${formatMileage(vehicle.mileage)} miles` : null },
    { label: "Exterior Color", value: vehicle.exteriorColor },
    { label: "Interior Color", value: vehicle.interiorColor },
    { label: "Transmission", value: vehicle.transmission },
    { label: "Fuel Type", value: vehicle.fuelType },
    { label: "Body Style", value: vehicle.bodyStyle },
    { label: "Drivetrain", value: vehicle.drivetrain },
    { label: "Engine", value: vehicle.engine },
    { label: "VIN", value: vehicle.vin },
    { label: "Stock #", value: vehicle.stockNumber },
  ].filter((spec) => spec.value);

  return (
    <div className="bg-white rounded-sm shadow-luxury p-6">
      <h3 className="font-display text-xl text-charcoal font-semibold mb-6">
        Vehicle Specifications
      </h3>
      <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
        {specs.map((spec) => (
          <div key={spec.label} className="flex justify-between py-2 border-b border-gray-light/20">
            <dt className="text-gray text-sm">{spec.label}</dt>
            <dd className="text-charcoal font-medium text-sm">{spec.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
