import { City } from './types';

export interface MapPin {
  lat: number;
  lng: number;
  label: string;
  description: string;
  icon: string;
  category: string;
  colour: string;
}

const CATEGORY_COLOURS: Record<string, string> = {
  Cultural:    '#FF6B35',
  Nature:      '#10B981',
  Adventure:   '#3B82F6',
  Relaxation:  '#8B5CF6',
  Culinary:    '#F59E0B',
  Wellness:    '#EC4899',
  Scenic:      '#06B6D4',
  Historical:  '#D97706',
  Spiritual:   '#7C3AED',
  Iconic:      '#EF4444',
  Pilgrimage:  '#7C3AED',
  UNESCO:      '#D97706',
  Landmark:    '#EF4444',
  Entertainment: '#F59E0B',
  Beach:       '#0EA5E9',
};

const FALLBACK_COLOUR = '#64748B';

export function getCategoryColour(category: string): string {
  return CATEGORY_COLOURS[category] ?? FALLBACK_COLOUR;
}

export function buildAttractionPins(city: City): MapPin[] {
  if (!city.thingsToDo) return [];
  return city.thingsToDo
    .filter((t) => t.coordinates != null)
    .map((t) => ({
      lat:         t.coordinates!.lat,
      lng:         t.coordinates!.lng,
      label:       t.name,
      description: t.description,
      icon:        t.icon,
      category:    t.category,
      colour:      getCategoryColour(t.category),
    }));
}
