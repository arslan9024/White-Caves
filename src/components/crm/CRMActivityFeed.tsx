/**
 * CRM Activity Feed Component
 * Real-time activity tracking for CRM operations
 * Reusable across CRM Hub and other CRM pages
 */

import React, { FC, useMemo } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { selectRecentActivities } from '../../store/crmDataSlice';

// ─── Types ──────────────────────────────────────────────────────────────

interface Activity {
  id: string | number;
  type?: string;
  description?: string;
  timestamp?: string;
  user?: string;
  [key: string]: any;
}

interface CRMActivityFeedProps {
  maxItems?: number;
  showTitle?: boolean;
  compact?: boolean;
}

// ─── Styled Components ──────────────────────────────────────────────────

const FeedContainer = styled.div`
  background: white;
  border: 1px solid #e8e8e8;
  border-radius: 12px;
  overflow: hidden;
`;

const FeedHeader = styled.div`
  padding: 1rem 1.25rem;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const FeedTitle = styled.h3`
  font-size: 0.95rem;
  font-weight: 600;
  color: #1a1a2e;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.4rem;
`;

const FeedCount = styled.span`
  background: #3B82F6;
  color: white;
  font-size: 0.65rem;
  font-weight: 600;
  padding: 0.15rem 0.45rem;
  border-radius: 10px;
`;

const FeedList = styled.div`
  max-height: 420px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: #ddd;
    border-radius: 2px;
  }
`;

const FeedItem = styled.div<{ $compact?: boolean }>`
  padding: ${props => props.$compact ? '0.6rem 1rem' : '0.85rem 1.25rem'};
  border-bottom: 1px solid #f8f8f8;
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  transition: background 0.1s;

  &:hover {
    background: #fafbff;
  }

  &:last-child {
    border-bottom: none;
  }
`;

const ActivityIcon = styled.div<{ $type: string }>`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  flex-shrink: 0;
  background: ${props => {
    switch (props.$type) {
      case 'lead': return '#EFF6FF';
      case 'property': return '#F0FDF4';
      case 'deal': return '#FEF3C7';
      case 'commission': return '#F3E8FF';
      case 'agent': return '#FFF1F2';
      case 'client': return '#E0F2FE';
      default: return '#F3F4F6';
    }
  }};
`;

const ActivityContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const ActivityDescription = styled.div`
  font-size: 0.83rem;
  color: #333;
  line-height: 1.4;
`;

const ActivityMeta = styled.div`
  font-size: 0.72rem;
  color: #999;
  margin-top: 0.2rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const EmptyFeed = styled.div`
  padding: 2rem;
  text-align: center;
  color: #999;
  font-size: 0.85rem;
`;

// ─── Helpers ────────────────────────────────────────────────────────────

const TYPE_ICONS: Record<string, string> = {
  lead: '🎯',
  property: '🏠',
  deal: '💰',
  commission: '💎',
  agent: '👤',
  client: '🤝',
  system: '⚙️',
};

function timeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// ─── Component ──────────────────────────────────────────────────────────

const CRMActivityFeed: FC<CRMActivityFeedProps> = ({
  maxItems = 20,
  showTitle = true,
  compact = false,
}) => {
  const activities = useSelector(selectRecentActivities) as Activity[];

  const displayActivities = useMemo(() => {
    const sorted = [...activities].sort((a, b) => {
      const dateA = a.timestamp ? new Date(a.timestamp).getTime() : 0;
      const dateB = b.timestamp ? new Date(b.timestamp).getTime() : 0;
      return dateB - dateA;
    });
    return sorted.slice(0, maxItems);
  }, [activities, maxItems]);

  return (
    <FeedContainer>
      {showTitle && (
        <FeedHeader>
          <FeedTitle>⚡ Activity Feed</FeedTitle>
          {activities.length > 0 && <FeedCount>{activities.length}</FeedCount>}
        </FeedHeader>
      )}
      <FeedList>
        {displayActivities.length > 0 ? (
          displayActivities.map(activity => (
            <FeedItem key={activity.id} $compact={compact}>
              <ActivityIcon $type={activity.type || 'system'}>
                {TYPE_ICONS[activity.type || 'system'] || '📋'}
              </ActivityIcon>
              <ActivityContent>
                <ActivityDescription>{activity.description || 'Activity recorded'}</ActivityDescription>
                <ActivityMeta>
                  <span>{activity.timestamp ? timeAgo(activity.timestamp) : '—'}</span>
                  {activity.user && <span>by {activity.user}</span>}
                </ActivityMeta>
              </ActivityContent>
            </FeedItem>
          ))
        ) : (
          <EmptyFeed>
            No recent activity. Start managing leads or properties to see updates here.
          </EmptyFeed>
        )}
      </FeedList>
    </FeedContainer>
  );
};

export default CRMActivityFeed;
