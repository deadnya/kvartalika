import { apiClient } from "../api.config";
import type { HomePageContent, AboutUsPageContent, ApartmentComplexPageContent, ApartmentComplexesPageContent, ApartmentsPageContent, ApartmentComplexCardProps } from "./pages.api.types";
import { MOCK_HOME_PAGE_CONTENT } from "./mocks/homePage.mock";
import { MOCK_ABOUT_US_PAGE_CONTENT } from "./mocks/aboutUsPage.mock";
import { MOCK_APARTMENT_COMPLEX_PAGE_CONTENT } from "./mocks/apartmentComplexPage.mock";
import { MOCK_APARTMENT_COMPLEXES_PAGE_CONTENT } from "./mocks/apartmentComplexesPage.mock";
import { MOCK_APARTMENTS_PAGE_CONTENT } from "./mocks/apartmentsPage.mock";

export const getHomePageContent = async (): Promise<HomePageContent> => {
  try {
    const response = await apiClient.get<HomePageContent>("/home");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch home page content, using mock data:", error);
    return MOCK_HOME_PAGE_CONTENT;
  }
};

export const postHomePageContent = async (content: HomePageContent) => {
  try {
    const response = await apiClient.post("/home", content);
    return response.data;
  } catch (error) {
    console.error("Failed to post home page content", error);
  }
}

export const putHomePageContent = async (content: HomePageContent) => {
  try {
    const response = await apiClient.put("/home", content);
    return response.data;
  } catch (error) {
    console.error("Failed to put home page content", error);
  }
}

export const getAboutUsPageContent = async (): Promise<AboutUsPageContent> => {
  try {
    const response = await apiClient.get<AboutUsPageContent>("/aboutus/content");
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
    const response = await apiClient.get<ApartmentComplexPageContent>(`/complex/${complexId}/content`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch apartment complex page content, using mock data:", error);
    return MOCK_APARTMENT_COMPLEX_PAGE_CONTENT;
  }
};

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
