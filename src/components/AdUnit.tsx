'use client';

import { useEffect, useRef } from 'react';
import { ADSENSE_PUB_ID } from '@/lib/adsense';

interface AdUnitProps {
  slot: string;
  format?: 'auto' | 'rectangle' | 'horizontal' | 'vertical' | 'fluid';
  layout?: string;
  className?: string;
}

declare global {
  interface Window {
    adsbygoogle: Record<string, unknown>[];
  }
}

export default function AdUnit({ slot, format = 'auto', layout, className = '' }: AdUnitProps) {
  const pushed = useRef(false);

  useEffect(() => {
    if (!ADSENSE_PUB_ID || pushed.current) return;
    pushed.current = true;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {}
  }, []);

  if (!ADSENSE_PUB_ID) return null;

  return (
    <div className={`overflow-hidden ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={ADSENSE_PUB_ID}
        data-ad-slot={slot}
        data-ad-format={format}
        {...(layout ? { 'data-ad-layout': layout } : {})}
        data-full-width-responsive="true"
      />
    </div>
  );
}
