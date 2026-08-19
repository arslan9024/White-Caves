/**
 * MobilePropertyQuickActions.test.tsx — Unit Tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MobilePropertyQuickActions } from './MobilePropertyQuickActions';

const mockHandleOpen = vi.fn();
const mockHandleClose = vi.fn();
const mockHandleAction = vi.fn();

vi.mock('./logic/MobilePropertyQuickActions.logic', () => ({
  useMobilePropertyQuickActionsLogic: () => ({
    actions: [
      {
        id: 'whatsapp',
        label: 'WhatsApp',
        icon: 'MessageCircle',
        color: '#25d366',
        description: 'Open WhatsApp chat',
      },
    ],
    isOpen: false,
    activeAction: null,
    handleOpen: mockHandleOpen,
    handleClose: mockHandleClose,
    handleAction: mockHandleAction,
  }),
}));

describe('MobilePropertyQuickActions', () => {
  beforeEach(() => vi.clearAllMocks());

  it('renders the trigger button', () => {
    render(<MobilePropertyQuickActions />);
    expect(screen.getByTestId('quick-actions-trigger')).toBeDefined();
    expect(screen.getByText('Quick Actions')).toBeDefined();
  });

  it('calls handleOpen when trigger is clicked', () => {
    render(<MobilePropertyQuickActions />);
    fireEvent.click(screen.getByTestId('quick-actions-trigger'));
    expect(mockHandleOpen).toHaveBeenCalled();
  });
});
