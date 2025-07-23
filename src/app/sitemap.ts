import { MetadataRoute } from 'next';
import { generateCompleteSitemap } from '@/lib/sitemap-generator';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Generate complete sitemap using the utility function
  const sitemapEntries = await generateCompleteSitemap();
  
  // Return the sitemap entries in the format expected by Next.js
  return sitemapEntries;
}