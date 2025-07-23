import { generateCompleteSitemap, generateSitemapXml } from '@/lib/sitemap-generator';

export async function GET() {
  try {
    // Generate complete sitemap using the utility function
    const sitemapEntries = await generateCompleteSitemap();
    
    // Convert entries to XML format
    const sitemap = generateSitemapXml(sitemapEntries);

    // Return the XML with appropriate headers
    return new Response(sitemap, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600'
      }
    });
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return new Response('Error generating sitemap', {
      status: 500,
      headers: {
        'Content-Type': 'text/plain'
      }
    });
  }
}