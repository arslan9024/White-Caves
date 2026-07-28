import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import {
  AdminOverviewPanel,
  AdminUsersPanel,
  AdminAnalyticsPanel,
  AdminSettingsPanel,
} from './AdminDashboardPanels';

const mockMetrics = {
  totalUsers: 150,
  activeUsers: 120,
  totalProperties: 450,
  activeListings: 310,
  totalTransactions: 89,
  completedTransactions: 75,
  uptime: 99.9,
  systemHealth: 'Excellent',
  responseTime: 45,
  errorRate: 0.01,
};

const mockAlerts = [
  { id: 1, severity: 'warning' as const, message: 'High CPU utilization', status: 'active' as const },
];

const mockActivities = [
  { id: '1', user: 'Admin User', action: 'Created new user listing', time: '5m ago', type: 'create' as const },
];

const mockUsers = [
  { id: '1', name: 'Nadia Yusuf', role: 'agent', status: 'active', lastActive: '2m ago' },
  { id: '2', name: 'Sarah Jenkins', role: 'admin', status: 'active', lastActive: '1m ago' },
];

describe('AdminDashboardPanels', () => {
  describe('AdminOverviewPanel', () => {
    it('renders system metrics cards and activity feed', () => {
      const setCurrentPage = vi.fn();
      render(
        <AdminOverviewPanel
          panelId="panel-overview"
          tabId="tab-overview"
          systemMetrics={mockMetrics}
          alerts={mockAlerts}
          paginatedActivities={mockActivities}
          currentActivityPage={1}
          activitiesTotalPages={2}
          totalActivities={10}
          setCurrentActivityPage={setCurrentPage}
        />
      );

      expect(screen.getByText('Total Users')).toBeInTheDocument();
      expect(screen.getByText('150')).toBeInTheDocument();
      expect(screen.getByText('120 active')).toBeInTheDocument();

      expect(screen.getByText('Total Properties')).toBeInTheDocument();
      expect(screen.getByText('450')).toBeInTheDocument();

      expect(screen.getByText('High CPU utilization')).toBeInTheDocument();
      expect(screen.getByText('Recent Activity')).toBeInTheDocument();
      expect(screen.getByText('Created new user listing')).toBeInTheDocument();
    });
  });

  describe('AdminUsersPanel', () => {
    it('renders users table and pagination', () => {
      const setCurrentUsersPage = vi.fn();
      render(
        <AdminUsersPanel
          panelId="panel-users"
          tabId="tab-users"
          paginatedUsers={mockUsers}
          currentUsersPage={1}
          usersTotalPages={2}
          totalUsers={20}
          setCurrentUsersPage={setCurrentUsersPage}
        />
      );

      expect(screen.getByText('User Management')).toBeInTheDocument();
      expect(screen.getByText('Nadia Yusuf')).toBeInTheDocument();
      expect(screen.getByText('Sarah Jenkins')).toBeInTheDocument();
    });
  });

  describe('AdminAnalyticsPanel', () => {
    it('renders analytics charts and period filter dropdown', () => {
      const setPeriod = vi.fn();
      render(
        <AdminAnalyticsPanel
          panelId="panel-analytics"
          tabId="tab-analytics"
          filterPeriod="30d"
          setFilterPeriod={setPeriod}
        />
      );

      expect(screen.getByText('Analytics & Reports')).toBeInTheDocument();
      expect(screen.getByText('User Growth Trend')).toBeInTheDocument();
      expect(screen.getByText('Transaction Volume')).toBeInTheDocument();

      const select = screen.getByLabelText(/Filter analytics by time period/i);
      fireEvent.change(select, { target: { value: '90d' } });
      expect(setPeriod).toHaveBeenCalledWith('90d');
    });
  });

  describe('AdminSettingsPanel', () => {
    it('renders platform settings form and submits', () => {
      render(
        <AdminSettingsPanel
          panelId="panel-settings"
          tabId="tab-settings"
        />
      );

      expect(screen.getByText('System Settings')).toBeInTheDocument();
      expect(screen.getByLabelText('Platform Name')).toHaveValue('White Caves');
      expect(screen.getByLabelText('Support Email')).toHaveValue('support@whitecaves.ae');

      const saveBtn = screen.getByRole('button', { name: /Save Settings/i });
      fireEvent.click(saveBtn);
      // Ensures no alert or crash on submission
    });
  });
});
