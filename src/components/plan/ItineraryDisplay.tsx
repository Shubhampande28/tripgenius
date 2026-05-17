'use client';

import { motion } from 'framer-motion';
import {
  Sun, Sunset, Moon, Download, Share2,
  DollarSign, Backpack, Star
} from 'lucide-react';
import { TripItinerary } from '@/lib/types';

const timeIcons = { morning: Sun, afternoon: Sunset, evening: Moon };
const timeColors = {
  morning:   'text-gold bg-gold/10 border-gold/20',
  afternoon: 'text-accent bg-accent/10 border-accent/20',
  evening:   'text-purple-400 bg-purple-500/10 border-purple-500/20',
};

export default function ItineraryDisplay({ itinerary }: { itinerary: TripItinerary }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="bg-surface border border-border rounded-2xl p-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-teal animate-pulse" />
              <span className="text-xs font-semibold text-teal uppercase tracking-wider">AI Generated</span>
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl font-semibold text-primary-text">
              {itinerary.destination}
            </h2>
            <p className="text-muted mt-1">
              {itinerary.duration} &middot; {itinerary.style} style &middot; {itinerary.days.length} days planned
            </p>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-elevated border border-border text-sm font-medium text-muted hover:text-primary-text hover:border-border/80 transition-colors"
            >
              <Download size={14} />
              Export PDF
            </button>
            <button
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-elevated border border-border text-sm font-medium text-muted hover:text-primary-text hover:border-border/80 transition-colors"
            >
              <Share2 size={14} />
              Share
            </button>
          </div>
        </div>

        <div className="mt-5 p-4 bg-elevated border border-border/50 rounded-xl">
          <p className="text-sm text-primary-text/80 leading-relaxed italic">
            &ldquo;{itinerary.overview}&rdquo;
          </p>
        </div>
      </div>

      {/* Day cards */}
      {itinerary.days.map((day, i) => (
        <motion.div
          key={day.day}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: i * 0.08 }}
          className="bg-surface border border-border rounded-2xl overflow-hidden"
        >
          {/* Day header */}
          <div className="px-6 py-4 bg-elevated border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center">
                <span className="font-heading text-lg font-bold text-accent">{day.day}</span>
              </div>
              <div>
                <p className="text-xs text-muted">Day {day.day} &mdash; {day.date}</p>
                <h3 className="font-heading text-xl font-semibold text-primary-text">{day.theme}</h3>
              </div>
            </div>
          </div>

          {/* Activities */}
          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            {([
              { key: 'morning',   slot: day.morning },
              { key: 'afternoon', slot: day.afternoon },
              { key: 'evening',   slot: day.evening },
            ] as const).map(({ key, slot }) => {
              const Icon = timeIcons[key];
              const colorClass = timeColors[key];
              return (
                <div key={key} className="bg-elevated border border-border/50 rounded-xl p-4">
                  <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold mb-3 ${colorClass}`}>
                    <Icon size={11} />
                    {slot.time}
                  </div>
                  <h4 className="font-semibold text-primary-text text-sm mb-2">{slot.activity}</h4>
                  <p className="text-xs text-muted leading-relaxed">{slot.description}</p>
                  {slot.tip && (
                    <div className="mt-3 flex items-start gap-1.5">
                      <Star size={10} className="text-gold mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-gold/80 italic">{slot.tip}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </motion.div>
      ))}

      {/* Budget breakdown */}
      {itinerary.budget && itinerary.budget.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: itinerary.days.length * 0.08 }}
          className="bg-surface border border-border rounded-2xl p-6"
        >
          <div className="flex items-center gap-2 mb-6">
            <DollarSign size={18} className="text-teal" />
            <h3 className="font-heading text-2xl font-semibold text-primary-text">
              Estimated Budget Breakdown
            </h3>
          </div>
          <div className="space-y-3">
            {itinerary.budget.map((item) => (
              <div
                key={item.category}
                className="flex items-center justify-between py-3 border-b border-border/50 last:border-0"
              >
                <div>
                  <p className="text-sm font-medium text-primary-text">{item.category}</p>
                  <p className="text-xs text-muted mt-0.5">{item.note}</p>
                </div>
                <span className="text-sm font-semibold text-teal flex-shrink-0 ml-4">
                  {item.amount}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Packing tips */}
      {itinerary.packingTips && itinerary.packingTips.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: (itinerary.days.length + 1) * 0.08 }}
          className="bg-surface border border-border rounded-2xl p-6"
        >
          <div className="flex items-center gap-2 mb-5">
            <Backpack size={18} className="text-gold" />
            <h3 className="font-heading text-2xl font-semibold text-primary-text">
              Packing Essentials
            </h3>
          </div>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {itinerary.packingTips.map((tip, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-primary-text/80">
                <span className="text-gold mt-0.5 flex-shrink-0">✓</span>
                {tip}
              </li>
            ))}
          </ul>
        </motion.div>
      )}

      {/* Best advice */}
      {itinerary.bestAdvice && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: (itinerary.days.length + 2) * 0.08 }}
          className="bg-gradient-to-br from-accent/10 to-gold/5 border border-accent/20 rounded-2xl p-6"
        >
          <div className="flex items-center gap-2 mb-3">
            <Star size={16} className="text-gold" />
            <h3 className="font-heading text-xl font-semibold text-primary-text">
              Best Advice for This Trip
            </h3>
          </div>
          <p className="text-primary-text/80 leading-relaxed italic">
            &ldquo;{itinerary.bestAdvice}&rdquo;
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}
