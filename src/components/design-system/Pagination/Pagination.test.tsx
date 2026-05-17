/**
 * Pagination — Unit Tests
 * Tests: rendering, page navigation, ellipsis, disabled states, edge cases
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { Pagination } from './Pagination';

describe('Pagination', () => {
  const defaultProps = {
    currentPage: 3,
    totalPages: 10,
    onPageChange: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ── Rendering ─────────────────────────────────────────────────────────

  it('renders Previous and Next buttons', () => {
    render(<Pagination {...defaultProps} />);
    expect(screen.getByText('← Previous')).toBeInTheDocument();
    expect(screen.getByText('Next →')).toBeInTheDocument();
  });

  it('renders page info text', () => {
    render(<Pagination {...defaultProps} />);
    expect(screen.getByText('Page 3 of 10')).toBeInTheDocument();
  });

  it('renders page number buttons', () => {
    render(<Pagination {...defaultProps} />);
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
  });

  // ── Hidden for single/zero pages ──────────────────────────────────────

  it('returns null when totalPages is 1', () => {
    const { container } = render(
      <Pagination currentPage={1} totalPages={1} onPageChange={vi.fn()} />,
    );
    expect(container.firstChild).toBeNull();
  });

  it('returns null when totalPages is 0', () => {
    const { container } = render(
      <Pagination currentPage={1} totalPages={0} onPageChange={vi.fn()} />,
    );
    expect(container.firstChild).toBeNull();
  });

  it('returns null for negative totalPages', () => {
    const { container } = render(
      <Pagination currentPage={1} totalPages={-5} onPageChange={vi.fn()} />,
    );
    expect(container.firstChild).toBeNull();
  });

  // ── Navigation ────────────────────────────────────────────────────────

  it('calls onPageChange with previous page on Previous click', () => {
    const onPageChange = vi.fn();
    render(<Pagination currentPage={5} totalPages={10} onPageChange={onPageChange} />);
    fireEvent.click(screen.getByText('← Previous'));
    expect(onPageChange).toHaveBeenCalledWith(4);
  });

  it('calls onPageChange with next page on Next click', () => {
    const onPageChange = vi.fn();
    render(<Pagination currentPage={5} totalPages={10} onPageChange={onPageChange} />);
    fireEvent.click(screen.getByText('Next →'));
    expect(onPageChange).toHaveBeenCalledWith(6);
  });

  it('calls onPageChange with page number on page button click', () => {
    const onPageChange = vi.fn();
    render(<Pagination currentPage={3} totalPages={10} onPageChange={onPageChange} />);
    fireEvent.click(screen.getByText('5'));
    expect(onPageChange).toHaveBeenCalledWith(5);
  });

  // ── Disabled states ───────────────────────────────────────────────────

  it('disables Previous button on first page', () => {
    render(<Pagination currentPage={1} totalPages={5} onPageChange={vi.fn()} />);
    const prevBtn = screen.getByText('← Previous').closest('button');
    expect(prevBtn).toBeDisabled();
  });

  it('disables Next button on last page', () => {
    render(<Pagination currentPage={5} totalPages={5} onPageChange={vi.fn()} />);
    const nextBtn = screen.getByText('Next →').closest('button');
    expect(nextBtn).toBeDisabled();
  });

  it('does not call onPageChange when Previous is disabled', () => {
    const onPageChange = vi.fn();
    render(<Pagination currentPage={1} totalPages={5} onPageChange={onPageChange} />);
    fireEvent.click(screen.getByText('← Previous'));
    expect(onPageChange).not.toHaveBeenCalled();
  });

  it('does not call onPageChange when Next is disabled', () => {
    const onPageChange = vi.fn();
    render(<Pagination currentPage={10} totalPages={10} onPageChange={onPageChange} />);
    fireEvent.click(screen.getByText('Next →'));
    expect(onPageChange).not.toHaveBeenCalled();
  });

  // ── Ellipsis ──────────────────────────────────────────────────────────

  it('renders ellipsis when pages are truncated', () => {
    render(<Pagination currentPage={5} totalPages={20} onPageChange={vi.fn()} />);
    const ellipses = screen.getAllByText('...');
    expect(ellipses.length).toBeGreaterThanOrEqual(1);
  });

  // ── className ─────────────────────────────────────────────────────────

  it('passes className to the container', () => {
    const { container } = render(
      <Pagination {...defaultProps} className="custom-pagination" />,
    );
    expect(container.firstChild).toHaveClass('custom-pagination');
  });
});
