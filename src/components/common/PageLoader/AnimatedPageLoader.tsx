import { useState, useEffect } from "react";
import PageLoader from "./PageLoader.tsx";

interface AnimatedPageLoaderProps {
  isLoading: boolean;
  children: React.ReactNode;
  isContentReady?: boolean;
}

const AnimatedPageLoader = ({ isLoading, children, isContentReady = true }: AnimatedPageLoaderProps) => {
  const [showLoader, setShowLoader] = useState(true);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Only show content when loading is done AND content is actually ready
    if (!isLoading && isContentReady) {
      setShowContent(true);
    } else {
      setShowContent(false);
    }
  }, [isLoading, isContentReady]);

  const handleExitComplete = () => {
    setShowLoader(false);
  };

  return (
    <>
      {showContent && children}
      {showLoader && (
        <PageLoader 
          isLoading={isLoading || !isContentReady} 
          onExitComplete={handleExitComplete}
        />
      )}
    </>
  );
};

export default AnimatedPageLoader;