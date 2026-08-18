/**
 * MobileDashboardPage.tsx — View Layer (4-Way Component Architecture)
 * Mobile-first CRM dashboard: greeting header, KPI row, recent activity feed, bottom nav.
 */

import React, { FC } from 'react';
import { Bell, Users, Eye, DollarSign, Wrench, AlertCircle } from 'lucide-react';
import { useMobileDashboardPageLogic } from './logic/MobileDashboardPage.logic';
import {
  PageRoot,
  HeaderBar,
  HeaderTop,
  GreetingText,
  DateText,
  NotifBadge,
  NotifDot,
  SectionTitle,
  ActivityList,
  ActivityItem,
  ActivityIconBox,
  ActivityBody,
  ActivityTitle,
  ActivityDetail,
  ActivityTime,
} from './styles/MobileDashboardPage.style';
import { MobileKpiTileRow } from '../MobileKpiTileRow';
import { ServiceWorkerRegistrationBanner } from '../../pwa/ServiceWorkerRegistrationBanner';
import { OfflineSyncStatusIndicator } from '../../pwa/OfflineSyncStatusIndicator';
import { PullToRefreshWrapper } from '../PullToRefreshWrapper';

const ICON_MAP: Record<string, React.ReactNode> = {
  Users: <Users size={18} />,
  Eye: <Eye size={18} />,
  DollarSign: <DollarSign size={18} />,
  Wrench: <Wrench size={18} />,
  AlertCircle: <AlertCircle size={18} />,
};

const now = new Date();
const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTH_NAMES = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];
const dateLabel = `${DAY_NAMES[now.getDay()]}, ${now.getDate()} ${MONTH_NAMES[now.getMonth()]} ${now.getFullYear()}`;

function getGreeting(): string {
  const h = now.getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

export const MobileDashboardPage: FC = () => {
  const { activities, agentName, handleRefresh } = useMobileDashboardPageLogic();

  return (
    <PageRoot data-testid="mobile-dashboard-page">
      <ServiceWorkerRegistrationBanner />
      <HeaderBar>
        <HeaderTop>
          <div>
            <GreetingText>
              {getGreeting()}, {agentName.split(' ')[0]} 👋
            </GreetingText>
            <DateText>{dateLabel}</DateText>
          </div>
          <NotifBadge aria-label="Notifications">
            <Bell size={20} />
            <NotifDot />
          </NotifBadge>
        </HeaderTop>
        <div style={{ marginTop: 8 }}>
          <OfflineSyncStatusIndicator />
        </div>
      </HeaderBar>

      <PullToRefreshWrapper onRefresh={handleRefresh}>
        <SectionTitle>Live KPIs</SectionTitle>
        <MobileKpiTileRow />

        <SectionTitle>Recent Activity</SectionTitle>
        <ActivityList>
          {activities.map(act => (
            <ActivityItem key={act.id}>
              <ActivityIconBox $color={act.color}>{ICON_MAP[act.icon]}</ActivityIconBox>
              <ActivityBody>
                <ActivityTitle>{act.title}</ActivityTitle>
                <ActivityDetail>{act.detail}</ActivityDetail>
              </ActivityBody>
              <ActivityTime>{act.time}</ActivityTime>
            </ActivityItem>
          ))}
        </ActivityList>
      </PullToRefreshWrapper>
    </PageRoot>
  );
};

export default MobileDashboardPage;
