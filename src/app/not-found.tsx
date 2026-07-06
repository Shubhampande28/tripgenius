import type { Metadata } from 'next';
import Link from 'next/link';
import { Search, MapPin, ArrowRight, Compass } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SafeImage from '@/components/SafeImage';
import { getCityBySlug } from '@/lib/cities';
import { getCityImageUrl } from '@/lib/cityImages';

export const metadata: Metadata = {
  title: 'Page Not Found',
  robots: { index: false, follow: true },
};

// Most popular destinations — same shortlist the footer promotes
const POPULAR_SLUGS = ['bali', 'tokyo', 'paris', 'bangkok', 'dubai', 'goa'];

export default function NotFound() {
  const popular = POPULAR_SLUGS
    .map((s) => getCityBySlug(s))
    .filter((c): c is NonNullable<ReturnType<typeof getCityBySlug>> => c !== undefined);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-dark pt-28 pb-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">

          <p className="font-heading text-7xl sm:text-8xl font-bold text-accent/20 leading-none select-none">404</p>
          <h1 className="font-heading text-3xl sm:text-4xl font-semibold text-primary-text mt-4 mb-3">
            Looks like this page wandered off the map
          </h1>
          <p className="text-muted text-base leading-relaxed max-w-xl mx-auto mb-8">
            The page you&apos;re looking for doesn&apos;t exist or has moved.
            No worries — the world is big, and there&apos;s plenty more to explore.
          </p>

          {/* Search — plain GET form, works without JS; /cities reads ?q= */}
          <form action="/cities" method="get" className="max-w-md mx-auto mb-12">
            <div className="relative">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
              <input
                type="search"
                name="q"
                placeholder="Search a city or country…"
                aria-label="Search destinations"
                className="w-full pl-11 pr-28 py-3.5 rounded-2xl bg-surface border border-border text-sm text-primary-text placeholder:text-muted focus:outline-none focus:border-accent/50 transition-colors"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 px-4 py-2 bg-accent text-white rounded-xl text-xs font-semibold hover:bg-accent/90 transition-colors"
              >
                Search
              </button>
            </div>
          </form>

          {/* Popular destinations */}
          <div className="text-left mb-10">
            <p className="text-xs font-bold uppercase tracking-widest text-accent mb-4 text-center">
              Popular Destinations
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {popular.map((city) => {
                const img = getCityImageUrl(city.slug, 'card');
                return (
                  <Link
                    key={city.slug}
                    href={`/cities/${city.slug}`}
                    className="group relative block overflow-hidden rounded-xl border border-border hover:border-accent/40 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/15"
                    style={{ aspectRatio: '4/3' }}
                  >
                    {img ? (
                      <SafeImage
                        src={img}
                        alt={`${city.name} travel guide`}
                        city={city.slug}
                        accentColor={city.accentColor}
                        fill
                        sizes="(max-width:640px) 50vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-elevated" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <p className="font-heading text-sm font-bold text-white leading-tight flex items-center gap-1">
                        <MapPin size={11} className="text-white/70" /> {city.name}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Trip planner + escape hatches */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/plan"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent text-white rounded-xl text-sm font-semibold hover:bg-accent/90 transition-colors shadow-lg shadow-accent/20"
            >
              <Compass size={14} /> Plan a Trip
            </Link>
            <Link
              href="/destinations"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-surface border border-border text-primary-text rounded-xl text-sm font-semibold hover:border-accent/40 transition-colors"
            >
              All Destinations <ArrowRight size={14} />
            </Link>
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}
