import React, { FC } from 'react';
import styled from 'styled-components';

import { ExecutiveSummaryDashboard } from '../components/analytics/ExecutiveSummaryDashboard/ExecutiveSummaryDashboard';
import { BrokerLeaderboardRanking } from '../components/gamification/BrokerLeaderboardRanking/BrokerLeaderboardRanking';
import { DealOfTheMonthHighlight } from '../components/gamification/DealOfTheMonthHighlight/DealOfTheMonthHighlight';
import { InternalAnnouncementBoard } from '../components/hr/InternalAnnouncementBoard/InternalAnnouncementBoard';

import { SEO } from '../components/seo/SEO';
import { RealtimeNotificationCenter } from '../components/notifications/RealtimeNotificationCenter/RealtimeNotificationCenter';

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 32px;
  max-width: 1400px;
  margin: 0 auto;
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

const SectionTitle = styled.h1`
  font-size: 1.8rem;
  font-weight: 900;
  margin: 0 0 24px;
  color: #F8FAFC;
`;

export const HomeView: FC = () => {
  return (
    <div>
      <SEO title="Executive Dashboard" description="Overview of CRM activity" />
      <SectionTitle>Executive Dashboard</SectionTitle>
      <Grid>
        <Column>
          <ExecutiveSummaryDashboard />
          <InternalAnnouncementBoard />
        </Column>
        <Column>
          <RealtimeNotificationCenter />
          <DealOfTheMonthHighlight />
          <BrokerLeaderboardRanking />
        </Column>
      </Grid>
    </div>
  );
};
export default HomeView;
