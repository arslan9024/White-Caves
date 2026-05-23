import { describe, it, expect, vi, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';

vi.mock('./useDocumentTitle', () => ({
  useDocumentTitle: vi.fn(),
}));

import { useDocumentTitle } from './useDocumentTitle';
import { useSEO, getCanonicalUrl } from './useSEO';

afterEach(() => {
  vi.clearAllMocks();
  document.head.querySelectorAll('[data-wc-seo="true"]').forEach((el) => el.remove());
  document.getElementById('wc-seo-jsonld')?.remove();
});

describe('useSEO', () => {
  it('sets document title through useDocumentTitle', () => {
    renderHook(() => useSEO({ title: 'Home', description: 'Dubai luxury homes' }));
    expect(useDocumentTitle).toHaveBeenCalledWith('Home');
  });

  it('applies metadata into document head', () => {
    renderHook(() => useSEO({
      title: 'Home',
      description: 'Luxury Dubai real estate',
      keywords: ['Dubai', 'Luxury'],
      canonicalUrl: 'https://whitecaves.com/',
    }));

    const description = document.head.querySelector('meta[name="description"]');
    const canonical = document.head.querySelector('link[rel="canonical"]');
    expect(description?.getAttribute('content')).toBe('Luxury Dubai real estate');
    expect(canonical?.getAttribute('href')).toBe('https://whitecaves.com/');
  });

  it('removes generated tags on unmount', () => {
    const { unmount } = renderHook(() => useSEO({
      title: 'Home',
      description: 'Luxury Dubai real estate',
      canonicalUrl: 'https://whitecaves.com/',
    }));

    expect(document.head.querySelector('meta[name="description"]')).toBeTruthy();
    unmount();
    expect(document.head.querySelector('meta[name="description"]')).toBeNull();
  });
});

describe('getCanonicalUrl', () => {
  it('builds canonical URLs against configured domain', () => {
    expect(getCanonicalUrl('/properties')).toContain('/properties');
  });
});
