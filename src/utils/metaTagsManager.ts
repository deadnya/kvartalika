/**
 * Sanitizes a string by removing potentially harmful HTML and script content
 */
export const sanitizeString = (str: string | null | undefined): string => {
  if (!str) return "";
  
  // Remove any HTML tags and script content
  let sanitized = String(str)
    .replace(/<[^>]*>/g, "") // Remove HTML tags
    .replace(/[<>]/g, "") // Remove remaining angle brackets
    .trim();
  
  // Limit to reasonable length for meta tags
  return sanitized;
};

export interface SEOMetaTags {
  metaTitle?: string | null;
  metaDescription?: string | null;
  metaKeywords?: string | null;
  metaImage?: string | null;
}

/**
 * Updates the page's meta tags for SEO
 */
export const setMetaTags = (seoData: SEOMetaTags) => {
  const {
    metaTitle,
    metaDescription,
    metaKeywords,
    metaImage,
  } = seoData;

  // Set document title
  if (metaTitle) {
    document.title = sanitizeString(metaTitle);
  }

  // Helper function to update or create meta tag
  const updateMetaTag = (name: string, content: string | null | undefined, isProperty: boolean = false) => {
    if (!content) return;

    const sanitizedContent = sanitizeString(content);
    const attribute = isProperty ? "property" : "name";
    let tag = document.querySelector(`meta[${attribute}="${name}"]`) as HTMLMetaElement;

    if (!tag) {
      tag = document.createElement("meta");
      tag.setAttribute(attribute, name);
      document.head.appendChild(tag);
    }

    tag.content = sanitizedContent;
  };

  // Update standard meta tags
  updateMetaTag("description", metaDescription);
  updateMetaTag("keywords", metaKeywords);

  // Update Open Graph meta tags
  updateMetaTag("og:title", metaTitle, true);
  updateMetaTag("og:description", metaDescription, true);
  
  if (metaImage) {
    const sanitizedImage = sanitizeString(metaImage);
    updateMetaTag("og:image", sanitizedImage, true);
  }
};

/**
 * Resets meta tags to default values
 */
export const resetMetaTags = () => {
  document.title = "Кварталика";
  
  const updateMetaTag = (name: string, content: string, isProperty: boolean = false) => {
    const attribute = isProperty ? "property" : "name";
    let tag = document.querySelector(`meta[${attribute}="${name}"]`) as HTMLMetaElement;

    if (!tag) {
      tag = document.createElement("meta");
      tag.setAttribute(attribute, name);
      document.head.appendChild(tag);
    }

    tag.content = content;
  };

  updateMetaTag("description", "Кварталика - квартиры в Томске по выгодным ценам");
  updateMetaTag("keywords", "кварталика, купить квартиру в томске, жк нижний томск");
  updateMetaTag("og:title", "Кварталика", true);
  updateMetaTag("og:description", "Кварталика - квартиры в Томске по выгодным ценам", true);
};
