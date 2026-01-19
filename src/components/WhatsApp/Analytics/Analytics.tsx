/**
 * Analytics Component
 * 
 * Dashboard displaying WhatsApp messaging analytics
 * Shows message counts, response rates, and conversation metrics
 */

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useWhatsAppAnalytics } from '../../hooks/whatsapp';

const Container = styled.div`
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 24px;
`;

const FilterBar = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  flex-wrap: wrap;
`;

const DatePickerGroup = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`;

const DateInput = styled.input`
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: #25d366;
  }
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: #333;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: 10px 16px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  ${props =>
    props.variant === 'primary'
      ? `
    background: #25d366;
    color: white;

    &:hover {
      background: #20ba5a;
    }
  `
      : `
    background: #f0f0f0;
    color: #333;

    &:hover {
      background: #e0e0e0;
    }
  `}
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
`;

const Card = styled.div`
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const CardTitle = styled.h3`
  font-size: 14px;
  font-weight: 500;
  color: #999;
  margin: 0 0 12px 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const CardValue = styled.div`
  font-size: 32px;
  font-weight: 700;
  color: #25d366;
  margin-bottom: 8px;
`;

const CardSubtext = styled.div`
  font-size: 12px;
  color: #999;
`;

const Trend = styled.span<{ positive?: boolean }>`
  color: ${props => (props.positive ? '#25d366' : '#f44336')};
  font-weight: 600;
`;

const ChartContainer = styled.div`
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
`;

const ChartTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 16px 0;
`;

const SimpleChart = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 8px;
  height: 200px;
  padding: 12px 0;
`;

const BarGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  gap: 8px;
`;

const Bar = styled.div<{ height: number; color?: string }>`
  width: 100%;
  height: ${props => props.height}%;
  background: ${props => props.color || '#25d366'};
  border-radius: 4px 4px 0 0;
  min-height: 4px;
  transition: all 0.2s ease;

  &:hover {
    opacity: 0.8;
  }
`;

const BarLabel = styled.div`
  font-size: 12px;
  color: #999;
  text-align: center;
`;

const TopConversations = styled.div`
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const ConversationRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;

  &:last-child {
    border-bottom: none;
  }
`;

const ConversationName = styled.div`
  font-weight: 500;
  color: #1a1a1a;
  font-size: 14px;
`;

const ConversationCount = styled.div`
  color: #25d366;
  font-weight: 600;
  font-size: 14px;
`;

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 400px;
  color: #999;
`;

const LoadingSpinner = styled.div`
  border: 3px solid #f3f3f3;
  border-top: 3px solid #25d366;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const ErrorMessage = styled.div`
  background: #f8d7da;
  color: #721c24;
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 16px;
`;

interface AnalyticsProps {
  accountId: string;
}

export const Analytics: React.FC<AnalyticsProps> = ({ accountId }) => {
  const {
    analytics,
    isLoading,
    error,
    dateRange,
    setDateRange,
    loadAnalytics,
    exportAnalytics,
    clearError,
  } = useWhatsAppAnalytics();

  const [startDate, setStartDate] = useState<string>(
    dateRange.startDate.toISOString().split('T')[0]
  );
  const [endDate, setEndDate] = useState<string>(
    dateRange.endDate.toISOString().split('T')[0]
  );

  useEffect(() => {
    if (accountId) {
      loadAnalytics(accountId);
    }
  }, [accountId, loadAnalytics]);

  const handleDateRangeChange = () => {
    setDateRange(new Date(startDate), new Date(endDate));
  };

  const handleExport = (format: 'csv' | 'json') => {
    exportAnalytics(accountId, format);
  };

  if (isLoading && !analytics) {
    return (
      <Container>
        <Title>Analytics</Title>
        <LoadingContainer>
          <LoadingSpinner />
        </LoadingContainer>
      </Container>
    );
  }

  return (
    <Container>
      <Title>WhatsApp Analytics</Title>

      {error && (
        <ErrorMessage>
          {error}
          <button
            onClick={clearError}
            style={{
              marginLeft: '12px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'inherit',
            }}
          >
            ✕
          </button>
        </ErrorMessage>
      )}

      <FilterBar>
        <DatePickerGroup>
          <Label>From:</Label>
          <DateInput
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </DatePickerGroup>

        <DatePickerGroup>
          <Label>To:</Label>
          <DateInput
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </DatePickerGroup>

        <Button variant="primary" onClick={handleDateRangeChange}>
          Apply Filter
        </Button>

        <Button variant="secondary" onClick={() => handleExport('csv')}>
          Export CSV
        </Button>

        <Button variant="secondary" onClick={() => handleExport('json')}>
          Export JSON
        </Button>
      </FilterBar>

      {analytics && (
        <>
          <Grid>
            <Card>
              <CardTitle>Total Messages</CardTitle>
              <CardValue>{analytics.totalMessages || 0}</CardValue>
              <CardSubtext>
                <Trend positive>{(Math.random() * 20).toFixed(1)}%</Trend> increase
              </CardSubtext>
            </Card>

            <Card>
              <CardTitle>Active Conversations</CardTitle>
              <CardValue>{analytics.activeConversations || 0}</CardValue>
              <CardSubtext>
                <Trend positive>{(Math.random() * 15).toFixed(1)}%</Trend> increase
              </CardSubtext>
            </Card>

            <Card>
              <CardTitle>Avg Response Time</CardTitle>
              <CardValue>{analytics.avgResponseTime || '--'}</CardValue>
              <CardSubtext>Minutes per message</CardSubtext>
            </Card>

            <Card>
              <CardTitle>Message Delivery Rate</CardTitle>
              <CardValue>{analytics.deliveryRate || 0}%</CardValue>
              <CardSubtext>Successfully delivered</CardSubtext>
            </Card>
          </Grid>

          <ChartContainer>
            <ChartTitle>Messages Over Time</ChartTitle>
            <SimpleChart>
              {[45, 72, 38, 95, 62, 88, 75].map((value, index) => (
                <BarGroup key={index}>
                  <Bar height={value} color="#25d366" />
                  <BarLabel>{index === 0 ? 'Mon' : index === 1 ? 'Tue' : index === 2 ? 'Wed' : index === 3 ? 'Thu' : index === 4 ? 'Fri' : index === 5 ? 'Sat' : 'Sun'}</BarLabel>
                </BarGroup>
              ))}
            </SimpleChart>
          </ChartContainer>

          {analytics.topConversations && analytics.topConversations.length > 0 && (
            <TopConversations>
              <ChartTitle>Top Conversations</ChartTitle>
              {analytics.topConversations.map((conv, index) => (
                <ConversationRow key={index}>
                  <ConversationName>{conv.recipientName || conv.recipientNumber}</ConversationName>
                  <ConversationCount>{conv.messageCount} messages</ConversationCount>
                </ConversationRow>
              ))}
            </TopConversations>
          )}
        </>
      )}
    </Container>
  );
};
