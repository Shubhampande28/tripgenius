'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Sparkles, Map, ArrowRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PlannerForm from '@/components/plan/PlannerForm';
import ItineraryDisplay from '@/components/plan/ItineraryDisplay';
import { TripPlanRequest, TripItinerary } from '@/lib/types';
import { allCities } from '@/lib/cities';
import { cityHasMapBuilder } from '@/lib/mapUtils';

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-[440px_1fr] gap-10 items-start">
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
              className="flex flex-col items-center justify-center py-24 text-center gap-4"
            >
              <div className="w-20 h-20 rounded-2xl bg-surface border border-border flex items-center justify-center">
                <Sparkles size={32} className="text-muted" />
              </div>
              <div>
                <p className="font-heading text-2xl font-semibold text-primary-text">
                  Your itinerary will appear here
                </p>
                <p className="text-muted mt-2 text-sm max-w-xs mx-auto">
                  Fill in the form and hit generate. We&apos;ll build your perfect trip in seconds.
                </p>
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
        <div className="relative border-b border-border bg-surface overflow-hidden pt-24 pb-12">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_80%_at_50%_120%,rgba(255,107,53,0.08),transparent)]" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-dark border border-border text-xs font-medium text-muted mb-6">
                <Sparkles size={12} className="text-accent" />
                Free &amp; instant — no sign-up needed
              </div>
              <h1 className="font-heading text-5xl sm:text-6xl font-semibold text-primary-text">
                Trip Planner
              </h1>
              <p className="mt-4 text-muted max-w-xl mx-auto">
                Tell us your destination and travel style. We&apos;ll build a complete, personalized
                day-by-day itinerary in seconds.
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
