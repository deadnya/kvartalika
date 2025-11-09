import {useEffect} from 'react';
import {useLocation} from 'react-router-dom';

const ScrollToAnchor = () => {
  const location = useLocation();

  useEffect(() => {
    // Reset scroll to top on page change (but not for hash navigation)
    if (!location.hash) {
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
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