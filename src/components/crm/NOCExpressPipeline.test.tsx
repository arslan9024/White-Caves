import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { NOCExpressPipeline } from './NOCExpressPipeline';

describe('NOCExpressPipeline Component', () => {
  it('renders NOC conveyancing pipeline container', () => {
    render(<NOCExpressPipeline />);
    expect(screen.getByTestId('noc-express-pipeline')).toBeInTheDocument();
    expect(screen.getByText(/NOC Express Developer Conveyancing Pipeline/i)).toBeInTheDocument();
  });

  it('handles manager escalation trigger button', () => {
    render(<NOCExpressPipeline />);
    const buttons = screen.getAllByRole('button', { name: /Escalate to Manager/i });
    fireEvent.click(buttons[0]);
    expect(screen.getAllByText(/Escalated to Manager/i)[0]).toBeInTheDocument();
  });
});
