/**
 * ModuleViewport.tsx
 *
 * High-performance module viewport engine with lazy loading, error boundaries,
 * and unified executive breadcrumbs.
 */

import React, { FC, Suspense } from 'react';
import ErrorBoundary from '../../ErrorBoundary';
import SkeletonLoader from '../../common/SkeletonLoader';
import { Badge } from '../../ui';
import {
  ContentArea,
  ContentHeader,
} from '../../../pages/crm/CRMHubPage.styles';
import { CRM_MODULE_REGISTRY } from '../../../config/crmModuleRegistry';

/** Minimal CRM user shape passed through to module components */
export interface CrmUser {
  id?: string;
  email?: string;
  name?: string;
  role?: string;
  [key: string]: unknown;
}

export interface ModuleViewportProps {
  moduleId: string;
  user: CrmUser | null;
  onBackToOverview: () => void;
}

export const ModuleViewport: FC<ModuleViewportProps> = ({
  moduleId,
  user,
  onBackToOverview,
}) => {
  const moduleDef = CRM_MODULE_REGISTRY[moduleId];

  if (!moduleDef) {
    return (
      <ContentArea>
        <div style={{ padding: '3rem 2rem', textAlign: 'center', color: '#64748B' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🔍</div>
          <h3 style={{ margin: '0 0 0.5rem 0', color: '#1E293B', fontWeight: 800 }}>
            Module Not Found: "{moduleId}"
          </h3>
          <p style={{ margin: '0 0 1.5rem 0', fontSize: '0.9rem' }}>
            The requested module could not be located in the CRM module registry.
          </p>
          <button
            onClick={onBackToOverview}
            style={{
              background: '#EF4444',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '8px',
              padding: '8px 18px',
              fontSize: '0.85rem',
              fontWeight: 800,
              cursor: 'pointer',
            }}
          >
            Return to Executive Overview
          </button>
        </div>
      </ContentArea>
    );
  }

  const ModuleComponent = moduleDef.Component;

  return (
    <ContentArea>
      {/* Module Header Bar */}
      <ContentHeader>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '1.4rem' }}>{moduleDef.icon}</span>
          <div>
            <span style={{ fontWeight: 800, fontSize: '1.15rem', color: '#1E293B', display: 'block' }}>
              {moduleDef.label}
            </span>
            <span style={{ fontSize: '0.78rem', color: '#64748B' }}>
              {moduleDef.description}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <button
            onClick={onBackToOverview}
            style={{
              background: '#FFFFFF',
              border: '1px solid #CBD5E1',
              borderRadius: '6px',
              padding: '5px 12px',
              fontSize: '0.78rem',
              fontWeight: 700,
              color: '#475569',
              cursor: 'pointer',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
              transition: 'all 0.15s ease',
            }}
          >
            📋 Executive Summary
          </button>
          <Badge variant={moduleDef.zone === 'ai_command' ? 'info' : 'success'} size="small">
            {moduleDef.zone === 'ai_command' ? 'AI Assistant Active' : 'Production Data View'}
          </Badge>
        </div>
      </ContentHeader>

      {/* Module View Body */}
      <div style={{ padding: '1rem' }}>
        <ErrorBoundary>
          <Suspense fallback={<SkeletonLoader width="100%" height="400px" borderRadius="16px" />}>
            <ModuleComponent role="owner" user={user} moduleId={moduleId} />
          </Suspense>
        </ErrorBoundary>
      </div>
    </ContentArea>
  );
};

export default ModuleViewport;
