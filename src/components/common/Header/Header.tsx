import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Logo from "../../Logo";
import { useAuthStore } from "../../../store/auth.store";
import styles from "./Header.module.css";
import Button from "../Button";
import FindApartmentModal from "../FindApartmentModal/FindApartmentModal";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const location = useLocation();

  const { isAuthenticated, logout } = useAuthStore();

  const handleModalOpen = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const isActiveLink = (path: string) => {
    if (path === "/" && location.pathname === "/") {
      return true;
    }
    if (path !== "/" && location.pathname.startsWith(path)) {
      return true;
    }
    return false;
  };

  return (
    <>
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.content}>
          <Link to="/" className={styles.logoLink}>
            <Logo className={styles.logo} />
          </Link>

          <nav className={styles.nav}>
            <Link 
              to="/" 
              className={`${styles.navLink} ${isActiveLink("/") ? styles.navLinkActive : ""}`}
            >Главная</Link>

            <Link 
              to="/complexes" 
              className={`${styles.navLink} ${isActiveLink("/complexes") ? styles.navLinkActive : ""}`}
            >Жилые комплексы</Link>

            <Link 
              to="/apartments" 
              className={`${styles.navLink} ${isActiveLink("/apartments") ? styles.navLinkActive : ""}`}
            >Квартиры</Link>

            <Link 
              to="/about" 
              className={`${styles.navLink} ${isActiveLink("/about") ? styles.navLinkActive : ""}`}
            >О нас</Link>
          </nav>

          <div className={styles.ctaContainer}>
            <Button
              onClick={handleModalOpen}
            >
              Найти квартиру
            </Button>
          </div>

          <button
            className={styles.mobileMenuButton}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <div className={styles.hamburgerIcon}>
              <span
                className={`${styles.hamburgerLine} ${
                  isMobileMenuOpen ? styles.hamburgerLineOpen : ""
                }`}
              />
              <span
                className={`${styles.hamburgerLine} ${
                  isMobileMenuOpen ? styles.hamburgerLineOpen : ""
                }`}
              />
              <span
                className={`${styles.hamburgerLine} ${
                  isMobileMenuOpen ? styles.hamburgerLineOpen : ""
                }`}
              />
            </div>
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className={styles.mobileMenu}>
            <nav className={styles.mobileNav}>
              <Link
                to="/"
                className={`${styles.mobileNavLink} ${isActiveLink("/") ? styles.mobileNavLinkActive : ""}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Главная
              </Link>
              <Link
                to="/complexes"
                className={`${styles.mobileNavLink} ${isActiveLink("/complexes") ? styles.mobileNavLinkActive : ""}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Жилые комплексы
              </Link>
              <Link
                to="/apartments"
                className={`${styles.mobileNavLink} ${isActiveLink("/apartments") ? styles.mobileNavLinkActive : ""}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Квартиры
              </Link>
              {!isAuthenticated ? (
                <Link 
                  to="/about" 
                  className={`${styles.mobileNavButton} ${isActiveLink("/about") ? styles.mobileNavButtonActive : ""}`}
                >
                  О нас
                </Link>
              ) : (
                <div className={styles.logoutButton} onClick={() => logout()}>
                  <p className={styles.logoutText}>Выйти</p>
                </div>
              )}
              <div className={styles.mobileCta}>
                <button
                  className={styles.mobileCtaButton}
                  onClick={() => {
                    handleModalOpen();
                    setIsMobileMenuOpen(false);
                  }}
                >
                  Найти квартиру
                </button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
    
    {isModalOpen && (
      <FindApartmentModal onClose={handleModalClose} />
    )}
    </>
  );
};

export default Header;