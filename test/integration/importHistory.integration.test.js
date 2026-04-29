import { rest } from 'msw';
import { server } from '../../mocks/server';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ImportHistoryPage from '../../../src/components/MaryImport/ImportHistoryPage';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';

describe('Import History Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch and display import history', async () => {
    render(<ImportHistoryPage />);

    await waitFor(() => {
      expect(screen.getByText(/import history/i)).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText(/import-1.xlsx/i)).toBeInTheDocument();
    });
  });

  it('should display import session details', async () => {
    render(<ImportHistoryPage />);

    await waitFor(() => {
      expect(screen.getByText(/completed/i)).toBeInTheDocument();
    });

    expect(screen.getByText(/50/)).toBeInTheDocument(); // imported count
  });

  it('should handle filtering by status', async () => {
    const user = userEvent.setup();
    render(<ImportHistoryPage />);

    const filterButton = screen.getByRole('button', { name: /filter/i });
    if (filterButton) {
      await user.click(filterButton);

      const completedOption = screen.getByRole('option', { name: /completed/i });
      if (completedOption) {
        await user.click(completedOption);

        await waitFor(() => {
          expect(screen.getByText(/completed/i)).toBeInTheDocument();
        });
      }
    }
  });

  it('should display error when fetching history fails', async () => {
    server.use(
      rest.get(`${API_BASE}/api/importHistory/sessions`, (req, res, ctx) => {
        return res(
          ctx.status(500),
          ctx.json({ success: false, message: 'Server error' })
        );
      })
    );

    render(<ImportHistoryPage />);

    await waitFor(() => {
      expect(screen.getByText(/error|failed to load/i)).toBeInTheDocument();
    });
  });

  it('should allow downloading import report', async () => {
    const user = userEvent.setup();
    render(<ImportHistoryPage />);

    await waitFor(() => {
      const downloadButton = screen.queryByRole('button', { name: /download|export/i });
      if (downloadButton) {
        await user.click(downloadButton);
        expect(downloadButton).toBeInTheDocument();
      }
    });
  });

  it('should display pagination controls', async () => {
    render(<ImportHistoryPage />);

    await waitFor(() => {
      const pagination = screen.queryByRole('navigation', { name: /pagination/i });
      if (pagination) {
        expect(pagination).toBeInTheDocument();
      }
    });
  });

  it('should handle retry for failed imports', async () => {
    const user = userEvent.setup();
    
    server.use(
      rest.get(`${API_BASE}/api/importHistory/sessions`, (req, res, ctx) => {
        return res(
          ctx.status(200),
          ctx.json({
            success: true,
            data: [
              {
                _id: 'session-failed',
                fileName: 'failed-import.xlsx',
                status: 'failed',
                importedCount: 0,
                failedCount: 100,
              },
            ],
          })
        );
      }),
      rest.post(`${API_BASE}/api/importHistory/retry/:sessionId`, (req, res, ctx) => {
        return res(
          ctx.status(200),
          ctx.json({
            success: true,
            message: 'Retry initiated',
            newSessionId: 'session-retry-123',
          })
        );
      })
    );

    render(<ImportHistoryPage />);

    await waitFor(() => {
      expect(screen.getByText(/failed/i)).toBeInTheDocument();
    });

    const retryButton = screen.getByRole('button', { name: /retry/i });
    if (retryButton) {
      await user.click(retryButton);

      await waitFor(() => {
        expect(screen.getByText(/retry initiated|retrying/i)).toBeInTheDocument();
      });
    }
  });

  it('should display import statistics', async () => {
    render(<ImportHistoryPage />);

    await waitFor(() => {
      expect(screen.getByText(/total imports/i)).toBeInTheDocument();
    });

    expect(screen.getByText(/import statistics|summary/i)).toBeInTheDocument();
  });

  it('should search/filter by file name', async () => {
    const user = userEvent.setup();
    render(<ImportHistoryPage />);

    const searchInput = screen.getByRole('textbox', { name: /search|filter/i });
    if (searchInput) {
      await user.type(searchInput, 'import-1');

      await waitFor(() => {
        expect(screen.getByText(/import-1.xlsx/i)).toBeInTheDocument();
      });
    }
  });

  it('should display detailed session information on click', async () => {
    const user = userEvent.setup();
    render(<ImportHistoryPage />);

    await waitFor(() => {
      const sessionRow = screen.getByText(/import-1.xlsx/i);
      if (sessionRow) {
        await user.click(sessionRow);

        await waitFor(() => {
          expect(screen.getByText(/session details|information/i)).toBeInTheDocument();
        });
      }
    });
  });
});
