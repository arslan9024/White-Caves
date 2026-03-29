import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import React from 'react';

// Mock lucide-react
vi.mock('lucide-react', () => ({
  Cloud: (props: any) => <svg data-testid="icon-cloud" {...props} />,
  Sun: (props: any) => <svg data-testid="icon-sun" {...props} />,
  CloudRain: (props: any) => <svg data-testid="icon-rain" {...props} />,
  CloudSnow: (props: any) => <svg data-testid="icon-snow" {...props} />,
  Wind: (props: any) => <svg data-testid="icon-wind" {...props} />,
  Thermometer: (props: any) => <svg data-testid="icon-thermo" {...props} />,
}));

// Mock styled components
vi.mock('../WeatherWidget.styles', () => ({
  WeatherWidgetContainer: ({ children, ...props }: any) => <div data-testid="weather-container" {...props}>{children}</div>,
  WeatherMain: ({ children, ...props }: any) => <div data-testid="weather-main" {...props}>{children}</div>,
  WeatherIcon: ({ children, ...props }: any) => <span data-testid="weather-icon" {...props}>{children}</span>,
  WeatherInfo: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  WeatherTemp: ({ children, ...props }: any) => <span data-testid="weather-temp" {...props}>{children}</span>,
  WeatherDescription: ({ children, ...props }: any) => <span data-testid="weather-desc" {...props}>{children}</span>,
  WeatherDetails: ({ children, ...props }: any) => <div data-testid="weather-details" {...props}>{children}</div>,
  WeatherLocation: ({ children, ...props }: any) => <span data-testid="weather-location" {...props}>{children}</span>,
  WeatherHumidity: ({ children, ...props }: any) => <span data-testid="weather-humidity" {...props}>{children}</span>,
  WeatherStat: ({ children, ...props }: any) => <span {...props}>{children}</span>,
}));

import WeatherWidget from '../WeatherWidget';

// Helper to mock Intl.DateTimeFormat to return a specific Dubai hour
const mockDubaiHour = (hour: number) => {
  const originalFormat = Intl.DateTimeFormat;
  vi.spyOn(Intl, 'DateTimeFormat').mockImplementation(((locale: any, options: any) => {
    if (options?.timeZone === 'Asia/Dubai') {
      return {
        format: () => String(hour),
        resolvedOptions: () => ({ timeZone: 'Asia/Dubai' }),
      };
    }
    return new originalFormat(locale, options);
  }) as any);
};

describe('WeatherWidget', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Morning (6-10)', () => {
    it('should show partly cloudy for morning hours', () => {
      mockDubaiHour(8);
      render(<WeatherWidget />);
      expect(screen.getByText('Partly Cloudy')).toBeInTheDocument();
      expect(screen.getByText('30°C')).toBeInTheDocument();
    });
  });

  describe('Midday (10-15)', () => {
    it('should show hot for midday hours', () => {
      mockDubaiHour(12);
      render(<WeatherWidget />);
      expect(screen.getByText('Hot')).toBeInTheDocument();
      expect(screen.getByText('40°C')).toBeInTheDocument();
    });
  });

  describe('Afternoon (15-18)', () => {
    it('should show sunny for afternoon hours', () => {
      mockDubaiHour(16);
      render(<WeatherWidget />);
      expect(screen.getByText('Sunny')).toBeInTheDocument();
      expect(screen.getByText('36°C')).toBeInTheDocument();
    });
  });

  describe('Night (default)', () => {
    it('should show clear night for evening/night hours', () => {
      mockDubaiHour(21);
      render(<WeatherWidget />);
      expect(screen.getByText('Clear Night')).toBeInTheDocument();
      expect(screen.getByText('28°C')).toBeInTheDocument();
    });

    it('should show clear night for early morning (before 6)', () => {
      mockDubaiHour(3);
      render(<WeatherWidget />);
      expect(screen.getByText('Clear Night')).toBeInTheDocument();
    });
  });

  describe('Full Mode (default)', () => {
    it('should show location', () => {
      mockDubaiHour(12);
      render(<WeatherWidget />);
      expect(screen.getByText('Dubai')).toBeInTheDocument();
    });

    it('should show humidity', () => {
      mockDubaiHour(12);
      render(<WeatherWidget />);
      expect(screen.getByText(/30% humidity/)).toBeInTheDocument();
    });

    it('should show weather details section', () => {
      mockDubaiHour(12);
      render(<WeatherWidget />);
      expect(screen.getByTestId('weather-details')).toBeInTheDocument();
    });

    it('should have full aria-label', () => {
      mockDubaiHour(12);
      render(<WeatherWidget />);
      const region = screen.getByRole('region');
      expect(region.getAttribute('aria-label')).toContain('Dubai');
      expect(region.getAttribute('aria-label')).toContain('40°C');
      expect(region.getAttribute('aria-label')).toContain('humidity');
    });
  });

  describe('Compact Mode', () => {
    it('should render temp in compact mode', () => {
      mockDubaiHour(12);
      render(<WeatherWidget compact />);
      expect(screen.getByText('40°C')).toBeInTheDocument();
    });

    it('should not show location in compact mode', () => {
      mockDubaiHour(12);
      render(<WeatherWidget compact />);
      expect(screen.queryByTestId('weather-details')).not.toBeInTheDocument();
    });

    it('should have compact aria-label', () => {
      mockDubaiHour(12);
      render(<WeatherWidget compact />);
      const region = screen.getByRole('region');
      expect(region.getAttribute('aria-label')).toContain('Dubai');
      expect(region.getAttribute('aria-label')).toContain('40°C');
    });
  });

  describe('Custom Location', () => {
    it('should render custom location', () => {
      mockDubaiHour(12);
      render(<WeatherWidget location="Abu Dhabi" />);
      expect(screen.getByText('Abu Dhabi')).toBeInTheDocument();
    });
  });

  describe('Custom className', () => {
    it('should pass className to container', () => {
      mockDubaiHour(12);
      const { container } = render(<WeatherWidget className="my-weather" />);
      // className is passed as prop to styled component
      expect(container.querySelector('.my-weather')).toBeInTheDocument();
    });
  });
});
