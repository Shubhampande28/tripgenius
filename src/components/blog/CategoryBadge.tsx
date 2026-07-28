import { Tag } from 'lucide-react';
import type { BlogCategory } from '@/lib/blog';

// Single source for category colors — previously forked between
// src/app/blog/page.tsx and src/app/blog/[slug]/page.tsx with different
// opacity/shade values that could drift out of sync.
export const CATEGORY_COLORS: Record<BlogCategory, string> = {
  Planning: 'bg-blue-500/15 text-blue-500 border-blue-500/25',
  Budget:   'bg-teal/15 text-teal border-teal/25',
  India:    'bg-orange-500/15 text-orange-500 border-orange-500/25',
  Asia:     'bg-purple-500/15 text-purple-500 border-purple-500/25',
  Europe:   'bg-indigo-500/15 text-indigo-500 border-indigo-500/25',
  Tips:     'bg-accent/15 text-accent border-accent/25',
};

export default function CategoryBadge({ category }: { category: BlogCategory }) {
  return (
    <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${CATEGORY_COLORS[category]}`}>
      <Tag size={8} /> {category}
    </span>
  );
}
