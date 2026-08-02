/**
 * app/sitemap.ts — Dynamic SEO Sitemap Generator (Next.js 15 App Router)
 *
 * Automatically generates sitemap.xml for search engines (Google Dubai, Bing).
 * Pulls active property IDs dynamically from Prisma.
 */

import type { MetadataRoute } from 'next';
import { prisma, safeQuery } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://whitecaves.ae';

  // Fetch active property IDs
  const propertyIds = await safeQuery(
    async (db) => {
      // @ts-expect-error — model inferred at runtime
      const properties = await db.property.findMany({
        select: { id: true, updatedAt: true },
        take: 1000,
      });
      return properties as { id: string; updatedAt?: Date }[];
    },
    []
  );

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/properties`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/properties/search`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
  ];

  const propertyRoutes: MetadataRoute.Sitemap = propertyIds.map((p) => ({
    url: `${baseUrl}/properties/${p.id}`,
    lastModified: p.updatedAt ? new Date(p.updatedAt) : new Date(),
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  return [...staticRoutes, ...propertyRoutes];
}
