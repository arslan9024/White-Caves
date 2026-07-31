import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import PipelineTab from '../PipelineTab';

describe('PipelineTab Component', () => {
  it('renders PipelineTab component without crashing', () => {
    const { container } = render(<PipelineTab leases={[]} />);
    expect(container).toBeDefined();
  });
});
