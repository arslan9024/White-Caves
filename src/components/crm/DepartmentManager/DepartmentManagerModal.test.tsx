import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import DepartmentManagerModal from './DepartmentManagerModal';

describe('DepartmentManagerModal Component (7-Category Co-Location Spec)', () => {
  it('renders modal with title when open is true', () => {
    render(<DepartmentManagerModal isOpen={true} onClose={vi.fn()} onSuccess={vi.fn()} />);
    expect(screen.getByText(/Corporate Departments Management/i)).toBeInTheDocument();
  });

  it('does not render modal when open is false', () => {
    const { container } = render(
      <DepartmentManagerModal isOpen={false} onClose={vi.fn()} onSuccess={vi.fn()} />
    );
    expect(container.firstChild).toBeNull();
  });
});
