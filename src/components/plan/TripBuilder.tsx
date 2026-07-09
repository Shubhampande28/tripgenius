'use client';

import { useMemo, useState } from 'react';
import { Plus, Minus, X, ArrowUp, ArrowDown, Trash2 } from 'lucide-react';
import { City, ThingToDo } from '@/lib/types';
import TripBuilderMapWrapper from './TripBuilderMapWrapper';
import type { PinMeta } from './TripBuilderMap';
import { trackEvent } from '@/lib/analytics';

const DAY_COLORS = ['#FF6B35', '#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EC4899', '#06B6D4'];
const MAX_DAYS = 7;

interface SelectedItem {
  name: string;
  day: number;
}

export default function TripBuilder({ city }: { city: City }) {
  const things = useMemo(
    () => (city.thingsToDo ?? []).filter((t) => t.coordinates),
    [city]
  );

  const [numDays, setNumDays] = useState(3);
  const [activeDay, setActiveDay] = useState(1);
  const [selected, setSelected] = useState<SelectedItem[]>([]);

  function toggle(name: string) {
    setSelected((prev) => {
      if (prev.some((s) => s.name === name)) return prev.filter((s) => s.name !== name);
      // First pin = the "planner engaged" moment; mark as a GA4 key event.
      if (prev.length === 0) trackEvent('trip_builder_started', { city: city.slug });
      return [...prev, { name, day: activeDay }];
    });
  }

  function remove(name: string) {
    setSelected((prev) => prev.filter((s) => s.name !== name));
  }

  // Reorder an item within its day by swapping it with its neighbour.
  function move(name: string, dir: -1 | 1) {
    setSelected((prev) => {
      const item = prev.find((s) => s.name === name);
      if (!item) return prev;
      const dayItems = prev.filter((s) => s.day === item.day);
      const idx = dayItems.findIndex((s) => s.name === name);
      const swapIdx = idx + dir;
      if (swapIdx < 0 || swapIdx >= dayItems.length) return prev;

      const a = dayItems[idx];
      const b = dayItems[swapIdx];
      const aIdx = prev.indexOf(a);
      const bIdx = prev.indexOf(b);
      const next = [...prev];
      [next[aIdx], next[bIdx]] = [next[bIdx], next[aIdx]];
      return next;
    });
  }

  function addDay() {
    setNumDays((d) => Math.min(d + 1, MAX_DAYS));
  }

  function removeLastDay() {
    setNumDays((d) => {
      const next = Math.max(d - 1, 1);
      setSelected((prev) => prev.filter((s) => s.day <= next));
      setActiveDay((a) => Math.min(a, next));
      return next;
    });
  }

  const categories = useMemo(() => {
    const map = new Map<string, ThingToDo[]>();
    for (const t of things) {
      const arr = map.get(t.category) ?? [];
      arr.push(t);
      map.set(t.category, arr);
    }
    return Array.from(map.entries());
  }, [things]);

  const pinMeta = useMemo(() => {
    const map = new Map<string, PinMeta>();
    for (let d = 1; d <= numDays; d++) {
      selected
        .filter((s) => s.day === d)
        .forEach((item, idx) => {
          map.set(item.name, { day: d, order: idx + 1, color: DAY_COLORS[(d - 1) % DAY_COLORS.length] });
        });
    }
    return map;
  }, [selected, numDays]);

  const thingByName = useMemo(() => new Map(things.map((t) => [t.name, t])), [things]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Day controls */}
      <div className="flex flex-wrap items-center gap-3 mb-6 p-4 rounded-2xl bg-surface border border-border">
        <span className="text-xs font-semibold uppercase tracking-widest text-muted">Adding picks to</span>
        <div className="flex items-center gap-2 flex-wrap">
          {Array.from({ length: numDays }, (_, i) => i + 1).map((d) => {
            const count = selected.filter((s) => s.day === d).length;
            const active = d === activeDay;
            return (
              <button
                key={d}
                onClick={() => setActiveDay(d)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold border transition-colors ${
                  active ? 'text-white border-transparent' : 'bg-elevated border-border text-muted hover:text-primary-text'
                }`}
                style={active ? { backgroundColor: DAY_COLORS[(d - 1) % DAY_COLORS.length] } : undefined}
              >
                Day {d}
                {count > 0 && (
                  <span className={`text-[10px] font-bold rounded-full px-1.5 ${active ? 'bg-white/25' : 'bg-accent/15 text-accent'}`}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
          <button
            onClick={addDay}
            disabled={numDays >= MAX_DAYS}
            aria-label="Add a day"
            className="w-8 h-8 flex items-center justify-center rounded-full bg-elevated border border-border text-muted hover:text-primary-text disabled:opacity-30 transition-colors"
          >
            <Plus size={14} />
          </button>
          <button
            onClick={removeLastDay}
            disabled={numDays <= 1}
            aria-label="Remove a day"
            className="w-8 h-8 flex items-center justify-center rounded-full bg-elevated border border-border text-muted hover:text-primary-text disabled:opacity-30 transition-colors"
          >
            <Minus size={14} />
          </button>
        </div>
        {selected.length > 0 && (
          <button
            onClick={() => setSelected([])}
            className="ml-auto flex items-center gap-1.5 text-xs text-muted hover:text-red-400 transition-colors"
          >
            <Trash2 size={12} /> Clear all
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_460px] gap-8">
        {/* Browse places */}
        <div className="space-y-8 order-2 lg:order-1">
          {categories.map(([category, items]) => (
            <div key={category}>
              <h3 className="font-heading text-xl font-semibold text-primary-text mb-3">{category}</h3>
              <div className="space-y-3">
                {items.map((t) => {
                  const meta = pinMeta.get(t.name);
                  return (
                    <div
                      key={t.name}
                      className={`flex items-start gap-4 p-4 rounded-2xl border transition-colors ${
                        meta ? 'border-accent/30 bg-accent/5' : 'border-border bg-surface'
                      }`}
                    >
                      <div className="w-11 h-11 rounded-xl bg-elevated border border-border flex items-center justify-center text-xl flex-shrink-0">
                        {t.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <h4 className="font-semibold text-primary-text text-sm">{t.name}</h4>
                          <span className="text-[10px] text-muted">{t.duration}</span>
                        </div>
                        <p className="text-sm text-muted leading-relaxed line-clamp-2">{t.description}</p>
                      </div>
                      <div className="flex-shrink-0">
                        {meta ? (
                          <button
                            onClick={() => remove(t.name)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white"
                            style={{ backgroundColor: meta.color }}
                          >
                            Day {meta.day} · #{meta.order} <X size={12} />
                          </button>
                        ) : (
                          <button
                            onClick={() => toggle(t.name)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-accent/30 text-accent hover:bg-accent/10 transition-colors"
                          >
                            <Plus size={12} /> Add to Day {activeDay}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Map + itinerary */}
        <div className="order-1 lg:order-2 lg:sticky lg:top-24 space-y-4 self-start">
          <TripBuilderMapWrapper
            things={things}
            pinMeta={pinMeta}
            center={city.coordinates!}
            activeDay={activeDay}
            onTogglePin={toggle}
          />

          <div className="bg-surface border border-border rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading text-lg font-semibold text-primary-text">Your Itinerary</h3>
              <span className="text-xs text-muted">
                {selected.length} {selected.length === 1 ? 'place' : 'places'} · {numDays} {numDays === 1 ? 'day' : 'days'}
              </span>
            </div>

            {selected.length === 0 ? (
              <p className="text-sm text-muted text-center py-6">
                Tap a pin on the map or hit &ldquo;Add&rdquo; on any place to start building your trip.
              </p>
            ) : (
              <div className="space-y-5">
                {Array.from({ length: numDays }, (_, i) => i + 1).map((d) => {
                  const items = selected.filter((s) => s.day === d);
                  if (items.length === 0) return null;
                  return (
                    <div key={d}>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: DAY_COLORS[(d - 1) % DAY_COLORS.length] }} />
                        <h4 className="text-xs font-bold uppercase tracking-widest text-muted">Day {d}</h4>
                      </div>
                      <ol className="space-y-1.5">
                        {items.map((item, idx) => {
                          const thing = thingByName.get(item.name);
                          if (!thing) return null;
                          return (
                            <li key={item.name} className="flex items-center gap-2.5 group">
                              <span
                                className="w-5 h-5 rounded-full text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0"
                                style={{ backgroundColor: DAY_COLORS[(d - 1) % DAY_COLORS.length] }}
                              >
                                {idx + 1}
                              </span>
                              <span className="text-sm flex-shrink-0">{thing.icon}</span>
                              <span className="text-sm text-primary-text flex-1 truncate">{thing.name}</span>
                              <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                  onClick={() => move(item.name, -1)}
                                  disabled={idx === 0}
                                  aria-label="Move up"
                                  className="w-6 h-6 flex items-center justify-center text-muted hover:text-primary-text disabled:opacity-30"
                                >
                                  <ArrowUp size={12} />
                                </button>
                                <button
                                  onClick={() => move(item.name, 1)}
                                  disabled={idx === items.length - 1}
                                  aria-label="Move down"
                                  className="w-6 h-6 flex items-center justify-center text-muted hover:text-primary-text disabled:opacity-30"
                                >
                                  <ArrowDown size={12} />
                                </button>
                                <button
                                  onClick={() => remove(item.name)}
                                  aria-label="Remove"
                                  className="w-6 h-6 flex items-center justify-center text-muted hover:text-red-400"
                                >
                                  <X size={12} />
                                </button>
                              </div>
                            </li>
                          );
                        })}
                      </ol>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
