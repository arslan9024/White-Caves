import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { SystemAuditLog } from './SystemAuditLog';

describe('SystemAuditLog Component', () => {
  it('renders the audit log title', () => {
    render(<SystemAuditLog />);
    expect(screen.getByText(/System Audit Log/i)).toBeInTheDocument();
  });

  it('renders the UPDATE and DELETE event types correctly', () => {
    render(<SystemAuditLog />);
    // Check for specific events based on mocked data
    expect(screen.getAllByText('UPDATE').length).toBeGreaterThan(0);
    expect(screen.getByText('DELETE')).toBeInTheDocument();
    
    // Validate users are shown
    expect(screen.getByText('sarah.j@')).toBeInTheDocument();
    expect(screen.getByText('admin.root@')).toBeInTheDocument();
    expect(screen.getByText('system')).toBeInTheDocument();
  });

  it('displays the correct activity description', () => {
    render(<SystemAuditLog />);
    expect(screen.getByText(/Modified deal #4492/i)).toBeInTheDocument();
    expect(screen.getByText(/Permanently deleted lead #9921/i)).toBeInTheDocument();
    expect(screen.getByText(/Automated DB Backup completed successfully/i)).toBeInTheDocument();
  });
});
