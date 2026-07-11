import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  // /plan and /cheatsheet are interactive tools (thin for crawlers); /api/ and
  // /_next/ are non-content. Nothing else is blocked for anyone.
  const disallow = ['/api/', '/plan', '/_next/', '/cheatsheet/', '/admin'];
  return {
    rules: [
      // AI search & citation crawlers — explicitly allowed so the policy is
      // unambiguous. Blocking any of these would prevent that engine from
      // reading or citing TripGenius.
      { userAgent: 'GPTBot', allow: '/', disallow },
      { userAgent: 'ChatGPT-User', allow: '/', disallow },
      { userAgent: 'ClaudeBot', allow: '/', disallow },
      { userAgent: 'anthropic-ai', allow: '/', disallow },
      { userAgent: 'PerplexityBot', allow: '/', disallow },
      { userAgent: 'Google-Extended', allow: '/', disallow },
      { userAgent: 'Bingbot', allow: '/', disallow },
      { userAgent: '*', allow: '/', disallow },
    ],
    sitemap: 'https://www.tripgenius.in/sitemap.xml',
    host: 'https://www.tripgenius.in',
  };
}
