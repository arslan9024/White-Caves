import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { DamacHills2ClusterBadge } from './DamacHills2ClusterBadge';

describe('DamacHills2ClusterBadge (Target T-0006)', () => {
  it('renders cluster count and live absorption metrics', () => {
    render(
      <BrowserRouter>
        <DamacHills2ClusterBadge clusterCount={31} activeListings={85} absorptionRate={94.2} />
      </BrowserRouter>
    );

    expect(screen.getByText('DAMAC Hills 2')).toBeInTheDocument();
    expect(screen.getByText('31')).toBeInTheDocument();
    expect(screen.getByText('Clusters')).toBeInTheDocument();
    expect(screen.getByText('94.2%')).toBeInTheDocument();
    expect(screen.getByText('Absorption')).toBeInTheDocument();
  });
});
