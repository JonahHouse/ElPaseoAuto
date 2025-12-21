"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import Button from "@/components/ui/Button";

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
  images: VehicleImage[];
}

interface HeroProps {
  vehicles: Vehicle[];
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);
}

export default function Hero({ vehicles }: HeroProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 5000, stopOnInteraction: false }),
  ]);

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

  const scrollTo = useCallback(
    (index: number) => {
      if (!emblaApi) return;
      emblaApi.scrollTo(index);
    },
    [emblaApi]
  );

  const currentVehicle = vehicles[selectedIndex];

  if (vehicles.length === 0) {
    return (
      <section className="relative h-[50vh] md:h-[60vh] lg:h-[70vh] flex items-center bg-charcoal">
        <div className="container mx-auto px-4 lg:px-8 relative z-10 pt-24">
          <div className="max-w-3xl">
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-white font-semibold leading-tight mb-4">
              Featured Inventory <span className="text-gold-gradient">Coming Soon</span>
            </h1>
            <Link href="/inventory">
              <Button size="lg">Browse All Inventory</Button>
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative h-[60vh] md:h-[70vh] lg:h-[80vh]">
      {/* Background Carousel */}
      <div className="absolute inset-0 bg-charcoal overflow-hidden">
        <div className="embla h-full" ref={emblaRef}>
          <div className="embla__container h-full">
            {vehicles.map((vehicle, index) => {
              const primaryImage =
                vehicle.images.find((img) => img.isPrimary) || vehicle.images[0];
              return (
                <div key={vehicle.vin} className="embla__slide relative h-full min-w-full">
                  {primaryImage && (
                    <Image
                      src={primaryImage.url}
                      alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                      fill
                      className="object-cover opacity-90"
                      priority={index === 0}
                      sizes="100vw"
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
        {/* Subtle overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal/40 via-transparent to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/50 via-transparent to-transparent pointer-events-none" />
      </div>

      {/* Gold accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-1 gold-gradient" />

      {/* Content */}
      <div className="absolute bottom-8 md:bottom-12 lg:bottom-16 left-0 right-0 z-10">
        <div className="container mx-auto px-4 lg:px-8">
          {/* Current Vehicle Info */}
          {currentVehicle && (
            <div className="mb-3 md:mb-4">
              <h1 className="font-display text-xl md:text-2xl lg:text-3xl text-white font-semibold leading-tight mb-1">
                {currentVehicle.year} {currentVehicle.make}{" "}
                <span className="text-gold-gradient">{currentVehicle.model}</span>
              </h1>
              {currentVehicle.price && (
                <p className="text-white text-lg md:text-xl font-semibold">
                  {formatPrice(currentVehicle.price)}
                </p>
              )}
            </div>
          )}

          {/* CTAs */}
          <div className="flex flex-row gap-2 mb-3 md:mb-4">
            {currentVehicle && (
              <Link href={`/inventory/${currentVehicle.vin}`}>
                <Button size="sm">View Vehicle</Button>
              </Link>
            )}
            <Link href="/inventory">
              <Button variant="outline" size="sm">Browse Inventory</Button>
            </Link>
          </div>

          {/* Slide Indicators */}
          {vehicles.length > 1 && (
            <div className="flex gap-2">
              {vehicles.map((_, index) => (
                <button
                  key={index}
                  onClick={() => scrollTo(index)}
                  className={`h-1 rounded-full transition-all duration-300 ${
                    index === selectedIndex
                      ? "w-8 bg-gold"
                      : "w-4 bg-white/40 hover:bg-white/60"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>

    </section>
  );
}
