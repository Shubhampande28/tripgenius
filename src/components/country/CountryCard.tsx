import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { CountryData } from '@/data/countries';
import { getCityImageUrl } from '@/lib/cityImages';
import Flag from '@/components/Flag';

// Canonical country card — previously forked into CountriesExplorer's rich
// grid card, a simpler "compact" featured-strip card, and a third bespoke
// minimal card on the country detail page's "Related Countries" section.
// One component, one visual language, everywhere a country gets represented
// as a card.

const CONTINENT_COLORS: Record<string, { text: string; bg: string; border: string; bar: string }> = {
  Asia:     { text: 'text-teal',        bg: 'bg-teal/10',        border: 'border-teal/30',        bar: 'bg-teal' },
  Europe:   { text: 'text-blue-400',    bg: 'bg-blue-400/10',    border: 'border-blue-400/30',    bar: 'bg-blue-400' },
  Africa:   { text: 'text-amber-400',   bg: 'bg-amber-400/10',   border: 'border-amber-400/30',   bar: 'bg-amber-400' },
  Americas: { text: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/30', bar: 'bg-emerald-400' },
  Oceania:  { text: 'text-sky-400',     bg: 'bg-sky-400/10',     border: 'border-sky-400/30',     bar: 'bg-sky-400' },
};

export function visaInfo(visa: string): { label: string; dot: string; cls: string } {
  const v = visa.toLowerCase();
  if (v.includes('no visa') || v.includes('visa-free'))
    return { label: 'Visa-free', dot: '✓', cls: 'text-teal bg-teal/10 border-teal/30' };
  if (v.includes('on arrival'))
    return { label: 'Visa on arrival', dot: '●', cls: 'text-amber-400 bg-amber-400/10 border-amber-400/30' };
  if (v.includes('e-visa'))
    return { label: 'E-visa', dot: '●', cls: 'text-blue-400 bg-blue-400/10 border-blue-400/30' };
  return { label: 'Visa required', dot: '○', cls: 'text-muted bg-elevated border-border' };
}

interface CountryCardProps {
  country: CountryData;
  /** grid = full stats+visa card (default); compact = smaller featured-strip card. */
  variant?: 'grid' | 'compact';
}

export default function CountryCard({ country, variant = 'grid' }: CountryCardProps) {
  const visa   = visaInfo(country.visaForIndians);
  const cc     = CONTINENT_COLORS[country.continent];
  const imgUrl = country.cities.length > 0 ? getCityImageUrl(country.cities[0], 'card') : null;

  if (variant === 'compact') {
    return (
      <Link
        href={`/countries/${country.slug}`}
        className="group relative overflow-hidden bg-surface border border-border hover:border-accent/50 rounded-2xl card-lift"
      >
        <div className="relative h-36 overflow-hidden">
          {imgUrl ? (
            <img
              src={imgUrl}
              alt={`${country.name} travel guide — top cities and best time to visit`}
              loading="lazy"
              className="w-full h-full object-cover card-img"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-surface to-elevated flex items-center justify-center">
              <span className="text-5xl"><Flag emoji={country.flag} /></span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
          <div className="absolute bottom-2.5 left-3 right-3">
            <div className="flex items-center gap-1.5">
              <span className="text-xl"><Flag emoji={country.flag} /></span>
              <h3 className="font-heading text-sm font-bold text-white group-hover:text-teal-200 transition-colors leading-tight truncate">
                {country.name}
              </h3>
            </div>
          </div>
        </div>
        <div className="p-3">
          <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${visa.cls}`}>
            {visa.dot} {visa.label}
          </span>
          <div className="mt-2.5 flex items-center gap-1 text-xs font-semibold text-accent">
            <span>{country.cities.length} {country.cities.length === 1 ? 'city' : 'cities'}</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/countries/${country.slug}`}
      className="group flex flex-col bg-surface border border-border hover:border-accent/40 rounded-2xl overflow-hidden card-lift"
    >
      <div className="relative h-44 overflow-hidden flex-shrink-0">
        {imgUrl ? (
          <img
            src={imgUrl}
            alt={`${country.name} travel guide`}
            loading="lazy"
            className="w-full h-full object-cover card-img"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-surface to-elevated flex items-center justify-center">
            <span className="text-6xl"><Flag emoji={country.flag} /></span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
        <div className={`absolute top-0 left-0 right-0 h-0.5 ${cc?.bar ?? 'bg-muted/30'}`} />
        <span className={`absolute top-2.5 right-2.5 text-[9px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full bg-black/50 backdrop-blur-sm ${cc?.text ?? 'text-white/70'}`}>
          {country.continent}
        </span>
        <div className="absolute bottom-3 left-4 right-4">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-2xl leading-none"><Flag emoji={country.flag} /></span>
            <h3 className="font-heading text-base font-bold text-white group-hover:text-teal-200 transition-colors leading-tight">
              {country.name}
            </h3>
          </div>
          <p className="text-xs text-white/60 ml-8">{country.capital}</p>
        </div>
      </div>

      <div className="p-4 flex flex-col flex-1">
        <div className="space-y-1.5 mb-3 text-xs">
          {[
            { label: 'Best time', value: country.bestTime },
            { label: 'Currency',  value: country.currency },
            { label: 'Language',  value: country.language },
          ].map((s) => (
            <div key={s.label} className="flex items-center justify-between gap-4">
              <span className="text-muted flex-shrink-0">{s.label}</span>
              <span className="font-medium text-primary-text text-right truncate">{s.value}</span>
            </div>
          ))}
        </div>

        <span className={`self-start text-xs font-semibold px-2.5 py-1 rounded-full border ${visa.cls} mb-3`}>
          {visa.dot} {visa.label}
        </span>

        <div className="mt-auto pt-3 border-t border-border flex items-center justify-between">
          <span className="text-xs text-muted">
            {country.cities.length} {country.cities.length === 1 ? 'city' : 'cities'}
          </span>
          <span className="text-xs font-semibold text-accent inline-flex items-center gap-1 group-hover:gap-1.5 transition-all">
            Explore <ArrowRight className="w-3 h-3" />
          </span>
        </div>
      </div>
    </Link>
  );
}
