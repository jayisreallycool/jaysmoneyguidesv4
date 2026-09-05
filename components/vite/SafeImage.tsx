'use client';
import React, { useState, useEffect } from 'react';
import { getFirebaseStorageUrl } from '@/config/storageConfig';

interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string;
  fetchPriority?: 'high' | 'low' | 'auto';
}

export const SafeImage: React.FC<SafeImageProps> = ({
  fallbackSrc = '/images/jaysmoneyguides-logo.webp',
  loading = 'lazy',
  decoding = 'async',
  fetchPriority,
  alt = '',
  src,
  ...props
}) => {
  // Resolve primary source from Firebase Storage if it's a relative asset path
  const storageUrl = src ? getFirebaseStorageUrl(src) : '';
  const [imgSrc, setImgSrc] = useState<string | undefined>(storageUrl || src);
  const [hasTriedLocal, setHasTriedLocal] = useState<boolean>(false);

  useEffect(() => {
    const nextStorageUrl = src ? getFirebaseStorageUrl(src) : '';
    setImgSrc(nextStorageUrl || src);
    setHasTriedLocal(false);
  }, [src]);

  const handleError = () => {
    if (!hasTriedLocal && src && imgSrc !== src) {
      // First fallback: try local asset path
      setHasTriedLocal(true);
      setImgSrc(src);
    } else {
      // Final fallback: default brand logo
      setImgSrc(fallbackSrc);
    }
  };

  return (
    <img
      {...props}
      alt={alt}
      loading={loading}
      decoding={decoding}
      fetchPriority={fetchPriority}
      src={imgSrc}
      onError={handleError}
    />
  );
};

