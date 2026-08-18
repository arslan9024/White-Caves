/**
 * DashboardLiveTicker.tsx
 *
 * Real-time financial indicators and operations performance ticker bar.
 */

import React, { FC } from 'react';
import { LiveCorporateTicker, TickerItem } from '../../../pages/crm/CRMHubPage.styles';

export const DashboardLiveTicker: FC = () => {
  return (
    <LiveCorporateTicker>
      <TickerItem>
        💵 <strong>USD / AED:</strong> <span>3.6725 (Fixed)</span>
      </TickerItem>
      <TickerItem>
        🏙️ <strong>DLD Daily Volume:</strong> <span>AED 1.48 Billion</span>
      </TickerItem>
      <TickerItem>
        🎯 <strong>Active Pipeline Deals:</strong> <span>142 Active</span>
      </TickerItem>
      <TickerItem>
        ⚡ <strong>SLA Compliance Score:</strong> <span>99.6% (Grade A+)</span>
      </TickerItem>
      <TickerItem>
        📊 <strong>Escrow Trust Audits:</strong> <span>100% Passed</span>
      </TickerItem>
    </LiveCorporateTicker>
  );
};

export default DashboardLiveTicker;
