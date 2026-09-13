// src/components/common/OptimizedImage.tsx - Zero-CLS, Safe URL, Lazy/Eager Image System
import React, { useState } from 'react';
import { Building2 } from 'lucide-react';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
  priority?: boolean;
  aspectRatio?: '16/9' | '4/3' | '3/4' | '1/1' | 'auto';
  objectFit?: 'cover' | 'contain' | 'fill' | 'none';
  fallbackText?: string;
}

/**
 * Encodes URI path safely preserving slashes while properly encoding spaces, plus signs (+), and parentheses.
 * Guarantees leading slash so paths resolve from web root regardless of router depth.
 */
export function resolveSafeImagePath(src: string): string {
  if (!src) return '';
  if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('data:')) {
    return src;
  }

  // Strip any leading ./ or /
  const clean = src.replace(/^(\.\/|\/)/, '');
  const encodedPath = clean
    .split('/')
    .map(segment => encodeURIComponent(decodeURIComponent(segment)).replace(/%2B/gi, '+'))
    .join('/');
  return '/' + encodedPath;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className = '',
  containerClassName = '',
  priority = false,
  aspectRatio = '16/9',
  objectFit = 'cover',
  fallbackText = 'Suite View Available',
  width = 1200,
  height = 900,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const safeSrc = resolveSafeImagePath(src);

  const aspectClass = 
    aspectRatio === '16/9' ? 'aspect-video' :
    aspectRatio === '4/3' ? 'aspect-[4/3]' :
    aspectRatio === '3/4' ? 'aspect-[3/4]' :
    aspectRatio === '1/1' ? 'aspect-square' : '';

  const fitClass = 
    objectFit === 'contain' ? 'object-contain' :
    objectFit === 'fill' ? 'object-fill' :
    objectFit === 'none' ? 'object-none' : 'object-cover';

  if (hasError || !src) {
    return (
      <div 
        className={`w-full ${aspectClass} flex flex-col items-center justify-center bg-[#EDE8DF] dark:bg-[#121C2D] border border-[#E2DDD5] dark:border-[#1E2B42] text-slate-400 select-none p-4 ${containerClassName}`}
        role="img"
        aria-label={alt || fallbackText}
      >
        <Building2 className="w-8 h-8 text-brand-gold-500/40 mb-1.5" />
        <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300">
          {fallbackText}
        </span>
        <span className="text-[9px] uppercase tracking-widest text-slate-400 dark:text-slate-500 mt-0.5">
          6 STARS HOSPITALITY
        </span>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden w-full ${aspectClass} bg-[#F4EFE8] dark:bg-[#0E1726] ${containerClassName}`}>
      {/* Loading Skeleton */}
      {!isLoaded && (
        <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-[#EDE8DF] via-[#F4EFE8] to-[#EDE8DF] dark:from-[#0E1726] dark:via-[#152238] dark:to-[#0E1726] z-0" />
      )}

      <img
        src={safeSrc}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        className={`w-full h-full ${fitClass} transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        } ${className}`}
        {...props}
      />
    </div>
  );
};
