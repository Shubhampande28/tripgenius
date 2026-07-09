'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Sparkles, Map, ArrowRight, Route, Clock3, ShieldCheck } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PlannerForm from '@/components/plan/PlannerForm';
import ItineraryDisplay from '@/components/plan/ItineraryDisplay';
import { TripPlanRequest, TripItinerary } from '@/lib/types';
import { allCities } from '@/lib/cities';
import { cityHasMapBuilder } from '@/lib/mapUtils';
import { trackEvent } from '@/lib/analytics';

const mapBuilderCities = allCities.filter(cityHasMapBuilder);

function PlannerPageInner() {
  const searchParams = useSearchParams();
  const initialDestination = searchParams.get('destination') ?? '';

  const [itinerary, setItinerary] = useState<TripItinerary | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: TripPlanRequest) => {
    setIsLoading(true);
    setItinerary(null);
    setError(null);
    // Mark these as key events in GA4 Admin → Events: they answer "does search
    // traffic actually use the planner?", which pageviews alone can't.
    trackEvent('planner_started', { destination: data.destination, style: data.style });

    try {
      const res = await fetch('/api/plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const { error: msg } = await res.json().catch(() => ({ error: 'Request failed' }));
        throw new Error(msg || 'Failed to generate itinerary');
      }

      const result: TripItinerary = await res.json();
      setItinerary(result);
      trackEvent('itinerary_generated', { destination: data.destination, style: data.style });

      setTimeout(() => {
        document.getElementById('itinerary-result')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="grid grid-cols-1 xl:grid-cols-[420px_1fr] gap-8 items-start">
        {/* Left: form (sticky on desktop) */}
        <div className="lg:sticky lg:top-24">
          <PlannerForm
            onSubmit={handleSubmit}
            isLoading={isLoading}
            initialDestination={initialDestination}
          />
        </div>

        {/* Right: output */}
        <div id="itinerary-result">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6 text-center"
            >
              <p className="text-red-400 font-medium mb-1">Something went wrong</p>
              <p className="text-sm text-muted">{error}</p>
            </motion.div>
          )}

          {isLoading && !itinerary && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-24 text-center gap-6"
            >
              <div className="relative w-20 h-20">
                <div className="absolute inset-0 rounded-full border-2 border-accent/20 animate-ping" />
                <div className="absolute inset-2 rounded-full border-2 border-accent/40 animate-pulse" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Sparkles size={28} className="text-accent" />
                </div>
              </div>
              <div>
                <p className="font-heading text-2xl font-semibold text-primary-text">
                  Building your itinerary…
                </p>
                <p className="text-muted mt-2 text-sm">
                  Putting together the perfect trip just for you.
                </p>
              </div>
              <div className="space-y-2 w-full max-w-xs">
                {['Researching destination…', 'Planning daily schedule…', 'Calculating budget…'].map((step, i) => (
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.4 }}
                    className="flex items-center gap-2 text-xs text-muted"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-teal animate-pulse" style={{ animationDelay: `${i * 0.3}s` }} />
                    {step}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {!isLoading && !itinerary && !error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-surface border border-border rounded-2xl p-8 sm:p-10"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-11 h-11 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center">
                  <Route size={21} className="text-accent" />
                </div>
                <div>
                  <p className="font-heading text-2xl font-semibold text-primary-text">Your plan builds here</p>
                  <p className="text-muted text-sm">Start with the essentials, then generate a flexible itinerary.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { icon: Route, title: 'No repeats', text: 'Activities are kept unique across the trip.' },
                  { icon: Clock3, title: 'Flexible days', text: 'Some days stay light instead of forcing 3 stops.' },
                  { icon: ShieldCheck, title: 'Guide data', text: 'Plans use the destination guides already on TripGenius.' },
                ].map(({ icon: Icon, title, text }) => (
                  <div key={title} className="bg-elevated border border-border/50 rounded-xl p-4 text-left">
                    <Icon size={17} className="text-teal mb-3" />
                    <p className="text-sm font-semibold text-primary-text">{title}</p>
                    <p className="text-xs text-muted mt-1 leading-relaxed">{text}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {itinerary && <ItineraryDisplay itinerary={itinerary} />}
        </div>
      </div>
    </div>
  );
}

export default function PlanPage() {
  return (
    <>
      <Navbar />
      <main className="bg-dark min-h-screen">
        {/* Page header */}
        <div className="relative border-b border-border bg-surface overflow-hidden pt-24 pb-10">
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-dark border border-border text-xs font-medium text-muted mb-5">
                <Sparkles size={12} className="text-accent" />
                Free self-serve planner - no sign-up needed
              </div>
              <h1 className="font-heading text-4xl sm:text-5xl font-semibold text-primary-text">
                Plan your own trip, without the spreadsheet
              </h1>
              <p className="mt-4 text-muted max-w-2xl">
                Pick where you are going, who is travelling and what you care about. The planner builds a realistic itinerary with unique activities, flexible days, budget notes and practical tips.
              </p>

              {mapBuilderCities.length > 0 && (
                <Link
                  href={`/plan/${mapBuilderCities[0].slug}`}
                  className="group mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal/10 border border-teal/20 text-xs font-medium text-teal hover:border-teal/40 transition-colors"
                >
                  <Map size={12} />
                  New: Pick places for {mapBuilderCities[0].name} on an interactive map
                  <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                </Link>
              )}
            </motion.div>
          </div>
        </div>

        <Suspense fallback={null}>
          <PlannerPageInner />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
