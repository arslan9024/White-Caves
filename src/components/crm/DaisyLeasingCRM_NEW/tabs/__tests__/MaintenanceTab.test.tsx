import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import MaintenanceTab from '../MaintenanceTab';

describe('MaintenanceTab Component', () => {
  it('renders MaintenanceTab component without crashing', () => {
    const { container } = render(<MaintenanceTab requests={[]} />);
    expect(container).toBeDefined();
  });
});
