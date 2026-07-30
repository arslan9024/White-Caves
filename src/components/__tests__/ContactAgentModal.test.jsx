import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import ContactAgentModal from '../ContactAgentModal';

describe('ContactAgentModal Component', () => {
  it('renders null when isOpen is false', () => {
    const { container } = render(<ContactAgentModal isOpen={false} onClose={() => {}} />);
    expect(container.firstChild).toBeNull();
  });
});
