/**
 * NADIA CRM Page - Main Page Component
 * Route: /nadia or /crm/nadia
 */

import React, { Suspense } from 'react';
import { NADIADashboard } from '@/components/nadia';
import styled from 'styled-components';

const PageContainer = styled.div`
  width: 100%;
  height: 100vh;
  background: #F8F9FA;
`;

const LoadingFallback = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  font-size: 16px;
  color: #6B7280;

  &::before {
    content: '';
    width: 32px;
    height: 32px;
    margin-right: 12px;
    border: 3px solid #E5E7EB;
    border-top-color: #4F46E5;
    border-radius: 50%;
    animation: spin 0.6s linear infinite;
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

interface NadiaPageProps {
  conversationId?: string;
}

/**
 * NADIA CRM Page Component
 */
const NadiaPage: React.FC<NadiaPageProps> = ({ conversationId }) => {
  return (
    <PageContainer>
      <Suspense fallback={<LoadingFallback>Loading NADIA CRM...</LoadingFallback>}>
        <NADIADashboard />
      </Suspense>
    </PageContainer>
  );
};

NadiaPage.displayName = 'NadiaPage';

export default NadiaPage;
