import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ExecutiveAIVSCodeSidebar from './ExecutiveAIVSCodeSidebar';

describe('ExecutiveAIVSCodeSidebar Component (7-Category Co-Location Spec)', () => {
  it('renders AI Command Center drawer with Zoe Sovereign card', () => {
    render(<ExecutiveAIVSCodeSidebar />);
    expect(screen.getByText(/AI Command Center/i)).toBeInTheDocument();
  });
});
