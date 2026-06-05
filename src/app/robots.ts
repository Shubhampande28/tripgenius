import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/plan', '/_next/', '/cheatsheet/'],
      },
    ],
    sitemap: 'https://www.tripgenius.in/sitemap.xml',
    host: 'https://www.tripgenius.in',
  };
}
