// FILE: src/components/crm/AiAssistantManager/AiAssistantManager.test.tsx
/**
 * White Caves Real Estate LLC - AI Assistants Management System (AIAMS) Unit Tests
 * Standard: AEGIS Canonical 12-Way Architecture Standard (Tests)
 * Single Purpose File Law: < 350 lines
 */

import React from 'react';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { AiAssistantManagerView } from './AiAssistantManagerView';
import { AIAMS_STORAGE_KEY } from './AiAssistantManager.data';

describe('AiAssistantManagerView (AIAMS Full CRUD Suite)', () => {
  beforeEach(() => {
    window.localStorage.removeItem(AIAMS_STORAGE_KEY);
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: true }),
    });
  });

  afterEach(() => {
    cleanup();
  });

  it('renders AIAMS header, metrics deck, and 1-12-108 seeded AI agents', () => {
    render(<AiAssistantManagerView />);
    expect(screen.getByTestId('aiams-manager-view')).toBeInTheDocument();
    expect(screen.getByTestId('aiams-metrics-row')).toBeInTheDocument();
    expect(screen.getByTestId('aiams-card-zoe')).toBeInTheDocument();
    expect(screen.getByTestId('aiams-card-linda')).toBeInTheDocument();
    expect(screen.getByTestId('aiams-card-mgr_clara')).toBeInTheDocument();
  });

  it('creates a new AI agent via the registration drawer', () => {
    render(<AiAssistantManagerView />);

    fireEvent.click(screen.getByTestId('aiams-add-agent-btn'));
    expect(screen.getByTestId('aiams-edit-drawer')).toBeInTheDocument();

    fireEvent.change(screen.getByTestId('aiams-input-name'), {
      target: { value: 'AI Sovereign Escrow Bot' },
    });
    fireEvent.change(screen.getByTestId('aiams-input-id'), {
      target: { value: 'escrow_bot_99' },
    });
    fireEvent.change(screen.getByTestId('aiams-input-role'), {
      target: { value: 'Autonomous DLD Escrow Auditor' },
    });

    fireEvent.click(screen.getByTestId('aiams-submit-btn'));

    expect(screen.getByTestId('aiams-card-escrow_bot_99')).toBeInTheDocument();
    expect(screen.getByText('AI Sovereign Escrow Bot')).toBeInTheDocument();
  });

  it('updates an existing AI agent via the edit drawer', () => {
    render(<AiAssistantManagerView />);

    fireEvent.click(screen.getByTestId('aiams-edit-zoe'));
    expect(screen.getByTestId('aiams-edit-drawer')).toBeInTheDocument();

    fireEvent.change(screen.getByTestId('aiams-input-role'), {
      target: { value: 'Supreme Sovereign COO Partner' },
    });
    fireEvent.click(screen.getByTestId('aiams-submit-btn'));

    expect(screen.getByText('Supreme Sovereign COO Partner')).toBeInTheDocument();
  });

  it('deletes an AI agent and restores defaults on reset', () => {
    render(<AiAssistantManagerView />);

    expect(screen.getByTestId('aiams-card-linda')).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('aiams-delete-linda'));
    expect(screen.queryByTestId('aiams-card-linda')).toBeNull();

    fireEvent.click(screen.getByTestId('aiams-reset-defaults-btn'));
    expect(screen.getByTestId('aiams-card-linda')).toBeInTheDocument();
  });
});
