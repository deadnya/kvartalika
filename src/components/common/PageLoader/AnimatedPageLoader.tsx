import { useState, useEffect } from "react";
import PageLoader from "./PageLoader.tsx";

interface AnimatedPageLoaderProps {
  isLoading: boolean;
  children: React.ReactNode;
}

const AnimatedPageLoader = ({ isLoading, children }: AnimatedPageLoaderProps) => {
  const [showLoader, setShowLoader] = useState(true); // Always start with loader
  const [showContent, setShowContent] = useState(false); // Never show content initially

  useEffect(() => {
    if (isLoading && !showLoader) {
      setShowLoader(true);
      setShowContent(false);
    } else if (!isLoading) {
      if (showLoader) {
        // Show content immediately when loading finishes
        setShowContent(true);
      } else {
        // If loader isn't showing and we're not loading, show content immediately
        setShowContent(true);
      }
    }
  }, [isLoading, showLoader]);

  const handleExitComplete = () => {
    setShowLoader(false);
  };

  return (
    <>
      {showContent && children}
      {showLoader && (
        <PageLoader 
          isLoading={isLoading} 
          onExitComplete={handleExitComplete}
        />
      )}
    </>
  );
};

export default AnimatedPageLoader;