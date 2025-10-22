import { useState } from "react";
import { useAuthStore } from "../../../store/auth.store";
import HomePageEditor from "../HomePageEditor/HomePageEditor";
import AboutUsPageEditor from "../AboutUsPageEditor/AboutUsPageEditor";
import FooterEditor from "../FooterEditor/FooterEditor";
import styles from "./AdminOverlay.module.css";

const AdminOverlay = () => {
  const { role, isAuthenticated } = useAuthStore();
  const [isHomePageModalOpen, setIsHomePageModalOpen] = useState(false);
  const [isAboutUsModalOpen, setIsAboutUsModalOpen] = useState(false);
  const [isFooterModalOpen, setIsFooterModalOpen] = useState(false);

  if (!isAuthenticated || !role || role === "CLIENT") {
    return null;
  }

  return (
    <>
      <div className={styles.adminOverlay}>
        <div className={styles.adminPanel}>
          <span className={styles.adminLabel}>Admin Panel</span>
          <div className={styles.buttonGroup}>
            <button
              onClick={() => setIsHomePageModalOpen(true)}
              className={styles.adminButton}
              title="Edit home page content"
            >
              Edit Home Page
            </button>
            <button
              onClick={() => setIsAboutUsModalOpen(true)}
              className={styles.adminButton}
              title="Edit about us page content"
            >
              Edit About Us
            </button>
            <button
              onClick={() => setIsFooterModalOpen(true)}
              className={styles.adminButton}
              title="Edit footer content"
            >
              Edit Footer
            </button>
          </div>
        </div>
      </div>

      {isHomePageModalOpen && (
        <HomePageEditor onClose={() => setIsHomePageModalOpen(false)} />
      )}

      {isAboutUsModalOpen && (
        <AboutUsPageEditor onClose={() => setIsAboutUsModalOpen(false)} />
      )}

      {isFooterModalOpen && (
        <FooterEditor onClose={() => setIsFooterModalOpen(false)} />
      )}
    </>
  );
};

export default AdminOverlay;
