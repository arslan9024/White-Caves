import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import AIModelSelector from './AIModelSelector';

vi.mock('./AIModelSelector.css', () => ({}));

const okJson = body =>
  Promise.resolve({
    ok: true,
    json: async () => body,
  });

const errorJson = body =>
  Promise.resolve({
    ok: false,
    json: async () => body,
  });

describe('AIModelSelector — alert elimination', () => {
  let fetchSpy;

  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    fetchSpy = vi.spyOn(window, 'fetch').mockImplementation(url => {
      if (url === '/api/plans/ai-status') {
        return okJson({
          deepseekAvailable: true,
          ollamaAvailable: true,
          currentModel: 'deepseek',
        });
      }
      return okJson({});
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders without a status banner initially', async () => {
    render(<AIModelSelector />);
    expect(await screen.findByText('AI Model')).toBeInTheDocument();
    await screen.findByText('DeepSeek');
    expect(screen.queryByTestId('ai-model-status-banner')).not.toBeInTheDocument();
  });

  it('shows success banner when switching model succeeds', async () => {
    const onModelChange = vi.fn();
    fetchSpy.mockImplementation(url => {
      if (url === '/api/plans/ai-status') {
        return okJson({
          deepseekAvailable: true,
          ollamaAvailable: true,
          currentModel: 'deepseek',
        });
      }
      if (url === '/api/plans/set-ai-model') {
        return okJson({ success: true });
      }
      return okJson({});
    });

    render(<AIModelSelector onModelChange={onModelChange} />);
    fireEvent.click(await screen.findByText('Ollama'));

    const banner = await screen.findByRole('status');
    expect(banner).toHaveTextContent('Switched to ollama AI model');
    expect(onModelChange).toHaveBeenCalledWith('ollama');
  });

  it('shows error banner when switch API returns an error payload', async () => {
    fetchSpy.mockImplementation(url => {
      if (url === '/api/plans/ai-status') {
        return okJson({
          deepseekAvailable: true,
          ollamaAvailable: true,
          currentModel: 'deepseek',
        });
      }
      if (url === '/api/plans/set-ai-model') {
        return errorJson({ error: 'Ollama unavailable' });
      }
      return okJson({});
    });

    render(<AIModelSelector />);
    fireEvent.click(await screen.findByText('Ollama'));

    const banner = await screen.findByRole('alert');
    expect(banner).toHaveTextContent('Failed to switch to ollama. Ollama unavailable');
  });

  it('shows generic error banner on network failure', async () => {
    fetchSpy.mockImplementation(url => {
      if (url === '/api/plans/ai-status') {
        return okJson({
          deepseekAvailable: true,
          ollamaAvailable: true,
          currentModel: 'deepseek',
        });
      }
      if (url === '/api/plans/set-ai-model') {
        return Promise.reject(new Error('network down'));
      }
      return okJson({});
    });

    render(<AIModelSelector />);
    fireEvent.click(await screen.findByText('Ollama'));

    expect(await screen.findByRole('alert')).toHaveTextContent('Error switching AI model');
  });

  it('never calls window.alert()', async () => {
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
    fetchSpy.mockImplementation(url => {
      if (url === '/api/plans/ai-status') {
        return okJson({
          deepseekAvailable: true,
          ollamaAvailable: true,
          currentModel: 'deepseek',
        });
      }
      if (url === '/api/plans/set-ai-model') {
        return errorJson({ error: 'Ollama unavailable' });
      }
      return okJson({});
    });

    render(<AIModelSelector />);
    fireEvent.click(await screen.findByText('Ollama'));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
    expect(alertSpy).not.toHaveBeenCalled();
  });
});
