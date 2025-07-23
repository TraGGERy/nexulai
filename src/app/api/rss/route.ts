import { db } from '../../../../db';
import { reports } from '../../../../db/schema';
import { desc } from 'drizzle-orm';

export async function GET() {
  try {
    // Fetch the 20 most recent reports for the RSS feed
    const recentReports = await db
      .select({
        id: reports.id,
        title: reports.title,
        type: reports.type,
        createdAt: reports.createdAt,
        content: reports.content,
      })
      .from(reports)
      .orderBy(desc(reports.createdAt))
      .limit(20);

    // Generate the RSS feed XML
    const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Nexus AI Consulting</title>
    <link>https://nexusaiconsulting.com</link>
    <description>Revolutionary AI-powered consulting platform delivering McKinsey-quality insights in just 15 minutes.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="https://nexusaiconsulting.com/api/rss" rel="self" type="application/rss+xml" />
    ${recentReports.map((report) => {
      // Parse the content to extract a summary
      let summary = '';
      try {
        const content = typeof report.content === 'string' 
          ? JSON.parse(report.content) 
          : report.content;
        
        summary = content.summary || '';
        // Limit summary to 150 characters
        if (summary.length > 150) {
          summary = summary.substring(0, 147) + '...';
        }
      } catch (e) {
        console.error('Error parsing report content:', e);
      }

      return `
    <item>
      <title>${escapeXml(report.title)}</title>
      <link>https://nexusaiconsulting.com/reports/${report.id}</link>
      <guid>https://nexusaiconsulting.com/reports/${report.id}</guid>
      <pubDate>${new Date(report.createdAt).toUTCString()}</pubDate>
      <category>${escapeXml(report.type)}</category>
      <description>${escapeXml(summary)}</description>
    </item>`;
    }).join('')}
  </channel>
</rss>`;

    // Return the XML with appropriate headers
    return new Response(rssXml, {
      headers: {
        'Content-Type': 'application/rss+xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600'
      },
    });
  } catch (error) {
    console.error('Error generating RSS feed:', error);
    return new Response('Error generating RSS feed', { status: 500 });
  }
}

// Helper function to escape XML special characters
function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}