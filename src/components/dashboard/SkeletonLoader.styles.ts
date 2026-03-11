import styled, { keyframes } from 'styled-components';

const shimmer = keyframes`
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
`;

const dropdownFade = keyframes`
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const SkeletonBase = styled.div`
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.05) 0%,
    rgba(255, 255, 255, 0.1) 50%,
    rgba(255, 255, 255, 0.05) 100%
  );
  background-size: 200% 100%;
  animation: ${shimmer} 1.5s ease-in-out infinite;
  border-radius: 4px;
`;

export const SkeletonText = styled(SkeletonBase)`
  height: 16px;
  width: 100%;
`;

export const SkeletonCircle = styled(SkeletonBase)`
  border-radius: 50%;
  flex-shrink: 0;
`;

export const SkeletonCard = styled.div`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 20px;
`;

export const SkeletonCardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
`;

export const SkeletonCardTitle = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
`;

export const SkeletonCardBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const SkeletonStatCard = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
`;

export const SkeletonStatContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
`;

export const SkeletonTable = styled.div`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  overflow: hidden;
`;

export const SkeletonTableHeader = styled.div`
  display: flex;
  gap: 32px;
  padding: 16px 20px;
  background: rgba(255, 255, 255, 0.02);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
`;

export const SkeletonTableBody = styled.div`
  padding: 8px 0;
`;

export const SkeletonTableRow = styled.div`
  display: flex;
  gap: 32px;
  padding: 12px 20px;

  &:not(:last-child) {
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  }
`;

export const SkeletonDashboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 24px;
`;

export const SkeletonStatsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

export const SkeletonContentRow = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

export const SkeletonMainContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const SkeletonSidebarContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const EmptyStateContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 40px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px dashed rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  text-align: center;

  @media (max-width: 640px) {
    padding: 40px 20px;
  }
`;

export const EmptyStateIcon = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: rgba(220, 38, 38, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  color: #dc2626;

  svg {
    width: 48px;
    height: 48px;
  }
`;

export const EmptyStateTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
  margin: 0 0 8px 0;
`;

export const EmptyStateDescription = styled.p`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.5);
  margin: 0 0 24px 0;
  max-width: 320px;
  line-height: 1.6;
`;

export const EmptyStateAction = styled.button`
  padding: 12px 24px;
  background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%);
  border: none;
  border-radius: 10px;
  color: white;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(220, 38, 38, 0.3);
  }

  &:active {
    transform: translateY(0);
  }
`;

// Light theme variants
export const LightThemeStyles = `
  [data-theme="light"] {
    ${SkeletonBase} {
      background: linear-gradient(
        90deg,
        #f3f4f6 0%,
        #e5e7eb 50%,
        #f3f4f6 100%
      );
      background-size: 200% 100%;
    }

    ${SkeletonCard},
    ${SkeletonStatCard},
    ${SkeletonTable} {
      background: white;
      border-color: #e5e7eb;
    }

    ${SkeletonTableHeader} {
      background: #f9fafb;
      border-bottom-color: #e5e7eb;
    }
  }
`;
