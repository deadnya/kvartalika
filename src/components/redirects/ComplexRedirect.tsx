import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { extractComplexIdFromUrl } from '../../utils/urlHelpers';

export const ComplexByIdRedirect = () => {
  const { homeId } = useParams<{ homeId: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    if (homeId) {
      navigate(`/complex/${homeId}`, { replace: true });
    }
  }, [homeId, navigate]);

  return null;
};

export const ComplexSlugHandler = () => {
  const { complexSlug } = useParams<{ complexSlug: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    if (complexSlug) {
      const id = extractComplexIdFromUrl(complexSlug);
      
      if (id) {
        navigate(`/complex/${id}`, { replace: true });
      }
    }
  }, [complexSlug, navigate]);

  return null;
};
