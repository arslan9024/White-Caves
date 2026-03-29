import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';

// Mock styled-components
vi.mock('./PipelineProgress/PipelineProgress.styles', () => {
  const c = (tag: string) => ({ children, ...props }: any) => {
    // Filter transient props ($variant, $completed, $current, $isActive)
    const filtered: any = {};
    for (const [k, v] of Object.entries(props)) {
      if (!k.startsWith('$')) filtered[k] = v;
    }
    return React.createElement(tag, filtered, children);
  };
  return {
    PipelineProgressContainer: c('div'),
    PipelineStageContainer: c('div'),
    StageIndicator: c('div'),
    StageDot: c('span'),
    StageLine: c('hr'),
    StageContent: c('div'),
    StageName: c('span'),
    StageCount: c('span'),
    StageValue: c('span'),
    PipelineBoardContainer: c('div'),
    PipelineColumn: c('div'),
    ColumnHeader: c('div'),
    ColumnName: c('span'),
    ColumnCount: c('span'),
    ColumnValue: c('span'),
    ColumnItems: c('div'),
    PipelineItemContainer: c('div'),
    ItemName: c('span'),
    ItemValue: c('span'),
    DealProgressBarContainer: c('div'),
    ProgressBarWrapper: c('div'),
    ProgressBarFill: c('div'),
    ProgressStage: c('span'),
  };
});

import PipelineProgress, { PipelineBoard, DealProgressBar } from './PipelineProgress';

describe('PipelineProgress', () => {
  const simpleStages = ['Lead', 'Qualified', 'Negotiation', 'Closed'];

  // ── Basic Rendering ────────────────────────────────────────
  describe('basic rendering', () => {
    it('renders all stages', () => {
      render(<PipelineProgress stages={simpleStages} currentStage="Qualified" />);
      simpleStages.forEach(s => {
        expect(screen.getByText(s)).toBeInTheDocument();
      });
    });

    it('shows checkmark for completed stages', () => {
      render(<PipelineProgress stages={simpleStages} currentStage="Negotiation" />);
      // Lead (idx 0) and Qualified (idx 1) are before Negotiation (idx 2)
      const checkmarks = screen.getAllByText('✓');
      expect(checkmarks.length).toBe(2);
    });

    it('shows numeric index for current and future stages', () => {
      render(<PipelineProgress stages={simpleStages} currentStage="Qualified" />);
      // Qualified is idx 1 (current), Negotiation is idx 2, Closed is idx 3
      expect(screen.getByText('2')).toBeInTheDocument(); // Qualified (current)
      expect(screen.getByText('3')).toBeInTheDocument(); // Negotiation
      expect(screen.getByText('4')).toBeInTheDocument(); // Closed
    });
  });

  // ── Object Stages ─────────────────────────────────────────
  describe('object stages', () => {
    const objectStages = [
      { name: 'Lead', value: 'AED 500K', count: 12 },
      { name: 'Qualified', value: 'AED 1M', count: 5 },
      { name: 'Closed', value: 'AED 2M', count: 2 },
    ];

    it('renders object stage names', () => {
      render(<PipelineProgress stages={objectStages} currentStage="Qualified" showValues />);
      expect(screen.getByText('Lead')).toBeInTheDocument();
      expect(screen.getByText('Qualified')).toBeInTheDocument();
      expect(screen.getByText('Closed')).toBeInTheDocument();
    });

    it('renders counts when showValues is true', () => {
      render(<PipelineProgress stages={objectStages} currentStage="Qualified" showValues />);
      expect(screen.getByText('12')).toBeInTheDocument();
      expect(screen.getByText('5')).toBeInTheDocument();
      // '2' appears as both a count and a stage number — use getAllByText
      const twos = screen.getAllByText('2');
      expect(twos.length).toBeGreaterThanOrEqual(1);
    });

    it('renders values when showValues is true', () => {
      render(<PipelineProgress stages={objectStages} currentStage="Qualified" showValues />);
      expect(screen.getByText('AED 500K')).toBeInTheDocument();
      expect(screen.getByText('AED 1M')).toBeInTheDocument();
      expect(screen.getByText('AED 2M')).toBeInTheDocument();
    });

    it('hides values when showValues is false', () => {
      render(<PipelineProgress stages={objectStages} currentStage="Qualified" />);
      expect(screen.queryByText('AED 500K')).not.toBeInTheDocument();
      expect(screen.queryByText('12')).not.toBeInTheDocument();
    });
  });

  // ── Edge Cases ─────────────────────────────────────────────
  describe('edge cases', () => {
    it('handles first stage as current', () => {
      render(<PipelineProgress stages={simpleStages} currentStage="Lead" />);
      expect(screen.getByText('1')).toBeInTheDocument(); // Current stage is numbered
      expect(screen.queryByText('✓')).not.toBeInTheDocument(); // No completed stages
    });

    it('handles last stage as current', () => {
      render(<PipelineProgress stages={simpleStages} currentStage="Closed" />);
      // All previous stages completed
      const checkmarks = screen.getAllByText('✓');
      expect(checkmarks.length).toBe(3); // 3 completed before Closed
    });

    it('handles unknown currentStage', () => {
      render(<PipelineProgress stages={simpleStages} currentStage="Unknown" />);
      // All should show numbers since currentIndex == -1
      simpleStages.forEach(s => {
        expect(screen.getByText(s)).toBeInTheDocument();
      });
    });

    it('applies custom className', () => {
      const { container } = render(
        <PipelineProgress stages={simpleStages} currentStage="Lead" className="my-pipeline" />
      );
      expect(container.querySelector('.my-pipeline')).toBeInTheDocument();
    });
  });
});

describe('PipelineBoard', () => {
  const boardStages = [
    { name: 'New Leads', count: 8, value: 'AED 1.2M', items: [{ id: '1', name: 'John Doe', value: 'AED 500K' }] },
    { name: 'In Progress', count: 3, items: [{ id: '2', title: 'Villa Deal' }] },
    { name: 'Closed', count: 1 },
  ];

  it('renders all board columns', () => {
    render(<PipelineBoard stages={boardStages} />);
    expect(screen.getByText('New Leads')).toBeInTheDocument();
    expect(screen.getByText('In Progress')).toBeInTheDocument();
    expect(screen.getByText('Closed')).toBeInTheDocument();
  });

  it('renders column counts', () => {
    render(<PipelineBoard stages={boardStages} />);
    expect(screen.getByText('8')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('renders column value', () => {
    render(<PipelineBoard stages={boardStages} />);
    expect(screen.getByText('AED 1.2M')).toBeInTheDocument();
  });

  it('renders items in columns', () => {
    render(<PipelineBoard stages={boardStages} />);
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('AED 500K')).toBeInTheDocument();
    expect(screen.getByText('Villa Deal')).toBeInTheDocument();
  });

  it('applies className', () => {
    const { container } = render(<PipelineBoard stages={boardStages} className="my-board" />);
    expect(container.querySelector('.my-board')).toBeInTheDocument();
  });
});

describe('DealProgressBar', () => {
  it('renders progress bar', () => {
    const { container } = render(<DealProgressBar progress={75} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('sets width to match progress percentage', () => {
    const { container } = render(<DealProgressBar progress={60} />);
    const fill = container.querySelector('[style]');
    expect(fill).toBeInTheDocument();
    expect(fill?.getAttribute('style')).toContain('60%');
  });

  it('renders stage text when provided', () => {
    render(<DealProgressBar progress={50} stage="Negotiation" />);
    expect(screen.getByText('Negotiation')).toBeInTheDocument();
  });

  it('does not render stage text when not provided', () => {
    render(<DealProgressBar progress={50} />);
    expect(screen.queryByText('Negotiation')).not.toBeInTheDocument();
  });

  it('applies className', () => {
    const { container } = render(<DealProgressBar progress={50} className="my-bar" />);
    expect(container.querySelector('.my-bar')).toBeInTheDocument();
  });
});
