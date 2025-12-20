"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import Badge from "@/components/ui/Badge";

interface VehicleImage {
  url: string;
  isPrimary: boolean;
}

interface Vehicle {
  id: number;
  vin: string;
  year: number;
  make: string;
  model: string;
  trim?: string | null;
  price?: number | null;
  mileage?: number | null;
  exteriorColor?: string | null;
  images: VehicleImage[];
  isFeatured?: boolean;
  isSold?: boolean;
}

interface VehicleCardProps {
  vehicle: Vehicle;
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

export default function VehicleCard({ vehicle }: VehicleCardProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

  const images = vehicle.images.length > 0 ? vehicle.images : [];
  const title = `${vehicle.year} ${vehicle.make} ${vehicle.model}`;

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  const scrollPrev = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (emblaApi) emblaApi.scrollPrev();
    },
    [emblaApi]
  );

  const scrollNext = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (emblaApi) emblaApi.scrollNext();
    },
    [emblaApi]
  );

  return (
    <Link href={`/inventory/${vehicle.vin}`} className="block h-full">
      <div className="group h-full bg-charcoal rounded-sm overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
        {/* Image Section */}
        <div className="aspect-[16/10] relative overflow-hidden">
          {images.length > 0 ? (
            <div className="embla h-full" ref={emblaRef}>
              <div className="embla__container h-full">
                {images.map((image, index) => (
                  <div key={index} className="embla__slide relative h-full min-w-full">
                    <Image
                      src={image.url}
                      alt={`${title} - Image ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      loading={index === 0 ? "eager" : "lazy"}
                    />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="absolute inset-0 bg-gray-dark flex items-center justify-center">
              <span className="text-gray-light text-sm">No Image</span>
            </div>
          )}

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-transparent to-transparent pointer-events-none" />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex gap-2 z-10">
            {vehicle.isFeatured && <Badge variant="gold">Featured</Badge>}
            {vehicle.isSold && <Badge variant="error">Sold</Badge>}
          </div>

          {/* Image navigation arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={scrollPrev}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80 z-10"
                aria-label="Previous image"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={scrollNext}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80 z-10"
                aria-label="Next image"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}

          {/* Image dots */}
          {images.length > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
              {images.slice(0, 5).map((_, index) => (
                <span
                  key={index}
                  className={`w-1.5 h-1.5 rounded-full transition-colors ${
                    index === selectedIndex ? "bg-white" : "bg-white/40"
                  }`}
                />
              ))}
              {images.length > 5 && (
                <span className="text-white/60 text-xs ml-1">+{images.length - 5}</span>
              )}
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="p-5">
          {/* Title */}
          <h3 className="font-display text-xl text-white font-semibold mb-1 group-hover:text-gold transition-colors">
            <span className="text-gold">{vehicle.year}</span> {vehicle.make} {vehicle.model}
          </h3>

          {/* Trim */}
          {vehicle.trim && (
            <p className="text-gray-light text-base mb-3">{vehicle.trim}</p>
          )}

          {/* Price */}
          <p className="font-display text-xl text-white font-semibold mb-3">
            {vehicle.price ? formatPrice(vehicle.price) : "Call for Price"}
          </p>

          {/* Specs */}
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-base text-gray-light mb-4">
            {vehicle.mileage && (
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {formatMileage(vehicle.mileage)} mi
              </span>
            )}
            {vehicle.exteriorColor && (
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
                {vehicle.exteriorColor}
              </span>
            )}
          </div>

          {/* Button */}
          <div className="pt-3 border-t border-gray-dark">
            <span className="inline-flex items-center gap-2 text-gold text-sm font-medium group-hover:gap-3 transition-all">
              View Details
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
