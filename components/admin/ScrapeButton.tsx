"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";

interface ScrapeStats {
  found: number;
  added: number;
  updated: number;
  removed: number;
}

export default function ScrapeButton() {
  const [isRunning, setIsRunning] = useState(false);
  const [status, setStatus] = useState<"idle" | "running" | "success" | "error">("idle");
  const [stats, setStats] = useState<ScrapeStats | null>(null);
  const [error, setError] = useState<string | null>(null);

  const runScrape = async () => {
    setIsRunning(true);
    setStatus("running");
    setError(null);
    setStats(null);

    try {
      const response = await fetch("/api/scrape", {
        method: "POST",
        credentials: "include",
      });

      const data = await response.json();

      if (data.success) {
        setStatus("success");
        setStats(data.stats);
      } else {
        setStatus("error");
        setError(data.message || "Scrape failed");
      }
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Network error");
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="bg-white rounded-sm shadow-luxury p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-display text-lg text-charcoal font-semibold">
            Inventory Sync
          </h3>
          <p className="text-gray text-sm">
            Fetch latest inventory from source site
          </p>
        </div>
        <Button onClick={runScrape} isLoading={isRunning} disabled={isRunning}>
          {isRunning ? "Running..." : "Run Scrape"}
        </Button>
      </div>

      {status === "running" && (
        <div className="bg-blue-50 text-blue-700 px-4 py-3 rounded-sm">
          <div className="flex items-center gap-2">
            <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            <span>Scraping inventory... This may take a few minutes.</span>
          </div>
        </div>
      )}

      {status === "success" && stats && (
        <div className="bg-green-50 text-green-700 px-4 py-3 rounded-sm">
          <p className="font-medium mb-2">Scrape completed successfully!</p>
          <div className="grid grid-cols-4 gap-4 text-sm">
            <div>
              <span className="font-bold text-lg">{stats.found}</span>
              <br />
              Found
            </div>
            <div>
              <span className="font-bold text-lg">{stats.added}</span>
              <br />
              Added
            </div>
            <div>
              <span className="font-bold text-lg">{stats.updated}</span>
              <br />
              Updated
            </div>
            <div>
              <span className="font-bold text-lg">{stats.removed}</span>
              <br />
              Marked Sold
            </div>
          </div>
        </div>
      )}

      {status === "error" && (
        <div className="bg-red-50 text-red-700 px-4 py-3 rounded-sm">
          <p className="font-medium">Scrape failed</p>
          {error && <p className="text-sm mt-1">{error}</p>}
        </div>
      )}
    </div>
  );
}
