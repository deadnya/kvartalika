export interface ApartmentComplexCardProps {
  title: string;
  address: string;
  floorCount: number;
  description: string;
  finishDate: string;
  imageSrc: string;
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

export interface ApartmentDto {
  id: string;
  roomCount: number;
  toiletCount: number;
  houseComplexTitle: string;
  address: string;
  area: number;
  houseComplexId: string;
  flatId: string;
  imageSrc: string;
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
  viewButtonText: string;

  locationTitle: string;
  locationMotto: string;
  goodThings: GoodThing[];
  locationMapLatitude: number;
  locationMapLongitude: number;

  availableApartmentsTitle: string;
  availableApartments: ApartmentDto[];

  transportAvailabilityTitle: string;
  transportAvailabilityMotto: string;
  transportItems: TransportAvailabilityItem[];
  transportImage: string;

  buildingHistoryTitle: string;
  buildingHistory: BuildingHistoryItem[];

  amenitiesTitle: string;
  amenitiesDescription: string;
  amenities: AmenityItem[];
  amenitiesImages: string[];

  technologiesTitle: string;
  technologiesDescription: string;
  technologies: TechnologyItem[];
  technologiesImage: string;

  catchItTitle: string;
  catchItOfferTitle: string;
  catchItOfferDescription: string;

  contactInfo: {
    address: string;
    workingHours: string;
    phone: string;
    email: string;
  };
}
