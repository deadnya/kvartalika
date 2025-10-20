import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { useEffect, lazy, Suspense } from "react";

import Header from "./components/common/Header";
import Footer from "./components/common/Footer";
import AnimatedPageLoader from "./components/common/PageLoader/AnimatedPageLoader.tsx";
import ScrollToAnchor from "./components/ScrollToAnchor.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";

const HomePage = lazy(() => import("./pages/homePage/HomePage.tsx"));
const ApartmentsPage = lazy(() => import("./pages/apartmentsPage/ApartmentsPage.tsx"));
const LayoutsPage = lazy(() => import("./pages/LayoutsPage.tsx"));
const LayoutPage = lazy(() => import("./pages/LayoutPage.tsx"));
const ApartmentComplexesPage = lazy(() => import("./pages/apartmentComplexesPage/ApartmentComplexesPage.tsx"));
const ComplexPage = lazy(() => import("./pages/apartmentComplexPage/ApartmentComplexPage.tsx"));
const ApartmentPage = lazy(() => import("./pages/apartmentPage/ApartmentPage.tsx"));
const AuthPage = lazy(() => import("./pages/AuthPage.tsx"));
const AdminPage = lazy(() => import("./components/admin/AdminPage.tsx"));
const ContentManagementPage = lazy(
  () => import("./components/content/ContentManagementPage.tsx"),
);
const PrivacyPage = lazy(() => import("./pages/privacyPage/PrivacyPage.tsx"));

import { useAuthStore } from "./store/auth.store.ts";
import RouterListener from "./components/RouterListener.tsx";
import { useUIStore } from "./store/ui.store.ts";
import { useFlatsStore } from "./store/flats.store.ts";
import AboutUsPage from "./pages/aboutUsPage/AboutUsPage.tsx";
import TermsOfServicePage from "./pages/termsOfServicePage/TermsOfServicePage.tsx";
import NotFoundPage from "./pages/notFoundPage/NotFoundPage.tsx";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

const InnerApp = () => {
  const globalLoading = useUIStore((state) => state.loading.global);
  const setLoading = useUIStore((state) => state.setLoading);

  const loadPageInfo = useUIStore((state) => state.loadPageInfo);
  const loadSocialMediaList = useUIStore((state) => state.loadSocialMediaList);
  const pageInfo = useUIStore((state) => state.pageInfo);

  const loadAboutUsInfo = useUIStore((state) => state.loadAboutUsInfo);

  const loadAllData = useFlatsStore((state) => state.loadAllData);

  const { role, isAuthenticated } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    const loadData = async () => {
      setLoading("global", true);
      try {
        await Promise.all([
          loadPageInfo(),
          loadSocialMediaList(),
          loadAboutUsInfo(),
        ]);
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };

    loadData().then(async () => {
      await loadAllData(true);
      
      // Add a delay to let images actually load and render
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setLoading("global", false);
    });
  }, [
    loadAllData,
    loadPageInfo,
    loadSocialMediaList,
    loadAboutUsInfo,
    setLoading,
  ]);

  const shouldShowLoader =
    !["/auth", "/admin", "/content"].includes(location.pathname) &&
    (globalLoading ||
      (pageInfo?.published &&
        (!isAuthenticated ||
          (role !== "ADMIN" && role !== "CONTENT_MANAGER"))));

  return (
    <>
      <AnimatedPageLoader isLoading={shouldShowLoader ?? false}>
        <ScrollToTop />
        <ScrollToAnchor />
        <div className="min-h-screen flex flex-col bg-surface-50">
          <Header />

          <main className="flex-grow">
            <Suspense fallback={<div />}>
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
                <Route path="/complexes" element={<ApartmentComplexesPage />} />
                <Route path="/layouts" element={<LayoutsPage />} />
                <Route path="/complex/:homeId" element={<ComplexPage />} />
                <Route
                  path="/apartment/:apartmentId"
                  element={<ApartmentPage />}
                />
                <Route path="/layout/:layoutId" element={<LayoutPage />} />
                <Route path="/privacy" element={<PrivacyPage />} />
                <Route path="/termsofservice" element={<TermsOfServicePage />} />
                <Route path="/about" element={<AboutUsPage />} />
                
                <Route path="*" element={<NotFoundPage />}/>
              </Routes>
            </Suspense>
          </main>
        </div>
      </AnimatedPageLoader>
      
      {/* Footer outside of loader to prevent flickering */}
      {!shouldShowLoader && <Footer />}
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
