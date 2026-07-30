import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import ContactForm from '../ContactForm';

describe('ContactForm Component', () => {
  it('renders contact form with input fields', () => {
    render(<ContactForm />);
    expect(screen.getByPlaceholderText(/your name/i) || screen.getByRole('button')).toBeDefined();
  });
});
