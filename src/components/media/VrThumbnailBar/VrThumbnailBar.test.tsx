import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { VrThumbnailBar } from './VrThumbnailBar';

describe('VrThumbnailBar Component', () => {
  it('renders VR thumbnail bar and triggers room selection', () => {
    const onRoomSelect = vi.fn();
    render(<VrThumbnailBar onRoomSelect={onRoomSelect} />);
    expect(screen.getByTestId('vr-thumbnail-bar')).toBeDefined();
    expect(screen.getAllByText(/Aerial View/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Living Room/i)).toBeDefined();

    // Select Living Room
    const livingRoomThumb = screen.getByText(/Living Room/i);
    fireEvent.click(livingRoomThumb);
    expect(onRoomSelect).toHaveBeenCalledWith('Living Room');
  });
});
