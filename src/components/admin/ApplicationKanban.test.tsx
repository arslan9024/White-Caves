import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ApplicationKanban } from './ApplicationKanban';

const mockApplications = [
  {
    id: 'app-1',
    firstName: 'Sarah',
    lastName: 'Connor',
    stage: 'Applied',
    job: { title: 'Senior Real Estate Agent' },
    createdAt: '2026-07-28T10:00:00.000Z',
  },
  {
    id: 'app-2',
    firstName: 'John',
    lastName: 'Doe',
    stage: 'HR Screening',
    job: { title: 'Leasing Specialist' },
    createdAt: '2026-07-27T10:00:00.000Z',
  },
];

describe('ApplicationKanban', () => {
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.stubGlobal('localStorage', {
      getItem: vi.fn().mockReturnValue('mock-token'),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
    });
    fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ data: mockApplications }))
    );
    vi.stubGlobal('fetch', fetchMock);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('renders loading state initially', async () => {
    let container: any;
    await act(async () => {
      container = render(<ApplicationKanban />);
    });
    expect(screen.getByText('Application Tracking')).toBeInTheDocument();
  });

  it('renders applicant cards and Kanban columns after fetch', async () => {
    await act(async () => {
      render(<ApplicationKanban />);
    });

    expect(screen.getByText('Application Tracking')).toBeInTheDocument();
    expect(screen.getByText('Sarah Connor')).toBeInTheDocument();
    expect(screen.getByText('Senior Real Estate Agent')).toBeInTheDocument();

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Leasing Specialist')).toBeInTheDocument();

    expect(screen.getByText('Applied')).toBeInTheDocument();
    expect(screen.getByText('HR Screening')).toBeInTheDocument();
  });
});
