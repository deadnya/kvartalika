import { type FC, type FormEvent, useState, useEffect, useMemo } from "react";
import type {
  CategoryRequest,
  FlatWithCategoryRequest,
  Category,
  LayoutRequest,
  FlatVariantDto,
  CreateFlatVariantRequest,
  UpdateFlatVariantRequest,
  VariantRequest,
} from "../../services";
import type { ApartmentComplexPageContent } from "../../services/api/pages.api.types";
import ArrayField from "./ArrayField.tsx";
import type { BidForm } from "../../store/ui.store.ts";
import { useDeferredNumber } from "../../hooks/useDeferredNumber.ts";
import {
  getAllVariants,
  createVariant,
  updateVariant,
} from "../../services/content.service.ts";

export type ContentType = "flat" | "category" | "bid" | "layout" | "apartmentComplex";

interface ContentEditorUnifiedProps {
  contentType: ContentType;
  initialFlat?: FlatWithCategoryRequest;
  initialCategory?: Category;
  initialBid?: BidForm;
  initialLayout?: LayoutRequest;
  initialApartmentComplex?: ApartmentComplexPageContent;
  allCategories?: Category[];
  onSave: (
    payload: FlatWithCategoryRequest | CategoryRequest | BidForm | ApartmentComplexPageContent,
  ) => Promise<void> | void;
  onDelete?: () => Promise<void> | void;
  onCancel: () => void;
  isEditing?: boolean;
}

const ContentEditor: FC<ContentEditorUnifiedProps> = ({
  contentType,
  initialFlat,
  initialCategory,
  initialBid,
  initialLayout,
  initialApartmentComplex,
  allCategories = [],
  onSave,
  onDelete,
  onCancel,
  isEditing = false,
}) => {
  const [flatPayload, setFlatPayload] = useState<FlatWithCategoryRequest>(
    initialFlat || {
      flat: {},
      categories: [],
    },
  );
  const [categoryPayload, setCategoryPayload] = useState<CategoryRequest>(
    initialCategory
      ? {
          id: initialCategory.id,
          name: initialCategory.name,
          isOnMainPage: initialCategory.isOnMainPage,
        }
      : { id: 0, name: "", isOnMainPage: false },
  );

  const [bidPayload, setBidPayload] = useState<Partial<BidForm>>(
    initialBid || {},
  );

  const [layoutPayload, setLayoutPayload] = useState<Partial<LayoutRequest>>(
    initialLayout || {},
  );

  const [apartmentComplexPayload, setApartmentComplexPayload] = useState<ApartmentComplexPageContent>(() => {
    if (initialApartmentComplex) {
      return {
        ...initialApartmentComplex,
        images: initialApartmentComplex.images || [],
        goodThings: initialApartmentComplex.goodThings || [],
        transportItems: initialApartmentComplex.transportItems || [],
        history: initialApartmentComplex.history || [],
        amenities: initialApartmentComplex.amenities || [],
        amenitiesImages: initialApartmentComplex.amenitiesImages || [],
        technologies: initialApartmentComplex.technologies || [],
      };
    }
    return {
      id: 0,
      name: "",
      description: "",
      secondDescription: null,
      images: [],
      address: "",
      latitude: 0,
      longitude: 0,
      yearBuilt: new Date().getFullYear(),
      history: [],
      features: [],
      about: "",
      numberOfFloors: 0,
      storesNearby: false,
      schoolsNearby: false,
      hospitalsNearby: false,
      hasYards: false,
      yardsImages: [],
      published: false,
      model3D: null,
      pan: null,
      quartalOfFinish: null,
      locationDescription: null,
      transportAvailabilityMotto: "",
      transportItems: [],
      transportImage: "",
      amenitiesDescription: "",
      amenities: [],
      amenitiesImages: [],
      technologiesDescription: "",
      technologies: [],
      technologiesImage: "",
      catchItOfferTitle: "",
      catchItOfferDescription: "",
      goodThings: [],
      metaTitle: null,
      metaDescription: null,
      metaKeywords: null,
      metaImage: null,
      slug: null,
    };
  });

  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Variants state
  const [flatVariants, setFlatVariants] = useState<FlatVariantDto[]>([]);
  const [localVariants, setLocalVariants] = useState<Omit<FlatVariantDto, 'id' | 'flatId'>[]>([]); // For new flats
  const [editingVariant, setEditingVariant] = useState<FlatVariantDto | null>(null);
  const [editingLocalVariant, setEditingLocalVariant] = useState<{index: number, variant: Omit<FlatVariantDto, 'id' | 'flatId'>} | null>(null);
  const [showVariantForm, setShowVariantForm] = useState(false);
  const [variantFormData, setVariantFormData] = useState<Partial<CreateFlatVariantRequest | UpdateFlatVariantRequest>>({});

  useEffect(() => {
    if (initialFlat) setFlatPayload(initialFlat);
  }, [initialFlat]);

  useEffect(() => {
    if (initialCategory) {
      setCategoryPayload({
        id: initialCategory.id,
        name: initialCategory.name,
        isOnMainPage: initialCategory.isOnMainPage,
      });
    }
  }, [initialCategory]);

  useEffect(() => {
    if (initialBid) setBidPayload(initialBid);
  }, [initialBid]);

  useEffect(() => {
    if (initialLayout) setLayoutPayload(initialLayout);
  }, [initialLayout]);

  useEffect(() => {
    if (initialApartmentComplex) setApartmentComplexPayload(initialApartmentComplex);
  }, [initialApartmentComplex]);

  // Load variants when editing a flat
  useEffect(() => {
    if (contentType === "flat" && isEditing && flatPayload.flat.id) {
      loadVariants();
    }
  }, [contentType, isEditing, flatPayload.flat.id]);

  const loadVariants = async () => {
    try {
      const allVariants = await getAllVariants();
      const currentFlatVariants = allVariants.filter(
        (variant) => variant.flatId === flatPayload.flat.id
      );
      setFlatVariants(currentFlatVariants);
    } catch (error) {
      console.error("Failed to load variants:", error);
    }
  };

  const handleCreateVariant = async () => {
    if (!flatPayload.flat.id || 
        variantFormData.area === undefined || variantFormData.area === null || isNaN(variantFormData.area) ||
        variantFormData.price === undefined || variantFormData.price === null || isNaN(variantFormData.price) ||
        variantFormData.floor === undefined || variantFormData.floor === null || isNaN(variantFormData.floor) ||
        !variantFormData.status ||
        variantFormData.hasDecoration === undefined) {
      setError("Все поля варианта должны быть заполнены");
      return;
    }

    try {
      const createData: CreateFlatVariantRequest = {
        flatId: Number(flatPayload.flat.id),
        area: variantFormData.area,
        price: variantFormData.price,
        floor: variantFormData.floor,
        status: variantFormData.status as "AVAILABLE" | "RESERVED" | "SOLD",
        hasDecoration: variantFormData.hasDecoration,
      };
      
      await createVariant(createData);
      await loadVariants();
      setShowVariantForm(false);
      setVariantFormData({});
    } catch (error) {
      setError(error instanceof Error ? error.message : "Ошибка создания варианта");
    }
  };

  const handleUpdateVariant = async () => {
    if (!editingVariant || 
        variantFormData.area === undefined || variantFormData.area === null || isNaN(variantFormData.area) ||
        variantFormData.price === undefined || variantFormData.price === null || isNaN(variantFormData.price) ||
        variantFormData.floor === undefined || variantFormData.floor === null || isNaN(variantFormData.floor) ||
        !variantFormData.status ||
        variantFormData.hasDecoration === undefined) {
      setError("Все поля варианта должны быть заполнены");
      return;
    }

    try {
      const updateData: UpdateFlatVariantRequest = {
        id: editingVariant.id,
        area: variantFormData.area,
        price: variantFormData.price,
        floor: variantFormData.floor,
        status: variantFormData.status as "AVAILABLE" | "RESERVED" | "SOLD",
        hasDecoration: variantFormData.hasDecoration,
      };
      
      await updateVariant(updateData);
      await loadVariants();
      setEditingVariant(null);
      setVariantFormData({});
      setShowVariantForm(false);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Ошибка обновления варианта");
    }
  };

  const openVariantForm = (variant?: FlatVariantDto) => {
    if (variant) {
      setEditingVariant(variant);
      setVariantFormData({
        area: variant.area,
        price: variant.price,
        floor: variant.floor,
        status: variant.status,
        hasDecoration: variant.hasDecoration,
      });
    } else {
      setEditingVariant(null);
      setVariantFormData({
        flatId: Number(flatPayload.flat.id),
        status: "AVAILABLE" as const,
        hasDecoration: false,
      });
    }
    setShowVariantForm(true);
  };

  const closeVariantForm = () => {
    setShowVariantForm(false);
    setEditingVariant(null);
    setEditingLocalVariant(null);
    setVariantFormData({});
  };

  // Local variant management (for new flats without ID)
  const handleCreateLocalVariant = () => {
    if (variantFormData.area === undefined || variantFormData.area === null || isNaN(variantFormData.area) ||
        variantFormData.price === undefined || variantFormData.price === null || isNaN(variantFormData.price) ||
        variantFormData.floor === undefined || variantFormData.floor === null || isNaN(variantFormData.floor) ||
        !variantFormData.status ||
        variantFormData.hasDecoration === undefined) {
      setError("Все поля варианта должны быть заполнены");
      return;
    }

    const newVariant = {
      area: variantFormData.area,
      price: variantFormData.price,
      floor: variantFormData.floor,
      status: variantFormData.status as "AVAILABLE" | "RESERVED" | "SOLD",
      hasDecoration: variantFormData.hasDecoration,
    };

    setLocalVariants(prev => [...prev, newVariant]);
    setShowVariantForm(false);
    setVariantFormData({});
    setError(null);
  };

  const handleUpdateLocalVariant = () => {
    if (!editingLocalVariant ||
        variantFormData.area === undefined || variantFormData.area === null || isNaN(variantFormData.area) ||
        variantFormData.price === undefined || variantFormData.price === null || isNaN(variantFormData.price) ||
        variantFormData.floor === undefined || variantFormData.floor === null || isNaN(variantFormData.floor) ||
        !variantFormData.status ||
        variantFormData.hasDecoration === undefined) {
      setError("Все поля варианта должны быть заполнены");
      return;
    }

    const updatedVariant = {
      area: variantFormData.area,
      price: variantFormData.price,
      floor: variantFormData.floor,
      status: variantFormData.status as "AVAILABLE" | "RESERVED" | "SOLD",
      hasDecoration: variantFormData.hasDecoration,
    };

    setLocalVariants(prev => 
      prev.map((variant, index) => 
        index === editingLocalVariant.index ? updatedVariant : variant
      )
    );
    
    setShowVariantForm(false);
    setEditingLocalVariant(null);
    setVariantFormData({});
    setError(null);
  };

  const handleDeleteLocalVariant = (index: number) => {
    if (!confirm("Вы уверены, что хотите удалить этот вариант?")) {
      return;
    }
    
    setLocalVariants(prev => prev.filter((_, i) => i !== index));
  };

  const handleDeleteVariant = (variantId: number) => {
    if (!confirm("Вы уверены, что хотите удалить этот вариант?")) {
      return;
    }
    
    // Remove variant from local state - will be updated on save
    setFlatVariants(prev => prev.filter(variant => variant.id !== variantId));
  };

  const openLocalVariantForm = (index?: number) => {
    if (index !== undefined) {
      const variant = localVariants[index];
      setEditingLocalVariant({ index, variant });
      setVariantFormData({
        area: variant.area,
        price: variant.price,
        floor: variant.floor,
        status: variant.status,
        hasDecoration: variant.hasDecoration,
      });
    } else {
      setEditingLocalVariant(null);
      setVariantFormData({
        status: "AVAILABLE" as const,
        hasDecoration: false,
      });
    }
    setShowVariantForm(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      if (contentType === "flat") {
        if (!flatPayload.flat.name)
          throw new Error("Название квартиры обязательно");
        
        // Include local variants in the flat request for new flats
        if (!isEditing && localVariants.length > 0) {
          // Convert local variants to VariantRequest format
          // For new flats, we don't provide flatId and id since they will be assigned by the backend
          const variantRequests: VariantRequest[] = localVariants.map((variant) => ({
            area: variant.area,
            price: variant.price,
            floor: variant.floor,
            status: variant.status,
            hasDecoration: variant.hasDecoration ?? false,
          }));
          
          const flatPayloadWithVariants = {
            ...flatPayload,
            flat: {
              ...flatPayload.flat,
              variants: variantRequests
            }
          };
          
          await onSave(flatPayloadWithVariants);
          
          // Clear local variants after successful creation
          setLocalVariants([]);
        } else if (isEditing) {
          // For editing existing flats, include the current variants state (including deletions)
          const variantRequests: VariantRequest[] = flatVariants.map((variant) => ({
            flatId: variant.flatId,
            id: variant.id,
            area: variant.area,
            price: variant.price,
            floor: variant.floor,
            status: variant.status,
            hasDecoration: variant.hasDecoration ?? false,
          }));
          
          const flatPayloadWithVariants = {
            ...flatPayload,
            flat: {
              ...flatPayload.flat,
              variants: variantRequests
            }
          };
          
          await onSave(flatPayloadWithVariants);
        } else {
          // Simple flat creation/update without variants or ensure variants field is present
          const flatPayloadWithEmptyVariants = {
            ...flatPayload,
            flat: {
              ...flatPayload.flat,
              variants: []
            }
          };
          
          await onSave(flatPayloadWithEmptyVariants);
        }
      } else if (contentType === "category") {
        if (!categoryPayload.name)
          throw new Error("Название категории обязательно");
        await onSave(categoryPayload);
      } else if (contentType === "bid") {
        if (!bidPayload.id) throw new Error("Что это?");
        await onSave(bidPayload);
      } else if (contentType === "layout") {
        if ((layoutPayload.layoutImage?.length ?? 0) === 0)
          throw new Error("Ссылка на изображение обязательна");
        await onSave(layoutPayload);
      } else if (contentType === "apartmentComplex") {
        if (!apartmentComplexPayload.name)
          throw new Error("Название комплекса обязательно");
        
        // Send payload as-is - transformation happens in pages.api.requests.ts
        await onSave(apartmentComplexPayload);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Неизвестная ошибка");
    } finally {
      setSaving(false);
    }
  };

  const toggleCategory = (category: Category) => {
    setFlatPayload((prev) => {
      const exists = prev.categories.find((c) => c.id === category.id);
      if (exists) {
        return {
          ...prev,
          categories: prev.categories.filter((c) => c.id !== category.id),
        };
      } else {
        return {
          ...prev,
          categories: [
            ...prev.categories,
            {
              id: category.id,
              name: category.name,
              isOnMainPage: category.isOnMainPage,
            },
          ],
        };
      }
    });
  };

  const isCategorySelected = (category: Category) =>
    flatPayload.categories.some((c) => c.id === category.id);

  const latControl = useDeferredNumber(flatPayload.flat.latitude, (num) =>
    setFlatPayload((p) => ({
      ...p,
      flat: { ...p.flat, latitude: num ?? undefined },
    })),
  );
  const lonControl = useDeferredNumber(flatPayload.flat.longitude, (num) =>
    setFlatPayload((p) => ({
      ...p,
      flat: { ...p.flat, longitude: num ?? undefined },
    })),
  );

  const renderFlatForm = () => {
    const f = flatPayload.flat;
    return (
      <form onSubmit={handleSubmit} className="space-y-6">
        {f.id !== undefined && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ID
            </label>
            <input
              type="text"
              value={f.id}
              disabled
              className="w-full border rounded px-3 py-2 bg-gray-100"
            />
          </div>
        )}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Название
            </label>
            <input
              type="text"
              value={f.name || ""}
              onChange={(e) =>
                setFlatPayload((p) => ({
                  ...p,
                  flat: { ...p.flat, name: e.target.value },
                }))
              }
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Цена
            </label>
            <input
              type="number"
              value={f.price ?? ""}
              onChange={(e) =>
                setFlatPayload((p) => ({
                  ...p,
                  flat: { ...p.flat, price: Number(e.target.value) },
                }))
              }
              className="w-full border rounded px-3 py-2"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Описание
          </label>
          <textarea
            value={f.description || ""}
            onChange={(e) =>
              setFlatPayload((p) => ({
                ...p,
                flat: { ...p.flat, description: e.target.value },
              }))
            }
            className="w-full border rounded px-3 py-2 h-24"
          />
        </div>

        {/*<div>*/}
        {/*  <label className="block text-sm font-medium text-gray-700 mb-1">*/}
        {/*    Статус*/}
        {/*  </label>*/}
        {/*  <select*/}
        {/*    value={f || ""}*/}
        {/*    onChange={(e) =>*/}
        {/*      setFlatPayload((p) => ({*/}
        {/*        ...p,*/}
        {/*        flat: { ...p.flat, status: e.target.value },*/}
        {/*      }))*/}
        {/*    }*/}
        {/*    className="w-full border rounded px-3 py-2"*/}
        {/*    style={{ height: "40px !important" }}*/}
        {/*  >*/}
        {/*    <option value="AVAILABLE">Доступно</option>*/}
        {/*    <option value="RESERVED">Забронировано</option>*/}
        {/*    <option value="SOLD">Продано</option>*/}
        {/*  </select>*/}
        {/*</div>*/}

        <ArrayField
          label="Изображения с отделкой"
          values={f.images}
          placeholder="/images/..."
          onChange={(arr) =>
            setFlatPayload((p) => ({
              ...p,
              flat: { ...p.flat, images: arr },
            }))
          }
        />

        <ArrayField
          label="Изображения без отделки"
          values={f.imagesClean}
          placeholder="/images/..."
          onChange={(arr) =>
            setFlatPayload((p) => ({
              ...p,
              flat: { ...p.flat, imagesClean: arr },
            }))
          }
        />

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Площадь
            </label>
            <input
              type="number"
              step="0.1"
              value={f.area ?? ""}
              onChange={(e) =>
                setFlatPayload((p) => ({
                  ...p,
                  flat: { ...p.flat, area: Number(e.target.value) },
                }))
              }
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Комнат
            </label>
            <input
              type="number"
              value={f.numberOfRooms ?? ""}
              onChange={(e) =>
                setFlatPayload((p) => ({
                  ...p,
                  flat: { ...p.flat, numberOfRooms: Number(e.target.value) },
                }))
              }
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Этаж
            </label>
            <input
              type="number"
              value={f.floor ?? ""}
              onChange={(e) =>
                setFlatPayload((p) => ({
                  ...p,
                  flat: { ...p.flat, floor: Number(e.target.value) },
                }))
              }
              className="w-full border rounded px-3 py-2"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Количество санузлов
            </label>
            <input
              type="number"
              value={f.numberOfBathrooms ?? ""}
              onChange={(e) =>
                setFlatPayload((p) => ({
                  ...p,
                  flat: {
                    ...p.flat,
                    numberOfBathrooms: Number(e.target.value),
                  },
                }))
              }
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Количество для продажи
            </label>
            <input
              type="text"
              value={f.numberForSale ?? ""}
              onChange={(e) =>
                setFlatPayload((p) => ({
                  ...p,
                  flat: { ...p.flat, numberForSale: e.target.value || null },
                }))
              }
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ID ЖК
            </label>
            <input
              type="text"
              value={f.homeId ?? ""}
              onChange={(e) =>
                setFlatPayload((p) => ({
                  ...p,
                  flat: { ...p.flat, homeId: e.target.value || null },
                }))
              }
              className="w-full border rounded px-3 py-2"
            />
          </div>
        </div>

        <ArrayField
          label="Особенности"
          values={f.features}
          placeholder="Например: пластиковые окна"
          onChange={(arr) =>
            setFlatPayload((p) => ({
              ...p,
              flat: { ...p.flat, features: arr },
            }))
          }
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Круговая панорама
          </label>
          <input
            type="text"
            value={f.pan || ""}
            onChange={(e) =>
              setFlatPayload((p) => ({
                ...p,
                flat: { ...p.flat, pan: e.target.value },
              }))
            }
            className="w-full border rounded px-3 py-2"
            placeholder={"Ссылка на круговую панораму"}
          />
        </div>

        <div className="flex flex-wrap gap-4">
          {/*<div className="flex items-center gap-2">*/}
          {/*  <input*/}
          {/*    id="hasDecoration"*/}
          {/*    type="checkbox"*/}
          {/*    checked={!!f.hasDecoration}*/}
          {/*    onChange={(e) =>*/}
          {/*      setFlatPayload((p) => ({*/}
          {/*        ...p,*/}
          {/*        flat: { ...p.flat, hasDecoration: e.target.checked },*/}
          {/*      }))*/}
          {/*    }*/}
          {/*    className="mr-1"*/}
          {/*  />*/}
          {/*  <label htmlFor="hasDecoration">Есть отделка</label>*/}
          {/*</div>*/}
          <div className="flex items-center gap-2">
            <input
              id="published"
              type="checkbox"
              checked={!!f.published}
              onChange={(e) =>
                setFlatPayload((p) => ({
                  ...p,
                  flat: { ...p.flat, published: e.target.checked },
                }))
              }
              className="mr-1"
            />
            <label htmlFor="published">Опубликовать</label>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Широта
            </label>
            <input
              type="text"
              inputMode="decimal"
              pattern="[0-9]*[.,]?[0-9]*"
              value={latControl.text}
              onChange={(e) => latControl.setText(e.target.value)}
              onBlur={latControl.commit}
              onKeyDown={latControl.handleKey}
              className="w-full border rounded px-3 py-2"
              placeholder="Например: 55,754"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Долгота
            </label>
            <input
              type="text"
              inputMode="decimal"
              pattern="[0-9]*[.,]?[0-9]*"
              value={lonControl.text}
              onChange={(e) => lonControl.setText(e.target.value)}
              onBlur={lonControl.commit}
              onKeyDown={lonControl.handleKey}
              className="w-full border rounded px-3 py-2"
              placeholder="Например: 37,617"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Планировка
          </label>
          <input
            type="text"
            value={f.layoutId || ""}
            onChange={(e) =>
              setFlatPayload((p) => ({
                ...p,
                flat: { ...p.flat, layoutId: e.target.value },
              }))
            }
            className="w-full border rounded px-3 py-2"
            placeholder={"Номер планировки"}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Адрес
          </label>
          <input
            type="text"
            value={f.address || ""}
            onChange={(e) =>
              setFlatPayload((p) => ({
                ...p,
                flat: { ...p.flat, address: e.target.value },
              }))
            }
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            О квартире
          </label>
          <textarea
            value={f.about || ""}
            onChange={(e) =>
              setFlatPayload((p) => ({
                ...p,
                flat: { ...p.flat, about: e.target.value },
              }))
            }
            className="w-full border rounded px-3 py-2 h-20"
          />
        </div>

        {/* Variants Section */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <div className="text-sm font-medium text-gray-700">
              Варианты квартиры
            </div>
            <button
              type="button"
              onClick={() => isEditing && f.id ? openVariantForm() : openLocalVariantForm()}
              className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
            >
              + Добавить вариант
            </button>
          </div>
          
          {/* Show API variants for existing flats */}
          {isEditing && f.id && (
            <>
              {flatVariants.length > 0 ? (
                <div className="space-y-3">
                  {flatVariants.map((variant) => (
                    <div key={variant.id} className="border rounded p-3 bg-gray-50">
                      <div className="grid grid-cols-5 gap-4 text-sm">
                        <div><strong>Площадь:</strong> {variant.area} м²</div>
                        <div><strong>Цена:</strong> {variant.price.toLocaleString()} ₽</div>
                        <div><strong>Этаж:</strong> {variant.floor}</div>
                        <div><strong>Отделка:</strong> {variant.hasDecoration ? 'Есть' : 'Нет'}</div>
                        <div><strong>Статус:</strong> 
                          <span className={`ml-2 px-2 py-1 rounded text-xs ${
                            variant.status === 'AVAILABLE' ? 'bg-green-100 text-green-800' :
                            variant.status === 'RESERVED' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {variant.status === 'AVAILABLE' ? 'Доступно' :
                             variant.status === 'RESERVED' ? 'Забронировано' : 'Продано'}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-2">
                        <button
                          type="button"
                          onClick={() => openVariantForm(variant)}
                          className="px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
                        >
                          Редактировать
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteVariant(variant.id)}
                          className="px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600"
                        >
                          Удалить
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-gray-500 italic">
                  Нет вариантов для этой квартиры
                </div>
              )}
            </>
          )}
          
          {/* Show local variants for new flats */}
          {!isEditing && (
            <>
              {localVariants.length > 0 ? (
                <div className="space-y-3">
                  {localVariants.map((variant, index) => (
                    <div key={index} className="border rounded p-3 bg-blue-50">
                      <div className="grid grid-cols-5 gap-4 text-sm">
                        <div><strong>Площадь:</strong> {variant.area} м²</div>
                        <div><strong>Цена:</strong> {variant.price.toLocaleString()} ₽</div>
                        <div><strong>Этаж:</strong> {variant.floor}</div>
                        <div><strong>Отделка:</strong> 
                          <span className={`ml-2 px-2 py-1 rounded text-xs ${
                            variant.hasDecoration ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {variant.hasDecoration ? 'С отделкой' : 'Без отделки'}
                          </span>
                        </div>
                        <div><strong>Статус:</strong> 
                          <span className={`ml-2 px-2 py-1 rounded text-xs ${
                            variant.status === 'AVAILABLE' ? 'bg-green-100 text-green-800' :
                            variant.status === 'RESERVED' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {variant.status === 'AVAILABLE' ? 'Доступно' :
                             variant.status === 'RESERVED' ? 'Забронировано' : 'Продано'}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-2">
                        <button
                          type="button"
                          onClick={() => openLocalVariantForm(index)}
                          className="px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
                        >
                          Редактировать
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteLocalVariant(index)}
                          className="px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600"
                        >
                          Удалить
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-gray-500 italic">
                  Нет вариантов (будут созданы после сохранения квартиры)
                </div>
              )}
            </>
          )}
        </div>

        {/* SEO / Meta Information */}
        <div className="space-y-4 border-t pt-4">
          <h3 className="text-lg font-semibold">SEO / Мета информация</h3>
          
          <div>
            <label className="block text-sm font-medium mb-1">Meta Title</label>
            <input
              type="text"
              value={f.metaTitle || ""}
              onChange={(e) =>
                setFlatPayload((p) => ({
                  ...p,
                  flat: { ...p.flat, metaTitle: e.target.value || null },
                }))
              }
              className="w-full border rounded px-3 py-2"
              placeholder="Заголовок для поисковых систем"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Meta Description</label>
            <textarea
              value={f.metaDescription || ""}
              onChange={(e) =>
                setFlatPayload((p) => ({
                  ...p,
                  flat: { ...p.flat, metaDescription: e.target.value || null },
                }))
              }
              className="w-full border rounded px-3 py-2 h-20"
              placeholder="Описание для поисковых систем"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Meta Keywords</label>
            <input
              type="text"
              value={f.metaKeywords || ""}
              onChange={(e) =>
                setFlatPayload((p) => ({
                  ...p,
                  flat: { ...p.flat, metaKeywords: e.target.value || null },
                }))
              }
              className="w-full border rounded px-3 py-2"
              placeholder="Ключевые слова (через запятую)"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Meta Image</label>
            <input
              type="text"
              value={f.metaImage || ""}
              onChange={(e) =>
                setFlatPayload((p) => ({
                  ...p,
                  flat: { ...p.flat, metaImage: e.target.value || null },
                }))
              }
              className="w-full border rounded px-3 py-2"
              placeholder="/images/..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">URL Slug</label>
            <input
              type="text"
              value={f.slug || ""}
              onChange={(e) =>
                setFlatPayload((p) => ({
                  ...p,
                  flat: { ...p.flat, slug: e.target.value || null },
                }))
              }
              className="w-full border rounded px-3 py-2"
              placeholder="url-slug"
            />
          </div>
        </div>

        <div>
          <div className="block text-sm font-medium text-gray-700 mb-1">
            Категории
          </div>
          <div className="flex flex-wrap gap-3">
            {allCategories.map((cat) => (
              <label key={cat.id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={isCategorySelected(cat)}
                  onChange={() => toggleCategory(cat)}
                />
                <span>{cat.name}</span>
              </label>
            ))}
            {allCategories.length === 0 && (
              <div className="text-xs text-gray-500">
                Нет доступных категорий
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-between items-center pt-4 border-t">
          <div>
            {isEditing && onDelete && (
              <button
                type="button"
                onClick={() => void onDelete()}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Удалить
              </button>
            )}
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border rounded"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 disabled:opacity-50"
            >
              {saving ? "Сохранение..." : "Сохранить"}
            </button>
          </div>
        </div>
      </form>
    );
  };

  const renderCategoryForm = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        {categoryPayload.id !== undefined && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ID
            </label>
            <input
              type="text"
              value={categoryPayload.id}
              disabled
              className="w-full border rounded px-3 py-2 bg-gray-100"
            />
          </div>
        )}

        <label className="block text-sm font-medium mb-1">Название</label>
        <input
          type="text"
          value={categoryPayload.name}
          onChange={(e) =>
            setCategoryPayload((c) => ({
              ...c,
              name: e.target.value,
            }))
          }
          className="w-full border rounded px-3 py-2"
          required
        />
      </div>
      <div className="flex items-center gap-2">
        <input
          id="isOnMainPage"
          type="checkbox"
          checked={categoryPayload.isOnMainPage}
          onChange={(e) =>
            setCategoryPayload((c) => ({
              ...c,
              isOnMainPage: e.target.checked,
            }))
          }
          className="mr-1"
        />
        <label htmlFor="isOnMainPage">Показывать на главной</label>
      </div>
      <div className="flex justify-between items-center pt-4 border-t">
        <div>
          {isEditing && onDelete && (
            <button
              type="button"
              onClick={() => void onDelete()}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Удалить
            </button>
          )}
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border rounded"
          >
            Отмена
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 disabled:opacity-50"
          >
            {saving ? "Сохранение..." : "Сохранить"}
          </button>
        </div>
      </div>
    </form>
  );

  const renderBidForm = () => {
    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        {bidPayload && bidPayload.id !== undefined && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ID
            </label>
            <input
              type="text"
              value={bidPayload.id}
              disabled
              className="w-full border rounded px-3 py-2 bg-gray-100"
            />
          </div>
        )}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Имя</label>
            <input
              type="text"
              value={bidPayload?.name || ""}
              disabled
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Фамилия</label>
            <input
              type="text"
              value={bidPayload?.surname || ""}
              disabled
              className="w-full border rounded px-3 py-2"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Телефон</label>
          <input
            type="text"
            value={bidPayload?.phone || ""}
            disabled
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            value={bidPayload?.email || ""}
            disabled
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div className="flex items-center gap-2">
          <input
            id="isChecked"
            type="checkbox"
            checked={bidPayload?.isChecked || false}
            onChange={(e) =>
              setBidPayload((b) => ({
                ...b,
                isChecked: e.target.checked,
              }))
            }
            className="mr-1"
          />
          <label htmlFor="isChecked">Просмотрено</label>
        </div>

        <div className="flex justify-between items-center pt-4 border-t">
          <div>
            {isEditing && onDelete && (
              <button
                type="button"
                onClick={() => void onDelete()}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Удалить
              </button>
            )}
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border rounded"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 disabled:opacity-50"
            >
              {saving ? "Сохранение..." : "Сохранить"}
            </button>
          </div>
        </div>
      </form>
    );
  };

  const renderLayoutForm = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        {layoutPayload.id !== undefined && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ID
            </label>
            <input
              type="text"
              value={layoutPayload.id}
              disabled
              className="w-full border rounded px-3 py-2 bg-gray-100"
            />
          </div>
        )}

        <label className="block text-sm font-medium mb-1 mt-2">
          Изображение планировки
        </label>
        <input
          type="text"
          value={layoutPayload.layoutImage}
          onChange={(e) =>
            setLayoutPayload((c) => ({
              ...c,
              layoutImage: e.target.value,
            }))
          }
          className="w-full border rounded px-3 py-2"
          required
        />
        <label className="block text-sm font-medium mb-1 mt-2">
          Название планировки
        </label>
        <input
          type="text"
          value={layoutPayload.name}
          onChange={(e) =>
            setLayoutPayload((c) => ({
              ...c,
              name: e.target.value,
            }))
          }
          className="w-full border rounded px-3 py-2"
          required
        />
        <label className="block text-sm font-medium mb-1 mt-2">
          Номер дома
        </label>
        <input
          type="number"
          value={layoutPayload.homeId}
          onChange={(e) =>
            setLayoutPayload((c) => ({
              ...c,
              homeId: Number(e.target.value),
            }))
          }
          className="w-full border rounded px-3 py-2"
          required
        />
      </div>
      <div className="flex justify-between items-center pt-4 border-t">
        <div>
          {isEditing && onDelete && (
            <button
              type="button"
              onClick={() => void onDelete()}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Удалить
            </button>
          )}
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border rounded"
          >
            Отмена
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 disabled:opacity-50"
          >
            {saving ? "Сохранение..." : "Сохранить"}
          </button>
        </div>
      </div>
    </form>
  );

  const renderApartmentComplexForm = () => (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* General Info */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold border-b pb-2">Основная информация</h3>
        
        <div>
          <label className="block text-sm font-medium mb-1">Название комплекса *</label>
          <input
            type="text"
            value={apartmentComplexPayload.name}
            onChange={(e) =>
              setApartmentComplexPayload((p) => ({
                ...p,
                name: e.target.value,
              }))
            }
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Адрес комплекса *</label>
          <input
            type="text"
            value={apartmentComplexPayload.address}
            onChange={(e) =>
              setApartmentComplexPayload((p) => ({
                ...p,
                address: e.target.value,
              }))
            }
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Основное описание</label>
          <textarea
            value={apartmentComplexPayload.description}
            onChange={(e) =>
              setApartmentComplexPayload((p) => ({
                ...p,
                description: e.target.value,
              }))
            }
            className="w-full border rounded px-3 py-2 min-h-24"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Дополнительное описание</label>
          <textarea
            value={apartmentComplexPayload.secondDescription || ""}
            onChange={(e) =>
              setApartmentComplexPayload((p) => ({
                ...p,
                secondDescription: e.target.value || null,
              }))
            }
            className="w-full border rounded px-3 py-2 min-h-24"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">О комплексе</label>
          <textarea
            value={apartmentComplexPayload.about}
            onChange={(e) =>
              setApartmentComplexPayload((p) => ({
                ...p,
                about: e.target.value,
              }))
            }
            className="w-full border rounded px-3 py-2 min-h-24"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Год постройки</label>
            <input
              type="number"
              value={apartmentComplexPayload.yearBuilt}
              onChange={(e) =>
                setApartmentComplexPayload((p) => ({
                  ...p,
                  yearBuilt: Number(e.target.value),
                }))
              }
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Количество этажей</label>
            <input
              type="number"
              value={apartmentComplexPayload.numberOfFloors}
              onChange={(e) =>
                setApartmentComplexPayload((p) => ({
                  ...p,
                  numberOfFloors: Number(e.target.value),
                }))
              }
              className="w-full border rounded px-3 py-2"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Квартал завершения</label>
          <input
            type="text"
            value={apartmentComplexPayload.quartalOfFinish || ""}
            onChange={(e) =>
              setApartmentComplexPayload((p) => ({
                ...p,
                quartalOfFinish: e.target.value || null,
              }))
            }
            className="w-full border rounded px-3 py-2"
            placeholder="Например: 2 квартал 2024"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Ссылка на 3D модель</label>
          <input
            type="text"
            value={apartmentComplexPayload.model3D || ""}
            onChange={(e) =>
              setApartmentComplexPayload((p) => ({
                ...p,
                model3D: e.target.value || null,
              }))
            }
            className="w-full border rounded px-3 py-2"
            placeholder="https://..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Ссылка на панораму</label>
          <input
            type="text"
            value={apartmentComplexPayload.pan || ""}
            onChange={(e) =>
              setApartmentComplexPayload((p) => ({
                ...p,
                pan: e.target.value || null,
              }))
            }
            className="w-full border rounded px-3 py-2"
            placeholder="https://..."
          />
        </div>

        <ArrayField
          label="Особенности"
          values={apartmentComplexPayload.features}
          placeholder="Например: удобное местоположение"
          onChange={(arr) =>
            setApartmentComplexPayload((p) => ({
              ...p,
              features: arr,
            }))
          }
        />

        <ArrayField
          label="Изображения"
          values={apartmentComplexPayload.images}
          placeholder="/images/..."
          onChange={(arr) =>
            setApartmentComplexPayload((p) => ({
              ...p,
              images: arr,
            }))
          }
        />

        <ArrayField
          label="Изображения дворов"
          values={apartmentComplexPayload.yardsImages}
          placeholder="/images/..."
          onChange={(arr) =>
            setApartmentComplexPayload((p) => ({
              ...p,
              yardsImages: arr,
            }))
          }
        />

        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <input
              id="storesNearby"
              type="checkbox"
              checked={apartmentComplexPayload.storesNearby}
              onChange={(e) =>
                setApartmentComplexPayload((p) => ({
                  ...p,
                  storesNearby: e.target.checked,
                }))
              }
              className="mr-1"
            />
            <label htmlFor="storesNearby">Магазины рядом</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              id="schoolsNearby"
              type="checkbox"
              checked={apartmentComplexPayload.schoolsNearby}
              onChange={(e) =>
                setApartmentComplexPayload((p) => ({
                  ...p,
                  schoolsNearby: e.target.checked,
                }))
              }
              className="mr-1"
            />
            <label htmlFor="schoolsNearby">Школы рядом</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              id="hospitalsNearby"
              type="checkbox"
              checked={apartmentComplexPayload.hospitalsNearby}
              onChange={(e) =>
                setApartmentComplexPayload((p) => ({
                  ...p,
                  hospitalsNearby: e.target.checked,
                }))
              }
              className="mr-1"
            />
            <label htmlFor="hospitalsNearby">Больницы рядом</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              id="hasYards"
              type="checkbox"
              checked={apartmentComplexPayload.hasYards}
              onChange={(e) =>
                setApartmentComplexPayload((p) => ({
                  ...p,
                  hasYards: e.target.checked,
                }))
              }
              className="mr-1"
            />
            <label htmlFor="hasYards">Есть дворы</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              id="published"
              type="checkbox"
              checked={apartmentComplexPayload.published}
              onChange={(e) =>
                setApartmentComplexPayload((p) => ({
                  ...p,
                  published: e.target.checked,
                }))
              }
              className="mr-1"
            />
            <label htmlFor="published">Опубликовать</label>
          </div>
        </div>
      </div>

      {/* Location Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold border-b pb-2">Расположение</h3>
        
        <div>
          <label className="block text-sm font-medium mb-1">Описание расположения</label>
          <textarea
            value={apartmentComplexPayload.locationDescription || ""}
            onChange={(e) =>
              setApartmentComplexPayload((p) => ({
                ...p,
                locationDescription: e.target.value || null,
              }))
            }
            className="w-full border rounded px-3 py-2 min-h-16"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Широта</label>
            <input
              type="number"
              step="0.001"
              value={apartmentComplexPayload.latitude}
              onChange={(e) =>
                setApartmentComplexPayload((p) => ({
                  ...p,
                  latitude: parseFloat(e.target.value) || 0,
                }))
              }
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Долгота</label>
            <input
              type="number"
              step="0.001"
              value={apartmentComplexPayload.longitude}
              onChange={(e) =>
                setApartmentComplexPayload((p) => ({
                  ...p,
                  longitude: parseFloat(e.target.value) || 0,
                }))
              }
              className="w-full border rounded px-3 py-2"
            />
          </div>
        </div>

        {/* Good Things - Max 2 items */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Преимущества расположения (макс. 2 элемента)
          </label>
          <div className="space-y-3">
            {apartmentComplexPayload.goodThings && apartmentComplexPayload.goodThings.map((thing, index) => (
              <div key={thing.id} className="border rounded p-3 space-y-2">
                <div>
                  <label className="block text-xs font-medium mb-1">Название</label>
                  <input
                    type="text"
                    value={thing.title}
                    onChange={(e) => {
                      const updated = [...(apartmentComplexPayload.goodThings || [])];
                      updated[index] = { ...thing, title: e.target.value };
                      setApartmentComplexPayload((p) => ({
                        ...p,
                        goodThings: updated,
                      }));
                    }}
                    className="w-full border rounded px-2 py-1 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Описание</label>
                  <textarea
                    value={thing.description}
                    onChange={(e) => {
                      const updated = [...(apartmentComplexPayload.goodThings || [])];
                      updated[index] = { ...thing, description: e.target.value };
                      setApartmentComplexPayload((p) => ({
                        ...p,
                        goodThings: updated,
                      }));
                    }}
                    className="w-full border rounded px-2 py-1 text-sm min-h-12"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setApartmentComplexPayload((p) => ({
                      ...p,
                      goodThings: (p.goodThings || []).filter((_, i) => i !== index),
                    }));
                  }}
                  className="text-red-500 text-sm hover:text-red-700"
                >
                  Удалить
                </button>
              </div>
            ))}
            {(apartmentComplexPayload.goodThings?.length ?? 0) < 2 && (
              <button
                type="button"
                onClick={() => {
                  setApartmentComplexPayload((p) => ({
                    ...p,
                    goodThings: [
                      ...(p.goodThings || []),
                      { id: Date.now().toString(), title: "", description: "" },
                    ],
                  }));
                }}
                className="px-3 py-2 border rounded text-sm bg-blue-50 hover:bg-blue-100"
              >
                + Добавить преимущество
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Transport Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold border-b pb-2">Транспорт</h3>
        
        <div>
          <label className="block text-sm font-medium mb-1">Девиз о транспорте</label>
          <textarea
            value={apartmentComplexPayload.transportAvailabilityMotto || ""}
            onChange={(e) =>
              setApartmentComplexPayload((p) => ({
                ...p,
                transportAvailabilityMotto: e.target.value,
              }))
            }
            className="w-full border rounded px-3 py-2 min-h-16"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Изображение транспорта</label>
          <input
            type="text"
            value={apartmentComplexPayload.transportImage || ""}
            onChange={(e) =>
              setApartmentComplexPayload((p) => ({
                ...p,
                transportImage: e.target.value,
              }))
            }
            className="w-full border rounded px-3 py-2"
            placeholder="/images/..."
          />
        </div>

        {/* Transport Items - Max 3 items */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Информация о транспорте (макс. 3 элемента)
          </label>
          <div className="space-y-3">
            {apartmentComplexPayload.transportItems && apartmentComplexPayload.transportItems.map((item, index) => (
              <div key={item.id} className="border rounded p-3 space-y-2">
                <div>
                  <label className="block text-xs font-medium mb-1">Название</label>
                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) => {
                      const updated = [...(apartmentComplexPayload.transportItems || [])];
                      updated[index] = { ...item, title: e.target.value };
                      setApartmentComplexPayload((p) => ({
                        ...p,
                        transportItems: updated,
                      }));
                    }}
                    className="w-full border rounded px-2 py-1 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Описание</label>
                  <textarea
                    value={item.description}
                    onChange={(e) => {
                      const updated = [...(apartmentComplexPayload.transportItems || [])];
                      updated[index] = { ...item, description: e.target.value };
                      setApartmentComplexPayload((p) => ({
                        ...p,
                        transportItems: updated,
                      }));
                    }}
                    className="w-full border rounded px-2 py-1 text-sm min-h-12"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setApartmentComplexPayload((p) => ({
                      ...p,
                      transportItems: (p.transportItems || []).filter((_, i) => i !== index),
                    }));
                  }}
                  className="text-red-500 text-sm hover:text-red-700"
                >
                  Удалить
                </button>
              </div>
            ))}
            {(apartmentComplexPayload.transportItems?.length ?? 0) < 3 && (
              <button
                type="button"
                onClick={() => {
                  setApartmentComplexPayload((p) => ({
                    ...p,
                    transportItems: [
                      ...(p.transportItems || []),
                      { id: Date.now().toString(), title: "", description: "" },
                    ],
                  }));
                }}
                className="px-3 py-2 border rounded text-sm bg-blue-50 hover:bg-blue-100"
              >
                + Добавить информацию о транспорте
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Building History */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold border-b pb-2">История строительства</h3>
        
        <div className="space-y-3">
          {apartmentComplexPayload.history && apartmentComplexPayload.history.map((item, index) => (
            <div key={item.id} className="border rounded p-3 space-y-2">
              <div>
                <label className="block text-xs font-medium mb-1">Название этапа</label>
                <input
                  type="text"
                  value={item.header}
                  onChange={(e) => {
                    const updated = [...(apartmentComplexPayload.history || [])];
                    updated[index] = { ...item, header: e.target.value };
                    setApartmentComplexPayload((p) => ({
                      ...p,
                      history: updated,
                    }));
                  }}
                  className="w-full border rounded px-2 py-1 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Описание</label>
                <textarea
                  value={item.description}
                  onChange={(e) => {
                    const updated = [...(apartmentComplexPayload.history || [])];
                    updated[index] = { ...item, description: e.target.value };
                    setApartmentComplexPayload((p) => ({
                      ...p,
                      history: updated,
                    }));
                  }}
                  className="w-full border rounded px-2 py-1 text-sm min-h-12"
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Изображение</label>
                <input
                  type="text"
                  value={item.image}
                  onChange={(e) => {
                    const updated = [...(apartmentComplexPayload.history || [])];
                    updated[index] = { ...item, image: e.target.value };
                    setApartmentComplexPayload((p) => ({
                      ...p,
                      history: updated,
                    }));
                  }}
                  className="w-full border rounded px-2 py-1 text-sm"
                  placeholder="/images/..."
                />
              </div>
              <button
                type="button"
                onClick={() => {
                  setApartmentComplexPayload((p) => ({
                    ...p,
                    history: (p.history || []).filter((_, i) => i !== index),
                  }));
                }}
                className="text-red-500 text-sm hover:text-red-700"
              >
                Удалить
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => {
              setApartmentComplexPayload((p) => ({
                ...p,
                history: [
                  ...(p.history || []),
                  { id: Date.now().toString(), header: "", description: "", image: "" },
                ],
              }));
            }}
            className="px-3 py-2 border rounded text-sm bg-blue-50 hover:bg-blue-100"
          >
            + Добавить этап строительства
          </button>
        </div>
      </div>

      {/* Amenities */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold border-b pb-2">Удобства (макс. 4 элемента)</h3>
        
        <div>
          <label className="block text-sm font-medium mb-1">Описание удобств</label>
          <textarea
            value={apartmentComplexPayload.amenitiesDescription || ""}
            onChange={(e) =>
              setApartmentComplexPayload((p) => ({
                ...p,
                amenitiesDescription: e.target.value,
              }))
            }
            className="w-full border rounded px-3 py-2 min-h-16"
          />
        </div>

        <div className="space-y-3">
          {apartmentComplexPayload.amenities && apartmentComplexPayload.amenities.map((amenity, index) => (
            <div key={amenity.id} className="border rounded p-3 space-y-2">
              <div>
                <label className="block text-xs font-medium mb-1">Название</label>
                <input
                  type="text"
                  value={amenity.title}
                  onChange={(e) => {
                    const updated = [...(apartmentComplexPayload.amenities || [])];
                    updated[index] = { ...amenity, title: e.target.value };
                    setApartmentComplexPayload((p) => ({
                      ...p,
                      amenities: updated,
                    }));
                  }}
                  className="w-full border rounded px-2 py-1 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Описание</label>
                <textarea
                  value={amenity.description}
                  onChange={(e) => {
                    const updated = [...(apartmentComplexPayload.amenities || [])];
                    updated[index] = { ...amenity, description: e.target.value };
                    setApartmentComplexPayload((p) => ({
                      ...p,
                      amenities: updated,
                    }));
                  }}
                  className="w-full border rounded px-2 py-1 text-sm min-h-12"
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Тип иконки</label>
                <select
                  value={amenity.iconType}
                  onChange={(e) => {
                    const updated = [...(apartmentComplexPayload.amenities || [])];
                    updated[index] = { ...amenity, iconType: e.target.value as 'car' | 'map2' | 'building2' | 'disabled' };
                    setApartmentComplexPayload((p) => ({
                      ...p,
                      amenities: updated,
                    }));
                  }}
                  className="w-full border rounded px-2 py-1 text-sm"
                >
                  <option value="car">Автомобиль</option>
                  <option value="map2">Карта</option>
                  <option value="building2">Здание</option>
                  <option value="disabled">Инвалидность</option>
                </select>
              </div>
              <button
                type="button"
                onClick={() => {
                  setApartmentComplexPayload((p) => ({
                    ...p,
                    amenities: (p.amenities || []).filter((_, i) => i !== index),
                  }));
                }}
                className="text-red-500 text-sm hover:text-red-700"
              >
                Удалить
              </button>
            </div>
          ))}
          {(apartmentComplexPayload.amenities?.length ?? 0) < 4 && (
            <button
              type="button"
              onClick={() => {
                setApartmentComplexPayload((p) => ({
                  ...p,
                  amenities: [
                    ...(p.amenities || []),
                    { id: Date.now().toString(), iconType: 'car' as const, title: "", description: "" },
                  ],
                }));
              }}
              className="px-3 py-2 border rounded text-sm bg-blue-50 hover:bg-blue-100"
            >
              + Добавить удобство
            </button>
          )}
        </div>

        <ArrayField
          label="Изображения удобств"
          values={apartmentComplexPayload.amenitiesImages}
          placeholder="/images/..."
          onChange={(arr) =>
            setApartmentComplexPayload((p) => ({
              ...p,
              amenitiesImages: arr,
            }))
          }
        />
      </div>

      {/* Technologies */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold border-b pb-2">Технологии (макс. 3 элемента)</h3>
        
        <div>
          <label className="block text-sm font-medium mb-1">Описание технологий</label>
          <textarea
            value={apartmentComplexPayload.technologiesDescription || ""}
            onChange={(e) =>
              setApartmentComplexPayload((p) => ({
                ...p,
                technologiesDescription: e.target.value,
              }))
            }
            className="w-full border rounded px-3 py-2 min-h-16"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Изображение технологий</label>
          <input
            type="text"
            value={apartmentComplexPayload.technologiesImage || ""}
            onChange={(e) =>
              setApartmentComplexPayload((p) => ({
                ...p,
                technologiesImage: e.target.value,
              }))
            }
            className="w-full border rounded px-3 py-2"
            placeholder="/images/..."
          />
        </div>

        <div className="space-y-3">
          {apartmentComplexPayload.technologies && apartmentComplexPayload.technologies.map((tech, index) => (
            <div key={tech.id} className="border rounded p-3 space-y-2">
              <div>
                <label className="block text-xs font-medium mb-1">Название</label>
                <input
                  type="text"
                  value={tech.title}
                  onChange={(e) => {
                    const updated = [...(apartmentComplexPayload.technologies || [])];
                    updated[index] = { ...tech, title: e.target.value };
                    setApartmentComplexPayload((p) => ({
                      ...p,
                      technologies: updated,
                    }));
                  }}
                  className="w-full border rounded px-2 py-1 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Описание</label>
                <textarea
                  value={Array.isArray(tech.description) ? tech.description.join('\n') : tech.description || ""}
                  onChange={(e) => {
                    const updated = [...(apartmentComplexPayload.technologies || [])];
                    updated[index] = { ...tech, description: e.target.value };
                    setApartmentComplexPayload((p) => ({
                      ...p,
                      technologies: updated,
                    }));
                  }}
                  className="w-full border rounded px-2 py-1 text-sm min-h-12"
                />
              </div>
              <button
                type="button"
                onClick={() => {
                  setApartmentComplexPayload((p) => ({
                    ...p,
                    technologies: (p.technologies || []).filter((_, i) => i !== index),
                  }));
                }}
                className="text-red-500 text-sm hover:text-red-700"
              >
                Удалить
              </button>
            </div>
          ))}
          {(apartmentComplexPayload.technologies?.length ?? 0) < 3 && (
            <button
              type="button"
              onClick={() => {
                setApartmentComplexPayload((p) => ({
                  ...p,
                  technologies: [
                    ...(p.technologies || []),
                    { id: Date.now().toString(), title: "", description: "" },
                  ],
                }));
              }}
              className="px-3 py-2 border rounded text-sm bg-blue-50 hover:bg-blue-100"
            >
              + Добавить технологию
            </button>
          )}
        </div>
      </div>

      {/* Special Offer */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold border-b pb-2">Специальное предложение</h3>
        
        <div>
          <label className="block text-sm font-medium mb-1">Заголовок предложения</label>
          <input
            type="text"
            value={apartmentComplexPayload.catchItOfferTitle || ""}
            onChange={(e) =>
              setApartmentComplexPayload((p) => ({
                ...p,
                catchItOfferTitle: e.target.value || null,
              }))
            }
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Описание предложения</label>
          <textarea
            value={apartmentComplexPayload.catchItOfferDescription || ""}
            onChange={(e) =>
              setApartmentComplexPayload((p) => ({
                ...p,
                catchItOfferDescription: e.target.value || null,
              }))
            }
            className="w-full border rounded px-3 py-2 min-h-16"
          />
        </div>
      </div>

      {/* SEO / Meta Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold border-b pb-2">SEO и мета информация</h3>
        
        <div>
          <label className="block text-sm font-medium mb-1">Meta Title</label>
          <input
            type="text"
            value={apartmentComplexPayload.metaTitle || ""}
            onChange={(e) =>
              setApartmentComplexPayload((p) => ({
                ...p,
                metaTitle: e.target.value || null,
              }))
            }
            className="w-full border rounded px-3 py-2"
            placeholder="Заголовок страницы для SEO"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Meta Description</label>
          <textarea
            value={apartmentComplexPayload.metaDescription || ""}
            onChange={(e) =>
              setApartmentComplexPayload((p) => ({
                ...p,
                metaDescription: e.target.value || null,
              }))
            }
            className="w-full border rounded px-3 py-2 min-h-16"
            placeholder="Описание для поисковых систем"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Meta Keywords</label>
          <textarea
            value={apartmentComplexPayload.metaKeywords || ""}
            onChange={(e) =>
              setApartmentComplexPayload((p) => ({
                ...p,
                metaKeywords: e.target.value || null,
              }))
            }
            className="w-full border rounded px-3 py-2 min-h-12"
            placeholder="Ключевые слова, разделенные запятыми"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Meta Image (OG Image)</label>
          <input
            type="text"
            value={apartmentComplexPayload.metaImage || ""}
            onChange={(e) =>
              setApartmentComplexPayload((p) => ({
                ...p,
                metaImage: e.target.value || null,
              }))
            }
            className="w-full border rounded px-3 py-2"
            placeholder="https://..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">URL Slug</label>
          <input
            type="text"
            value={apartmentComplexPayload.slug || ""}
            onChange={(e) =>
              setApartmentComplexPayload((p) => ({
                ...p,
                slug: e.target.value || null,
              }))
            }
            className="w-full border rounded px-3 py-2"
            placeholder="apartment-complex-url"
          />
        </div>
      </div>

      {/* Submit Buttons */}
      <div className="flex justify-between items-center pt-4 border-t">
        <div>
          {isEditing && onDelete && (
            <button
              type="button"
              onClick={() => void onDelete()}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Удалить
            </button>
          )}
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border rounded"
          >
            Отмена
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 disabled:opacity-50"
          >
            {saving ? "Сохранение..." : "Сохранить"}
          </button>
        </div>
      </div>
    </form>
  );

  const title = useMemo(() => {
    if (contentType === "flat")
      return isEditing ? "Редактировать квартиру" : "Создать квартиру";
    if (contentType === "category")
      return isEditing ? "Редактировать категорию" : "Создать категорию";
    if (contentType === "bid")
      return isEditing ? "Редактировать заявку" : "Создать заявку?";
    if (contentType === "layout")
      return isEditing ? "Редактировать планировку" : "Создать планировку";
    if (contentType === "apartmentComplex")
      return isEditing ? "Редактировать жилой комплекс" : "Создать жилой комплекс";
  }, [contentType, isEditing]);

  return (
    <div className="fixed inset-0 bg-black/40 flex items-start justify-center z-50 overflow-auto py-10 px-4">
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full relative">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">{title}</h2>
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {contentType === "flat" && renderFlatForm()}
        {contentType === "category" && renderCategoryForm()}
        {contentType === "bid" && renderBidForm()}
        {contentType === "layout" && renderLayoutForm()}
        {contentType === "apartmentComplex" && renderApartmentComplexForm()}
        
        {/* Variant Form Modal */}
        {showVariantForm && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">
                  {(editingVariant || editingLocalVariant) ? "Редактировать вариант" : "Добавить вариант"}
                </h3>
                <button
                  onClick={closeVariantForm}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              
              <form onSubmit={(e) => {
                e.preventDefault();
                if (isEditing && flatPayload.flat.id) {
                  // Handle API variants for existing flats
                  editingVariant ? handleUpdateVariant() : handleCreateVariant();
                } else {
                  // Handle local variants for new flats
                  editingLocalVariant ? handleUpdateLocalVariant() : handleCreateLocalVariant();
                }
              }} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Площадь (м²)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={variantFormData.area || ""}
                    onChange={(e) => setVariantFormData(prev => ({
                      ...prev,
                      area: e.target.value ? parseFloat(e.target.value) : undefined
                    }))}
                    className="w-full border rounded px-3 py-2"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Цена (₽)
                  </label>
                  <input
                    type="number"
                    value={variantFormData.price || ""}
                    onChange={(e) => setVariantFormData(prev => ({
                      ...prev,
                      price: e.target.value ? parseInt(e.target.value) : undefined
                    }))}
                    className="w-full border rounded px-3 py-2"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Этаж
                  </label>
                  <input
                    type="number"
                    value={variantFormData.floor || ""}
                    onChange={(e) => setVariantFormData(prev => ({
                      ...prev,
                      floor: e.target.value ? parseInt(e.target.value) : undefined
                    }))}
                    className="w-full border rounded px-3 py-2"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Статус
                  </label>
                  <select
                    value={variantFormData.status || "AVAILABLE"}
                    onChange={(e) => setVariantFormData(prev => ({
                      ...prev,
                      status: e.target.value as "AVAILABLE" | "RESERVED" | "SOLD"
                    }))}
                    className="w-full border rounded px-3 py-2"
                    required
                  >
                    <option value="AVAILABLE">Доступно</option>
                    <option value="RESERVED">Забронировано</option>
                    <option value="SOLD">Продано</option>
                  </select>
                </div>
                
                <div>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={variantFormData.hasDecoration || false}
                      onChange={(e) => setVariantFormData(prev => ({
                        ...prev,
                        hasDecoration: e.target.checked
                      }))}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm font-medium">С отделкой</span>
                  </label>
                </div>
                
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={closeVariantForm}
                    className="px-4 py-2 text-gray-600 border rounded hover:bg-gray-50"
                  >
                    Отмена
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    {(editingVariant || editingLocalVariant) ? "Обновить" : "Создать"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentEditor;

