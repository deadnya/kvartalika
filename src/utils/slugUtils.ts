export function generateSlug(text: string): string {
  if (!text) return '';
  
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function extractIdFromSlug(slug: string): number | null {
  const match = slug.match(/-(\d+)$/);
  return match ? parseInt(match[1], 10) : null;
}

export function parseApartmentSlug(slug: string): { rooms?: number; area?: number; id?: number } {
  const roomMatch = slug.match(/^(\d+)-komnatnaya/);
  const areaMatch = slug.match(/(\d+)m2/);
  const id = extractIdFromSlug(slug);
  
  return {
    rooms: roomMatch ? parseInt(roomMatch[1], 10) : undefined,
    area: areaMatch ? parseInt(areaMatch[1], 10) : undefined,
    id: id ?? undefined,
  };
}

export function buildApartmentSlug(apartment: { numberOfRooms: number; area?: number; id: number }): string {
  const roomsText = getRoomText(apartment.numberOfRooms);
  const area = apartment.area ? `-${apartment.area}m2` : '';
  const id = `-${apartment.id}`;
  return `${roomsText}-kvartira${area}${id}`;
}

export function buildComplexSlug(complex: { name: string; id: number }): string {
  const slugName = generateSlug(complex.name);
  return `zhk-${slugName}-${complex.id}`;
}

function getRoomText(rooms: number): string {
  switch (rooms) {
    case 1:
      return '1-komnatnaya';
    case 2:
      return '2-komnatnie';
    case 3:
      return '3-komnatnie';
    default:
      return `${rooms}-komnatnie`;
  }
}
