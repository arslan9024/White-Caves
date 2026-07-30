import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { AuditLogUI } from '../AuditLogUI';

describe('AuditLogUI Component', () => {
  it('renders AuditLogUI component without crashing', () => {
    const mockEntries = [
      {
        id: '1',
        type: 'auth',
        action: 'login',
        description: 'User logged in',
        userId: 'u1',
        createdAt: new Date().toISOString(),
      },
    ];

    const { container } = render(<AuditLogUI entries={mockEntries} loading={false} />);
    expect(container).toBeDefined();
  });
});
