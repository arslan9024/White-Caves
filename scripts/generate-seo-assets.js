/* eslint-disable no-console, security/detect-non-literal-fs-filename */

/**
 * Generates production SEO assets:
 * - public/sitemap.xml
 * - public/robots.txt
 *
 * Usage:
 *   node scripts/generate-seo-assets.js
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export function resolveDomain(cliDomain) {
  return (cliDomain || process.env.VITE_DOMAIN || 'https://whitecaves.com').replace(/\/$/, '');
}

export function resolveTodayDate() {
  return new Date().toLocaleDateString('en-CA');
}

export function loadRoutes() {
  const routesPath = path.join(process.cwd(), 'scripts', 'seo-routes.json');
  return JSON.parse(fs.readFileSync(routesPath, 'utf-8'));
}

export function buildSitemapXml({ domain, today, routes }) {
  const urls = routes
    .map(route => {
      const loc = `${domain}${route.path}`;
      return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${route.changefreq}</changefreq>\n    <priority>${route.priority}</priority>\n  </url>`;
    })
    .join('\n\n');

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

export function buildRobotsTxt({ domain }) {
  return `# White Caves Real Estate - Robots.txt\n# ${domain}\n\nUser-agent: *\nAllow: /\n\n# Public pages\nAllow: /properties\nAllow: /services\nAllow: /careers\nAllow: /contact\nAllow: /about\nAllow: /buyer/\n\n# Private / operational routes\nDisallow: /admin/\nDisallow: /owner/\nDisallow: /api/\nDisallow: /leasing-agent/\nDisallow: /secondary-sales-agent/\nDisallow: /signin\nDisallow: /select-role\nDisallow: /pending-approval\n\n# Query URLs (reduce duplicate crawl budget)\nDisallow: /*?*\n\nSitemap: ${domain}/sitemap.xml\n`;
}

export function writeFile(relativePath, content) {
  const fullPath = path.join(process.cwd(), relativePath);
  fs.writeFileSync(fullPath, content, 'utf-8');
  return fullPath;
}

export function generateSeoAssets({ cliDomain } = {}) {
  const domain = resolveDomain(cliDomain);
  const today = resolveTodayDate();
  const routes = loadRoutes();

  const sitemapPath = writeFile('public/sitemap.xml', buildSitemapXml({ domain, today, routes }));
  const robotsPath = writeFile('public/robots.txt', buildRobotsTxt({ domain }));

  return { sitemapPath, robotsPath, domain, today };
}

function runCli() {
  try {
    const cliDomain = process.argv.find(arg => arg.startsWith('--domain='))?.split('=')[1];
    const { sitemapPath, robotsPath, domain, today } = generateSeoAssets({ cliDomain });

    console.log('✅ SEO assets generated successfully:');
    console.log(`   - ${sitemapPath}`);
    console.log(`   - ${robotsPath}`);
    console.log(`🌐 Domain: ${domain}`);
    console.log(`📅 Last modified date: ${today}`);
  } catch (error) {
    console.error('❌ Failed to generate SEO assets:', error.message || error);
    process.exit(1);
  }
}

const currentPath = fileURLToPath(import.meta.url);
if (process.argv[1] && path.resolve(process.argv[1]) === currentPath) {
  runCli();
}
