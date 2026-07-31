import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import DataTable from '../DataTable';

describe('DataTable Component', () => {
  it('renders DataTable component without crashing', () => {
    const { container } = render(<DataTable data={[]} columns={[]} />);
    expect(container).toBeDefined();
  });
});
