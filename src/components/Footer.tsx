import Link from 'next/link';
import { Compass, X, Camera } from 'lucide-react';
import Flag from '@/components/Flag';

// Pinterest has no lucide icon — minimal brand glyph, inherits currentColor
function PinterestIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2C6.48 2 2 6.48 2 12c0 4.24 2.64 7.86 6.36 9.31-.09-.79-.17-2 .04-2.87.18-.78 1.18-4.99 1.18-4.99s-.3-.6-.3-1.49c0-1.4.81-2.44 1.82-2.44.86 0 1.27.64 1.27 1.41 0 .86-.55 2.15-.83 3.34-.24 1 .5 1.81 1.48 1.81 1.78 0 3.15-1.88 3.15-4.59 0-2.4-1.72-4.08-4.19-4.08-2.85 0-4.53 2.14-4.53 4.35 0 .86.33 1.79.75 2.29.08.1.09.19.07.29-.08.31-.25 1-.28 1.14-.04.19-.15.23-.34.14-1.25-.58-2.03-2.41-2.03-3.88 0-3.16 2.3-6.06 6.62-6.06 3.48 0 6.18 2.48 6.18 5.79 0 3.45-2.18 6.23-5.2 6.23-1.02 0-1.97-.53-2.3-1.15l-.63 2.38c-.23.87-.84 1.97-1.25 2.64.94.29 1.94.45 2.98.45 5.52 0 10-4.48 10-10S17.52 2 12 2z" />
    </svg>
  );
}

const footerLinks = {
  Explore: [
    { label: 'All Cities', href: '/cities' },
    { label: 'All Destinations', href: '/destinations' },
    { label: 'Bali Guide', href: '/cities/bali' },
    { label: 'Tokyo Guide', href: '/cities/tokyo' },
    { label: 'Paris Guide', href: '/cities/paris' },
    { label: 'Bangkok Guide', href: '/cities/bangkok' },
    { label: 'Dubai Guide', href: '/cities/dubai' },
    { label: 'Goa Guide', href: '/cities/goa' },
  ],
  Travel: [
    { label: 'Trip Planner', href: '/plan' },
    { label: 'Countries', href: '/countries' },
    // Affiliate links pending — re-enable with real URLs, never href="#":
    // { label: 'Hotel Deals', href: '' },
    // { label: 'Flight Search', href: '' },
    // { label: 'Travel Insurance', href: '' },
  ],
  Company: [
    { label: 'About Us', href: '/about' },
    { label: 'Blog', href: '/blog' },
    { label: 'Travel News', href: '/news' },
    { label: 'Contact', href: '/contact' },
    { label: 'Privacy Policy', href: '/privacy-policy' },
    { label: 'Terms of Service', href: '/terms' },
  ],
};

const socials = [
  { icon: X, href: 'https://x.com/tripgenius_in', label: 'X (Twitter)' },
  { icon: Camera, href: 'https://www.instagram.com/tripgenius_in', label: 'Instagram' },
  { icon: PinterestIcon, href: 'https://www.pinterest.com/tripgenius_in', label: 'Pinterest' },
];

export default function Footer() {
  const updated = new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });

  return (
    <footer className="bg-surface border-t border-border">
      {/* Trust bar — quick credibility signals above the footer proper */}
      <div className="border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs text-muted text-center" suppressHydrationWarning>
            <span className="font-semibold text-primary-text">160+ city guides</span>
            <span aria-hidden>·</span>
            <span className="font-semibold text-primary-text">49 countries</span>
            <span aria-hidden>·</span>
            <span>Updated {updated}</span>
            <span aria-hidden>·</span>
            <span>Made in India <Flag emoji="🇮🇳" /></span>
          </p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 group w-fit">
              <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
                <Compass size={16} className="text-white" strokeWidth={2.5} />
              </div>
              <span className="font-heading text-2xl font-semibold text-primary-text">TripGenius</span>
            </Link>
            {/* Consistent entity one-liner — keep identical wording on the About
                page so AI engines see one canonical description of the brand. */}
            <p className="mt-4 text-muted text-sm leading-relaxed max-w-xs">
              TripGenius is a free travel guide platform covering 160+ cities,
              built for Indian and international travellers.
            </p>
            <div className="flex items-center gap-4 mt-6">
              {socials.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-full bg-elevated border border-border flex items-center justify-center text-muted hover:text-accent hover:border-accent transition-all duration-200"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-xs font-semibold uppercase tracking-widest text-muted mb-4">
                {category}
              </h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-primary-text/70 hover:text-primary-text transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted" suppressHydrationWarning>
            © {new Date().getFullYear()} TripGenius. All rights reserved.
          </p>
          <p className="text-lg text-muted italic font-heading">
            The world is waiting.
          </p>
          <div className="flex items-center gap-6 text-xs text-muted">
            <Link href="/privacy-policy" className="hover:text-primary-text transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-primary-text transition-colors">Terms</Link>
            <Link href="/contact" className="hover:text-primary-text transition-colors">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
