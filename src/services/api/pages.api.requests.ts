import { apiClient } from "../api.config";
import type { HomePageContent, HomePageContentRequest, AboutUsPageContent, ApartmentComplexPageContent, ApartmentsPageContent, ApartmentComplexCardProps, AparmentComplexDto, FooterDto, ApartmentDto, ApartmentDtoResponse, ApartmentDtoResponseWithVariants } from "./pages.api.types";
import { MOCK_HOME_PAGE_CONTENT } from "./mocks/homePage.mock";
import { MOCK_ABOUT_US_PAGE_CONTENT } from "./mocks/aboutUsPage.mock";
import { MOCK_APARTMENT_COMPLEX_PAGE_CONTENT } from "./mocks/apartmentComplexPage.mock";
import { MOCK_APARTMENT_COMPLEXES_PAGE_CONTENT } from "./mocks/apartmentComplexesPage.mock";
import { MOCK_APARTMENTS_PAGE_CONTENT } from "./mocks/apartmentsPage.mock";

export const getHomePageContent = async (): Promise<HomePageContent> => {
  try {
    const response = await apiClient.get<HomePageContent>("/home");
    if (response.status == 204) throw new Error("No content")
    return response.data;
  } catch (error) {
    console.error("Failed to fetch home page content, using mock data:", error);
    return MOCK_HOME_PAGE_CONTENT;
  }
};

export const postHomePageContent = async (content: HomePageContentRequest) => {
  try {
    const response = await apiClient.post("/home", content);
    return response.data;
  } catch (error) {
    console.error("Failed to post home page content", error);
  }
}

export const putHomePageContent = async (content: HomePageContentRequest) => {
  try {
    const response = await apiClient.put("/home", content);
    return response.data;
  } catch (error) {
    console.error("Failed to put home page content", error);
  }
}

export const getAboutUsPageContent = async (): Promise<AboutUsPageContent> => {
  try {
    const response = await apiClient.get<AboutUsPageContent>("/aboutus");
    if (response.status == 204) throw new Error("No content")
    return response.data;
  } catch (error) {
    console.error("Failed to fetch about us page content, using mock data:", error);
    return MOCK_ABOUT_US_PAGE_CONTENT;
  }
};

export const postAboutUsPageContent = async (content: AboutUsPageContent) => {
  try {
    const response = await apiClient.post("/aboutus", content);
    return response.data;
  } catch (error) {
    console.error("Failed to post about us page content", error);
  }
};

export const putAboutUsPageContent = async (content: AboutUsPageContent) => {
  try {
    const response = await apiClient.put("/aboutus", content);
    return response.data;
  } catch (error) {
    console.error("Failed to put about us page content", error);
  }
};

export const getApartmentComplexPageContent = async (complexId: string): Promise<ApartmentComplexPageContent> => {
  try {
    const response = await apiClient.get<ApartmentComplexPageContent>(`/homes/${complexId}`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch apartment complex page content, using mock data:", error);
    return MOCK_APARTMENT_COMPLEX_PAGE_CONTENT;
  }
};

export const putApartmentComplex = async (complexId: string, complex: ApartmentComplexPageContent) => {
  // Remove frontend-only fields before sending to backend
  // Keep id fields - backend DTOs require them
  const { imagesResolved, yardsImagesResolved, panResolved, ...rest } = complex as any;
  const payload = {
    ...rest,
  };
  const response = await apiClient.put<ApartmentComplexPageContent>(`/homes/${complexId}`, payload);
  console.log(response)
  return response.data;
}

export const postApartmentComplex = async (complexId: string, complex: ApartmentComplexPageContent) => {
  // Remove frontend-only fields before sending to backend
  // Keep id fields - backend DTOs require them
  const { imagesResolved, yardsImagesResolved, panResolved, ...rest } = complex as any;
  const payload = {
    ...rest,
  };
  const response = await apiClient.post<ApartmentComplexPageContent>(`/homes/${complexId}`, payload);
  console.log(response)
  return response.data;
}

export const getApartmentComplexesPageContent = async (): Promise<ApartmentComplexCardProps[]> => {
  try {
    const response = await apiClient.get<ApartmentComplexCardProps[]>("/homes");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch apartment complexes page content, using mock data:", error);
    return MOCK_APARTMENT_COMPLEXES_PAGE_CONTENT;
  }
};

export const getApartmentsPageContent = async (): Promise<ApartmentsPageContent> => {
  try {
    const response = await apiClient.get<ApartmentsPageContent>("/apartments/content");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch apartments page content, using mock data:", error);
    return MOCK_APARTMENTS_PAGE_CONTENT;
  }
};

export const getApartmentComplex = async (id: string | number) => {
  const response = await apiClient.get<AparmentComplexDto>(`/homes/${id}`)
  return response;
}

export const getFooterData = async () => {
  const response = await apiClient.get<FooterDto>(`/page_info`)
  console.log(response)
  return response;
}

export const putFooterData = async (data: FooterDto) => {
  const response = await apiClient.put<FooterDto>(`/page_info`, data)
  console.log(response)
  return response;
}

export const getApartmentsForComplex = async (id: string): Promise<ApartmentDtoResponse[]> => {
  const response = await apiClient.get<ApartmentDtoResponse[]>(`/homes/${id}/flats`)
  console.log(response)
  return response.data;
}

export interface SearchApartmentsRequest {
  minPrice: number;
  maxPrice: number;
  rooms: number | null;
  bathrooms: number | null;
  isDecorated: boolean;
  homeId: number | null;
  hasParks: boolean;
  hasSchools: boolean;
  hasStores: boolean;
  categoriesId: number[];
  sortBy: 'price' | 'rooms' | 'area' | 'location' | string;
  sortOrder: 'asc' | 'desc';
}

export const searchApartments = async (filters: SearchApartmentsRequest): Promise<ApartmentDto[]> => {
  try {
    const response = await apiClient.post<ApartmentDtoResponse[]>("/search", filters);
    return response.data.map(item => item.flat);
  } catch (error) {
    console.error("Failed to search apartments, using mock data:", error);
    return MOCK_APARTMENTS_PAGE_CONTENT.apartments;
  }
};

export const getApartment = async (id: string): Promise<ApartmentDtoResponseWithVariants> => {
  const response = await apiClient.get<ApartmentDtoResponseWithVariants>(`/flats/${id}`)
  console.log(response.data)
  return response.data;
}