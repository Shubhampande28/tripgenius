import Link from 'next/link';
import { Clock, ArrowRight } from 'lucide-react';
import SafeImage from '@/components/SafeImage';
import NewsCategoryBadge from './NewsCategoryBadge';
import { getNewsCoverUrl, COVER_W } from '@/lib/newsImages';
import type { NewsArticle } from '@/lib/news';

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

interface NewsCardProps {
  article: NewsArticle;
  variant: 'featured' | 'grid';
  priority?: boolean;
}

export default function NewsCard({ article, variant, priority }: NewsCardProps) {
  if (variant === 'featured') {
    return (
      <Link href={`/news/${article.slug}`}
        className="group grid grid-cols-1 md:grid-cols-2 gap-0 bg-surface border border-border rounded-2xl overflow-hidden hover:border-accent/30 card-lift">
        <div className="relative h-64 md:h-auto min-h-[260px]">
          <SafeImage
            src={getNewsCoverUrl(article.coverPhoto, COVER_W.featured)}
            alt={article.title}
            city={article.slug}
            fill
            priority={priority}
            className="object-cover card-img"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/20" />
          <div className="absolute top-3 left-3">
            <span className="inline-flex items-center text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-accent text-white">
              Latest
            </span>
          </div>
        </div>
        <div className="p-6 sm:p-8 flex flex-col justify-center">
          <div className="flex items-center gap-3">
            <NewsCategoryBadge category={article.category} />
            <time dateTime={article.date} className="text-xs text-muted">{formatDate(article.date)}</time>
          </div>
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-primary-text mt-3 mb-3 leading-snug group-hover:text-accent transition-colors">
            {article.title}
          </h2>
          <p className="text-muted text-sm leading-relaxed mb-4 line-clamp-3">{article.description}</p>
          <div className="flex items-center gap-2 text-xs text-muted">
            <span className="flex items-center gap-1"><Clock size={11} /> {article.readTime} min read</span>
          </div>
          <div className="mt-5 flex items-center gap-1.5 text-accent text-sm font-semibold">
            Read story <ArrowRight size={14} />
          </div>
        </div>
      </Link>
    );
  }

  // variant === 'grid'
  return (
    <Link href={`/news/${article.slug}`}
      className="group flex flex-col bg-surface border border-border rounded-2xl overflow-hidden hover:border-accent/30 card-lift">
      <div className="relative h-44 overflow-hidden">
        <SafeImage
          src={getNewsCoverUrl(article.coverPhoto, COVER_W.card)}
          alt={article.title}
          city={article.slug}
          fill
          className="object-cover card-img"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute top-3 left-3">
          <NewsCategoryBadge category={article.category} />
        </div>
      </div>
      <div className="flex flex-col flex-1 p-4">
        <time dateTime={article.date} className="text-[10px] text-muted mb-1.5">{formatDate(article.date)}</time>
        <h2 className="font-heading text-base font-bold text-primary-text mb-2 leading-snug group-hover:text-accent transition-colors line-clamp-2">
          {article.title}
        </h2>
        <p className="text-muted text-xs leading-relaxed mb-3 line-clamp-2 flex-1">{article.description}</p>
        <div className="flex items-center gap-2 text-xs text-muted">
          <span className="flex items-center gap-1"><Clock size={11} /> {article.readTime} min read</span>
        </div>
      </div>
    </Link>
  );
}
