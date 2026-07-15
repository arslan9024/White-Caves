import React, { FC, ReactNode } from 'react';
import styled from 'styled-components';
import { spacing, typography, borderRadius } from '../../../design-tokens';

const ExecutiveCockpitBannerSection = styled.section`
  display: grid;
  gap: ${spacing[3]};
  margin-bottom: ${spacing[3]};
  padding: ${spacing[4]};
  border-radius: ${borderRadius.md};
  border: 1px solid rgba(201, 168, 76, 0.34);
  background: linear-gradient(135deg, rgba(38, 38, 46, 0.92), rgba(24, 24, 30, 0.95));
  color: #f8f6ef;

  h2 {
    margin: 0;
    font-size: 1.08rem;
    font-weight: 600;
  }

  p {
    margin: ${spacing[1]} 0 0;
    color: rgba(248, 246, 239, 0.84);
    ${typography.presets.body};
  }
`;

const ExecutiveCockpitEyebrow = styled.p`
  margin: 0;
  color: rgba(255, 215, 140, 0.96);
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
`;

export const ExecutiveCockpitActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${spacing[2]};
`;

export const SuperuserButton = styled.button`
  min-height: 38px;
  padding: 0 ${spacing[3]};
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.28);
  background: rgba(255, 255, 255, 0.08);
  color: #fff;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.12);
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }

  &:focus-visible {
    outline: 2px solid rgba(255, 215, 140, 0.95);
    outline-offset: 2px;
  }
`;

export const SuperuserButtonPrimary = styled(SuperuserButton)`
  background: linear-gradient(135deg, #bd8f2f, #e4b75e);
  border-color: transparent;
  color: #1f1300;

  &:hover {
    background: linear-gradient(135deg, #a87a28, #d4a84a);
  }
`;

interface ExecutiveCockpitBannerProps {
  title: string;
  description: string;
  children?: ReactNode;
}

export const ExecutiveCockpitBanner: FC<ExecutiveCockpitBannerProps> = ({
  title,
  description,
  children,
}) => (
  <ExecutiveCockpitBannerSection>
    <div>
      <ExecutiveCockpitEyebrow>Executive Control Plane</ExecutiveCockpitEyebrow>
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
    {children && <ExecutiveCockpitActions>{children}</ExecutiveCockpitActions>}
  </ExecutiveCockpitBannerSection>
);

export default ExecutiveCockpitBanner;
