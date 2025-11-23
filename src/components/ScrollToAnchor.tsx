import {useEffect, useRef} from 'react';
import {useLocation} from 'react-router-dom';

const ScrollToAnchor = () => {
  const location = useLocation();
  const lastPathnameRef = useRef<string>("");

  // URLs that are variations of the same page (apartment listings)
  const apartmentListUrls = [
    "/apartments",
    "/kvartiri-v-tomske",
    "/kupit-odnokomnatnuyu-kvartiru-v-tomske",
    "/dvukhkomnatnie-kvartiri-v-tomske",
    "/trekhkomnatnie-kvartiri-v-tomske"
  ];

  useEffect(() => {
    // Reset scroll to top on page change (but not for hash navigation or apartment list switches)
    if (!location.hash) {
      const isPrevApartmentList = apartmentListUrls.includes(lastPathnameRef.current);
      const isCurrentApartmentList = apartmentListUrls.includes(location.pathname);
      
      if (!(isPrevApartmentList && isCurrentApartmentList)) {
        window.scrollTo({ top: 0, behavior: 'auto' });
      }
    }
    lastPathnameRef.current = location.pathname;
  }, [location.pathname]);

  useEffect(() => {
    // Handle hash-based anchor navigation
    if (location.hash) {
      setTimeout(() => {
        const element = document.getElementById(location.hash.slice(1));
        if (element) {
          const headerOffset = 100;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }, 100);
    }
  }, [location.hash]);

  return null;
};

export default ScrollToAnchor;