/**
 * Utility functions for working with the Image component
 */

/**
 * Generate a preview URL from a full image URL by convention
 * Assumes preview images are named with "-preview" suffix
 * 
 * @example
 * getPreviewUrl('/images/photo.jpg') // => '/images/photo-preview.jpg'
 * getPreviewUrl('/images/photo.png') // => '/images/photo-preview.png'
 */
export const getPreviewUrl = (fullUrl: string): string => {
  const extension = fullUrl.match(/\.(jpg|jpeg|png|webp)$/i)?.[0] || '.jpg';
  return fullUrl.replace(new RegExp(`${extension}$`, 'i'), `-preview${extension}`);
};

/**
 * Check if a URL likely points to a large image that would benefit from preview
 * 
 * @param url - Image URL to check
 * @returns true if image likely needs preview
 */
export const shouldUsePreview = (url: string): boolean => {
  const largeImageIndicators = [
    '4k',
    'high-res',
    'highres',
    'original',
    'full',
    'large',
    'hero',
    'banner'
  ];
  
  const urlLower = url.toLowerCase();
  return largeImageIndicators.some(indicator => urlLower.includes(indicator));
};

/**
 * Get preview URL if needed, otherwise return null
 * Combines shouldUsePreview and getPreviewUrl for convenience
 * 
 * @param fullUrl - Full image URL
 * @returns Preview URL if needed, null otherwise
 */
export const getSmartPreviewUrl = (fullUrl: string): string | null => {
  return shouldUsePreview(fullUrl) ? getPreviewUrl(fullUrl) : null;
};

/**
 * Batch preload images (useful for galleries)
 * 
 * @param urls - Array of image URLs to preload
 * @returns Promise that resolves when all images are loaded
 */
export const batchPreloadImages = async (urls: string[]): Promise<void> => {
  const promises = urls.map(url => {
    return new Promise<void>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = () => reject(new Error(`Failed to load: ${url}`));
      img.src = url;
    });
  });
  
  try {
    await Promise.all(promises);
  } catch (error) {
    console.warn('Some images failed to preload:', error);
  }
};

/**
 * Convert API image object to Image component props
 * Useful when API returns image data in different format
 * 
 * @param apiImage - Image data from API
 * @returns Props for Image component
 */
export interface ApiImage {
  url: string;
  preview?: string;
  alt?: string;
  width?: number;
  height?: number;
}

export const apiImageToProps = (apiImage: ApiImage) => {
  return {
    src: apiImage.url,
    previewSrc: apiImage.preview || null,
    alt: apiImage.alt || '',
    ...(apiImage.width && { width: apiImage.width }),
    ...(apiImage.height && { height: apiImage.height }),
  };
};

/**
 * Generate srcSet from base URL (for responsive images)
 * Assumes convention: image-400w.jpg, image-800w.jpg, etc.
 * 
 * @param baseUrl - Base image URL (e.g., '/images/photo.jpg')
 * @param widths - Array of widths to generate
 * @returns srcSet string
 */
export const generateSrcSet = (
  baseUrl: string,
  widths: number[] = [400, 800, 1200, 1600]
): string => {
  const extension = baseUrl.match(/\.(jpg|jpeg|png|webp)$/i)?.[0] || '.jpg';
  const baseName = baseUrl.replace(new RegExp(`${extension}$`, 'i'), '');
  
  return widths
    .map(width => `${baseName}-${width}w${extension} ${width}w`)
    .join(', ');
};

/**
 * Validate image URL format
 * 
 * @param url - URL to validate
 * @returns true if URL is valid image format
 */
export const isValidImageUrl = (url: string): boolean => {
  if (!url || typeof url !== 'string') return false;
  
  const validExtensions = /\.(jpg|jpeg|png|gif|webp|svg|bmp|ico)$/i;
  const validProtocols = /^(https?:\/\/|\/)/;
  
  return validProtocols.test(url) && validExtensions.test(url);
};

/**
 * Get fallback image URL
 * 
 * @returns Path to fallback blur image
 */
export const getFallbackImageUrl = (): string => {
  return '/fallback.png';
};

/**
 * Calculate optimal preview quality and dimensions
 * 
 * @param originalWidth - Original image width
 * @param originalHeight - Original image height
 * @returns Recommended preview dimensions
 */
export const calculatePreviewDimensions = (
  originalWidth: number,
  originalHeight: number
): { width: number; height: number; quality: number } => {
  const MAX_PREVIEW_WIDTH = 400;
  const QUALITY = 20;
  
  if (originalWidth <= MAX_PREVIEW_WIDTH) {
    return {
      width: originalWidth,
      height: originalHeight,
      quality: QUALITY
    };
  }
  
  const scale = MAX_PREVIEW_WIDTH / originalWidth;
  
  return {
    width: MAX_PREVIEW_WIDTH,
    height: Math.round(originalHeight * scale),
    quality: QUALITY
  };
};

/**
 * Debug utility: log image loading performance
 */
export const measureImageLoadTime = async (url: string): Promise<number> => {
  const startTime = performance.now();
  
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    img.onload = () => {
      const loadTime = performance.now() - startTime;
      console.log(`Image loaded in ${loadTime.toFixed(2)}ms:`, url);
      resolve(loadTime);
    };
    
    img.onerror = () => {
      reject(new Error(`Failed to load: ${url}`));
    };
    
    img.src = url;
  });
};
