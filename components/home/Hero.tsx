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

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, dragFree: false },
    [Autoplay({ delay: 5000, stopOnInteraction: true, stopOnMouseEnter: true })]
  );

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
    <section className="bg-charcoal">
      {/* Image Carousel */}
      <div className="relative aspect-[3/2] md:aspect-[16/9] lg:aspect-[21/9]">
        <div className="embla h-full cursor-grab active:cursor-grabbing" ref={emblaRef}>
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
                      className="object-cover"
                      priority={index === 0}
                      sizes="100vw"
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Desktop Overlay - hidden on mobile */}
        <div className="hidden lg:block absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
        <div className="hidden lg:flex absolute bottom-0 left-0 right-0 pointer-events-auto">
          <div className="container mx-auto px-4 lg:px-8 py-8">
            <div className="flex items-end justify-between">
              {/* Current Vehicle Info */}
              {currentVehicle && (
                <div>
                  <h1 className="font-display text-3xl xl:text-4xl 2xl:text-5xl text-white font-semibold leading-tight mb-1">
                    {currentVehicle.year} {currentVehicle.make}{" "}
                    <span className="text-gold-gradient">{currentVehicle.model}</span>
                  </h1>
                  {currentVehicle.price && (
                    <p className="text-white/80 text-2xl font-semibold">
                      {formatPrice(currentVehicle.price)}
                    </p>
                  )}
                </div>
              )}

              {/* CTAs and Indicators */}
              <div className="flex flex-col items-end gap-4">
                <div className="flex flex-row gap-3">
                  {currentVehicle && (
                    <Link href={`/inventory/${currentVehicle.vin}`}>
                      <Button>View Vehicle</Button>
                    </Link>
                  )}
                  <Link href="/inventory">
                    <Button variant="outline">Browse Inventory</Button>
                  </Link>
                </div>

                {/* Slide Indicators */}
                {vehicles.length > 1 && (
                  <div className="flex gap-2">
                    {vehicles.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => scrollTo(index)}
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          index === selectedIndex
                            ? "w-10 bg-gold"
                            : "w-5 bg-white/30 hover:bg-white/50"
                        }`}
                        aria-label={`Go to slide ${index + 1}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Info Bar - hidden on desktop */}
      <div className="lg:hidden bg-white border-t border-gray-light/30">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col gap-4">
            {/* Current Vehicle Info */}
            {currentVehicle && (
              <div>
                <h1 className="font-display text-xl md:text-2xl text-charcoal font-semibold leading-tight">
                  {currentVehicle.year} {currentVehicle.make}{" "}
                  <span className="text-gold">{currentVehicle.model}</span>
                </h1>
                {currentVehicle.price && (
                  <p className="text-gray text-lg font-semibold">
                    {formatPrice(currentVehicle.price)}
                  </p>
                )}
              </div>
            )}

            {/* CTAs and Indicators */}
            <div className="flex flex-col gap-3">
              <div className="flex flex-row gap-2">
                {currentVehicle && (
                  <Link href={`/inventory/${currentVehicle.vin}`}>
                    <Button size="sm">View Vehicle</Button>
                  </Link>
                )}
                <Link href="/inventory">
                  <Button variant="secondary" size="sm">Browse Inventory</Button>
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
                          : "w-4 bg-charcoal/20 hover:bg-charcoal/40"
                      }`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        {/* Gold accent line */}
        <div className="h-1 gold-gradient" />
      </div>
    </section>
  );
}
