'use client';

import { motion } from 'framer-motion';
import { Hotel, Plane, Ticket, Shield } from 'lucide-react';
import { City } from '@/lib/types';
import { hotelUrl, flightUrl, activitiesUrl, activitiesLabel } from '@/lib/affiliateLinks';

export default function BookingPanel({ city }: { city: City }) {
  const links = [
    {
      icon: Hotel,
      label: 'Hotels',
      sub: 'Free cancellation · Best price guarantee',
      href: hotelUrl(city.name),
      color: 'text-blue-400',
      bg: 'bg-blue-500/10 border-blue-500/20 hover:bg-blue-500/15',
      iconBg: 'bg-blue-500/20',
      provider: 'Booking.com',
    },
    {
      icon: Ticket,
      label: 'Tours & Activities',
      sub: `Top-rated experiences in ${city.name}`,
      href: activitiesUrl(city.slug, city.name),
      color: 'text-accent',
      bg: 'bg-accent/10 border-accent/20 hover:bg-accent/15',
      iconBg: 'bg-accent/20',
      provider: activitiesLabel(city.slug),
    },
    {
      icon: Plane,
      label: 'Flights',
      sub: 'Compare 500+ airlines for cheapest fares',
      href: flightUrl(city.name),
      color: 'text-teal',
      bg: 'bg-teal/10 border-teal/20 hover:bg-teal/15',
      iconBg: 'bg-teal/20',
      provider: 'Skyscanner',
    },
    {
      icon: Shield,
      label: 'Travel Insurance',
      sub: 'Medical, cancellation & baggage cover',
      href: 'https://www.worldnomads.com/',
      color: 'text-purple-400',
      bg: 'bg-purple-500/10 border-purple-500/20 hover:bg-purple-500/15',
      iconBg: 'bg-purple-500/20',
      provider: 'World Nomads',
    },
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="py-12 border-t border-border"
    >
      <div className="mb-6">
        <p className="text-xs font-bold uppercase tracking-widest text-accent mb-1">Ready to go?</p>
        <h2 className="font-heading text-2xl font-semibold text-primary-text">
          Plan &amp; Book Your {city.name} Trip
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {links.map(({ icon: Icon, label, sub, href, color, bg, iconBg, provider }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className={`flex items-center gap-4 p-4 rounded-xl border transition-all duration-200 group ${bg}`}
          >
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${iconBg}`}>
              <Icon size={20} className={color} />
            </div>
            <div className="flex-1 min-w-0">
              <p className={`font-semibold text-sm ${color}`}>{label}</p>
              <p className="text-xs text-muted mt-0.5 leading-snug">{sub}</p>
            </div>
            <span className="text-[10px] text-muted/60 font-medium flex-shrink-0">{provider}</span>
          </a>
        ))}
      </div>

      <p className="text-xs text-muted/40 mt-4 text-center">
        We may earn a commission if you book — at no extra cost to you. It helps keep TripGenius free.
      </p>
    </motion.section>
  );
}
