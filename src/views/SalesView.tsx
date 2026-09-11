import React, { FC } from 'react';
import styled from 'styled-components';

import { LeadScoringAI } from '../components/ai/LeadScoringAI/LeadScoringAI';
import { SentimentAnalysisWidget } from '../components/ai/SentimentAnalysisWidget/SentimentAnalysisWidget';
import { NextBestActionEngine } from '../components/ai/NextBestActionEngine/NextBestActionEngine';
import { SmartReplySuggestions } from '../components/ai/SmartReplySuggestions/SmartReplySuggestions';

import { SEO } from '../components/seo/SEO';

const Grid = styled.div`
  display: grid;
  grid-template-columns: 300px 1fr;
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

export const SalesView: FC = () => {
  return (
    <div>
      <SEO title="Sales & AI Copilot" description="Agent productivity tools" />
      <SectionTitle>Sales AI Copilot</SectionTitle>
      <Grid>
        <Column>
          <LeadScoringAI />
        </Column>
        <Column>
          <NextBestActionEngine />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
            <SentimentAnalysisWidget />
            <SmartReplySuggestions />
          </div>
        </Column>
      </Grid>
    </div>
  );
};
export default SalesView;
