import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BulkLeadActionToolbar } from './BulkLeadActionToolbar';
describe('BulkLeadActionToolbar', () => {
  it('renders when selectedCount > 0', () => {
    render(<BulkLeadActionToolbar selectedCount={5} onClearSelection={vi.fn()} />);
    expect(screen.getByTestId('bulk-lead-toolbar')).toBeTruthy();
    expect(screen.getByText('5')).toBeTruthy();
  });
  it('renders null when no selection', () => {
    const { container } = render(<BulkLeadActionToolbar selectedCount={0} onClearSelection={vi.fn()} />);
    expect(container.firstChild).toBeNull();
  });
});
