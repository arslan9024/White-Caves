import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import AppointmentScheduler from '../AppointmentScheduler';

describe('AppointmentScheduler Component', () => {
  it('renders schedule viewing header by default', () => {
    render(<AppointmentScheduler propertyId="prop-123" agentId="agent-456" />);
    expect(screen.getByText('Schedule Viewing')).toBeDefined();
  });
});
