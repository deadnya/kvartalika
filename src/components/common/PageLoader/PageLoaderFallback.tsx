import { KvartalikaLogo } from "../../icons/Logo.tsx";
import styles from "./PageLoader.module.css";

const PageLoaderFallback = () => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
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

export default PageLoaderFallback;