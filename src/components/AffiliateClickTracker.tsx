'use client';

import { useEffect } from 'react';
import { trackEvent } from '@/lib/analytics';

// Booking/flight/tours links live on server components (BookingPanel,
// CitySidebar, GettingThere, WhereToStay, blog post page) so they can't
// attach an onClick handler directly without converting each one to a client
// component. Event delegation from one client-side listener avoids that:
// each outbound anchor just carries plain data-* attributes, and this single
// mounted-once listener fires a comparable "affiliate_click" GA4 event for
// all of them, with which partner/destination/page section actually got clicked.
export default function AffiliateClickTracker() {
  useEffect(() => {
    function onClick(e: MouseEvent) {
      const target = (e.target as HTMLElement)?.closest?.('[data-affiliate-partner]') as HTMLElement | null;
      if (!target) return;
      trackEvent('affiliate_click', {
        partner: target.getAttribute('data-affiliate-partner') ?? '',
        destination: target.getAttribute('data-affiliate-destination') ?? '',
        page_type: target.getAttribute('data-affiliate-page-type') ?? '',
        placement: target.getAttribute('data-affiliate-placement') ?? '',
      });
    }
    document.addEventListener('click', onClick, { capture: true });
    return () => document.removeEventListener('click', onClick, { capture: true });
  }, []);

  return null;
}
