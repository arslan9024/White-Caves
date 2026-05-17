import React, { useEffect, useMemo, useState } from 'react';
import { authFetch } from '../../../utils/authFetch';
import type { AnalyticsData, AnalyticsTabProps } from './types';
import './TabStyles.css';

const AnalyticsTab: React.FC<AnalyticsTabProps> = ({ data, loading }) => {
  const [timeRange, setTimeRange] = useState('month');
  const [liveData, setLiveData] = useState<AnalyticsData | null>(null);
  const [liveLoading, setLiveLoading] = useState<boolean>(!data);

  useEffect(() => {
    if (data) {
      return;
    }

    interface MarketOverviewResponse {
      success?: boolean;
      data?: {
        avgRentalYield?: number;
        avgDaysOnMarket?: number;
        totalTransactionValue30d?: number;
        topAreas?: Array<{ area: string; count: number; avgPrice: number }>;
      };
    }

    interface ExecutiveResponse {
      success?: boolean;
      data?: {
        leads?: { byStatus?: Record<string, number> };
        properties?: { byType?: Record<string, number> };
      };
    }

    interface CommissionsResponse {
      success?: boolean;
      data?: Array<{ agentName?: string; commissionAmount?: number }>;
    }

    Promise.allSettled([
      authFetch('/api/analytics/overview').then(
        (r: Response) => r.json() as Promise<MarketOverviewResponse>
      ),
      authFetch('/api/dashboard/executive').then(
        (r: Response) => r.json() as Promise<ExecutiveResponse>
      ),
      authFetch('/api/commissions?pageSize=100').then(
        (r: Response) => r.json() as Promise<CommissionsResponse>
      ),
    ])
      .then(([overviewResult, executiveResult, commissionsResult]) => {
        const overview =
          overviewResult.status === 'fulfilled' ? overviewResult.value.data : undefined;
        const executive =
          executiveResult.status === 'fulfilled' ? executiveResult.value.data : undefined;
        const commissions =
          commissionsResult.status === 'fulfilled' ? (commissionsResult.value.data ?? []) : [];

        const totalLeads = Object.values(executive?.leads?.byStatus ?? {}).reduce(
          (sum, count) => sum + count,
          0
        );
        const wonLeads =
          (executive?.leads?.byStatus?.won ?? 0) + (executive?.leads?.byStatus?.closed ?? 0);
        const conversionRate = totalLeads > 0 ? ((wonLeads / totalLeads) * 100).toFixed(1) : '0.0';
        const totalCommissionValue = commissions.reduce(
          (sum, c) => sum + (c.commissionAmount ?? 0),
          0
        );
        const averageDealSize =
          commissions.length > 0 ? totalCommissionValue / commissions.length : 0;

        const metrics: NonNullable<AnalyticsData['metrics']> = [
          {
            label: 'Conversion Rate',
            value: `${conversionRate}%`,
            change: `${wonLeads} won / ${totalLeads} leads`,
            trend: 'up',
          },
          {
            label: 'Average Deal Size',
            value: `AED ${(averageDealSize / 1000000).toFixed(1)}M`,
            change: `${commissions.length} deals`,
            trend: 'up',
          },
          {
            label: 'Avg Days on Market',
            value: `${overview?.avgDaysOnMarket ?? 0} days`,
            change: 'Last 30 days',
            trend: 'up',
          },
          {
            label: 'Average Rental Yield',
            value: `${(overview?.avgRentalYield ?? 0).toFixed(1)}%`,
            change: 'Market overview',
            trend: 'up',
          },
          {
            label: '30d Market Volume',
            value: `AED ${((overview?.totalTransactionValue30d ?? 0) / 1000000000).toFixed(1)}B`,
            change: 'Recent transactions',
            trend: 'up',
          },
        ];

        const areas = overview?.topAreas ?? [];
        const totalAreaRevenue = areas.reduce((sum, area) => sum + area.avgPrice * area.count, 0);
        const revenueByEmirate: NonNullable<AnalyticsData['revenueByEmirate']> = areas
          .slice(0, 5)
          .map(area => {
            const revenue = area.avgPrice * area.count;
            const percentage =
              totalAreaRevenue > 0 ? Math.round((revenue / totalAreaRevenue) * 100) : 0;
            return {
              emirate: area.area,
              revenue,
              percentage,
            };
          });

        const byType = executive?.properties?.byType ?? {};
        const totalPropertyCount = Object.values(byType).reduce((sum, count) => sum + count, 0);
        const propertyPerformance: NonNullable<AnalyticsData['propertyPerformance']> =
          Object.entries(byType)
            .map(([type, count]) => {
              const inquiries =
                totalPropertyCount > 0
                  ? Math.max(1, Math.round((totalLeads * count) / totalPropertyCount))
                  : count;
              const deals = Math.min(
                inquiries,
                Math.round((parseFloat(conversionRate) / 100) * inquiries)
              );
              return {
                type: type.charAt(0).toUpperCase() + type.slice(1),
                views: count,
                inquiries,
                deals,
              };
            })
            .sort((a, b) => b.views - a.views)
            .slice(0, 5);

        const agentMap = new Map<string, { deals: number; revenue: number }>();
        commissions.forEach(c => {
          const name = (c.agentName ?? 'Unknown').trim() || 'Unknown';
          const current = agentMap.get(name) ?? { deals: 0, revenue: 0 };
          current.deals += 1;
          current.revenue += c.commissionAmount ?? 0;
          agentMap.set(name, current);
        });

        const topAgents: NonNullable<AnalyticsData['topAgents']> = Array.from(agentMap.entries())
          .map(([name, stats]) => ({ name, deals: stats.deals, revenue: stats.revenue }))
          .sort((a, b) => b.revenue - a.revenue)
          .slice(0, 5);

        setLiveData({
          metrics,
          revenueByEmirate,
          propertyPerformance,
          topAgents,
        });
      })
      .catch(() => {
        // Graceful fallback to default visuals below if live endpoints fail.
      })
      .finally(() => {
        setLiveLoading(false);
      });
  }, [data]);

  const effectiveData = useMemo(() => data ?? liveData, [data, liveData]);
  const isTabLoading = loading ?? liveLoading;

  // Show loading state
  if (isTabLoading) {
    return (
      <div className="analytics-tab">
        <div className="tab-loading-state" role="status" aria-label="Loading analytics">
          <div className="loading-spinner" />
          <p>Loading analytics...</p>
        </div>
      </div>
    );
  }

  const metrics = effectiveData?.metrics ?? [
    { label: 'Conversion Rate', value: '4.8%', change: '+0.5%', trend: 'up' },
    { label: 'Average Deal Size', value: 'AED 2.1M', change: '+12%', trend: 'up' },
    { label: 'Lead Response Time', value: '15 min', change: '-5 min', trend: 'up' },
    { label: 'Customer Satisfaction', value: '4.7/5', change: '+0.2', trend: 'up' },
    { label: 'Q1 2026 Market Volume', value: 'AED 252B', change: '+31%', trend: 'up' },
  ];

  const revenueByEmirate = effectiveData?.revenueByEmirate ?? [
    { emirate: 'Dubai', revenue: 18500000, percentage: 72 },
    { emirate: 'Abu Dhabi', revenue: 4200000, percentage: 16 },
    { emirate: 'Sharjah', revenue: 1800000, percentage: 7 },
    { emirate: 'Ajman', revenue: 800000, percentage: 3 },
    { emirate: 'RAK', revenue: 500000, percentage: 2 },
  ];

  const propertyPerformance = effectiveData?.propertyPerformance ?? [
    { type: 'Apartments', views: 12500, inquiries: 890, deals: 45 },
    { type: 'Villas', views: 8200, inquiries: 620, deals: 28 },
    { type: 'Townhouses', views: 4500, inquiries: 320, deals: 18 },
    { type: 'Commercial', views: 2800, inquiries: 180, deals: 8 },
    { type: 'Land', views: 1200, inquiries: 85, deals: 4 },
  ];

  const topAgents = effectiveData?.topAgents ?? [
    { name: 'Ahmed Ali', deals: 12, revenue: 3200000 },
    { name: 'Sara Khan', deals: 22, revenue: 1800000 },
    { name: 'Mohammed Hassan', deals: 8, revenue: 2100000 },
    { name: 'Fatima Ahmed', deals: 28, revenue: 1500000 },
  ];

  return (
    <div className="analytics-tab">
      <div className="tab-header">
        <h3>Business Analytics</h3>
        <div className="time-range-selector">
          {['week', 'month', 'quarter', 'year'].map(range => (
            <button
              key={range}
              className={`range-btn ${timeRange === range ? 'active' : ''}`}
              onClick={() => setTimeRange(range)}
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="metrics-grid">
        {metrics.map(metric => (
          <div key={metric.label} className="metric-card">
            <div className="metric-header">
              <span className="metric-label">{metric.label}</span>
              <span className={`metric-change ${metric.trend}`}>
                {metric.trend === 'up' ? '↑' : '↓'} {metric.change}
              </span>
            </div>
            <div className="metric-value">{metric.value}</div>
          </div>
        ))}
      </div>

      <div className="analytics-row">
        <div className="analytics-card">
          <h4>Revenue by Emirate</h4>
          <div className="emirate-chart">
            {revenueByEmirate.map(item => (
              <div key={item.emirate} className="emirate-bar-container">
                <div className="emirate-info">
                  <span className="emirate-name">{item.emirate}</span>
                  <span className="emirate-value">AED {(item.revenue / 1000000).toFixed(1)}M</span>
                </div>
                <div className="emirate-bar-bg">
                  <div className="emirate-bar" style={{ width: `${item.percentage}%` }} />
                </div>
                <span className="emirate-percent">{item.percentage}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="analytics-card">
          <h4>Top Performing Agents</h4>
          <div className="top-agents-list">
            {topAgents.map((agent, index) => (
              <div key={agent.name || `agent-${index}`} className="agent-row">
                <div className="agent-rank">#{index + 1}</div>
                <div className="agent-info">
                  <span className="agent-name">{agent.name}</span>
                  <span className="agent-deals">{agent.deals} deals</span>
                </div>
                <div className="agent-revenue">AED {(agent.revenue / 1000000).toFixed(1)}M</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="analytics-card full-width">
        <h4>Property Type Performance</h4>
        <div className="performance-table">
          <table aria-label="Property type performance metrics">
            <thead>
              <tr>
                <th>Property Type</th>
                <th>Views</th>
                <th>Inquiries</th>
                <th>Deals Closed</th>
                <th>Conversion Rate</th>
              </tr>
            </thead>
            <tbody>
              {propertyPerformance.map(item => (
                <tr key={item.type}>
                  <td>
                    <strong>{item.type}</strong>
                  </td>
                  <td>{item.views.toLocaleString()}</td>
                  <td>{item.inquiries}</td>
                  <td>{item.deals}</td>
                  <td>
                    <div className="conversion-cell">
                      <div
                        className="conversion-bar"
                        style={{ width: `${(item.deals / item.inquiries) * 100 * 10}%` }}
                      />
                      <span>{((item.deals / item.inquiries) * 100).toFixed(1)}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="analytics-row">
        <div className="analytics-card">
          <h4>Lead Sources</h4>
          <div className="lead-sources">
            {[
              { source: 'WhatsApp', leads: 45, color: '#25D366' },
              { source: 'Website', leads: 32, color: '#3B82F6' },
              { source: 'Chatbot', leads: 28, color: '#8B5CF6' },
              { source: 'Referral', leads: 18, color: '#F59E0B' },
              { source: 'Social Media', leads: 12, color: '#EC4899' },
            ].map(item => (
              <div key={item.source} className="source-item">
                <div className="source-dot" style={{ backgroundColor: item.color }} />
                <span className="source-name">{item.source}</span>
                <span className="source-leads">{item.leads} leads</span>
              </div>
            ))}
          </div>
        </div>

        <div className="analytics-card">
          <h4>Monthly Trend</h4>
          <div className="trend-chart">
            {[65, 78, 72, 85, 82, 95, 88, 102, 98, 115, 108, 125].map((value, i) => (
              <div key={`bar-${i}`} className="trend-bar-container">
                <div className="trend-bar" style={{ height: `${(value / 130) * 100}%` }} />
              </div>
            ))}
          </div>
          <div className="trend-labels">
            {['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'].map((m, i) => (
              <span key={`month-${i}`}>{m}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(AnalyticsTab);
