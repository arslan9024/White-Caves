import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { NativeEngineTab } from './NativeEngineTab';

describe('NativeEngineTab Component', () => {
  it('renders Nina independent engine control panel and features', () => {
    render(<NativeEngineTab />);
    expect(screen.getByText(/Nina Independent Engine & whatsapp-web\.js Control Panel/i)).toBeDefined();
    expect(screen.getByText(/LocalAuth Session Persistence Engine/i)).toBeDefined();
    expect(screen.getByText(/8-Digit Pairing Code & Vector QR Stream/i)).toBeDefined();
    expect(screen.getByText(/PDF Contract & Media Message Engine/i)).toBeDefined();
  });

  it('filters features by category and runs real-time engine simulator', () => {
    render(<NativeEngineTab />);
    const authBtn = screen.getByRole('button', { name: 'Session & Auth' });
    fireEvent.click(authBtn);
    expect(screen.getByText(/LocalAuth Session Persistence Engine/i)).toBeDefined();
    expect(screen.queryByText(/PDF Contract & Media Message Engine/i)).toBeNull();

    // Trigger simulation submit
    const simulateBtn = screen.getByRole('button', { name: /Test Engine/i });
    fireEvent.click(simulateBtn);
    expect(screen.getByText(/DAMAC Hills 2 Villa Matcher/i)).toBeDefined();
  });
});
