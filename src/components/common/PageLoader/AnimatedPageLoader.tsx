import { useState, useEffect } from "react";
import PageLoader from "./PageLoader.tsx";

interface AnimatedPageLoaderProps {
  isLoading: boolean;
  children: React.ReactNode;
}

const AnimatedPageLoader = ({ isLoading, children }: AnimatedPageLoaderProps) => {
  const [showLoader, setShowLoader] = useState(true);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      setShowContent(true);
    } else {
      setShowContent(false);
    }
  }, [isLoading]);

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