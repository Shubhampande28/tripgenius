'use client';

import { useState, useEffect } from 'react';
import { City } from '@/lib/types';

const SECTIONS = [
  { id: 'things-to-do',       label: 'Things to Do',       emoji: '🗺️' },
  { id: 'city-map',           label: 'Map',                emoji: '📌' },
  { id: 'best-time-to-visit', label: 'Best Time to Visit', emoji: '📅' },
  { id: 'explore-areas',      label: 'Explore Areas',       emoji: '📍' },
  { id: 'hidden-gems',        label: 'Hidden Gems',         emoji: '💎' },
  { id: 'where-to-stay',      label: 'Where to Stay',       emoji: '🏨' },
  { id: 'where-to-eat',       label: 'What to Eat',         emoji: '🍜' },
  { id: 'getting-around',     label: 'Getting Around',      emoji: '🚌' },
  { id: 'pro-tips',           label: 'Pro Tips',            emoji: '💡' },
];

export default function CityTOC({ city }: { city: City }) {
  const [active, setActive] = useState('');

  useEffect(() => {
    const ids = SECTIONS.map((s) => s.id);
    const observer = new IntersectionObserver(
      (entries) => {
        // Pick the topmost intersecting section
        const intersecting = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (intersecting.length > 0) setActive(intersecting[0].target.id);
      },
      { rootMargin: '-10% 0px -80% 0px', threshold: 0 }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const visible = SECTIONS.filter(({ id }) => {
    if (id === 'best-time-to-visit') return !!city.monthByMonth;
    if (id === 'things-to-do')       return !!city.thingsToDo?.length;
    if (id === 'hidden-gems')        return !!city.offbeatPlaces?.length;
    if (id === 'explore-areas')      return !!(city.neighbourhoods?.length || city.areas?.length);
    if (id === 'where-to-stay')      return !!(city.neighbourhoods?.length || city.hotels?.length);
    if (id === 'where-to-eat')       return !!city.restaurants?.length;
    if (id === 'getting-around')     return !!city.gettingAround?.length;
    if (id === 'pro-tips')           return !!city.proTips?.length;
    return true;
  });

  if (visible.length < 2) return null;

  return (
    <nav aria-label="Page sections" className="bg-elevated border border-border rounded-2xl p-4 mb-6">
      <p className="text-[10px] font-bold uppercase tracking-widest text-muted mb-3 px-1">
        Jump to Section
      </p>
      <ul className="space-y-0.5">
        {visible.map(({ id, label, emoji }) => (
          <li key={id}>
            <a
              href={`#${id}`}
              onClick={(e) => {
                e.preventDefault();
                const el = document.getElementById(id);
                if (!el) return;
                const y = el.getBoundingClientRect().top + window.scrollY - 88;
                window.scrollTo({ top: y, behavior: 'smooth' });
              }}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm transition-all duration-200 ${
                active === id
                  ? 'bg-accent/10 text-accent font-semibold'
                  : 'text-muted hover:text-primary-text hover:bg-surface'
              }`}
            >
              <span className="text-base leading-none">{emoji}</span>
              <span>{label}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
