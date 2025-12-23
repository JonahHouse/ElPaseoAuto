"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface PriceComp {
  id: number;
  year: number;
  make: string;
  model: string;
  trim: string | null;
  mileage: number | null;
  price: number;
  source: string | null;
  sourceUrl: string | null;
  imageUrl: string | null;
  notes: string | null;
}

interface SearchResult {
  vin: string;
  year: number;
  make: string;
  model: string;
  trim: string | null;
  mileage: number | null;
  price: number;
  source: string;
  sourceUrl: string;
  imageUrl: string | null;
  location: string;
  drivetrain: string | null;
  exteriorColor: string | null;
  cpo: boolean;
  accidents: boolean | null;
  ownerCount: number | null;
  carfaxUrl: string | null;
}

interface PriceReport {
  id: number;
  slug: string;
  year: number;
  make: string;
  model: string;
  trim: string | null;
  vin: string | null;
  mileage: number | null;
  condition: string | null;
  notes: string | null;
  ownerName: string | null;
  ownerEmail: string | null;
  ownerPhone: string | null;
  suggestedPrice: number | null;
  priceRangeLow: number | null;
  priceRangeHigh: number | null;
  status: string;
  comps: PriceComp[];
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

export default function EditReportPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [report, setReport] = useState<PriceReport | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    year: "",
    make: "",
    model: "",
    trim: "",
    vin: "",
    mileage: "",
    condition: "",
    notes: "",
    ownerName: "",
    ownerEmail: "",
    ownerPhone: "",
    suggestedPrice: "",
    priceRangeLow: "",
    priceRangeHigh: "",
    status: "draft",
  });

  // New comp form
  const [newComp, setNewComp] = useState({
    year: "",
    make: "",
    model: "",
    trim: "",
    mileage: "",
    price: "",
    source: "",
    sourceUrl: "",
    imageUrl: "",
    notes: "",
  });
  const [showCompForm, setShowCompForm] = useState(false);

  // Search state
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [selectedVins, setSelectedVins] = useState<Set<string>>(new Set());
  const [isAddingSelected, setIsAddingSelected] = useState(false);
  const [yearRange, setYearRange] = useState({ min: 0, max: 0 });
  const [availableTrims, setAvailableTrims] = useState<string[]>([]);
  const [selectedTrim, setSelectedTrim] = useState<string>("");

  useEffect(() => {
    fetchReport();
  }, [id]);

  const fetchReport = async () => {
    setIsLoading(true);
    const response = await fetch(`/api/reports/${id}`);
    if (response.ok) {
      const data = await response.json();
      setReport(data);
      setFormData({
        year: data.year?.toString() || "",
        make: data.make || "",
        model: data.model || "",
        trim: data.trim || "",
        vin: data.vin || "",
        mileage: data.mileage?.toString() || "",
        condition: data.condition || "",
        notes: data.notes || "",
        ownerName: data.ownerName || "",
        ownerEmail: data.ownerEmail || "",
        ownerPhone: data.ownerPhone || "",
        suggestedPrice: data.suggestedPrice?.toString() || "",
        priceRangeLow: data.priceRangeLow?.toString() || "",
        priceRangeHigh: data.priceRangeHigh?.toString() || "",
        status: data.status || "draft",
      });
    }
    setIsLoading(false);
  };

  const handleSave = async () => {
    setIsSaving(true);
    const response = await fetch(`/api/reports/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        year: parseInt(formData.year),
        make: formData.make,
        model: formData.model,
        trim: formData.trim || null,
        vin: formData.vin || null,
        mileage: formData.mileage ? parseInt(formData.mileage) : null,
        condition: formData.condition || null,
        notes: formData.notes || null,
        ownerName: formData.ownerName || null,
        ownerEmail: formData.ownerEmail || null,
        ownerPhone: formData.ownerPhone || null,
        suggestedPrice: formData.suggestedPrice
          ? parseFloat(formData.suggestedPrice)
          : null,
        priceRangeLow: formData.priceRangeLow
          ? parseFloat(formData.priceRangeLow)
          : null,
        priceRangeHigh: formData.priceRangeHigh
          ? parseFloat(formData.priceRangeHigh)
          : null,
        status: formData.status,
      }),
    });
    if (response.ok) {
      await fetchReport();
    }
    setIsSaving(false);
  };

  const addComp = async () => {
    if (!newComp.year || !newComp.make || !newComp.model || !newComp.price) {
      alert("Please fill in year, make, model, and price for the comp");
      return;
    }

    const response = await fetch(`/api/reports/${id}/comps`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        year: parseInt(newComp.year),
        make: newComp.make,
        model: newComp.model,
        trim: newComp.trim || null,
        mileage: newComp.mileage ? parseInt(newComp.mileage) : null,
        price: parseFloat(newComp.price),
        source: newComp.source || null,
        sourceUrl: newComp.sourceUrl || null,
        imageUrl: newComp.imageUrl || null,
        notes: newComp.notes || null,
      }),
    });

    if (response.ok) {
      setNewComp({
        year: "",
        make: "",
        model: "",
        trim: "",
        mileage: "",
        price: "",
        source: "",
        sourceUrl: "",
        imageUrl: "",
        notes: "",
      });
      setShowCompForm(false);
      await fetchReport();
    }
  };

  const deleteComp = async (compId: number) => {
    if (!confirm("Delete this comp?")) return;
    await fetch(`/api/reports/${id}/comps?compId=${compId}`, {
      method: "DELETE",
    });
    await fetchReport();
  };

  const prefillCompFromReport = () => {
    setNewComp({
      ...newComp,
      year: formData.year,
      make: formData.make,
      model: formData.model,
      trim: formData.trim,
    });
  };

  const searchListings = async (customYearRange?: { min: number; max: number }) => {
    if (!formData.year || !formData.make || !formData.model) {
      alert("Please fill in year, make, and model first");
      return;
    }

    const baseYear = parseInt(formData.year);
    const range = customYearRange || yearRange;

    // Initialize year range if not set (default to exact year match)
    if (range.min === 0 && range.max === 0) {
      const newRange = { min: baseYear, max: baseYear };
      setYearRange(newRange);
      return searchListings(newRange);
    }

    setIsSearching(true);
    setSearchError(null);
    setShowSearchModal(true);
    setSelectedVins(new Set());

    try {
      const params = new URLSearchParams({
        minYear: range.min.toString(),
        maxYear: range.max.toString(),
        make: formData.make,
        model: formData.model,
      });
      if (formData.trim) {
        params.set("trim", formData.trim);
      }

      const response = await fetch(`/api/comps/search?${params.toString()}`);
      const data = await response.json();

      if (!response.ok) {
        setSearchError(data.error || "Failed to search listings");
        setSearchResults([]);
        setAvailableTrims([]);
      } else {
        const results = data.results || [];
        setSearchResults(results);
        // Extract unique trims from results
        const trims = [...new Set(results.map((r: SearchResult) => r.trim).filter(Boolean))] as string[];
        trims.sort();
        setAvailableTrims(trims);
        setSelectedTrim(""); // Reset trim filter
      }
    } catch (error) {
      setSearchError("Failed to search listings");
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const toggleVinSelection = (vin: string) => {
    setSelectedVins((prev) => {
      const next = new Set(prev);
      if (next.has(vin)) {
        next.delete(vin);
      } else {
        next.add(vin);
      }
      return next;
    });
  };

  const addSelectedResults = async () => {
    if (selectedVins.size === 0) return;

    setIsAddingSelected(true);
    const selectedResults = searchResults.filter((r) => selectedVins.has(r.vin));

    for (const result of selectedResults) {
      // Build notes with location and history info
      const noteParts: string[] = [];
      if (result.location) noteParts.push(result.location);
      if (result.cpo) noteParts.push("CPO");
      if (result.accidents === true) noteParts.push("Accident reported");
      if (result.accidents === false) noteParts.push("Clean history");
      if (result.ownerCount !== null)
        noteParts.push(`${result.ownerCount} owner${result.ownerCount !== 1 ? "s" : ""}`);

      await fetch(`/api/reports/${id}/comps`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          year: result.year,
          make: result.make,
          model: result.model,
          trim: result.trim || null,
          mileage: result.mileage || null,
          price: result.price,
          source: result.source || null,
          sourceUrl: result.sourceUrl || null,
          imageUrl: result.imageUrl || null,
          notes: noteParts.length > 0 ? noteParts.join(" • ") : null,
        }),
      });
    }

    setSelectedVins(new Set());
    setShowSearchModal(false);
    setIsAddingSelected(false);
    await fetchReport();
  };

  // Calculate comp stats
  const compStats = report?.comps.length
    ? {
        average:
          report.comps.reduce((sum, c) => sum + c.price, 0) /
          report.comps.length,
        low: Math.min(...report.comps.map((c) => c.price)),
        high: Math.max(...report.comps.map((c) => c.price)),
      }
    : null;

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="text-center text-gray py-12">Loading...</div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="p-6">
        <div className="text-center text-gray py-12">Report not found</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/reports"
            className="text-gray hover:text-gold transition-colors"
          >
            ← Back
          </Link>
          <h1 className="text-2xl font-display font-semibold text-charcoal">
            Edit Report
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <a
            href={`/api/reports/${id}/pdf`}
            className="px-4 py-2 border border-gray-light rounded-sm hover:bg-off-white transition-colors"
          >
            Download PDF
          </a>
          <Link
            href={`/reports/${report.slug}`}
            target="_blank"
            className="px-4 py-2 border border-gray-light rounded-sm hover:bg-off-white transition-colors"
          >
            View Public Page
          </Link>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-4 py-2 bg-gold text-black font-medium rounded-sm hover:bg-gold-dark transition-colors disabled:opacity-50"
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Vehicle Info */}
          <div className="bg-white rounded-sm shadow-luxury p-6">
            <h3 className="font-display text-lg font-semibold text-charcoal mb-4">
              Subject Vehicle
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs text-gray uppercase tracking-wide mb-1">
                  Year *
                </label>
                <input
                  type="number"
                  value={formData.year}
                  onChange={(e) =>
                    setFormData({ ...formData, year: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-light rounded-sm focus:outline-none focus:ring-2 focus:ring-gold"
                />
              </div>
              <div>
                <label className="block text-xs text-gray uppercase tracking-wide mb-1">
                  Make *
                </label>
                <input
                  type="text"
                  value={formData.make}
                  onChange={(e) =>
                    setFormData({ ...formData, make: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-light rounded-sm focus:outline-none focus:ring-2 focus:ring-gold"
                />
              </div>
              <div>
                <label className="block text-xs text-gray uppercase tracking-wide mb-1">
                  Model *
                </label>
                <input
                  type="text"
                  value={formData.model}
                  onChange={(e) =>
                    setFormData({ ...formData, model: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-light rounded-sm focus:outline-none focus:ring-2 focus:ring-gold"
                />
              </div>
              <div>
                <label className="block text-xs text-gray uppercase tracking-wide mb-1">
                  Trim
                </label>
                <input
                  type="text"
                  value={formData.trim}
                  onChange={(e) =>
                    setFormData({ ...formData, trim: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-light rounded-sm focus:outline-none focus:ring-2 focus:ring-gold"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
              <div>
                <label className="block text-xs text-gray uppercase tracking-wide mb-1">
                  VIN
                </label>
                <input
                  type="text"
                  value={formData.vin}
                  onChange={(e) =>
                    setFormData({ ...formData, vin: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-light rounded-sm focus:outline-none focus:ring-2 focus:ring-gold"
                />
              </div>
              <div>
                <label className="block text-xs text-gray uppercase tracking-wide mb-1">
                  Mileage
                </label>
                <input
                  type="number"
                  value={formData.mileage}
                  onChange={(e) =>
                    setFormData({ ...formData, mileage: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-light rounded-sm focus:outline-none focus:ring-2 focus:ring-gold"
                />
              </div>
              <div>
                <label className="block text-xs text-gray uppercase tracking-wide mb-1">
                  Condition
                </label>
                <select
                  value={formData.condition}
                  onChange={(e) =>
                    setFormData({ ...formData, condition: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-light rounded-sm focus:outline-none focus:ring-2 focus:ring-gold"
                >
                  <option value="">Select...</option>
                  <option value="Excellent">Excellent</option>
                  <option value="Very Good">Very Good</option>
                  <option value="Good">Good</option>
                  <option value="Fair">Fair</option>
                </select>
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-xs text-gray uppercase tracking-wide mb-1">
                Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                rows={3}
                className="w-full px-3 py-2 border border-gray-light rounded-sm focus:outline-none focus:ring-2 focus:ring-gold"
              />
            </div>
          </div>

          {/* Comps Section */}
          <div className="bg-white rounded-sm shadow-luxury p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-lg font-semibold text-charcoal">
                Comparable Vehicles ({report.comps.length})
              </h3>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => searchListings()}
                  className="text-sm px-3 py-1 bg-charcoal text-white rounded-sm hover:bg-charcoal/90"
                >
                  Search Listings
                </button>
                <button
                  onClick={() => {
                    prefillCompFromReport();
                    setShowCompForm(true);
                  }}
                  className="text-sm text-gold hover:underline"
                >
                  + Add Manually
                </button>
              </div>
            </div>

            {/* Comp Stats */}
            {compStats && (
              <div className="grid grid-cols-3 gap-4 p-4 bg-off-white rounded-sm mb-4">
                <div className="text-center">
                  <div className="text-xs text-gray uppercase tracking-wide">
                    Low
                  </div>
                  <div className="text-lg font-semibold text-charcoal">
                    {formatPrice(compStats.low)}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-gray uppercase tracking-wide">
                    Average
                  </div>
                  <div className="text-lg font-semibold text-gold">
                    {formatPrice(compStats.average)}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-gray uppercase tracking-wide">
                    High
                  </div>
                  <div className="text-lg font-semibold text-charcoal">
                    {formatPrice(compStats.high)}
                  </div>
                </div>
              </div>
            )}

            {/* Add Comp Form */}
            {showCompForm && (
              <div className="border border-gray-light rounded-sm p-4 mb-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                  <div>
                    <label className="block text-xs text-gray mb-1">
                      Year *
                    </label>
                    <input
                      type="number"
                      value={newComp.year}
                      onChange={(e) =>
                        setNewComp({ ...newComp, year: e.target.value })
                      }
                      className="w-full px-2 py-1.5 text-sm border border-gray-light rounded-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray mb-1">
                      Make *
                    </label>
                    <input
                      type="text"
                      value={newComp.make}
                      onChange={(e) =>
                        setNewComp({ ...newComp, make: e.target.value })
                      }
                      className="w-full px-2 py-1.5 text-sm border border-gray-light rounded-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray mb-1">
                      Model *
                    </label>
                    <input
                      type="text"
                      value={newComp.model}
                      onChange={(e) =>
                        setNewComp({ ...newComp, model: e.target.value })
                      }
                      className="w-full px-2 py-1.5 text-sm border border-gray-light rounded-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray mb-1">Trim</label>
                    <input
                      type="text"
                      value={newComp.trim}
                      onChange={(e) =>
                        setNewComp({ ...newComp, trim: e.target.value })
                      }
                      className="w-full px-2 py-1.5 text-sm border border-gray-light rounded-sm"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                  <div>
                    <label className="block text-xs text-gray mb-1">
                      Price *
                    </label>
                    <input
                      type="number"
                      value={newComp.price}
                      onChange={(e) =>
                        setNewComp({ ...newComp, price: e.target.value })
                      }
                      className="w-full px-2 py-1.5 text-sm border border-gray-light rounded-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray mb-1">
                      Mileage
                    </label>
                    <input
                      type="number"
                      value={newComp.mileage}
                      onChange={(e) =>
                        setNewComp({ ...newComp, mileage: e.target.value })
                      }
                      className="w-full px-2 py-1.5 text-sm border border-gray-light rounded-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray mb-1">
                      Source
                    </label>
                    <input
                      type="text"
                      value={newComp.source}
                      onChange={(e) =>
                        setNewComp({ ...newComp, source: e.target.value })
                      }
                      placeholder="e.g., Cars.com"
                      className="w-full px-2 py-1.5 text-sm border border-gray-light rounded-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray mb-1">
                      Source URL
                    </label>
                    <input
                      type="url"
                      value={newComp.sourceUrl}
                      onChange={(e) =>
                        setNewComp({ ...newComp, sourceUrl: e.target.value })
                      }
                      className="w-full px-2 py-1.5 text-sm border border-gray-light rounded-sm"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                  <div>
                    <label className="block text-xs text-gray mb-1">
                      Image URL
                    </label>
                    <input
                      type="url"
                      value={newComp.imageUrl}
                      onChange={(e) =>
                        setNewComp({ ...newComp, imageUrl: e.target.value })
                      }
                      placeholder="https://..."
                      className="w-full px-2 py-1.5 text-sm border border-gray-light rounded-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray mb-1">Notes</label>
                    <input
                      type="text"
                      value={newComp.notes}
                      onChange={(e) =>
                        setNewComp({ ...newComp, notes: e.target.value })
                      }
                      className="w-full px-2 py-1.5 text-sm border border-gray-light rounded-sm"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={addComp}
                    className="px-3 py-1.5 text-sm bg-gold text-black rounded-sm hover:bg-gold-dark"
                  >
                    Add Comp
                  </button>
                  <button
                    onClick={() => setShowCompForm(false)}
                    className="px-3 py-1.5 text-sm border border-gray-light rounded-sm hover:bg-off-white"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Comps List */}
            {report.comps.length === 0 ? (
              <p className="text-gray text-sm">
                No comparable vehicles added yet.
              </p>
            ) : (
              <div className="space-y-2">
                {report.comps.map((comp) => (
                  <div
                    key={comp.id}
                    className="flex items-center justify-between p-3 bg-off-white rounded-sm"
                  >
                    <div className="flex-1">
                      <div className="font-medium text-charcoal">
                        {comp.year} {comp.make} {comp.model}
                        {comp.trim && (
                          <span className="text-gray"> {comp.trim}</span>
                        )}
                      </div>
                      <div className="text-sm text-gray">
                        {comp.mileage && (
                          <span>{formatMileage(comp.mileage)} mi • </span>
                        )}
                        {comp.source && <span>{comp.source}</span>}
                        {comp.notes && <span> • {comp.notes}</span>}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-semibold text-gold">
                        {formatPrice(comp.price)}
                      </span>
                      <button
                        onClick={() => deleteComp(comp.id)}
                        className="text-gray hover:text-red-500"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Pricing */}
          <div className="bg-white rounded-sm shadow-luxury p-6">
            <h3 className="font-display text-lg font-semibold text-charcoal mb-4">
              Pricing
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-gray uppercase tracking-wide mb-1">
                  Suggested Price
                </label>
                <input
                  type="number"
                  value={formData.suggestedPrice}
                  onChange={(e) =>
                    setFormData({ ...formData, suggestedPrice: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-light rounded-sm focus:outline-none focus:ring-2 focus:ring-gold"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray uppercase tracking-wide mb-1">
                    Range Low
                  </label>
                  <input
                    type="number"
                    value={formData.priceRangeLow}
                    onChange={(e) =>
                      setFormData({ ...formData, priceRangeLow: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-light rounded-sm focus:outline-none focus:ring-2 focus:ring-gold"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray uppercase tracking-wide mb-1">
                    Range High
                  </label>
                  <input
                    type="number"
                    value={formData.priceRangeHigh}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        priceRangeHigh: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-light rounded-sm focus:outline-none focus:ring-2 focus:ring-gold"
                  />
                </div>
              </div>
              {compStats && (
                <button
                  onClick={() =>
                    setFormData({
                      ...formData,
                      suggestedPrice: Math.round(compStats.average).toString(),
                      priceRangeLow: compStats.low.toString(),
                      priceRangeHigh: compStats.high.toString(),
                    })
                  }
                  className="w-full text-sm text-gold hover:underline"
                >
                  Use comp averages
                </button>
              )}
            </div>
          </div>

          {/* Owner Info */}
          <div className="bg-white rounded-sm shadow-luxury p-6">
            <h3 className="font-display text-lg font-semibold text-charcoal mb-4">
              Owner Info
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-gray uppercase tracking-wide mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={formData.ownerName}
                  onChange={(e) =>
                    setFormData({ ...formData, ownerName: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-light rounded-sm focus:outline-none focus:ring-2 focus:ring-gold"
                />
              </div>
              <div>
                <label className="block text-xs text-gray uppercase tracking-wide mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.ownerEmail}
                  onChange={(e) =>
                    setFormData({ ...formData, ownerEmail: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-light rounded-sm focus:outline-none focus:ring-2 focus:ring-gold"
                />
              </div>
              <div>
                <label className="block text-xs text-gray uppercase tracking-wide mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  value={formData.ownerPhone}
                  onChange={(e) =>
                    setFormData({ ...formData, ownerPhone: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-light rounded-sm focus:outline-none focus:ring-2 focus:ring-gold"
                />
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="bg-white rounded-sm shadow-luxury p-6">
            <h3 className="font-display text-lg font-semibold text-charcoal mb-4">
              Status
            </h3>
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-light rounded-sm focus:outline-none focus:ring-2 focus:ring-gold"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="sent">Sent</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>
      </div>

      {/* Search Modal */}
      {showSearchModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-sm shadow-luxury max-w-4xl w-full max-h-[80vh] overflow-hidden flex flex-col">
            <div className="p-4 border-b border-gray-light">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h2 className="font-display text-lg font-semibold text-charcoal">
                    Search Listings
                  </h2>
                  <p className="text-sm text-gray">
                    {formData.make} {formData.model}
                    {formData.trim && ` ${formData.trim}`}
                  </p>
                </div>
                <button
                  onClick={() => setShowSearchModal(false)}
                  className="text-gray hover:text-charcoal"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray">Years:</span>
                  <input
                    type="number"
                    value={yearRange.min}
                    onChange={(e) => setYearRange({ ...yearRange, min: parseInt(e.target.value) || 0 })}
                    className="w-20 px-2 py-1 text-sm border border-gray-light rounded-sm focus:outline-none focus:border-gold"
                  />
                  <span className="text-gray">–</span>
                  <input
                    type="number"
                    value={yearRange.max}
                    onChange={(e) => setYearRange({ ...yearRange, max: parseInt(e.target.value) || 0 })}
                    className="w-20 px-2 py-1 text-sm border border-gray-light rounded-sm focus:outline-none focus:border-gold"
                  />
                  <button
                    onClick={() => searchListings(yearRange)}
                    disabled={isSearching}
                    className="px-3 py-1 text-sm bg-gold text-black rounded-sm hover:bg-gold-dark disabled:opacity-50"
                  >
                    {isSearching ? "Searching..." : "Update"}
                  </button>
                </div>
                {availableTrims.length > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray">Trim:</span>
                    <select
                      value={selectedTrim}
                      onChange={(e) => setSelectedTrim(e.target.value)}
                      className="px-2 py-1 text-sm border border-gray-light rounded-sm focus:outline-none focus:border-gold"
                    >
                      <option value="">All Trims ({searchResults.length})</option>
                      {availableTrims.map((trim) => (
                        <option key={trim} value={trim}>
                          {trim} ({searchResults.filter((r) => r.trim === trim).length})
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {isSearching ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold mx-auto mb-4"></div>
                  <p className="text-gray">Searching listings...</p>
                </div>
              ) : searchError ? (
                <div className="text-center py-12">
                  <p className="text-red-500 mb-4">{searchError}</p>
                  <button
                    onClick={() => searchListings()}
                    className="text-gold hover:underline"
                  >
                    Try Again
                  </button>
                </div>
              ) : searchResults.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray">No listings found</p>
                </div>
              ) : (
                (() => {
                  const filteredResults = selectedTrim
                    ? searchResults.filter((r) => r.trim === selectedTrim)
                    : searchResults;
                  return (
                <div className="space-y-3">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm text-gray">
                      {selectedTrim
                        ? `Showing ${filteredResults.length} of ${searchResults.length} listings`
                        : `Found ${searchResults.length} listings`}
                    </p>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filteredResults.length > 0 && filteredResults.every((r) => selectedVins.has(r.vin))}
                        onChange={() => {
                          const allSelected = filteredResults.every((r) => selectedVins.has(r.vin));
                          if (allSelected) {
                            // Deselect all filtered results
                            setSelectedVins((prev) => {
                              const next = new Set(prev);
                              filteredResults.forEach((r) => next.delete(r.vin));
                              return next;
                            });
                          } else {
                            // Select all filtered results
                            setSelectedVins((prev) => {
                              const next = new Set(prev);
                              filteredResults.forEach((r) => next.add(r.vin));
                              return next;
                            });
                          }
                        }}
                        className="w-4 h-4 rounded border-gray-light text-gold focus:ring-gold"
                      />
                      <span className="text-sm text-gray">Select All{selectedTrim ? ` ${selectedTrim}` : ""}</span>
                    </label>
                  </div>
                  {filteredResults.map((result) => (
                    <label
                      key={result.vin}
                      className={`flex items-center gap-4 p-3 border rounded-sm cursor-pointer transition-colors ${
                        selectedVins.has(result.vin)
                          ? "border-gold bg-gold/5"
                          : "border-gray-light hover:bg-off-white"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedVins.has(result.vin)}
                        onChange={() => toggleVinSelection(result.vin)}
                        className="w-4 h-4 rounded border-gray-light text-gold focus:ring-gold flex-shrink-0"
                      />
                      <div className="w-24 h-16 flex-shrink-0 rounded-sm overflow-hidden bg-gray-100 relative">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-gray-400 text-xs">No image</span>
                        </div>
                        {result.imageUrl && (
                          <img
                            src={result.imageUrl}
                            alt={`${result.year} ${result.make} ${result.model}`}
                            className="absolute inset-0 w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                            }}
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-charcoal flex items-center gap-2">
                          <span>
                            {result.year} {result.make} {result.model}
                            {result.trim && (
                              <span className="text-gray"> {result.trim}</span>
                            )}
                          </span>
                          {result.cpo && (
                            <span className="px-1.5 py-0.5 text-xs bg-blue-100 text-blue-700 rounded">
                              CPO
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray">
                          {result.mileage && (
                            <span>{formatMileage(result.mileage)} mi</span>
                          )}
                          {result.mileage && result.location && (
                            <span> • </span>
                          )}
                          {result.location && <span>{result.location}</span>}
                          {result.drivetrain && (
                            <span> • {result.drivetrain}</span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          {result.sourceUrl && (
                            <a
                              href={result.sourceUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="text-blue-600 hover:underline flex items-center gap-1"
                            >
                              <span className="truncate max-w-[150px]">{result.source}</span>
                              <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                            </a>
                          )}
                          {!result.sourceUrl && (
                            <span className="text-gray/70 truncate">
                              {result.source}
                            </span>
                          )}
                          {result.accidents !== null && (
                            <span
                              className={`px-1.5 py-0.5 rounded ${
                                result.accidents
                                  ? "bg-red-100 text-red-700"
                                  : "bg-green-100 text-green-700"
                              }`}
                            >
                              {result.accidents ? "Accident" : "Clean"}
                            </span>
                          )}
                          {result.ownerCount !== null && (
                            <span className="text-gray/70">
                              {result.ownerCount} owner
                              {result.ownerCount !== 1 ? "s" : ""}
                            </span>
                          )}
                          {result.carfaxUrl && (
                            <a
                              href={result.carfaxUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="text-blue-600 hover:underline"
                            >
                              Carfax
                            </a>
                          )}
                        </div>
                      </div>
                      <span className="font-semibold text-gold text-lg flex-shrink-0">
                        {formatPrice(result.price)}
                      </span>
                    </label>
                  ))}
                </div>
                );
              })()
              )}
            </div>

            <div className="p-4 border-t border-gray-light flex justify-between items-center">
              <div className="text-sm text-gray">
                {selectedVins.size > 0 && (
                  <span>{selectedVins.size} selected</span>
                )}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowSearchModal(false);
                    setSelectedVins(new Set());
                  }}
                  className="px-4 py-2 border border-gray-light rounded-sm hover:bg-off-white"
                >
                  Cancel
                </button>
                {selectedVins.size > 0 && (
                  <button
                    onClick={addSelectedResults}
                    disabled={isAddingSelected}
                    className="px-4 py-2 bg-gold text-black font-medium rounded-sm hover:bg-gold-dark disabled:opacity-50"
                  >
                    {isAddingSelected
                      ? "Adding..."
                      : `Add Selected (${selectedVins.size})`}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
