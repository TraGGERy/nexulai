import { db } from '../../db';
import { reports } from '../../db/schema';
import { desc } from 'drizzle-orm';

export interface SitemapEntry {
  url: string;
  lastModified: Date;
  changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
}

/**
 * Fetches report entries for the sitemap
 * @returns Array of sitemap entries for reports
 */
export async function getReportEntries(): Promise<SitemapEntry[]> {
  try {
    // Fetch all report IDs for dynamic routes
    const reportIds = await db
      .select({ id: reports.id, updatedAt: reports.updatedAt })
      .from(reports)
      .orderBy(desc(reports.createdAt))
      .limit(1000);

    // Define interface for report object
    interface ReportEntry {
      id: number;
      updatedAt: Date;
    }

    // Create entries for dynamic report routes
    return reportIds.map((report: ReportEntry) => ({
      url: `https://nexusaiconsulting.com/reports/${report.id}`,
      lastModified: new Date(report.updatedAt),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }));
  } catch (error) {
    console.error('Error fetching report entries for sitemap:', error);
    return [];
  }
}

/**
 * Gets static sitemap entries
 * @returns Array of static sitemap entries
 */
export function getStaticEntries(): SitemapEntry[] {
  const currentDate = new Date();
  
  return [
    {
      url: 'https://nexusaiconsulting.com',
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 1.0,
    },
    {
      url: 'https://nexusaiconsulting.com/solutions',
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: 'https://nexusaiconsulting.com/ai-tools',
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: 'https://nexusaiconsulting.com/pricing',
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    },
  ];
}

/**
 * Generates a complete sitemap with both static and dynamic entries
 * @returns Combined array of all sitemap entries
 */
export async function generateCompleteSitemap(): Promise<SitemapEntry[]> {
  const staticEntries = getStaticEntries();
  const reportEntries = await getReportEntries();
  
  return [...staticEntries, ...reportEntries];
}

/**
 * Converts sitemap entries to XML format
 * @param entries Array of sitemap entries
 * @returns XML string
 */
export function generateSitemapXml(entries: SitemapEntry[]): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${entries.map(entry => `
  <url>
    <loc>${entry.url}</loc>
    <lastmod>${entry.lastModified.toISOString().split('T')[0]}</lastmod>
    <changefreq>${entry.changeFrequency}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`).join('')}
</urlset>`;
}