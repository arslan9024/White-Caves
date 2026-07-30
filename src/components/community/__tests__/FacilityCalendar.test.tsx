import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { FacilityCalendar } from '../FacilityCalendar';

describe('FacilityCalendar Component', () => {
  it('renders facility calendar component', () => {
    render(<FacilityCalendar />);
    expect(screen.getByText('Resident View')).toBeDefined();
  });
});
