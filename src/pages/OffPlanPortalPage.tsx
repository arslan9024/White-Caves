import React from 'react';
import styled from 'styled-components';
import PageMeta from '../components/seo/PageMeta';

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

const Checklist = styled.ul`
  margin-top: 1rem;
  padding-left: 1.2rem;
  line-height: 1.8;
  color: rgba(250, 250, 250, 0.8);
`;

export const OffPlanPortalPage: React.FC = () => {
  return (
    <PageWrap aria-labelledby="off-plan-heading">
      <PageMeta
        title="Off-Plan Properties Dubai"
        description="Explore off-plan property investments in Dubai with White Caves Real Estate. Browse developer projects, launch campaigns, and syndication-ready listings."
        canonicalPath="/off-plan"
      />
      <Card>
        <h1 id="off-plan-heading" style={{ marginTop: 0 }}>
          🏗️ Off-Plan Portal (Phase 8)
        </h1>
        <p style={{ color: 'rgba(250,250,250,0.75)' }}>
          Foundation module for developer inventory, launch campaigns, and syndication-ready listing
          flows.
        </p>
        <Checklist aria-label="Off-plan implementation checklist">
          <li>Developer project catalog schema integration point</li>
          <li>Syndication adapter boundary for PropertyFinder/Bayut</li>
          <li>Campaign timeline + launch availability widgets</li>
          <li>RERA-compliant reservation and disclosure flow hooks</li>
        </Checklist>
      </Card>
    </PageWrap>
  );
};

export default OffPlanPortalPage;
