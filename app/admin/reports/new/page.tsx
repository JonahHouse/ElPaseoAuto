"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Vehicle {
  id: number;
  vin: string;
  year: number;
  make: string;
  model: string;
  trim: string | null;
  mileage: number | null;
}

export default function NewReportPage() {
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoadingVehicles, setIsLoadingVehicles] = useState(true);
  const [selectedVehicleId, setSelectedVehicleId] = useState<number | null>(null);
  const [mode, setMode] = useState<"select" | "manual">("select");

  const [formData, setFormData] = useState({
    year: new Date().getFullYear().toString(),
    make: "",
    model: "",
    trim: "",
    vin: "",
    mileage: "",
  });

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    setIsLoadingVehicles(true);
    const response = await fetch("/api/vehicles?limit=100");
    if (response.ok) {
      const data = await response.json();
      setVehicles(data.vehicles || []);
    }
    setIsLoadingVehicles(false);
  };

  const handleVehicleSelect = (vehicleId: number) => {
    const vehicle = vehicles.find((v) => v.id === vehicleId);
    if (vehicle) {
      setSelectedVehicleId(vehicleId);
      setFormData({
        year: vehicle.year.toString(),
        make: vehicle.make,
        model: vehicle.model,
        trim: vehicle.trim || "",
        vin: vehicle.vin,
        mileage: vehicle.mileage?.toString() || "",
      });
    }
  };

  const handleCreate = async () => {
    if (!formData.year || !formData.make || !formData.model) {
      alert("Please fill in year, make, and model");
      return;
    }

    setIsCreating(true);
    const response = await fetch("/api/reports", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        vehicleId: selectedVehicleId,
        year: parseInt(formData.year),
        make: formData.make,
        model: formData.model,
        trim: formData.trim || null,
        vin: formData.vin || null,
        mileage: formData.mileage ? parseInt(formData.mileage) : null,
        status: "draft",
      }),
    });

    if (response.ok) {
      const report = await response.json();
      router.push(`/admin/reports/${report.id}`);
    } else {
      setIsCreating(false);
      alert("Failed to create report");
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/admin/reports"
          className="text-gray hover:text-gold transition-colors"
        >
          ← Back
        </Link>
        <h1 className="text-2xl font-display font-semibold text-charcoal">
          New Price Report
        </h1>
      </div>

      <div className="max-w-2xl">
        {/* Mode Toggle */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => {
              setMode("select");
              setSelectedVehicleId(null);
              setFormData({
                year: new Date().getFullYear().toString(),
                make: "",
                model: "",
                trim: "",
                vin: "",
                mileage: "",
              });
            }}
            className={`px-4 py-2 rounded-sm font-medium transition-colors ${
              mode === "select"
                ? "bg-gold text-black"
                : "bg-off-white text-gray hover:text-charcoal"
            }`}
          >
            Select from Inventory
          </button>
          <button
            onClick={() => {
              setMode("manual");
              setSelectedVehicleId(null);
            }}
            className={`px-4 py-2 rounded-sm font-medium transition-colors ${
              mode === "manual"
                ? "bg-gold text-black"
                : "bg-off-white text-gray hover:text-charcoal"
            }`}
          >
            Enter Manually
          </button>
        </div>

        <div className="bg-white rounded-sm shadow-luxury p-6">
          {mode === "select" ? (
            <>
              <p className="text-gray mb-4">
                Select a vehicle from your inventory to create a price report.
              </p>

              {isLoadingVehicles ? (
                <div className="text-center py-8 text-gray">
                  Loading vehicles...
                </div>
              ) : vehicles.length === 0 ? (
                <div className="text-center py-8 text-gray">
                  <p className="mb-4">No vehicles in inventory.</p>
                  <button
                    onClick={() => setMode("manual")}
                    className="text-gold hover:underline"
                  >
                    Enter vehicle details manually →
                  </button>
                </div>
              ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto mb-6">
                  {vehicles.map((vehicle) => (
                    <button
                      key={vehicle.id}
                      onClick={() => handleVehicleSelect(vehicle.id)}
                      className={`w-full text-left p-4 rounded-sm border transition-colors ${
                        selectedVehicleId === vehicle.id
                          ? "border-gold bg-gold/5"
                          : "border-gray-light/30 hover:border-gold/50 hover:bg-off-white"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-charcoal">
                            {vehicle.year} {vehicle.make} {vehicle.model}
                            {vehicle.trim && (
                              <span className="text-gray"> {vehicle.trim}</span>
                            )}
                          </div>
                          <div className="text-sm text-gray">
                            VIN: {vehicle.vin}
                            {vehicle.mileage && (
                              <span>
                                {" "}
                                •{" "}
                                {new Intl.NumberFormat("en-US").format(
                                  vehicle.mileage
                                )}{" "}
                                mi
                              </span>
                            )}
                          </div>
                        </div>
                        {selectedVehicleId === vehicle.id && (
                          <svg
                            className="w-5 h-5 text-gold"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </>
          ) : (
            <>
              <p className="text-gray mb-6">
                Enter the vehicle details for the price report.
              </p>

              <div className="grid grid-cols-2 gap-4 mb-6">
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
                    placeholder="e.g., Porsche"
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
                    placeholder="e.g., 911"
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
                    placeholder="e.g., Carrera S"
                    className="w-full px-3 py-2 border border-gray-light rounded-sm focus:outline-none focus:ring-2 focus:ring-gold"
                  />
                </div>
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
              </div>
            </>
          )}

          <button
            onClick={handleCreate}
            disabled={
              isCreating ||
              (mode === "select" && !selectedVehicleId) ||
              (mode === "manual" &&
                (!formData.year || !formData.make || !formData.model))
            }
            className="w-full px-4 py-2 bg-gold text-black font-medium rounded-sm hover:bg-gold-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isCreating ? "Creating..." : "Create Report"}
          </button>
        </div>
      </div>
    </div>
  );
}
