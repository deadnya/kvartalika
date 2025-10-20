import { KvartalikaLogo } from "../../icons/Logo.tsx";
import styles from "./PageLoader.module.css";
import { useEffect, useState } from "react";

interface PageLoaderProps {
  isLoading: boolean;
  onExitComplete?: () => void;
}

const PageLoader = ({ isLoading, onExitComplete }: PageLoaderProps) => {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (!isLoading && !isExiting) {
      setIsExiting(true);
    }
  }, [isLoading, isExiting]);

  useEffect(() => {
    if (isExiting) {
      const timer = setTimeout(() => {
        onExitComplete?.();
      }, 2000);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [isExiting, onExitComplete]);

  return (
    <div className={`${styles.container} ${isExiting ? styles.exiting : ''}`}>
      <div className={`${styles.content} ${isExiting ? styles.exiting : ''}`}>
        <div className={styles.logoSection}>
          <div className={styles.logoContainer}>
            <KvartalikaLogo width="64" height="64" />
          </div>
          <h2 className={styles.title}>Кварталика</h2>
          <p className={styles.subtitle}>Загружаем для вас лучшие предложения</p>
        </div>

        <div className={styles.loadingDots}>
          <div className={styles.dot}></div>
          <div className={styles.dot}></div>
          <div className={styles.dot}></div>
        </div>
      </div>
    </div>
  );
};

export default PageLoader;