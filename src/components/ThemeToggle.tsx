'use client';

import { useSyncExternalStore } from 'react';
import { Sun, Moon } from 'lucide-react';

const THEME_EVENT = 'tripgenius-theme-change';

function getThemeSnapshot() {
  if (typeof document === 'undefined') return true;
  return document.documentElement.classList.contains('light');
}

function subscribeTheme(listener: () => void) {
  if (typeof window === 'undefined') return () => {};

  window.addEventListener(THEME_EVENT, listener);
  window.addEventListener('storage', listener);

  return () => {
    window.removeEventListener(THEME_EVENT, listener);
    window.removeEventListener('storage', listener);
  };
}

export default function ThemeToggle() {
  const isLight = useSyncExternalStore(subscribeTheme, getThemeSnapshot, () => true);

  function toggle() {
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
    <button
      onClick={toggle}
      aria-label={isLight ? 'Switch to dark mode' : 'Switch to light mode'}
      className="relative w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 border border-border hover:border-accent/50 bg-surface hover:bg-elevated text-muted hover:text-primary-text"
    >
      {isLight ? <Moon size={16} strokeWidth={2} /> : <Sun size={16} strokeWidth={2} />}
    </button>
  );
}
