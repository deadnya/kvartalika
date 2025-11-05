import { useEffect, useRef } from "react";
import { usePageReadyStore } from "./usePageReadySignal";

/**
 * Hook for pages to signal when their content is ready to display.
 * Call this with isReady=true when your page's API data has loaded.
 */
export const usePageReady = (pageId: string, isReady: boolean) => {
    const { registerPageReady, signalPageReady, clearPageReady } = usePageReadyStore();
    const registeredRef = useRef(false);

    useEffect(() => {
        // Register this page as needing a ready signal
        if (!registeredRef.current) {
            console.log(`[PageReady] Registering ${pageId}`);
            registerPageReady(pageId);
            registeredRef.current = true;
        }

        // Signal ready when page data is loaded
        if (isReady) {
            console.log(`[PageReady] ✅ ${pageId} is READY`);
            signalPageReady(pageId);
        } else {
            console.log(`[PageReady] ⏳ ${pageId} still loading...`);
        }

        return () => {
            // Cleanup: clear signal on unmount
            console.log(`[PageReady] Clearing ${pageId} on unmount`);
            clearPageReady(pageId);
        };
    }, [isReady, pageId, registerPageReady, signalPageReady, clearPageReady]);
};
