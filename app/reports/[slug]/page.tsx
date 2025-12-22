import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

async function getReport(slug: string) {
  const report = await prisma.priceReport.findUnique({
    where: { slug },
    include: {
      comps: {
        orderBy: { price: "desc" },
      },
      vehicle: {
        include: {
          images: {
            orderBy: [{ isPrimary: "desc" }, { position: "asc" }],
            take: 1,
          },
        },
      },
    },
  });

  if (!report || report.status === "draft") return null;

  // Get subject image: prefer custom URL, then linked vehicle's image
  const subjectImageUrl =
    report.subjectImageUrl || report.vehicle?.images?.[0]?.url || null;

  return {
    ...report,
    subjectImageUrl,
    suggestedPrice: report.suggestedPrice ? Number(report.suggestedPrice) : null,
    priceRangeLow: report.priceRangeLow ? Number(report.priceRangeLow) : null,
    priceRangeHigh: report.priceRangeHigh ? Number(report.priceRangeHigh) : null,
    comps: report.comps.map((comp) => ({
      ...comp,
      price: Number(comp.price),
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

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const report = await getReport(slug);

  if (!report) {
    return { title: "Report Not Found | El Paseo Auto Group" };
  }

  const title = `${report.year} ${report.make} ${report.model} Market Analysis | El Paseo Auto Group`;

  return {
    title,
    description: `Market analysis and pricing report for ${report.year} ${report.make} ${report.model}${report.trim ? ` ${report.trim}` : ""}`,
  };
}

export default async function ReportPage({ params }: PageProps) {
  const { slug } = await params;
  const report = await getReport(slug);

  if (!report) {
    notFound();
  }

  const vehicleTitle = `${report.year} ${report.make} ${report.model}${report.trim ? ` ${report.trim}` : ""}`;

  // Calculate comp stats
  const compStats = report.comps.length
    ? {
        average:
          report.comps.reduce((sum, c) => sum + c.price, 0) /
          report.comps.length,
        low: Math.min(...report.comps.map((c) => c.price)),
        high: Math.max(...report.comps.map((c) => c.price)),
      }
    : null;

  return (
    <div className="bg-off-white min-h-screen">
      {/* Header */}
      <div className="bg-charcoal text-white py-12">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-gold text-sm uppercase tracking-wider mb-2">
              Market Analysis Report
            </p>
            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold mb-4">
              {vehicleTitle}
            </h1>
            <p className="text-white/60 text-sm">
              Prepared {formatDate(report.createdAt)}
            </p>
          </div>
        </div>
      </div>

      {/* Subject Vehicle Image */}
      {report.subjectImageUrl && (
        <div className="container mx-auto px-4 lg:px-8 -mt-6">
          <div className="max-w-4xl mx-auto">
            <div className="aspect-[16/9] rounded-sm overflow-hidden shadow-luxury">
              <img
                src={report.subjectImageUrl}
                alt={vehicleTitle}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 lg:px-8 py-8 md:py-12">
        <div className="max-w-4xl mx-auto">
          {/* Pricing Summary */}
          <div className="bg-white rounded-sm shadow-luxury p-6 md:p-8 mb-8">
            <h2 className="font-display text-xl text-charcoal font-semibold mb-6 text-center">
              Valuation Summary
            </h2>

            {report.suggestedPrice && (
              <div className="text-center mb-8">
                <p className="text-sm text-gray uppercase tracking-wider mb-2">
                  Suggested Market Value
                </p>
                <p className="font-display text-4xl md:text-5xl text-gold font-semibold">
                  {formatPrice(report.suggestedPrice)}
                </p>
                {report.priceRangeLow && report.priceRangeHigh && (
                  <p className="text-gray mt-2">
                    Range: {formatPrice(report.priceRangeLow)} –{" "}
                    {formatPrice(report.priceRangeHigh)}
                  </p>
                )}
              </div>
            )}

            {/* Vehicle Details */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-gray-light/20">
              {report.mileage && (
                <div className="text-center">
                  <p className="text-xs text-gray uppercase tracking-wider mb-1">
                    Mileage
                  </p>
                  <p className="font-semibold text-charcoal">
                    {formatMileage(report.mileage)}
                  </p>
                </div>
              )}
              {report.condition && (
                <div className="text-center">
                  <p className="text-xs text-gray uppercase tracking-wider mb-1">
                    Condition
                  </p>
                  <p className="font-semibold text-charcoal">
                    {report.condition}
                  </p>
                </div>
              )}
              {report.vin && (
                <div className="text-center col-span-2">
                  <p className="text-xs text-gray uppercase tracking-wider mb-1">
                    VIN
                  </p>
                  <p className="font-mono text-sm text-charcoal">{report.vin}</p>
                </div>
              )}
            </div>

            {report.notes && (
              <div className="mt-6 pt-6 border-t border-gray-light/20">
                <p className="text-xs text-gray uppercase tracking-wider mb-2">
                  Notes
                </p>
                <p className="text-gray leading-relaxed">{report.notes}</p>
              </div>
            )}
          </div>

          {/* Comparable Vehicles */}
          {report.comps.length > 0 && (
            <div className="bg-white rounded-sm shadow-luxury p-6 md:p-8 mb-8">
              <h2 className="font-display text-xl text-charcoal font-semibold mb-6">
                Comparable Vehicles ({report.comps.length})
              </h2>

              {/* Comp Stats */}
              {compStats && (
                <div className="grid grid-cols-3 gap-4 p-4 bg-off-white rounded-sm mb-6">
                  <div className="text-center">
                    <p className="text-xs text-gray uppercase tracking-wider mb-1">
                      Low
                    </p>
                    <p className="font-semibold text-charcoal">
                      {formatPrice(compStats.low)}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray uppercase tracking-wider mb-1">
                      Average
                    </p>
                    <p className="font-semibold text-gold">
                      {formatPrice(compStats.average)}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray uppercase tracking-wider mb-1">
                      High
                    </p>
                    <p className="font-semibold text-charcoal">
                      {formatPrice(compStats.high)}
                    </p>
                  </div>
                </div>
              )}

              {/* Comps Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {report.comps.map((comp) => (
                  <div
                    key={comp.id}
                    className="border border-gray-light/20 rounded-sm overflow-hidden"
                  >
                    {comp.imageUrl && (
                      <div className="aspect-[16/10] bg-gray-light/10 relative">
                        <img
                          src={comp.imageUrl}
                          alt={`${comp.year} ${comp.make} ${comp.model}`}
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h4 className="font-medium text-charcoal">
                            {comp.year} {comp.make} {comp.model}
                          </h4>
                          {comp.trim && (
                            <p className="text-sm text-gray">{comp.trim}</p>
                          )}
                        </div>
                        <p className="font-semibold text-gold whitespace-nowrap">
                          {formatPrice(comp.price)}
                        </p>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray">
                        {comp.mileage && (
                          <span>{formatMileage(comp.mileage)} mi</span>
                        )}
                        {comp.source && (
                          <>
                            {comp.sourceUrl ? (
                              <a
                                href={comp.sourceUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gold hover:underline"
                              >
                                {comp.source}
                              </a>
                            ) : (
                              <span>{comp.source}</span>
                            )}
                          </>
                        )}
                      </div>
                      {comp.notes && (
                        <p className="mt-2 text-sm text-gray/70">{comp.notes}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Download PDF */}
          <div className="flex justify-center mb-8">
            <a
              href={`/api/reports/slug/${report.slug}/pdf`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white rounded-sm shadow-luxury text-charcoal font-medium hover:bg-off-white transition-colors"
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
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Download PDF Report
            </a>
          </div>

          {/* CTA */}
          <div className="bg-charcoal rounded-sm p-6 md:p-8 text-center">
            <h2 className="font-display text-xl text-white font-semibold mb-3">
              Ready to Consign Your Vehicle?
            </h2>
            <p className="text-white/70 mb-6 max-w-lg mx-auto">
              El Paseo Auto Group offers premium consignment services with
              competitive terms and professional marketing to qualified buyers.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/contact?type=consignment"
                className="inline-block px-6 py-3 bg-gold text-black font-medium rounded-sm hover:bg-gold-dark transition-colors"
              >
                Start Consignment
              </Link>
              <a
                href="tel:+17606360885"
                className="inline-block px-6 py-3 border border-white/30 text-white font-medium rounded-sm hover:bg-white/10 transition-colors"
              >
                Call (760) 636-0885
              </a>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-8 text-sm text-gray">
            <p>
              This report is prepared by El Paseo Auto Group for informational
              purposes only.
            </p>
            <p className="mt-1">
              Market values may vary based on condition, location, and market
              conditions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
