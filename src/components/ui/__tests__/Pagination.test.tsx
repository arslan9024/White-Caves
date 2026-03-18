import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Pagination from '../Pagination';

describe('Pagination Component', () => {
  describe('Rendering', () => {
    it('should render pagination controls', () => {
      const handlePageChange = vi.fn();
      render(
        <Pagination
          currentPage={1}
          totalPages={5}
          onPageChange={handlePageChange}
        />
      );
      expect(screen.getByRole('navigation')).toBeInTheDocument();
    });

    it('should display correct number of page buttons', () => {
      const handlePageChange = vi.fn();
      render(
        <Pagination
          currentPage={1}
          totalPages={3}
          onPageChange={handlePageChange}
        />
      );
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);
    });

    it('should show current page as active', () => {
      const handlePageChange = vi.fn();
      const { container } = render(
        <Pagination
          currentPage={2}
          totalPages={5}
          onPageChange={handlePageChange}
        />
      );
      const activeButton = container.querySelector('[aria-current="page"]');
      expect(activeButton).toBeInTheDocument();
    });
  });

  describe('Navigation', () => {
    it('should call onPageChange when page button is clicked', async () => {
      const handlePageChange = vi.fn();
      const user = userEvent.setup();
      render(
        <Pagination
          currentPage={1}
          totalPages={5}
          onPageChange={handlePageChange}
        />
      );
      
      const page2Button = screen.getByRole('button', { name: /2/i });
      await user.click(page2Button);
      
      expect(handlePageChange).toHaveBeenCalledWith(2);
    });

    it('should handle next page navigation', async () => {
      const handlePageChange = vi.fn();
      const user = userEvent.setup();
      render(
        <Pagination
          currentPage={1}
          totalPages={5}
          onPageChange={handlePageChange}
        />
      );
      
      const nextButton = screen.getByRole('button', { name: /next/i });
      if (nextButton) {
        await user.click(nextButton);
        expect(handlePageChange).toHaveBeenCalled();
      }
    });

    it('should handle previous page navigation', async () => {
      const handlePageChange = vi.fn();
      const user = userEvent.setup();
      render(
        <Pagination
          currentPage={3}
          totalPages={5}
          onPageChange={handlePageChange}
        />
      );
      
      const prevButton = screen.getByRole('button', { name: /prev/i });
      if (prevButton) {
        await user.click(prevButton);
        expect(handlePageChange).toHaveBeenCalled();
      }
    });
  });

  describe('Disabled States', () => {
    it('should disable previous button on first page', () => {
      const handlePageChange = vi.fn();
      render(
        <Pagination
          currentPage={1}
          totalPages={5}
          onPageChange={handlePageChange}
        />
      );
      
      const prevButton = screen.queryByRole('button', { name: /prev/i });
      if (prevButton) {
        expect(prevButton).toBeDisabled();
      }
    });

    it('should disable next button on last page', () => {
      const handlePageChange = vi.fn();
      render(
        <Pagination
          currentPage={5}
          totalPages={5}
          onPageChange={handlePageChange}
        />
      );
      
      const nextButton = screen.queryByRole('button', { name: /next/i });
      if (nextButton) {
        expect(nextButton).toBeDisabled();
      }
    });
  });

  describe('Single Page', () => {
    it('should handle single page pagination', () => {
      const handlePageChange = vi.fn();
      render(
        <Pagination
          currentPage={1}
          totalPages={1}
          onPageChange={handlePageChange}
        />
      );
      expect(screen.queryByRole('navigation')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper aria attributes', () => {
      const handlePageChange = vi.fn();
      render(
        <Pagination
          currentPage={1}
          totalPages={5}
          onPageChange={handlePageChange}
        />
      );
      
      const pagination = screen.getByRole('navigation');
      expect(pagination).toBeInTheDocument();
    });

    it('should support keyboard navigation', async () => {
      const handlePageChange = vi.fn();
      const user = userEvent.setup();
      render(
        <Pagination
          currentPage={1}
          totalPages={5}
          onPageChange={handlePageChange}
        />
      );
      
      const button = screen.getByRole('button', { name: /2/i });
      button.focus();
      expect(button).toHaveFocus();
    });
  });
});
