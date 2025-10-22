import { create } from "zustand";
import type {
  BidRequest,
  Category,
  CategoryRequest,
  FlatWithCategoryRequest,
  Layout,
  LayoutRequest,
  Photo,
} from "../services";
import {
  createCategory,
  updateCategory,
  deleteCategory,
  createFlat,
  updateFlat,
  deleteFlat,
  createLayout,
  updateLayout,
  deleteLayout,
  deletePhoto,
  updatePhoto,
  bulkDeletePhotos,
} from "../services";
import { useFlatsStore } from "./flats.store.ts";
import { type BidForm, initialBidForm } from "./ui.store.ts";
import { useContentManagerStore } from "./contentManager.store.ts";

export interface ContentState {
  categories: Category[];
  flats: FlatWithCategoryRequest[];
  photos: Photo[];
  layouts: Layout[];

  selectedCategory: Category | null;
  selectedFlat: FlatWithCategoryRequest | null;
  selectedPhoto: Photo | null;
  selectedLayout: LayoutRequest | null;

  categoryForm: Partial<CategoryRequest>;
  flatForm: Partial<FlatWithCategoryRequest>;
  bidForm: Partial<BidRequest>;
  layoutForm: Partial<LayoutRequest>;

  loading: {
    categories: boolean;
    flats: boolean;
    photos: boolean;
    uploading: boolean;
    saving: boolean;
    deleting: boolean;
    layouts: boolean;
  };

  errors: {
    [key: string]: string | null;
  };

  ui: {
    activeTab: "flats" | "apartmentComplexes" | "categories" | "photos" | "bids" | "layouts";
    showForm: boolean;
    editMode: boolean;
    selectedPhotoIds: number[];
    bulkActionMode: boolean;
  };

  stats: {
    totalFlats: number;
    totalCategories: number;
    totalPhotos: number;
    lastUpdated: number | null;
    totalBids: number;
  };
}

export interface ContentActions {
  saveCategory: (data: Category) => Promise<boolean>;
  removeCategory: (id: number) => Promise<boolean>;
  editCategory: (category: Category) => void;

  saveFlat: (data: FlatWithCategoryRequest) => Promise<boolean>;
  removeFlat: (id: number) => Promise<boolean>;
  editFlat: (flat: FlatWithCategoryRequest) => void;

  saveLayout: (data: LayoutRequest) => Promise<boolean>;
  removeLayout: (id: number) => Promise<boolean>;
  editLayout: (layout: LayoutRequest) => void;

  loadPhotos: () => Promise<void>;
  uploadPhotos: (files: File[]) => Promise<boolean>;
  updatePhotoData: (id: number, altText: string) => Promise<boolean>;
  removePhoto: (id: number) => Promise<boolean>;
  removeSelectedPhotos: () => Promise<boolean>;
  selectPhoto: (id: number, selected: boolean) => void;
  selectAllPhotos: (selected: boolean) => void;

  setCategoryForm: (form: Partial<CategoryRequest>) => void;
  setFlatForm: (form: Partial<FlatWithCategoryRequest>) => void;
  setBidForm: (form: Partial<BidForm>) => void;
  resetForms: () => void;

  setActiveTab: (tab: ContentState["ui"]["activeTab"]) => void;
  setShowForm: (show: boolean) => void;
  setEditMode: (edit: boolean) => void;
  setBulkActionMode: (mode: boolean) => void;

  setError: (key: string, error: string | null) => void;
  clearErrors: () => void;

  updateStats: () => void;

  setLoading: (key: keyof ContentState["loading"], loading: boolean) => void;
}

const initialCategoryForm: Partial<CategoryRequest> = {
  name: "",
  isOnMainPage: false,
};

const initialFlatForm: Partial<FlatWithCategoryRequest> = {
  flat: {
    name: "",
    description: "",
    numberOfRooms: 1,
    homeId: null,
    variants: [],
  },
};

const initialLayoutForm: Partial<LayoutRequest> = {
  id: 0,
  layoutImage: "",
};

export const useContentStore = create<ContentState & ContentActions>(
  (set, get) => ({
    categories: [],
    flats: [],
    homes: [],
    photos: [],
    layouts: [],

    selectedCategory: null,
    selectedFlat: null,
    selectedHome: null,
    selectedPhoto: null,
    selectedLayout: null,

    categoryForm: initialCategoryForm,
    flatForm: initialFlatForm,
    layoutForm: initialLayoutForm,
    bidForm: initialBidForm,

    loading: {
      categories: false,
      flats: false,
      homes: false,
      photos: false,
      uploading: false,
      saving: false,
      deleting: false,
      layouts: false,
    },

    errors: {},

    ui: {
      activeTab: "flats",
      showForm: false,
      editMode: false,
      selectedPhotoIds: [],
      bulkActionMode: false,
    },

    stats: {
      totalFlats: 0,
      totalHomes: 0,
      totalCategories: 0,
      totalPhotos: 0,
      lastUpdated: null,
      totalBids: 0,
    },

    saveCategory: async (data) => {
      set({ loading: { ...get().loading, saving: true } });
      try {
        const { selectedCategory } = get();
        if (selectedCategory?.id) {
          await updateCategory(selectedCategory.id, data);
        } else {
          await createCategory(data);
        }
        await useFlatsStore.getState().loadCategories();
        get().resetForms();
        get().setShowForm(false);
        set({ loading: { ...get().loading, saving: false } });
        return true;
      } catch (error) {
        set({
          loading: { ...get().loading, saving: false },
          errors: {
            ...get().errors,
            saveCategory: error instanceof Error ? error.message : "fail",
          },
        });
        return false;
      }
    },

    removeCategory: async (id) => {
      set({ loading: { ...get().loading, deleting: true } });
      try {
        await deleteCategory(id);
        await useFlatsStore.getState().loadCategories();
        set({ loading: { ...get().loading, deleting: false } });
        return true;
      } catch (error) {
        set({
          loading: { ...get().loading, deleting: false },
          errors: {
            ...get().errors,
            removeCategory: error instanceof Error ? error.message : "fail",
          },
        });
        return false;
      }
    },

    editCategory: (category) => {
      set({
        selectedCategory: category,
        categoryForm: {
          name: category.name,
          isOnMainPage: category.isOnMainPage,
        },
        ui: { ...get().ui, showForm: true, editMode: true },
      });
    },

    saveFlat: async (data) => {
      set({ loading: { ...get().loading, saving: true } });
      try {
        const { selectedFlat } = get();
        if (selectedFlat?.flat?.id) {
          await updateFlat(Number(selectedFlat.flat.id), data);
        } else {
          await createFlat(data);
        }
        await useFlatsStore.getState().loadFlats();
        get().resetForms();
        get().setShowForm(false);
        set({ loading: { ...get().loading, saving: false } });
        return true;
      } catch (error) {
        set({
          loading: { ...get().loading, saving: false },
          errors: {
            ...get().errors,
            saveFlat: error instanceof Error ? error.message : "fail",
          },
        });
        return false;
      }
    },

    removeFlat: async (id) => {
      set({ loading: { ...get().loading, deleting: true } });
      try {
        await deleteFlat(id);
        await useFlatsStore.getState().loadFlats();
        set({ loading: { ...get().loading, deleting: false } });
        return true;
      } catch (error) {
        set({
          loading: { ...get().loading, deleting: false },
          errors: {
            ...get().errors,
            removeFlat: error instanceof Error ? error.message : "fail",
          },
        });
        return false;
      }
    },

    editFlat: (flat) => {
      set({
        selectedFlat: flat,
        flatForm: { ...flat },
        ui: { ...get().ui, showForm: true, editMode: true },
      });
    },

    saveLayout: async (data: LayoutRequest) => {
      set({ loading: { ...get().loading, saving: true } });
      try {
        const { selectedLayout } = get();
        if (selectedLayout?.id) {
          await updateLayout(selectedLayout.id, data);
        } else {
          await createLayout(data);
        }
        await useFlatsStore.getState().loadLayouts();
        get().resetForms();
        get().setShowForm(false);
        set({ loading: { ...get().loading, saving: false } });
        return true;
      } catch (error) {
        set({
          loading: { ...get().loading, saving: false },
          errors: {
            ...get().errors,
            saveLayout: error instanceof Error ? error.message : "fail",
          },
        });
        return false;
      }
    },

    removeLayout: async (id: number) => {
      set({ loading: { ...get().loading, deleting: true } });
      try {
        await deleteLayout(id);
        await useFlatsStore.getState().loadLayouts();
        set({ loading: { ...get().loading, deleting: false } });
        return true;
      } catch (error) {
        set({
          loading: { ...get().loading, deleting: false },
          errors: {
            ...get().errors,
            removeLayout: error instanceof Error ? error.message : "fail",
          },
        });
        return false;
      }
    },

    editLayout: (data: LayoutRequest) => {
      set({
        selectedLayout: data,
        layoutForm: {
          id: data.id,
          layoutImage: data.layoutImage,
        },
        ui: { ...get().ui, showForm: true, editMode: true },
      });
    },

    loadPhotos: async () => {
      set({ loading: { ...get().loading, photos: true } });
      try {
        set({
          loading: { ...get().loading, photos: false },
          photos: [],
        });
        get().updateStats();
      } catch (error) {
        set({
          loading: { ...get().loading, photos: false },
          errors: {
            ...get().errors,
            photos: error instanceof Error ? error.message : "fail",
          },
        });
      }
    },

    uploadPhotos: async (files: File[]) => {
      // stub: реализуй через соответствующий сервис
      console.log("uploadPhotos", files);
      return true;
    },

    updatePhotoData: async (id, altText) => {
      try {
        await updatePhoto(id, undefined, altText);
        await get().loadPhotos();
        return true;
      } catch (error) {
        set({
          errors: {
            ...get().errors,
            updatePhoto: error instanceof Error ? error.message : "fail",
          },
        });
        return false;
      }
    },

    removePhoto: async (id) => {
      set({ loading: { ...get().loading, deleting: true } });
      try {
        await deletePhoto(id);
        await get().loadPhotos();
        set({ loading: { ...get().loading, deleting: false } });
        return true;
      } catch (error) {
        set({
          loading: { ...get().loading, deleting: false },
          errors: {
            ...get().errors,
            removePhoto: error instanceof Error ? error.message : "fail",
          },
        });
        return false;
      }
    },

    removeSelectedPhotos: async () => {
      const { ui } = get();
      set({ loading: { ...get().loading, deleting: true } });
      try {
        await bulkDeletePhotos(ui.selectedPhotoIds);
        await get().loadPhotos();
        set({
          loading: { ...get().loading, deleting: false },
          ui: { ...ui, selectedPhotoIds: [], bulkActionMode: false },
        });
        return true;
      } catch (error) {
        set({
          loading: { ...get().loading, deleting: false },
          errors: {
            ...get().errors,
            removeSelectedPhotos:
              error instanceof Error ? error.message : "fail",
          },
        });
        return false;
      }
    },

    selectPhoto: (id, selected) => {
      const { ui } = get();
      const selectedPhotoIds = selected
        ? [...ui.selectedPhotoIds, id]
        : ui.selectedPhotoIds.filter((pid) => pid !== id);
      set({ ui: { ...ui, selectedPhotoIds } });
    },

    selectAllPhotos: (selected) => {
      const { photos, ui } = get();
      const selectedPhotoIds = selected ? photos.map((p) => p.id) : [];
      set({ ui: { ...ui, selectedPhotoIds } });
    },

    // Forms
    setCategoryForm: (form) =>
      set((state) => ({ categoryForm: { ...state.categoryForm, ...form } })),
    setFlatForm: (form) =>
      set((state) => ({ flatForm: { ...state.flatForm, ...form } })),
    setBidForm: (form) =>
      set((state) => ({ bidForm: { ...state.bidForm, ...form } })),

    resetForms: () => {
      useContentManagerStore.setState({ selectedBid: null });
      set({
        categoryForm: initialCategoryForm,
        flatForm: initialFlatForm,
        layoutForm: initialLayoutForm,
        bidForm: initialBidForm,
        selectedCategory: null,
        selectedFlat: null,
        selectedPhoto: null,
      });
    },

    // UI
    setActiveTab: (activeTab) =>
      set((state) => ({ ui: { ...state.ui, activeTab } })),
    setShowForm: (showForm) => {
      set((state) => ({
        ui: {
          ...state.ui,
          showForm,
          editMode: showForm ? state.ui.editMode : false,
        },
      }));
      if (!showForm) get().resetForms();
    },
    setEditMode: (editMode) =>
      set((state) => ({ ui: { ...state.ui, editMode } })),
    setBulkActionMode: (bulkActionMode) =>
      set((state) => ({
        ui: {
          ...state.ui,
          bulkActionMode,
          selectedPhotoIds: [],
        },
      })),

    // Errors / stats / misc
    setError: (key, error) =>
      set((state) => ({
        errors: {
          ...state.errors,
          [key]: error,
        },
      })),
    clearErrors: () => set({ errors: {} }),

    updateStats: () => {
      const { flats, categories, photos } = get();
      set({
        stats: {
          totalFlats: flats.length,
          totalCategories: categories.length,
          totalPhotos: photos.length,
          lastUpdated: Date.now(),
          totalBids: useContentManagerStore.getState().bids.length,
        },
      });
    },

    setLoading: (key, loading) =>
      set((state) => ({
        loading: {
          ...state.loading,
          [key]: loading,
        },
      })),
  }),
);
