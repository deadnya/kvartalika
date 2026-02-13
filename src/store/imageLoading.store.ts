import { create } from 'zustand';

interface ImageLoadingState {
  // Track registered images that need preview loading
  registeredImages: Set<string>;
  // Track which preview images have loaded
  loadedPreviews: Set<string>;
  // Whether all previews are loaded and page is ready
  pageReady: boolean;
  
  // Register an image that needs to load its preview
  registerImage: (imageId: string) => void;
  // Mark a preview as loaded
  markPreviewLoaded: (imageId: string) => void;
  // Unregister when component unmounts
  unregisterImage: (imageId: string) => void;
  // Check if all registered previews are loaded
  areAllPreviewsLoaded: () => boolean;
  // Mark page as ready (called externally when previews are done)
  setPageReady: (ready: boolean) => void;
  // Reset state for new page
  reset: () => void;
}

export const useImageLoadingStore = create<ImageLoadingState>((set, get) => ({
  registeredImages: new Set(),
  loadedPreviews: new Set(),
  pageReady: false,

  registerImage: (imageId: string) => {
    set((state) => {
      const newRegistered = new Set(state.registeredImages);
      newRegistered.add(imageId);
      return { 
        registeredImages: newRegistered,
        pageReady: false // Reset page ready when new images register
      };
    });
  },

  markPreviewLoaded: (imageId: string) => {
    set((state) => {
      const newLoaded = new Set(state.loadedPreviews);
      newLoaded.add(imageId);
      
      // Check if all registered images have loaded their previews
      const allLoaded = Array.from(state.registeredImages).every(id => 
        newLoaded.has(id)
      );
      
      return { 
        loadedPreviews: newLoaded,
        pageReady: allLoaded && state.registeredImages.size > 0
      };
    });
  },

  unregisterImage: (imageId: string) => {
    set((state) => {
      const newRegistered = new Set(state.registeredImages);
      const newLoaded = new Set(state.loadedPreviews);
      newRegistered.delete(imageId);
      newLoaded.delete(imageId);
      return { 
        registeredImages: newRegistered,
        loadedPreviews: newLoaded
      };
    });
  },

  areAllPreviewsLoaded: () => {
    const state = get();
    if (state.registeredImages.size === 0) return true;
    return Array.from(state.registeredImages).every(id => 
      state.loadedPreviews.has(id)
    );
  },

  setPageReady: (ready: boolean) => {
    set({ pageReady: ready });
  },

  reset: () => {
    set({
      registeredImages: new Set(),
      loadedPreviews: new Set(),
      pageReady: false
    });
  },
}));
