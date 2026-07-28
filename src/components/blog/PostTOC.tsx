'use client';

import { useState, useEffect, useMemo } from 'react';
import type { BlockType } from '@/lib/blog';
import { slugifyHeading } from '@/lib/slugifyHeading';

interface TOCEntry {
  id: string;
  text: string;
  level: 'h2' | 'h3';
}

// Sticky-on-desktop / collapsible-on-mobile table of contents for long blog
// posts, adapted from src/components/city/CityTOC.tsx's IntersectionObserver
// active-section-highlight pattern — but built from the post's own content
// blocks instead of a fixed section list.
export default function PostTOC({ content }: { content: BlockType[] }) {
  const [active, setActive] = useState('');
  const [open, setOpen] = useState(false);

  const entries = useMemo<TOCEntry[]>(() => {
    return content
      .filter((b): b is Extract<BlockType, { type: 'h2' | 'h3' }> => b.type === 'h2' || b.type === 'h3')
      .map(b => ({ id: slugifyHeading(b.text), text: b.text, level: b.type }));
  }, [content]);

  useEffect(() => {
    const ids = entries.map(e => e.id);
    const observer = new IntersectionObserver(
      (observed) => {
        const intersecting = observed
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (intersecting.length > 0) setActive(intersecting[0].target.id);
      },
      { rootMargin: '-10% 0px -80% 0px', threshold: 0 }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [entries]);

  const h2Count = entries.filter(e => e.level === 'h2').length;
  if (h2Count < 4) return null;

  const jumpTo = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY - 88;
    window.scrollTo({ top: y, behavior: 'smooth' });
    setOpen(false);
  };

  return (
    <nav aria-label="Table of contents" className="glass-card rounded-2xl p-4 mb-8 lg:sticky lg:top-24">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="lg:hidden flex items-center justify-between w-full text-[10px] font-bold uppercase tracking-widest text-muted px-1"
      >
        <span>In This Guide</span>
        <span className="text-xs">{open ? '−' : '+'}</span>
      </button>
      <p className="hidden lg:block text-[10px] font-bold uppercase tracking-widest text-muted mb-3 px-1">
        In This Guide
      </p>
      <ul className={`space-y-0.5 mt-2 lg:mt-0 ${open ? 'block' : 'hidden'} lg:block`}>
        {entries.map(({ id, text, level }) => (
          <li key={id}>
            <a
              href={`#${id}`}
              onClick={(e) => { e.preventDefault(); jumpTo(id); }}
              className={`block px-3 py-2 rounded-xl text-sm transition-all duration-200 ${level === 'h3' ? 'pl-6 text-xs' : ''} ${
                active === id
                  ? 'bg-accent/10 text-accent font-semibold'
                  : 'text-muted hover:text-primary-text hover:bg-surface'
              }`}
            >
              {text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
