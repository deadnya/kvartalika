import { type FormEvent, memo, useCallback } from "react";
import { createSearchParams, useNavigate } from "react-router-dom";
import type { SearchRequest } from "../services";
import { useFlatsStore } from "../store/flats.store.ts";
import { useUIStore } from "../store/ui.store.ts";

const serializeFiltersToParams = (
  filters: SearchRequest,
): Record<string, string> => {
  const params: Record<string, string> = {};

  if (filters.query) params.query = filters.query;
  if (filters.minPrice !== undefined)
    params.minPrice = String(filters.minPrice);
  if (filters.maxPrice !== undefined)
    params.maxPrice = String(filters.maxPrice);
  if (filters.rooms !== undefined) params.rooms = String(filters.rooms);
  if (filters.bathrooms !== undefined)
    params.bathrooms = String(filters.bathrooms);
  if (filters.isDecorated !== undefined)
    params.isDecorated = String(filters.isDecorated);
  if (filters.homeId !== undefined) params.homeId = String(filters.homeId);
  if (filters.hasParks !== undefined)
    params.hasParks = String(filters.hasParks);
  if (filters.hasSchools !== undefined)
    params.hasSchools = String(filters.hasSchools);
  if (filters.hasShops !== undefined)
    params.hasShops = String(filters.hasShops);
  if (filters.categoriesId && filters.categoriesId.length > 0) {
    params.categoriesId = filters.categoriesId.join(",");
  }
  if (filters.sortBy) params.sortBy = filters.sortBy;
  if (filters.sortOrder) params.sortOrder = filters.sortOrder;

  return params;
};

const SearchBar = memo(() => {
  const { currentSearchParams, setFilters, searchFlats } = useFlatsStore();

  const closeModal = useUIStore((state) => state.closeModal);

  const navigate = useNavigate();

  const handleFilterChange = useCallback(
    (key: keyof SearchRequest, value: unknown) => {
      setFilters({ [key]: value } as Partial<SearchRequest>);
    },
    [setFilters],
  );

  const handleSearchSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      closeModal("filters");

      const params = serializeFiltersToParams(currentSearchParams);
      const search = createSearchParams(params).toString();

      navigate({ pathname: "/layouts", search }, { replace: true });
      void searchFlats(1);
    },
    [currentSearchParams, closeModal, searchFlats, navigate],
  );

  return (
    <div className="w-full">
      <form
        onSubmit={handleSearchSubmit}
        className="bg-white rounded-2xl shadow-xl p-4"
      >
        <div className="flex flex-col lg:flex-row gap-3">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Поиск по названию или номеру..."
              value={currentSearchParams.query || ""}
              onChange={(e) => handleFilterChange("query", e.target.value)}
              className="input-field border-0 rounded-xl w-full pl-10 pr-4 py-3 bg-gray-50 focus:bg-white transition-colors"
            />
          </div>

          <button
            type="submit"
            className="btn-primary px-8 py-3 rounded-xl flex items-center gap-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            Найти
          </button>
        </div>
      </form>
    </div>
  );
});

SearchBar.displayName = "SearchBar";

export default SearchBar;
