'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, MapPin } from 'lucide-react';

export interface ItineraryDay {
  day: number;
  citySlug: string;
  cityName: string;
  cityFlag: string;
  cityTagline: string;
  theme: string | null;
}

export interface ItineraryPlan {
  duration: number;
  label: string;
  subtitle: string;
  days: ItineraryDay[];
}

interface Props {
  plans: ItineraryPlan[];
  countryName: string;
}

export default function ItineraryTabs({ plans, countryName }: Props) {
  const [active, setActive] = useState(0);
  const plan = plans[active];
  if (!plan) return null;

  return (
    <div>
      {/* Tab selector */}
      <div className="flex flex-wrap gap-2 mb-8">
        {plans.map((p, i) => (
          <button
            key={p.duration}
            onClick={() => setActive(i)}
            className={`group flex flex-col items-start px-5 py-3 rounded-2xl border text-left transition-all duration-200 ${
              active === i
                ? 'bg-accent border-accent text-white shadow-lg shadow-accent/20'
                : 'bg-surface border-border text-muted hover:border-accent/40 hover:text-primary-text'
            }`}
          >
            <span className="text-sm font-bold">{p.label}</span>
            <span className={`text-[11px] ${active === i ? 'text-white/70' : 'text-muted'}`}>
              {p.subtitle}
            </span>
          </button>
        ))}
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical connector line */}
        <div className="absolute left-5 top-5 bottom-5 w-px bg-border hidden sm:block" />

        <div className="space-y-3">
          {plan.days.map((item, idx) => (
            <Link
              key={item.day}
              href={`/cities/${item.citySlug}`}
              className="group relative flex items-start gap-4 bg-surface border border-border hover:border-accent/50 rounded-2xl p-4 sm:p-5 transition-all duration-200 hover:-translate-y-px hover:shadow-md hover:shadow-black/10"
            >
              {/* Day number bubble */}
              <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold border transition-all duration-200 z-10 ${
                idx === 0
                  ? 'bg-accent border-accent text-white'
                  : 'bg-elevated border-border text-muted group-hover:bg-accent/10 group-hover:border-accent/30 group-hover:text-accent'
              }`}>
                D{item.day}
              </div>

              <div className="flex-1 min-w-0">
                {/* City/theme header */}
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-base leading-none">{item.cityFlag}</span>
                  <h4 className="font-semibold text-primary-text group-hover:text-accent transition-colors text-sm">
                    {item.theme
                      ? `${item.cityName} — ${item.theme}`
                      : item.cityName}
                  </h4>
                </div>
                <p className="text-xs text-muted line-clamp-1 ml-6">{item.cityTagline}</p>
              </div>

              <ArrowRight className="w-4 h-4 text-muted group-hover:text-accent group-hover:translate-x-0.5 flex-shrink-0 self-center transition-all duration-200" />
            </Link>
          ))}
        </div>
      </div>

      {/* Bottom note */}
      <div className="mt-6 flex items-center gap-2 text-xs text-muted bg-elevated border border-border rounded-xl px-4 py-3">
        <MapPin className="w-3.5 h-3.5 flex-shrink-0 text-accent" />
        <span>
          This is a suggested route for {plan.duration} days in {countryName}. Click any city to read the full guide and customize for your trip.
        </span>
      </div>
    </div>
  );
}
