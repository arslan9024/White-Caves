import styled from 'styled-components';
import { spacing, borderRadius } from '../../../design-tokens';

export const WidgetContainer = styled.div<{ $isRtl: boolean }>`
  background: var(--bg-card, #111827);
  border: 1px solid var(--border-color, rgba(239, 68, 68, 0.25));
  border-radius: ${borderRadius.xl};
  padding: ${spacing[6]};
  direction: ${p => (p.$isRtl ? 'rtl' : 'ltr')};
  box-shadow: var(--shadow-card, 0 12px 32px rgba(0, 0, 0, 0.3));
  margin-bottom: ${spacing[6]};
`;

export const WidgetHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${spacing[5]};

  @media (max-width: 768px) {
    flex-direction: column;
    gap: ${spacing[3]};
  }
`;

export const HeaderTitle = styled.div`
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

export const ScanButton = styled.button<{ $isScanning: boolean }>`
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: #ffffff;
  border: none;
  padding: 10px 20px;
  border-radius: ${borderRadius.md};
  font-weight: 700;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: ${spacing[2]};
  cursor: ${p => (p.$isScanning ? 'not-allowed' : 'pointer')};
  opacity: ${p => (p.$isScanning ? 0.7 : 1)};
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.25);

  &:hover {
    background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
    transform: ${p => (p.$isScanning ? 'none' : 'translateY(-1px)')};
  }

  svg {
    animation: ${p => (p.$isScanning ? 'spin 1s linear infinite' : 'none')};
  }

  @keyframes spin {
    100% {
      transform: rotate(360deg);
    }
  }
`;

export const DatabasesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${spacing[4]};
  margin-bottom: ${spacing[6]};
`;

export const DatabaseCard = styled.div<{ $status: 'clear' | 'flagged' | 'pending' }>`
  background: var(--bg-secondary, rgba(30, 41, 59, 0.4));
  border: 1px solid ${p => {
    switch (p.$status) {
      case 'clear': return 'rgba(34, 197, 94, 0.3)';
      case 'flagged': return 'rgba(239, 68, 68, 0.4)';
      case 'pending': default: return 'var(--border-color, rgba(255, 255, 255, 0.1))';
    }
  }};
  border-radius: ${borderRadius.lg};
  padding: ${spacing[4]};
  display: flex;
  flex-direction: column;
  gap: ${spacing[3]};
  transition: all 0.3s ease;
`;

export const DatabaseHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing[2]};
  color: var(--text-primary, #f8fafc);
  font-weight: 700;
  font-size: 0.9rem;
  
  svg {
    color: var(--text-muted, #94a3b8);
  }
`;

export const StatusIndicator = styled.div<{ $status: 'clear' | 'flagged' | 'pending' }>`
  display: inline-flex;
  align-items: center;
  gap: ${spacing[1]};
  font-size: 0.8rem;
  font-weight: 800;
  text-transform: uppercase;
  
  color: ${p => {
    switch (p.$status) {
      case 'clear': return '#4ade80';
      case 'flagged': return '#ef4444';
      case 'pending': default: return '#94a3b8';
    }
  }};
`;

export const RecentScansSection = styled.div`
  border-top: 1px solid var(--border-color, rgba(255, 255, 255, 0.1));
  padding-top: ${spacing[5]};

  h4 {
    margin: 0 0 ${spacing[4]} 0;
    color: var(--text-primary, #f8fafc);
    font-size: 1rem;
  }
`;

export const ScanList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing[3]};
`;

export const ScanItem = styled.div<{ $risk: 'high' | 'low' }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${spacing[3]} ${spacing[4]};
  background: var(--bg-input, rgba(15, 23, 42, 0.6));
  border-radius: ${borderRadius.md};
  border-left: 4px solid ${p => (p.$risk === 'high' ? '#ef4444' : '#22c55e')};

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: flex-start;
    gap: ${spacing[3]};
  }
`;

export const ClientInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;

  .name {
    font-weight: 700;
    color: var(--text-primary, #f8fafc);
    font-size: 0.95rem;
  }

  .meta {
    font-size: 0.8rem;
    color: var(--text-muted, #94a3b8);
  }
`;

export const ScanActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing[3]};
`;

export const ActionButton = styled.button`
  background: transparent;
  color: var(--text-secondary, #e2e8f0);
  border: 1px solid var(--border-color, rgba(255, 255, 255, 0.2));
  padding: 6px 12px;
  border-radius: ${borderRadius.md};
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
    color: var(--text-primary, #ffffff);
  }
`;
