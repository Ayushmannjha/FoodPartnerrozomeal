import React, { useState, useCallback } from 'react';

interface ImageWithFallbackProps {
  src?: string | null;
  alt: string;
  fallbackText?: string;
  className?: string;
  width?: number;
  height?: number;
  onLoad?: () => void;
}

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt,
  fallbackText,
  className = '',
  width = 300,
  height = 200,
  onLoad
}) => {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // 🎯 Generate a proper placeholder URL
  const getPlaceholderUrl = useCallback((text: string) => {
    const encodedText = encodeURIComponent(text);
    return `https://via.placeholder.com/${width}x${height}/e2e8f0/64748b?text=${encodedText}`;
  }, [width, height]);

  // 🎯 Validate and fix image URL
  const getValidImageUrl = useCallback((url?: string | null) => {
    if (!url || typeof url !== 'string' || url.trim() === '') {
      return null;
    }

    // Fix common URL issues
    if (url.startsWith('//')) {
      return `https:${url}`;
    }
    
    if (url.startsWith('via.placeholder.com')) {
      return `https://${url}`;
    }
    
    if (!url.startsWith('http://') && !url.startsWith('https://') && !url.startsWith('/')) {
      return `https://${url}`;
    }

    return url;
  }, []);

  // 🎯 Handle image load error (prevents infinite loops)
  const handleImageError = useCallback(() => {
    console.warn(`Failed to load image: ${src}`);
    setImageError(true);
    setIsLoading(false);
  }, [src]);

  // 🎯 Handle successful image load
  const handleImageLoad = useCallback(() => {
    setIsLoading(false);
    onLoad?.();
  }, [onLoad]);

  const validSrc = getValidImageUrl(src);
  const shouldShowFallback = imageError || !validSrc;

  if (shouldShowFallback) {
    return (
      <div 
        className={`bg-gray-200 flex items-center justify-center text-gray-500 text-sm ${className}`}
        style={{ width, height }}
      >
        <div className="text-center p-4">
          <div className="text-2xl mb-2">🍽️</div>
          <div>{fallbackText || alt || 'No Image'}</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`} style={{ width, height }}>
      {isLoading && (
        <div 
          className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center"
          style={{ width, height }}
        >
          <div className="text-gray-400">Loading...</div>
        </div>
      )}
      
      <img
        src={validSrc}
        alt={alt}
        className={`w-full h-full object-cover ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        onLoad={handleImageLoad}
        onError={handleImageError}
        loading="lazy"
        style={{ width, height }}
      />
    </div>
  );
};