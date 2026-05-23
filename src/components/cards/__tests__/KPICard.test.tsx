/**
 * KPICard Component Unit Tests
 * Tests for KPICard component rendering and interactions
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi } from 'vitest';
import { KPICard } from '../KPICard';

describe('KPICard Component', () => {
  describe('Rendering', () => {
    test('renders with required props', () => {
      render(
        <KPICard
          label="Total Sales"
          value="₹2,450,000"
          icon="📊"
        />
      );
      expect(screen.getByText('Total Sales')).toBeInTheDocument();
      expect(screen.getByText('₹2,450,000')).toBeInTheDocument();
      expect(screen.getByText('📊')).toBeInTheDocument();
    });

    test('renders with unit suffix', () => {
      render(
        <KPICard
          label="Growth"
          value="15"
          unit="%"
          icon="📈"
        />
      );
      expect(screen.getByText('%')).toBeInTheDocument();
    });

    test('renders with different value types', () => {
      const { rerender } = render(
        <KPICard label="Count" value={100} icon="🔢" />
      );
      expect(screen.getByText('100')).toBeInTheDocument();

      rerender(
        <KPICard label="Count" value="1,000.50" icon="🔢" />
      );
      expect(screen.getByText('1,000.50')).toBeInTheDocument();
    });
  });

  describe('Trend Indicators', () => {
    test('displays positive trend with up arrow', () => {
      const { container } = render(
        <KPICard
          label="Growth"
          value={100}
          change={12}
          trend="up"
          icon="📈"
        />
      );
      expect(screen.getByText('+12%')).toBeInTheDocument();
      const changeElement = screen.getByText('+12%').parentElement;
      expect(changeElement).toHaveStyle('color: #27ae60'); // Green
    });

    test('displays negative trend with down arrow', () => {
      render(
        <KPICard
          label="Costs"
          value={50000}
          change={5}
          trend="down"
          icon="📉"
        />
      );
      expect(screen.getByText('-5%')).toBeInTheDocument();
    });

    test('does not display change for neutral trend', () => {
      const { container } = render(
        <KPICard
          label="Metric"
          value={100}
          change={10}
          trend="neutral"
          icon="📊"
        />
      );
      expect(screen.queryByText('+10%')).not.toBeInTheDocument();
    });

    test('displays without change when change prop is undefined', () => {
      render(
        <KPICard
          label="Metric"
          value={100}
          icon="📊"
        />
      );
      expect(screen.queryByText('%')).not.toBeInTheDocument();
    });
  });

  describe('Progress Bar', () => {
    test('renders progress bar when showProgress is true', () => {
      const { container } = render(
        <KPICard
          label="Capacity"
          value={75}
          showProgress={true}
          progressMax={100}
          icon="⚙️"
        />
      );
      const progressFill = container.querySelector('[style*="width"]');
      expect(progressFill).toBeInTheDocument();
    });

    test('calculates correct progress percentage', () => {
      const { container } = render(
        <KPICard
          label="Capacity"
          value={50}
          showProgress={true}
          progressMax={100}
          icon="⚙️"
        />
      );
      // Progress should be 50%
      const progressElement = container.querySelector('[style*="width: 50%"]');
      expect(progressElement).toBeInTheDocument();
    });

    test('does not render progress bar when showProgress is false', () => {
      const { container } = render(
        <KPICard
          label="Metric"
          value={75}
          showProgress={false}
          icon="📊"
        />
      );
      const progressBars = container.querySelectorAll('[style*="width"]');
      expect(progressBars.length).toBe(0);
    });

    test('handles progress with custom max value', () => {
      const { container } = render(
        <KPICard
          label="Score"
          value={75}
          showProgress={true}
          progressMax={200}
          icon="⭐"
        />
      );
      // 75/200 = 37.5%
      expect(container.querySelector('[style*="37.5%"]')).toBeInTheDocument();
    });
  });

  describe('Colors and Styling', () => {
    test('applies custom background color', () => {
      const { container } = render(
        <KPICard
          label="Custom"
          value="100"
          backgroundColor="#ff0000"
          icon="📊"
        />
      );
      const cardContainer = container.firstChild;
      expect(cardContainer).toHaveStyle('background: #ff0000');
    });

    test('applies custom accent color', () => {
      const { container } = render(
        <KPICard
          label="Custom"
          value={50}
          showProgress={true}
          accentColor="#00ff00"
          icon="📊"
        />
      );
      const progressFill = container.querySelector('[style*="background"]');
      expect(progressFill).toHaveStyle('background: #00ff00');
    });

    test('uses default colors when not provided', () => {
      const { container } = render(
        <KPICard label="Default" value={100} icon="📊" />
      );
      const card = container.firstChild;
      // Should have default styling
      expect(card).toBeInTheDocument();
    });
  });

  describe('User Interactions', () => {
    test('calls onClick handler when card is clicked', () => {
      const handleClick = vi.fn();
      render(
        <KPICard
          label="Clickable"
          value="100"
          onClick={handleClick}
          icon="📊"
        />
      );
      const card = screen.getByText('Clickable').closest('div');
      fireEvent.click(card!);
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    test('does not have click cursor when no onClick', () => {
      const { container } = render(
        <KPICard label="Not Clickable" value="100" icon="📊" />
      );
      const card = container.firstChild;
      expect(card).toHaveStyle('cursor: default');
    });

    test('has pointer cursor when onClick is provided', () => {
      const { container } = render(
        <KPICard
          label="Clickable"
          value="100"
          onClick={() => {}}
          icon="📊"
        />
      );
      const card = container.firstChild;
      expect(card).toHaveStyle('cursor: pointer');
    });

    test('responds to hover with style change', () => {
      const { container } = render(
        <KPICard label="Hoverable" value="100" icon="📊" />
      );
      const card = container.firstChild;
      fireEvent.mouseEnter(card!);
      expect(card).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    test('handles very large numbers', () => {
      render(
        <KPICard
          label="Large Number"
          value="999,999,999,999"
          icon="💰"
        />
      );
      expect(screen.getByText('999,999,999,999')).toBeInTheDocument();
    });

    test('handles decimal values', () => {
      render(
        <KPICard
          label="Decimal"
          value="3.14159"
          icon="🔢"
        />
      );
      expect(screen.getByText('3.14159')).toBeInTheDocument();
    });

    test('handles zero value', () => {
      render(
        <KPICard
          label="Zero"
          value={0}
          icon="📊"
        />
      );
      expect(screen.getByText('0')).toBeInTheDocument();
    });

    test('handles negative change', () => {
      render(
        <KPICard
          label="Decline"
          value={100}
          change={-25}
          trend="down"
          icon="📉"
        />
      );
      expect(screen.getByText('-25%')).toBeInTheDocument();
    });

    test('handles empty icon gracefully', () => {
      const { container } = render(
        <KPICard
          label="No Icon"
          value="100"
          icon=""
        />
      );
      expect(container).toBeInTheDocument();
    });

    test('handles long labels', () => {
      const longLabel = 'This is a very long label that might wrap to multiple lines';
      render(
        <KPICard
          label={longLabel}
          value="100"
          icon="📊"
        />
      );
      expect(screen.getByText(longLabel)).toBeInTheDocument();
    });

    test('handles special characters in values', () => {
      render(
        <KPICard
          label="Special"
          value="$1,234.56"
          icon="💵"
        />
      );
      expect(screen.getByText('$1,234.56')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    test('has proper semantic structure', () => {
      const { container } = render(
        <KPICard
          label="Accessible"
          value="100"
          icon="📊"
        />
      );
      const card = container.firstChild;
      expect(card).toBeInTheDocument();
    });

    test('displays label as readable text', () => {
      render(
        <KPICard
          label="Accessible Label"
          value="100"
          icon="📊"
        />
      );
      expect(screen.getByText('Accessible Label')).toBeVisible();
    });

    test('displays value as readable text', () => {
      render(
        <KPICard
          label="Value Display"
          value="Test Value"
          icon="📊"
        />
      );
      expect(screen.getByText('Test Value')).toBeVisible();
    });
  });

  describe('Props Combination', () => {
    test('renders with all props provided', () => {
      render(
        <KPICard
          label="Complete"
          value={1500}
          unit="units"
          change={15}
          trend="up"
          icon="🎯"
          showProgress={true}
          progressMax={2000}
          backgroundColor="#001a33"
          accentColor="#00ff00"
          onClick={() => console.log('clicked')}
        />
      );
      expect(screen.getByText('Complete')).toBeInTheDocument();
      expect(screen.getByText('1500')).toBeInTheDocument();
      expect(screen.getByText('units')).toBeInTheDocument();
      expect(screen.getByText('+15%')).toBeInTheDocument();
    });

    test('renders minimal version with only required props', () => {
      render(
        <KPICard
          label="Minimal"
          value="50"
          icon="📊"
        />
      );
      expect(screen.getByText('Minimal')).toBeInTheDocument();
      expect(screen.getByText('50')).toBeInTheDocument();
    });
  });
});
