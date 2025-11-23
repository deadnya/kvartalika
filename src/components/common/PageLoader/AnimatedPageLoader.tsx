import { useState, useEffect } from "react";
import PageLoader from "./PageLoader.tsx";

interface AnimatedPageLoaderProps {
  isLoading: boolean;
  children: React.ReactNode;
  isContentReady?: boolean;
}

const AnimatedPageLoader = ({ isLoading, children, isContentReady = true }: AnimatedPageLoaderProps) => {
  const [showLoader, setShowLoader] = useState(true);
  const [removeLoader, setRemoveLoader] = useState(false);

  useEffect(() => {
    if (!isLoading && isContentReady) {
      setShowLoader(false);
    }
  }, [isLoading, isContentReady]);

  const handleExitComplete = () => {
    setRemoveLoader(true);
  };

  return (
    <>
      {children}
      {!removeLoader && (
        <PageLoader 
          isLoading={showLoader} 
          onExitComplete={handleExitComplete}
        />
      )}
    </>
  );
};

export default AnimatedPageLoader;