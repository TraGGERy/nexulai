#!/usr/bin/env node

/**
 * This script generates a static sitemap.xml file in the public directory.
 * It can be run manually or as part of the build process.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Define the sitemap content with the main pages
const generateSitemap = () => {
  const currentDate = new Date().toISOString().split('T')[0];
  
  // Define static routes
  const routes = [
    { url: '/', lastmod: currentDate, priority: '1.0', changefreq: 'weekly' },
    { url: '/solutions', lastmod: currentDate, priority: '0.8', changefreq: 'monthly' },
    { url: '/ai-tools', lastmod: currentDate, priority: '0.8', changefreq: 'monthly' },
    { url: '/pricing', lastmod: currentDate, priority: '0.9', changefreq: 'monthly' },
  ];

  // Generate XML
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map(
    (route) => `  <url>
    <loc>https://nexusaiconsulting.com${route.url}</loc>
    <lastmod>${route.lastmod}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

  return sitemap;
};

// Write the sitemap to the public directory
const writeSitemap = () => {
  const sitemap = generateSitemap();
  const publicDir = path.join(process.cwd(), 'public');
  const sitemapPath = path.join(publicDir, 'sitemap.xml');

  // Ensure the public directory exists
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  // Write the sitemap file
  fs.writeFileSync(sitemapPath, sitemap);
  console.log(`✅ Sitemap generated at ${sitemapPath}`);
};

// Main execution
try {
  writeSitemap();
} catch (error) {
  console.error('❌ Error generating sitemap:', error);
  process.exit(1);
}