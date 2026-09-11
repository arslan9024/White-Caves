import React, { FC } from 'react';
import styled from 'styled-components';

import { PaymentPlanVisualizer } from '../components/offplan/PaymentPlanVisualizer/PaymentPlanVisualizer';
import { ROIProjector } from '../components/offplan/ROIProjector/ROIProjector';
import { UnitAvailabilityMatrix } from '../components/offplan/UnitAvailabilityMatrix/UnitAvailabilityMatrix';
import { HandoverCountdown } from '../components/offplan/HandoverCountdown/HandoverCountdown';

import { SEO } from '../components/seo/SEO';
import { CloudinaryUploader } from '../components/media/CloudinaryUploader/CloudinaryUploader';

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
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

export const OffPlanView: FC = () => {
  return (
    <div>
      <SEO title="Off-Plan Projects Hub" description="Real estate developer projects" />
      <SectionTitle>Off-Plan Projects Hub</SectionTitle>
      <div style={{ marginBottom: 32 }}>
        <HandoverCountdown />
      </div>
      <CloudinaryUploader />
      <Grid>
        <Column>
          <UnitAvailabilityMatrix />
        </Column>
        <Column>
          <ROIProjector />
          <PaymentPlanVisualizer />
        </Column>
      </Grid>
    </div>
  );
};
export default OffPlanView;
