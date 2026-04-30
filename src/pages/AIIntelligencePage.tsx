import React from 'react';
import styled from 'styled-components';

const PageWrap = styled.section`
  min-height: 70vh;
  padding: 2rem;
  background: linear-gradient(180deg, #0a0a0a 0%, #141414 100%);
  color: #fafafa;
`;

const Card = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  padding: 1.5rem;
  border-radius: 12px;
  background: rgba(10, 10, 10, 0.65);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(196, 30, 58, 0.3);
`;

const Grid = styled.div`
  margin-top: 1rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
`;

const Tile = styled.article`
  border: 1px solid rgba(196, 30, 58, 0.2);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.03);
  padding: 1rem;
`;

export const AIIntelligencePage: React.FC = () => {
  return (
    <PageWrap aria-labelledby="ai-intelligence-heading">
      <Card>
        <h1 id="ai-intelligence-heading" style={{ marginTop: 0 }}>🤖 AI Intelligence Hub (Phase 7)</h1>
        <p style={{ color: 'rgba(250,250,250,0.75)' }}>
          This module scaffolds data-driven insights for market analytics, lead scoring, and recommendation intelligence.
        </p>
        <Grid>
          <Tile aria-label="Market insights module">
            <h3>Market Insights</h3>
            <p>Q1 2026 reference metrics and district trends integration point.</p>
          </Tile>
          <Tile aria-label="Lead scoring module">
            <h3>Lead Scoring</h3>
            <p>Behavioral and source-based prioritization pipeline placeholder.</p>
          </Tile>
          <Tile aria-label="Recommendations module">
            <h3>Property Recommendations</h3>
            <p>Buyer-intent matching model staging area.</p>
          </Tile>
        </Grid>
      </Card>
    </PageWrap>
  );
};

export default AIIntelligencePage;
