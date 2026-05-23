import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import type { DashboardStats, ConversationMetrics } from '../../../types/phase6.types';

interface DashboardProps {
  stats: DashboardStats;
  metrics: ConversationMetrics[];
  isLoading?: boolean;
  onRefresh?: () => Promise<void>;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 8px;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const StatCard = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const StatIcon = styled.div<{ color: string }>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: ${(props) => props.color}20;
  color: ${(props) => props.color};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
`;

const StatValue = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: #333;
`;

const StatLabel = styled.div`
  font-size: 13px;
  color: #999;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const StatTrend = styled.div<{ isPositive: boolean }>`
  font-size: 12px;
  color: ${(props) => (props.isPositive ? '#4caf50' : '#f44336')};
  margin-top: 4px;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h2`
  margin: 0;
  font-size: 20px;
  font-weight: 700;
  color: #333;
`;

const RefreshButton = styled.button`
  padding: 8px 16px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 6px;

  &:hover {
    background-color: #45a049;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const MetricsSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const MetricCard = styled.div`
  background: white;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const MetricTitle = styled.h4`
  margin: 0 0 12px;
  font-size: 14px;
  font-weight: 600;
  color: #333;
`;

const MetricRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  font-size: 13px;
  border-bottom: 1px solid #f0f0f0;

  &:last-child {
    border-bottom: none;
  }
`;

const MetricLabel = styled.span`
  color: #666;
`;

const MetricValue = styled.span`
  color: #333;
  font-weight: 600;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 4px;
  background-color: #e0e0e0;
  border-radius: 2px;
  overflow: hidden;
  margin-top: 4px;
`;

const ProgressFill = styled.div<{ percentage: number; color: string }>`
  height: 100%;
  width: ${(props) => props.percentage}%;
  background-color: ${(props) => props.color};
  transition: width 0.3s ease;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  color: #999;
  gap: 12px;

  svg {
    width: 48px;
    height: 48px;
    opacity: 0.5;
  }
`;

const Chart = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const ChartTitle = styled.h4`
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: #333;
`;

const ChartBar = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const ChartLabel = styled.div`
  width: 100px;
  font-size: 12px;
  color: #666;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ChartBarContainer = styled.div`
  flex: 1;
  height: 24px;
  background-color: #f0f0f0;
  border-radius: 4px;
  overflow: hidden;
`;

const ChartBarFill = styled.div<{ percentage: number }>`
  height: 100%;
  width: ${(props) => props.percentage}%;
  background: linear-gradient(90deg, #4caf50, #8bc34a);
  transition: width 0.3s ease;
`;

const ChartValue = styled.div`
  width: 50px;
  text-align: right;
  font-size: 12px;
  color: #333;
  font-weight: 600;
`;

const LoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  svg {
    width: 32px;
    height: 32px;
    animation: spin 1s linear infinite;
    color: #4caf50;
  }
`;

export const Dashboard: React.FC<DashboardProps> = ({
  stats,
  metrics,
  isLoading = false,
  onRefresh,
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    if (onRefresh && !isRefreshing) {
      setIsRefreshing(true);
      try {
        await onRefresh();
      } finally {
        setIsRefreshing(false);
      }
    }
  };

  const maxMessages = Math.max(...metrics.map((m) => m.messageCount), 1);
  const maxParticipants = Math.max(...metrics.map((m) => m.participantCount), 1);

  return (
    <Container style={{ position: 'relative' }}>
      {isLoading && (
        <LoadingOverlay>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
          </svg>
        </LoadingOverlay>
      )}

      <HeaderRow>
        <Title>Dashboard</Title>
        <RefreshButton onClick={handleRefresh} disabled={isRefreshing}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M23 4v6h-6M1 20v-6h6" />
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36M20.49 15a9 9 0 0 1-14.85 3.36" />
          </svg>
          {isRefreshing ? 'Refreshing...' : 'Refresh'}
        </RefreshButton>
      </HeaderRow>

      <StatsGrid>
        <StatCard>
          <StatIcon color="#4caf50">💬</StatIcon>
          <StatValue>{stats.totalMessages}</StatValue>
          <StatLabel>Total Messages</StatLabel>
          <StatTrend isPositive={true}>
            <span>↑</span> Updated now
          </StatTrend>
        </StatCard>

        <StatCard>
          <StatIcon color="#2196f3">👥</StatIcon>
          <StatValue>{stats.activeConversations}</StatValue>
          <StatLabel>Active Conversations</StatLabel>
          <StatTrend isPositive={true}>
            <span>↑</span> This week
          </StatTrend>
        </StatCard>

        <StatCard>
          <StatIcon color="#ff9800">📇</StatIcon>
          <StatValue>{stats.totalContacts}</StatValue>
          <StatLabel>Total Contacts</StatLabel>
          <StatTrend isPositive={true}>
            <span>↑</span> Growing
          </StatTrend>
        </StatCard>

        <StatCard>
          <StatIcon color="#f44336">🔔</StatIcon>
          <StatValue>{stats.unreadMessages}</StatValue>
          <StatLabel>Unread Messages</StatLabel>
          <StatTrend isPositive={false}>
            <span>⚠️</span> Attention needed
          </StatTrend>
        </StatCard>

        <StatCard>
          <StatIcon color="#9c27b0">💾</StatIcon>
          <StatValue>{(stats.mediaSize / 1024 / 1024).toFixed(1)} MB</StatValue>
          <StatLabel>Media Storage</StatLabel>
          <StatTrend isPositive={true}>
            <span>↑</span> {(stats.mediaSize / 1024 / 1024).toFixed(1)} MB used
          </StatTrend>
        </StatCard>

        <StatCard>
          <StatIcon color="#00bcd4">⏱️</StatIcon>
          <StatValue>{stats.responseTime}s</StatValue>
          <StatLabel>Avg Response Time</StatLabel>
          <StatTrend isPositive={stats.responseTime < 2}>
            {stats.responseTime < 2 ? '✓ Fast' : '⚠️ Slow'}
          </StatTrend>
        </StatCard>
      </StatsGrid>

      {metrics.length > 0 ? (
        <>
          <Chart>
            <ChartTitle>Messages by Conversation</ChartTitle>
            {metrics.slice(0, 5).map((metric) => (
              <ChartBar key={metric.conversationId}>
                <ChartLabel title={`Conversation ${metric.conversationId.slice(0, 8)}`}>
                  Conversation {metric.conversationId.slice(0, 8)}
                </ChartLabel>
                <ChartBarContainer>
                  <ChartBarFill percentage={(metric.messageCount / maxMessages) * 100} />
                </ChartBarContainer>
                <ChartValue>{metric.messageCount}</ChartValue>
              </ChartBar>
            ))}
          </Chart>

          <Chart>
            <ChartTitle>Participants by Conversation</ChartTitle>
            {metrics.slice(0, 5).map((metric) => (
              <ChartBar key={metric.conversationId}>
                <ChartLabel title={`Conversation ${metric.conversationId.slice(0, 8)}`}>
                  Conversation {metric.conversationId.slice(0, 8)}
                </ChartLabel>
                <ChartBarContainer>
                  <ChartBarFill percentage={(metric.participantCount / maxParticipants) * 100} />
                </ChartBarContainer>
                <ChartValue>{metric.participantCount}</ChartValue>
              </ChartBar>
            ))}
          </Chart>

          <MetricsSection>
            <MetricCard>
              <MetricTitle>Recent Conversation Metrics</MetricTitle>
              {metrics.slice(0, 3).map((metric) => (
                <div key={metric.conversationId}>
                  <MetricRow>
                    <MetricLabel>Conversation {metric.conversationId.slice(0, 8)}</MetricLabel>
                    <MetricValue>{metric.messageCount} messages</MetricValue>
                  </MetricRow>
                  <MetricRow>
                    <MetricLabel style={{ paddingLeft: '12px' }}>
                      Avg Response: {metric.averageResponseTime.toFixed(1)}s
                    </MetricLabel>
                    <MetricValue>{metric.participantCount} participants</MetricValue>
                  </MetricRow>
                </div>
              ))}
            </MetricCard>
          </MetricsSection>
        </>
      ) : (
        <EmptyState>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="7" height="7" />
            <rect x="14" y="3" width="7" height="7" />
            <rect x="14" y="14" width="7" height="7" />
            <rect x="3" y="14" width="7" height="7" />
          </svg>
          <p>No metrics available yet</p>
        </EmptyState>
      )}
    </Container>
  );
};

export default Dashboard;
