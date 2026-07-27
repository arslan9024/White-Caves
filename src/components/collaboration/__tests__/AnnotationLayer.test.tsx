import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { AnnotationLayer } from '../AnnotationLayer';

describe('AnnotationLayer Component', () => {
  const defaultProps = {
    participants: [
      {
        id: 'investor-1',
        name: 'Investor Ali',
        role: 'investor' as const,
        cursor: { x: 100, y: 150 },
        avatarColor: '#EF4444',
        lastActive: Date.now(),
      },
    ],
    annotations: [],
    activeTool: 'pen' as const,
    strokeColor: '#EF4444',
    strokeWidth: 3,
    onAddAnnotation: vi.fn(),
    onClearAnnotations: vi.fn(),
  };

  it('renders canvas element and remote participant badge', () => {
    render(<AnnotationLayer {...defaultProps} />);

    expect(screen.getByText(/Investor Ali/)).toBeInTheDocument();
  });

  it('triggers mouse move callback when mouse moves over layer', () => {
    const onMouseMove = vi.fn();
    const { container } = render(<AnnotationLayer {...defaultProps} onMouseMove={onMouseMove} />);

    const wrapper = container.firstChild as HTMLElement;
    fireEvent.mouseMove(wrapper, { clientX: 50, clientY: 75 });

    expect(onMouseMove).toHaveBeenCalled();
  });
});
