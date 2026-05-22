import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CityHero from '@/components/city/CityHero';
import AtAGlance from '@/components/city/AtAGlance';
import MonthByMonth from '@/components/city/MonthByMonth';
// New merged components (used for restructured pages)
import NeighbourhoodsAreas from '@/components/city/NeighbourhoodsAreas';
import GettingThereAround from '@/components/city/GettingThereAround';
// Legacy components (kept for old structure)
import ExploreByArea from '@/components/city/ExploreByArea';
import Neighbourhoods from '@/components/city/Neighbourhoods';
import BudgetBreakdown from '@/components/city/BudgetBreakdown';
import GettingThere from '@/components/city/GettingThere';
import ThingsToDo from '@/components/city/ThingsToDo';
import OffbeatPlaces from '@/components/city/OffbeatPlaces';
import WhereToStay from '@/components/city/WhereToStay';
import WhereToEat from '@/components/city/WhereToEat';
import GettingAround from '@/components/city/GettingAround';
import ProTips from '@/components/city/ProTips';
import CitySidebar from '@/components/city/CitySidebar';
import { getCityBySlug, getAllCitySlugs } from '@/lib/cities';

export async function generateStaticParams() {
  return getAllCitySlugs().map((slug) => ({ slug }));
}

export async function generateMetadata(
  props: PageProps<'/cities/[slug]'>
): Promise<Metadata> {
  const { slug } = await props.params;
  const city = getCityBySlug(slug);
  if (!city) return { title: 'City Not Found' };
  const title = `${city.name} Travel Guide ${city.flag} — Best Time, Budget & Things To Do`;
  const description = `Complete ${city.name} travel guide: best time to visit (${city.stats.bestTime}), daily budget (${city.stats.budget}), top things to do, neighbourhoods, and hidden gems. Free, expert travel advice.`;
  const ogImage = city.heroImage || city.image || 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1600&q=85';
  return {
    title,
    description,
    keywords: [
      `${city.name} travel guide`, `visit ${city.name}`, `things to do in ${city.name}`,
      `best time to visit ${city.name}`, `${city.name} budget`, `${city.country} travel`,
      `${city.name} itinerary`, `${city.name} tips`,
    ],
    alternates: { canonical: `https://www.tripgenius.in/cities/${slug}` },
    openGraph: {
      title,
      description,
      url: `https://www.tripgenius.in/cities/${slug}`,
      images: [{ url: ogImage, width: 1600, height: 900, alt: `${city.name} travel guide` }],
    },
    twitter: { card: 'summary_large_image', title, description },
  };
}

/** Cities using the NEW restructured layout */
const REDESIGNED_SLUGS = new Set(['bali']);

function CityJsonLd({ city, slug }: { city: ReturnType<typeof getCityBySlug> & object; slug: string }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TouristDestination',
    name: city.name,
    description: city.description,
    url: `https://www.tripgenius.in/cities/${slug}`,
    image: city.heroImage,
    touristType: city.vibes,
    geo: { '@type': 'GeoCoordinates' },
    containedInPlace: { '@type': 'Country', name: city.country },
    isAccessibleForFree: true,
    publisher: {
      '@type': 'Organization',
      name: 'TripGenius',
      url: 'https://www.tripgenius.in',
    },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export default async function CityPage(props: PageProps<'/cities/[slug]'>) {
  const { slug } = await props.params;
  const city = getCityBySlug(slug);
  if (!city) notFound();

  /* ── NEW 9-section layout (Bali demo) ──────────────────────── */
  if (REDESIGNED_SLUGS.has(slug)) {
    return (
      <>
        <CityJsonLd city={city} slug={slug} />
        <Navbar />
        <main className="bg-dark">
          {/* 1. Hero */}
          <CityHero city={city} />

          {/* 2. At a Glance */}
          <AtAGlance city={city} />

          {/* 3. Best Time to Visit */}
          <MonthByMonth city={city} />

          {/* 4. Neighbourhoods (merged with area spots) */}
          <NeighbourhoodsAreas city={city} />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-12">
              <div>
                {/* 5. Things To Do */}
                <ThingsToDo city={city} />

                {/* 6. Offbeat Places */}
                <OffbeatPlaces city={city} />

                {/* 7. Budget Breakdown */}
                <BudgetBreakdown city={city} />

                {/* 8. Where to Eat */}
                <WhereToEat city={city} />
              </div>

              {/* Sidebar */}
              <div className="lg:sticky lg:top-24 lg:self-start">
                <CitySidebar city={city} />
              </div>
            </div>
          </div>

          {/* 9. Getting There & Around — full width */}
          <GettingThereAround city={city} />
        </main>
        <Footer />
      </>
    );
  }

  /* ── OLD layout (all other cities, unchanged) ───────────────── */
  return (
    <>
      <CityJsonLd city={city} slug={slug} />
      <Navbar />
      <main className="bg-dark">
        <CityHero city={city} />
        <AtAGlance city={city} />
        <MonthByMonth city={city} />
        <ExploreByArea city={city} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-12">
            <div>
              <Neighbourhoods city={city} />
              <ThingsToDo city={city} />
              <OffbeatPlaces city={city} />
              <BudgetBreakdown city={city} />
              <WhereToStay city={city} />
              <WhereToEat city={city} />
              <GettingThere city={city} />
              <GettingAround city={city} />
              <ProTips city={city} />
            </div>
            <div className="lg:sticky lg:top-24 lg:self-start">
              <CitySidebar city={city} />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
