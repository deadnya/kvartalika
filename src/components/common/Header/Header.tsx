import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import styles from "./Header.module.css";
import Button from "../Button";
import FindApartmentModal from "../FindApartmentModal/FindApartmentModal";

import MenuIcon from "../../../assets/icons/menu.svg?react"
import CloseIcon from "../../../assets/icons/close.svg?react"
import LogoIcon from "../../../assets/icons/logo.svg?react"

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
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
            <LogoIcon />
            <span className={styles.logoText}>Кварталика</span>
          </Link>

          <nav className={styles.nav}>
            <Link 
              to="/" 
              className={`${styles.navLink} ${isActiveLink("/") ? styles.navLinkActive : ""}`}
            >Главная</Link>

            <Link 
              to="/zhiliye-kompleksi" 
              className={`${styles.navLink} ${isActiveLink("/zhiliye-kompleksi") ? styles.navLinkActive : ""}`}
            >Жилые комплексы</Link>

            <Link 
              to="/kvartiri-v-tomske" 
              className={`${styles.navLink} ${isActiveLink("/kvartiri-v-tomske") ? styles.navLinkActive : ""}`}
            >Квартиры</Link>

            <Link 
              to="/o-kompanii" 
              className={`${styles.navLink} ${isActiveLink("/o-kompanii") ? styles.navLinkActive : ""}`}
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
            {isMobileMenuOpen ? (
              <CloseIcon />
            ) : (
              <MenuIcon />
            )}
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
                to="/zhiliye-kompleksi"
                className={`${styles.mobileNavLink} ${isActiveLink("/zhiliye-kompleksi") ? styles.mobileNavLinkActive : ""}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Жилые комплексы
              </Link>
              <Link
                to="/kvartiri-v-tomske"
                className={`${styles.mobileNavLink} ${isActiveLink("/kvartiri-v-tomske") ? styles.mobileNavLinkActive : ""}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Квартиры
              </Link>
              <Link 
                to="/o-kompanii" 
                className={`${styles.mobileNavLink} ${isActiveLink("/o-kompanii") ? styles.mobileNavLinkActive : ""}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                О нас
              </Link>
            </nav>

            <div className={styles.mobileCta}>
                <Button
                  className={styles.button}
                  onClick={() => {
                    handleModalOpen();
                    setIsMobileMenuOpen(false);
                  }}
                >
                  Найти квартиру
                </Button>
              </div>
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