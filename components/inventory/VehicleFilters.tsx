"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Input, { Select } from "@/components/ui/Input";
import Button from "@/components/ui/Button";

interface FilterOptions {
  makes: string[];
  bodyStyles: string[];
}

interface VehicleFiltersProps {
  options: FilterOptions;
}

export default function VehicleFilters({ options }: VehicleFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentMake = searchParams.get("make") || "";
  const currentBodyStyle = searchParams.get("bodyStyle") || "";
  const currentMinYear = searchParams.get("minYear") || "";
  const currentMaxYear = searchParams.get("maxYear") || "";
  const currentMinPrice = searchParams.get("minPrice") || "";
  const currentMaxPrice = searchParams.get("maxPrice") || "";
  const currentSort = searchParams.get("sort") || "newest";

  const [minYear, setMinYear] = useState(currentMinYear);
  const [maxYear, setMaxYear] = useState(currentMaxYear);

  const updateFilters = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/inventory?${params.toString()}`);
  };

  const clearFilters = () => {
    setMinYear("");
    setMaxYear("");
    router.push("/inventory");
  };

  const hasFilters =
    currentMake ||
    currentBodyStyle ||
    currentMinYear ||
    currentMaxYear ||
    currentMinPrice ||
    currentMaxPrice;

  return (
    <div className="bg-white p-6 rounded-sm shadow-luxury">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-display text-lg font-semibold text-charcoal">
          Filters
        </h3>
        {hasFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-gold hover:text-gold-dark transition-colors"
          >
            Clear All
          </button>
        )}
      </div>

      <div className="space-y-5">
        {/* Make */}
        <Select
          label="Make"
          value={currentMake}
          onChange={(e) => updateFilters("make", e.target.value)}
        >
          <option value="">All Makes</option>
          {options.makes.map((make) => (
            <option key={make} value={make}>
              {make}
            </option>
          ))}
        </Select>

        {/* Body Style */}
        <Select
          label="Body Style"
          value={currentBodyStyle}
          onChange={(e) => updateFilters("bodyStyle", e.target.value)}
        >
          <option value="">All Styles</option>
          {options.bodyStyles.map((style) => (
            <option key={style} value={style}>
              {style}
            </option>
          ))}
        </Select>

        {/* Year Range */}
        <div>
          <label className="block text-sm font-medium text-charcoal mb-2">
            Year
          </label>
          <div className="grid grid-cols-2 gap-3">
            <Input
              type="number"
              placeholder="Min"
              value={minYear}
              onChange={(e) => setMinYear(e.target.value)}
              onBlur={() => updateFilters("minYear", minYear)}
              onKeyDown={(e) => e.key === "Enter" && updateFilters("minYear", minYear)}
            />
            <Input
              type="number"
              placeholder="Max"
              value={maxYear}
              onChange={(e) => setMaxYear(e.target.value)}
              onBlur={() => updateFilters("maxYear", maxYear)}
              onKeyDown={(e) => e.key === "Enter" && updateFilters("maxYear", maxYear)}
            />
          </div>
        </div>

        {/* Price Range */}
        <div>
          <label className="block text-sm font-medium text-charcoal mb-2">
            Price
          </label>
          <div className="grid grid-cols-2 gap-3">
            <Select
              value={currentMinPrice}
              onChange={(e) => updateFilters("minPrice", e.target.value)}
            >
              <option value="">Min</option>
              <option value="50000">$50,000</option>
              <option value="100000">$100,000</option>
              <option value="150000">$150,000</option>
              <option value="200000">$200,000</option>
              <option value="250000">$250,000</option>
            </Select>
            <Select
              value={currentMaxPrice}
              onChange={(e) => updateFilters("maxPrice", e.target.value)}
            >
              <option value="">Max</option>
              <option value="100000">$100,000</option>
              <option value="150000">$150,000</option>
              <option value="200000">$200,000</option>
              <option value="300000">$300,000</option>
              <option value="500000">$500,000</option>
            </Select>
          </div>
        </div>

        {/* Sort */}
        <Select
          label="Sort By"
          value={currentSort}
          onChange={(e) => updateFilters("sort", e.target.value)}
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="mileage-low">Mileage: Low to High</option>
          <option value="year-new">Year: Newest</option>
          <option value="year-old">Year: Oldest</option>
        </Select>
      </div>
    </div>
  );
}
