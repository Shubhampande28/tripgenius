'use client';

import dynamic from 'next/dynamic';
import { ThingToDo, Coordinates } from '@/lib/types';
import type { PinMeta } from './TripBuilderMap';

// next/dynamic with ssr:false must live in a Client Component — this thin
// wrapper is the client boundary; TripBuilderMap itself also has 'use client'.
const TripBuilderMap = dynamic(() => import('./TripBuilderMap'), {
  ssr: false,
  loading: () => (
    <div className="h-[420px] sm:h-[560px] w-full rounded-2xl bg-elevated border border-border flex items-center justify-center">
      <span className="text-sm font-medium text-muted/60">Loading map…</span>
    </div>
  ),
});

interface Props {
  things: ThingToDo[];
  pinMeta: Map<string, PinMeta>;
  center: Coordinates;
  activeDay: number;
  onTogglePin: (name: string) => void;
}

export default function TripBuilderMapWrapper(props: Props) {
  return <TripBuilderMap {...props} />;
}
