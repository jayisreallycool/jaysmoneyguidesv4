'use client';

import React, { useState, useEffect } from 'react';
import { AlertCircle, Loader } from 'lucide-react';

interface OptimizedImageProps {
  src?: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  fallbackColor?: string;
  onError?: () => void;
}

/**
 * Optimized image component with:
 * - Firebase Storage fallback
 * - Placeholder while loading
 * - Error fallback UI
 * - Responsive sizing
 * - WebP support with JPEG fallback
 */
export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  fallbackColor = 'bg-gradient-to-br from-slate-800 to-slate-900',
  onError,
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(!priority);
  const [hasError, setHasError] = useState(false);
  const [imageSrc, setImageSrc] = useState(src || '');

  useEffect(() => {
    setImageSrc(src || '');
    setHasError(!src);
    setIsLoading(!priority);
  }, [src, priority]);

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setHasError(true);
    setIsLoading(false);
    onError?.();
  };

  return (
    <div
      className={`relative overflow-hidden bg-slate-900 ${className}`}
      style={{
        aspectRatio: width && height ? `${width} / ${height}` : undefined,
      }}
    >
      {/* Loading skeleton */}
      {isLoading && !hasError && (
        <div
          className={`absolute inset-0 ${fallbackColor} animate-pulse flex items-center justify-center`}
        >
          <Loader className="w-6 h-6 text-slate-400 animate-spin" />
        </div>
      )}

      {/* Actual image */}
      {!hasError && imageSrc ? (
        <picture className="block w-full h-full">
          {/* WebP source */}
          <source
            srcSet={`${imageSrc}${imageSrc.includes('?') ? '&' : '?'}fmt=webp`}
            type="image/webp"
          />

          <img
            src={imageSrc}
            alt={alt}
            width={width}
            height={height}
            loading={priority ? 'eager' : 'lazy'}
            onLoad={handleLoad}
            onError={handleError}
            className="w-full h-full object-cover"
            decoding="async"
          />
        </picture>
      ) : null}

      {/* Error state */}
      {hasError && (
        <div
          className={`absolute inset-0 ${fallbackColor} flex flex-col items-center justify-center p-4`}
        >
          <AlertCircle className="w-8 h-8 text-slate-500 mb-2" />

          <p className="text-xs text-slate-400 text-center">
            {alt}
          </p>

          <p className="text-[10px] text-slate-500 mt-1">
            Image unavailable
          </p>
        </div>
      )}
    </div>
  );
}

/**
 * Hero image component optimized for large background images
 */
export function OptimizedHeroImage({
  src,
  alt,
  className = '',
  overlayColor,
}: {
  src?: string;
  alt: string;
  className?: string;
  overlayColor?: string;
}) {
  const [hasError, setHasError] = useState(false);

  return (
    <div
      className={`relative w-full overflow-hidden ${className}`}
      role="img"
      aria-label={alt}
    >
      {/* Background image + fallback */}
      <div
        className={`absolute inset-0 ${
          overlayColor ||
          'bg-gradient-to-br from-slate-900 via-emerald-900/30 to-slate-900'
        }`}
        style={{
          backgroundImage:
            src && !hasError ? `url("${src}")` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }}
      />

      {/* Hidden image used to detect background-image loading errors */}
      {src && (
        <img
          src={src}
          alt=""
          aria-hidden="true"
          className="hidden"
          onError={() => setHasError(true)}
        />
      )}

      {/* Overlay for text readability */}
      <div className="absolute inset-0 bg-black/40" />
    </div>
  );
}

/**
 * Responsive image component for article content
 */
export function ArticleImage({
  src,
  alt,
  caption,
  className = '',
}: {
  src?: string;
  alt: string;
  caption?: string;
  className?: string;
}) {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  return (
    <figure className={`my-6 ${className}`}>
      <div className="rounded-lg overflow-hidden bg-slate-900 border border-slate-800">
        <OptimizedImage
          src={src}
          alt={alt}
          className="w-full h-auto"
          onError={() => {
            setHasError(true);
            setIsLoading(false);
          }}
        />
      </div>

      {caption && (
        <figcaption className="mt-3 text-sm text-slate-400 text-center italic">
          {caption}
        </figcaption>
      )}

      {hasError && (
        <p className="mt-2 text-xs text-slate-500 text-center">
          Image could not be loaded. {alt}
        </p>
      )}
    </figure>
  );
}
