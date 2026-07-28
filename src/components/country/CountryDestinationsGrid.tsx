'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Clock, MapPin } from 'lucide-react';
import type { CountryData } from '@/data/countries';
import SafeImage from '@/components/SafeImage';
import { getCityImageUrl } from '@/lib/cityImages';
import type { City } from '@/lib/types';

// Region section header accent palette — regions (unlike city `areas`) don't
// carry their own accentColor, so we cycle a small fixed palette by index,
// matching the visual language of ExploreByArea's per-area header.
const REGION_COLORS = ['#DC2626', '#0D9488', '#D97706', '#2563EB', '#7C3AED', '#DB2777'];

interface CountryDestinationsGridProps {
  country: CountryData;
  cities: City[]; // page's rankedCities — already priority-sorted for India
  countrySlug: string;
}

interface RegionGroup {
  name: string;
  slug: string;
  color: string;
  cityObjs: City[];
}

export default function CountryDestinationsGrid({ country, cities, countrySlug }: CountryDestinationsGridProps) {
  const cityMap = new Map(cities.map((c) => [c.slug, c]));

  const regionGroups: RegionGroup[] = (country.regions ?? [])
    .map((region, i) => ({
      name: region.name,
      slug: region.slug,
      color: REGION_COLORS[i % REGION_COLORS.length],
      cityObjs: region.cities.map((s) => cityMap.get(s)).filter((c): c is City => Boolean(c)),
    }))
    .filter((r) => r.cityObjs.length > 0);

  const usedSlugs = new Set(regionGroups.flatMap((r) => r.cityObjs.map((c) => c.slug)));
  const leftover = cities.filter((c) => !usedSlugs.has(c.slug));

  const hasRegions = regionGroups.length > 0;

  return (
    <div className="space-y-12">
      {!hasRegions && (
        <FlatSection
          cities={cities}
          heading={`Best Places to Visit in ${country.name}`}
          label={`${cities.length} ${cities.length === 1 ? 'destination' : 'destinations'}`}
          sub="City guides with things to do, honest costs, and local tips"
          cap={12}
          featureFirst
        />
      )}

      {hasRegions && (
        <>
          {regionGroups.map((region, i) => (
            <RegionSection key={region.slug} region={region} featureFirst={i === 0} />
          ))}
          {leftover.length > 0 && (
            <FlatSection
              cities={leftover}
              heading={`More Across ${country.name}`}
              label={`${leftover.length} more ${leftover.length === 1 ? 'destination' : 'destinations'}`}
              cap={12}
              featureFirst={false}
            />
          )}
        </>
      )}
    </div>
  );
}

// ── Region section ──────────────────────────────────────────────────────────
function RegionSection({ region, featureFirst }: { region: RegionGroup; featureFirst: boolean }) {
  const [expanded, setExpanded] = useState(false);
  const CAP = 6;
  const shown = expanded ? region.cityObjs : region.cityObjs.slice(0, CAP);
  const hasMore = region.cityObjs.length > CAP;

  return (
    <section>
      <div className="flex items-center gap-3 mb-6">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 border"
          style={{ backgroundColor: `${region.color}15`, borderColor: `${region.color}30` }}
        >
          <MapPin size={15} style={{ color: region.color }} />
        </div>
        <div>
          <h3 className="font-heading text-xl font-bold text-primary-text leading-tight">
            {region.name}
          </h3>
          <p className="text-xs text-muted">
            {region.cityObjs.length} {region.cityObjs.length === 1 ? 'destination' : 'destinations'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {shown.map((city, idx) => (
          <DestinationCard key={city.slug} city={city} featured={featureFirst && idx === 0} />
        ))}
      </div>

      {hasMore && !expanded && (
        <div className="mt-5 text-center">
          <button
            onClick={() => setExpanded(true)}
            className="inline-flex items-center gap-2 text-sm font-medium text-accent hover:underline"
          >
            Show all {region.cityObjs.length} in {region.name} <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </section>
  );
}

// ── Flat section (no regions, or leftover cities) ──────────────────────────
function FlatSection({
  cities, heading, label, sub, cap, featureFirst,
}: {
  cities: City[]; heading: string; label: string; sub?: string; cap: number; featureFirst: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const shown = expanded ? cities : cities.slice(0, cap);
  const hasMore = cities.length > cap;

  return (
    <section>
      <div className="mb-8">
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-accent mb-2">{label}</p>
        <h2 className="font-heading text-2xl sm:text-3xl font-bold text-primary-text leading-tight">{heading}</h2>
        {sub && <p className="text-sm text-muted mt-1.5">{sub}</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {shown.map((city, idx) => (
          <DestinationCard key={city.slug} city={city} featured={featureFirst && idx === 0 && shown.length >= 3} />
        ))}
      </div>

      {hasMore && !expanded && (
        <div className="mt-6 text-center">
          <button
            onClick={() => setExpanded(true)}
            className="inline-flex items-center gap-2 text-sm font-medium text-accent hover:underline"
          >
            Show all {cities.length} destinations <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </section>
  );
}

// ── Destination card ────────────────────────────────────────────────────────
function DestinationCard({ city, featured }: { city: City; featured?: boolean }) {
  const imgSrc = getCityImageUrl(city.slug, 'card');
  return (
    <Link
      href={`/cities/${city.slug}`}
      className={`group relative block overflow-hidden rounded-2xl border border-border hover:border-accent/40 card-lift ${featured ? 'sm:col-span-2 lg:col-span-1' : ''}`}
      style={{ aspectRatio: featured ? '16/9' : '4/3' }}
    >
      {imgSrc ? (
        <SafeImage
          src={imgSrc}
          alt={`${city.name} — ${city.tagline}`}
          city={city.slug}
          accentColor={city.accentColor}
          fill
          sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
          className="object-cover card-img"
        />
      ) : (
        <div
          className="absolute inset-0"
          style={{ background: `linear-gradient(135deg, ${city.accentColor ?? '#dc2626'}30, ${city.accentColor ?? '#dc2626'}70)` }}
        />
      )}

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/92 via-black/25 to-transparent" />

      {/* Top chips */}
      <div className="absolute top-3 right-3 flex gap-1.5">
        <span className="text-[10px] font-semibold px-2 py-1 rounded-full bg-black/55 backdrop-blur-sm text-white/80 border border-white/10">
          <Clock className="w-2.5 h-2.5 inline mr-0.5 -mt-0.5" />{city.stats.bestTime}
        </span>
      </div>

      {/* Hover: things count */}
      {city.thingsToDo && city.thingsToDo.length > 0 && (
        <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-black/55 backdrop-blur-sm text-white/80 border border-white/10">
            {city.thingsToDo.length} things to do
          </span>
        </div>
      )}

      {/* Bottom content */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <h3 className="font-heading text-xl font-bold text-white mb-1 leading-tight tracking-tight">
          {city.name}
        </h3>
        <p className="text-white/60 text-xs leading-snug mb-3 line-clamp-1">
          {city.tagline}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-1.5">
            {city.vibes.slice(0, 2).map((v) => (
              <span key={v}
                className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 backdrop-blur-sm text-white/75 border border-white/12">
                {v}
              </span>
            ))}
            {city.stats.budget && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-accent/30 backdrop-blur-sm text-white/80 border border-accent/25">
                {city.stats.budget}
              </span>
            )}
          </div>
          <span className="flex items-center gap-1 text-xs font-semibold text-white/80 group-hover:text-white group-hover:gap-1.5 transition-all">
            Guide <ArrowRight className="w-3 h-3" />
          </span>
        </div>
      </div>
    </Link>
  );
}
