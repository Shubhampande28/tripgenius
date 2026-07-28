import Link from 'next/link';
import { Clock, ArrowRight } from 'lucide-react';
import SafeImage from '@/components/SafeImage';
import CategoryBadge from './CategoryBadge';
import { getPostCoverUrl, COVER_W } from '@/lib/blogImages';
import type { BlogPost } from '@/lib/blog';

// No dates on cards — travel guides don't expire, dates make them feel stale.
function PostMeta({ readTime }: { readTime: number }) {
  return (
    <div className="flex items-center gap-2 text-xs text-muted">
      <span className="flex items-center gap-1"><Clock size={11} /> {readTime} min read</span>
      <span className="w-1 h-1 rounded-full bg-border" />
      <span className="text-accent font-medium">Free Guide</span>
    </div>
  );
}

interface PostCardProps {
  post: BlogPost;
  variant: 'featured' | 'grid' | 'related';
  /** LCP hint — only ever set true for the single featured card above the fold. */
  priority?: boolean;
}

export default function PostCard({ post, variant, priority }: PostCardProps) {
  if (variant === 'featured') {
    return (
      <Link href={`/blog/${post.slug}`}
        className="group grid grid-cols-1 md:grid-cols-2 gap-0 bg-surface border border-border rounded-2xl overflow-hidden hover:border-accent/30 card-lift">
        <div className="relative h-64 md:h-auto min-h-[260px]">
          <SafeImage
            src={getPostCoverUrl(post.coverPhoto, COVER_W.featured)}
            alt={post.title}
            city={post.slug}
            fill
            priority={priority}
            className="object-cover card-img"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/20" />
        </div>
        <div className="p-6 sm:p-8 flex flex-col justify-center">
          <CategoryBadge category={post.category} />
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-primary-text mt-3 mb-3 leading-snug group-hover:text-accent transition-colors">
            {post.title}
          </h2>
          <p className="text-muted text-sm leading-relaxed mb-4 line-clamp-3">{post.excerpt}</p>
          <PostMeta readTime={post.readTime} />
          <div className="mt-5 flex items-center gap-1.5 text-accent text-sm font-semibold">
            Read guide <ArrowRight size={14} />
          </div>
        </div>
      </Link>
    );
  }

  if (variant === 'related') {
    return (
      <Link href={`/blog/${post.slug}`}
        className="group flex flex-col bg-elevated border border-border rounded-2xl overflow-hidden hover:border-accent/30 card-lift">
        <div className="relative h-40">
          <SafeImage
            src={getPostCoverUrl(post.coverPhoto, COVER_W.related, 75)}
            alt={post.title}
            city={post.slug}
            fill
            className="object-cover card-img"
            sizes="(max-width: 640px) 100vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>
        <div className="p-4">
          <p className="font-heading text-base font-semibold text-primary-text group-hover:text-accent transition-colors leading-snug line-clamp-2">
            {post.title}
          </p>
          <p className="text-xs text-muted mt-1.5 flex items-center gap-1">
            <Clock size={10} /> {post.readTime} min read
          </p>
        </div>
      </Link>
    );
  }

  // variant === 'grid'
  return (
    <Link href={`/blog/${post.slug}`}
      className="group flex flex-col bg-surface border border-border rounded-2xl overflow-hidden hover:border-accent/30 card-lift">
      <div className="relative h-44 overflow-hidden">
        <SafeImage
          src={getPostCoverUrl(post.coverPhoto, COVER_W.card)}
          alt={post.title}
          city={post.slug}
          fill
          className="object-cover card-img"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute top-3 left-3">
          <CategoryBadge category={post.category} />
        </div>
      </div>
      <div className="flex flex-col flex-1 p-4">
        <h2 className="font-heading text-base font-bold text-primary-text mb-2 leading-snug group-hover:text-accent transition-colors line-clamp-2">
          {post.title}
        </h2>
        <p className="text-muted text-xs leading-relaxed mb-3 line-clamp-2 flex-1">{post.excerpt}</p>
        <PostMeta readTime={post.readTime} />
      </div>
    </Link>
  );
}
