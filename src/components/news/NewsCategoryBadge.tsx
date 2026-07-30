import { Tag } from 'lucide-react';
import type { NewsCategory } from '@/lib/news';

// Single source for news category colors — was forked between
// src/app/news/page.tsx and src/app/news/[slug]/page.tsx with slightly
// different opacity/shade values. Mirrors blog/CategoryBadge.tsx's pattern.
export const NEWS_CATEGORY_COLORS: Record<NewsCategory, string> = {
  Visas:        'bg-blue-500/15 text-blue-500 border-blue-500/25',
  Airlines:     'bg-purple-500/15 text-purple-500 border-purple-500/25',
  Destinations: 'bg-teal/15 text-teal border-teal/25',
  Advisories:   'bg-orange-500/15 text-orange-500 border-orange-500/25',
  Deals:        'bg-green-500/15 text-green-500 border-green-500/25',
  Policy:       'bg-indigo-500/15 text-indigo-500 border-indigo-500/25',
};

export default function NewsCategoryBadge({ category }: { category: NewsCategory }) {
  return (
    <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${NEWS_CATEGORY_COLORS[category]}`}>
      <Tag size={8} /> {category}
    </span>
  );
}
