import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import { FloatingSearchPill } from './FloatingSearchPill';

describe('FloatingSearchPill Component', () => {
  it('renders trigger pill cleanly', () => {
    render(
      <BrowserRouter>
        <FloatingSearchPill />
      </BrowserRouter>
    );
    expect(screen.getByText(/Search Dubai properties/i)).toBeInTheDocument();
  });

  it('opens search modal on click', () => {
    render(
      <BrowserRouter>
        <FloatingSearchPill />
      </BrowserRouter>
    );
    const pill = screen.getByText(/Search Dubai properties/i);
    fireEvent.click(pill);
    expect(screen.getByPlaceholderText(/Type property name, area/i)).toBeInTheDocument();
  });

  it('triggers onSearch callback when submitted', () => {
    const handleSearch = vi.fn();
    render(
      <BrowserRouter>
        <FloatingSearchPill onSearch={handleSearch} />
      </BrowserRouter>
    );
    fireEvent.click(screen.getByText(/Search Dubai properties/i));
    const input = screen.getByPlaceholderText(/Type property name, area/i);
    fireEvent.change(input, { target: { value: 'Palm Jumeirah' } });
    fireEvent.submit(input.closest('form')!);
    expect(handleSearch).toHaveBeenCalledWith('Palm Jumeirah');
  });
});
