import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { ArRoomMeasurer } from './ArRoomMeasurer';

describe('ArRoomMeasurer Component', () => {
  it('renders AR room measurement tool and start scan button', () => {
    render(<ArRoomMeasurer />);
    expect(screen.getByTestId('ar-room-measurer')).toBeDefined();
    expect(screen.getByText(/AR Room Measurement Tool/i)).toBeDefined();
    expect(screen.getByText(/📐 Start Scan/i)).toBeDefined();
    expect(screen.getByText(/READY/i)).toBeDefined();
  });
});
