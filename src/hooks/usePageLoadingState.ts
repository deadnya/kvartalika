import { useEffect, useRef, useState, useCallback } from "react";

interface LoadingConfig {
  apiPromises?: Promise<any>[];
  imageSelectors?: string[];
}

interface LoadingState {
  isLoading: boolean;
  hasError: boolean;
  progress: {
    apisCompleted: number;
    apisTotal: number;
    imagesLoaded: number;
    imagesTotal: number;
  };
}

/**
 * Hook that manages page loading state without causing infinite re-render loops.
 * 
 * Tracks:
 * 1. API calls completion
 * 2. Image loading completion (via img elements)
 * 3. Emits loading state ONLY when all are complete
 * 
 * Design:
 * - Uses refs to avoid dependency array issues
 * - Single completion callback for all async work
 * - Prevents race conditions with execution token
 */
export const usePageLoadingState = (config?: LoadingConfig) => {
  const [state, setState] = useState<LoadingState>({
    isLoading: true,
    hasError: false,
    progress: {
      apisCompleted: 0,
      apisTotal: 0,
      imagesLoaded: 0,
      imagesTotal: 0,
    },
  });

  // Use refs to track current execution to prevent race conditions
  const executionTokenRef = useRef(0);
  const completedRef = useRef(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const waitForImages = useCallback(
    (
      selectors: string[] = ["img"],
      timeout: number = 30000,
    ): Promise<{ loaded: number; total: number }> => {
      return new Promise((resolve) => {
        const startTime = Date.now();
        let lastCheckTime = startTime;
        let noNewImagesCount = 0;

        const checkImages = () => {
          const now = Date.now();
          const images = selectors.flatMap((selector) =>
            Array.from(document.querySelectorAll(selector) as NodeListOf<HTMLImageElement>),
          );

          if (images.length === 0) {
            // Still no images? Give it more time (page might still be rendering)
            if (now - startTime < 5000) {
              requestAnimationFrame(checkImages);
              return;
            }
            resolve({ loaded: 0, total: 0 });
            return;
          }

          const loaded = images.filter(
            (img) => img.complete && img.naturalHeight > 0,
          ).length;
          const total = images.length;

          // If all images loaded, resolve immediately
          if (loaded === total) {
            resolve({ loaded, total });
            return;
          }

          // Check if we've timed out
          if (now - startTime > timeout) {
            resolve({ loaded, total });
            return;
          }

          // If no new images detected for 2 seconds and we have images, resolve
          // This handles the case where some images fail to load
          if (now - lastCheckTime > 2000) {
            // Reset check time to detect if new images appear
            lastCheckTime = now;
            noNewImagesCount++;

            // If no new images for 3 consecutive checks (6 seconds) and we have loaded some, resolve
            if (noNewImagesCount >= 3 && loaded > 0) {
              resolve({ loaded, total });
              return;
            }
          }

          requestAnimationFrame(checkImages);
        };

        // Small delay to let DOM settle before first check
        setTimeout(checkImages, 100);
      });
    },
    [],
  );

  const start = useCallback(async (apiPromises?: Promise<any>[]) => {
    const token = ++executionTokenRef.current;
    completedRef.current = false;

    // Initialize abort controller for this execution
    abortControllerRef.current = new AbortController();

    setState((prev) => ({
      ...prev,
      isLoading: true,
      hasError: false,
      progress: {
        apisCompleted: 0,
        apisTotal: apiPromises?.length ?? 0,
        imagesLoaded: 0,
        imagesTotal: 0,
      },
    }));

    try {
      // Wait for all API calls to complete
      if (apiPromises && apiPromises.length > 0) {
        await Promise.allSettled(apiPromises);

        // Check if this execution was cancelled
        if (token !== executionTokenRef.current) {
          return;
        }

        setState((prev) => ({
          ...prev,
          progress: {
            ...prev.progress,
            apisCompleted: apiPromises.length,
          },
        }));
      }

      // Wait for images to load
      const imageResult = await waitForImages(config?.imageSelectors, 30000);

      // Check if this execution was cancelled
      if (token !== executionTokenRef.current) {
        return;
      }

      setState((prev) => ({
        ...prev,
        progress: {
          ...prev.progress,
          imagesLoaded: imageResult.loaded,
          imagesTotal: imageResult.total,
        },
      }));

      // All done
      if (token === executionTokenRef.current) {
        completedRef.current = true;
        setState((prev) => ({
          ...prev,
          isLoading: false,
          hasError: false,
        }));
      }
    } catch (error) {
      // Only set error if this is still the current execution
      if (token === executionTokenRef.current) {
        console.error("Page loading error:", error);
        completedRef.current = true;
        setState((prev) => ({
          ...prev,
          isLoading: false,
          hasError: true,
        }));
      }
    }
  }, [config?.imageSelectors, waitForImages]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  return {
    ...state,
    start,
    isComplete: completedRef.current,
  };
};
