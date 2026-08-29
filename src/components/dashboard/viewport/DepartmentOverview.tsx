/**
 * DepartmentOverview.tsx
 *
 * Renders high-fidelity Department Executive Overview, Mission Scope cards,
 * and Operational Sub-Nodes launchpad for the active corporate department.
 */

import React, { FC } from 'react';
import { motion, Variants } from 'framer-motion';
import { Badge } from '../../ui';
import {
  ContentArea,
  ContentHeader,
} from '../../../pages/crm/CRMHubPage.styles';
import { BuildingTier } from '../../../pages/crm/CRMHubPage.logic';
import FounderExecutiveDashboard from './FounderExecutiveDashboard';

export interface DepartmentOverviewProps {
  department: BuildingTier;
  onLaunchSubItem: (itemId: string) => void;
}

const slideUpItem: Variants = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 24 } },
};

export const DepartmentOverview: FC<DepartmentOverviewProps> = ({
  department,
  onLaunchSubItem,
}) => {
  if (department.id === 'dept-md') {
    return <FounderExecutiveDashboard onNavigateToModule={onLaunchSubItem} />;
  }

  return (
    <ContentArea>
      {/* Dynamic Viewport Header */}
      <ContentHeader>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '1.4rem' }}>{department.icon}</span>
          <div>
            <span style={{ fontWeight: 800, fontSize: '1.15rem', color: 'var(--color-1e293b, #1E293B)', display: 'block' }}>
              {department.num}: {department.name}
            </span>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary, #64748B)' }}>
              Executive Department Overview & Operations Directory
            </span>
          </div>
        </div>

        {/* Location Indicator & Access Badge */}
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <span
            style={{
              background: 'rgba(239, 68, 68, 0.1)',
              color: '#EF4444',
              fontWeight: 800,
              fontSize: '0.82rem',
              padding: '6px 12px',
              borderRadius: '8px',
              border: '1px solid rgba(239, 68, 68, 0.25)',
            }}
          >
            📍 {department.locationTag}
          </span>
          <Badge variant="info" size="small">
            {department.accessLevel}
          </Badge>
        </div>
      </ContentHeader>

      {/* Department Body Content */}
      <div style={{ padding: '1.75rem' }}>
        {/* Executive Summary Card */}
        <motion.div variants={slideUpItem} initial="hidden" animate="show">
          <div
            style={{
              background: 'linear-gradient(135deg, #F8FAFC 0%, #EFF6FF 100%)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              borderRadius: '14px',
              padding: '1.5rem',
              marginBottom: '1.75rem',
            }}
          >
            <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent-red, #EF4444)' }}>
              📋 {department.num} Executive Summary
            </h3>
            <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--color-334155, #334155)', lineHeight: 1.6 }}>
              {department.summary}
            </p>
          </div>
        </motion.div>

        {/* Mission Operational Scope */}
        <motion.div variants={slideUpItem} initial="hidden" animate="show" style={{ marginBottom: '1.75rem' }}>
          <h4 style={{ margin: '0 0 0.85rem 0', fontSize: '1.05rem', fontWeight: 800, color: 'var(--color-1e293b, #1E293B)' }}>
            🎯 Mission Operational Scope
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
            {department.scope.map((item, index) => (
              <motion.div
                whileHover={{ scale: 1.02, y: -2 }}
                key={index}
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  borderRadius: '10px',
                  padding: '1rem',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.75rem',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                }}
              >
                <span style={{ color: 'var(--accent-red, #EF4444)', fontWeight: 800, fontSize: '1.1rem' }}>✓</span>
                <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--color-475569, #475569)', lineHeight: 1.4 }}>
                  {item}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Operational Sub-Nodes Launchpad */}
        <motion.div variants={slideUpItem} initial="hidden" animate="show">
          <h4 style={{ margin: '0 0 0.85rem 0', fontSize: '1.05rem', fontWeight: 800, color: 'var(--color-1e293b, #1E293B)' }}>
            ⚡ Operational Sub-Nodes Launchpad
          </h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
            {department.subGroups
              ? department.subGroups
                  .flatMap(sg => sg.items)
                  .filter((item): item is { id: string; label: string; icon: string } => Boolean(item))
                  .map(item => (
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      key={item.id + item.label}
                      onClick={() => onLaunchSubItem(item.id)}
                      style={{
                        background: '#FFFFFF',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        borderRadius: '10px',
                        padding: '10px 16px',
                        fontSize: '0.85rem',
                        fontWeight: 800,
                        color: '#EF4444',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        boxShadow: '0 2px 8px rgba(239, 68, 68, 0.08)',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <span>{item.icon}</span> Launch {item.label} ➔
                    </motion.button>
                  ))
              : department.items?.map(item => (
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    key={item.id + item.label}
                    onClick={() => onLaunchSubItem(item.id)}
                    style={{
                      background: '#FFFFFF',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                      borderRadius: '10px',
                      padding: '10px 16px',
                      fontSize: '0.85rem',
                      fontWeight: 800,
                      color: '#EF4444',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      boxShadow: '0 2px 8px rgba(239, 68, 68, 0.08)',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <span>{item.icon}</span> Launch {item.label} ➔
                  </motion.button>
                ))}
          </div>
        </motion.div>
      </div>
    </ContentArea>
  );
};

export default DepartmentOverview;
