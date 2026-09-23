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
// selected_currency + lang=en-gb: the site's audience is overwhelmingly
// Indian (per GSC/GA4), and the default en-us/no-currency params showed USD
// prices to everyone — a real friction point found in a 2026-09 link audit.

export function hotelUrl(cityName: string, checkIn?: string, checkOut?: string): string {
  const params = new URLSearchParams({ ss: cityName, lang: 'en-gb', selected_currency: 'INR' });
  if (BOOKING_AID) params.set('aid', BOOKING_AID);
  if (checkIn)  params.set('checkin',  checkIn);
  if (checkOut) params.set('checkout', checkOut);
  return `https://www.booking.com/searchresults.html?${params}`;
}

export function hotelNeighbourhoodUrl(cityName: string, neighbourhood: string): string {
  const params = new URLSearchParams({ ss: `${neighbourhood}, ${cityName}`, lang: 'en-gb', selected_currency: 'INR' });
  if (BOOKING_AID) params.set('aid', BOOKING_AID);
  return `https://www.booking.com/searchresults.html?${params}`;
}

// ── Skyscanner ────────────────────────────────────────────────────────────────
// .co.in (not the UK .net site) for an India-first audience. Several
// destinations we cover have no airport of their own — routing those through
// Skyscanner's "flights-to/<slug>" pattern returns an empty or wrong page
// (found in a 2026-09 link audit: flights-to/mathura-vrindavan,
// flights-to/thekkady, flights-to/ajmer all 404 or mismatch). Route those to
// the nearest airport with real commercial service instead.
const NEAREST_AIRPORT: Record<string, string> = {
  mathura: 'agra', vrindavan: 'agra', 'mathura-vrindavan': 'agra',
  thekkady: 'kochi', ajmer: 'jaipur', pushkar: 'jaipur',
  bir: 'dharamshala', 'bir-billing': 'dharamshala',
  'tirthan-valley': 'chandigarh', kasol: 'chandigarh', manali: 'chandigarh',
  mussoorie: 'dehradun', rishikesh: 'dehradun', haridwar: 'dehradun',
  nainital: 'delhi', munnar: 'kochi', kasauli: 'chandigarh', shimla: 'chandigarh',
  hampi: 'hubli', gokarna: 'goa', darjeeling: 'bagdogra', gangtok: 'bagdogra',
  kedarnath: 'dehradun', badrinath: 'dehradun', 'dzukou-valley': 'dimapur', kohima: 'dimapur',
};

export function flightUrl(cityName: string, citySlug?: string): string {
  const mapped = citySlug ? NEAREST_AIRPORT[citySlug] : undefined;
  const targetName = mapped ? mapped.replace(/-/g, ' ') : cityName;
  const slug = targetName.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim().replace(/\s+/g, '-');
  const base = 'https://www.skyscanner.co.in/transport/flights-to';
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
