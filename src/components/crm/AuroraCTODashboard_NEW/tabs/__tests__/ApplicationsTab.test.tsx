import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import ApplicationsTab from '../ApplicationsTab';

describe('ApplicationsTab Component', () => {
  it('renders ApplicationsTab component without crashing', () => {
    const { container } = render(<ApplicationsTab systemComponents={[]} />);
    expect(container).toBeDefined();
    expect(screen.getByText('Application Deployments')).toBeDefined();
  });
});
