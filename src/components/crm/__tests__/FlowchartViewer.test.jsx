import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import FlowchartViewer from '../FlowchartViewer';

describe('FlowchartViewer Component', () => {
  it('renders FlowchartViewer component without crashing', () => {
    const { container } = render(<FlowchartViewer />);
    expect(container).toBeDefined();
  });
});
