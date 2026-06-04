'use client';

import dynamic from 'next/dynamic';
import MapSkeleton from './MapSkeleton';
import { City } from '@/lib/types';

// next/dynamic with ssr:false must live in a Client Component in Next.js 16+.
// This thin wrapper is the client boundary; CityMap itself also has 'use client'.
const CityMap = dynamic(() => import('./CityMap'), {
  ssr: false,
  loading: () => <MapSkeleton />,
});

export default function CityMapWrapper({ city }: { city: City }) {
  return <CityMap city={city} />;
}
