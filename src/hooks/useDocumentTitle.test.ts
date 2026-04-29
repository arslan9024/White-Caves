import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useDocumentTitle } from './useDocumentTitle';

const BASE_TITLE = 'White Caves Real Estate';

describe('useDocumentTitle', () => {
  let originalTitle: string;

  beforeEach(() => {
    originalTitle = document.title;
    document.title = 'Original Title';
  });

  afterEach(() => {
    document.title = originalTitle;
  });

  // ─── Basic behaviour ─────────────────────────────────────────────
  describe('basic behaviour', () => {
    it('sets the document title with suffix on mount', () => {
      renderHook(() => useDocumentTitle('Properties'));
      expect(document.title).toBe(`Properties | ${BASE_TITLE}`);
    });

    it('restores the previous title on unmount', () => {
      const { unmount } = renderHook(() => useDocumentTitle('Properties'));
      expect(document.title).toBe(`Properties | ${BASE_TITLE}`);

      unmount();
      expect(document.title).toBe('Original Title');
    });

    it('uses base title alone when empty string passed', () => {
      renderHook(() => useDocumentTitle(''));
      expect(document.title).toBe(BASE_TITLE);
    });
  });

  // ─── Dynamic title changes ───────────────────────────────────────
  describe('dynamic title updates', () => {
    it('updates title when prop changes', () => {
      const { rerender } = renderHook(
        ({ title }) => useDocumentTitle(title),
        { initialProps: { title: 'Page A' } }
      );

      expect(document.title).toBe(`Page A | ${BASE_TITLE}`);

      rerender({ title: 'Page B' });
      expect(document.title).toBe(`Page B | ${BASE_TITLE}`);
    });

    it('handles transition from non-empty to empty', () => {
      const { rerender } = renderHook(
        ({ title }) => useDocumentTitle(title),
        { initialProps: { title: 'Dashboard' } }
      );
      expect(document.title).toBe(`Dashboard | ${BASE_TITLE}`);

      rerender({ title: '' });
      expect(document.title).toBe(BASE_TITLE);
    });

    it('handles transition from empty to non-empty', () => {
      const { rerender } = renderHook(
        ({ title }) => useDocumentTitle(title),
        { initialProps: { title: '' } }
      );
      expect(document.title).toBe(BASE_TITLE);

      rerender({ title: 'New Page' });
      expect(document.title).toBe(`New Page | ${BASE_TITLE}`);
    });
  });

  // ─── Various title strings ───────────────────────────────────────
  describe('various title strings', () => {
    it('handles special characters', () => {
      renderHook(() => useDocumentTitle('Property #123 — Overview'));
      expect(document.title).toBe(`Property #123 — Overview | ${BASE_TITLE}`);
    });

    it('handles whitespace-only title (jsdom trims leading whitespace)', () => {
      renderHook(() => useDocumentTitle('   '));
      // jsdom trims leading whitespace from document.title
      expect(document.title).toBe(`| ${BASE_TITLE}`);
    });

    it('handles long titles', () => {
      const longTitle = 'A'.repeat(200);
      renderHook(() => useDocumentTitle(longTitle));
      expect(document.title).toBe(`${longTitle} | ${BASE_TITLE}`);
    });
  });

  // ─── Previous title restoration ──────────────────────────────────
  describe('previous title restoration', () => {
    it('preserves original title across mount/unmount cycles', () => {
      document.title = 'My SPA';

      const { unmount: unmount1 } = renderHook(() => useDocumentTitle('Page 1'));
      expect(document.title).toBe(`Page 1 | ${BASE_TITLE}`);
      unmount1();
      expect(document.title).toBe('My SPA');

      const { unmount: unmount2 } = renderHook(() => useDocumentTitle('Page 2'));
      expect(document.title).toBe(`Page 2 | ${BASE_TITLE}`);
      unmount2();
      expect(document.title).toBe('My SPA');
    });
  });
});
