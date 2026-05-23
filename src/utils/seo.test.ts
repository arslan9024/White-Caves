import { describe, it, expect, afterEach } from 'vitest';
import { applySEO } from './seo';

afterEach(() => {
  document.head.querySelectorAll('[data-wc-seo="true"]').forEach((el) => el.remove());
  document.getElementById('wc-seo-jsonld')?.remove();
});

describe('applySEO', () => {
  it('applies description + keywords + canonical metadata', () => {
    const cleanup = applySEO({
      description: 'Luxury Dubai properties by White Caves.',
      keywords: ['Dubai real estate', 'luxury villa'],
      canonicalUrl: 'https://whitecaves.com/',
    });

    const description = document.head.querySelector('meta[name="description"]');
    const keywords = document.head.querySelector('meta[name="keywords"]');
    const canonical = document.head.querySelector('link[rel="canonical"]');

    expect(description?.getAttribute('content')).toContain('Luxury Dubai properties');
    expect(keywords?.getAttribute('content')).toBe('Dubai real estate, luxury villa');
    expect(canonical?.getAttribute('href')).toBe('https://whitecaves.com/');

    cleanup();

    expect(document.head.querySelector('meta[name="description"]')).toBeNull();
    expect(document.head.querySelector('meta[name="keywords"]')).toBeNull();
    expect(document.head.querySelector('link[rel="canonical"]')).toBeNull();
  });

  it('adds JSON-LD structured data', () => {
    applySEO({
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'RealEstateAgent',
        name: 'White Caves Real Estate LLC',
      },
    });

    const jsonLd = document.getElementById('wc-seo-jsonld');
    expect(jsonLd).toBeTruthy();
    expect(jsonLd?.textContent).toContain('RealEstateAgent');
  });

  it('updates existing meta and restores previous content on cleanup', () => {
    const existing = document.createElement('meta');
    existing.setAttribute('name', 'description');
    existing.setAttribute('content', 'Old Description');
    document.head.appendChild(existing);

    const cleanup = applySEO({ description: 'New Description' });
    expect(existing.getAttribute('content')).toBe('New Description');

    cleanup();
    expect(existing.getAttribute('content')).toBe('Old Description');

    existing.remove();
  });
});
