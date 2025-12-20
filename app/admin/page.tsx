import ScrapeButton from "@/components/admin/ScrapeButton";
import ScrapeHistory from "@/components/admin/ScrapeHistory";
import prisma from "@/lib/db";

export const dynamic = "force-dynamic";

async function getStats() {
  const [total, available, featured, sold] = await Promise.all([
    prisma.vehicle.count(),
    prisma.vehicle.count({ where: { isSold: false } }),
    prisma.vehicle.count({ where: { isFeatured: true, isSold: false } }),
    prisma.vehicle.count({ where: { isSold: true } }),
  ]);

  return { total, available, featured, sold };
}

async function getRecentLogs() {
  const logs = await prisma.scrapeLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  return logs.map((log) => ({
    ...log,
    startedAt: log.startedAt.toISOString(),
    completedAt: log.completedAt?.toISOString() || null,
  }));
}

export default async function AdminDashboard() {
  const [stats, logs] = await Promise.all([getStats(), getRecentLogs()]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl text-charcoal font-semibold mb-2">
          Dashboard
        </h1>
        <p className="text-gray">Manage your inventory and sync settings</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-sm shadow-luxury p-6">
          <p className="text-gray text-sm mb-1">Total Vehicles</p>
          <p className="font-display text-3xl text-charcoal font-semibold">
            {stats.total}
          </p>
        </div>
        <div className="bg-white rounded-sm shadow-luxury p-6">
          <p className="text-gray text-sm mb-1">Available</p>
          <p className="font-display text-3xl text-green-600 font-semibold">
            {stats.available}
          </p>
        </div>
        <div className="bg-white rounded-sm shadow-luxury p-6">
          <p className="text-gray text-sm mb-1">Featured</p>
          <p className="font-display text-3xl text-gold font-semibold">
            {stats.featured}
          </p>
        </div>
        <div className="bg-white rounded-sm shadow-luxury p-6">
          <p className="text-gray text-sm mb-1">Sold</p>
          <p className="font-display text-3xl text-gray font-semibold">
            {stats.sold}
          </p>
        </div>
      </div>

      {/* Scrape Controls */}
      <ScrapeButton />

      {/* Scrape History */}
      <ScrapeHistory logs={logs} />
    </div>
  );
}
