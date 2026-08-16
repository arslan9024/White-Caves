import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ProfileThemeCustomizer } from './ProfileThemeCustomizer';

describe('ProfileThemeCustomizer Component', () => {
  it('renders profile theme customizer and switches accent ring colors', () => {
    const onAccentChange = vi.fn();
    render(<ProfileThemeCustomizer onAccentChange={onAccentChange} />);
    expect(screen.getByTestId('profile-theme-customizer')).toBeDefined();
    expect(screen.getByText(/Accent Ring Color:/i)).toBeDefined();

    const greenBtn = screen.getByRole('button', { name: /Select accent color #10B981/i });
    fireEvent.click(greenBtn);
    expect(onAccentChange).toHaveBeenCalledWith('#10B981');
  });
});
