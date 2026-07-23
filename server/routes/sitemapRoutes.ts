import { Router, Request, Response } from 'express';
import { prisma } from '../database.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = Router();

/**
 * W25-015: Dynamic Sitemap Generation
 * GET /sitemap.xml
 */
router.get(
  '/sitemap.xml',
  asyncHandler(async (req: Request, res: Response) => {
    const baseUrl = 'https://whitecaves.ae';

    // Fetch active properties
    const properties = await prisma.property.findMany({
      where: { status: 'available' },
      select: { id: true, updatedAt: true },
    });

    // Fetch active jobs
    const jobs = await prisma.jobPosting.findMany({
      where: { isActive: true },
      select: { id: true, updatedAt: true },
    });

    // Start XML
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    // Static URLs
    const staticPages = [
      { url: '/', priority: '1.0', changefreq: 'daily' },
      { url: '/properties', priority: '0.9', changefreq: 'daily' },
      { url: '/careers', priority: '0.8', changefreq: 'weekly' },
      { url: '/about', priority: '0.7', changefreq: 'monthly' },
      { url: '/contact', priority: '0.7', changefreq: 'monthly' },
    ];

    for (const page of staticPages) {
      xml += `  <url>\n`;
      xml += `    <loc>${baseUrl}${page.url}</loc>\n`;
      xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
      xml += `    <priority>${page.priority}</priority>\n`;
      xml += `  </url>\n`;
    }

    // Dynamic Property URLs
    for (const property of properties) {
      xml += `  <url>\n`;
      xml += `    <loc>${baseUrl}/properties/${property.id}</loc>\n`;
      xml += `    <lastmod>${property.updatedAt.toISOString().split('T')[0]}</lastmod>\n`;
      xml += `    <changefreq>daily</changefreq>\n`;
      xml += `    <priority>0.8</priority>\n`;
      xml += `  </url>\n`;
    }

    // Dynamic Job URLs
    for (const job of jobs) {
      xml += `  <url>\n`;
      xml += `    <loc>${baseUrl}/careers/${job.id}</loc>\n`;
      xml += `    <lastmod>${job.updatedAt.toISOString().split('T')[0]}</lastmod>\n`;
      xml += `    <changefreq>weekly</changefreq>\n`;
      xml += `    <priority>0.6</priority>\n`;
      xml += `  </url>\n`;
    }

    xml += '</urlset>';

    res.header('Content-Type', 'application/xml');
    res.send(xml);
  })
);

export default router;
