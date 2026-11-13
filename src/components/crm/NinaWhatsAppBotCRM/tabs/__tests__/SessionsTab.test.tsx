import React from 'react';
import { render, renderHook, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useBotData } from '../../hooks/useBotData';
import { SessionsTab } from '../SessionsTab';

describe('SessionsTab', () => {
  it('renders the pairing controls with accessible method selection', () => {
    const { result } = renderHook(() => useBotData());

    render(<SessionsTab data={result.current} />);

    expect(screen.getByRole('group', { name: 'Pairing method' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /8-digit pairing code/i })).toHaveAttribute(
      'aria-pressed',
      'true'
    );
  });
});
