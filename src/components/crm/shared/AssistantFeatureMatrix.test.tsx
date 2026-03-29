/**
 * AssistantFeatureMatrix — Comprehensive Unit Tests
 *
 * Covers: rendering, search, category filter, feature expansion,
 * stats display, status badges, empty state, custom categories
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import React from 'react';

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  CheckCircle: ({ size, className }: { size?: number; className?: string }) => <span data-testid="icon-check" className={className} />,
  Clock: ({ size, className }: { size?: number; className?: string }) => <span data-testid="icon-clock" className={className} />,
  AlertCircle: ({ size, className }: { size?: number; className?: string }) => <span data-testid="icon-alert" className={className} />,
  Code: ({ size }: { size?: number }) => <span data-testid="icon-code" />,
  FileCode: ({ size }: { size?: number }) => <span data-testid="icon-filecode" />,
  ChevronRight: ({ size, className }: { size?: number; className?: string }) => <span data-testid="icon-chevron" className={className} />,
  Search: ({ size }: { size?: number }) => <span data-testid="icon-search" />,
  Filter: ({ size }: { size?: number }) => <span data-testid="icon-filter" />,
  Zap: ({ size, className }: { size?: number; className?: string }) => <span data-testid="icon-zap" className={className} />,
  Star: ({ size, style }: { size?: number; style?: React.CSSProperties }) => <span data-testid="icon-star" />,
  Box: ({ size, className }: { size?: number; className?: string }) => <span data-testid="icon-box" className={className} />,
}));

// Mock CSS import
vi.mock('./AssistantFeatureMatrix.css', () => ({}));

import AssistantFeatureMatrix from './AssistantFeatureMatrix';

// ── Test data ────────────────────────────────────────────────────

const testFeatures = [
  {
    name: 'Auto Response',
    description: 'Automated AI responses for incoming messages',
    category: 'Communication',
    status: 'active' as const,
    sourceFiles: ['autoResponse.ts', 'responseEngine.ts'],
    capabilities: ['Smart replies', 'Context awareness'],
    nextMilestone: 'Multi-language support',
  },
  {
    name: 'Lead Scoring',
    description: 'AI-powered lead scoring system',
    category: 'Sales',
    status: 'beta' as const,
    capabilities: ['Score calculation', 'Priority ranking'],
  },
  {
    name: 'Report Generator',
    description: 'Automated report generation',
    category: 'Communication',
    status: 'planned' as const,
  },
  {
    name: 'Voice Integration',
    description: 'Voice call handling and transcription',
    category: 'Communication',
    status: 'development' as const,
    nextMilestone: 'Beta launch Q2',
  },
  {
    name: 'CRM Sync',
    description: 'Automatic CRM data synchronization',
    category: 'Sales',
    status: 'active' as const,
  },
];

beforeEach(() => {
  vi.clearAllMocks();
});

describe('AssistantFeatureMatrix', () => {
  describe('rendering', () => {
    it('renders with title', () => {
      render(<AssistantFeatureMatrix features={testFeatures} />);
      expect(screen.getByText('Programmed Capabilities')).toBeInTheDocument();
    });

    it('renders custom title', () => {
      render(<AssistantFeatureMatrix features={testFeatures} title="Custom Title" />);
      expect(screen.getByText('Custom Title')).toBeInTheDocument();
    });

    it('renders all feature names', () => {
      render(<AssistantFeatureMatrix features={testFeatures} />);
      expect(screen.getByText('Auto Response')).toBeInTheDocument();
      expect(screen.getByText('Lead Scoring')).toBeInTheDocument();
      expect(screen.getByText('Report Generator')).toBeInTheDocument();
      expect(screen.getByText('Voice Integration')).toBeInTheDocument();
      expect(screen.getByText('CRM Sync')).toBeInTheDocument();
    });

    it('renders search input', () => {
      render(<AssistantFeatureMatrix features={testFeatures} />);
      expect(screen.getByPlaceholderText('Search features...')).toBeInTheDocument();
    });

    it('renders category filter dropdown', () => {
      render(<AssistantFeatureMatrix features={testFeatures} />);
      const select = screen.getByRole('combobox');
      expect(select).toBeInTheDocument();
      expect(screen.getByText(/All Categories/)).toBeInTheDocument();
    });
  });

  describe('stats display', () => {
    it('shows total features count', () => {
      render(<AssistantFeatureMatrix features={testFeatures} />);
      expect(screen.getByText('5')).toBeInTheDocument();
      expect(screen.getByText('Total Features')).toBeInTheDocument();
    });

    it('shows active count', () => {
      render(<AssistantFeatureMatrix features={testFeatures} />);
      expect(screen.getByText('2 Active')).toBeInTheDocument();
    });

    it('shows beta count', () => {
      render(<AssistantFeatureMatrix features={testFeatures} />);
      expect(screen.getByText('1 Beta')).toBeInTheDocument();
    });

    it('shows development count when > 0', () => {
      render(<AssistantFeatureMatrix features={testFeatures} />);
      expect(screen.getByText('1 In Dev')).toBeInTheDocument();
    });

    it('shows planned count when > 0', () => {
      render(<AssistantFeatureMatrix features={testFeatures} />);
      expect(screen.getByText('1 Planned')).toBeInTheDocument();
    });

    it('hides development stat when 0', () => {
      const onlyActive = testFeatures.filter(f => f.status === 'active');
      render(<AssistantFeatureMatrix features={onlyActive} />);
      expect(screen.queryByText(/In Dev/)).not.toBeInTheDocument();
    });
  });

  describe('search', () => {
    it('filters features by name', () => {
      render(<AssistantFeatureMatrix features={testFeatures} />);
      fireEvent.change(screen.getByPlaceholderText('Search features...'), {
        target: { value: 'auto' },
      });
      expect(screen.getByText('Auto Response')).toBeInTheDocument();
      expect(screen.queryByText('Lead Scoring')).not.toBeInTheDocument();
    });

    it('filters features by description', () => {
      render(<AssistantFeatureMatrix features={testFeatures} />);
      fireEvent.change(screen.getByPlaceholderText('Search features...'), {
        target: { value: 'transcription' },
      });
      expect(screen.getByText('Voice Integration')).toBeInTheDocument();
      expect(screen.queryByText('Auto Response')).not.toBeInTheDocument();
    });

    it('is case-insensitive', () => {
      render(<AssistantFeatureMatrix features={testFeatures} />);
      fireEvent.change(screen.getByPlaceholderText('Search features...'), {
        target: { value: 'LEAD' },
      });
      expect(screen.getByText('Lead Scoring')).toBeInTheDocument();
    });

    it('shows empty state when no matches', () => {
      render(<AssistantFeatureMatrix features={testFeatures} />);
      fireEvent.change(screen.getByPlaceholderText('Search features...'), {
        target: { value: 'zzzznonexistent' },
      });
      expect(screen.getByText('No features found matching your criteria')).toBeInTheDocument();
    });
  });

  describe('category filter', () => {
    it('filters by category via dropdown', () => {
      render(<AssistantFeatureMatrix features={testFeatures} />);
      fireEvent.change(screen.getByRole('combobox'), {
        target: { value: 'Sales' },
      });
      expect(screen.getByText('Lead Scoring')).toBeInTheDocument();
      expect(screen.getByText('CRM Sync')).toBeInTheDocument();
      expect(screen.queryByText('Auto Response')).not.toBeInTheDocument();
    });

    it('shows all features with "all" category', () => {
      render(<AssistantFeatureMatrix features={testFeatures} />);
      fireEvent.change(screen.getByRole('combobox'), { target: { value: 'Sales' } });
      fireEvent.change(screen.getByRole('combobox'), { target: { value: 'all' } });
      expect(screen.getByText('Auto Response')).toBeInTheDocument();
      expect(screen.getByText('Lead Scoring')).toBeInTheDocument();
    });

    it('renders category chips', () => {
      const { container } = render(<AssistantFeatureMatrix features={testFeatures} />);
      const chipSection = container.querySelector('.category-overview')!;
      expect(within(chipSection).getByText('Communication')).toBeInTheDocument();
      expect(within(chipSection).getByText('Sales')).toBeInTheDocument();
    });

    it('toggles category on chip click', () => {
      const { container } = render(<AssistantFeatureMatrix features={testFeatures} />);
      const chipSection = container.querySelector('.category-overview')!;
      // Click Communication chip to filter
      const commChip = within(chipSection).getByText('Communication').closest('button')!;
      fireEvent.click(commChip);
      expect(screen.getByText('Auto Response')).toBeInTheDocument();
      expect(screen.queryByText('Lead Scoring')).not.toBeInTheDocument();
      // Click again to deselect
      fireEvent.click(commChip);
      expect(screen.getByText('Lead Scoring')).toBeInTheDocument();
    });

    it('shows category active/total counts', () => {
      render(<AssistantFeatureMatrix features={testFeatures} />);
      // Communication: 1 active out of 3
      expect(screen.getByText('1/3')).toBeInTheDocument();
      // Sales: 1 active out of 2  
      expect(screen.getByText('1/2')).toBeInTheDocument();
    });
  });

  describe('feature expansion', () => {
    it('expands feature on click to show description', () => {
      render(<AssistantFeatureMatrix features={testFeatures} />);
      const featureCard = screen.getByText('Auto Response').closest('.feature-card')!;
      fireEvent.click(featureCard);
      expect(screen.getByText('Automated AI responses for incoming messages')).toBeInTheDocument();
    });

    it('shows source files when expanded', () => {
      render(<AssistantFeatureMatrix features={testFeatures} />);
      const featureCard = screen.getByText('Auto Response').closest('.feature-card')!;
      fireEvent.click(featureCard);
      expect(screen.getByText('autoResponse.ts')).toBeInTheDocument();
      expect(screen.getByText('responseEngine.ts')).toBeInTheDocument();
    });

    it('shows capabilities when expanded', () => {
      render(<AssistantFeatureMatrix features={testFeatures} />);
      const featureCard = screen.getByText('Auto Response').closest('.feature-card')!;
      fireEvent.click(featureCard);
      expect(screen.getByText('Smart replies')).toBeInTheDocument();
      expect(screen.getByText('Context awareness')).toBeInTheDocument();
    });

    it('shows next milestone when expanded', () => {
      render(<AssistantFeatureMatrix features={testFeatures} />);
      const featureCard = screen.getByText('Auto Response').closest('.feature-card')!;
      fireEvent.click(featureCard);
      expect(screen.getByText('Next: Multi-language support')).toBeInTheDocument();
    });

    it('collapses on second click', () => {
      render(<AssistantFeatureMatrix features={testFeatures} />);
      const featureCard = screen.getByText('Auto Response').closest('.feature-card')!;
      fireEvent.click(featureCard);
      expect(screen.getByText('Automated AI responses for incoming messages')).toBeInTheDocument();
      fireEvent.click(featureCard);
      expect(screen.queryByText('Automated AI responses for incoming messages')).not.toBeInTheDocument();
    });

    it('only one feature expanded at a time', () => {
      render(<AssistantFeatureMatrix features={testFeatures} />);
      fireEvent.click(screen.getByText('Auto Response').closest('.feature-card')!);
      expect(screen.getByText('Automated AI responses for incoming messages')).toBeInTheDocument();
      fireEvent.click(screen.getByText('Lead Scoring').closest('.feature-card')!);
      expect(screen.queryByText('Automated AI responses for incoming messages')).not.toBeInTheDocument();
      expect(screen.getByText('AI-powered lead scoring system')).toBeInTheDocument();
    });
  });

  describe('status badges', () => {
    it('shows Active badge for active features', () => {
      render(<AssistantFeatureMatrix features={testFeatures} />);
      expect(screen.getAllByText('Active')).toHaveLength(2);
    });

    it('shows Beta badge for beta features', () => {
      render(<AssistantFeatureMatrix features={testFeatures} />);
      expect(screen.getByText('Beta')).toBeInTheDocument();
    });

    it('shows Planned badge for planned features', () => {
      render(<AssistantFeatureMatrix features={testFeatures} />);
      expect(screen.getByText('Planned')).toBeInTheDocument();
    });

    it('shows In Development badge for development features', () => {
      render(<AssistantFeatureMatrix features={testFeatures} />);
      expect(screen.getByText('In Development')).toBeInTheDocument();
    });
  });

  describe('empty state', () => {
    it('shows empty message when no features', () => {
      render(<AssistantFeatureMatrix features={[]} />);
      expect(screen.getByText('No features found matching your criteria')).toBeInTheDocument();
    });
  });

  describe('custom categories', () => {
    it('uses provided categories list', () => {
      render(
        <AssistantFeatureMatrix
          features={testFeatures}
          categories={['Communication', 'Sales', 'Custom']}
        />
      );
      expect(screen.getByText('Custom')).toBeInTheDocument();
    });
  });
});
