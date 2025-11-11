/**
 * Generic page preload manager with prioritization
 * Prioritizes: 1) JSON requests 2) Images currently on page 3) Future images
 * Centralizes preload strategies and keeps App.tsx clean
 */

import { usePageContentStore } from './pageContent.store';
import {
  getHomePageContent,
  getFooterData,
  getApartmentComplexPageContent,
  getApartmentComplexesPageContent,
  getAboutUsPageContent,
  getApartmentsPageContent,
  getApartmentsForComplex,
} from '../services/api/pages.api.requests';

interface PreloadStrategy {
  name: string;
  execute: () => Promise<void>;
}

interface ImageLoadResult {
  url: string;
  loaded: boolean;
  priority: 'critical' | 'high' | 'low';
}

/**
 * Configuration for preload priorities
 * Prevents loading too many images at once
 */
const PRELOAD_CONFIG = {
  // Max concurrent image loads at each priority level
  maxConcurrentCritical: 6,      // Currently visible images
  maxConcurrentHigh: 4,          // Next page images
  maxConcurrentLow: 2,           // Future pages images
  
  // Total limits per strategy
  maxCriticalImagesPerPage: 15,  // Currently visible
  maxHighImagesPerPage: 30,      // Soon needed
  maxLowImagesPerPage: 20,       // Low priority future content
  
  // Timeout for preload operations (ms)
  imageLoadTimeout: 8000,
};

/**
 * Preload images with concurrency control and timeout
 * Groups images by priority to load critical images first
 */
const preloadImages = async (
  imagesByPriority: { critical: string[]; high: string[]; low: string[] }
): Promise<ImageLoadResult[]> => {
  const results: ImageLoadResult[] = [];
  
  const loadWithPriority = async (
    urls: string[],
    priority: 'critical' | 'high' | 'low',
    maxConcurrent: number
  ): Promise<ImageLoadResult[]> => {
    const batchResults: ImageLoadResult[] = [];
    
    for (let i = 0; i < urls.length; i += maxConcurrent) {
      const batch = urls.slice(i, i + maxConcurrent);
      
      const promises = batch.map(url => {
        return new Promise<ImageLoadResult>((resolve) => {
          const img = new Image();
          let timeoutId: NodeJS.Timeout;
          
          const cleanup = () => clearTimeout(timeoutId);
          
          img.onload = () => {
            cleanup();
            resolve({ url, loaded: true, priority });
          };
          
          img.onerror = () => {
            cleanup();
            resolve({ url, loaded: false, priority });
          };
          
          // Add timeout to prevent hanging on bad URLs
          timeoutId = setTimeout(() => {
            cleanup();
            resolve({ url, loaded: false, priority });
          }, PRELOAD_CONFIG.imageLoadTimeout);
          
          img.src = url;
        });
      });
      
      const batchResults = await Promise.all(promises);
      batchResults.forEach(r => results.push(r));
    }
    
    return batchResults;
  };

  // Load images in priority order
  // Priority 1: Critical images (currently visible)
  if (imagesByPriority.critical.length > 0) {
    await loadWithPriority(imagesByPriority.critical, 'critical', PRELOAD_CONFIG.maxConcurrentCritical);
  }

  // Priority 2: High images (next page)
  if (imagesByPriority.high.length > 0) {
    await loadWithPriority(imagesByPriority.high, 'high', PRELOAD_CONFIG.maxConcurrentHigh);
  }

  // Priority 3: Low images (future pages) - load with lower concurrency
  if (imagesByPriority.low.length > 0) {
    await loadWithPriority(imagesByPriority.low, 'low', PRELOAD_CONFIG.maxConcurrentLow);
  }

  return results;
};

/**
 * Extract image URLs from content object recursively
 */
const extractImageUrls = (obj: any): string[] => {
  const urls: string[] = [];

  const traverse = (value: any) => {
    if (!value) return;

    if (typeof value === 'string' && (value.startsWith('http') || value.startsWith('/images'))) {
      // Likely an image URL
      if (value.includes('jpg') || value.includes('png') || value.includes('jpeg') || value.includes('webp')) {
        urls.push(value);
      }
    } else if (Array.isArray(value)) {
      value.forEach(traverse);
    } else if (typeof value === 'object') {
      Object.values(value).forEach(traverse);
    }
  };

  traverse(obj);
  return [...new Set(urls)]; // Remove duplicates
};

/**
 * Categorize images by priority based on content context
 * Critical: Main page images (likely in hero/header)
 * High: Secondary content (listings, cards)
 * Low: Future navigation images (related products)
 */
const categorizeImages = (
  allImages: string[]
): { critical: string[]; high: string[]; low: string[] } => {
  const critical: string[] = [];
  const high: string[] = [];
  const low: string[] = [];

  allImages.forEach((url, index) => {
    // Heuristic: First few images are usually hero/critical
    if (index < PRELOAD_CONFIG.maxCriticalImagesPerPage) {
      critical.push(url);
    }
    // Next batch are important content images
    else if (index < PRELOAD_CONFIG.maxCriticalImagesPerPage + PRELOAD_CONFIG.maxHighImagesPerPage) {
      high.push(url);
    }
    // Rest are low priority
    else if (index < PRELOAD_CONFIG.maxCriticalImagesPerPage + PRELOAD_CONFIG.maxHighImagesPerPage + PRELOAD_CONFIG.maxLowImagesPerPage) {
      low.push(url);
    }
    // Beyond limits, skip
  });

  return { critical, high, low };
};

const preloadStrategies: Record<string, PreloadStrategy> = {
  homePage: {
    name: 'Home Page',
    execute: async () => {
      const { setHomePageContent, setHomePageFooter, setHomePageComplex } = usePageContentStore.getState();

      try {
        // PRIORITY 1: Load JSON data first (fastest, essential for rendering)
        const [homeContent, footerResponse] = await Promise.all([
          getHomePageContent(),
          getFooterData(),
        ]);

        setHomePageContent(homeContent);
        setHomePageFooter(footerResponse.data);

        // PRIORITY 2: Load images for the first complex
        let complexImages: string[] = [];
        
        if (homeContent.projects?.[0]) {
          try {
            const complexData = await getApartmentComplexPageContent(homeContent.projects[0].id);
            setHomePageComplex(complexData);

            // PRIORITY 3: Preload images from current page content
            const homeImages = extractImageUrls(homeContent);
            complexImages = extractImageUrls(complexData);

            const categorized = categorizeImages([...homeImages, ...complexImages]);
            await preloadImages(categorized);
          } catch (error) {
            // Silently continue on error
          }
        } else {
          // Preload images from home content only
          const homeImages = extractImageUrls(homeContent);
          const categorized = categorizeImages(homeImages);
          await preloadImages(categorized);
        }
      } catch (error) {
        console.error(`[Preload] Error loading home page content:`, error);
      }
    },
  },

  complexesPage: {
    name: 'Complexes Page',
    execute: async () => {
      const { setComplexesPageContent } = usePageContentStore.getState();

      try {
        // PRIORITY 1: Load JSON data
        const content = await getApartmentComplexesPageContent();
        setComplexesPageContent(content);
        
        // PRIORITY 2: Load images from content
        const images = extractImageUrls(content);
        // Add static top image
        images.push(new URL('../../images/ApartmentComplexesPage1.jpg', import.meta.url).href);
        
        const categorized = categorizeImages(images);
        await preloadImages(categorized);
      } catch (error) {
        console.error(`[Preload] Error loading complexes page:`, error);
      }
    },
  },

  aboutPage: {
    name: 'About Us Page',
    execute: async () => {
      const { setAboutUsPageContent, setHomePageFooter } = usePageContentStore.getState();

      try {
        // PRIORITY 1: Load JSON data
        const [aboutContent, footerResponse] = await Promise.all([
          getAboutUsPageContent(),
          getFooterData(),
        ]);
        
        setAboutUsPageContent(aboutContent);
        setHomePageFooter(footerResponse.data);
        
        // PRIORITY 2: Load images from content
        const images = extractImageUrls(aboutContent);
        const categorized = categorizeImages(images);
        await preloadImages(categorized);
      } catch (error) {
        console.error(`[Preload] Error loading about page:`, error);
      }
    },
  },

  apartmentsPage: {
    name: 'Apartments Page',
    execute: async () => {
      const { setApartmentsPageContent } = usePageContentStore.getState();

      try {
        // PRIORITY 1: Load JSON data
        const content = await getApartmentsPageContent();
        setApartmentsPageContent(content);
        
        // PRIORITY 2: Load images from content
        const images = extractImageUrls(content);
        // Add static top image
        images.push(new URL('../../images/ApartmentsPage1.jpg', import.meta.url).href);
        
        const categorized = categorizeImages(images);
        await preloadImages(categorized);
      } catch (error) {
        console.error(`[Preload] Error loading apartments page:`, error);
      }
    },
  },

  complexPage: {
    name: 'Complex Pages',
    execute: async () => {
      const { complexesPageContent, setComplexPageContent, setComplexPageApartments } = usePageContentStore.getState();
      
      try {
        // PRIORITY 1: Load complexes list if needed
        let complexesList = complexesPageContent;
        if (!complexesList || complexesList.length === 0) {
          complexesList = await getApartmentComplexesPageContent();
        }

        // PRIORITY 2: Load only first 2 complexes (not 3) to reduce bandwidth
        const complexesToPreload = complexesList.slice(0, 2);
        const images: string[] = [];

        for (const complex of complexesToPreload) {
          try {
            const [complexData, apartments] = await Promise.all([
              getApartmentComplexPageContent(complex.id),
              getApartmentsForComplex(complex.id),
            ]);

            setComplexPageContent(complex.id, complexData);
            setComplexPageApartments(complex.id, apartments);

            // Extract images from both complex and apartments
            images.push(...extractImageUrls(complexData));
            images.push(...extractImageUrls(apartments));
          } catch (error) {
            console.error(`[Preload] Error loading complex ${complex.id}:`, error);
          }
        }

        // PRIORITY 3: Load extracted images with categorization
        const uniqueImages = [...new Set(images)]; // Remove duplicates
        const categorized = categorizeImages(uniqueImages);
        await preloadImages(categorized);
      } catch (error) {
        console.error(`[Preload] Error loading complex pages:`, error);
      }
    },
  },
};

/**
 * Execute a specific preload strategy
 */
export const executePreloadStrategy = async (strategyName: string) => {
  const strategy = preloadStrategies[strategyName];

  if (!strategy) {
    return;
  }

  await strategy.execute();
};

/**
 * Execute multiple preload strategies in parallel
 * Useful for preloading multiple pages on app startup
 */
export const executePreloadStrategies = async (strategyNames: string[]) => {
  const validStrategies = strategyNames
    .map(name => preloadStrategies[name])
    .filter(Boolean);

  if (validStrategies.length === 0) {
    return;
  }
  
  try {
    await Promise.all(validStrategies.map(s => s.execute()));
  } catch (error) {
    // Silently continue on error
  }
};

/**
 * Get all available strategy names
 */
export const getAvailableStrategies = () => Object.keys(preloadStrategies);
