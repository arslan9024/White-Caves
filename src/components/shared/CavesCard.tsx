import React from 'react';
import styled from 'styled-components';

const RED = '#EF4444';
const SLATE = '#1E293B';

export interface CavesCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hoverable?: boolean;
  bordered?: boolean;
  padding?: string;
  badge?: string;
}

const StyledCard = styled.div<{ $hoverable: boolean; $bordered: boolean; $padding: string }>`
  background: #FFFFFF;
  border-radius: 20px;
  padding: ${props => props.$padding};
  border: ${props => (props.$bordered ? '1.5px solid rgba(239, 68, 68, 0.15)' : '1px solid #E2E8F0')};
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.05);
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  position: relative;
  overflow: hidden;

  ${props =>
    props.$hoverable &&
    `
    cursor: pointer;
    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 20px 40px rgba(239, 68, 68, 0.12);
      border-color: ${RED};
    }
  `}
`;

const BadgeTag = styled.div`
  position: absolute;
  top: 16px;
  right: 16px;
  background: rgba(239, 68, 68, 0.1);
  color: ${RED};
  font-weight: 800;
  font-size: 0.75rem;
  padding: 4px 10px;
  border-radius: 9999px;
  border: 1px solid rgba(239, 68, 68, 0.2);
`;

export const CavesCard: React.FC<CavesCardProps> = ({
  children,
  hoverable = false,
  bordered = true,
  padding = '24px',
  badge,
  ...props
}) => {
  return (
    <StyledCard $hoverable={hoverable} $bordered={bordered} $padding={padding} {...props}>
      {badge && <BadgeTag>{badge}</BadgeTag>}
      {children}
    </StyledCard>
  );
};

export default CavesCard;
