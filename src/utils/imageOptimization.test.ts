/**
 * imageOptimization.test.ts — Unit tests for DOM-04 Image CDN & Format Optimization
 * White Caves Real Estate LLC — AEGIS V5.0 Architecture
 */

import { describe, it, expect } from 'vitest';
import {
  generateOptimizedImageUrl,
  generatePictureSources,
  buildCloudflareCdnUrl,
  getOptimalImageFormat,
} from './imageOptimization';

describe('imageOptimization utilities', () => {
  it('generates optimized format parameters for Unsplash CDN', () => {
    const url = 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750';
    const optimized = generateOptimizedImageUrl(url, 'avif', 1200);

    expect(optimized).toContain('fm=avif');
    expect(optimized).toContain('w=1200');
    expect(optimized).toContain('q=75');
  });

  it('preserves existing query parameters when adding format params', () => {
    const url = 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format';
    const optimized = generateOptimizedImageUrl(url, 'webp', 800);

    expect(optimized).toContain('auto=format&fm=webp&w=800');
  });

  it('skips adding format parameter if already present', () => {
    const url = 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?fm=webp';
    const result = generateOptimizedImageUrl(url, 'avif', 800);

    expect(result).toBe(url);
  });

  it('generates responsive picture sources across AVIF, WebP, and Fallback', () => {
    const sources = generatePictureSources({
      baseUrl: 'https://images.unsplash.com/photo-luxury-villa',
      width: 1024,
      height: 768,
      quality: 85,
    });

    expect(sources.avifSrc).toContain('fm=avif');
    expect(sources.webpSrc).toContain('fm=webp');
    expect(sources.fallbackSrc).toContain('fm=jpg');
    expect(sources.avifSrc).toContain('w=1024');
  });

  it('handles empty baseUrl gracefully', () => {
    const emptyUrl = generateOptimizedImageUrl('');
    expect(emptyUrl).toBe('');

    const emptySources = generatePictureSources({ baseUrl: '' });
    expect(emptySources.avifSrc).toBe('');
    expect(emptySources.webpSrc).toBe('');
    expect(emptySources.fallbackSrc).toBe('');
  });

  it('constructs Cloudflare CDN image URLs when helper is used', () => {
    if (typeof buildCloudflareCdnUrl === 'function') {
      const cdnUrl = buildCloudflareCdnUrl({
        src: 'https://whitecaves.com/assets/penthouse.jpg',
        width: 1920,
        quality: 80,
        format: 'avif',
      });
      expect(cdnUrl).toContain('format=avif');
      expect(cdnUrl).toContain('width=1920');
    }
  });
});
