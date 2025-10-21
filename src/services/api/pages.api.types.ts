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
  id: string;
  numberOfRooms: number;
  numberOfBathrooms: number;
  houseComplexTitle: string;
  address: string;
  areaMin: number;
  areaMax: number;
  homeId: string;
  flatId: string;
  images: string[];
  variants: [];
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

export interface HomePageContent {
  heroTitle: {
    partOne: string;
    partTwo: string;
    partThree: string;
  };
  heroMotto: string;
  heroImageSrc: string;
  
  projects: ProjectInfo[];
  
  hotDeals: ApartmentDto[];
  
  paymentMethods: PaymentMethodInfo[];
  
  promotions: PromotionInfo[];
  
  contactInfo: {
    address: string;
    workingHours: string;
    phone: string;
    email: string;
  };
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
  title: string;
  description: string;
  imageSrc: string;
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
  galleryImages: string[];

  complexTitle: string;
  complexLocation: string;
  complexDescription: string;

  locationMotto: string;
  goodThings: GoodThing[];
  locationMapLatitude: number;
  locationMapLongitude: number;

  availableApartments: ApartmentDto[];

  transportAvailabilityMotto: string;
  transportItems: TransportAvailabilityItem[];
  transportImage: string;

  buildingHistory: BuildingHistoryItem[];

  amenitiesDescription: string;
  amenities: AmenityItem[];
  amenitiesImages: string[];

  technologiesDescription: string;
  technologies: TechnologyItem[];
  technologiesImage: string;

  catchItOfferTitle: string;
  catchItOfferDescription: string;
}