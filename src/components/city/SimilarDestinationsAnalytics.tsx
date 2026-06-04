'use client';

import { useEffect } from 'react';
import { trackEvent } from '@/lib/analytics';

interface Props {
  sourceCitySlug: string;
  recommendedSlugs: string[];
}

export default function SimilarDestinationsAnalytics({ sourceCitySlug, recommendedSlugs }: Props) {
  useEffect(() => {
    const section = document.getElementById('similar-destinations');
    if (!section) return;

    // Fire once when 30% of the section enters the viewport
    let impressed = false;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !impressed) {
          impressed = true;
          trackEvent('similar_destinations_viewed', {
            source_city: sourceCitySlug,
            recommended_cities: recommendedSlugs.join(','),
            count: recommendedSlugs.length,
          });
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(section);

    // Click tracking via event delegation — reads data attributes set by SimilarDestinationCard
    const handleClick = (e: MouseEvent) => {
      const link = (e.target as Element).closest('[data-city-slug]') as HTMLElement | null;
      if (!link) return;
      const slug  = link.dataset.citySlug;
      const rank  = link.dataset.rank;
      const score = link.dataset.score;
      if (!slug) return;
      trackEvent('similar_destination_clicked', {
        source_city:      sourceCitySlug,
        target_city:      slug,
        similarity_score: score ? parseFloat(score) : undefined,
        rank_position:    rank  ? parseInt(rank, 10) : undefined,
      });
    };
    section.addEventListener('click', handleClick);

    return () => {
      observer.disconnect();
      section.removeEventListener('click', handleClick);
    };
  }, [sourceCitySlug, recommendedSlugs]);

  return null;
}
