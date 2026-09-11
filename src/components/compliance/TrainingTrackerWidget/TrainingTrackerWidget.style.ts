import styled from 'styled-components';
import { spacing, borderRadius } from '../../../design-tokens';

export const TrackerContainer = styled.div<{ $isRtl: boolean }>`
  background: var(--bg-card, #111827);
  border: 1px solid var(--border-color, rgba(239, 68, 68, 0.25));
  border-radius: ${borderRadius.xl};
  padding: ${spacing[6]};
  direction: ${p => (p.$isRtl ? 'rtl' : 'ltr')};
  box-shadow: var(--shadow-card, 0 12px 32px rgba(0, 0, 0, 0.3));
  margin-bottom: ${spacing[6]};
`;

export const TrackerHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${spacing[5]};

  @media (max-width: 768px) {
    flex-direction: column;
    gap: ${spacing[3]};
  }
`;

export const TitleBox = styled.div`
  h3 {
    margin: 0 0 ${spacing[2]} 0;
    color: var(--text-primary, #f8fafc);
    font-size: 1.25rem;
    display: flex;
    align-items: center;
    gap: ${spacing[2]};

    svg {
      color: #ef4444;
    }
  }

  p {
    margin: 0;
    color: var(--text-muted, #94a3b8);
    font-size: 0.875rem;
  }
`;

export const StatusBadge = styled.div<{ $status: 'compliant' | 'at_risk' | 'non_compliant' }>`
  display: inline-flex;
  align-items: center;
  gap: ${spacing[2]};
  padding: ${spacing[2]} ${spacing[4]};
  border-radius: ${borderRadius.full};
  font-weight: 700;
  font-size: 0.875rem;
  
  background: ${p => {
    switch (p.$status) {
      case 'compliant': return 'rgba(34, 197, 94, 0.15)';
      case 'at_risk': return 'rgba(234, 179, 8, 0.15)';
      case 'non_compliant': return 'rgba(239, 68, 68, 0.15)';
    }
  }};
  
  color: ${p => {
    switch (p.$status) {
      case 'compliant': return '#4ade80';
      case 'at_risk': return '#facc15';
      case 'non_compliant': return '#ef4444';
    }
  }};
  
  border: 1px solid ${p => {
    switch (p.$status) {
      case 'compliant': return 'rgba(34, 197, 94, 0.3)';
      case 'at_risk': return 'rgba(234, 179, 8, 0.3)';
      case 'non_compliant': return 'rgba(239, 68, 68, 0.3)';
    }
  }};
`;

export const ProgressSection = styled.div`
  margin-bottom: ${spacing[6]};
`;

export const ProgressHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: ${spacing[2]};

  span {
    color: var(--text-primary, #f8fafc);
    font-weight: 600;
    font-size: 0.95rem;
  }

  .hours {
    font-size: 1.1rem;
    font-weight: 800;
    color: #ef4444;
  }
`;

export const ProgressBarBg = styled.div`
  width: 100%;
  height: 12px;
  background: var(--bg-secondary, rgba(30, 41, 59, 0.5));
  border-radius: ${borderRadius.full};
  overflow: hidden;
  border: 1px solid var(--border-color, rgba(255, 255, 255, 0.1));
`;

export const ProgressBarFill = styled.div<{ $percentage: number; $status: string }>`
  height: 100%;
  width: ${p => p.$percentage}%;
  background: ${p => {
    switch (p.$status) {
      case 'compliant': return 'linear-gradient(90deg, #22c55e, #4ade80)';
      case 'at_risk': return 'linear-gradient(90deg, #eab308, #facc15)';
      case 'non_compliant': default: return 'linear-gradient(90deg, #dc2626, #ef4444)';
    }
  }};
  border-radius: ${borderRadius.full};
  transition: width 1s cubic-bezier(0.16, 1, 0.3, 1);
`;

export const DeadlineBox = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing[3]};
  padding: ${spacing[4]};
  background: rgba(239, 68, 68, 0.05);
  border: 1px dashed rgba(239, 68, 68, 0.3);
  border-radius: ${borderRadius.lg};
  margin-bottom: ${spacing[6]};
  
  svg {
    color: #ef4444;
  }

  div {
    display: flex;
    flex-direction: column;
    
    .label {
      font-size: 0.8rem;
      color: var(--text-muted, #94a3b8);
      text-transform: uppercase;
      font-weight: 700;
      letter-spacing: 0.05em;
    }
    
    .date {
      font-size: 1.1rem;
      font-weight: 800;
      color: var(--text-primary, #f8fafc);
    }
  }
`;

export const CoursesSection = styled.div`
  h4 {
    margin: 0 0 ${spacing[4]} 0;
    color: var(--text-primary, #f8fafc);
    font-size: 1rem;
  }
`;

export const CourseList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing[3]};
`;

export const CourseCard = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${spacing[4]};
  background: var(--bg-secondary, rgba(30, 41, 59, 0.4));
  border: 1px solid var(--border-color, rgba(255, 255, 255, 0.05));
  border-radius: ${borderRadius.lg};
  transition: all 0.2s ease;

  &:hover {
    border-color: rgba(239, 68, 68, 0.3);
    background: rgba(239, 68, 68, 0.05);
  }

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: flex-start;
    gap: ${spacing[4]};
  }
`;

export const CourseInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing[1]};

  .course-title {
    font-weight: 700;
    color: var(--text-primary, #f8fafc);
  }

  .course-meta {
    font-size: 0.85rem;
    color: var(--text-muted, #94a3b8);
    display: flex;
    align-items: center;
    gap: ${spacing[3]};
    
    span {
      display: flex;
      align-items: center;
      gap: ${spacing[1]};
    }
  }
`;

export const ActionButton = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  background: ${p => p.$variant === 'primary' ? '#ef4444' : 'transparent'};
  color: ${p => p.$variant === 'primary' ? '#ffffff' : '#ef4444'};
  border: 1px solid ${p => p.$variant === 'primary' ? '#ef4444' : 'rgba(239, 68, 68, 0.4)'};
  padding: 8px 16px;
  border-radius: ${borderRadius.md};
  font-weight: 700;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;

  &:hover {
    background: ${p => p.$variant === 'primary' ? '#dc2626' : 'rgba(239, 68, 68, 0.1)'};
    border-color: ${p => p.$variant === 'primary' ? '#dc2626' : '#ef4444'};
  }
`;
