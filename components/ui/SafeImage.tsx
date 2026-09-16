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
 * Resilient image component.
 *
 * Images are intentionally served directly instead of through Next's
 * /_next/image optimizer. Firebase Storage URLs can otherwise return 502s
 * from the optimizer, and local fallback assets can return optimizer 400s.
 * The browser can load both sources directly and Firebase still handles the
 * actual image delivery/caching.
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
      setImgSrc(src);
    } else if (stage <= 1 && imgSrc !== fallbackSrc) {
      setStage(2);
      setImgSrc(fallbackSrc);
    }
  };

  // Coerce string dimensions (e.g. width="1440") to numbers for next/image.
  const w = width == null ? undefined : Number(width);
  const h = height == null ? undefined : Number(height);
  const useFill = fill ?? (w == null || h == null || Number.isNaN(w) || Number.isNaN(h));

  const common = {
    src: imgSrc,
    alt,
    className,
    onError: handleError,
    priority,
    ...(priority ? {} : { loading: loading ?? ('lazy' as const) }),
    // IMPORTANT: bypass Next's image optimizer. This prevents Firebase
    // Storage optimizer 502s and local-image optimizer 400s on Vercel.
    unoptimized: true,
  };

  if (useFill) {
    return <Image {...common} fill sizes={sizes ?? '(max-width: 768px) 100vw, 50vw'} />;
  }

  return <Image {...common} width={w!} height={h!} sizes={sizes} />;
};
