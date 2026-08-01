import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Tooltip } from './Tooltip';

describe('Tooltip Component', () => {
  it('renders trigger child element', () => {
    render(
      <Tooltip content="Tooltip Help Info">
        <button>Hover Me</button>
      </Tooltip>
    );
    expect(screen.getByRole('button', { name: /Hover Me/i })).toBeInTheDocument();
  });

  it('shows tooltip content on mouse enter', () => {
    render(
      <Tooltip content="Tooltip Help Info" delay={0}>
        <button>Hover Me</button>
      </Tooltip>
    );
    const btn = screen.getByRole('button', { name: /Hover Me/i });
    fireEvent.mouseEnter(btn);
    expect(screen.getByText('Tooltip Help Info')).toBeInTheDocument();
  });
});
