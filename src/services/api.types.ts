import type { UserRole } from "../store/auth.store.ts";
import type { TABS } from "./index.ts";

export interface LoginRequest {
  username?: string;
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  surname: string;
  patronymic?: string;
  email: string;
  phone?: string;
  password: string;
  telegramId: string;
}

export interface RegisterResponse {
  message: string;
  id: string;
}

export interface ContentManagerRequest {
  name?: string;
  surname?: string;
  patronymic?: string;
  email?: string;
  phone?: string;
  password?: string;
  telegramId?: string;
  role?: UserRole;
}

export interface UserDto {
  name: string;
  surname: string;
  patronymic?: string;
  email: string;
  phone?: string;
  createdAt?: string;
  updatedAt?: string;
  role: UserRole;
  password: string;
  telegramId?: string;
}

export interface CategoryRequest {
  id?: number;
  name?: string;
  isOnMainPage?: boolean;
}

export const defaultCategory = {
  name: "",
  isOnMainPage: false,
};

export interface DescriptionRequest {
  title: string;
  content: string;
  type?: string;
}

export interface VariantRequest {
  flatId?: number;
  id?: number;
  area: number;
  price: number;
  floor: number;
  status: string;
  hasDecoration?: boolean;
}

export interface CreateFlatVariantRequest {
  flatId: number;
  area: number;
  price: number;
  floor: number;
  status: "AVAILABLE" | "RESERVED" | "SOLD";
  hasDecoration: boolean;
}

export interface UpdateFlatVariantRequest {
  id: number;
  area: number;
  price: number;
  floor: number;
  status: "AVAILABLE" | "RESERVED" | "SOLD";
  hasDecoration: boolean;
}

export interface FlatVariantDto {
  flatId: number;
  id: number;
  area: number;
  price: number;
  floor: number;
  status: "AVAILABLE" | "RESERVED" | "SOLD";
  hasDecoration: boolean;
}

export interface FlatRequest {
  id?: string | number;
  name?: string;
  description?: string;
  images?: string[];
  address?: string;
  latitude?: number | null;
  longitude?: number | null;
  features?: string[];
  numberOfRooms?: number;
  about?: string | null;
  homeId?: string | null;
  numberOfBathrooms?: number;
  numberForSale?: string | null;
  published?: boolean;
  imagesClean?: string[];
  pan?: string | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
  metaKeywords?: string | null;
  metaImage?: string | null;
  slug?: string | null;
  layoutId?: string | null;
  variants?: VariantRequest[];
  // Legacy fields - for backward compatibility
  price?: number;
  area?: number;
  floor?: number;
}

export interface HomeRequest {
  id?: number;
  name?: string;
  description?: string;
  images?: string[];
  address?: string;
  latitude?: number;
  longitude?: number;
  yearBuilt?: number;
  history?: string[];
  historyImages?: string[];
  features?: string[];
  about?: string;
  numberOfFloors?: number;
  storesNearby?: boolean;
  schoolsNearby?: boolean;
  hospitalsNearby?: boolean;
  hasYards?: boolean;
  yardsImages?: string[];
  model3D?: string;
  pan?: string;
  published?: boolean;
}

export interface ApartmentComplexRequest {
  id?: number;
  name?: string;
  description?: string;
  secondDescription?: string | null;
  images?: string[];
  address?: string;
  latitude?: number;
  longitude?: number;
  yearBuilt?: number;
  history?: Array<{
    title?: string;
    description?: string;
    image: string;
  }>;
  features?: string[];
  about?: string;
  numberOfFloors?: number;
  storesNearby?: boolean;
  schoolsNearby?: boolean;
  hospitalsNearby?: boolean;
  hasYards?: boolean;
  yardsImages?: string[];
  published?: boolean;
  model3D?: string | null;
  pan?: string | null;
  quartalOfFinish?: string | null;
  locationDescription?: string | null;
  transportAvailabilityMotto?: string | null;
  transportItems?: Array<{
    title?: string;
    description?: string;
  }> | null;
  transportImage?: string | null;
  amenitiesDescription?: string | null;
  amenities?: Array<{
    iconType: 'car' | 'map2' | 'building2' | 'disabled';
    title?: string;
    description?: string;
  }> | null;
  amenitiesImages?: string[];
  technologiesDescription?: string | null;
  technologies?: Array<{
    title?: string;
    description?: string | string[];
  }> | null;
  technologiesImage?: string | null;
  catchItOfferTitle?: string | null;
  catchItOfferDescription?: string | null;
  goodThings?: Array<{
    title?: string;
    description?: string;
  }> | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
  metaKeywords?: string | null;
  metaImage?: string | null;
  slug?: string | null;
}

export interface LayoutRequest {
  id?: number;
  homeId?: number;
  name?: string;
  layoutImage?: string;
}

export interface RequestCreate {
  name?: string;
  surname?: string;
  patronymic?: string;
  phone?: string;
  email?: string;
}

export interface SearchRequest {
  query?: string;

  minPrice?: number;
  maxPrice?: number;

  rooms?: number;

  bathrooms?: number;
  isDecorated?: boolean;

  homeId?: number;

  hasParks?: boolean;
  hasSchools?: boolean;
  hasShops?: boolean;

  categoriesId?: number[];

  sortBy?: "price" | "rooms" | "area" | "location";
  sortOrder?: "asc" | "desc";
}

// API Response Types
export interface ApiResponse<T> {
  data?: T;
  message?: string;
  success?: boolean;
  status?: number;
}

export interface RequestsPost201Response {
  id: number;
  message: string;
  success: boolean;
}

export interface Category {
  id: number;
  name?: string;
  isOnMainPage?: boolean;
}

export interface Layout {
  id: number;
  layoutImage: string;
  name: string;
  homeId: number;
}

export interface BidRequest {
  name?: string;
  surname?: string;
  patronymic?: string;
  phone?: string;
  email?: string;
  isChecked: boolean;
  createdAt?: number;
}

export interface Description {
  id: number;
  title: string;
  content: string;
  type?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Photo {
  id: number;
  url: string;
  altText?: string;
  filename: string;
  size: number;
  mimeType: string;
  createdAt: string;
  updatedAt: string;
}

export interface FlatWithCategoryRequest {
  flat: FlatRequest;
  categories: Partial<Category>[];
}

export interface ResolvedFlat extends FlatWithCategoryRequest {
  imagesResolved?: string[];
  layoutResolved?: string;
  imagesCleanResolved?: string[];
  panResolved?: string;
}

export interface HomePageFlats {
  category: Category;
  flats: ResolvedFlat[];
}

export interface ResolvedHome extends HomeRequest {
  imagesResolved?: string[];
  historyImagesResolved?: string[];
  yardsImagesResolved?: string[];
  model3DResolved?: string;
  panResolved?: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  role: UserRole;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface FileUploadRequest {
  file: Blob;
  altText?: string;
}

export interface FileUploadResponse {
  id: number;
  url: string;
  filename: string;
  size: number;
  mimeType: string;
}

export interface SocialMedia {
  id: number;
  image: string;
  link: string;
}

export type Tab = (typeof TABS)[number];

export interface DirectoriesResponse {
  directories: string[];
}

export interface DirectoriesChildrenResponse {
  children: string[];
}

export interface FilesResponse {
  files: Blob[];
}

export interface FileEntry {
  name: string;
  blob: Blob;
}

