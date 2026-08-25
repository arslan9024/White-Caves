import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { ModuleViewport } from './ModuleViewport';

describe('ModuleViewport', () => {
  it('renders fallback error message when module is not found in registry', () => {
    render(
      <ModuleViewport
        moduleId="non_existent_module_xyz"
        user={{ name: 'Arslan Malik' }}
        onBackToOverview={vi.fn()}
      />
    );

    expect(screen.getByText(/Module Not Found: "non_existent_module_xyz"/i)).toBeInTheDocument();
    expect(screen.getByText(/Return to Executive Overview/i)).toBeInTheDocument();
  });
});
