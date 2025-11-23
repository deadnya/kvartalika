import { useParams } from "react-router-dom";
import { useEffect, useState, Suspense, lazy } from "react";
import { getSlugContent } from "../services/api/pages.api.requests";
import type { SlugResponse, ApartmentComplexPageContent, ApartmentDtoResponse } from "../services/api/pages.api.types";
import NotFoundPage from "./notFoundPage/NotFoundPage";

const ComplexPage = lazy(() => import("./apartmentComplexPage/ApartmentComplexPage"));
const ApartmentPage = lazy(() => import("./apartmentPage/ApartmentPage"));

type PageType = "home" | "flat" | "loading" | "not-found";

const SlugPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [pageType, setPageType] = useState<PageType>("loading");
  const [pageData, setPageData] = useState<ApartmentComplexPageContent | ApartmentDtoResponse | null>(null);

  useEffect(() => {
    const loadSlugContent = async () => {
      if (!slug) {
        setPageType("not-found");
        return;
      }

      try {
        const response: SlugResponse = await getSlugContent(slug);

        if (response.type === "home") {
          setPageData(response.data);
          setPageType("home");
        } else if (response.type === "flat") {
          setPageData(response.data);
          setPageType("flat");
        } else {
          setPageType("not-found");
        }
      } catch (error) {
        console.error("Error loading slug content:", error);
        setPageType("not-found");
      }
    };

    loadSlugContent();
  }, [slug]);

  if (pageType === "loading") {
    return <div style={{ padding: "40px", textAlign: "center" }}>Loading...</div>;
  }

  if (pageType === "not-found") {
    return <NotFoundPage />;
  }

  if (pageType === "home" && pageData) {
    return (
      <Suspense fallback={<div style={{ padding: "40px", textAlign: "center" }}>Loading...</div>}>
        <ComplexPageWithSlug initialData={pageData as ApartmentComplexPageContent} />
      </Suspense>
    );
  }

  if (pageType === "flat" && pageData) {
    return (
      <Suspense fallback={<div style={{ padding: "40px", textAlign: "center" }}>Loading...</div>}>
        <ApartmentPageWithSlug initialData={pageData as ApartmentDtoResponse} />
      </Suspense>
    );
  }

  return <NotFoundPage />;
};

// Wrapper to pass slug to ComplexPage through route params
const ComplexPageWithSlug = ({ initialData }: { initialData: ApartmentComplexPageContent }) => {
  return <ComplexPage initialData={initialData} />;
};

// Wrapper to pass slug to ApartmentPage through route params
const ApartmentPageWithSlug = ({ initialData }: { initialData: ApartmentDtoResponse }) => {
  return <ApartmentPage initialData={initialData} />;
};

export default SlugPage;
