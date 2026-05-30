const PLACE_IMAGES: Record<string, string> = {
  'bali:tegallalang rice terraces':
    'https://images.unsplash.com/photo-1557093793-d149a38a1be8?auto=format&fit=crop&w=900&q=80',
  'paris:eiffel tower':
    'https://images.unsplash.com/photo-1566902145833-0475c9f1a1bf?auto=format&fit=crop&w=900&q=80',
  'paris:louvre museum':
    'https://images.unsplash.com/photo-1500039436846-25ae2f11882e?auto=format&fit=crop&w=900&q=80',
  'dubai:burj khalifa':
    'https://images.unsplash.com/photo-1459788025731-a85eb8dd27cc?auto=format&fit=crop&w=900&q=80',
};

function keyFor(citySlug: string, placeName: string) {
  return `${citySlug}:${placeName.toLowerCase()}`;
}

export function getPlaceImageUrl(citySlug: string, placeName: string, fallback?: string) {
  return PLACE_IMAGES[keyFor(citySlug, placeName)] ?? fallback;
}
