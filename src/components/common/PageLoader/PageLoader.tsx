import styles from "./PageLoader.module.css";
import { useEffect, useState } from "react";

interface PageLoaderProps {
  isLoading: boolean;
  onExitComplete?: () => void;
}

const PageLoader = ({ isLoading, onExitComplete }: PageLoaderProps) => {
  const [isExiting, setIsExiting] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  useEffect(() => {
    if (!isLoading && !isExiting) {
      setIsExiting(true);
    }
  }, [isLoading, isExiting]);

  useEffect(() => {
    if (isExiting) {
      const timer = setTimeout(() => {
        onExitComplete?.();
      }, 1000);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [isExiting, onExitComplete]);

  return (
    <div className={`${styles.container} ${isExiting ? styles.exiting : ''}`}>
      <img 
        src="/images/Cover.png" 
        alt="Cover" 
        className={`${styles.coverImage} ${isImageLoaded ? styles.loaded : ''} ${isExiting ? styles.exiting : ''}`}
        onLoad={() => setIsImageLoaded(true)}
      />
    </div>
  );
};

export default PageLoader;