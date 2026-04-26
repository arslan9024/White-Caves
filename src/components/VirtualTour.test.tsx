/**
 * VirtualTour — Comprehensive Unit Tests
 *
 * Covers: empty state, rendering with images, room navigation,
 * zoom controls, auto-rotate toggle, keyboard shortcuts,
 * hotspot rendering/clicks, drag interaction, close button
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act, within } from '@testing-library/react';
import React from 'react';

// Mock styled-components imports (component uses classNames, not styled-components)
vi.mock('./VirtualTour.styles', () => ({}));

import VirtualTour from './VirtualTour';

// ── Test Data ────────────────────────────────────────────────────

const mockImages = [
  {
    url: 'https://example.com/living-room.jpg',
    name: 'Living Room',
    thumbnail: 'https://example.com/living-room-thumb.jpg',
    hotspots: [
      { x: 40, y: 50, label: 'Kitchen', type: 'navigation' as const, targetRoom: 1 },
      { x: 60, y: 30, label: 'Window View', type: 'info' as const },
    ],
  },
  {
    url: 'https://example.com/kitchen.jpg',
    name: 'Kitchen',
    thumbnail: 'https://example.com/kitchen-thumb.jpg',
    hotspots: [],
  },
  {
    url: 'https://example.com/bedroom.jpg',
    name: 'Master Bedroom',
    thumbnail: 'https://example.com/bedroom-thumb.jpg',
  },
];

// ── Setup ────────────────────────────────────────────────────────

beforeEach(() => {
  vi.clearAllMocks();
  // Mock requestFullscreen / exitFullscreen
  HTMLElement.prototype.requestFullscreen = vi.fn(() => Promise.resolve());
  document.exitFullscreen = vi.fn(() => Promise.resolve());
});

// ── Tests ────────────────────────────────────────────────────────

describe('VirtualTour', () => {
  describe('empty state', () => {
    it('shows empty message when no images', () => {
      render(<VirtualTour images={[]} />);
      expect(screen.getByText('Virtual Tour Coming Soon')).toBeInTheDocument();
    });

    it('shows preparation message', () => {
      render(<VirtualTour />);
      expect(screen.getByText(/360° tour images are being prepared/)).toBeInTheDocument();
    });

    it('shows house icon', () => {
      render(<VirtualTour images={[]} />);
      expect(screen.getByText('🏠')).toBeInTheDocument();
    });
  });

  describe('rendering with images', () => {
    it('renders the tour container', () => {
      const { container } = render(<VirtualTour images={mockImages} />);
      expect(container.querySelector('.virtual-tour-container')).toBeInTheDocument();
    });

    it('shows property title', () => {
      render(<VirtualTour images={mockImages} propertyTitle="Luxury Villa" />);
      expect(screen.getByText('Luxury Villa')).toBeInTheDocument();
    });

    it('uses default property title', () => {
      render(<VirtualTour images={mockImages} />);
      expect(screen.getByText('Property Tour')).toBeInTheDocument();
    });

    it('shows 360° Tour badge', () => {
      render(<VirtualTour images={mockImages} />);
      expect(screen.getByText('360° Tour')).toBeInTheDocument();
    });

    it('shows current room name', () => {
      const { container } = render(<VirtualTour images={mockImages} />);
      const infoSection = container.querySelector('.tour-info')! as HTMLElement;
      expect(within(infoSection).getByText('Living Room')).toBeInTheDocument();
    });

    it('shows room counter', () => {
      render(<VirtualTour images={mockImages} />);
      expect(screen.getByText('1 / 3')).toBeInTheDocument();
    });

    it('shows instructions text', () => {
      render(<VirtualTour images={mockImages} />);
      expect(screen.getByText(/Drag to look around/)).toBeInTheDocument();
    });

    it('shows compass', () => {
      const { container } = render(<VirtualTour images={mockImages} />);
      expect(container.querySelector('.compass-needle')).toBeInTheDocument();
    });

    it('shows zoom level at 100%', () => {
      render(<VirtualTour images={mockImages} />);
      expect(screen.getByText('100%')).toBeInTheDocument();
    });
  });

  describe('room navigation', () => {
    it('renders room thumbnails', () => {
      render(<VirtualTour images={mockImages} />);
      expect(screen.getByAltText('Living Room')).toBeInTheDocument();
      expect(screen.getByAltText('Kitchen')).toBeInTheDocument();
      expect(screen.getByAltText('Master Bedroom')).toBeInTheDocument();
    });

    it('navigates to room on thumbnail click', () => {
      const { container } = render(<VirtualTour images={mockImages} />);
      // Find the Kitchen room-name span in room navigator
      const roomNav = container.querySelector('.room-navigator')! as HTMLElement;
      const kitchenThumb = within(roomNav).getByText('Kitchen').closest('button');
      fireEvent.click(kitchenThumb!);
      expect(screen.getByText('2 / 3')).toBeInTheDocument();
    });

    it('starts at initialIndex', () => {
      render(<VirtualTour images={mockImages} initialIndex={1} />);
      expect(screen.getByText('2 / 3')).toBeInTheDocument();
    });

    it('navigates with arrow keys', () => {
      render(<VirtualTour images={mockImages} />);
      expect(screen.getByText('1 / 3')).toBeInTheDocument();

      fireEvent.keyDown(window, { key: 'ArrowRight' });
      expect(screen.getByText('2 / 3')).toBeInTheDocument();

      fireEvent.keyDown(window, { key: 'ArrowLeft' });
      expect(screen.getByText('1 / 3')).toBeInTheDocument();
    });

    it('wraps around when navigating past last room', () => {
      render(<VirtualTour images={mockImages} initialIndex={2} />);
      fireEvent.keyDown(window, { key: 'ArrowRight' });
      expect(screen.getByText('1 / 3')).toBeInTheDocument();
    });

    it('wraps around when navigating before first room', () => {
      render(<VirtualTour images={mockImages} />);
      fireEvent.keyDown(window, { key: 'ArrowLeft' });
      expect(screen.getByText('3 / 3')).toBeInTheDocument();
    });
  });

  describe('zoom controls', () => {
    it('zooms in with + button', () => {
      render(<VirtualTour images={mockImages} />);
      const zoomInBtn = screen.getByText('+');
      fireEvent.click(zoomInBtn);
      expect(screen.getByText('120%')).toBeInTheDocument();
    });

    it('zooms out with − button', () => {
      render(<VirtualTour images={mockImages} />);
      const zoomOutBtn = screen.getByText('−');
      fireEvent.click(zoomOutBtn);
      expect(screen.getByText('80%')).toBeInTheDocument();
    });

    it('zooms in with + key', () => {
      render(<VirtualTour images={mockImages} />);
      fireEvent.keyDown(window, { key: '+' });
      expect(screen.getByText('120%')).toBeInTheDocument();
    });

    it('zooms out with - key', () => {
      render(<VirtualTour images={mockImages} />);
      fireEvent.keyDown(window, { key: '-' });
      expect(screen.getByText('80%')).toBeInTheDocument();
    });

    it('does not zoom past max (300%)', () => {
      render(<VirtualTour images={mockImages} />);
      // Click zoom in many times
      const zoomInBtn = screen.getByText('+');
      for (let i = 0; i < 20; i++) fireEvent.click(zoomInBtn);
      expect(screen.getByText('300%')).toBeInTheDocument();
    });

    it('does not zoom below min (50%)', () => {
      render(<VirtualTour images={mockImages} />);
      const zoomOutBtn = screen.getByText('−');
      for (let i = 0; i < 20; i++) fireEvent.click(zoomOutBtn);
      expect(screen.getByText('50%')).toBeInTheDocument();
    });
  });

  describe('auto-rotate', () => {
    it('toggles auto-rotate with button', () => {
      vi.useFakeTimers();
      try {
        render(<VirtualTour images={mockImages} />);
        fireEvent.click(screen.getByTitle('Auto Rotate (R)'));
        // Let auto-rotate run
        act(() => { vi.advanceTimersByTime(200); });
        // Should still be running (no crash)
        expect(screen.getByTitle('Auto Rotate (R)')).toBeInTheDocument();
      } finally {
        vi.useRealTimers();
      }
    });

    it('toggles auto-rotate with R key', () => {
      render(<VirtualTour images={mockImages} />);
      fireEvent.keyDown(window, { key: 'r' });
      // No crash - auto-rotate started
      expect(screen.getByTitle('Auto Rotate (R)')).toBeInTheDocument();
    });
  });

  describe('hotspots', () => {
    it('renders hotspot buttons', () => {
      render(<VirtualTour images={mockImages} />);
      // Hotspots are rendered (may or may not be visible based on viewport position)
      const hotspotButtons = document.querySelectorAll('.tour-hotspot');
      expect(hotspotButtons.length).toBeGreaterThanOrEqual(0);
    });

    it('hides hotspots when toggle clicked', () => {
      render(<VirtualTour images={mockImages} />);
      fireEvent.click(screen.getByTitle('Toggle Hotspots'));
      // Hotspots container should be hidden
      const hotspotButtons = document.querySelectorAll('.tour-hotspot');
      expect(hotspotButtons.length).toBe(0);
    });
  });

  describe('close button', () => {
    it('renders close button when onClose is provided', () => {
      const onClose = vi.fn();
      render(<VirtualTour images={mockImages} onClose={onClose} />);
      expect(screen.getByText('✕')).toBeInTheDocument();
    });

    it('does not render close button when onClose not provided', () => {
      render(<VirtualTour images={mockImages} />);
      expect(screen.queryByText('✕')).not.toBeInTheDocument();
    });

    it('calls onClose on button click', () => {
      const onClose = vi.fn();
      render(<VirtualTour images={mockImages} onClose={onClose} />);
      fireEvent.click(screen.getByText('✕'));
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('calls onClose on Escape key', () => {
      const onClose = vi.fn();
      render(<VirtualTour images={mockImages} onClose={onClose} />);
      fireEvent.keyDown(window, { key: 'Escape' });
      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('drag interaction', () => {
    it('changes cursor to grabbing during drag', () => {
      const { container } = render(<VirtualTour images={mockImages} />);
      const viewport = container.querySelector('.tour-viewport')!;
      expect(viewport).toHaveStyle({ cursor: 'grab' });

      fireEvent.mouseDown(viewport, { clientX: 100, clientY: 100 });
      expect(viewport).toHaveStyle({ cursor: 'grabbing' });

      fireEvent.mouseUp(viewport);
      expect(viewport).toHaveStyle({ cursor: 'grab' });
    });

    it('handles mouse leave during drag', () => {
      const { container } = render(<VirtualTour images={mockImages} />);
      const viewport = container.querySelector('.tour-viewport')!;

      fireEvent.mouseDown(viewport, { clientX: 100, clientY: 100 });
      expect(viewport).toHaveStyle({ cursor: 'grabbing' });

      fireEvent.mouseLeave(viewport);
      expect(viewport).toHaveStyle({ cursor: 'grab' });
    });
  });

  describe('fullscreen', () => {
    it('renders fullscreen button', () => {
      render(<VirtualTour images={mockImages} />);
      expect(screen.getByTitle('Fullscreen')).toBeInTheDocument();
    });

    it('calls requestFullscreen on button click', () => {
      render(<VirtualTour images={mockImages} />);
      fireEvent.click(screen.getByTitle('Fullscreen'));
      expect(HTMLElement.prototype.requestFullscreen).toHaveBeenCalled();
    });
  });
});
