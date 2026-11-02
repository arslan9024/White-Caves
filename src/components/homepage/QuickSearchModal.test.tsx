import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import QuickSearchModal from './QuickSearchModal';

const mockedNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockedNavigate,
  };
});

describe('QuickSearchModal Component', () => {
  it('renders modal when isOpen is true', () => {
    render(
      <BrowserRouter>
        <QuickSearchModal isOpen={true} onClose={vi.fn()} />
      </BrowserRouter>
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Search by community/i)).toBeInTheDocument();
  });

  it('does not render modal when isOpen is false', () => {
    const { container } = render(
      <BrowserRouter>
        <QuickSearchModal isOpen={false} onClose={vi.fn()} />
      </BrowserRouter>
    );

    expect(container.querySelector('[role="dialog"]')).toBeNull();
  });

  it('triggers search on popular tag click', () => {
    const onClose = vi.fn();
    render(
      <BrowserRouter>
        <QuickSearchModal isOpen={true} onClose={onClose} />
      </BrowserRouter>
    );

    const tag = screen.getByText('Palm Jumeirah Villa');
    fireEvent.click(tag);

    expect(mockedNavigate).toHaveBeenCalledWith('/properties?q=Palm%20Jumeirah%20Villa');
    expect(onClose).toHaveBeenCalled();
  });
});
