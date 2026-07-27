'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sun, Moon, ChevronDown, ChevronRight, Sparkles } from 'lucide-react';
import { useSyncExternalStore } from 'react';
import indiaNavIndexRaw from '@/data/indiaNavIndex.json';
import globalNavIndexRaw from '@/data/globalNavIndex.json';

type IndiaStateGroup = { state: string; cities: { name: string; slug: string }[] };
const INDIA_STATES = indiaNavIndexRaw as IndiaStateGroup[];

type NavCity = { name: string; slug: string };
type NavGroup = { name: string; cities: NavCity[] };
type NavCountry = { countrySlug: string; countryLabel: string; groups: NavGroup[] };
const GLOBAL_NAV_INDEX = globalNavIndexRaw as NavCountry[];

// Unified shape used to render level 2 / level 3 of the Destinations dropdown,
// regardless of whether the data came from indiaNavIndex.json (India's
// state cascade) or globalNavIndex.json (the other cascading countries).
type CascadeGroup = { name: string; cities: NavCity[] };
function getCascadeGroups(key: string): CascadeGroup[] | null {
  if (key === 'india') {
    return INDIA_STATES.map((s) => ({ name: s.state, cities: s.cities }));
  }
  const country = GLOBAL_NAV_INDEX.find((c) => c.countrySlug === key);
  return country ? country.groups : null;
}

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
  { label: 'India',                href: '/countries/india', key: 'india' },
  { label: 'Thailand',             href: '/countries/thailand', key: 'thailand' },
  { label: 'Indonesia',            href: '/countries/indonesia', key: 'indonesia' },
  { label: 'UAE',                  href: '/countries/uae', key: 'uae' },
  { label: 'Vietnam',              href: '/countries/vietnam', key: 'vietnam' },
  { label: 'Sri Lanka',            href: '/countries/sri-lanka', key: 'sri-lanka' },
  { label: 'Nepal',                href: '/countries/nepal', key: 'nepal' },
  { label: 'Singapore',            href: '/countries/singapore', key: 'singapore' },
  { label: 'Asia',                 href: '/cities?region=Asia' },
  { label: 'Europe',               href: '/cities?region=Europe' },
  { label: 'Americas',             href: '/cities?region=Americas' },
  { label: 'All Cities',           href: '/destinations' },
];

const CASCADE_KEYS = new Set(['india', 'thailand', 'indonesia', 'uae', 'vietnam', 'sri-lanka', 'nepal', 'singapore']);

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

  function DestinationsMenu({ open, setOpen }: { open: boolean; setOpen: (v:boolean) => void }) {
    const ref = useRef<HTMLDivElement>(null);
    const [hoveredKey, setHoveredKey]     = useState<string | null>(null);
    const [hoveredState, setHoveredState] = useState<string | null>(null);

    useEffect(() => {
      if (!open) return;
      function onClickOutside(e: MouseEvent) {
        if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
      }
      document.addEventListener('mousedown', onClickOutside);
      return () => document.removeEventListener('mousedown', onClickOutside);
    }, [open, setOpen]);

    function close() {
      setOpen(false);
      setHoveredKey(null);
      setHoveredState(null);
    }

    const cascadeGroups = hoveredKey ? getCascadeGroups(hoveredKey) : null;
    // When a country has no region breakdown, globalNavIndex.json gives it a
    // single group with an empty name — treat that as "flat city list", i.e.
    // skip the region column entirely and go straight to cities.
    const isFlatCascade = !!cascadeGroups && cascadeGroups.length === 1 && cascadeGroups[0].name === '';
    const flatCities = isFlatCascade ? cascadeGroups![0].cities : [];

    const activeGroupCities = hoveredState && cascadeGroups
      ? cascadeGroups.find((g) => g.name === hoveredState)?.cities ?? []
      : [];

    return (
      <div
        ref={ref}
        className="relative"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => { setOpen(false); setHoveredKey(null); setHoveredState(null); }}
      >
        <button
          type="button"
          onClick={() => setOpen(!open)}
          aria-haspopup="true"
          aria-expanded={open}
          className="flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium text-muted hover:text-primary-text hover:bg-elevated transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          Destinations <ChevronDown size={13} className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
        </button>
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity:0, y:6 }}
              animate={{ opacity:1, y:0 }}
              exit={{ opacity:0, y:6 }}
              transition={{ duration:0.15 }}
              className="absolute top-full left-0 mt-1 flex items-start z-50"
            >
              {/* Level 1 — top categories */}
              <div className="w-56 glass-card rounded-xl overflow-hidden">
                {DEST_MENU.map(item => (
                  <div key={item.label} onMouseEnter={() => setHoveredKey(item.key ?? null)}>
                    <Link
                      href={item.href}
                      onClick={close}
                      className={`flex items-center justify-between px-4 py-2.5 text-sm transition-colors ${
                        hoveredKey === item.key && item.key ? 'bg-elevated text-primary-text' : 'text-muted hover:text-primary-text hover:bg-elevated'
                      }`}
                    >
                      {item.label}
                      {item.key && CASCADE_KEYS.has(item.key) && <ChevronRight size={13} />}
                    </Link>
                  </div>
                ))}
              </div>

              {/* Level 2 — regions (or, for countries with no region data, the flat city list) */}
              {hoveredKey && cascadeGroups && !isFlatCascade && (
                <div className="w-56 max-h-96 overflow-y-auto glass-card rounded-xl overflow-hidden ml-1">
                  {cascadeGroups.map(g => (
                    <div
                      key={g.name}
                      onMouseEnter={() => setHoveredState(g.name)}
                      className={`flex items-center justify-between px-4 py-2.5 text-sm cursor-default transition-colors ${
                        hoveredState === g.name ? 'bg-elevated text-primary-text' : 'text-muted'
                      }`}
                    >
                      {g.name}
                      <ChevronRight size={13} />
                    </div>
                  ))}
                </div>
              )}

              {hoveredKey && isFlatCascade && flatCities.length > 0 && (
                <div className="w-56 max-h-96 overflow-y-auto glass-card rounded-xl overflow-hidden ml-1">
                  {flatCities.map(city => (
                    <Link
                      key={city.slug}
                      href={`/cities/${city.slug}`}
                      onClick={close}
                      className="block px-4 py-2.5 text-sm text-muted hover:text-primary-text hover:bg-elevated transition-colors"
                    >
                      {city.name}
                    </Link>
                  ))}
                </div>
              )}

              {/* Level 3 — cities in the hovered region (only when regions exist) */}
              {hoveredKey && !isFlatCascade && hoveredState && activeGroupCities.length > 0 && (
                <div className="w-56 max-h-96 overflow-y-auto glass-card rounded-xl overflow-hidden ml-1">
                  {activeGroupCities.map(city => (
                    <Link
                      key={city.slug}
                      href={`/cities/${city.slug}`}
                      onClick={close}
                      className="block px-4 py-2.5 text-sm text-muted hover:text-primary-text hover:bg-elevated transition-colors"
                    >
                      {city.name}
                    </Link>
                  ))}
                </div>
              )}
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
              <DestinationsMenu open={destOpen} setOpen={setDestOpen} />
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
              <Link href="/" onClick={() => setMobileOpen(false)}
                className="block px-4 py-3 rounded-lg text-base font-medium text-primary-text hover:text-accent hover:bg-elevated transition-colors">
                Home
              </Link>

              <div className="px-4 pt-2 pb-1 text-xs font-semibold uppercase tracking-wide text-muted">
                Destinations
              </div>
              {DEST_MENU.map(l => (
                <Link key={l.label} href={l.href} onClick={() => setMobileOpen(false)}
                  className="block px-4 py-3 rounded-lg text-base font-medium text-primary-text hover:text-accent hover:bg-elevated transition-colors">
                  {l.label}
                </Link>
              ))}

              {[
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
