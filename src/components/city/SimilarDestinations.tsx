import { City } from '@/lib/types';
import { getCityBySlug } from '@/lib/cities';
import { similarityMap } from '@/lib/similarity';
import SimilarDestinationCard from './SimilarDestinationCard';
import SimilarDestinationsAnalytics from './SimilarDestinationsAnalytics';

interface Props {
  city: City;
}

export default function SimilarDestinations({ city }: Props) {
  const results = similarityMap[city.slug];
  if (!results || results.length === 0) return null;

  const cards = results
    .map((r) => {
      const cityData = getCityBySlug(r.slug);
      return cityData ? { ...r, city: cityData } : null;
    })
    .filter((r): r is NonNullable<typeof r> => r !== null);

  if (cards.length === 0) return null;

  // Aggregate the top unique matched vibes to show in the header
  const headerVibes = Array.from(
    new Set(cards.flatMap((c) => c.matchedVibes)),
  ).slice(0, 4);

  return (
    <section id="similar-destinations" className="py-12 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section header */}
        <div className="mb-6">
          <p className="text-xs font-bold uppercase tracking-widest text-accent mb-1">
            Explore More
          </p>
          <h2 className="font-heading text-2xl font-semibold text-primary-text mb-3">
            You Might Also Like
          </h2>
          {headerVibes.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-muted">Based on:</span>
              {headerVibes.map((vibe) => (
                <span
                  key={vibe}
                  className="text-xs font-medium text-accent bg-accent/10 border border-accent/20 px-2.5 py-0.5 rounded-full"
                >
                  {vibe}
                </span>
              ))}
            </div>
          )}
        </div>

        {/*
          Mobile: horizontal scroll with 2.5 cards visible (scroll affordance).
          Desktop (sm+): 4-column grid.
          scrollbar-width: none hides the scrollbar on mobile for a cleaner look.
        */}
        <div
          className="flex gap-3 overflow-x-auto pb-2 sm:overflow-x-visible sm:grid sm:grid-cols-4 sm:gap-4 sm:pb-0"
          style={{ scrollbarWidth: 'none' }}
        >
          {cards.map((r, i) => (
            <div
              key={r.slug}
              className="flex-none w-[42vw] min-w-[130px] max-w-[200px] sm:w-auto sm:max-w-none"
            >
              <SimilarDestinationCard
                city={r.city}
                reason={r.reason}
                matchedVibes={r.matchedVibes}
                rank={i}
                score={r.score}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Client analytics island — renders null, zero DOM cost */}
      <SimilarDestinationsAnalytics
        sourceCitySlug={city.slug}
        recommendedSlugs={cards.map((r) => r.slug)}
      />
    </section>
  );
}
