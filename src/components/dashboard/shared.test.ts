/**
 * shared.test.ts — Tests for dashboard shared utilities
 * ───────────────────────────────────────────────────────
 * Tests: formatDate, formatCurrency, formatStatus, badge(), emptyState(),
 *        loadingState, errorState(), and exported style objects.
 */

import { describe, it, expect, vi } from 'vitest';
import {
  formatDate,
  formatCurrency,
  formatStatus,
  badge,
  emptyState,
  loadingState,
  errorState,
  tabContainer,
  pageHeader,
  headerTitle,
  statsGrid,
  statCard,
  card,
  btnPrimary,
  btnSecondary,
} from './shared';

// ─── formatDate ──────────────────────────────────────────────────────

describe('formatDate', () => {
  it('returns "—" for null/undefined', () => {
    expect(formatDate(null)).toBe('—');
    expect(formatDate(undefined)).toBe('—');
  });

  it('formats a valid ISO date string', () => {
    const result = formatDate('2026-03-15T10:00:00Z');
    // Should contain "Mar" and "2026" in en-AE locale
    expect(result).toContain('Mar');
    expect(result).toContain('2026');
  });

  it('handles date-only strings', () => {
    const result = formatDate('2026-01-01');
    expect(result).toContain('Jan');
    expect(result).toContain('2026');
  });
});

// ─── formatCurrency ──────────────────────────────────────────────────

describe('formatCurrency', () => {
  it('returns "—" for null/undefined', () => {
    expect(formatCurrency(null)).toBe('—');
    expect(formatCurrency(undefined)).toBe('—');
  });

  it('formats positive amounts with AED prefix', () => {
    const result = formatCurrency(1500000);
    expect(result).toMatch(/^AED /);
    expect(result).toContain('1,500,000');
  });

  it('formats zero', () => {
    const result = formatCurrency(0);
    expect(result).toMatch(/^AED /);
    expect(result).toContain('0');
  });
});

// ─── formatStatus ────────────────────────────────────────────────────

describe('formatStatus', () => {
  it('converts underscored status to title case', () => {
    expect(formatStatus('in_progress')).toBe('In Progress');
  });

  it('converts hyphenated status to title case', () => {
    expect(formatStatus('under-review')).toBe('Under Review');
  });

  it('capitalizes single word', () => {
    expect(formatStatus('active')).toBe('Active');
  });

  it('handles already-capitalized input', () => {
    expect(formatStatus('Active')).toBe('Active');
  });

  it('handles multi-word with mixed separators', () => {
    expect(formatStatus('pending_final-review')).toBe('Pending Final Review');
  });
});

// ─── badge() ─────────────────────────────────────────────────────────

describe('badge', () => {
  it('returns a style object with given color and bg', () => {
    const style = badge('#ff0000', '#ffe6e6');
    expect(style.color).toBe('#ff0000');
    expect(style.background).toBe('#ffe6e6');
    expect(style.borderRadius).toBe('999px');
    expect(style.display).toBe('inline-flex');
  });
});

// ─── emptyState() ────────────────────────────────────────────────────

describe('emptyState', () => {
  it('returns a React node (not null)', () => {
    const node = emptyState('📭', 'No Data', 'Try again later');
    expect(node).toBeDefined();
    expect(node).not.toBeNull();
  });
});

// ─── loadingState ────────────────────────────────────────────────────

describe('loadingState', () => {
  it('is defined and not null', () => {
    expect(loadingState).toBeDefined();
    expect(loadingState).not.toBeNull();
  });
});

// ─── errorState() ────────────────────────────────────────────────────

describe('errorState', () => {
  it('returns a React node without retry', () => {
    const node = errorState('Something went wrong');
    expect(node).toBeDefined();
  });

  it('returns a React node with retry callback', () => {
    const retry = vi.fn();
    const node = errorState('Something went wrong', retry);
    expect(node).toBeDefined();
  });
});

// ─── Style exports exist ─────────────────────────────────────────────

describe('style exports', () => {
  it.each([
    ['tabContainer', tabContainer],
    ['pageHeader', pageHeader],
    ['headerTitle', headerTitle],
    ['statsGrid', statsGrid],
    ['statCard', statCard],
    ['card', card],
    ['btnPrimary', btnPrimary],
    ['btnSecondary', btnSecondary],
  ])('%s is a valid CSSProperties object', (_name, style) => {
    expect(style).toBeDefined();
    expect(typeof style).toBe('object');
  });

  it('statCard has flex column layout', () => {
    expect(statCard.display).toBe('flex');
    expect(statCard.flexDirection).toBe('column');
  });
});
