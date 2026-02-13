import { useEffect } from 'react';
import { useImageLoadingStore } from '../store/imageLoading.store';
import { usePageReadyStore } from './usePageReadySignal';
import { pageDataReadyRef } from '../store/pageReady';

/**
 * Hook to integrate image loading with page ready system.
 * Call this in your page component to automatically mark page as ready
 * when all image previews have loaded.
 * 
 * @param pageId - Unique identifier for the page
 * @param additionalDataReady - Optional flag for additional data loading (API calls, etc.)
 */
export const usePageReadyWithImages = (pageId: string, additionalDataReady: boolean = true) => {
  const { registerPageReady, signalPageReady, clearPageReady } = usePageReadyStore();
  const { pageReady: imagesReady, reset: resetImageStore } = useImageLoadingStore();

  useEffect(() => {
    // Register this page
    registerPageReady(pageId);

    return () => {
      // Cleanup on unmount
      clearPageReady(pageId);
      resetImageStore();
    };
  }, [pageId, registerPageReady, clearPageReady, resetImageStore]);

  useEffect(() => {
    // Signal page ready when both images and additional data are ready
    if (imagesReady && additionalDataReady) {
      signalPageReady(pageId);
      // Also signal global ready ref for App.tsx loader
      pageDataReadyRef.current = true;
    }
  }, [imagesReady, additionalDataReady, pageId, signalPageReady]);

  return { imagesReady, isFullyReady: imagesReady && additionalDataReady };
};
