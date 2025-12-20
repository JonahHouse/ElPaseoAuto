"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";

interface VehicleImage {
  id: number;
  url: string;
  position: number;
  isPrimary: boolean;
}

interface VehicleGalleryProps {
  images: VehicleImage[];
  title: string;
}

export default function VehicleGallery({ images, title }: VehicleGalleryProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

  const sortedImages = [...images].sort((a, b) => {
    if (a.isPrimary) return -1;
    if (b.isPrimary) return 1;
    return a.position - b.position;
  });

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

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const scrollTo = useCallback(
    (index: number) => {
      if (emblaApi) emblaApi.scrollTo(index);
    },
    [emblaApi]
  );

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isModalOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsModalOpen(false);
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  if (images.length === 0) {
    return (
      <div className="aspect-[16/10] bg-gray-dark rounded-sm flex items-center justify-center">
        <span className="text-gray-light">No images available</span>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {/* Main Image Carousel */}
        <div className="relative aspect-[16/10] bg-gray-dark rounded-sm overflow-hidden">
          <div className="embla h-full" ref={emblaRef}>
            <div className="embla__container h-full">
              {sortedImages.map((image, index) => (
                <button
                  key={image.id}
                  className="embla__slide relative h-full min-w-full cursor-pointer"
                  onClick={() => setIsModalOpen(true)}
                >
                  <Image
                    src={image.url}
                    alt={`${title} - Image ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    priority={index === 0}
                    loading={index === 0 ? "eager" : "lazy"}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={scrollPrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors z-10"
                aria-label="Previous image"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={scrollNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors z-10"
                aria-label="Next image"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}

          {/* Image Counter */}
          <div className="absolute bottom-4 right-4 bg-black/50 text-white text-sm px-3 py-1 rounded-full z-10">
            {selectedIndex + 1} / {sortedImages.length}
          </div>
        </div>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="grid grid-cols-6 gap-2">
            {sortedImages.slice(0, 6).map((image, index) => (
              <button
                key={image.id}
                onClick={() => scrollTo(index)}
                className={`
                  relative aspect-[16/10] rounded-sm overflow-hidden transition-all
                  ${selectedIndex === index ? "ring-2 ring-gold" : "opacity-70 hover:opacity-100"}
                `}
              >
                <Image
                  src={image.url}
                  alt={`${title} - Thumbnail ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="100px"
                  loading="lazy"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-white">
          {/* Header */}
          <div className="sticky top-0 z-10 bg-white border-b border-gray-light/20 px-4 py-4 flex items-center justify-between">
            <button
              onClick={() => setIsModalOpen(false)}
              className="flex items-center gap-2 text-charcoal hover:text-gold transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span className="font-medium">Close</span>
            </button>
            <span className="text-gray text-sm">
              {sortedImages.length} photos
            </span>
          </div>

          {/* Scrollable Image List */}
          <div className="overflow-y-auto h-[calc(100vh-65px)]">
            <div className="max-w-4xl mx-auto px-4 py-8 space-y-4">
              {sortedImages.map((image, index) => (
                <div
                  key={image.id}
                  className="relative w-full"
                >
                  <Image
                    src={image.url}
                    alt={`${title} - Photo ${index + 1}`}
                    width={1200}
                    height={800}
                    className="w-full h-auto rounded-sm"
                    sizes="(max-width: 896px) 100vw, 896px"
                    loading={index < 3 ? "eager" : "lazy"}
                    quality={90}
                  />
                  <div className="absolute bottom-4 right-4 bg-black/50 text-white text-sm px-3 py-1 rounded-full">
                    {index + 1} / {sortedImages.length}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
