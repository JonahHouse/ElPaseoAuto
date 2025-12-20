"use client";

import { useState } from "react";
import Link from "next/link";
import Badge from "@/components/ui/Badge";

interface Vehicle {
  id: number;
  vin: string;
  year: number;
  make: string;
  model: string;
  trim?: string | null;
  price?: number | null;
  isFeatured: boolean;
  isSold: boolean;
}

interface VehicleTableProps {
  vehicles: Vehicle[];
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);
}

export default function VehicleTable({ vehicles }: VehicleTableProps) {
  const [updating, setUpdating] = useState<string | null>(null);

  const toggleFeatured = async (vin: string, current: boolean) => {
    setUpdating(vin);
    try {
      await fetch(`/api/vehicles/${vin}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isFeatured: !current }),
      });
      window.location.reload();
    } catch (error) {
      console.error("Failed to update:", error);
    } finally {
      setUpdating(null);
    }
  };

  const toggleSold = async (vin: string, current: boolean) => {
    setUpdating(vin);
    try {
      await fetch(`/api/vehicles/${vin}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isSold: !current }),
      });
      window.location.reload();
    } catch (error) {
      console.error("Failed to update:", error);
    } finally {
      setUpdating(null);
    }
  };

  if (vehicles.length === 0) {
    return (
      <div className="bg-white rounded-sm shadow-luxury p-6 text-center">
        <p className="text-gray py-8">No vehicles in inventory</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-sm shadow-luxury overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-off-white">
            <tr>
              <th className="text-left py-4 px-4 text-gray font-medium">Vehicle</th>
              <th className="text-left py-4 px-4 text-gray font-medium">VIN</th>
              <th className="text-right py-4 px-4 text-gray font-medium">Price</th>
              <th className="text-center py-4 px-4 text-gray font-medium">Status</th>
              <th className="text-center py-4 px-4 text-gray font-medium">Featured</th>
              <th className="text-right py-4 px-4 text-gray font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {vehicles.map((vehicle) => (
              <tr
                key={vehicle.id}
                className={`border-b border-gray-light/10 ${
                  vehicle.isSold ? "opacity-50" : ""
                }`}
              >
                <td className="py-4 px-4">
                  <Link
                    href={`/inventory/${vehicle.vin}`}
                    className="font-medium text-charcoal hover:text-gold transition-colors"
                  >
                    {vehicle.year} {vehicle.make} {vehicle.model}
                  </Link>
                  {vehicle.trim && (
                    <span className="text-gray ml-1">{vehicle.trim}</span>
                  )}
                </td>
                <td className="py-4 px-4 text-gray font-mono text-xs">
                  {vehicle.vin}
                </td>
                <td className="py-4 px-4 text-right text-charcoal font-medium">
                  {vehicle.price ? formatPrice(vehicle.price) : "—"}
                </td>
                <td className="py-4 px-4 text-center">
                  <Badge variant={vehicle.isSold ? "error" : "success"}>
                    {vehicle.isSold ? "Sold" : "Available"}
                  </Badge>
                </td>
                <td className="py-4 px-4 text-center">
                  <button
                    onClick={() => toggleFeatured(vehicle.vin, vehicle.isFeatured)}
                    disabled={updating === vehicle.vin}
                    className={`
                      w-6 h-6 rounded-full border-2 transition-colors
                      ${
                        vehicle.isFeatured
                          ? "bg-gold border-gold"
                          : "border-gray-light hover:border-gold"
                      }
                      ${updating === vehicle.vin ? "opacity-50" : ""}
                    `}
                    title={vehicle.isFeatured ? "Remove from featured" : "Add to featured"}
                  >
                    {vehicle.isFeatured && (
                      <svg
                        className="w-4 h-4 text-black mx-auto"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </button>
                </td>
                <td className="py-4 px-4 text-right">
                  <button
                    onClick={() => toggleSold(vehicle.vin, vehicle.isSold)}
                    disabled={updating === vehicle.vin}
                    className="text-sm text-gray hover:text-gold transition-colors"
                  >
                    {vehicle.isSold ? "Mark Available" : "Mark Sold"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
