import { buildApartmentSlug, buildComplexSlug, extractIdFromSlug } from './slugUtils';

export function getApartmentUrl(apartment: { numberOfRooms: number; area?: number; id: number; slug?: string | null }): string {
  if (apartment.slug) {
    return `/${apartment.slug}`;
  }
  return `/${buildApartmentSlug(apartment)}`;
}

export function getComplexUrl(complex: { name: string; id: number; slug?: string | null }): string {
  if (complex.slug) {
    return `/${complex.slug}`;
  }
  return `/${buildComplexSlug(complex)}`;
}

export function getApartmentsUrl(rooms?: number): string {
  switch (rooms) {
    case 1:
      return '/kupit-odnokomnatnuyu-kvartiru-v-tomske';
    case 2:
      return '/dvukhkomnatnie-kvartiri-v-tomske';
    case 3:
      return '/trekhkomnatnie-kvartiri-v-tomske';
    default:
      return '/kvartiri-v-tomske';
  }
}

export function extractApartmentIdFromUrl(urlSlug: string): number | null {
  return extractIdFromSlug(urlSlug);
}

export function extractComplexIdFromUrl(urlSlug: string): number | null {
  const match = urlSlug.match(/-(\d+)$/);
  return match ? parseInt(match[1], 10) : null;
}
