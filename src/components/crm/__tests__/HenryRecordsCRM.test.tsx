import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import HenryRecordsCRM from '../HenryRecordsCRM';

vi.mock('../HenryDocumentStudio', () => ({ default: () => <div>Existing preparation studio</div> }));

describe('HenryRecordsCRM', () => {
  it('composes operations dossiers alongside the existing studio', () => {
    render(<HenryRecordsCRM />);
    expect(screen.getByRole('region', { name: 'Henry operations dossiers' })).toBeInTheDocument();
    expect(screen.getByText('Existing preparation studio')).toBeInTheDocument();
  });
});