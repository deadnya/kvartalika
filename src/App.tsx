import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { useEffect, useRef } from "react";

import Header from "./components/common/Header";
import Footer from "./components/common/Footer";
import AnimatedPageLoader from "./components/common/PageLoader/AnimatedPageLoader.tsx";
import ScrollToAnchor from "./components/ScrollToAnchor.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import { usePageLoadingState } from "./hooks/usePageLoadingState.ts";
import { executePreloadStrategies } from "./store/pagePreload.manager.ts";
import { pageDataReadyRef } from "./store/pageReady.ts";

import HomePage from "./pages/homePage/HomePage.tsx";
import ApartmentsPage from "./pages/apartmentsPage/ApartmentsPage.tsx";
import LayoutsPage from "./pages/LayoutsPage.tsx";
import LayoutPage from "./pages/LayoutPage.tsx";
import ApartmentComplexesPage from "./pages/apartmentComplexesPage/ApartmentComplexesPage.tsx";
import ComplexPage from "./pages/apartmentComplexPage/ApartmentComplexPage.tsx";
import ApartmentPage from "./pages/apartmentPage/ApartmentPage.tsx";
import AuthPage from "./pages/AuthPage.tsx";
import AdminPage from "./components/admin/AdminPage.tsx";
import ContentManagementPage from "./components/content/ContentManagementPage.tsx";
import PrivacyPage from "./pages/privacyPage/PrivacyPage.tsx";
import RouterListener from "./components/RouterListener.tsx";
import AboutUsPage from "./pages/aboutUsPage/AboutUsPage.tsx";
import TermsOfServicePage from "./pages/termsOfServicePage/TermsOfServicePage.tsx";
import NotFoundPage from "./pages/notFoundPage/NotFoundPage.tsx";
import SlugPage from "./pages/SlugPage.tsx";

// Preload home page on app start
import("./pages/homePage/HomePage.tsx").catch(() => {});

// Preload critical pages on app startup to prevent flickering on navigation
executePreloadStrategies(['homePage', 'aboutPage', 'complexesPage', 'apartmentsPage', 'complexPage']).catch(err => {
  console.error('Failed to preload critical pages:', err);
});

function ScrollToTop() {
  const { pathname } = useLocation();
  const lastPathnameRef = useRef<string>("");

  // URLs that are variations of the same page (apartment listings)
  const apartmentListUrls = [
    "/apartments",
    "/kvartiri-v-tomske",
    "/kupit-odnokomnatnuyu-kvartiru-v-tomske",
    "/dvukhkomnatnie-kvartiri-v-tomske",
    "/trekhkomnatnie-kvartiri-v-tomske"
  ];

  useEffect(() => {
    // Don't scroll if both previous and current paths are apartment list URLs
    const isPrevApartmentList = apartmentListUrls.includes(lastPathnameRef.current);
    const isCurrentApartmentList = apartmentListUrls.includes(pathname);

    if (!(isPrevApartmentList && isCurrentApartmentList)) {
      window.scrollTo(0, 0);
    }

    lastPathnameRef.current = pathname;
  }, [pathname]);

  return null;
}

const InnerApp = () => {
  const location = useLocation();

  // Use page loading state hook for clean, loop-free loading management
  const pageLoading = usePageLoadingState();
  const imagesLoadedRef = useRef(false);

  // Monitor and wait for all images to load, then hide the loader
  useEffect(() => {
    // Reset images loaded flag when route changes
    imagesLoadedRef.current = false;

    // Reset data ready flag when route changes
    pageDataReadyRef.current = false;

    let timeoutId: NodeJS.Timeout;
    let rafId: number;
    const startTime = Date.now();
    const MAX_WAIT_TIME = 3000; // Reduced to 3 seconds - don't wait too long
    let stableCheckCount = 0;
    let lastImageCount = 0;
    let minImageCount = 0; // Minimum images we expect to see

    const checkAllImagesLoaded = () => {
      const images = Array.from(document.querySelectorAll("img") as NodeListOf<HTMLImageElement>);
      const elapsed = Date.now() - startTime;

      const loaded = images.filter((img) => img.complete && img.naturalHeight > 0).length;
      
      // Update minimum image count (once we see more images, that's our baseline)
      if (images.length > minImageCount) {
        minImageCount = images.length;
      }

      // Only consider "all loaded" if we have at least 1 image and all are loaded
      const allLoaded = images.length >= 1 && loaded === images.length;

      // Track if image count has stabilized
      if (images.length === lastImageCount) {
        stableCheckCount++;
      } else {
        stableCheckCount = 0;
        lastImageCount = images.length;
      }

      // If we have enough images, all are loaded and stable, or page data is ready, we're done
      if ((allLoaded && stableCheckCount >= 10) || pageDataReadyRef.current) {
        // 10 * 100ms = 1 second stable
        imagesLoadedRef.current = true;
        pageDataReadyRef.current = false; // Reset for next page
        pageLoading.start([]);
        return;
      }

      // If timeout reached, show content anyway
      if (elapsed > MAX_WAIT_TIME) {
        imagesLoadedRef.current = true;
        pageDataReadyRef.current = false; // Reset for next page
        pageLoading.start([]);
        return;
      }

      // Keep checking
      rafId = requestAnimationFrame(() => {
        timeoutId = setTimeout(checkAllImagesLoaded, 100);
      });
    };

    // Start the image check loop
    timeoutId = setTimeout(checkAllImagesLoaded, 300);

    return () => {
      clearTimeout(timeoutId);
      cancelAnimationFrame(rafId);
    };
  }, [location.pathname]);

  return (
    <>
      <AnimatedPageLoader 
        isLoading={pageLoading.isLoading && !["/auth", "/admin", "/content"].includes(location.pathname)}
        isContentReady={!pageLoading.isLoading}
      >
        <ScrollToTop />
        <ScrollToAnchor />
        <div className="flex flex-col min-h-screen bg-surface-50">
          <Header />

          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute requiredRole={["CONTENT_MANAGER", "ADMIN"]}>
                    <AdminPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/content"
                element={
                  <ProtectedRoute requiredRole={["CONTENT_MANAGER", "ADMIN"]}>
                    <ContentManagementPage />
                  </ProtectedRoute>
                }
              />
              <Route path="/apartments" element={<ApartmentsPage />} />
              <Route path="/kvartiri-v-tomske" element={<ApartmentsPage />} />
              <Route path="/kupit-odnokomnatnuyu-kvartiru-v-tomske" element={<ApartmentsPage />} />
              <Route path="/dvukhkomnatnie-kvartiri-v-tomske" element={<ApartmentsPage />} />
              <Route path="/trekhkomnatnie-kvartiri-v-tomske" element={<ApartmentsPage />} />
              <Route path="/zhiliye-kompleksi" element={<ApartmentComplexesPage />} />
              <Route path="/complexes" element={<ApartmentComplexesPage />} />
              <Route path="/layouts" element={<LayoutsPage />} />
              <Route path="/layout/:layoutId" element={<LayoutPage />} />
              <Route path="/complex/:homeId" element={<ComplexPage />} />
              <Route path="/apartment/:apartmentId" element={<ApartmentPage />} />
              <Route path="/politika-konfidencialnosti" element={<PrivacyPage />} />
              <Route path="/usloviya-ispolzovaniya" element={<TermsOfServicePage />} />
              <Route path="/o-kompanii" element={<AboutUsPage />} />
              <Route path="/zhk-nizhniy-51" element={<ComplexPage />} />
              <Route path="/:slug" element={<SlugPage />} />
              
              <Route path="/not/found" element={<NotFoundPage />}/>
              <Route path="*" element={<NotFoundPage />}/>
            </Routes>
          </main>

          {/* Footer inside flex container to stick to bottom */}
          <Footer />
        </div>
      </AnimatedPageLoader>
      
      <RouterListener />
    </>
  );
};

function App() {
  return (
    <BrowserRouter>
      <InnerApp />
    </BrowserRouter>
  );
}

export default App;
