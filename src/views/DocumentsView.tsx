import React, { FC } from 'react';
import styled from 'styled-components';

import { RERAFormAGenerator } from '../components/documents/RERAFormAGenerator/RERAFormAGenerator';
import { EjariRegistrationPanel } from '../components/documents/EjariRegistrationPanel/EjariRegistrationPanel';
import { NOCApplicationTracker } from '../components/documents/NOCApplicationTracker/NOCApplicationTracker';

import { SEO } from '../components/seo/SEO';
import { DocumentGenerationHub } from '../components/documents/DocumentGenerationHub/DocumentGenerationHub';

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

export const DocumentsView: FC = () => {
  return (
    <div>
      <SEO title="Legal & DLD Documents" description="Ejari and RERA forms" />
      <SectionTitle>Legal & DLD Documents</SectionTitle>
      <DocumentGenerationHub />
      <Grid>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
          <RERAFormAGenerator />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
          <EjariRegistrationPanel />
          <NOCApplicationTracker />
        </div>
      </Grid>
    </div>
  );
};
export default DocumentsView;
