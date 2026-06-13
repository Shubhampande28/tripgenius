'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import {
  MapPin, Calendar, Users, Sparkles, Loader2,
  Mountain, Heart, Users2, Wallet, Crown, Coffee,
  Camera, TreePine, Music
} from 'lucide-react';
import { TripPlanRequest } from '@/lib/types';
import { getDestinationSuggestions } from '@/lib/searchSuggestions';
import Highlight from '@/components/Highlight';

const styles = [
  { value: 'adventure', label: 'Adventure', icon: Mountain, color: 'text-accent', bg: 'bg-accent/10 border-accent/30' },
  { value: 'romantic', label: 'Romantic', icon: Heart, color: 'text-pink-400', bg: 'bg-pink-500/10 border-pink-500/30' },
  { value: 'family', label: 'Family', icon: Users2, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/30' },
  { value: 'budget', label: 'Budget', icon: Wallet, color: 'text-teal', bg: 'bg-teal/10 border-teal/30' },
  { value: 'luxury', label: 'Luxury', icon: Crown, color: 'text-gold', bg: 'bg-gold/10 border-gold/30' },
];

const interests = [
  { value: 'food', label: 'Food & Dining', icon: Coffee },
  { value: 'culture', label: 'Culture & History', icon: Camera },
  { value: 'nature', label: 'Nature & Outdoors', icon: TreePine },
  { value: 'nightlife', label: 'Nightlife', icon: Music },
  { value: 'shopping', label: 'Shopping', icon: Wallet },
  { value: 'wellness', label: 'Wellness & Spa', icon: Heart },
];

const quickDestinations = ['Bali', 'Thailand', 'Dubai', 'Japan', 'Goa'];

interface Props {
  onSubmit: (data: TripPlanRequest) => void;
  isLoading: boolean;
  initialDestination?: string;
}

export default function PlannerForm({ onSubmit, isLoading, initialDestination = '' }: Props) {
  const [destination, setDestination] = useState(initialDestination);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [people, setPeople] = useState(2);
  const [style, setStyle] = useState('');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  const [showDestDrop, setShowDestDrop] = useState(false);
  const [destActiveIdx, setDestActiveIdx] = useState(-1);
  const destRef = useRef<HTMLDivElement>(null);
  const destSuggestions = useMemo(() => getDestinationSuggestions(destination), [destination]);

  // Close destination dropdown on outside click
  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (destRef.current && !destRef.current.contains(e.target as Node)) {
        setShowDestDrop(false);
        setDestActiveIdx(-1);
      }
    };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, []);

  function selectDestination(label: string) {
    setDestination(label);
    setShowDestDrop(false);
    setDestActiveIdx(-1);
  }

  function handleDestKeyDown(e: React.KeyboardEvent) {
    if (!showDestDrop || destSuggestions.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setDestActiveIdx((i) => Math.min(i + 1, destSuggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setDestActiveIdx((i) => Math.max(i - 1, -1));
    } else if (e.key === 'Enter') {
      if (destActiveIdx >= 0 && destSuggestions[destActiveIdx]) {
        e.preventDefault();
        selectDestination(destSuggestions[destActiveIdx].label);
      }
    } else if (e.key === 'Escape') {
      setShowDestDrop(false);
      setDestActiveIdx(-1);
    }
  }

  const toggleInterest = (val: string) => {
    setSelectedInterests((prev) =>
      prev.includes(val) ? prev.filter((i) => i !== val) : [...prev, val]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!destination || !startDate || !endDate || !style) return;
    onSubmit({
      destination,
      startDate,
      endDate,
      people,
      style,
      interests: selectedInterests,
    });
  };

  const inputClass =
    'w-full px-4 py-3 bg-elevated border border-border rounded-xl text-primary-text placeholder:text-muted/60 focus:outline-none focus:border-accent transition-colors text-sm';

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-surface border border-border rounded-2xl p-5 sm:p-6 space-y-6"
    >
      <div>
        <h2 className="font-heading text-2xl font-semibold text-primary-text mb-1">
          Trip details
        </h2>
        <p className="text-sm text-muted">Use this like a planning brief. The result stays flexible and avoids repeated activities.</p>
      </div>

      {/* Destination */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-widest text-muted mb-3">
          Destination
        </label>
        <div ref={destRef} className="relative">
          <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
          <input
            type="text"
            value={destination}
            onChange={(e) => {
              setDestination(e.target.value);
              setShowDestDrop(e.target.value.length >= 2);
              setDestActiveIdx(-1);
            }}
            onFocus={() => { if (destination.length >= 2) setShowDestDrop(true); }}
            onKeyDown={handleDestKeyDown}
            placeholder="City, country, or region..."
            required
            autoComplete="off"
            role="combobox"
            aria-autocomplete="list"
            aria-expanded={showDestDrop && destSuggestions.length > 0}
            aria-controls="destination-suggestions-listbox"
            aria-activedescendant={destActiveIdx >= 0 ? `destination-option-${destActiveIdx}` : undefined}
            className={`${inputClass} pl-11`}
          />

          {/* Suggestions dropdown */}
          {showDestDrop && destSuggestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.15 }}
              id="destination-suggestions-listbox"
              role="listbox"
              className="absolute top-full left-0 right-0 mt-2 bg-elevated border border-border rounded-xl shadow-xl overflow-hidden z-50 text-left"
            >
              {destSuggestions.map((s, i) => (
                <div
                  key={`${s.type}-${s.label}-${i}`}
                  id={`destination-option-${i}`}
                  role="option"
                  aria-selected={i === destActiveIdx}
                  onMouseDown={() => selectDestination(s.label)}
                  onMouseEnter={() => setDestActiveIdx(i)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left cursor-pointer transition-colors ${
                    i === destActiveIdx ? 'bg-accent/8' : 'hover:bg-surface'
                  } ${i > 0 ? 'border-t border-border/40' : ''}`}
                >
                  <span className="text-lg flex-shrink-0">
                    {s.type === 'country' ? s.flag : s.city.flag}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      {s.type === 'country' && (
                        <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-accent/10 text-accent">Country</span>
                      )}
                      <p className="text-sm font-medium text-primary-text">
                        <Highlight text={s.label} query={destination} />
                      </p>
                    </div>
                    <p className="text-xs text-muted">{s.sub}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {quickDestinations.map((label) => (
            <button
              key={label}
              type="button"
              onClick={() => selectDestination(label)}
              className="px-3 py-1.5 rounded-full bg-elevated border border-border text-xs font-medium text-muted hover:text-primary-text hover:border-accent/30 transition-colors"
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Dates */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-widest text-muted mb-3">
            Start Date
          </label>
          <div className="relative">
            <Calendar size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
              className={`${inputClass} pl-11 [color-scheme:dark]`}
            />
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-widest text-muted mb-3">
            End Date
          </label>
          <div className="relative">
            <Calendar size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              min={startDate}
              required
              className={`${inputClass} pl-11 [color-scheme:dark]`}
            />
          </div>
        </div>
      </div>

      {/* People */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-widest text-muted mb-3">
          Travellers
        </label>
        <div className="flex items-center gap-4">
          <Users size={16} className="text-muted" />
          <div className="flex items-center gap-3 bg-elevated border border-border rounded-xl p-1">
            {[1, 2, 3, 4, '5+'].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setPeople(typeof n === 'number' ? n : 5)}
                className={`w-10 h-9 rounded-lg text-sm font-semibold transition-all ${
                  (typeof n === 'number' ? n : 5) === people
                    ? 'bg-accent text-white shadow-md shadow-accent/20'
                    : 'text-muted hover:text-primary-text'
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Travel style */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-widest text-muted mb-3">
          Travel Style
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {styles.map(({ value, label, icon: Icon, color, bg }) => (
            <button
              key={value}
              type="button"
              onClick={() => setStyle(value)}
              className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${
                style === value ? bg : 'bg-elevated border-border hover:border-muted'
              }`}
            >
              <Icon size={20} className={style === value ? color : 'text-muted'} />
              <span className={`text-xs font-medium ${style === value ? 'text-primary-text' : 'text-muted'}`}>
                {label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Interests */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-widest text-muted mb-3">
          Interests <span className="text-muted/50 normal-case font-normal tracking-normal">(optional, pick any)</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {interests.map(({ value, label, icon: Icon }) => {
            const active = selectedInterests.includes(value);
            return (
              <button
                key={value}
                type="button"
                onClick={() => toggleInterest(value)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm transition-all ${
                  active
                    ? 'bg-teal/10 border-teal/40 text-teal'
                    : 'bg-elevated border-border text-muted hover:border-muted'
                }`}
              >
                <Icon size={13} />
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isLoading || !destination || !startDate || !endDate || !style}
        className="w-full flex items-center justify-center gap-3 py-4 rounded-xl bg-accent text-white font-semibold text-base hover:bg-accent/90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-accent/25"
      >
        {isLoading ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            Building your itinerary…
          </>
        ) : (
          <>
            <Sparkles size={18} />
            Plan My Trip
          </>
        )}
      </button>
    </motion.form>
  );
}
