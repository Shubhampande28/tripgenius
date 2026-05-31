'use client';

import { City } from '@/lib/types';

const SECTIONS = [
  { id: 'things-to-do',       label: 'Things To Do',    emoji: '🗺️' },
  { id: 'best-time-to-visit', label: 'Best Time',        emoji: '📅' },
  { id: 'hidden-gems',        label: 'Hidden Gems',      emoji: '💎' },
  { id: 'budget',             label: 'Budget',           emoji: '💰' },
  { id: 'where-to-stay',      label: 'Where To Stay',    emoji: '🏨' },
  { id: 'where-to-eat',       label: 'Where To Eat',     emoji: '🍜' },
  { id: 'getting-around',     label: 'Getting Around',   emoji: '🚌' },
  { id: 'pro-tips',           label: 'Pro Tips',         emoji: '💡' },
];

function scrollTo(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 88, behavior: 'smooth' });
}

export default function CityQuickNav({ city }: { city: City }) {
  const visible = SECTIONS.filter(({ id }) => {
    if (id === 'things-to-do')       return !!city.thingsToDo?.length;
    if (id === 'best-time-to-visit') return !!city.monthByMonth;
    if (id === 'hidden-gems')        return !!city.offbeatPlaces?.length;
    if (id === 'budget')             return !!city.budgetBreakdown;
    if (id === 'where-to-stay')      return !!city.hotels?.length;
    if (id === 'where-to-eat')       return !!city.restaurants?.length;
    if (id === 'getting-around')     return !!city.gettingAround?.length;
    if (id === 'pro-tips')           return !!city.proTips?.length;
    return true;
  });

  if (visible.length < 2) return null;

  return (
    <div className="border-b border-border bg-surface/60 sticky top-16 z-30 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide py-0.5">
          {visible.map(({ id, label, emoji }) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              className="flex items-center gap-1.5 px-3.5 py-3 whitespace-nowrap text-xs font-medium text-muted hover:text-primary-text hover:bg-elevated rounded-lg transition-all duration-150 flex-shrink-0"
            >
              <span className="text-sm">{emoji}</span>
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
