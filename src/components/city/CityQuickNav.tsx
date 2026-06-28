'use client';

import { City } from '@/lib/types';

const SECTIONS = [
  { id: 'best-time-to-visit', label: 'Best Time',      emoji: '📅' },
  { id: 'things-to-do',       label: 'Things To Do',   emoji: '🗺️' },
  { id: 'explore-areas',      label: 'Explore Areas',  emoji: '📍' },
  { id: 'hidden-gems',        label: 'Hidden Gems',     emoji: '💎' },
  { id: 'where-to-stay',      label: 'Where To Stay',   emoji: '🏨' },
  { id: 'where-to-eat',       label: 'Where To Eat',    emoji: '🍜' },
  { id: 'getting-around',     label: 'Getting Around',  emoji: '🚌' },
  { id: 'pro-tips',           label: 'Pro Tips',        emoji: '💡' },
];

function scrollTo(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 72, behavior: 'smooth' });
}

export default function CityQuickNav({ city }: { city: City }) {
  const visible = SECTIONS.filter(({ id }) => {
    if (id === 'best-time-to-visit') return !!city.monthByMonth;
    if (id === 'things-to-do')       return !!city.thingsToDo?.length;
    if (id === 'explore-areas')      return !!(city.neighbourhoods?.length || city.areas?.length);
    if (id === 'hidden-gems')        return !!city.offbeatPlaces?.length && !city.offbeatSynthetic;
    if (id === 'where-to-stay')      return !!(city.hotels?.length || city.neighbourhoods?.length);
    if (id === 'where-to-eat')       return !!city.restaurants?.length && !city.restaurantsSynthetic;
    if (id === 'getting-around')     return !!city.gettingAround?.length && !city.gettingAroundSynthetic;
    if (id === 'pro-tips')           return !!city.proTips?.length && !city.proTipsSynthetic;
    return true;
  });

  if (visible.length < 2) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2">
      <div className="flex items-center gap-1 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
        {visible.map(({ id, label, emoji }) => (
          <button
            key={id}
            onClick={() => scrollTo(id)}
            className="flex items-center gap-1.5 px-4 py-2 whitespace-nowrap text-xs font-medium text-muted hover:text-accent border border-border hover:border-accent/40 rounded-full transition-all duration-150 flex-shrink-0 bg-surface hover:bg-accent/5"
          >
            <span className="text-sm leading-none">{emoji}</span>
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
