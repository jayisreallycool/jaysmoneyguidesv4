'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { getFirebaseStorageUrl } from '@/config/storageConfig';

interface SafeImageProps {
  src?: string;
  alt?: string;
  fallbackSrc?: string;
  className?: string;
  width?: number | string;
  height?: number | string;
  fill?: boolean;
  sizes?: string;
  priority?: boolean;
  loading?: 'lazy' | 'eager';
  // legacy props accepted for compatibility with existing call sites
  decoding?: string;
  fetchPriority?: 'high' | 'low' | 'auto';
  referrerPolicy?: string;
}

/**
 * next/image-powered image with a resilient fallback chain:
 *   Firebase Storage URL → the raw src → brand logo.
 * Automatically uses AVIF/webp, lazy loading, and responsive sizing.
 * Falls back to `fill` layout when no explicit width/height is provided
 * (for containers styled with w-full/h-full).
 */
export const SafeImage: React.FC<SafeImageProps> = ({
  src,
  alt = '',
  fallbackSrc = '/images/jaysmoneyguides-logo.webp',
  className,
  width,
  height,
  fill,
  sizes,
  priority = false,
  loading,
}) => {
  const resolve = (s?: string) => (s ? getFirebaseStorageUrl(s) || s : fallbackSrc);
  const [imgSrc, setImgSrc] = useState<string>(resolve(src));
  const [stage, setStage] = useState<0 | 1 | 2>(0);

  useEffect(() => {
    setImgSrc(resolve(src));
    setStage(0);
  }, [src]);

  const handleError = () => {
    if (stage === 0 && src && imgSrc !== src) {
      setStage(1);
      setImgSrc(src); // try raw/local path
    } else if (stage <= 1) {
      setStage(2);
      setImgSrc(fallbackSrc); // final brand fallback
    }
  };

  // Coerce string dimensions (e.g. width="1440") to numbers for next/image.
  const w = width == null ? undefined : Number(width);
  const h = height == null ? undefined : Number(height);
  // Use fill mode when caller didn't give explicit dimensions.
  const useFill = fill ?? (w == null || h == null || Number.isNaN(w) || Number.isNaN(h));

  const common = {
    src: imgSrc,
    alt,
    className,
    onError: handleError,
    priority,
    ...(priority ? {} : { loading: loading ?? 'lazy' as const }),
    // unoptimized fallback for the SVG brand logo (next/image can't optimize SVG)
    unoptimized: imgSrc.endsWith('.svg'),
  };

  if (useFill) {
    return <Image {...common} fill sizes={sizes ?? '(max-width: 768px) 100vw, 50vw'} />;
  }
  return <Image {...common} width={w!} height={h!} sizes={sizes} />;
};
