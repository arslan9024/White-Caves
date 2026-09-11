import React, { FC } from 'react';
import styled from 'styled-components';

import { EmailCampaignBuilder } from '../components/marketing/EmailCampaignBuilder/EmailCampaignBuilder';
import { SMSBroadcastComposer } from '../components/marketing/SMSBroadcastComposer/SMSBroadcastComposer';
import { MarketingROIAnalytics } from '../components/marketing/MarketingROIAnalytics/MarketingROIAnalytics';

import { SEO } from '../components/seo/SEO';

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
  max-width: 1400px;
  margin: 0 auto;
`;

const SectionTitle = styled.h1`
  font-size: 1.8rem;
  font-weight: 900;
  margin: 0 0 24px;
  color: #F8FAFC;
`;

export const MarketingView: FC = () => {
  return (
    <div>
      <SEO title="Marketing Campaigns" description="Build and track marketing outreach" />
      <SectionTitle>Marketing Campaigns</SectionTitle>
      <div style={{ marginBottom: 32 }}>
        <MarketingROIAnalytics />
      </div>
      <Grid>
        <EmailCampaignBuilder />
        <SMSBroadcastComposer />
      </Grid>
    </div>
  );
};
export default MarketingView;
