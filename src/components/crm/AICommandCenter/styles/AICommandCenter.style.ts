/**
 * AICommandCenter.style.ts — UI Style Layer & Styled-Components
 * Enforces White Caves Luxury Red (#EF4444) / Crisp White (#FFFFFF) / Slate (#1E293B) palette.
 */

import styled from 'styled-components';

export const CommandCenterContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
  max-width: 1600px;
  margin: 0 auto;
  padding: 8px;
  font-family: 'Inter', sans-serif;
  color: var(--text-primary, #0F172A);
`;

export const HeaderBanner = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
  padding: 24px 28px;
  background: var(--bg-card, #FFFFFF);
  border: 1px solid var(--border-color, #E2E8F0);
  border-left: 5px solid #EF4444;
  border-radius: 16px;
  box-shadow: 0 10px 25px -5px rgba(15, 23, 42, 0.08);

  h1 {
    margin: 0;
    font-size: 1.5rem;
    font-weight: 800;
    color: var(--text-primary, #0F172A);
    display: flex;
    align-items: center;
    gap: 10px;
  }

  p {
    margin: 6px 0 0;
    font-size: 0.88rem;
    color: var(--text-muted, #64748B);
  }
`;

export const LiveBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: 999px;
  background: rgba(239, 68, 68, 0.1);
  color: #EF4444;
  border: 1px solid rgba(239, 68, 68, 0.3);
  font-size: 0.8rem;
  font-weight: 800;
  letter-spacing: 0.04em;

  &::before {
    content: '';
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #EF4444;
    box-shadow: 0 0 10px #EF4444;
    animation: pulseRed 1.8s infinite;
  }

  @keyframes pulseRed {
    0%, 100% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.3); opacity: 0.6; }
  }
`;

export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
`;

export const StatCardWrapper = styled.div<{ $color?: string }>`
  background: var(--bg-card, #FFFFFF);
  border: 1px solid var(--border-color, #E2E8F0);
  border-radius: 14px;
  padding: 18px 20px;
  box-shadow: 0 4px 16px -2px rgba(15, 23, 42, 0.05);
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px -4px rgba(15, 23, 42, 0.12);
  }

  .stat-info {
    display: flex;
    flex-direction: column;
    gap: 4px;

    span.label {
      font-size: 0.78rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--text-muted, #64748B);
    }

    strong.value {
      font-size: 1.55rem;
      font-weight: 900;
      color: ${p => p.$color || '#EF4444'};
    }
  }

  .stat-icon {
    width: 46px;
    height: 46px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.3rem;
    background: ${p => (p.$color ? `${p.$color}15` : 'rgba(239, 68, 68, 0.1)')};
    color: ${p => p.$color || '#EF4444'};
  }
`;

export const FilterBar = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background: var(--bg-card, #FFFFFF);
  border: 1px solid var(--border-color, #E2E8F0);
  border-radius: 14px;
`;

export const SearchInputWrapper = styled.div`
  position: relative;
  flex: 1;
  min-width: 280px;

  input {
    width: 100%;
    padding: 10px 14px 10px 38px;
    border-radius: 10px;
    border: 1px solid var(--border-input, #E2E8F0);
    background: var(--bg-input, #F8FAFC);
    color: var(--text-primary, #0F172A);
    font-size: 0.9rem;
    outline: none;
    transition: all 0.2s ease;

    &:focus {
      border-color: #EF4444;
      box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.18);
      background: #FFFFFF;
    }
  }

  .search-icon {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: #94A3B8;
    pointer-events: none;
  }
`;

export const DepartmentPills = styled.div`
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  align-items: center;
`;

export const DeptPill = styled.button<{ $active: boolean }>`
  padding: 6px 12px;
  border-radius: 8px;
  border: 1px solid ${p => (p.$active ? '#EF4444' : 'var(--border-color, #E2E8F0)')};
  background: ${p => (p.$active ? '#EF4444' : 'var(--bg-secondary, #F8FAFC)')};
  color: ${p => (p.$active ? '#FFFFFF' : 'var(--text-secondary, #475569)')};
  font-size: 0.78rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    border-color: #EF4444;
    color: ${p => (p.$active ? '#FFFFFF' : '#EF4444')};
  }
`;

export const AssistantsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
`;

export const AssistantCard = styled.div<{ $active?: boolean }>`
  background: var(--bg-card, #FFFFFF);
  border: 1px solid ${p => (p.$active ? '#EF4444' : 'var(--border-color, #E2E8F0)')};
  border-radius: 16px;
  padding: 20px;
  box-shadow: ${p => (p.$active ? '0 12px 30px rgba(239, 68, 68, 0.18)' : '0 4px 18px rgba(15, 23, 42, 0.06)')};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 14px;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #EF4444, #F97316);
    opacity: ${p => (p.$active ? 1 : 0)};
    transition: opacity 0.2s ease;
  }

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 14px 34px -4px rgba(15, 23, 42, 0.15);
    border-color: #EF4444;
    &::before { opacity: 1; }
  }
`;

export const AssistantHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  img {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    object-fit: cover;
    border: 2px solid #EF4444;
  }

  .meta {
    flex: 1;
    overflow: hidden;

    h3 {
      margin: 0;
      font-size: 1.05rem;
      font-weight: 800;
      color: var(--text-primary, #0F172A);
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    span.code {
      font-size: 0.7rem;
      font-family: monospace;
      padding: 2px 6px;
      border-radius: 4px;
      background: rgba(239, 68, 68, 0.12);
      color: #EF4444;
      font-weight: 800;
    }

    p.title {
      margin: 2px 0 0;
      font-size: 0.78rem;
      color: var(--text-muted, #64748B);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
`;

export const TagList = styled.div`
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
`;

export const CapabilityTag = styled.span`
  padding: 3px 8px;
  border-radius: 6px;
  background: var(--bg-secondary, #F1F5F9);
  color: var(--text-secondary, #475569);
  font-size: 0.72rem;
  font-weight: 600;
`;

export const MetricsRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 8px 12px;
  border-radius: 8px;
  background: var(--bg-secondary, #F8FAFC);
  border: 1px solid var(--border-color, #E2E8F0);
  font-size: 0.76rem;
  font-weight: 700;

  .metric-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;

    span.label {
      color: var(--text-muted, #94A3B8);
      font-size: 0.68rem;
      text-transform: uppercase;
    }

    strong.val {
      color: #0F172A;
    }
  }
`;

export const LaunchBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  width: 100%;
  padding: 10px;
  border-radius: 10px;
  border: none;
  background: linear-gradient(135deg, #EF4444 0%, #DC2626 100%);
  color: #FFFFFF;
  font-size: 0.84rem;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 14px rgba(239, 68, 68, 0.3);

  &:hover {
    background: linear-gradient(135deg, #DC2626 0%, #B91C1C 100%);
    transform: translateY(-1px);
    box-shadow: 0 6px 18px rgba(239, 68, 68, 0.4);
  }
`;
