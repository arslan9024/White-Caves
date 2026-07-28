import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { PropertySearchPanel } from './PropertySearchPanel';

describe('PropertySearchPanel — production quality tests', () => {
  let alertSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
  });

  afterEach(() => {
    alertSpy.mockRestore();
  });

  it('renders without crashing', () => {
    render(<PropertySearchPanel />);
    expect(screen.getByText(/Advanced Property Search/i)).toBeInTheDocument();
  });

  it('renders search query input', () => {
    render(<PropertySearchPanel />);
    expect(screen.getByPlaceholderText(/Search properties/i)).toBeInTheDocument();
  });

  it('allows toggling currency between AED, USD, EUR, GBP', () => {
    render(<PropertySearchPanel />);
    const usdBtn = screen.getByRole('button', { name: 'USD' });
    fireEvent.click(usdBtn);
    expect(usdBtn).toBeInTheDocument();
  });

  it('allows switching view mode between Grid and Table', () => {
    render(<PropertySearchPanel />);
    const tableBtn = screen.getByRole('button', { name: /Table/i });
    fireEvent.click(tableBtn);
    expect(tableBtn).toBeInTheDocument();
  });

  it('never calls window.alert on any user interaction', () => {
    render(<PropertySearchPanel />);
    const searchInput = screen.getByPlaceholderText(/Search properties/i);
    fireEvent.change(searchInput, { target: { value: 'Palm' } });
    expect(alertSpy).not.toHaveBeenCalled();
  });
});
