'use client';

import { Star } from 'lucide-react';

interface Review {
  name: string;
  location: string;
  trip: string;
  rating: number; // 1–5
  text: string;
  color: string; // avatar background
}

// Illustrative traveller reviews. Swap for verified reviews before relying on
// these as marketing claims (see note in chat about fake-review regulations).
const REVIEWS: Review[] = [
  { name: 'Aditya Menon', location: 'Bengaluru, IN', trip: 'Bali, 7 days', rating: 5, color: '#FF6B35',
    text: 'Planned our whole Bali trip in one evening. The day-by-day map made it so easy to see what was actually close together — saved us hours of backtracking.' },
  { name: 'Sara Khan', location: 'Mumbai, IN', trip: 'Thailand, 10 days', rating: 5, color: '#00C9A7',
    text: 'The budget breakdown was spot on. We landed in Bangkok knowing exactly what to spend per day. No other free guide gets this close to reality.' },
  { name: 'Daniel O.', location: 'London, UK', trip: 'Tokyo, 5 days', rating: 5, color: '#8B5CF6',
    text: 'I usually spend a week researching. TripGenius gave me a better Tokyo itinerary in 20 minutes — and the best-time-to-visit page settled a family argument.' },
  { name: 'Priya Nair', location: 'Kochi, IN', trip: 'Goa, weekend', rating: 4, color: '#3B82F6',
    text: 'Loved the honest tips — they actually told us which beaches to skip. The only thing I wanted was more nightlife spots, but the food picks were perfect.' },
  { name: 'Marco Rossi', location: 'Milan, IT', trip: 'Dubai, 4 days', rating: 5, color: '#F59E0B',
    text: 'Clean, fast, no paywall, no spam. The comparison pages helped me pick Dubai over Singapore. Booked everything the same night.' },
  { name: 'Ananya Gupta', location: 'Delhi, IN', trip: 'Bali, 6 days', rating: 5, color: '#EC4899',
    text: 'The interactive map where you pin your own places is genius. Felt like building my dream trip instead of following a rigid template.' },
  { name: 'Rahul Verma', location: 'Pune, IN', trip: 'Jaipur, 3 days', rating: 5, color: '#06B6D4',
    text: 'Booked a last-minute Rajasthan trip. The itinerary was realistic — it didn’t cram 8 things into a day like every blog tries to.' },
  { name: 'Emily Chen', location: 'Singapore', trip: 'Paris, 5 days', rating: 4, color: '#10B981',
    text: 'Beautiful site and genuinely useful. The hidden-gems section took me to a café I’d never have found. Would love an offline/PDF export next.' },
  { name: 'Karan Shah', location: 'Ahmedabad, IN', trip: 'Maldives, honeymoon', rating: 5, color: '#DC2626',
    text: 'We were overwhelmed planning a honeymoon. This made it calm and simple. The visa and best-time info alone saved us a costly mistake.' },
  { name: 'Lena Müller', location: 'Berlin, DE', trip: 'Kerala, 8 days', rating: 5, color: '#0EA5E9',
    text: 'So much better than the cluttered travel sites full of ads. Just clear, well-written guides. I’ve already sent it to three friends.' },
];

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={13}
          className={i < rating ? 'text-gold' : 'text-border'}
          fill={i < rating ? 'currentColor' : 'none'}
        />
      ))}
    </div>
  );
}

function ReviewCard({ review }: { review: Review }) {
  const initials = review.name.split(' ').map((n) => n[0]).slice(0, 2).join('');
  return (
    <figure className="w-[320px] sm:w-[360px] flex-shrink-0 bg-surface border border-border rounded-2xl p-5 select-none">
      <div className="flex items-center justify-between mb-3">
        <Stars rating={review.rating} />
        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted">{review.trip}</span>
      </div>
      <blockquote className="text-sm text-primary-text/90 leading-relaxed mb-4 line-clamp-4">
        “{review.text}”
      </blockquote>
      <figcaption className="flex items-center gap-3">
        <span
          className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
          style={{ backgroundColor: review.color }}
          aria-hidden
        >
          {initials}
        </span>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-primary-text leading-tight">{review.name}</p>
          <p className="text-xs text-muted">{review.location}</p>
        </div>
      </figcaption>
    </figure>
  );
}

function MarqueeRow({ items, reverse, duration }: { items: Review[]; reverse?: boolean; duration: string }) {
  return (
    <div className="marquee-row overflow-hidden marquee-mask">
      <div
        className={`flex gap-5 w-max ${reverse ? 'animate-marquee-reverse' : 'animate-marquee'}`}
        style={{ ['--marquee-duration' as string]: duration }}
      >
        {/* Two copies back-to-back → seamless -50% loop */}
        {[...items, ...items].map((review, i) => (
          <ReviewCard key={`${review.name}-${i}`} review={review} />
        ))}
      </div>
    </div>
  );
}

export default function Reviews() {
  const rowOne = REVIEWS.slice(0, 5);
  const rowTwo = REVIEWS.slice(5);
  const avg = (REVIEWS.reduce((s, r) => s + r.rating, 0) / REVIEWS.length).toFixed(1);

  return (
    <section className="py-16 overflow-hidden">
      <div className="max-w-[1280px] mx-auto">
        {/* Header */}
        <div className="text-center mb-10 px-6">
          <p className="text-xs font-bold uppercase tracking-widest text-accent mb-2">Loved by travellers</p>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-primary-text mb-3">
            Trusted by trip planners worldwide
          </h2>
          <div className="inline-flex items-center gap-2 text-sm text-muted">
            <Stars rating={5} />
            <span className="font-semibold text-primary-text">{avg}</span>
            <span>· based on traveller feedback</span>
          </div>
        </div>

        {/* Two auto-sliding rows, opposite directions */}
        <div className="space-y-5">
          <MarqueeRow items={rowOne} duration="48s" />
          <MarqueeRow items={rowTwo} reverse duration="54s" />
        </div>
      </div>
    </section>
  );
}
