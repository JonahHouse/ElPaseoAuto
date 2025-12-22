"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface PriceReport {
  id: number;
  slug: string;
  year: number;
  make: string;
  model: string;
  trim: string | null;
  vin: string | null;
  mileage: number | null;
  ownerName: string | null;
  suggestedPrice: number | null;
  status: string;
  createdAt: string;
  _count: {
    comps: number;
  };
}

const statusColors: Record<string, string> = {
  draft: "bg-gray-100 text-gray-800",
  published: "bg-green-100 text-green-800",
  sent: "bg-blue-100 text-blue-800",
  archived: "bg-orange-100 text-orange-800",
};

const statusLabels: Record<string, string> = {
  draft: "Draft",
  published: "Published",
  sent: "Sent",
  archived: "Archived",
};

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);
}

export default function AdminReportsPage() {
  const [reports, setReports] = useState<PriceReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchReports = async () => {
    setIsLoading(true);
    const params = new URLSearchParams();
    if (statusFilter !== "all") params.set("status", statusFilter);

    const response = await fetch(`/api/reports?${params}`);
    const data = await response.json();
    setReports(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchReports();
  }, [statusFilter]);

  const deleteReport = async (id: number) => {
    if (!confirm("Are you sure you want to delete this report?")) return;
    await fetch(`/api/reports/${id}`, { method: "DELETE" });
    fetchReports();
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-display font-semibold text-charcoal">
            Price Reports
          </h1>
          <p className="text-gray mt-1">
            {reports.length} {reports.length === 1 ? "report" : "reports"}
          </p>
        </div>
        <Link
          href="/admin/reports/new"
          className="px-4 py-2 bg-gold text-black font-medium rounded-sm hover:bg-gold-dark transition-colors"
        >
          New Report
        </Link>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-light rounded-sm focus:outline-none focus:ring-2 focus:ring-gold"
        >
          <option value="all">All Status</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="sent">Sent</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      {/* Reports Table */}
      <div className="bg-white rounded-sm shadow-luxury overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-gray">Loading...</div>
        ) : reports.length === 0 ? (
          <div className="p-8 text-center text-gray">
            <svg
              className="w-12 h-12 mx-auto mb-4 text-gray-light"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <p>No reports found</p>
            <Link
              href="/admin/reports/new"
              className="inline-block mt-4 text-gold hover:underline"
            >
              Create your first report →
            </Link>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-off-white border-b border-gray-light/20">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray uppercase tracking-wide">
                  Vehicle
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray uppercase tracking-wide">
                  Owner
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray uppercase tracking-wide">
                  Price
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray uppercase tracking-wide">
                  Comps
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray uppercase tracking-wide">
                  Status
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray uppercase tracking-wide">
                  Created
                </th>
                <th className="text-right px-4 py-3 text-xs font-medium text-gray uppercase tracking-wide">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-light/20">
              {reports.map((report) => (
                <tr key={report.id} className="hover:bg-off-white/50">
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/reports/${report.id}`}
                      className="hover:text-gold"
                    >
                      <div className="font-medium text-charcoal">
                        {report.year} {report.make} {report.model}
                      </div>
                      {report.trim && (
                        <div className="text-sm text-gray">{report.trim}</div>
                      )}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-gray">
                    {report.ownerName || "—"}
                  </td>
                  <td className="px-4 py-3">
                    {report.suggestedPrice ? (
                      <span className="font-medium text-gold">
                        {formatPrice(report.suggestedPrice)}
                      </span>
                    ) : (
                      <span className="text-gray">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray">
                    {report._count.comps}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block text-xs px-2 py-0.5 rounded-full ${
                        statusColors[report.status] || statusColors.draft
                      }`}
                    >
                      {statusLabels[report.status] || report.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray text-sm">
                    {formatDate(report.createdAt)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/reports/${report.slug}`}
                        target="_blank"
                        className="text-gray hover:text-gold transition-colors"
                        title="View public page"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      </Link>
                      <Link
                        href={`/admin/reports/${report.id}`}
                        className="text-gray hover:text-gold transition-colors"
                        title="Edit"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                      </Link>
                      <button
                        onClick={() => deleteReport(report.id)}
                        className="text-gray hover:text-red-500 transition-colors"
                        title="Delete"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
