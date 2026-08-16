import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { LanguageSelectorDropdown } from './LanguageSelectorDropdown';

describe('LanguageSelectorDropdown Component', () => {
  it('renders language dropdown selector and handles Arabic RTL toggle', () => {
    const onLanguageChange = vi.fn();
    render(<LanguageSelectorDropdown onLanguageChange={onLanguageChange} />);
    expect(screen.getByTestId('language-selector-dropdown')).toBeDefined();
    expect(screen.getByText(/EN \(English\)/i)).toBeDefined();

    // Click to open dropdown
    const btn = screen.getByRole('button');
    fireEvent.click(btn);
    expect(screen.getByText(/العربية \(RTL\)/i)).toBeDefined();

    // Select Arabic
    const arOption = screen.getByText(/العربية \(RTL\)/i);
    fireEvent.click(arOption);
    expect(onLanguageChange).toHaveBeenCalledWith('ar');
  });
});
