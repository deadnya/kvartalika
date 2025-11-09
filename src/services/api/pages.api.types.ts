export interface ApartmentComplexCardProps {
  name: string;
  address: string;
  numberOfFloors: number;
  description: string;
  yearBuilt: string;
  images: string[];
  id: string;
}

export interface ApartmentComplexesPageContent {
  complexes: ApartmentComplexCardProps[];
}

export interface ApartmentSearchFilters {
  selectedComplex: string | number | null;
  priceRange: { min: number; max: number };
  selectedCategory: string | number | null;
  roomCount: string | number | (string | number)[] | null;
  bathroomCount: string | number | (string | number)[] | null;
  hasFinish: boolean;
  parks: boolean;
  schools: boolean;
  shops: boolean;
}

export interface SortingOptions {
  sortByCost: 'noSorting' | 'sortingAsc' | 'sortingDesc';
  sortByArea: 'noSorting' | 'sortingAsc' | 'sortingDesc';
  sortByRoomCount: 'noSorting' | 'sortingAsc' | 'sortingDesc';
}

export interface ApartmentsPageContent {
  apartments: ApartmentDto[];
  totalApartments: number;
  defaultFilters: ApartmentSearchFilters;
  defaultSorting: SortingOptions;
  complexOptions: { value: string; label: string }[];
  categoryOptions: { value: string; label: string }[];
}

export interface ProjectParams {
  icon: string;
  label: string;
  value: string;
}

export interface AparmentComplexDto {
  id: string;
  name: string;
}

export interface ProjectInfo {
  id: string;
  title: string;
  location: string;
  floors: number;
  description: string;
  params: ProjectParams[];
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

export interface ApartmentDto {
  id: string | number;
  name: string;
  description: string;
  images: string[];
  address: string;
  latitude: number | null;
  longitude: number | null;
  features: string[];
  numberOfRooms: number;
  about: string | null;
  homeId: string | null;
  numberOfBathrooms: number;
  numberForSale: string | null;
  published: boolean;
  imagesClean: string[];
  pan: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  metaKeywords: string | null;
  metaImage: string | null;
  slug: string | null;
  variants: FlatVariantDto[];
  houseComplexTitle?: string;
  areaMin?: number;
  areaMax?: number;
  flatId?: string;
}

export interface CategoryDto {
  id: number;
  name: string;
  isOnMainPage: boolean;
}

export interface ApartmentDtoResponse {
  flat: ApartmentDto;
  categories: CategoryDto[];
}

export interface PaymentMethodInfo {
  title: string;
  description: string;
  iconType: 'payment1' | 'payment2' | 'payment3' | 'payment4';
}

export interface PromotionInfo {
  id: string;
  title: string;
  description: string;
  longDescription?: string | null;
  imageSrc: string;
}

export interface HomePageContentRequest {
  heroTitle: {
    partOne: string;
    partTwo: string;
    partThree: string;
  };
  heroMotto: string;
  heroImageSrc: string;
  
  projects: ProjectInfo[];
  
  hotDealFlatIds: number[];
  
  paymentMethods: PaymentMethodInfo[];
  
  promotions: PromotionInfo[];

  // SEO
  metaTitle?: string | null;
  metaDescription?: string | null;
  metaKeywords?: string | null;
  metaImage?: string | null;
  
  contactInfo?: {
    address: string;
    workingHours: string;
    phone: string;
    email: string;
  };
}

export interface HomePageContent extends HomePageContentRequest {
  hotDeals: ApartmentDto[];
}

export interface Principle {
  id: string;
  title: string;
  description: string;
  imageNumber: string; // "01" or "02"
}

export interface Value {
  id: string;
  title: string;
  description: string;
  iconType: 'principle1' | 'principle2' | 'principle3' | 'principle4';
}

export interface Partner {
  id: string;
  name: string;
  description: string;
  iconType: 'sberbank' | 'stroygroup';
}

export interface AboutUsPageContent {
  hero: {
    imageSrc: string;
    motto: {
      partOne: string;
      partTwo: string;
      partThree: string;
    };
    bottomText: string;
  };

  imageRow: {
    imageSrc1: string;
    imageSrc2: string;
    imageSrc3: string;
  };

  principles: Principle[];

  valuesImage: string;

  values: Value[];

  partners: Partner[];

  contactInfo: {
    address: string;
    workingHours: string;
    phone: string;
    email: string;
  };

  metaTitle: string
  metaDescription: string
  metaKeywords: string
  metaImage: string
}

export interface GoodThing {
  id: string;
  title: string;
  description: string;
}

export interface TransportAvailabilityItem {
  id: string;
  title: string;
  description: string;
}

export interface BuildingHistoryItem {
  id: string;
  header: string;
  description: string;
  image: string;
}

export interface AmenityItem {
  id: string;
  iconType: 'car' | 'map2' | 'building2' | 'disabled';
  title: string;
  description: string;
}

export interface TechnologyItem {
  id: string;
  title: string;
  description: string | string[];
}

export interface ApartmentComplexPageContent {
  id: number;
  name: string;
  description: string;
  secondDescription: string | null;
  images: string[];
  address: string;
  latitude: number;
  longitude: number;
  yearBuilt: number;
  history: BuildingHistoryItem[];
  features: string[];
  about: string;
  numberOfFloors: number;
  storesNearby: boolean;
  schoolsNearby: boolean;
  hospitalsNearby: boolean;
  hasYards: boolean;
  yardsImages: string[];
  published: boolean;
  model3D: string | null;
  pan: string | null;
  quartalOfFinish: string | null;
  locationDescription: string | null;
  transportAvailabilityMotto: string | null;
  transportItems: TransportAvailabilityItem[] | null;
  transportImage: string | null;
  amenitiesDescription: string | null;
  amenities: AmenityItem[] | null;
  amenitiesImages: string[];
  technologiesDescription: string | null;
  technologies: TechnologyItem[] | null;
  technologiesImage: string | null;
  catchItOfferTitle: string | null;
  catchItOfferDescription: string | null;
  goodThings: GoodThing[] | null;
  metaTitle: string | null;
  metaDescription: string | null;
  metaKeywords: string | null;
  metaImage: string | null;
  slug: string | null;
}

export interface FooterDto {
  phone: string,
  email: string,
  footerDescription: string,
  title: string,
  address: string,
  description: string,
  privacy: string,
  workingHours: string
}

export interface ContactRequestData {
  name: string;
  phone: string;
  comment?: string;
}

export interface ContactRequestResponse {
  id: number;
  message: string;
  success: boolean;
}

export interface FindRequestData {
  lastName: string;
  firstName: string;
  patronymic: string;
  phone: string;
  email: string;
}

export interface FindRequestResponse {
  id: number;
  message: string;
  success: boolean;
}