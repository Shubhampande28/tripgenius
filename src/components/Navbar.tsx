'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sun, Moon, ChevronDown, Sparkles } from 'lucide-react';
import { useSyncExternalStore } from 'react';

const THEME_EVENT = 'tripgenius-theme-change';
function getSnap() {
  if (typeof document === 'undefined') return true;
  return document.documentElement.classList.contains('light');
}
function subTheme(cb: () => void) {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener(THEME_EVENT, cb);
  window.addEventListener('storage', cb);
  return () => { window.removeEventListener(THEME_EVENT, cb); window.removeEventListener('storage', cb); };
}

// Destination sub-menu categories
const DEST_MENU = [
  { label: '🌍 Browse by Country', href: '/countries' },
  { label: 'India',                href: '/countries/india' },
  { label: 'Asia',                 href: '/cities?region=Asia' },
  { label: 'Europe',               href: '/cities?region=Europe' },
  { label: 'Americas',             href: '/cities?region=Americas' },
  { label: 'All Cities',           href: '/destinations' },
];

export default function Navbar() {
  const [scrolled, setScrolled]       = useState(false);
  const [mobileOpen, setMobileOpen]   = useState(false);
  const [destOpen, setDestOpen]       = useState(false);
  const isLight = useSyncExternalStore(subTheme, getSnap, () => true);
  const router  = useRouter();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  function toggleTheme() {
    const next = !isLight;
    if (next) { document.documentElement.classList.add('light'); localStorage.setItem('theme', 'light'); }
    else       { document.documentElement.classList.remove('light'); localStorage.setItem('theme', 'dark'); }
    window.dispatchEvent(new Event(THEME_EVENT));
  }

  function NavDropdown({ label, items, open, setOpen }: {
    label: string; items: {label:string; href:string}[];
    open: boolean; setOpen: (v:boolean) => void;
  }) {
    return (
      <div className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
        <button
          aria-haspopup="true"
          aria-expanded={open}
          className="flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium text-muted hover:text-primary-text hover:bg-elevated transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          {label} <ChevronDown size={13} className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
        </button>
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity:0, y:6 }}
              animate={{ opacity:1, y:0 }}
              exit={{ opacity:0, y:6 }}
              transition={{ duration:0.15 }}
              className="absolute top-full left-0 mt-1 w-48 glass-card rounded-xl overflow-hidden z-50"
            >
              {items.map(item => (
                <Link key={item.label} href={item.href}
                  onClick={() => setOpen(false)}
                  className="block px-4 py-2.5 text-sm text-muted hover:text-primary-text hover:bg-elevated transition-colors">
                  {item.label}
                </Link>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-[background-color,border-color,box-shadow] duration-300 ${
          scrolled ? 'navbar-scrolled bg-dark/95 backdrop-blur-xl border-b border-border/40 shadow-sm' : 'bg-transparent'
        }`}
      >
        {/* Max 1280px container */}
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-[116px]">

            {/* Logo — 60px height */}
            <Link href="/" className="flex items-center flex-shrink-0 group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo.png"
                alt="TripGenius"
                className="h-[110px] w-auto object-contain group-hover:opacity-90 transition-opacity"
              />
            </Link>

            {/* Desktop nav — centered */}
            <nav className="hidden lg:flex items-center gap-1">
              <NavDropdown label="Destinations" items={DEST_MENU} open={destOpen} setOpen={setDestOpen} />
              <Link href="/blog"
                className="px-4 py-2 rounded-lg text-sm font-medium text-muted hover:text-primary-text hover:bg-elevated transition-colors duration-150">
                Blog
              </Link>
              <Link href="/news"
                className="px-4 py-2 rounded-lg text-sm font-medium text-muted hover:text-primary-text hover:bg-elevated transition-colors duration-150">
                News
              </Link>
              <Link href="/compare/goa-vs-bali"
                className="px-4 py-2 rounded-lg text-sm font-medium text-muted hover:text-primary-text hover:bg-elevated transition-colors duration-150">
                Compare
              </Link>
            </nav>

            {/* Right — theme toggle + CTAs */}
            <div className="hidden lg:flex items-center gap-3">
              <button
                onClick={toggleTheme}
                aria-label={isLight ? 'Switch to dark mode' : 'Switch to light mode'}
                className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border hover:border-accent/40 bg-surface hover:bg-elevated text-muted hover:text-primary-text transition-all duration-200 text-xs font-medium"
              >
                {isLight ? <><Moon size={13} strokeWidth={2} /> Dark</> : <><Sun size={13} strokeWidth={2} /> Light</>}
              </button>
              <Link href="/plan" className="btn btn-tertiary">
                <Sparkles size={14} />
                Plan a Trip
              </Link>
              <Link href="/destinations" className="btn btn-primary">
                Explore Guides
              </Link>
            </div>

            {/* Mobile */}
            <div className="lg:hidden flex items-center gap-2">
              <button
                onClick={toggleTheme}
                aria-label={isLight ? 'Switch to dark mode' : 'Switch to light mode'}
                className="p-2 rounded-lg border border-border text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                {isLight ? <Moon size={16} /> : <Sun size={16} />}
              </button>
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={mobileOpen}
                className="p-2 text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity:0, y:-8 }}
            animate={{ opacity:1, y:0 }}
            exit={{ opacity:0, y:-8 }}
            transition={{ duration:0.18 }}
            className="fixed inset-x-0 top-24 z-40 bg-dark/96 backdrop-blur-xl border-b border-border lg:hidden"
          >
            <div className="max-w-[1280px] mx-auto px-6 py-5 space-y-1">
              {[
                { label:'Home',         href:'/' },
                { label:'Countries',    href:'/countries' },
                { label:'Blog',         href:'/blog' },
                { label:'News',         href:'/news' },
                { label:'Compare',      href:'/compare/goa-vs-bali' },
              ].map(l => (
                <Link key={l.label} href={l.href} onClick={() => setMobileOpen(false)}
                  className="block px-4 py-3 rounded-lg text-base font-medium text-primary-text hover:text-accent hover:bg-elevated transition-colors">
                  {l.label}
                </Link>
              ))}
              <div className="pt-3 border-t border-border space-y-2">
                <Link href="/plan" onClick={() => setMobileOpen(false)}
                  className="btn btn-tertiary w-full">
                  <Sparkles size={15} />
                  Plan a Trip
                </Link>
                <Link href="/destinations" onClick={() => setMobileOpen(false)}
                  className="btn btn-primary w-full">
                  Explore Guides
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
