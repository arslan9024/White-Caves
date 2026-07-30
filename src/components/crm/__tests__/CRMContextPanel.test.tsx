import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import CRMContextPanel from '../CRMContextPanel';

describe('CRMContextPanel Component', () => {
  it('renders CRMContextPanel component without crashing', () => {
    const { container } = render(
      <CRMContextPanel
        isSuperUser={true}
        activeWorkspaceLabel="White Caves"
        activeWorkspaceMeta="Main"
        selectedContext={null}
        recentActivities={[]}
        onOpenCommandPalette={vi.fn()}
        onOpenQuickAction={vi.fn()}
      />
    );
    expect(container).toBeDefined();
  });
});
