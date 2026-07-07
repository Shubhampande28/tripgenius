import Link from 'next/link';
import SafeImage from '@/components/SafeImage';
import { getCityImageUrl } from '@/lib/cityImages';
import { City } from '@/lib/types';
import Flag from '@/components/Flag';

interface Props {
  city: City;
  reason: string;
  matchedVibes: string[];
  rank: number;
  score: number;
}

export default function SimilarDestinationCard({ city, reason, matchedVibes, rank, score }: Props) {
  const imageUrl    = getCityImageUrl(city.slug, 'card') ?? city.image;
  const visibleVibes = matchedVibes.slice(0, 2);

  return (
    <article className="flex flex-col">
      <Link
        href={`/cities/${city.slug}`}
        data-city-slug={city.slug}
        data-rank={rank}
        data-score={score.toFixed(1)}
        className="group block rounded-2xl overflow-hidden card-lift focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
      >
        <div className="relative" style={{ aspectRatio: '4/5' }}>
          <SafeImage
            src={imageUrl}
            alt={`${city.name} travel guide`}
            city={city.slug}
            accentColor={city.accentColor}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover card-img"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-3">
            <p className="text-[9px] font-semibold text-white/55 uppercase tracking-wider mb-0.5">
              <Flag emoji={city.flag} /> {city.country}
            </p>
            <p className="font-heading text-base font-bold text-white group-hover:text-accent transition-colors leading-tight">
              {city.name}
              <span className="sr-only"> travel guide</span>
            </p>
            {city.stats?.bestTime && (
              <p className="text-[10px] text-white/55 mt-0.5">
                Best: <span className="text-accent">{city.stats.bestTime}</span>
              </p>
            )}
          </div>
        </div>
      </Link>

      <div className="pt-2 px-0.5">
        {city.stats?.budget && (
          <p className="text-[10px] text-muted/60 mb-1">{city.stats.budget}</p>
        )}
        {visibleVibes.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-1">
            {visibleVibes.map((vibe) => (
              <span
                key={vibe}
                className="text-[10px] font-semibold text-accent bg-accent/10 border border-accent/20 px-2 py-0.5 rounded-full"
              >
                {vibe}
              </span>
            ))}
          </div>
        )}
        <p className="text-[11px] text-muted leading-snug">{reason}</p>
      </div>
    </article>
  );
}
