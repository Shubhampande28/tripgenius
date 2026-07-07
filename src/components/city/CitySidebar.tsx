import Link from 'next/link';
import { Plane, Hotel, Globe, Clock, Coins, MapPin, Tag, Ticket } from 'lucide-react';
import { City } from '@/lib/types';
import { cities } from '@/lib/cities';
import { hotelUrl, flightUrl, activitiesUrl, activitiesLabel } from '@/lib/affiliateLinks';
import Flag from '@/components/Flag';

export default function CitySidebar({ city }: { city: City }) {
  const otherCities = cities.filter((c) => c.slug !== city.slug).slice(0, 4);

  return (
    <aside className="space-y-6">
      {/* Quick facts */}
      <div className="bg-surface border border-border rounded-2xl p-5">
        <h3 className="font-heading text-xl font-semibold text-primary-text mb-4">Quick Facts</h3>
        <div className="space-y-3">
          {[
            { icon: Globe, label: 'Country', value: city.country },
            { icon: Clock, label: 'Best Time', value: city.stats.bestTime },
            { icon: Coins, label: 'Currency', value: city.stats.currency },
            { icon: MapPin, label: 'Language', value: city.stats.language },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
              <div className="flex items-center gap-2">
                <Icon size={13} className="text-muted" />
                <span className="text-xs text-muted">{label}</span>
              </div>
              <span className="text-xs font-medium text-primary-text text-right max-w-[130px]">{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Book your trip — affiliate CTAs */}
      <div className="bg-surface border border-border rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Tag size={15} className="text-accent" />
          <h3 className="font-heading text-xl font-semibold text-primary-text">Book Your Trip</h3>
        </div>
        <div className="space-y-3">
          <a
            href={hotelUrl(city.name)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3.5 rounded-xl bg-accent/10 border border-accent/20 hover:bg-accent/20 transition-all duration-200 group"
          >
            <div className="w-9 h-9 rounded-lg bg-accent/20 flex items-center justify-center flex-shrink-0">
              <Hotel size={16} className="text-accent" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-primary-text group-hover:text-accent transition-colors">
                Hotels in {city.name}
              </p>
              <p className="text-xs text-muted">Best rates · Free cancellation</p>
            </div>
          </a>

          <a
            href={activitiesUrl(city.slug, city.name)}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="flex items-center gap-3 p-3.5 rounded-xl bg-accent/10 border border-accent/20 hover:bg-accent/20 transition-all duration-200 group"
          >
            <div className="w-9 h-9 rounded-lg bg-accent/20 flex items-center justify-center flex-shrink-0">
              <Ticket size={16} className="text-accent" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-primary-text group-hover:text-accent transition-colors">
                Tours &amp; Activities
              </p>
              <p className="text-xs text-muted">{activitiesLabel(city.slug)} · 8% off</p>
            </div>
          </a>

          <a
            href={flightUrl(city.name)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3.5 rounded-xl bg-teal/10 border border-teal/20 hover:bg-teal/20 transition-all duration-200 group"
          >
            <div className="w-9 h-9 rounded-lg bg-teal/20 flex items-center justify-center flex-shrink-0">
              <Plane size={16} className="text-teal" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-primary-text group-hover:text-teal transition-colors">
                Flights to {city.name}
              </p>
              <p className="text-xs text-muted">Compare 500+ airlines</p>
            </div>
          </a>
        </div>

        <p className="text-xs text-muted/50 mt-3 text-center">
          We may earn a small commission — at no cost to you.
        </p>
      </div>

      {/* More destinations */}
      <div className="bg-surface border border-border rounded-2xl p-5">
        <h3 className="font-heading text-lg font-semibold text-primary-text mb-4">
          More Destinations
        </h3>
        <div className="space-y-1">
          {otherCities.map((c) => (
            <Link
              key={c.slug}
              href={`/cities/${c.slug}`}
              className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-elevated transition-colors group"
            >
              <span className="text-lg"><Flag emoji={c.flag} /></span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-primary-text group-hover:text-accent transition-colors truncate">
                  {c.name}
                </p>
                <p className="text-xs text-muted truncate">{c.country}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
}
