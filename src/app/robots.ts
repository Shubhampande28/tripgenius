import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/plan', '/_next/', '/cheatsheet/'],
      },
      {
        // Allow Googlebot full access to city pages
        userAgent: 'Googlebot',
        allow: ['/cities/', '/'],
        disallow: ['/api/', '/_next/'],
      },
    ],
    sitemap: 'https://www.tripgenius.in/sitemap.xml',
    host: 'https://www.tripgenius.in',
  };
}
