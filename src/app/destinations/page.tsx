// Server component — fully rendered HTML, Google crawls every link perfectly
import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { allCities } from '@/lib/cities';

export const metadata: Metadata = {
  title: 'All Travel Destinations — 160+ Free City Guides | TripGenius',
  description: 'Browse free travel guides for 160+ destinations across India, Asia, Europe and the Americas. Find things to do, best time to visit, budget tips and hidden gems.',
  alternates: { canonical: 'https://www.tripgenius.in/destinations' },
};

// Group cities by region
const REGIONS: Record<string, string[]> = {
  'India — Golden Triangle':   ['delhi','agra','jaipur'],
  'India — Rajasthan':         ['udaipur','jodhpur','jaisalmer','bikaner','pushkar','ranthambore'],
  'India — Himalayas':         ['manali','shimla','rishikesh','darjeeling','ladakh','spiti','kasol','dharamshala','nainital','mussoorie'],
  'India — South':             ['goa','mumbai','kochi','bengaluru','mysuru','hampi','munnar','alleppey','pondicherry','madurai','ooty','mahabalipuram','tirupati','kanyakumari','coorg','varkala','gokarna','thekkady','hyderabad','chennai','thanjavur','trichy','wayanad'],
  'India — East & North-East': ['varanasi','kolkata','amritsar','khajuraho','puri','bhopal','aurangabad','lucknow'],
  'India — Gujarat & West':    ['ahmedabad','vadodara'],
  'India — Islands':           ['andaman'],
  'Asia — Southeast':          ['bali','bangkok','singapore','phuket','chiang-mai','hanoi','ho-chi-minh'],
  'Asia — East':               ['tokyo','kyoto','seoul','hong-kong'],
  'Asia — Middle East':        ['dubai','istanbul'],
  'Europe':                    ['paris','london','barcelona','rome','amsterdam','prague','lisbon','athens','budapest'],
  'Americas & Others':         ['new-york','rio-de-janeiro','buenos-aires','mexico-city','cusco','marrakech','cape-town','maldives','santorini'],
};

export default function DestinationsPage() {
  const cityMap = Object.fromEntries(allCities.map(c => [c.slug, c]));

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header */}
          <div className="mb-12 text-center">
            <h1 className="font-heading text-4xl sm:text-5xl font-bold text-primary-text mb-4">
              All Travel Destinations
            </h1>
            <p className="text-muted text-lg max-w-2xl mx-auto">
              Free travel guides for 160+ cities worldwide — things to do, best time to visit,
              budget breakdown and hidden gems.
            </p>
          </div>

          {/* Region groups */}
          {Object.entries(REGIONS).map(([region, slugs]) => {
            const cities = slugs.map(s => cityMap[s]).filter(Boolean);
            if (cities.length === 0) return null;
            return (
              <section key={region} className="mb-10">
                <h2 className="font-heading text-xl font-semibold text-accent mb-4 pb-2 border-b border-border">
                  {region}
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                  {cities.map(city => (
                    <Link
                      key={city.slug}
                      href={`/cities/${city.slug}`}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border hover:border-accent/40 hover:bg-surface transition-colors text-sm"
                    >
                      <span className="text-base">{city.flag}</span>
                      <span className="text-primary-text truncate">{city.name}</span>
                    </Link>
                  ))}
                </div>
              </section>
            );
          })}

          {/* Remaining cities not in regions */}
          <section className="mb-10">
            <h2 className="font-heading text-xl font-semibold text-accent mb-4 pb-2 border-b border-border">
              More Destinations
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
              {allCities
                .filter(c => !c.stub && !Object.values(REGIONS).flat().includes(c.slug))
                .map(city => (
                  <Link
                    key={city.slug}
                    href={`/cities/${city.slug}`}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border hover:border-accent/40 hover:bg-surface transition-colors text-sm"
                  >
                    <span className="text-base">{city.flag}</span>
                    <span className="text-primary-text truncate">{city.name}</span>
                  </Link>
                ))}
            </div>
          </section>

        </div>
      </main>
      <Footer />
    </>
  );
}
