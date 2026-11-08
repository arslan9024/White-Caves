import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ReportsTab from '../ReportsTab';
import type { ConfidentialVaultState } from '../../../../store/slices/aiAssistant/types';

describe('ReportsTab', () => {
  const mockVault: ConfidentialVaultState = {
    isUnlocked: true,
    autoLockTimer: 300,
    metrics: {
      kycComplianceScore: 98,
      confidentialAudits: 14,
      dldEscrowIntegrity: 100,
      activeVipEncryptions: 42,
    },
  };

  const mockFunnelMetrics = {
    totalIncoming: 1250,
    conversionRate: 18.5,
    rentVsSaleRatio: '35% / 65%',
    avgQualificationTime: '1.8 hrs',
  };

  const mockComplianceMetrics = {
    totalProfiles: 450,
    pendingReview: 12,
    approvedThisMonth: 180,
    riskScore: 2.1,
  };

  it('renders intelligence reports with funnel and compliance metrics', () => {
    render(
      <ReportsTab
        funnelMetrics={mockFunnelMetrics}
        complianceMetrics={mockComplianceMetrics}
        vault={mockVault}
      />
    );

    expect(screen.getByText('Intelligence Reports')).toBeInTheDocument();
    expect(screen.getByText('Lead Funnel Metrics')).toBeInTheDocument();
    expect(screen.getByText('1250')).toBeInTheDocument();
    expect(screen.getByText('18.5%')).toBeInTheDocument();
    expect(screen.getByText('Compliance & Risk Oversight')).toBeInTheDocument();
    expect(screen.getByText('450')).toBeInTheDocument();
  });

  it('renders vault status and metrics when unlocked', () => {
    render(
      <ReportsTab
        funnelMetrics={mockFunnelMetrics}
        complianceMetrics={mockComplianceMetrics}
        vault={mockVault}
      />
    );

    expect(screen.getByText(/Confidential Executive Vault/i)).toBeInTheDocument();
  });
});
