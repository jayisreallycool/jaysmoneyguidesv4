'use client';
import React, { useState, useCallback } from 'react';
import { Download, ShoppingCart, Star, AlertCircle } from 'lucide-react';

interface EbookCardProps {
  id: string;
  title: string;
  description: string;
  price: number;
  isFree: boolean;
  coverImage: string;
  featured?: boolean;
  onDownload?: (id: string) => void | Promise<void>;
  onBuy?: (id: string) => void | Promise<void>;
}

/**
 * Mobile-first responsive ebook card component
 * Optimized for touch and small screens
 */
export function EbookCardMobile({
  id,
  title,
  description,
  price,
  isFree,
  coverImage,
  featured,
  onDownload,
  onBuy,
}: EbookCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleDownload = useCallback(async () => {
    if (!onDownload) return;
    setIsLoading(true);
    try {
      await onDownload(id);
    } catch (error) {
      console.error('Download error:', error);
    } finally {
      setIsLoading(false);
    }
  }, [id, onDownload]);

  const handleBuy = useCallback(async () => {
    if (!onBuy) return;
    setIsLoading(true);
    try {
      await onBuy(id);
    } catch (error) {
      console.error('Purchase error:', error);
    } finally {
      setIsLoading(false);
    }
  }, [id, onBuy]);

  const priceDisplay = isFree ? 'FREE' : `$${(price / 100).toFixed(2)}`;

  return (
    <div className="w-full bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden flex flex-col h-full">
      {/* Image Container - Mobile optimized */}
      <div className="relative w-full aspect-[3/4] bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden flex-shrink-0">
        {/* Featured Badge */}
        {featured && (
          <div className="absolute top-2 right-2 z-10 bg-amber-400 text-gray-900 px-2 py-1 rounded text-xs font-bold flex items-center gap-1 shadow-md">
            <Star className="w-3 h-3 fill-current" />
            <span className="hidden xs:inline">Featured</span>
          </div>
        )}

        {/* Loading Skeleton */}
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200 animate-pulse" />
        )}

        {/* Image */}
        {!imageError ? (
          <img
            src={coverImage}
            alt={title}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
            loading="lazy"
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gray-300 gap-2">
            <AlertCircle className="w-8 h-8 text-gray-600" />
            <span className="text-xs text-gray-600 text-center px-2">Cover unavailable</span>
          </div>
        )}
      </div>

      {/* Content - Flex grow to fill space */}
      <div className="p-3 md:p-4 flex flex-col flex-grow gap-3">
        {/* Title */}
        <h3 className="text-sm md:text-base font-bold text-gray-900 line-clamp-2 leading-tight">
          {title}
        </h3>

        {/* Description */}
        <p className="text-xs md:text-sm text-gray-600 line-clamp-2 flex-grow">
          {description}
        </p>

        {/* Price */}
        <div className="pt-2 border-t border-gray-100">
          <div className={`text-lg md:text-xl font-bold ${
            isFree ? 'text-green-600' : 'text-gray-900'
          }`}>
            {priceDisplay}
          </div>
        </div>

        {/* Button - Always at bottom */}
        <button
          onClick={isFree ? handleDownload : handleBuy}
          disabled={isLoading}
          className={`w-full flex items-center justify-center gap-2 font-semibold py-3 px-3 rounded-lg transition-all duration-200 active:scale-95 touch-manipulation ${
            isFree
              ? 'bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white'
              : 'bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white'
          } ${isLoading ? 'opacity-75' : ''}`}
        >
          {isLoading ? (
            <>
              <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
              <span className="text-sm">Processing...</span>
            </>
          ) : (
            <>
              {isFree ? (
                <>
                  <Download className="w-4 h-4 flex-shrink-0" />
                  <span className="text-sm md:text-base">Download</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="w-4 h-4 flex-shrink-0" />
                  <span className="text-sm md:text-base">Buy Now</span>
                </>
              )}
            </>
          )}
        </button>
      </div>
    </div>
  );
}
