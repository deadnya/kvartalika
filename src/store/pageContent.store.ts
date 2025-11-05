import { create } from "zustand";
import type { HomePageContent, ApartmentComplexPageContent, FooterDto, AboutUsPageContent, ApartmentComplexCardProps, ApartmentDtoResponse, ApartmentsPageContent } from "../services/api/pages.api.types";

interface PageContentState {
    homePageContent: HomePageContent | null;
    homePageFooter: FooterDto | null;
    homePageComplex: ApartmentComplexPageContent | null;
    aboutUsPageContent: AboutUsPageContent | null;
    complexesPageContent: ApartmentComplexCardProps[] | null;
    complexPageContent: Record<string, ApartmentComplexPageContent>;
    complexPageApartments: Record<string, ApartmentDtoResponse[]>;
    apartmentsPageContent: ApartmentsPageContent | null;
    
    setHomePageContent: (content: HomePageContent) => void;
    setHomePageFooter: (footer: FooterDto) => void;
    setHomePageComplex: (complex: ApartmentComplexPageContent) => void;
    setAboutUsPageContent: (content: AboutUsPageContent) => void;
    setComplexesPageContent: (content: ApartmentComplexCardProps[]) => void;
    setComplexPageContent: (id: string, content: ApartmentComplexPageContent) => void;
    setComplexPageApartments: (id: string, apartments: ApartmentDtoResponse[]) => void;
    setApartmentsPageContent: (content: ApartmentsPageContent) => void;
    
    clearHomePageContent: () => void;
    clearAboutUsPageContent: () => void;
    clearComplexesPageContent: () => void;
    clearApartmentsPageContent: () => void;
}

export const usePageContentStore = create<PageContentState>((set) => ({
    homePageContent: null,
    homePageFooter: null,
    homePageComplex: null,
    aboutUsPageContent: null,
    complexesPageContent: null,
    complexPageContent: {},
    complexPageApartments: {},
    apartmentsPageContent: null,
    
    setHomePageContent: (content) => set({ homePageContent: content }),
    setHomePageFooter: (footer) => set({ homePageFooter: footer }),
    setHomePageComplex: (complex) => set({ homePageComplex: complex }),
    setAboutUsPageContent: (content) => set({ aboutUsPageContent: content }),
    setComplexesPageContent: (content) => set({ complexesPageContent: content }),
    setComplexPageContent: (id, content) => set((state) => ({
        complexPageContent: { ...state.complexPageContent, [id]: content }
    })),
    setComplexPageApartments: (id, apartments) => set((state) => ({
        complexPageApartments: { ...state.complexPageApartments, [id]: apartments }
    })),
    setApartmentsPageContent: (content) => set({ apartmentsPageContent: content }),
    
    clearHomePageContent: () => set({
        homePageContent: null,
        homePageFooter: null,
        homePageComplex: null,
    }),
    
    clearAboutUsPageContent: () => set({
        aboutUsPageContent: null,
    }),
    
    clearComplexesPageContent: () => set({
        complexesPageContent: null,
    }),
    
    clearApartmentsPageContent: () => set({
        apartmentsPageContent: null,
    }),
}));
