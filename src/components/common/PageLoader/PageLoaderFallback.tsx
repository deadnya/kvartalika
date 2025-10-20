import styles from "./PageLoader.module.css";

const PageLoaderFallback = () => {
  return (
    <div className={styles.container}>
      <img 
        src="/images/Cover.png" 
        alt="Cover" 
        className={styles.coverImage}
      />
    </div>
  );
};

export default PageLoaderFallback;