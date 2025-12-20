import VehicleTable from "@/components/admin/VehicleTable";
import prisma from "@/lib/db";

export const dynamic = "force-dynamic";

async function getVehicles() {
  const vehicles = await prisma.vehicle.findMany({
    orderBy: [{ isSold: "asc" }, { createdAt: "desc" }],
    select: {
      id: true,
      vin: true,
      year: true,
      make: true,
      model: true,
      trim: true,
      price: true,
      isFeatured: true,
      isSold: true,
    },
  });

  return vehicles.map((v) => ({
    ...v,
    price: v.price ? Number(v.price) : null,
  }));
}

export default async function AdminInventoryPage() {
  const vehicles = await getVehicles();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl text-charcoal font-semibold mb-2">
          Inventory Management
        </h1>
        <p className="text-gray">
          Manage your vehicle inventory, toggle featured status, and mark vehicles as sold.
        </p>
      </div>

      <VehicleTable vehicles={vehicles} />
    </div>
  );
}
