import { apiClient } from "../api.config";
import type { HomePageContent, HomePageContentRequest, AboutUsPageContent, ApartmentComplexPageContent, ApartmentsPageContent, ApartmentComplexCardProps, AparmentComplexDto, FooterDto, ApartmentDto, ApartmentDtoResponse, CategoryDto, ContactRequestDto, FindRequestDto, BidsResponse } from "./pages.api.types";

export const getHomePageContent = async (): Promise<HomePageContent> => {
  const response = await apiClient.get<HomePageContent>("/home");
  if (response.status == 204) throw new Error("No content")
  return response.data;
};

export const postHomePageContent = async (content: HomePageContentRequest) => {
  try {
    const response = await apiClient.post("/home", content);
    return response.data;
  } catch (error) {
    // Silently handle error
  }
}

export const putHomePageContent = async (content: HomePageContentRequest) => {
  try {
    const response = await apiClient.put("/home", content);
    return response.data;
  } catch (error) {
    // Silently handle error
  }
}

export const getAboutUsPageContent = async (): Promise<AboutUsPageContent> => {
  const response = await apiClient.get<AboutUsPageContent>("/aboutus");
  if (response.status == 204) throw new Error("No content")
  return response.data;
};

export const postAboutUsPageContent = async (content: AboutUsPageContent) => {
  try {
    const response = await apiClient.post("/aboutus", content);
    return response.data;
  } catch (error) {
    // Silently handle error
  }
};

export const putAboutUsPageContent = async (content: AboutUsPageContent) => {
  try {
    const response = await apiClient.put("/aboutus", content);
    return response.data;
  } catch (error) {
    // Silently handle error
  }
};

export const getApartmentComplexPageContent = async (complexId: string): Promise<ApartmentComplexPageContent> => {
  const response = await apiClient.get<ApartmentComplexPageContent>(`/homes/${complexId}`);
  return response.data;
};

export const putApartmentComplex = async (complexId: string, complex: ApartmentComplexPageContent) => {
  // Remove frontend-only fields before sending to backend
  // Keep id fields - backend DTOs require them
  const { imagesResolved, yardsImagesResolved, panResolved, ...rest } = complex as any;
  const payload = {
    ...rest,
  };
  const response = await apiClient.put<ApartmentComplexPageContent>(`/homes/${complexId}`, payload);
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
  return response.data;
}

export const getApartmentComplexesPageContent = async (): Promise<ApartmentComplexCardProps[]> => {
  const response = await apiClient.get<ApartmentComplexCardProps[]>("/homes");
  return response.data;
};

export const getApartmentsPageContent = async (): Promise<ApartmentsPageContent> => {
  const response = await apiClient.get<ApartmentsPageContent>("/homes");
  return response.data;
};

export const getApartmentComplex = async (id: string | number) => {
  const response = await apiClient.get<AparmentComplexDto>(`/homes/${id}`)
  return response;
}

export const getFooterData = async () => {
  const response = await apiClient.get<FooterDto>(`/page_info`)
  return response;
}

export const putFooterData = async (data: FooterDto) => {
  const response = await apiClient.put<FooterDto>(`/page_info`, data)
  return response;
}

export const getApartmentsForComplex = async (id: string): Promise<ApartmentDtoResponse[]> => {
  const response = await apiClient.get<ApartmentDtoResponse[]>(`/homes/${id}/flats`)
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
  const response = await apiClient.post<ApartmentDtoResponse[]>("/search", filters);
  return response.data.map(item => item.flat);
};

export const getApartment = async (id: string): Promise<ApartmentDtoResponse> => {
  const response = await apiClient.get<ApartmentDtoResponse>(`/flats/${id}`)
  return response.data;
}

export const getCategories = async (): Promise<CategoryDto[]> => {
  const response = await apiClient.get<CategoryDto[]>(`/categories`)
  return response.data
}

export const getApartmentComplexes = async (): Promise<AparmentComplexDto[]> => {
  const response = await apiClient.get<AparmentComplexDto[]>(`/homes`)
  return response.data
}

export const getContactRequests = async (): Promise<ContactRequestDto[]> => {
  try {
    const response = await apiClient.get<ContactRequestDto[]>(`/contact_request`);
    return response.data;
  } catch (error) {
    return [];
  }
};

export const getFindRequests = async (): Promise<FindRequestDto[]> => {
  try {
    const response = await apiClient.get<FindRequestDto[]>(`/find_request`);
    return response.data;
  } catch (error) {
    return [];
  }
};

export const getAllBids = async (): Promise<BidsResponse> => {
  try {
    const [contactRequests, findRequests] = await Promise.all([
      getContactRequests(),
      getFindRequests()
    ]);
    return {
      contactRequests,
      findRequests
    };
  } catch (error) {
    return {
      contactRequests: [],
      findRequests: []
    };
  }
};

export const checkContactRequest = async (id: number): Promise<ContactRequestDto> => {
  try {
    const response = await apiClient.post<ContactRequestDto>(`/contact_request/${id}/check`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const checkFindRequest = async (id: number): Promise<FindRequestDto> => {
  try {
    const response = await apiClient.post<FindRequestDto>(`/find_request/${id}/check`);
    return response.data;
  } catch (error) {
    throw error;
  }
};