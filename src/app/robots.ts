import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/dashboard/',
        '/reports/',
        '/settings/',
        '/api/',
        '/sign-in/',
        '/sign-up/',
      ],
    },
    sitemap: 'https://nexusaiconsulting.com/sitemap.xml',
  };
}