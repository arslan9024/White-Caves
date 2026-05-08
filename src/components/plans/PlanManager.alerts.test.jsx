import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import PlanManager from './PlanManager';

vi.mock('./PlanManager.css', () => ({}));
vi.mock('./AIModelSelector', () => ({
  default: () => <div data-testid="ai-model-selector" />,
}));
vi.mock('lucide-react', () => {
  const Icon = () => <span data-testid="mock-icon" />;
  return {
    Plus: Icon,
    Search: Icon,
    Trash2: Icon,
    Edit2: Icon,
    RefreshCw: Icon,
    Wand2: Icon,
    Merge2: Icon,
    Calendar: Icon,
    Tag: Icon,
    FileText: Icon,
    CheckCircle2: Icon,
    Clock: Icon,
  };
});

describe('PlanManager — alert elimination', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    global.fetch = vi.fn(async url => {
      if (String(url).includes('/api/plans/stats')) {
        return {
          ok: true,
          json: async () => ({
            totalPlans: 0,
            byStatus: { active: 0 },
            averageWords: 0,
          }),
        };
      }

      return {
        ok: true,
        json: async () => ({ plans: [] }),
      };
    });
  });

  it('shows inline modal validation message and never calls window.alert', async () => {
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});

    render(<PlanManager />);

    fireEvent.click(screen.getByRole('button', { name: /New Plan/i }));

    const titleInput = screen.getByPlaceholderText(/Plan title\/type/i);
    fireEvent.change(titleInput, { target: { value: 'Monday Strategy' } });

    const submitButton = screen.getByRole('button', { name: /^Create Plan$/i });
    const form = submitButton.closest('form');
    fireEvent.submit(form);

    const banner = await screen.findByTestId('create-plan-modal-status-banner');
    expect(banner).toHaveTextContent('Filename and content are required');
    expect(alertSpy).not.toHaveBeenCalled();
  });
});
