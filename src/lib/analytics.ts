declare global {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  interface Window { gtag?: (...args: any[]) => void; }
}

export function trackEvent(name: string, params?: Record<string, unknown>): void {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', name, params ?? {});
  }
}
