import React, { FC } from 'react';
import styled from 'styled-components';

import { SecuritySettingsPanel } from '../components/settings/SecuritySettingsPanel/SecuritySettingsPanel';
import { NotificationPreferencesPanel } from '../components/settings/NotificationPreferencesPanel/NotificationPreferencesPanel';
import { BillingSubscriptionCard } from '../components/settings/BillingSubscriptionCard/BillingSubscriptionCard';

import { SEO } from '../components/seo/SEO';
import { AutomationControlPanel } from '../components/settings/AutomationControlPanel/AutomationControlPanel';

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

export const SettingsView: FC = () => {
  return (
    <div>
      <SEO title="System Settings" description="Configure CRM parameters" />
      <SectionTitle>System Settings</SectionTitle>
      <Grid>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
          <SecuritySettingsPanel />
          <BillingSubscriptionCard />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
          <AutomationControlPanel />
          <NotificationPreferencesPanel />
        </div>
      </Grid>
    </div>
  );
};
export default SettingsView;
