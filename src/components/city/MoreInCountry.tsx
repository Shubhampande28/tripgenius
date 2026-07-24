import Link from 'next/link';
import { ArrowRight, MapPin } from 'lucide-react';
import { getCountryBySlug } from '@/data/countries';
import { getCityBySlug } from '@/lib/cities';
import { getCityImageUrl } from '@/lib/cityImages';
import SafeImage from '@/components/SafeImage';
import { City } from '@/lib/types';

// "More in {Country}" — links 4–6 sibling city guides plus the country hub.
// Internal-linking module: keeps link equity flowing between the cities of a
// country and up to the hub page.
export default function MoreInCountry({ city, countrySlug }: { city: City; countrySlug?: string }) {
  if (!countrySlug) return null;
  const country = getCountryBySlug(countrySlug);
  if (!country) return null;

  const siblings = country.cities
    .filter((s) => s !== city.slug)
    .map((s) => getCityBySlug(s))
    .filter((c): c is City => c !== undefined)
    .slice(0, 6);
  return (
    <section id="more-in-country" className="py-8 border-t border-border">
      <div className="flex items-end justify-between mb-5">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-accent mb-1">Keep Exploring</p>
          <h2 className="font-heading text-2xl font-semibold text-primary-text">
            More in {country.name}
          </h2>
        </div>
        <Link
          href={`/countries/${countrySlug}`}
          className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-accent hover:underline flex-shrink-0 ml-4"
        >
          {country.name} guide <ArrowRight size={12} />
        </Link>
      </div>

      {siblings.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {siblings.map((sibling) => {
          const img = getCityImageUrl(sibling.slug, 'card');
          return (
            <Link
              key={sibling.slug}
              href={`/cities/${sibling.slug}`}
              className="group relative block overflow-hidden rounded-xl border border-border hover:border-accent/40 card-lift"
              style={{ aspectRatio: '4/3' }}
            >
              {img ? (
                <SafeImage
                  src={img}
                  alt={`${sibling.name} travel guide`}
                  city={sibling.slug}
                  accentColor={sibling.accentColor}
                  fill
                  sizes="(max-width:640px) 50vw, 33vw"
                  className="object-cover card-img"
                />
              ) : (
                <div
                  className="absolute inset-0"
                  style={{ background: `linear-gradient(135deg, ${sibling.accentColor ?? '#dc2626'}30, ${sibling.accentColor ?? '#dc2626'}70)` }}
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <p className="font-heading text-sm font-bold text-white leading-tight">{sibling.name}</p>
                <p className="text-white/60 text-[11px] mt-0.5 line-clamp-1">{sibling.tagline}</p>
              </div>
            </Link>
          );
          })}
        </div>
      ) : (
        <Link
          href={`/countries/${countrySlug}`}
          className="group flex items-center justify-between gap-4 rounded-2xl border border-border bg-surface p-5 hover:border-accent/40 card-lift"
        >
          <div>
            <p className="font-heading text-lg font-bold text-primary-text group-hover:text-accent transition-colors">
              Explore the complete {country.name} guide
            </p>
            <p className="text-sm text-muted mt-1">
              Visa information, seasonal guidance, budgets, itineraries, and related destinations.
            </p>
          </div>
          <ArrowRight size={18} className="text-accent flex-shrink-0" />
        </Link>
      )}

      <Link
        href={`/countries/${countrySlug}`}
        className="sm:hidden inline-flex items-center gap-1.5 mt-4 text-xs font-semibold text-accent hover:underline"
      >
        <MapPin size={12} /> Full {country.name} guide
      </Link>
    </section>
  );
}
