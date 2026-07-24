'use client';

import { useEffect, useState } from 'react';
import { City } from '@/lib/types';

const SECTIONS = [
  { id: 'things-to-do',       label: 'Things To Do',   emoji: '🗺️' },
  { id: 'city-map',           label: 'Map',            emoji: '📌' },
  { id: 'best-time-to-visit', label: 'Best Time',      emoji: '📅' },
  { id: 'budget',             label: 'Budget',          emoji: '💰' },
  { id: 'explore-areas',      label: 'Explore Areas',  emoji: '📍' },
  { id: 'hidden-gems',        label: 'Hidden Gems',     emoji: '💎' },
  { id: 'where-to-stay',      label: 'Where To Stay',   emoji: '🏨' },
  { id: 'where-to-eat',       label: 'Where To Eat',    emoji: '🍜' },
  { id: 'getting-around',     label: 'Getting Around',  emoji: '🚌' },
  { id: 'pro-tips',           label: 'Pro Tips',        emoji: '💡' },
  { id: 'faq',                label: 'FAQ',             emoji: '❓' },
];

function scrollTo(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 116, behavior: 'smooth' });
}

// Sticky in-page section nav with scroll-spy: sits below the main navbar and
// highlights the section currently in view (IntersectionObserver — no scroll
// handler, no layout thrash).
export default function CityQuickNav({ city }: { city: City }) {
  const visible = SECTIONS.filter(({ id }) => {
    if (id === 'best-time-to-visit') return !!city.monthByMonth;
    if (id === 'things-to-do')       return !!city.thingsToDo?.length;
    if (id === 'city-map')           return true;
    if (id === 'budget')             return !!city.budgetBreakdown;
    if (id === 'explore-areas')      return !!(city.neighbourhoods?.length || city.areas?.length);
    if (id === 'hidden-gems')        return !!city.offbeatPlaces?.length;
    if (id === 'where-to-stay')      return !!(city.hotels?.length || city.neighbourhoods?.length);
    if (id === 'where-to-eat')       return !!city.restaurants?.length;
    if (id === 'getting-around')     return !!city.gettingAround?.length;
    if (id === 'pro-tips')           return !!city.proTips?.length;
    return true;
  });

  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const ids = visible.map((s) => s.id);
    const els = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (!els.length) return;

    // A section is "active" while its box crosses the upper-third band of the
    // viewport — feels right for long, uneven sections.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(e.target.id);
        }
      },
      { rootMargin: '-25% 0px -65% 0px' },
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
    // visible is derived from the static city prop — stable per page
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [city.slug]);

  if (visible.length < 2) return null;

  return (
    <div className="sticky top-16 z-30 bg-dark/85 backdrop-blur-md border-b border-border">
      <nav aria-label="Page sections" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div className="flex items-center gap-1 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
          {visible.map(({ id, label, emoji }) => {
            const isActive = active === id;
            return (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                aria-current={isActive ? 'true' : undefined}
                className={`flex items-center gap-1.5 px-4 py-2 whitespace-nowrap text-xs font-medium rounded-chip transition-colors duration-150 flex-shrink-0 border ${
                  isActive
                    ? 'text-white bg-accent border-accent'
                    : 'text-muted hover:text-accent border-border hover:border-accent/40 bg-surface hover:bg-accent/5'
                }`}
              >
                <span className="text-sm leading-none" aria-hidden>{emoji}</span>
                {label}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
