import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { SQAErrorBoundary } from '../SQAErrorBoundary';

const ThrowingComponent = () => {
  throw new Error('Test crash');
};

describe('SQAErrorBoundary Component', () => {
  it('renders children when no error occurs', () => {
    render(
      <SQAErrorBoundary>
        <div>Normal Content</div>
      </SQAErrorBoundary>
    );
    expect(screen.getByText('Normal Content')).toBeDefined();
  });
});
