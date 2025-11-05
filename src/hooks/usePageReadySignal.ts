import { create } from "zustand";

interface PageReadyState {
    pageReadySignals: Map<string, boolean>;  // Track if page is registered AND ready
    registerPageReady: (pageId: string) => void;
    signalPageReady: (pageId: string) => void;
    isPageReady: (pageId: string) => boolean;
    clearPageReady: (pageId: string) => void;
}

export const usePageReadyStore = create<PageReadyState>((set, get) => ({
    pageReadySignals: new Map(),
    
    registerPageReady: (pageId: string) => {
        set((state) => {
            const newSignals = new Map(state.pageReadySignals);
            newSignals.set(pageId, false);  // Register as NOT ready initially
            return { pageReadySignals: newSignals };
        });
    },
    
    signalPageReady: (pageId: string) => {
        set((state) => {
            const newSignals = new Map(state.pageReadySignals);
            newSignals.set(pageId, true);  // Mark as ready
            return { pageReadySignals: newSignals };
        });
    },
    
    isPageReady: (pageId: string) => {
        const state = get();
        // Return true only if page is registered AND marked as ready
        return state.pageReadySignals.has(pageId) && state.pageReadySignals.get(pageId) === true;
    },
    
    clearPageReady: (pageId: string) => {
        set((state) => {
            const newSignals = new Map(state.pageReadySignals);
            newSignals.delete(pageId);
            return { pageReadySignals: newSignals };
        });
    },
}));
