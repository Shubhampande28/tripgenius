import { hotelUrl, hotelNeighbourhoodUrl, flightUrl } from '../affiliateLinks';
import { isBookableLocalityName } from '../enrichCity';

describe('hotelUrl', () => {
  it('searches by city name with INR currency and en-gb locale', () => {
    const url = hotelUrl('Jaipur');
    expect(url).toContain('ss=Jaipur');
    expect(url).toContain('lang=en-gb');
    expect(url).toContain('selected_currency=INR');
    expect(url).not.toContain('lang=en-us');
  });

  it('omits aid when NEXT_PUBLIC_BOOKING_AID is unset', () => {
    const url = hotelUrl('Jaipur');
    expect(url).not.toContain('aid=');
  });

  it('includes checkin/checkout when provided', () => {
    const url = hotelUrl('Jaipur', '2026-12-01', '2026-12-05');
    expect(url).toContain('checkin=2026-12-01');
    expect(url).toContain('checkout=2026-12-05');
  });
});

describe('hotelNeighbourhoodUrl', () => {
  it('combines neighbourhood and city with INR currency and en-gb locale', () => {
    const url = hotelNeighbourhoodUrl('Kathmandu', 'Thamel');
    expect(url).toContain('ss=Thamel%2C+Kathmandu');
    expect(url).toContain('lang=en-gb');
    expect(url).toContain('selected_currency=INR');
  });
});

describe('flightUrl — .co.in domain', () => {
  it('uses skyscanner.co.in, not the UK .net domain', () => {
    const url = flightUrl('Paris', 'paris');
    expect(url).toContain('skyscanner.co.in');
    expect(url).not.toContain('skyscanner.net');
  });
});

describe('flightUrl — nearest-airport mapping for destinations without an airport', () => {
  const cases: [string, string, string][] = [
    ['Mathura', 'mathura', 'agra'],
    ['Vrindavan', 'vrindavan', 'agra'],
    ['Thekkady', 'thekkady', 'kochi'],
    ['Ajmer', 'ajmer', 'jaipur'],
    ['Bir Billing', 'bir-billing', 'dharamshala'],
    ['Bir', 'bir', 'dharamshala'],
    ['Tirthan Valley', 'tirthan-valley', 'chandigarh'],
    ['Mussoorie', 'mussoorie', 'dehradun'],
    ['Nainital', 'nainital', 'delhi'],
    ['Hampi', 'hampi', 'hubli'],
    ['Gokarna', 'gokarna', 'goa'],
    ['Darjeeling', 'darjeeling', 'bagdogra'],
    ['Kedarnath', 'kedarnath', 'dehradun'],
    ['Dzukou Valley', 'dzukou-valley', 'dimapur'],
  ];

  it.each(cases)('%s (%s) routes to the %s airport', (_name, slug, expectedAirport) => {
    const url = flightUrl(_name, slug);
    expect(url).toContain(`/flights-to/${expectedAirport}/`);
  });

  it('falls back to the plain city slug when there is no airport-mapping entry', () => {
    const url = flightUrl('Paris', 'paris');
    expect(url).toContain('/flights-to/paris/');
  });

  it('falls back to the plain city name when no slug is passed at all', () => {
    const url = flightUrl('Paris');
    expect(url).toContain('/flights-to/paris/');
  });
});

describe('flightUrl — env var behaviour', () => {
  it('omits associateid when NEXT_PUBLIC_SKYSCANNER_PID is unset', () => {
    const url = flightUrl('Paris', 'paris');
    expect(url).not.toContain('associateid=');
  });
});

describe('isBookableLocalityName — area classifier', () => {
  it('rejects the auto-generated thematic bucket names (the systemic bug)', () => {
    expect(isBookableLocalityName('Essential Core')).toBe(false);
    expect(isBookableLocalityName('Local Culture & Food')).toBe(false);
    expect(isBookableLocalityName('Nature & Easy Escapes')).toBe(false);
  });

  it('rejects hand-authored thematic groupings found in real click data', () => {
    expect(isBookableLocalityName('Caves, Peaks & Viewpoints')).toBe(false);
    expect(isBookableLocalityName('Festivals & Crafts')).toBe(false);
    expect(isBookableLocalityName('Snow View & Tiffin Top')).toBe(false);
  });

  it('accepts genuine neighbourhood/locality names', () => {
    expect(isBookableLocalityName('Thamel')).toBe(true);
    expect(isBookableLocalityName('North Cliff')).toBe(true);
    expect(isBookableLocalityName('Cinnamon Gardens (Colombo 7)')).toBe(true);
    expect(isBookableLocalityName('Patong Beach')).toBe(true);
    expect(isBookableLocalityName('Old Phuket Town')).toBe(true);
  });
});
