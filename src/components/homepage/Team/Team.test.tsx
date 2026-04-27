/**
 * Team Component Tests
 * ====================
 * Tests for the homepage Team section — 4 members, social links, skills, CTA
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';

// Mock framer-motion — render all motion.* as plain HTML
vi.mock('framer-motion', () => ({
  motion: new Proxy(
    {},
    {
      get: (_target, prop: string) =>
        React.forwardRef((props: Record<string, unknown>, ref: React.Ref<HTMLElement>) => {
          const safe: Record<string, unknown> = {};
          for (const [k, v] of Object.entries(props)) {
            if (
              !k.startsWith('while') &&
              !k.startsWith('initial') &&
              !k.startsWith('animate') &&
              !k.startsWith('exit') &&
              !k.startsWith('variants') &&
              !k.startsWith('transition') &&
              !k.startsWith('viewport') &&
              k !== 'whileInView' &&
              k !== 'custom'
            ) {
              safe[k] = v;
            }
          }
          return React.createElement(prop, { ...safe, ref });
        }),
    }
  ),
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

import Team from './Team';

const renderTeam = () =>
  render(
    <MemoryRouter>
      <Team />
    </MemoryRouter>
  );

describe('Team', () => {
  // ──────────────────────────────────────────────────────────
  // Structure
  // ──────────────────────────────────────────────────────────

  it('renders the team section', () => {
    renderTeam();
    expect(document.querySelector('.team-section')).toBeTruthy();
  });

  it('renders the section tag "Our Team"', () => {
    renderTeam();
    expect(screen.getByText('Our Team')).toBeTruthy();
  });

  it('renders the section title', () => {
    renderTeam();
    expect(screen.getByText('Meet the Experts')).toBeTruthy();
  });

  it('renders the section subtitle', () => {
    renderTeam();
    expect(
      screen.getByText(/Dedicated professionals committed/i)
    ).toBeTruthy();
  });

  // ──────────────────────────────────────────────────────────
  // Team Members (all 4)
  // ──────────────────────────────────────────────────────────

  const members = [
    { name: 'Ahmed Al Rashid', role: 'CEO & Founder' },
    { name: 'Sarah Thompson', role: 'Head of Sales' },
    { name: 'Mohammed Hassan', role: 'Senior Property Consultant' },
    { name: 'Elena Rodriguez', role: 'Marketing Director' },
  ];

  it('renders all 4 team members by name', () => {
    renderTeam();
    for (const m of members) {
      expect(screen.getByText(m.name)).toBeTruthy();
    }
  });

  it('renders all 4 team roles', () => {
    renderTeam();
    for (const m of members) {
      expect(screen.getByText(m.role)).toBeTruthy();
    }
  });

  it('renders bio text for each member', () => {
    renderTeam();
    expect(screen.getByText(/20\+ years experience/i)).toBeTruthy();
    expect(screen.getByText(/luxury villa transactions/i)).toBeTruthy();
    expect(screen.getByText(/off-plan investments/i)).toBeTruthy();
    expect(screen.getByText(/Digital marketing strategist/i)).toBeTruthy();
  });

  // ──────────────────────────────────────────────────────────
  // Skills
  // ──────────────────────────────────────────────────────────

  it('renders skill tags', () => {
    renderTeam();
    expect(screen.getByText('Strategic Planning')).toBeTruthy();
    expect(screen.getByText('Negotiations')).toBeTruthy();
    expect(screen.getByText('Investment')).toBeTruthy();
    expect(screen.getByText('Digital Marketing')).toBeTruthy();
  });

  it('renders 12 skill tags in total (3 per member × 4)', () => {
    renderTeam();
    const tags = document.querySelectorAll('.skill-tag');
    expect(tags.length).toBe(12);
  });

  // ──────────────────────────────────────────────────────────
  // Images & Lazy Loading
  // ──────────────────────────────────────────────────────────

  it('renders team images with lazy loading', () => {
    renderTeam();
    const images = document.querySelectorAll<HTMLImageElement>('.team-image');
    expect(images.length).toBe(4);
    for (const img of images) {
      expect(img.getAttribute('loading')).toBe('lazy');
    }
  });

  it('renders alt text matching member names', () => {
    renderTeam();
    for (const m of members) {
      expect(screen.getByAltText(m.name)).toBeTruthy();
    }
  });

  // ──────────────────────────────────────────────────────────
  // Social Links
  // ──────────────────────────────────────────────────────────

  it('renders LinkedIn links for each member', () => {
    renderTeam();
    const linkedinLinks = screen.getAllByLabelText(/LinkedIn profile/i);
    expect(linkedinLinks.length).toBe(4);
  });

  it('renders Twitter links for each member', () => {
    renderTeam();
    const twitterLinks = screen.getAllByLabelText(/Twitter profile/i);
    expect(twitterLinks.length).toBe(4);
  });

  it('social links open in new tab', () => {
    renderTeam();
    const linkedinLinks = screen.getAllByLabelText(/LinkedIn profile/i);
    for (const link of linkedinLinks) {
      expect(link.getAttribute('target')).toBe('_blank');
      expect(link.getAttribute('rel')).toContain('noopener');
    }
  });

  // ──────────────────────────────────────────────────────────
  // CTA Section
  // ──────────────────────────────────────────────────────────

  it('renders "Join Our Team" CTA', () => {
    renderTeam();
    expect(screen.getByText('Join Our Team')).toBeTruthy();
    expect(
      screen.getByText(/talented individuals/i)
    ).toBeTruthy();
  });

  it('renders "View Open Positions" link to /careers', () => {
    renderTeam();
    const link = screen.getByText('View Open Positions');
    expect(link).toBeTruthy();
    expect(link.closest('a')?.getAttribute('href')).toBe('/careers');
  });

  // ──────────────────────────────────────────────────────────
  // Section Anchor
  // ──────────────────────────────────────────────────────────

  it('has correct id for anchor navigation', () => {
    renderTeam();
    expect(document.querySelector('#team')).toBeTruthy();
  });
});

