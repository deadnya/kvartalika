import { useState, useMemo, useCallback, useEffect } from "react";
import { type BidForm } from "../../store/ui.store.ts";
import type {
  FlatWithCategoryRequest,
  Category,
  CategoryRequest,
  LayoutRequest,
} from "../../services";
import type { ApartmentComplexPageContent } from "../../services/api/pages.api.types";
import { putApartmentComplex, postApartmentComplex } from "../../services/api/pages.api.requests";
import ContentEditor, { type ContentType } from "./ContentEditor.tsx";
import { useDebounce } from "../../hooks/useDebounce.ts";
import { useContentStore } from "../../store/content.store.ts";
import { useFlatsStore } from "../../store/flats.store.ts";
import { useContentManagerStore } from "../../store/contentManager.store.ts";

const TABS: Array<ContentType> = ["flat", "apartmentComplex", "category", "bid", "layout"];
type PayLoadType = FlatWithCategoryRequest | ApartmentComplexPageContent | CategoryRequest | BidForm;

const GUIDE: Record<string, string> = {
  flats:
    "Квартиры: создавайте, редактируйте и удаляйте квартиры. Используйте поиск для фильтрации по адресу или ID.",
  apartmentComplexes:
    "Жилые комплексы: создавайте и редактируйте информацию о жилых комплексах с полной поддержкой истории строительства, удобств и технологий.",
  categories:
    "Категории: держите классификацию актуальной. Назначайте категории на объекты.",
  bids: "Заявки: просматривайте входящие заявки, отмечайте как просмотренные и редактируйте.",
  layouts:
    "Планировки: создавайте, редактируйте и удаляйте планировки. Используйте поиск для фильтрации по ID.",
};

const ContentManagementSection = () => {
  const {
    ui,
    selectedFlat,
    selectedCategory,
    selectedLayout,
    saveFlat,
    saveLayout,
    saveCategory,
    editFlat,
    editLayout,
    editCategory,
    removeFlat,
    removeLayout,
    removeCategory,
    setActiveTab,
    setShowForm,
    setEditMode,
    loading,
  } = useContentStore();

  const {
    loadFlats,
    loadHomes,
    loadCategories,
    loadLayouts,
    flats,
    homes,
    categories,
    layouts,
  } = useFlatsStore();

  const {
    bids,
    selectedBid,
    getBids,
    editBid,
    saveBid,
    removeBid,
    isLoadingBids,
  } = useContentManagerStore();

  // Apartment Complex State - we reuse homes since they're the same endpoint
  const [selectedApartmentComplex, setSelectedApartmentComplex] = useState<ApartmentComplexPageContent | null>(null);

  const [filter, setFilter] = useState("");
  const debouncedFilter = useDebounce(filter, 250);

  const activeContentType: ContentType = useMemo(() => {
    if (ui.activeTab === "flats") return "flat";
    if (ui.activeTab === "apartmentComplexes") return "apartmentComplex";
    if (ui.activeTab === "categories") return "category";
    if (ui.activeTab === "bids") return "bid";
    if (ui.activeTab === "layouts") return "layout";
    return "flat";
  }, [ui.activeTab]);

  const refreshCurrent = useCallback(() => {
    if (ui.activeTab === "bids") {
      void getBids();
    } else if (ui.activeTab === "flats") {
      void loadFlats(true);
    } else if (ui.activeTab === "apartmentComplexes") {
      void loadHomes(true);
    } else if (ui.activeTab === "categories") {
      void loadCategories(true);
    } else if (ui.activeTab === "layouts") {
      void loadLayouts(true);
    }
    setFilter("");
  }, [
    ui.activeTab,
    getBids,
    loadFlats,
    loadHomes,
    loadCategories,
    loadLayouts,
  ]);

  useEffect(() => {
    refreshCurrent();
  }, [refreshCurrent]);

  const switchTab = useCallback(
    (type: ContentType) => {
      if (type === "flat") setActiveTab("flats");
      if (type === "apartmentComplex") setActiveTab("apartmentComplexes");
      if (type === "category") setActiveTab("categories");
      if (type === "bid") setActiveTab("bids");
      if (type === "layout") setActiveTab("layouts");
      setFilter("");
    },
    [setActiveTab],
  );

  const openNew = useCallback(
    (type: ContentType) => {
      setEditMode(false);
      setShowForm(true);
      switchTab(type);
    },
    [setEditMode, setShowForm, switchTab],
  );

  const openEdit = useCallback(
    (type: ContentType, payload: PayLoadType) => {
      if (type === "flat") editFlat(payload as FlatWithCategoryRequest);
      if (type === "apartmentComplex") setSelectedApartmentComplex(payload as ApartmentComplexPageContent);
      if (type === "category") editCategory(payload as Category);
      if (type === "bid") editBid(payload as BidForm);
      if (type === "layout") editLayout(payload as LayoutRequest);
      setEditMode(true);
      setShowForm(true);
      switchTab(type);
    },
    [
      editFlat,
      editCategory,
      editBid,
      editLayout,
      setEditMode,
      setShowForm,
      switchTab,
    ],
  );

  const handleSave = useCallback(
    async (payload: PayLoadType) => {
      console.log("SAVINGGGG");
      if (activeContentType === "flat")
        await saveFlat(payload as FlatWithCategoryRequest);
      if (activeContentType === "apartmentComplex") {
        const complex = payload as ApartmentComplexPageContent;
        if (selectedApartmentComplex?.id) {
          // Edit existing
          await putApartmentComplex(String(selectedApartmentComplex.id), complex);
        } else {
          // Create new - use a placeholder ID for the request
          await postApartmentComplex("0", complex);
        }
      }
      if (activeContentType === "category")
        await saveCategory(payload as Category);
      if (activeContentType === "bid") await saveBid(payload as BidForm);
      if (activeContentType === "layout")
        await saveLayout(payload as LayoutRequest);
      refreshCurrent();
    },
    [
      refreshCurrent,
      activeContentType,
      saveFlat,
      saveLayout,
      saveCategory,
      saveBid,
      selectedApartmentComplex,
    ],
  );

  const handleDelete = useCallback(async () => {
    if (activeContentType === "flat" && selectedFlat?.flat.id)
      await removeFlat(Number(selectedFlat.flat.id));
    if (activeContentType === "apartmentComplex" && selectedApartmentComplex?.id) {
      // TODO: Call API to delete apartment complex
      // For now, just close the form and refresh
      console.log("Delete apartment complex:", selectedApartmentComplex.id);
    }
    if (activeContentType === "category" && selectedCategory?.id)
      await removeCategory(selectedCategory.id);
    if (activeContentType === "bid" && selectedBid?.id)
      await removeBid(selectedBid.id);
    if (activeContentType === "layout" && selectedLayout?.id)
      await removeLayout(selectedLayout.id);
    setShowForm(false);
    refreshCurrent();
  }, [
    refreshCurrent,
    activeContentType,
    selectedFlat,
    selectedApartmentComplex,
    selectedCategory,
    selectedBid,
    selectedLayout,
    removeFlat,
    removeCategory,
    removeBid,
    removeLayout,
    setShowForm,
  ]);

  const currentList = useMemo(() => {
    let base: Array<{
      type: ContentType | "bid";
      payload: PayLoadType;
      label: string;
    }> = [];

    if (activeContentType === "bid") {
      base = bids.map((b) => ({
        type: "bid" as const,
        payload: b,
        label: `${b.id}-${b.name || ""} ${b.email || ""}`.trim(),
      }));
    } else if (activeContentType === "flat") {
      base = flats.map((f) => ({
        type: "flat" as const,
        payload: f,
        label:
          `${f.flat.id} ${f.flat.address || ""} ${f.flat.homeId || ""}`.trim(),
      }));
    } else if (activeContentType === "apartmentComplex") {
      base = homes.map((h) => ({
        type: "apartmentComplex" as const,
        payload: h as unknown as ApartmentComplexPageContent,
        label: `${h.id} ${h.address || ""}`.trim(),
      }));
    } else if (activeContentType === "category") {
      base = categories.map((c) => ({
        type: "category" as const,
        payload: c,
        label: c.name ?? `${c.id}`,
      }));
    } else if (activeContentType === "layout") {
      base = layouts.map((l) => ({
        type: "layout" as const,
        payload: l,
        label: l.id.toString() + " " + l.layoutImage,
      }));
    }

    if (!debouncedFilter) return base;
    const lowered = debouncedFilter.toLowerCase();
    return base.filter((i) => i.label.toLowerCase().includes(lowered));
  }, [
    activeContentType,
    debouncedFilter,
    bids,
    flats,
    homes,
    categories,
    layouts,
  ]);

  return (
    <div className="space-y-6">
      <div className="flex gap-2 mb-4 flex-wrap">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => switchTab(t)}
            className={`px-3 py-1 rounded ${
              (t === "flat" && ui.activeTab === "flats") ||
              (t === "apartmentComplex" && ui.activeTab === "apartmentComplexes") ||
              (t === "category" && ui.activeTab === "categories") ||
              (t === "bid" && ui.activeTab === "bids") ||
              (t === "layout" && ui.activeTab === "layouts")
                ? "bg-primary-600 text-white"
                : "bg-gray-100"
            }`}
            type="button"
          >
            {t === "flat"
              ? "Квартиры"
              : t === "apartmentComplex"
                ? "Жилые комплексы"
                : t === "category"
                  ? "Категории"
                  : t === "layout"
                    ? "Планировки"
                    : "Заявки"}
          </button>
        ))}
        <div className="ml-auto flex gap-2 flex-wrap">
          <button
            onClick={() => openNew("flat")}
            className="px-3 py-1 bg-green-600 text-white rounded text-sm"
            type="button"
          >
            Новая квартира
          </button>
          <button
            onClick={() => openNew("apartmentComplex")}
            className="px-3 py-1 bg-green-600 text-white rounded text-sm"
            type="button"
          >
            Новый ЖК
          </button>
          <button
            onClick={() => openNew("category")}
            className="px-3 py-1 bg-green-600 text-white rounded text-sm"
            type="button"
          >
            Новая категория
          </button>
          <button
            onClick={() => openNew("bid")}
            className="px-3 py-1 bg-green-600 text-white rounded text-sm"
            type="button"
          >
            Новая заявка
          </button>
          <button
            onClick={() => openNew("layout")}
            className="px-3 py-1 bg-green-600 text-white rounded text-sm"
            type="button"
          >
            Новая планировка
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">
              {ui.activeTab === "bids" && "Список заявок"}
              {ui.activeTab === "flats" && "Список квартир"}
              {ui.activeTab === "apartmentComplexes" && "Список жилых комплексов"}
              {ui.activeTab === "categories" && "Список категорий"}
              {ui.activeTab === "layouts" && "Список планировок"}
            </h3>
            {ui.activeTab === "bids" && (
              <div className="text-sm text-gray-500">
                {isLoadingBids ? "Загрузка..." : `${bids.length} заявок`}
              </div>
            )}
            {ui.activeTab === "flats" && (
              <div className="text-sm text-gray-500">
                {loading.flats ? "Загрузка..." : `${flats.length} квартир`}
              </div>
            )}
            {ui.activeTab === "apartmentComplexes" && (
              <div className="text-sm text-gray-500">
                {loading.flats ? "Загрузка..." : `${homes.length} ЖК`}
              </div>
            )}
            {ui.activeTab === "categories" && (
              <div className="text-sm text-gray-500">
                {loading.categories
                  ? "Загрузка..."
                  : `${categories.length} категорий`}
              </div>
            )}
            {ui.activeTab === "layouts" && (
              <div className="text-sm text-gray-500">
                {loading.layouts
                  ? "Загрузка..."
                  : `${layouts.length} планировок`}
              </div>
            )}
          </div>

          <div className="flex gap-2 mb-2 flex-wrap">
            <input
              placeholder="Поиск..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="flex-grow px-3 py-2 border rounded"
              type="text"
            />
            <button
              onClick={refreshCurrent}
              className="px-3 py-2 bg-gray-200 rounded"
              disabled={
                (ui.activeTab === "flats" && loading.flats) ||
                (ui.activeTab === "apartmentComplexes" && loading.flats) ||
                (ui.activeTab === "categories" && loading.categories) ||
                (ui.activeTab === "bids" && isLoadingBids) ||
                (ui.activeTab === "layouts" && loading.layouts)
              }
              type="button"
            >
              Обновить
            </button>
          </div>

          {currentList.length === 0 && (
            <div className="text-gray-500">Нет данных</div>
          )}
          {currentList.map((item) => {
            const isBid = item.type === "bid";
            const bid = item.payload as BidForm;
            const isChecked = isBid && bid?.isChecked;

            return (
              <div
                key={`${item.label}-${item.type}`}
                onClick={() => openEdit(item.type, item.payload)}
                className={`flex justify-between items-center p-2 border rounded hover:shadow-sm transition cursor-pointer ${
                  isBid
                    ? isChecked
                      ? "bg-green-50"
                      : "bg-yellow-50 font-semibold"
                    : ""
                }`}
              >
                <div className="flex flex-col">
                  <div>{item.label}</div>
                  {isBid && (
                    <div className="text-xs text-gray-600">
                      {bid.phone || ""} — {bid.email || ""}
                    </div>
                  )}
                </div>
                <div className="flex gap-2 items-center">
                  {isBid && (
                    <div
                      className={`text-sm px-2 py-1 rounded text-white mr-4 ${
                        isChecked ? "bg-green-600" : "bg-red-500"
                      }`}
                    >
                      {isChecked ? "Просмотрено" : "Не просмотрено"}
                    </div>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openEdit(item.type, item.payload);
                    }}
                    className="text-primary-600 hover:underline text-sm"
                    type="button"
                  >
                    Изменить
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="p-4 border rounded bg-white flex flex-col gap-4">
          <div className="flex-1">
            <h4 className="font-semibold mb-2">Руководство</h4>
            <p className="text-sm text-gray-700 whitespace-pre-line">
              {GUIDE[ui.activeTab] ||
                "Выберите вкладку, чтобы увидеть руководство."}
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <div>
              <button
                onClick={() => openNew(activeContentType)}
                className="px-3 py-1 bg-green-600 text-white rounded text-sm w-full"
                type="button"
              >
                {ui.activeTab === "flats"
                  ? "Новая квартира"
                  : ui.activeTab === "apartmentComplexes"
                    ? "Новый ЖК"
                    : ui.activeTab === "categories"
                      ? "Новая категория"
                      : ui.activeTab === "layouts"
                        ? "Новая планировка"
                        : "Новая заявка"}
              </button>
            </div>
            {ui.editMode && (
              <div>
                <button
                  onClick={handleDelete}
                  className="px-3 py-1 bg-red-600 text-white rounded text-sm w-full"
                  type="button"
                >
                  Удалить текущий
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {ui.showForm && (
        <ContentEditor
          contentType={activeContentType}
          initialFlat={
            activeContentType === "flat" ? selectedFlat || undefined : undefined
          }
          initialApartmentComplex={
            activeContentType === "apartmentComplex" ? selectedApartmentComplex || undefined : undefined
          }
          initialCategory={
            activeContentType === "category"
              ? selectedCategory || undefined
              : undefined
          }
          initialBid={
            activeContentType === "bid" ? selectedBid || undefined : undefined
          }
          initialLayout={
            activeContentType === "layout"
              ? selectedLayout || undefined
              : undefined
          }
          allCategories={categories}
          isEditing={ui.editMode}
          onSave={handleSave}
          onDelete={ui.editMode ? handleDelete : undefined}
          onCancel={() => setShowForm(false)}
        />
      )}
    </div>
  );
};

export default ContentManagementSection;
