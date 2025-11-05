/**
 * Generic page preload manager
 * Centralized place to define and manage preload strategies for each page
 * Keeps App.tsx clean and makes it easy to add new pages
 */

import { usePageContentStore } from './pageContent.store';
import {
  getHomePageContent,
  getFooterData,
  getApartmentComplexPageContent,
  getApartmentComplexesPageContent,
  getAboutUsPageContent,
  getApartmentsPageContent,
} from '../services/api/pages.api.requests';

interface PreloadStrategy {
  name: string;
  execute: () => Promise<void>;
}

/**
 * Preload images by URL
 * Loads images in background without rendering them
 */
const preloadImages = async (imageUrls: string[]): Promise<void> => {
  const promises = imageUrls
    .filter(Boolean)
    .map(url => {
      return new Promise<void>((resolve) => {
        const img = new Image();
        img.onload = () => resolve();
        img.onerror = () => resolve(); // Still resolve on error to not block
        img.src = url;
      });
    });

  await Promise.all(promises);
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

const preloadStrategies: Record<string, PreloadStrategy> = {
  homePage: {
    name: 'Home Page',
    execute: async () => {
      const { setHomePageContent, setHomePageFooter, setHomePageComplex } = usePageContentStore.getState();

      try {
        const [homeContent, footerResponse] = await Promise.all([
          getHomePageContent(),
          getFooterData(),
        ]);

        setHomePageContent(homeContent);
        setHomePageFooter(footerResponse.data);

        // Also preload the complex data for the first project if it exists
        if (homeContent.projects?.[0]) {
          try {
            const complexData = await getApartmentComplexPageContent(homeContent.projects[0].id);
            setHomePageComplex(complexData);

            // Extract and preload images from both home and complex content
            const homeImages = extractImageUrls(homeContent);
            const complexImages = extractImageUrls(complexData);
            await preloadImages([...homeImages, ...complexImages]);
          } catch (error) {
            console.error(`[Preload] Error loading home page complex data:`, error);
          }
        } else {
          // Preload images from home content only
          const homeImages = extractImageUrls(homeContent);
          await preloadImages(homeImages);
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
        const content = await getApartmentComplexesPageContent();
        setComplexesPageContent(content);
        
        const images = extractImageUrls(content);
        // Add static top image
        images.push(new URL('../../images/ApartmentComplexesPage1.jpg', import.meta.url).href);
        
        await preloadImages(images);
        console.log(`[Preload] Complexes page preloaded`);
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
        const [aboutContent, footerResponse] = await Promise.all([
          getAboutUsPageContent(),
          getFooterData(),
        ]);
        
        setAboutUsPageContent(aboutContent);
        setHomePageFooter(footerResponse.data);
        
        // Extract and preload images
        const images = extractImageUrls(aboutContent);
        await preloadImages(images);
        
        console.log(`[Preload] About page preloaded`);
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
        const content = await getApartmentsPageContent();
        setApartmentsPageContent(content);
        
        const images = extractImageUrls(content);
        // Add static top image
        images.push(new URL('../../images/ApartmentsPage1.jpg', import.meta.url).href);
        
        await preloadImages(images);
        console.log(`[Preload] Apartments page preloaded`);
      } catch (error) {
        console.error(`[Preload] Error loading apartments page:`, error);
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
    console.warn(`[Preload] Strategy "${strategyName}" not found`);
    return;
  }

  console.log(`[Preload] Starting: ${strategy.name}`);
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
    console.warn(`[Preload] No valid strategies found`);
    return;
  }

  console.log(`[Preload] Starting batch preload: ${validStrategies.map(s => s.name).join(', ')}`);
  
  try {
    await Promise.all(validStrategies.map(s => s.execute()));
    console.log(`[Preload] ✅ Batch preload complete`);
  } catch (error) {
    console.error(`[Preload] ❌ Error during batch preload:`, error);
  }
};

/**
 * Get all available strategy names
 */
export const getAvailableStrategies = () => Object.keys(preloadStrategies);
