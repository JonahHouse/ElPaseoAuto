"use client";

import { useState } from "react";

interface CompImageProps {
  src: string | null;
  alt: string;
}

export function CompImage({ src, alt }: CompImageProps) {
  const [hasError, setHasError] = useState(false);

  return (
    <div className="aspect-[16/10] bg-gray-100 relative">
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-gray-400 text-sm">No image available</span>
      </div>
      {src && !hasError && (
        <img
          src={src}
          alt={alt}
          className="absolute inset-0 w-full h-full object-cover"
          onError={() => setHasError(true)}
        />
      )}
    </div>
  );
}
