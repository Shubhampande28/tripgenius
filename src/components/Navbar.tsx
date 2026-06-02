'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Compass, Sun, Moon, Globe } from 'lucide-react';
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

const navLinks = [
  { label: 'Home',         href: '/' },
  { label: 'Destinations', href: '/cities' },
  { label: 'Blog',         href: '/blog' },
  { label: 'Compare',      href: '/compare/goa-vs-bali' },
];

export default function Navbar() {
  const [scrolled, setScrolled]     = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const isLight = useSyncExternalStore(subTheme, getSnap, () => true);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  function toggleTheme() {
    const next = !isLight;
    if (next) {
      document.documentElement.classList.add('light');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.classList.remove('light');
      localStorage.setItem('theme', 'dark');
    }
    window.dispatchEvent(new Event(THEME_EVENT));
  }

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-dark/92 backdrop-blur-xl border-b border-border/40 shadow-sm'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-18">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group flex-shrink-0">
              <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center group-hover:scale-105 transition-transform">
                <Compass size={15} className="text-white" strokeWidth={2.5} />
              </div>
              <span className="font-heading text-xl font-semibold text-primary-text tracking-tight">
                TripGenius
              </span>
            </Link>

            {/* Desktop nav — centered */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-muted hover:text-primary-text hover:bg-elevated transition-all duration-150"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Right: theme toggle + CTA */}
            <div className="hidden md:flex items-center gap-3">

              {/* Theme toggle — labelled so users know what it does */}
              <button
                onClick={toggleTheme}
                aria-label={isLight ? 'Switch to dark mode' : 'Switch to light mode'}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border hover:border-accent/40 bg-surface hover:bg-elevated text-muted hover:text-primary-text transition-all duration-200 text-xs font-medium"
              >
                {isLight
                  ? <><Moon size={13} strokeWidth={2} /> Dark</>
                  : <><Sun size={13} strokeWidth={2} /> Light</>
                }
              </button>

              {/* Primary CTA */}
              <Link
                href="/destinations"
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-accent text-white text-sm font-semibold hover:bg-accent/90 transition-colors"
              >
                <Globe size={13} />
                All Guides
              </Link>
            </div>

            {/* Mobile */}
            <div className="md:hidden flex items-center gap-2">
              <button
                onClick={toggleTheme}
                aria-label={isLight ? 'Dark mode' : 'Light mode'}
                className="p-2 rounded-lg border border-border text-muted hover:text-primary-text transition-colors"
              >
                {isLight ? <Moon size={16} strokeWidth={2} /> : <Sun size={16} strokeWidth={2} />}
              </button>
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="p-2 text-muted hover:text-primary-text transition-colors"
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-x-0 top-16 z-40 bg-dark/96 backdrop-blur-xl border-b border-border md:hidden"
          >
            <div className="px-4 py-5 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block px-4 py-3 rounded-lg text-base font-medium text-primary-text hover:text-accent hover:bg-elevated transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-3 border-t border-border mt-2">
                <Link
                  href="/destinations"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center gap-2 py-3 rounded-lg bg-accent text-white font-semibold"
                >
                  <Globe size={15} /> All Guides
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
