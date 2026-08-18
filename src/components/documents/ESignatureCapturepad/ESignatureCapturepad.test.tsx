import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ESignatureCapturepad } from './ESignatureCapturepad';
describe('ESignatureCapturepad', () => {
  it('renders signature pad', () => {
    render(<ESignatureCapturepad />);
    expect(screen.getByTestId('e-signature-capturepad')).toBeTruthy();
    expect(screen.getByText('Digital Signature')).toBeTruthy();
  });
});
