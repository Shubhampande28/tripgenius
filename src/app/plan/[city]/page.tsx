import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import TripBuilder from '@/components/plan/TripBuilder';
import { allCities, getCityBySlug, isIndexableCity } from '@/lib/cities';
import { cityHasMapBuilder } from '@/lib/mapUtils';
import type { City } from '@/lib/types';

const BASE = 'https://www.tripgenius.in';

function mapReadyCity(slug: string): City | undefined {
  const city = getCityBySlug(slug);
  return city && cityHasMapBuilder(city) ? city : undefined;
}

export function generateStaticParams() {
  return allCities.filter(cityHasMapBuilder).map((c) => ({ city: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ city: string }> }): Promise<Metadata> {
  const { city: slug } = await params;
  const city = mapReadyCity(slug);
  if (!city) return {};

  // No "| TripGenius" here — the root layout's title template appends it.
  const title = `Plan Your ${city.name} Trip — Pick Places on the Map`;
  const description = `Build a custom ${city.name} itinerary: browse the best things to do, pin your picks on an interactive map, and arrange them into a day-by-day plan — free, instant, no sign-up.`;

  return {
    title,
    description,
    alternates: { canonical: `${BASE}/plan/${slug}` },
    // The trip-builder tool stays available to users for every city, but only
    // index it for substantial cities — otherwise it's ~300 near-identical thin
    // tool pages, the same low-value pattern as the guide/best-time pages.
    ...(!isIndexableCity(city) && { robots: { index: false, follow: true } }),
    openGraph: {
      title,
      description,
      url: `${BASE}/plan/${slug}`,
      siteName: 'TripGenius',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default async function CityTripBuilderPage({ params }: { params: Promise<{ city: string }> }) {
  const { city: slug } = await params;
  const city = mapReadyCity(slug);
  if (!city) notFound();

  return (
    <>
      <Navbar />
      <main className="bg-dark min-h-screen">
        <div className="relative border-b border-border bg-surface overflow-hidden pt-24 pb-10">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_80%_at_50%_120%,rgba(255,107,53,0.08),transparent)]" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-dark border border-border text-xs font-medium text-muted mb-6">
              🗺️ Interactive map builder
            </div>
            <h1 className="font-heading text-4xl sm:text-5xl font-semibold text-primary-text">
              Plan Your {city.name} Trip
            </h1>
            <p className="mt-4 text-muted max-w-xl mx-auto">
              Browse the best things to do in {city.name}, add your picks, and watch them pin onto the map.
              Organize everything into a day-by-day itinerary as you go.
            </p>
          </div>
        </div>

        <TripBuilder city={city} />
      </main>
      <Footer />
    </>
  );
}
