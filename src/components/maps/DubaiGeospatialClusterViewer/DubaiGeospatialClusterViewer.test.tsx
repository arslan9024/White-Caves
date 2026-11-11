import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import DubaiGeospatialClusterViewer from './DubaiGeospatialClusterViewer';

describe('DubaiGeospatialClusterViewer Component', () => {
  it('renders header, live volume macro stats, and map canvas properly', () => {
    render(<DubaiGeospatialClusterViewer />);

    expect(screen.getByTestId('dubai-geospatial-cluster-viewer')).toBeInTheDocument();
    expect(screen.getByText(/Interactive Dubai GIS Map & Luxury Heatmap Cluster Viewer/i)).toBeInTheDocument();
    expect(screen.getByTestId('interactive-map-canvas')).toBeInTheDocument();
    expect(screen.getByTestId('cluster-details-sidebar')).toBeInTheDocument();
  });

  it('renders all key luxury cluster pins on the interactive map canvas', () => {
    render(<DubaiGeospatialClusterViewer />);

    expect(screen.getByTestId('cluster-pin-palm-jumeirah')).toBeInTheDocument();
    expect(screen.getByTestId('cluster-pin-downtown-dubai')).toBeInTheDocument();
    expect(screen.getByTestId('cluster-pin-dubai-marina')).toBeInTheDocument();
    expect(screen.getByTestId('cluster-pin-damac-hills-2')).toBeInTheDocument();
    expect(screen.getByTestId('cluster-pin-dubai-hills-estate')).toBeInTheDocument();
  });

  it('switches active metric mode to DLD volume and price/sqft', () => {
    const handleMetricChange = vi.fn();
    render(<DubaiGeospatialClusterViewer onFilterMetricChange={handleMetricChange} />);

    const volumeBtn = screen.getByTestId('metric-btn-volume');
    fireEvent.click(volumeBtn);

    expect(handleMetricChange).toHaveBeenCalledWith('transaction_volume');
    expect(screen.getAllByText(/AED 5420M/i).length).toBeGreaterThan(0);

    const psfBtn = screen.getByTestId('metric-btn-psf');
    fireEvent.click(psfBtn);

    expect(handleMetricChange).toHaveBeenCalledWith('price_psf');
    expect(screen.getAllByText(/AED 4,850\/sqft/i).length).toBeGreaterThan(0);
  });

  it('updates selected cluster details sidebar when a pin is clicked', () => {
    const handleSelectCluster = vi.fn();
    render(<DubaiGeospatialClusterViewer onSelectCluster={handleSelectCluster} />);

    const dh2Pin = screen.getByTestId('cluster-pin-damac-hills-2');
    fireEvent.click(dh2Pin);

    expect(handleSelectCluster).toHaveBeenCalled();
    expect(screen.getByText(/DAMAC Hills 2 \(DH2 Cluster Hub\)/i)).toBeInTheDocument();
    expect(screen.getByText(/DAMAC Properties/i)).toBeInTheDocument();
    expect(screen.getByText(/9,378 units mapped/i)).toBeInTheDocument();
  });
});
