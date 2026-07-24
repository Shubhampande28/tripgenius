import Link from 'next/link';
import Image from 'next/image';
import { BookOpen, ArrowRight, Clock, CalendarDays, ClipboardList } from 'lucide-react';
import { getPostsForCity } from '@/lib/blog';
import { City } from '@/lib/types';

// "Guides & Itineraries" — blog posts covering this city (matched via the
// posts' cities/citySlug/tags frontmatter). Internal-linking module: every
// city page links its supporting articles, every article links back via the
// city-guide CTA, forming a topic cluster around the city hub.
export default function CityGuides({ city }: { city: City }) {
  const posts = getPostsForCity(city.slug, city.name);
  const planningResources = [
    {
      href: `/best-time-to-visit/${city.slug}`,
      title: `Best Time to Visit ${city.name}`,
      description: `Compare seasons and choose the right travel window for ${city.name}.`,
      icon: CalendarDays,
    },
    {
      href: `/cheatsheet/${city.slug}`,
      title: `${city.name} Travel Cheatsheet`,
      description: 'Keep the essential areas, costs, and planning details in one compact guide.',
      icon: ClipboardList,
    },
  ];

  return (
    <section id="city-guides" className="py-8 border-t border-border">
      <div className="mb-5">
        <p className="text-xs font-bold uppercase tracking-widest text-accent mb-1">Go Deeper</p>
        <h2 className="font-heading text-2xl font-semibold text-primary-text">
          {city.name} Guides &amp; Itineraries
        </h2>
        <p className="text-sm text-muted mt-1">
          {posts.length > 0
            ? `In-depth articles from our blog to plan your ${city.name} trip properly`
            : `Practical planning resources for your ${city.name} trip`}
        </p>
      </div>

      {posts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group flex gap-4 bg-surface border border-border hover:border-accent/40 rounded-2xl p-4 card-lift"
          >
            <div className="relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden">
              <Image
                src={`https://images.unsplash.com/${post.coverPhoto}?auto=format&fit=crop&w=200&q=70`}
                alt={post.title}
                fill
                sizes="80px"
                className="object-cover card-img"
              />
            </div>
            <div className="flex flex-col min-w-0">
              <h3 className="font-heading text-sm font-bold text-primary-text group-hover:text-accent transition-colors leading-snug line-clamp-2 mb-1">
                {post.title}
              </h3>
              <p className="text-xs text-muted line-clamp-2 leading-relaxed mb-auto">
                {post.excerpt}
              </p>
              <span className="flex items-center gap-3 mt-2 text-[11px] text-muted">
                <span className="flex items-center gap-1"><Clock size={10} /> {post.readTime} min</span>
                <span className="flex items-center gap-1 font-semibold text-accent group-hover:gap-1.5 transition-all">
                  Read <ArrowRight size={10} />
                </span>
              </span>
            </div>
          </Link>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {planningResources.map(({ href, title, description, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="group flex gap-4 bg-surface border border-border hover:border-accent/40 rounded-2xl p-5 card-lift"
            >
              <div className="w-11 h-11 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center flex-shrink-0">
                <Icon size={18} className="text-accent" />
              </div>
              <div>
                <h3 className="font-heading text-sm font-bold text-primary-text group-hover:text-accent transition-colors">
                  {title}
                </h3>
                <p className="text-xs text-muted leading-relaxed mt-1">{description}</p>
                <span className="inline-flex items-center gap-1 mt-3 text-xs font-semibold text-accent">
                  Open resource <ArrowRight size={11} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}

      <Link
        href="/blog"
        className="inline-flex items-center gap-1.5 mt-4 text-xs font-semibold text-accent hover:underline"
      >
        <BookOpen size={12} /> {posts.length > 0 ? 'All travel guides' : 'Browse the travel blog'}
      </Link>
    </section>
  );
}
