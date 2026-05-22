/**
 * Affiliate link utilities.
 * Set env vars to enable affiliate tracking:
 *   BOOKING_AFFILIATE_ID  — from partners.booking.com
 *   SKYSCANNER_PARTNER_ID — from partners.skyscanner.net
 *
 * Links work WITHOUT affiliate IDs — just no commission tracking.
 * Add your IDs to .env.local when ready.
 */

const BOOKING_AID = process.env.NEXT_PUBLIC_BOOKING_AFFILIATE_ID ?? '';

export function hotelUrl(cityName: string): string {
  const params = new URLSearchParams({ ss: cityName, lang: 'en-us' });
  if (BOOKING_AID) params.set('aid', BOOKING_AID);
  return `https://www.booking.com/searchresults.html?${params}`;
}

export function flightUrl(cityName: string): string {
  // Skyscanner "flights to city" — works without partner ID
  const slug = cityName
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .trim()
    .replace(/\s+/g, '-');
  const base = 'https://www.skyscanner.net/transport/flights-to';
  const pid = process.env.NEXT_PUBLIC_SKYSCANNER_PARTNER_ID;
  return pid
    ? `${base}/${slug}/?associateid=${pid}`
    : `${base}/${slug}/`;
}

export function hotelNeighbourhoodUrl(cityName: string, neighbourhood: string): string {
  const params = new URLSearchParams({
    ss: `${neighbourhood}, ${cityName}`,
    lang: 'en-us',
  });
  if (BOOKING_AID) params.set('aid', BOOKING_AID);
  return `https://www.booking.com/searchresults.html?${params}`;
}
