import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Clock, ArrowLeft, ArrowRight, Tag, MapPin, Hotel, Plane, Ticket } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { allPosts, getPostBySlug, getRelatedPosts, BlockType, BlogCategory } from '@/lib/blog';
import { ChevronDown } from 'lucide-react';
import AdUnit from '@/components/AdUnit';
import { AD_SLOTS } from '@/lib/adsense';
import { hotelUrl, flightUrl, activitiesUrl, activitiesLabel } from '@/lib/affiliateLinks';
import { getCityBySlug } from '@/lib/cities';
import { hasComparison } from '@/lib/comparisons';

export async function generateStaticParams() {
  return allPosts.map(p => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  const BASE = 'https://www.tripgenius.in';
  return {
    title: post.title,
    description: post.excerpt,
    keywords: post.tags,
    alternates: { canonical: `${BASE}/blog/${slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `${BASE}/blog/${slug}`,
      type: 'article',
      publishedTime: post.date,
      authors: ['TripGenius'],
      tags: post.tags,
      images: [`https://images.unsplash.com/${post.coverPhoto}?auto=format&fit=crop&w=1200&q=80`],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [`https://images.unsplash.com/${post.coverPhoto}?auto=format&fit=crop&w=1200&q=80`],
    },
  };
}

const CATEGORY_COLORS: Record<BlogCategory, string> = {
  Planning:  'bg-blue-500/10 text-blue-400 border-blue-500/20',
  Budget:    'bg-teal/10 text-teal border-teal/20',
  India:     'bg-orange-500/10 text-orange-400 border-orange-500/20',
  Asia:      'bg-purple-500/10 text-purple-400 border-purple-500/20',
  Europe:    'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
  Tips:      'bg-accent/10 text-accent border-accent/20',
};

function ContentBlock({ block }: { block: BlockType }) {
  switch (block.type) {
    case 'h2':
      return <h2 className="font-heading text-2xl sm:text-3xl font-semibold text-primary-text mt-10 mb-4">{block.text}</h2>;
    case 'h3':
      return <h3 className="font-heading text-xl font-semibold text-primary-text mt-7 mb-3">{block.text}</h3>;
    case 'p':
      return <p className="text-muted leading-relaxed mb-4 text-[15px]">{block.text}</p>;
    case 'ul':
      return (
        <ul className="mb-5 space-y-2">
          {block.items.map((item, i) => (
            <li key={i} className="flex gap-2.5 text-[15px] text-muted leading-relaxed">
              <span className="text-accent mt-1 flex-shrink-0">›</span>
              <span>{item}</span>
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
              <span>{item}</span>
            </li>
          ))}
        </ol>
      );
    case 'callout':
      return (
        <div className="my-6 flex gap-3 p-4 bg-accent/8 border border-accent/20 rounded-xl">
          <span className="text-2xl flex-shrink-0">{block.emoji}</span>
          <p className="text-sm text-primary-text leading-relaxed">{block.text}</p>
        </div>
      );
    case 'table':
      return (
        <div className="my-6 overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead className="bg-elevated">
              <tr>
                {block.headers.map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-muted border-b border-border">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, ri) => (
                <tr key={ri} className={ri % 2 === 0 ? 'bg-surface' : 'bg-dark'}>
                  {row.map((cell, ci) => (
                    <td key={ci} className="px-4 py-3 text-muted border-b border-border/40 last:border-b-0 align-top">{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case 'divider':
      return <hr className="my-8 border-border" />;
    case 'link-cta':
      return (
        <div className="my-5 flex items-center justify-between gap-4 rounded-xl border border-accent/25 bg-elevated px-5 py-3.5">
          <p className="text-sm text-muted leading-snug">{block.text}</p>
          <Link
            href={block.href}
            className="flex-shrink-0 flex items-center gap-1 text-xs font-semibold text-accent hover:text-accent/80 transition-colors whitespace-nowrap"
          >
            Read more <ArrowRight size={11} />
          </Link>
        </div>
      );
    case 'image':
      return (
        <figure className="my-7 rounded-2xl overflow-hidden border border-border">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={block.src}
            alt={block.alt}
            loading="lazy"
            className="w-full object-cover"
            style={{ maxHeight: '420px' }}
          />
          {block.caption && (
            <figcaption className="bg-surface px-4 py-2 text-xs text-muted text-center border-t border-border">
              {block.caption}
            </figcaption>
          )}
        </figure>
      );
    default:
      return null;
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const related = getRelatedPosts(post);
  const cityData = post.citySlug ? getCityBySlug(post.citySlug) : null;
  const comparisonGuideSlug = hasComparison(slug) ? slug : null;
  const formattedDate = new Date(post.date).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'long', year: 'numeric',
  });

  const BASE = 'https://www.tripgenius.in';
  const postUrl = `${BASE}/blog/${slug}`;
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    url: postUrl,
    image: `https://images.unsplash.com/${post.coverPhoto}?auto=format&fit=crop&w=1200&q=80`,
    datePublished: post.date,
    dateModified: post.date,
    author: { '@type': 'Organization', name: 'TripGenius', url: BASE },
    publisher: {
      '@type': 'Organization', name: 'TripGenius', url: BASE,
      logo: { '@type': 'ImageObject', url: `${BASE}/logo.png` },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': postUrl },
    keywords: post.tags.join(', '),
    articleSection: post.category,
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: BASE },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: `${BASE}/blog` },
      { '@type': 'ListItem', position: 3, name: post.title, item: postUrl },
    ],
  };

  const faqSchema = post.faqs?.length ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: post.faqs.map(({ question, answer }) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: { '@type': 'Answer', text: answer },
    })),
  } : null;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {faqSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />}
      <Navbar />
      <main className="bg-dark min-h-screen">

        {/* Cover image */}
        <div className="relative h-64 sm:h-80 lg:h-96 w-full pt-16">
          <Image
            src={`https://images.unsplash.com/${post.coverPhoto}?auto=format&fit=crop&w=1400&q=80`}
            alt={post.title}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/50 to-transparent" />
        </div>

        {/* Article */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 -mt-16 relative z-10 pb-20">

          {/* Back link */}
          <Link href="/blog" className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-accent transition-colors mb-6">
            <ArrowLeft size={12} /> Back to Blog
          </Link>

          {/* Meta — no date, travel guides don't expire */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${CATEGORY_COLORS[post.category]}`}>
              <Tag size={8} /> {post.category}
            </span>
            <span className="flex items-center gap-1 text-xs text-muted"><Clock size={11} /> {post.readTime} min read</span>
            <span className="text-xs text-accent font-semibold">Free Guide</span>
            <span className="text-xs text-muted">By <span className="text-primary-text font-medium">TripGenius Editorial Team</span></span>
          </div>

          {/* Title */}
          <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-semibold text-primary-text leading-tight mb-4">
            {post.title}
          </h1>

          <p className="text-muted text-base leading-relaxed mb-8 border-b border-border pb-8">
            {post.excerpt}
          </p>

          {/* Content */}
          <article>
            {post.content.map((block, i) => (
              <>
                <ContentBlock key={i} block={block} />
                {/* Mid-article ad after the 4th block */}
                {i === 3 && <AdUnit key="mid-ad" slot={AD_SLOTS.blogMidArticle} format="fluid" layout="in-article" className="my-6" />}
              </>
            ))}
          </article>
          <AdUnit slot={AD_SLOTS.blogBottom} format="horizontal" className="mt-8 mb-2" />

          {comparisonGuideSlug && (
            <div className="mt-8 p-5 bg-surface border border-accent/20 rounded-2xl flex items-center justify-between gap-4">
              <div>
                <p className="text-xs text-accent font-bold uppercase tracking-wider mb-1">Quick Comparison</p>
                <p className="text-sm text-primary-text font-medium">Use the side-by-side comparison for costs, timing, and trip-fit at a glance.</p>
              </div>
              <Link href={`/compare/${comparisonGuideSlug}`}
                className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2 bg-accent text-white rounded-xl text-sm font-semibold hover:bg-accent/90 transition-colors">
                Compare <ArrowRight size={13} />
              </Link>
            </div>
          )}

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-10 pt-8 border-t border-border">
            {post.tags.map(tag => (
              <span key={tag} className="text-xs px-3 py-1 rounded-full bg-elevated border border-border text-muted">
                #{tag}
              </span>
            ))}
          </div>

          {/* FAQ accordion */}
          {post.faqs && post.faqs.length > 0 && (
            <div className="mt-10 pt-8 border-t border-border">
              <h2 className="font-heading text-xl font-semibold text-primary-text mb-5">Frequently Asked Questions</h2>
              <div className="space-y-2">
                {post.faqs.map(({ question, answer }, i) => (
                  <details key={i} className="group border border-border rounded-xl bg-elevated overflow-hidden">
                    <summary className="flex items-center justify-between gap-4 px-5 py-4 cursor-pointer list-none text-primary-text font-medium text-sm hover:text-accent transition-colors">
                      <span>{question}</span>
                      <ChevronDown size={16} className="flex-shrink-0 text-muted transition-transform duration-200 group-open:rotate-180" />
                    </summary>
                    <p className="px-5 pb-4 text-sm text-muted leading-relaxed border-t border-border pt-3">
                      {answer}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          )}

          {/* City guide CTA */}
          {post.citySlug && (
            <div className="mt-8 p-5 bg-surface border border-accent/20 rounded-2xl flex items-center justify-between gap-4">
              <div>
                <p className="text-xs text-accent font-bold uppercase tracking-wider mb-1">Full City Guide</p>
                <p className="text-sm text-primary-text font-medium">Read our complete guide with things to do, where to eat, and where to stay.</p>
              </div>
              <Link href={`/cities/${post.citySlug}`}
                className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2 bg-accent text-white rounded-xl text-sm font-semibold hover:bg-accent/90 transition-colors">
                <MapPin size={13} /> Open Guide
              </Link>
            </div>
          )}

          {/* Affiliate booking links */}
          {cityData && (
            <div className="mt-4 p-5 bg-surface border border-border rounded-2xl">
              <p className="text-xs font-bold uppercase tracking-wider text-muted mb-3">Book Your Trip to {cityData.name}</p>
              <div className="grid grid-cols-3 gap-2">
                <a href={hotelUrl(cityData.name)} target="_blank" rel="noopener noreferrer sponsored"
                  className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 hover:bg-blue-500/15 transition-colors group text-center">
                  <Hotel size={16} className="text-blue-400" />
                  <p className="text-xs font-semibold text-primary-text group-hover:text-blue-400 transition-colors">Hotels</p>
                  <p className="text-[10px] text-muted">Booking.com</p>
                </a>
                <a href={activitiesUrl(cityData.slug, cityData.name)} target="_blank" rel="noopener noreferrer sponsored"
                  className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-accent/10 border border-accent/20 hover:bg-accent/15 transition-colors group text-center">
                  <Ticket size={16} className="text-accent" />
                  <p className="text-xs font-semibold text-primary-text group-hover:text-accent transition-colors">Tours</p>
                  <p className="text-[10px] text-muted">{activitiesLabel(cityData.slug)}</p>
                </a>
                <a href={flightUrl(cityData.name)} target="_blank" rel="noopener noreferrer"
                  className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-teal/10 border border-teal/20 hover:bg-teal/15 transition-colors group text-center">
                  <Plane size={16} className="text-teal" />
                  <p className="text-xs font-semibold text-primary-text group-hover:text-teal transition-colors">Flights</p>
                  <p className="text-[10px] text-muted">Skyscanner</p>
                </a>
              </div>
              <p className="text-[10px] text-muted/40 mt-2.5 text-center">We earn a small commission — at no extra cost to you.</p>
            </div>
          )}
        </div>

        {/* Related posts */}
        {related.length > 0 && (
          <div className="border-t border-border bg-surface">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
              <div className="flex items-center gap-3 mb-8">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted whitespace-nowrap">You might also like</p>
                <div className="flex-1 h-px bg-border" />
                <Link href="/blog" className="text-xs text-muted hover:text-accent transition-colors flex items-center gap-1">
                  All articles <ArrowRight size={11} />
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {related.map(p => (
                  <Link key={p.slug} href={`/blog/${p.slug}`}
                    className="group flex flex-col bg-elevated border border-border rounded-2xl overflow-hidden hover:border-accent/30 transition-colors">
                    <div className="relative h-40">
                      <Image
                        src={`https://images.unsplash.com/${p.coverPhoto}?auto=format&fit=crop&w=400&q=75`}
                        alt={p.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    </div>
                    <div className="p-4">
                      <p className="font-heading text-base font-semibold text-primary-text group-hover:text-accent transition-colors leading-snug line-clamp-2">
                        {p.title}
                      </p>
                      <p className="text-xs text-muted mt-1.5 flex items-center gap-1">
                        <Clock size={10} /> {p.readTime} min read
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}

      </main>
      <Footer />
    </>
  );
}
