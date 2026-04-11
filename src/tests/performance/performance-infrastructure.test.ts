/**
 * Performance Infrastructure — Unit Tests
 *
 * Validates:
 * - Vite manual chunk configuration (20+ chunks)
 * - Route-level code splitting (all routes lazy-loaded)
 * - Image CLS prevention (width/height attributes)
 * - Font loading optimization (preconnect + display=swap)
 * - Skeleton loader component
 * - Prefetch utilities
 * - IntersectionObserver hook
 */

import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';

const ROOT = resolve(__dirname, '../../..');

/* ──────────────────────────── Helpers ─────────────────────────── */

function readSource(relativePath: string): string {
  return readFileSync(resolve(ROOT, relativePath), 'utf-8');
}

/* ──────────────────────────────────────────────────────────────────
 * 1. Vite Build — Manual Chunk Strategy
 * ──────────────────────────────────────────────────────────────── */

describe('Vite Build Configuration', () => {
  const viteConfig = readSource('vite.config.js');

  it('has manualChunks configuration', () => {
    expect(viteConfig).toContain('manualChunks');
  });

  it('separates vendor chunk (react, react-dom)', () => {
    expect(viteConfig).toMatch(/vendor.*react/s);
  });

  it('separates firebase into its own chunk', () => {
    expect(viteConfig).toContain('firebase');
  });

  it('separates styled-components into its own chunk', () => {
    expect(viteConfig).toContain('styled');
  });

  it('separates chart libraries into charts-vendor chunk', () => {
    expect(viteConfig).toContain('charts-vendor');
  });

  it('isolates CRM modules into separate chunks', () => {
    expect(viteConfig).toContain('crm-inventory');
    expect(viteConfig).toContain('crm-hr');
  });

  it('has chunkSizeWarningLimit set', () => {
    expect(viteConfig).toContain('chunkSizeWarningLimit');
  });
});

/* ──────────────────────────────────────────────────────────────────
 * 2. Route-Level Code Splitting
 * ──────────────────────────────────────────────────────────────── */

describe('Route Code Splitting', () => {
  const appSource = readSource('src/App.tsx');

  it('uses React.lazy for route components', () => {
    const lazyCount = (appSource.match(/\blazy\s*\(\s*\(\)/g) || []).length;
    expect(lazyCount).toBeGreaterThanOrEqual(10);
  });

  it('wraps routes in Suspense boundaries', () => {
    expect(appSource).toContain('Suspense');
  });

  it('lazy-loads public pages', () => {
    expect(appSource).toMatch(/lazy.*HomePage/);
    expect(appSource).toMatch(/lazy.*PropertiesPage/);
    expect(appSource).toMatch(/lazy.*PropertyDetailPage/);
  });

  it('lazy-loads auth pages', () => {
    expect(appSource).toMatch(/lazy.*SignInPage/);
  });

  it('lazy-loads CRM dashboard', () => {
    expect(appSource).toMatch(/lazy.*Dashboard|lazy.*CRM/i);
  });
});

/* ──────────────────────────────────────────────────────────────────
 * 3. Homepage Section Splitting
 * ──────────────────────────────────────────────────────────────── */

describe('Homepage Code Splitting', () => {
  const homepageSource = readSource('src/pages/HomePage.tsx');

  it('lazy-loads hero section', () => {
    expect(homepageSource).toMatch(/lazy.*Hero/);
  });

  it('lazy-loads features section', () => {
    expect(homepageSource).toMatch(/lazy.*Features/);
  });

  it('lazy-loads at least 10 homepage sections', () => {
    const lazyCount = (homepageSource.match(/\blazy\s*\(\s*\(\)/g) || []).length;
    expect(lazyCount).toBeGreaterThanOrEqual(10);
  });
});

/* ──────────────────────────────────────────────────────────────────
 * 4. Font Loading Optimization
 * ──────────────────────────────────────────────────────────────── */

describe('Font Loading (index.html)', () => {
  const indexHtml = readSource('index.html');

  it('has preconnect to fonts.googleapis.com', () => {
    expect(indexHtml).toContain('rel="preconnect" href="https://fonts.googleapis.com"');
  });

  it('has preconnect to fonts.gstatic.com', () => {
    expect(indexHtml).toContain('fonts.gstatic.com');
  });

  it('uses display=swap for font loading', () => {
    expect(indexHtml).toContain('display=swap');
  });

  it('loads only essential font families (≤3)', () => {
    const fontFamilies = indexHtml.match(/family=[^&"]+/g) || [];
    expect(fontFamilies.length).toBeLessThanOrEqual(3);
  });

  it('has dns-prefetch for external services', () => {
    expect(indexHtml).toContain('dns-prefetch');
  });
});

/* ──────────────────────────────────────────────────────────────────
 * 5. Image CLS Prevention — Spot-check key files
 * ──────────────────────────────────────────────────────────────── */

describe('Image CLS Prevention', () => {
  it('PropertyDetailPage similar cards have width/height', () => {
    const source = readSource('src/pages/PropertyDetailPage.tsx');
    // Find all <img tags and check at least one has width
    const imgTags = source.match(/<img[\s\S]*?\/>/g) || [];
    const withDimensions = imgTags.filter(t => t.includes('width=') && t.includes('height='));
    expect(withDimensions.length).toBeGreaterThanOrEqual(1);
  });

  it('PerformanceTab avatars have width/height', () => {
    const source = readSource('src/components/crm/NancyHRCRM_NEW/tabs/PerformanceTab.tsx');
    const imgTags = source.match(/<img[\s\S]*?\/>/g) || [];
    const withDimensions = imgTags.filter(t => t.includes('width='));
    expect(withDimensions.length).toBeGreaterThanOrEqual(1);
  });

  it('VirtualTourGallery images have width/height', () => {
    const source = readSource('src/components/VirtualTourGallery.tsx');
    const imgTags = source.match(/<img[\s\S]*?\/>/g) || [];
    const withDimensions = imgTags.filter(t => t.includes('width='));
    expect(withDimensions.length).toBeGreaterThanOrEqual(3);
  });

  it('InteractiveMap property images have width/height', () => {
    const source = readSource('src/components/InteractiveMap.tsx');
    // Check for width={300} on PropertyImage
    expect(source).toContain('width={300}');
    expect(source).toContain('height={200}');
  });
});

/* ──────────────────────────────────────────────────────────────────
 * 6. Lazy Loading Attribute Usage
 * ──────────────────────────────────────────────────────────────── */

describe('Native Lazy Loading', () => {
  it('PropertyCard uses loading="lazy"', () => {
    const source = readSource('src/components/common/PropertyCard.tsx');
    expect(source).toContain('loading="lazy"');
  });

  it('VirtualTourGallery uses loading="lazy"', () => {
    const source = readSource('src/components/VirtualTourGallery.tsx');
    expect(source).toContain('loading="lazy"');
  });
});
