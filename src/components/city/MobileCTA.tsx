'use client';

import { useState, useEffect } from 'react';
import { hotelUrl, flightUrl } from '@/lib/affiliateLinks';
import { City } from '@/lib/types';
import { Hotel, Plane } from 'lucide-react';

export default function MobileCTA({ city }: { city: City }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handler = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden">
      <div className="bg-dark/95 backdrop-blur-md border-t border-border px-4 py-3 flex gap-3 safe-area-inset-bottom">
        <a
          href={hotelUrl(city.name)}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="flex-1 flex items-center justify-center gap-2 bg-accent text-white rounded-xl py-3 text-sm font-semibold"
        >
          <Hotel size={15} />
          Book Hotels
        </a>
        <a
          href={flightUrl(city.name)}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="flex-1 flex items-center justify-center gap-2 bg-surface border border-border text-primary-text rounded-xl py-3 text-sm font-semibold"
        >
          <Plane size={15} />
          Find Flights
        </a>
      </div>
    </div>
  );
}
