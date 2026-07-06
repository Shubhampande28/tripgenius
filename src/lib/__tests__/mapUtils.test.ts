jest.mock('@/lib/cities', () => ({
  allCities: [],
  getCityBySlug: () => undefined,
  getAllCitySlugs: () => [],
}));

import { getCategoryColour, buildAttractionPins } from '../mapUtils';
import type { City } from '../types';

function makeCity(thingsToDo: City['thingsToDo'] = []): City {
  return {
    slug: 'test', name: 'Test', country: 'Testland', flag: '🏳️',
    tagline: '', description: '', heroDescription: '',
    stats: { bestTime: 'Jan–Dec', budget: '$50/day', language: 'English', currency: 'USD' },
    vibes: [], gradient: '', accentColor: '', image: '', heroImage: '',
    thingsToDo,
  };
}

describe('getCategoryColour', () => {
  it('returns a non-empty hex colour for known categories', () => {
    expect(getCategoryColour('Cultural')).toMatch(/^#[0-9A-Fa-f]{6}$/);
    expect(getCategoryColour('Nature')).toMatch(/^#[0-9A-Fa-f]{6}$/);
    expect(getCategoryColour('Adventure')).toMatch(/^#[0-9A-Fa-f]{6}$/);
  });

  it('returns the fallback colour for unknown categories', () => {
    const fallback = getCategoryColour('Unknown Category XYZ');
    expect(fallback).toMatch(/^#[0-9A-Fa-f]{6}$/);
  });

  it('returns the same colour consistently', () => {
    expect(getCategoryColour('Cultural')).toBe(getCategoryColour('Cultural'));
  });
});

describe('buildAttractionPins', () => {
  it('returns empty array when city has no thingsToDo', () => {
    expect(buildAttractionPins(makeCity())).toHaveLength(0);
  });

  it('returns empty array when no thingsToDo have coordinates', () => {
    const city = makeCity([
      { name: 'Temple', description: 'A temple', icon: '🛕', duration: '1h', category: 'Cultural' },
    ]);
    expect(buildAttractionPins(city)).toHaveLength(0);
  });

  it('returns only items that have coordinates', () => {
    const city = makeCity([
      { name: 'Temple', description: 'A temple', icon: '🛕', duration: '1h', category: 'Cultural', coordinates: { lat: 1.0, lng: 2.0 } },
      { name: 'Beach',  description: 'A beach',  icon: '🌊', duration: '2h', category: 'Relaxation' }, // no coords
    ]);
    const pins = buildAttractionPins(city);
    expect(pins).toHaveLength(1);
    expect(pins[0].label).toBe('Temple');
  });

  it('maps ThingToDo fields to MapPin fields correctly', () => {
    const city = makeCity([
      { name: 'Temple', description: 'Ancient temple.', icon: '🛕', duration: '2h', category: 'Cultural', coordinates: { lat: -8.6, lng: 115.1 } },
    ]);
    const [pin] = buildAttractionPins(city);
    expect(pin.lat).toBe(-8.6);
    expect(pin.lng).toBe(115.1);
    expect(pin.label).toBe('Temple');
    expect(pin.icon).toBe('🛕');
    expect(pin.category).toBe('Cultural');
    expect(pin.colour).toMatch(/^#[0-9A-Fa-f]{6}$/);
  });

  it('handles city with thingsToDo: undefined gracefully', () => {
    const city = makeCity(undefined);
    expect(buildAttractionPins(city)).toHaveLength(0);
  });
});
