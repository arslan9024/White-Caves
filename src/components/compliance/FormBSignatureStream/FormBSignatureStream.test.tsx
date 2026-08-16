import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { FormBSignatureStream } from './FormBSignatureStream';

describe('FormBSignatureStream Component', () => {
  it('renders Form B buyer representation agreement signature stream and parties', () => {
    render(<FormBSignatureStream />);
    expect(screen.getByTestId('form-b-signature-stream')).toBeDefined();
    expect(screen.getByText(/Form B — Buyer Agency Agreement/i)).toBeDefined();
    expect(screen.getByText(/RERA Digital Signature/i)).toBeDefined();
    expect(screen.getByText(/John Smith/i)).toBeDefined();
    expect(screen.getByText(/White Caves LLC/i)).toBeDefined();
    expect(screen.getByText(/Signature Pending/i)).toBeDefined();

    const clearBtn = screen.getByRole('button', { name: /Clear/i });
    fireEvent.click(clearBtn);
    expect(screen.getByText(/Signature pad cleared/i)).toBeDefined();
  });
});
