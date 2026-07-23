import { Router, type Request, type Response } from 'express';
import { prisma } from '../database.js';
import logger from '../utils/logger.js';

const router = Router();

const STATIC_PATHS = [
  '/',
  '/about',
  '/services',
  '/careers',
  '/contact',
  '/properties',
  '/privacy-policy',
  '/terms',
];

const escapeXml = (value: string): string =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');

const resolvePublicDomain = (req: Request): string => {
  if (process.env.VITE_DOMAIN && process.env.VITE_DOMAIN.trim().length > 0) {
    return process.env.VITE_DOMAIN.replace(/\/+$/, '');
  }
  const protocol = req.protocol || 'https';
  const host = req.get('host') || 'whitecaves.com';
  return `${protocol}://${host}`;
};

router.get('/sitemap.xml', async (_req: Request, res: Response) => {
  const domain = resolvePublicDomain(_req);
  const nowIso = new Date().toISOString();

  try {
    const availableProperties = await prisma.property.findMany({
      where: {
        OR: [{ status: 'available' }, { status: 'Available' }],
      },
      select: { id: true, updatedAt: true },
      orderBy: { updatedAt: 'desc' },
      take: 5000,
    });

    const staticUrls = STATIC_PATHS.map(
      path => `
  <url>
    <loc>${escapeXml(`${domain}${path}`)}</loc>
    <lastmod>${nowIso}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${path === '/' ? '1.0' : '0.8'}</priority>
  </url>`
    );

    const propertyUrls = availableProperties.map(
      property => `
  <url>
    <loc>${escapeXml(`${domain}/property/${property.id}`)}</loc>
    <lastmod>${(property.updatedAt ?? new Date()).toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>`
    );

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${[...staticUrls, ...propertyUrls].join('')}
</urlset>`;

    res.type('application/xml').status(200).send(xml);
  } catch (error) {
    logger.warn('Failed to generate dynamic sitemap, serving static entries only', {
      error: error instanceof Error ? error.message : String(error),
    });

    const fallbackXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${STATIC_PATHS.map(
      path => `
  <url>
    <loc>${escapeXml(`${domain}${path}`)}</loc>
    <lastmod>${nowIso}</lastmod>
  </url>`
    ).join('')}
</urlset>`;
    res.type('application/xml').status(200).send(fallbackXml);
  }
});

export default router;
