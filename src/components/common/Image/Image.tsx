import React, { useState, useEffect, useLayoutEffect, useRef, useMemo } from 'react';
import type { ImgHTMLAttributes } from 'react';
import styles from './Image.module.css';
import { useImageLoadingStore } from '../../../store/imageLoading.store';

interface ImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  src: string;
  previewSrc?: string | null;
  alt: string;
  className?: string;
}

// Generate stable random transformations based on src
const generateTransforms = (src: string): React.CSSProperties => {
  // Simple hash function to get consistent random values
  let hash = 0;
  for (let i = 0; i < src.length; i++) {
    hash = ((hash << 5) - hash) + src.charCodeAt(i);
    hash = hash & hash;
  }
  
  // Use hash to generate pseudo-random values
  const random2 = Math.abs(Math.cos(hash * 2)) * 100;
  const random3 = Math.abs(Math.sin(hash * 3)) * 100;
  
  // Random scale (0.9 to 1.1)
  const scale = 1.0 + (random2 % 20) / 100;
  
  // Random hue shift (0 to 360 degrees)
  const hueShift = random3 % 360;
  
  return {
    transform: `scale(${scale})`,
    filter: `blur(10px) hue-rotate(${hueShift}deg)`,
  };
};

const Image: React.FC<ImageProps> = ({
  src,
  previewSrc = null,
  alt,
  className = '',
  ...props
}) => {
  // Use a ref to store cache status that persists across renders
  const isCachedRef = useRef<boolean | null>(null);

  // If this is the first render for this component instance
  if (isCachedRef.current === null) {
      if (typeof window !== 'undefined') {
          const img = new window.Image();
          img.src = src;
          isCachedRef.current = img.complete;
      } else {
          isCachedRef.current = false;
      }
  }

  // Determine the preview source
  const effectivePreviewSrc = previewSrc || '/images/preview.jpg';

  // State
  // loaded: true if main image is fully loaded
  const [loaded, setLoaded] = useState(!!isCachedRef.current);
  // displayPreview: true if we should render the preview overlay
  const [displayPreview, setDisplayPreview] = useState(!isCachedRef.current);
  
  const imageId = useRef(`img-${Math.random().toString(36).substr(2, 9)}`).current;
  const { registerImage, markPreviewLoaded, unregisterImage } = useImageLoadingStore();
  
  // Sync state with src changes if we detect a change during render
  const previousSrcRef = useRef(src);
  const srcChanged = previousSrcRef.current !== src;
  
  if (srcChanged) {
      previousSrcRef.current = src;
      // Reset logic for new src - check cache synchronously
      let isCached = false;
      if (typeof window !== 'undefined') {
          const img = new window.Image();
          img.src = src;
          isCached = img.complete && img.naturalWidth > 0;
      }
      isCachedRef.current = isCached;
  }
  
  // Determine what to show THIS render
  // If src just changed and not cached, force preview on immediately (use ref value, not state)
  const effectiveLoaded = srcChanged ? !!isCachedRef.current : loaded;
  const effectiveDisplayPreview = srcChanged ? !isCachedRef.current : displayPreview;
  
  // Sync state for next render
  if (srcChanged) {
      setLoaded(!!isCachedRef.current);
      setDisplayPreview(!isCachedRef.current);
  }
  
  // Generate stable fallback transforms
  const fallbackTransforms = useMemo(() => generateTransforms(src), [src]);
  
  // Use layout effect to synchronously register and check one last time
  useLayoutEffect(() => {
    registerImage(imageId);
    
    // Check if full image is already cached
    const img = new window.Image();
    img.src = src;
    
    if (img.complete) {
      // If found cached in layout effect (after render), update immediately
      // Check naturalWidth to ensure it's a successful load, not a broken image
      if (img.naturalWidth > 0 && (!isCachedRef.current || !loaded)) {
          isCachedRef.current = true;
          setLoaded(true);
          setDisplayPreview(false);
      }
      if (img.naturalWidth > 0) {
        markPreviewLoaded(imageId);
      }
    } else {
        // If not cached, mark preview as needing to be loaded (or just "loaded" if we use fake preview)
        // Actually, we want to allow pageReady so main image can start loading
        // For now, we consider "fake preview" as instantly ready
        // But if we want actual preview checking, we'd wait for onLoad of preview
        // Simulating preview load for now or calling it done
        // markPreviewLoaded(imageId); // Moving this to image onLoad for preview
    }
    
    return () => {
      unregisterImage(imageId);
    };
  }, [imageId, src, registerImage, unregisterImage, markPreviewLoaded, loaded]);

  const handleMainImageLoad = () => {
      setLoaded(true);
      if (displayPreview) {
          setDisplayPreview(false);
      }
  };

  const handleMainImageError = () => {
      // If error, we might want to keep the preview or show fallback?
      // For now, let's keep loaded=false so we don't show alt text over preview?
      // Or if preview is missing too, we have no choice.
      
      // If we have a preview, keep showing it (don't set loaded=true)
      // If we don't have a preview, we might as well show the broken image icon/alt text
      if (!displayPreview) {
         setLoaded(true);
      }
  };

  const handlePreviewLoad = () => {
      markPreviewLoaded(imageId);
  };

  const handlePreviewError = () => {
       markPreviewLoaded(imageId);
  };
  
  // If no preview src, we mark it loaded immediately to unblock page
  useEffect(() => {
      if (!previewSrc && (effectiveDisplayPreview || displayPreview)) {
          markPreviewLoaded(imageId);
      }
  }, [previewSrc, src, markPreviewLoaded, imageId]);

  return (
    <div className={`${styles.imageContainer} ${className}`}>
        {/* Main Image - Always rendered */}
        <img
            {...props}
            src={src}
            alt={alt}
            className={`${styles.image} ${styles.mainImage} ${effectiveLoaded ? styles.loaded : ''}`}
            onLoad={handleMainImageLoad}
            onError={handleMainImageError}
        />

        {/* Preview Overlay */}
        {effectiveDisplayPreview && (
          <img
            src={effectivePreviewSrc}
            alt=""
            className={`${styles.image} ${styles.previewImage}`}
            style={fallbackTransforms}
            onLoad={handlePreviewLoad}
            onError={handlePreviewError}
          />
        )}
    </div>
  );
};

export default Image;