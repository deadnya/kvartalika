import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { extractApartmentIdFromUrl } from '../../utils/urlHelpers';

export const ApartmentByIdRedirect = () => {
  const { apartmentId } = useParams<{ apartmentId: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    if (apartmentId) {
      navigate(`/apartment/${apartmentId}`, { replace: true });
    }
  }, [apartmentId, navigate]);

  return null;
};

export const ApartmentSlugHandler = () => {
  const { apartmentSlug } = useParams<{ apartmentSlug: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    if (apartmentSlug) {
      const id = extractApartmentIdFromUrl(apartmentSlug);
      
      if (id) {
        navigate(`/apartment/${id}`, { replace: true });
      }
    }
  }, [apartmentSlug, navigate]);

  return null;
};
