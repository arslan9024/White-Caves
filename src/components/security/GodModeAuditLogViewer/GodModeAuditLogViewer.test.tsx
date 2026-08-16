import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { GodModeAuditLogViewer } from './GodModeAuditLogViewer';

describe('GodModeAuditLogViewer Component', () => {
  it('renders Level 5 God-Mode audit log viewer and privileged actions table', () => {
    render(<GodModeAuditLogViewer />);
    expect(screen.getByTestId('god-mode-audit-log-viewer')).toBeDefined();
    expect(screen.getByText(/Level 5 God-Mode & Privileged Action Audit Stream/i)).toBeDefined();
    expect(screen.getByText(/SOVEREIGN SECURITY/i)).toBeDefined();
    expect(screen.getByText(/ACT-9901/i)).toBeDefined();
    expect(screen.getByText(/Agent Sarah Connor/i)).toBeDefined();
  });
});
