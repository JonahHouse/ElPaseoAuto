interface ScrapeLog {
  id: number;
  startedAt: string;
  completedAt: string | null;
  vehiclesFound: number | null;
  vehiclesAdded: number | null;
  vehiclesUpdated: number | null;
  vehiclesRemoved: number | null;
  status: string;
  errorMessage: string | null;
}

interface ScrapeHistoryProps {
  logs: ScrapeLog[];
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function getStatusColor(status: string): string {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-800";
    case "running":
      return "bg-blue-100 text-blue-800";
    case "failed":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

export default function ScrapeHistory({ logs }: ScrapeHistoryProps) {
  if (logs.length === 0) {
    return (
      <div className="bg-white rounded-sm shadow-luxury p-6">
        <h3 className="font-display text-lg text-charcoal font-semibold mb-4">
          Scrape History
        </h3>
        <p className="text-gray text-center py-8">No scrape history yet</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-sm shadow-luxury p-6">
      <h3 className="font-display text-lg text-charcoal font-semibold mb-4">
        Recent Scrapes
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[500px]">
          <thead>
            <tr className="border-b border-gray-light/20">
              <th className="text-left py-3 px-2 text-gray font-medium min-w-[120px]">Date</th>
              <th className="text-left py-3 px-2 text-gray font-medium min-w-[90px]">Status</th>
              <th className="text-center py-3 px-2 text-gray font-medium">Found</th>
              <th className="text-center py-3 px-2 text-gray font-medium">Added</th>
              <th className="text-center py-3 px-2 text-gray font-medium">Updated</th>
              <th className="text-center py-3 px-2 text-gray font-medium">Removed</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id} className="border-b border-gray-light/10">
                <td className="py-3 px-2 text-charcoal whitespace-nowrap">
                  {formatDate(log.startedAt)}
                </td>
                <td className="py-3 px-2">
                  <span
                    className={`inline-block px-2 py-1 rounded text-xs font-medium ${getStatusColor(
                      log.status
                    )}`}
                  >
                    {log.status}
                  </span>
                </td>
                <td className="py-3 px-2 text-center text-charcoal">
                  {log.vehiclesFound ?? "-"}
                </td>
                <td className="py-3 px-2 text-center text-green-600">
                  {log.vehiclesAdded ? `+${log.vehiclesAdded}` : "-"}
                </td>
                <td className="py-3 px-2 text-center text-blue-600">
                  {log.vehiclesUpdated ?? "-"}
                </td>
                <td className="py-3 px-2 text-center text-orange-600">
                  {log.vehiclesRemoved ?? "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
