"use client";

import { useState } from "react";

export function EventImage({ src, alt, className, objectPosition, aspectRatio }: { src?: string; alt: string; className: string; objectPosition?: string; aspectRatio?: string }) {
  const [failed, setFailed] = useState(false);
  if (!src) return null;

  return (
    <div className={`min-w-0 overflow-hidden bg-[var(--surface-elevated)] ${className}`} aria-hidden={failed || undefined} style={aspectRatio ? { aspectRatio } : undefined}>
      {!failed && (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover"
          style={objectPosition ? { objectPosition } : undefined}
          onError={() => setFailed(true)}
        />
      )}
    </div>
  );
}
