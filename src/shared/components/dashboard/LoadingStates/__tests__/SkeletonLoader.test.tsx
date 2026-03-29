import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';

// Mock CSS import
vi.mock('../LoadingStates.css', () => ({}));

import SkeletonLoader, { ContentPlaceholder } from '../SkeletonLoader';

describe('SkeletonLoader', () => {
  describe('Default (text)', () => {
    it('should render a text skeleton by default', () => {
      const { container } = render(<SkeletonLoader />);
      expect(container.querySelector('.skeleton-text')).toBeInTheDocument();
    });

    it('should render inside skeleton-container', () => {
      const { container } = render(<SkeletonLoader />);
      expect(container.querySelector('.skeleton-container')).toBeInTheDocument();
    });

    it('should be animated by default', () => {
      const { container } = render(<SkeletonLoader />);
      expect(container.querySelector('.animated')).toBeInTheDocument();
    });
  });

  describe('Types', () => {
    it('should render avatar skeleton', () => {
      const { container } = render(<SkeletonLoader type="avatar" />);
      expect(container.querySelector('.skeleton-avatar')).toBeInTheDocument();
    });

    it('should render card skeleton with image and content', () => {
      const { container } = render(<SkeletonLoader type="card" />);
      expect(container.querySelector('.skeleton-card')).toBeInTheDocument();
      expect(container.querySelector('.skeleton-image')).toBeInTheDocument();
      expect(container.querySelector('.skeleton-title')).toBeInTheDocument();
    });

    it('should render stat skeleton with icon and value', () => {
      const { container } = render(<SkeletonLoader type="stat" />);
      expect(container.querySelector('.skeleton-stat')).toBeInTheDocument();
      expect(container.querySelector('.skeleton-stat-icon')).toBeInTheDocument();
      expect(container.querySelector('.skeleton-stat-value')).toBeInTheDocument();
    });

    it('should render table-row skeleton with cells', () => {
      const { container } = render(<SkeletonLoader type="table-row" />);
      expect(container.querySelector('.skeleton-table-row')).toBeInTheDocument();
      const cells = container.querySelectorAll('.skeleton-cell');
      expect(cells.length).toBe(5);
    });

    it('should render list-item skeleton', () => {
      const { container } = render(<SkeletonLoader type="list-item" />);
      expect(container.querySelector('.skeleton-list-item')).toBeInTheDocument();
      expect(container.querySelector('.skeleton-list-content')).toBeInTheDocument();
    });
  });

  describe('Count', () => {
    it('should render multiple skeletons with count', () => {
      const { container } = render(<SkeletonLoader type="text" count={4} />);
      const items = container.querySelectorAll('.skeleton-text');
      expect(items.length).toBe(4);
    });

    it('should render 1 skeleton by default', () => {
      const { container } = render(<SkeletonLoader type="avatar" />);
      const items = container.querySelectorAll('.skeleton-avatar');
      expect(items.length).toBe(1);
    });

    it('should render multiple cards', () => {
      const { container } = render(<SkeletonLoader type="card" count={3} />);
      const items = container.querySelectorAll('.skeleton-card');
      expect(items.length).toBe(3);
    });
  });

  describe('Animation', () => {
    it('should add animated class when animated=true', () => {
      const { container } = render(<SkeletonLoader animated={true} />);
      expect(container.querySelector('.animated')).toBeInTheDocument();
    });

    it('should not add animated class when animated=false', () => {
      const { container } = render(<SkeletonLoader animated={false} />);
      expect(container.querySelector('.animated')).not.toBeInTheDocument();
    });
  });

  describe('Custom Dimensions', () => {
    it('should apply custom width to text skeleton', () => {
      const { container } = render(<SkeletonLoader type="text" width="200px" />);
      const el = container.querySelector('.skeleton-text') as HTMLElement;
      expect(el.style.width).toBe('200px');
    });

    it('should apply custom height to text skeleton', () => {
      const { container } = render(<SkeletonLoader type="text" height="50px" />);
      const el = container.querySelector('.skeleton-text') as HTMLElement;
      expect(el.style.height).toBe('50px');
    });

    it('should apply custom width to avatar skeleton', () => {
      const { container } = render(<SkeletonLoader type="avatar" width={60} />);
      const el = container.querySelector('.skeleton-avatar') as HTMLElement;
      expect(el.style.width).toBe('60px');
    });
  });

  describe('Custom className', () => {
    it('should apply className to skeleton element', () => {
      const { container } = render(<SkeletonLoader className="my-skeleton" />);
      expect(container.querySelector('.my-skeleton')).toBeInTheDocument();
    });
  });
});

describe('ContentPlaceholder', () => {
  it('should render with default 3 rows', () => {
    const { container } = render(<ContentPlaceholder />);
    const rows = container.querySelectorAll('.skeleton-text');
    expect(rows.length).toBe(3);
  });

  it('should render custom row count', () => {
    const { container } = render(<ContentPlaceholder rows={5} />);
    const rows = container.querySelectorAll('.skeleton-text');
    expect(rows.length).toBe(5);
  });

  it('should show avatar when showAvatar=true', () => {
    const { container } = render(<ContentPlaceholder showAvatar />);
    expect(container.querySelector('.skeleton-avatar')).toBeInTheDocument();
  });

  it('should not show avatar by default', () => {
    const { container } = render(<ContentPlaceholder />);
    expect(container.querySelector('.placeholder-content .skeleton-avatar')).not.toBeInTheDocument();
  });

  it('should show image when showImage=true', () => {
    const { container } = render(<ContentPlaceholder showImage />);
    expect(container.querySelector('.skeleton-image')).toBeInTheDocument();
  });

  it('should not show image by default', () => {
    const { container } = render(<ContentPlaceholder />);
    expect(container.querySelector('.skeleton-image')).not.toBeInTheDocument();
  });

  it('should apply custom className', () => {
    const { container } = render(<ContentPlaceholder className="custom-ph" />);
    expect(container.querySelector('.custom-ph')).toBeInTheDocument();
  });

  it('should mark last row as short', () => {
    const { container } = render(<ContentPlaceholder rows={3} />);
    const rows = container.querySelectorAll('.skeleton-text');
    expect(rows[2].classList.contains('short')).toBe(true);
    expect(rows[0].classList.contains('short')).toBe(false);
  });
});
