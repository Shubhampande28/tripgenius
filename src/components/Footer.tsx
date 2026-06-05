import Link from 'next/link';
import { Compass, X, Camera, Play, GitBranch } from 'lucide-react';

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
    { label: 'Hotel Deals', href: '#' },
    { label: 'Flight Search', href: '#' },
    { label: 'Travel Insurance', href: '#' },
  ],
  Company: [
    { label: 'About Us', href: '/about' },
    { label: 'Blog', href: '/blog' },
    { label: 'Contact', href: '/contact' },
    { label: 'Privacy Policy', href: '/privacy-policy' },
    { label: 'Terms of Service', href: '/terms' },
  ],
};

const socials = [
  { icon: X, href: '#', label: 'X (Twitter)' },
  { icon: Camera, href: '#', label: 'Instagram' },
  { icon: Play, href: '#', label: 'YouTube' },
  { icon: GitBranch, href: '#', label: 'GitHub' },
];

export default function Footer() {
  return (
    <footer className="bg-surface border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 group w-fit">
              <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
                <Compass size={16} className="text-white" strokeWidth={2.5} />
              </div>
              <span className="font-heading text-2xl font-semibold text-primary-text">TripGenius</span>
            </Link>
            <p className="mt-4 text-muted text-sm leading-relaxed max-w-xs">
              Premium travel guides for every kind of explorer. Discover the world with
              confidence — from the iconic sights to the places only locals know.
            </p>
            <div className="flex items-center gap-4 mt-6">
              {socials.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
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
