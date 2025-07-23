import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Nexus AI Consulting',
    short_name: 'Nexus AI',
    description: 'AI-powered business consulting delivering McKinsey-quality insights in minutes',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#6D28D9',
    icons: [
      {
        src: '/icons/icon-192x192.svg',
        sizes: '192x192',
        type: 'image/svg+xml',
        purpose: 'any',
      },
      {
        src: '/icons/icon-512x512.svg',
        sizes: '512x512',
        type: 'image/svg+xml',
        purpose: 'any',
      },
    ],
  };
}