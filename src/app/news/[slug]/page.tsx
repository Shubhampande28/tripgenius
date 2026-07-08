import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Clock, ChevronRight, Tag, ArrowRight, ExternalLink } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Schema from '@/components/Schema';
import { getAllNews, getNewsBySlug, NewsBlock, NewsCategory } from '@/lib/news';

const BASE = 'https://www.tripgenius.in';

export async function generateStaticParams() {
  return getAllNews().map(a => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = getNewsBySlug(slug);
  if (!article) return {};
  return {
    title: article.title,
    description: article.description,
    alternates: { canonical: `${BASE}/news/${slug}` },
    openGraph: {
      title: article.title,
      description: article.description,
      url: `${BASE}/news/${slug}`,
      type: 'article',
      publishedTime: article.date,
      authors: ['TripGenius'],
      tags: article.tags,
      images: [`https://images.unsplash.com/${article.coverPhoto}?auto=format&fit=crop&w=1200&q=80`],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.description,
      images: [`https://images.unsplash.com/${article.coverPhoto}?auto=format&fit=crop&w=1200&q=80`],
    },
  };
}

const CATEGORY_COLORS: Record<NewsCategory, string> = {
  Visas:        'bg-blue-500/10 text-blue-400 border-blue-500/20',
  Airlines:     'bg-purple-500/10 text-purple-400 border-purple-500/20',
  Destinations: 'bg-teal/10 text-teal border-teal/20',
  Advisories:   'bg-orange-500/10 text-orange-400 border-orange-500/20',
  Deals:        'bg-green-500/10 text-green-400 border-green-500/20',
  Policy:       'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
};

// Renders the markdown inline subset the news-writer skill produces:
// **bold** and [text](url). Relative links use <Link>, external open new tab.
function Inline({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g);
  return (
    <>
      {parts.map((part, i) => {
        const bold = part.match(/^\*\*([^*]+)\*\*$/);
        if (bold) return <strong key={i} className="font-semibold text-primary-text">{bold[1]}</strong>;
        const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
        if (link) {
          const [, label, href] = link;
          if (href.startsWith('/')) {
            return <Link key={i} href={href} className="text-accent hover:underline">{label}</Link>;
          }
          return (
            <a key={i} href={href} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
              {label}
            </a>
          );
        }
        return part;
      })}
    </>
  );
}

function ContentBlock({ block }: { block: NewsBlock }) {
  switch (block.type) {
    case 'h2':
      return <h2 className="font-heading text-2xl sm:text-3xl font-semibold text-primary-text mt-10 mb-4">{block.text}</h2>;
    case 'h3':
      return <h3 className="font-heading text-xl font-semibold text-primary-text mt-7 mb-3">{block.text}</h3>;
    case 'p':
      return <p className="text-muted leading-relaxed mb-4 text-[15px]"><Inline text={block.text} /></p>;
    case 'ul':
      return (
        <ul className="mb-5 space-y-2">
          {block.items.map((item, i) => (
            <li key={i} className="flex gap-2.5 text-[15px] text-muted leading-relaxed">
              <span className="text-accent mt-1 flex-shrink-0">›</span>
              <span><Inline text={item} /></span>
            </li>
          ))}
        </ul>
      );
    case 'ol':
      return (
        <ol className="mb-5 space-y-3">
          {block.items.map((item, i) => (
            <li key={i} className="flex gap-3 text-[15px] text-muted leading-relaxed">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-accent/15 text-accent text-xs font-bold flex items-center justify-center mt-0.5">{i + 1}</span>
              <span><Inline text={item} /></span>
            </li>
          ))}
        </ol>
      );
    case 'quote':
      return (
        <blockquote className="my-6 border-l-2 border-accent pl-5 py-1">
          <p className="text-primary-text text-base leading-relaxed italic"><Inline text={block.text} /></p>
        </blockquote>
      );
    default:
      return null;
  }
}

export default async function NewsArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getNewsBySlug(slug);
  if (!article) notFound();

  const more = getAllNews().filter(a => a.slug !== slug).slice(0, 3);
  const articleUrl = `${BASE}/news/${slug}`;

  const newsSchema = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.title,
    description: article.description,
    url: articleUrl,
    image: `https://images.unsplash.com/${article.coverPhoto}?auto=format&fit=crop&w=1200&q=80`,
    datePublished: article.date,
    dateModified: article.date,
    author: { '@type': 'Organization', name: 'TripGenius Editorial Team', url: `${BASE}/about` },
    publisher: {
      '@type': 'Organization', name: 'TripGenius', url: BASE,
      logo: { '@type': 'ImageObject', url: `${BASE}/logo.png` },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': articleUrl },
    keywords: article.tags.join(', '),
    articleSection: article.category,
    ...(article.sources.length > 0 && { citation: article.sources }),
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: BASE },
      { '@type': 'ListItem', position: 2, name: 'Travel News', item: `${BASE}/news` },
      { '@type': 'ListItem', position: 3, name: article.title, item: articleUrl },
    ],
  };

  return (
    <>
      <Schema data={newsSchema} />
      <Schema data={breadcrumbSchema} />
      <Navbar />
      <main className="bg-dark min-h-screen">

        {/* Cover image */}
        <div className="relative h-64 sm:h-80 lg:h-96 w-full pt-16">
          <Image
            src={`https://images.unsplash.com/${article.coverPhoto}?auto=format&fit=crop&w=1400&q=80`}
            alt={article.title}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/50 to-transparent" />
        </div>

        <div className="max-w-3xl mx-auto px-4 sm:px-6 -mt-16 relative z-10 pb-20">

          {/* Breadcrumb — mirrors the BreadcrumbList JSON-LD */}
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center gap-1.5 text-xs text-muted flex-wrap">
              <li><Link href="/" className="hover:text-accent transition-colors">Home</Link></li>
              <li aria-hidden><ChevronRight size={11} /></li>
              <li><Link href="/news" className="hover:text-accent transition-colors">Travel News</Link></li>
              <li aria-hidden><ChevronRight size={11} /></li>
              <li className="text-primary-text font-medium line-clamp-1">{article.title}</li>
            </ol>
          </nav>

          {/* Meta — news is dated content, show the date prominently */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${CATEGORY_COLORS[article.category]}`}>
              <Tag size={8} /> {article.category}
            </span>
            <time dateTime={article.date} className="text-xs text-primary-text font-medium">
              {new Date(article.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
            </time>
            <span className="flex items-center gap-1 text-xs text-muted"><Clock size={11} /> {article.readTime} min read</span>
            <span className="text-xs text-muted">By <Link href="/about" className="text-primary-text font-medium hover:text-accent transition-colors">TripGenius Editorial Team</Link></span>
          </div>

          {/* Title */}
          <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-semibold text-primary-text leading-tight mb-4">
            {article.title}
          </h1>

          <p className="text-muted text-base leading-relaxed mb-8 border-b border-border pb-8">
            {article.description}
          </p>

          {/* Body */}
          <article>
            {article.content.map((block, i) => (
              <ContentBlock key={i} block={block} />
            ))}
          </article>

          {/* Sources — news credibility signal */}
          {article.sources.length > 0 && (
            <div className="mt-10 pt-6 border-t border-border">
              <p className="text-xs font-bold uppercase tracking-wider text-muted mb-3">Sources</p>
              <ul className="space-y-1.5">
                {article.sources.map(src => (
                  <li key={src}>
                    <a href={src} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-accent hover:underline break-all">
                      <ExternalLink size={11} className="flex-shrink-0" /> {new URL(src).hostname.replace(/^www\./, '')}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* More news */}
          {more.length > 0 && (
            <div className="mt-12">
              <h2 className="font-heading text-xl font-semibold text-primary-text mb-5">More travel news</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {more.map(a => (
                  <Link key={a.slug} href={`/news/${a.slug}`}
                    className="group flex flex-col bg-surface border border-border rounded-2xl overflow-hidden hover:border-accent/30 card-lift">
                    <div className="relative h-32 overflow-hidden">
                      <Image
                        src={`https://images.unsplash.com/${a.coverPhoto}?auto=format&fit=crop&w=400&q=80`}
                        alt={a.title} fill className="object-cover card-img"
                        sizes="(max-width: 640px) 100vw, 33vw"
                      />
                    </div>
                    <div className="p-4">
                      <p className="text-[10px] text-muted mb-1.5">
                        {new Date(a.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                      <h3 className="font-heading text-sm font-bold text-primary-text leading-snug group-hover:text-accent transition-colors line-clamp-3">
                        {a.title}
                      </h3>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* CTA into the planner */}
          <div className="mt-12 flex items-center justify-between gap-4 rounded-2xl border border-accent/25 bg-elevated px-6 py-5">
            <div>
              <p className="font-heading text-base font-semibold text-primary-text mb-1">Planning a trip?</p>
              <p className="text-sm text-muted">Get a free AI-built itinerary with day-by-day plans and budgets in INR.</p>
            </div>
            <Link href="/plan"
              className="flex-shrink-0 flex items-center gap-1.5 bg-accent text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-accent/90 transition-colors">
              Plan my trip <ArrowRight size={14} />
            </Link>
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}
