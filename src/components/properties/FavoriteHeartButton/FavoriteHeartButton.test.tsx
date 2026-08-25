import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { FavoriteHeartButton } from './FavoriteHeartButton';

describe('FavoriteHeartButton', () => {
  it('renders un-favorited state initially and toggles on click', () => {
    const onToggle = vi.fn();
    render(<FavoriteHeartButton initialFavorited={false} onToggle={onToggle} />);

    const btn = screen.getByTestId('favorite-heart-button');
    expect(btn.textContent).toBe('🤍');

    fireEvent.click(btn);
    expect(btn.textContent).toBe('❤️');
    expect(onToggle).toHaveBeenCalledWith(true);

    fireEvent.click(btn);
    expect(btn.textContent).toBe('🤍');
    expect(onToggle).toHaveBeenCalledWith(false);
  });
});
