/**
 * SocialLinks.test.tsx — Smoke tests for SocialLinks component
 */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import SocialLinks from './SocialLinks';

describe('SocialLinks', () => {
  it('renders TikTok link', () => {
    render(<SocialLinks />);
    const link = screen.getByTitle('TikTok');
    expect(link).toBeTruthy();
    expect(link.getAttribute('href')).toContain('tiktok.com');
    expect(link.getAttribute('target')).toBe('_blank');
    expect(link.getAttribute('rel')).toContain('noopener');
  });

  it('renders Instagram link', () => {
    render(<SocialLinks />);
    const link = screen.getByTitle('Instagram');
    expect(link).toBeTruthy();
    expect(link.getAttribute('href')).toContain('instagram.com');
  });

  it('renders Facebook link', () => {
    render(<SocialLinks />);
    const link = screen.getByTitle('Facebook');
    expect(link).toBeTruthy();
    expect(link.getAttribute('href')).toContain('facebook.com');
  });

  it('renders all 3 social links', () => {
    const { container } = render(<SocialLinks />);
    const links = container.querySelectorAll('a.social-link');
    expect(links.length).toBe(3);
  });

  it('all links open in new tab securely', () => {
    const { container } = render(<SocialLinks />);
    const links = container.querySelectorAll('a');
    links.forEach((link) => {
      expect(link.getAttribute('target')).toBe('_blank');
      expect(link.getAttribute('rel')).toContain('noopener');
      expect(link.getAttribute('rel')).toContain('noreferrer');
    });
  });
});
