import { describe, it, expect } from 'vitest';
import React from 'react';
import { render } from '@testing-library/react';
import DynamicAssistantCRM from './DynamicAssistantCRM';

describe('DynamicAssistantCRM Component', () => {
  it('renders cleanly when no assistant is passed', () => {
    const { container } = render(<DynamicAssistantCRM />);
    expect(container).toBeDefined();
    expect(container.querySelector('.dynamic-crm-empty')).toBeDefined();
  });

  it('renders universal assistant workspace for unmapped assistant', () => {
    const mockAssistant = {
      id: 'custom-bot',
      name: 'Custom Agent',
      title: 'Strategy Bot',
      department: 'Advisory',
      color: '#d4af37',
      capabilities: ['market_analysis', 'lead_triage']
    };

    const { getByText } = render(<DynamicAssistantCRM activeAssistant={mockAssistant} />);
    expect(getByText('Custom Agent')).toBeDefined();
    expect(getByText('Strategy Bot')).toBeDefined();
    expect(getByText('MARKET ANALYSIS')).toBeDefined();
  });
});
