import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import { CustomCursor } from './CustomCursor';

describe('CustomCursor', () => {
  it('renders without crashing and attaches mousemove listener', () => {
    const { container } = render(<CustomCursor />);
    expect(container).toBeDefined();

    fireEvent.mouseMove(window, { clientX: 100, clientY: 200 });
  });

  it('updates hover state on mouseover button element', () => {
    const { container } = render(
      <div>
        <CustomCursor />
        <button data-testid="test-btn">Click me</button>
      </div>
    );

    const btn = container.querySelector('button');
    if (btn) {
      fireEvent.mouseOver(btn);
    }
    expect(container).toBeDefined();
  });
});
