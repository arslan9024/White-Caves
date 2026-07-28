import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import SubagentCollaborationPanel from './SubagentCollaborationPanel';

vi.mock('../../../services/subagentOrchestrationService', () => ({
  subagentOrchestrationService: {
    getOrchestrationStatus: vi.fn().mockResolvedValue({
      status: {
        activeCount: 2,
        tasks: [],
      },
      snapshots: {
        total: 1,
        items: [],
        facets: [],
        hasMore: false,
      },
    }),
    exportSnapshot: vi.fn(),
    restoreLatestSnapshot: vi.fn(),
    restoreSnapshotByFileName: vi.fn(),
    deleteSnapshotByFileName: vi.fn(),
    getSnapshotDetail: vi.fn(),
    getSnapshotRestorePreview: vi.fn(),
    getSnapshotCompare: vi.fn(),
    getSnapshotRestoreRecommendation: vi.fn(),
    submitTask: vi.fn(),
    updateTaskState: vi.fn(),
  },
}));

describe('SubagentCollaborationPanel Component', () => {
  it('renders Runtime Task Metrics & AI Telemetry header', () => {
    render(<SubagentCollaborationPanel assistantId="mary" />);
    expect(screen.getByText(/Runtime Task Metrics & AI Telemetry/i)).toBeInTheDocument();
  });

  it('renders 240ms latency meter and 98.4% AI confidence bar', () => {
    render(<SubagentCollaborationPanel assistantId="mary" />);
    expect(screen.getByText(/⚡ 240ms Avg Latency/i)).toBeInTheDocument();
    expect(screen.getByText(/AI Command Confidence Index/i)).toBeInTheDocument();
    expect(screen.getByText(/98.4% Optimal/i)).toBeInTheDocument();
  });
});
