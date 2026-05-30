/**
 * Affiliate link utilities.
 * All links work immediately — add IDs to earn commission tracking.
 *
 * To add affiliate IDs, set in VM .env.local:
 *   NEXT_PUBLIC_BOOKING_AID       — partners.booking.com (free to join, instant approval)
 *   NEXT_PUBLIC_GYG_PARTNER_ID    — partner.getyourguide.com (8% commission on tours)
 *   NEXT_PUBLIC_KLOOK_AID         — affiliate.klook.com (5%, great for Asia)
 *   NEXT_PUBLIC_SKYSCANNER_PID    — partners.skyscanner.net (CPC model)
 */

const BOOKING_AID    = process.env.NEXT_PUBLIC_BOOKING_AID ?? '';
const GYG_PID        = process.env.NEXT_PUBLIC_GYG_PARTNER_ID ?? '';
const KLOOK_AID      = process.env.NEXT_PUBLIC_KLOOK_AID ?? '';
const SKYSCANNER_PID = process.env.NEXT_PUBLIC_SKYSCANNER_PID ?? '';

// ── Booking.com ──────────────────────────────────────────────────────────────

export function hotelUrl(cityName: string, checkIn?: string, checkOut?: string): string {
  const params = new URLSearchParams({ ss: cityName, lang: 'en-us' });
  if (BOOKING_AID) params.set('aid', BOOKING_AID);
  if (checkIn)  params.set('checkin',  checkIn);
  if (checkOut) params.set('checkout', checkOut);
  return `https://www.booking.com/searchresults.html?${params}`;
}

export function hotelNeighbourhoodUrl(cityName: string, neighbourhood: string): string {
  const params = new URLSearchParams({ ss: `${neighbourhood}, ${cityName}`, lang: 'en-us' });
  if (BOOKING_AID) params.set('aid', BOOKING_AID);
  return `https://www.booking.com/searchresults.html?${params}`;
}

// ── Skyscanner ────────────────────────────────────────────────────────────────

export function flightUrl(cityName: string): string {
  const slug = cityName.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim().replace(/\s+/g, '-');
  const base = 'https://www.skyscanner.net/transport/flights-to';
  return SKYSCANNER_PID
    ? `${base}/${slug}/?associateid=${SKYSCANNER_PID}`
    : `${base}/${slug}/`;
}

// ── GetYourGuide ──────────────────────────────────────────────────────────────
// Earn 8% commission on tours & activities. Join: partner.getyourguide.com

export function toursUrl(cityName: string, activityHint?: string): string {
  const query = activityHint ? `${activityHint} ${cityName}` : cityName;
  const params = new URLSearchParams({ q: query });
  if (GYG_PID) params.set('partner_id', GYG_PID);
  return `https://www.getyourguide.com/s/?${params}`;
}

export function gygActivityUrl(activity: string, cityName: string): string {
  const params = new URLSearchParams({ q: `${activity} ${cityName}` });
  if (GYG_PID) params.set('partner_id', GYG_PID);
  return `https://www.getyourguide.com/s/?${params}`;
}

// ── Klook ─────────────────────────────────────────────────────────────────────
// Best for Asia. Earn 5% commission. Join: affiliate.klook.com

export function klookUrl(cityName: string): string {
  const params = new URLSearchParams({ query: cityName });
  if (KLOOK_AID) params.set('aid', KLOOK_AID);
  return `https://www.klook.com/search/?${params}`;
}

// ── Hostelworld ───────────────────────────────────────────────────────────────
// Budget accommodation. Earn commissions on hostel bookings.

export function hostelUrl(cityName: string): string {
  const slug = cityName.toLowerCase().replace(/\s+/g, '-');
  return `https://www.hostelworld.com/findabed.php/ChosenCity.${slug}`;
}

// Asia cities that work better with Klook than GetYourGuide
const KLOOK_CITIES = new Set(['bali', 'bangkok', 'tokyo', 'singapore', 'hong-kong', 'seoul', 'kyoto', 'phuket', 'dubai']);

export function activitiesUrl(citySlug: string, cityName: string): string {
  return KLOOK_CITIES.has(citySlug) ? klookUrl(cityName) : toursUrl(cityName);
}

export function activitiesLabel(citySlug: string): string {
  return KLOOK_CITIES.has(citySlug) ? 'Klook' : 'GetYourGuide';
}
