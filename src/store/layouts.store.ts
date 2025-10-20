import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  type Category,
  getCategories,
  getFlatsByCategory,
  getHomes,
  getLayouts,
  type HomePageFlats,
  type Layout,
  type ResolvedHome,
  type SearchRequest,
} from "../services";
import { usePhotoStore } from "./usePhotoStore.ts";
import { publishChecker } from "../utils/publishChecker.ts";

export interface layoutsState {
  layouts: Layout[];
  homes: ResolvedHome[];
  categories: Category[];
  searchResults: Layout[];

  homePageFlats: HomePageFlats[];
  flatsByHome: Layout[];

  selectedCategory: Category | null;
  selectedFlat: Layout | null;
  selectedHome: ResolvedHome | null;
  selectedLayout: Layout | null;

  isLoadingFlats: boolean;
  isLoadingHomes: boolean;
  isLoadingCategories: boolean;
  isLoadingHomePageFlats: boolean;
  isLoadingFilters: boolean;
  isLoadingLayouts: boolean;

  isSearching: boolean;

  error: string | null;
  searchError: string | null;

  currentSearchParams: SearchRequest;
  hasSearched: boolean;

  currentPage: number;
  totalPages: number;
  totalResults: number;
  limit: number;

  lastFetch: {
    flats: number | null;
    homes: number | null;
    categories: number | null;
    homePageFlats: number | null;
    layouts: number | null;
  };
}

export interface flatsActions {
  loadLayouts: (force?: boolean) => Promise<void>;
  loadHomes: (force?: boolean) => Promise<void>;
  loadCategories: (force?: boolean) => Promise<void>;

  loadHomePageFlats: (force?: boolean) => Promise<void>;
  loadAllData: (force?: boolean) => Promise<void>;

  loadFlatsByHome: (homeId: number) => Promise<Layout[]>;

  getHomeById: (id: number) => Promise<ResolvedHome | null>;

  setSelectedFlat: (flat: Layout | null) => void;
  setSelectedHome: (home: ResolvedHome | null) => void;
  setSelectedCategory: (category: Category | null) => void;

  setFilters: (filters: Partial<SearchRequest>) => void;

  setPage: (page: number) => void;
  setLimit: (limit: number) => void;

  searchFlats: (page?: number) => Promise<void>;
  clearSearch: () => void;
  resetFilters: () => void;

  setError: (error: string | null) => void;
  setSearchError: (error: string | null) => void;
  clearErrors: () => void;

  invalidateCache: () => void;
  isDataStale: (
    type: "flats" | "homes" | "categories" | "homePageFlats" | "layouts",
  ) => boolean;
}

const defaultFilters: SearchRequest = {
  sortBy: "price",
  sortOrder: "asc",
};

const CACHE_DURATION = 5 * 60 * 1000;

export const useLayoutsStore = create<layoutsState & flatsActions>()(
  persist(
    (set, get) => ({
      flats: [],
      homes: [],
      categories: [],
      layouts: [],

      searchResults: [],

      currentPage: 1,
      totalPages: 1,
      totalResults: 0,
      limit: 20,

      homePageFlats: [],
      flatsByHome: [],

      selectedFlat: null,
      selectedHome: null,
      selectedCategory: null,
      selectedLayout: null,

      isLoadingFlats: false,
      isLoadingHomes: false,
      isLoadingCategories: false,
      isLoadingHomePageFlats: false,
      isSearching: false,
      isLoadingFilters: false,
      isLoadingLayouts: false,

      error: null,
      searchError: null,

      currentSearchParams: defaultFilters,
      hasSearched: false,

      lastFetch: {
        flats: null,
        homes: null,
        categories: null,
        homePageFlats: null,
        layouts: null,
      },

      isDataStale: (
        type: "flats" | "homes" | "categories" | "homePageFlats" | "layouts",
      ) => {
        const lastFetch = get().lastFetch[type];
        if (!lastFetch) return true;
        return Date.now() - lastFetch > CACHE_DURATION;
      },

      loadHomes: async (force = false) => {
        const { isDataStale } = get();
        if (!force && !isDataStale("homes")) return;

        set({ isLoadingHomes: true, error: null });
        try {
          const homes = await getHomes();
          const published = homes.filter(publishChecker);
          const resolved = await Promise.all(
            published.map(usePhotoStore.getState().processHome),
          );
          set((state) => ({
            homes: resolved,
            isLoadingHomes: false,
            lastFetch: { ...state.lastFetch, homes: Date.now() },
          }));
        } catch (error) {
          set({
            error:
              error instanceof Error ? error.message : "Failed to load homes",
            isLoadingHomes: false,
          });
        }
      },

      resetFilters: () => {
        set({
          currentSearchParams: defaultFilters,
          currentPage: 1,
          hasSearched: false,
          searchError: null,
        });
      },

      loadCategories: async (force = false) => {
        const { isDataStale } = get();
        if (!force && !isDataStale("categories")) return;

        set({ isLoadingCategories: true, error: null });
        try {
          const categories = await getCategories();
          set((state) => ({
            categories,
            isLoadingCategories: false,
            lastFetch: { ...state.lastFetch, categories: Date.now() },
          }));
        } catch (error) {
          set({
            error:
              error instanceof Error
                ? error.message
                : "Failed to load categories",
            isLoadingCategories: false,
          });
        }
      },

      loadLayouts: async (force = false) => {
        const { isDataStale } = get();
        if (!force && !isDataStale("layouts")) return;

        set({ isLoadingCategories: true, error: null });
        try {
          const layouts = await getLayouts();
          set((state) => ({
            layouts,
            isLoadingLayouts: false,
            lastFetch: { ...state.lastFetch, layouts: Date.now() },
          }));
        } catch (error) {
          set({
            error:
              error instanceof Error ? error.message : "Failed to load layouts",
            isLoadingLayouts: false,
          });
        }
      },

      loadHomePageFlats: async (force = false) => {
        const { isDataStale, categories } = get();
        if (!force && !isDataStale("homePageFlats")) return;

        const homePageCategories = categories.filter((c) => c.isOnMainPage);
        if (homePageCategories.length === 0) return;

        set({ isLoadingHomePageFlats: true, error: null });

        try {
          const resolved = await Promise.allSettled(
            homePageCategories.map(async (category) => {
              const flats = await getFlatsByCategory(category.id);
              const published = flats.filter(publishChecker);
              const resolved = await Promise.all(
                published.map(usePhotoStore.getState().processFlat),
              );
              return { category, flats: resolved };
            }),
          );

          const homePageFlats: HomePageFlats[] = resolved
            .filter((r) => r.status === "fulfilled")
            .map((r) => (r as PromiseFulfilledResult<HomePageFlats>).value);

          set((state) => ({
            homePageFlats,
            isLoadingHomePageFlats: false,
            lastFetch: { ...state.lastFetch, homePageFlats: Date.now() },
          }));
        } catch (error) {
          set({
            error:
              error instanceof Error
                ? error.message
                : "Failed to load home page flats",
            isLoadingHomePageFlats: false,
          });
        }
      },

      getHomeById: async (id: number) => {
        await get().loadHomes();
        const loadedHome = get().homes.find((h) => h.id === id);
        if (loadedHome) {
          set({ selectedHome: loadedHome });
        }

        return loadedHome || null;
      },

      loadAllData: async (force = false) => {
        const { loadLayouts, loadHomes, loadCategories } = get();

        await Promise.allSettled([
          loadLayouts(force),
          loadHomes(force),
          loadCategories(force),
        ]);

        await get().loadHomePageFlats(force);
      },

      loadFlatsByHome: async (homeId: number) => {
        try {
          await get().loadLayouts(true);
          const { layouts } = get();

          const published = layouts.filter(
            (item) => publishChecker(item) && item.homeId === homeId,
          );

          set({ flatsByHome: published });

          return published;
        } catch {
          set({ error: "Failed to fetch flats by home" });
          set({ flatsByHome: [] });

          return [];
        }
      },

      setFilters: (newFilters: Partial<SearchRequest>) => {
        set((state) => ({
          currentSearchParams: { ...state.currentSearchParams, ...newFilters },
          currentPage: 1,
        }));
      },

      searchFlats: async (page?: number) => {
        const { currentSearchParams, limit } = get();
        const pageToUse = page ?? get().currentPage;

        set({
          isSearching: true,
          searchError: null,
          hasSearched: true,
        });

        try {
          const searchResults = await getLayouts(currentSearchParams);
          const published = searchResults.filter(publishChecker);

          const totalResults = published.length;
          const totalPages = Math.max(1, Math.ceil(totalResults / limit));
          const normalizedPage = Math.min(Math.max(1, pageToUse), totalPages);

          set({
            currentPage: normalizedPage,
            totalResults,
            totalPages,
            searchResults: published,
            isSearching: false,
          });
        } catch (error) {
          set({
            searchError:
              error instanceof Error ? error.message : "Search failed",
            isSearching: false,
          });
        }
      },

      setPage: (page: number) => {
        set((state) => {
          const normalized = Math.min(Math.max(1, page), state.totalPages);
          return { currentPage: normalized };
        });
      },

      setLimit: (limit: number) => {
        set((state) => {
          const totalPages = Math.max(1, Math.ceil(state.totalResults / limit));
          const currentPage = Math.min(state.currentPage, totalPages);
          return { limit, totalPages, currentPage };
        });
      },

      setSelectedFlat: (flat: Layout | null) => {
        set({ selectedFlat: flat });
      },

      setSelectedHome: (home: ResolvedHome | null) => {
        set({ selectedHome: home });
      },

      setSelectedCategory: (category: Category | null) => {
        set({ selectedCategory: category });
      },

      invalidateCache: () => {
        set({
          lastFetch: {
            categories: null,
            flats: null,
            homes: null,
            homePageFlats: null,
            layouts: null,
          },
        });
      },

      clearSearch: () => {
        const { layouts } = get();
        set({
          searchResults: layouts,
          currentSearchParams: defaultFilters,
          hasSearched: false,
          searchError: null,
          currentPage: 1,
          totalPages: 1,
          totalResults: 0,
        });
      },

      setError: (error: string | null) => set({ error }),
      setSearchError: (searchError: string | null) => set({ searchError }),
      clearErrors: () => set({ error: null, searchError: null }),
    }),
    {
      name: "layouts-store",
      version: 1,
      partialize: (state) => ({
        layouts: state.layouts,
        homes: state.homes,
        homePageFlats: state.homePageFlats,
        categories: state.categories,
        searchResults: state.searchResults,
        flatsByHome: state.flatsByHome,

        currentSearchParams: state.currentSearchParams,
        currentPage: state.currentPage,
        limit: state.limit,
        hasSearched: state.hasSearched,
      }),
    },
  ),
);
