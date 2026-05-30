import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Clock, ArrowRight, Tag } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { allPosts, BlogCategory } from '@/lib/blog';

export const metadata: Metadata = {
  title: 'Travel Blog — Tips, Guides & Destination Inspiration | TripGenius',
  description: 'Free travel guides, budget tips, and destination comparisons. Best time to visit Bali, Goa vs Kerala, Bangkok budget travel, Japan first-time tips and more.',
};

const CATEGORY_COLORS: Record<BlogCategory, string> = {
  Planning:  'bg-blue-500/10 text-blue-400 border-blue-500/20',
  Budget:    'bg-teal/10 text-teal border-teal/20',
  India:     'bg-orange-500/10 text-orange-400 border-orange-500/20',
  Asia:      'bg-purple-500/10 text-purple-400 border-purple-500/20',
  Europe:    'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
  Tips:      'bg-accent/10 text-accent border-accent/20',
};

function CategoryBadge({ category }: { category: BlogCategory }) {
  return (
    <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${CATEGORY_COLORS[category]}`}>
      <Tag size={8} /> {category}
    </span>
  );
}

function PostMeta({ date, readTime }: { date: string; readTime: number }) {
  const d = new Date(date);
  const formatted = d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  return (
    <div className="flex items-center gap-3 text-xs text-muted">
      <span className="flex items-center gap-1"><Calendar size={11} /> {formatted}</span>
      <span className="flex items-center gap-1"><Clock size={11} /> {readTime} min read</span>
    </div>
  );
}

export default function BlogPage() {
  const [featured, ...rest] = allPosts;

  return (
    <>
      <Navbar />
      <main className="bg-dark min-h-screen">

        {/* Hero */}
        <div className="relative overflow-hidden pt-28 pb-14 border-b border-border bg-surface">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] rounded-full bg-accent/6 blur-3xl" />
          </div>
          <div className="relative max-w-2xl mx-auto px-4 sm:px-6 text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-accent mb-4">Travel Blog</p>
            <h1 className="font-heading text-4xl sm:text-5xl font-semibold text-primary-text">
              Ideas for your next trip
            </h1>
            <p className="mt-3 text-muted text-base">
              Guides, tips, and honest travel advice — free, always.
            </p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14">

          {/* Featured post */}
          <div className="mb-12">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted mb-5">Featured</p>
            <Link href={`/blog/${featured.slug}`} className="group grid grid-cols-1 md:grid-cols-2 gap-0 bg-surface border border-border rounded-2xl overflow-hidden hover:border-accent/30 transition-colors">
              <div className="relative h-64 md:h-auto">
                <Image
                  src={`https://images.unsplash.com/${featured.coverPhoto}?auto=format&fit=crop&w=800&q=80`}
                  alt={featured.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/20" />
              </div>
              <div className="p-6 sm:p-8 flex flex-col justify-center">
                <CategoryBadge category={featured.category} />
                <h2 className="font-heading text-2xl sm:text-3xl font-semibold text-primary-text mt-3 mb-3 leading-snug group-hover:text-accent transition-colors">
                  {featured.title}
                </h2>
                <p className="text-muted text-sm leading-relaxed mb-5 line-clamp-3">{featured.excerpt}</p>
                <PostMeta date={featured.date} readTime={featured.readTime} />
                <div className="mt-5 flex items-center gap-1.5 text-accent text-sm font-semibold">
                  Read article <ArrowRight size={14} />
                </div>
              </div>
            </Link>
          </div>

          {/* Rest of posts */}
          <div className="flex items-center gap-3 mb-7">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted whitespace-nowrap">All Articles</p>
            <div className="flex-1 h-px bg-border" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {rest.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`}
                className="group flex flex-col bg-surface border border-border rounded-2xl overflow-hidden hover:border-accent/30 transition-colors">
                <div className="relative h-48">
                  <Image
                    src={`https://images.unsplash.com/${post.coverPhoto}?auto=format&fit=crop&w=600&q=80`}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute top-3 left-3">
                    <CategoryBadge category={post.category} />
                  </div>
                </div>
                <div className="flex flex-col flex-1 p-5">
                  <h2 className="font-heading text-lg font-semibold text-primary-text mb-2 leading-snug group-hover:text-accent transition-colors line-clamp-2">
                    {post.title}
                  </h2>
                  <p className="text-muted text-sm leading-relaxed mb-4 line-clamp-3 flex-1">{post.excerpt}</p>
                  <PostMeta date={post.date} readTime={post.readTime} />
                </div>
              </Link>
            ))}
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}
