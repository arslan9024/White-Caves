import styled from 'styled-components';

export const BadgeContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  background: #FFFFFF;
  border: 1px solid #E2E8F0;
  border-radius: 12px;
  padding: 16px 24px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  cursor: pointer;
  transition: all 0.3s ease;
  max-width: fit-content;

  &:hover {
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    transform: translateY(-2px);
    border-color: #EF4444;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
    &:hover {
      transform: none;
    }
  }
`;

export const IconWrapper = styled.div<{ $verified?: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: ${({ $verified }) => ($verified ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)')};
  color: ${({ $verified }) => ($verified ? '#22C55E' : '#EF4444')};
`;

export const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const Title = styled.h3`
  font-size: 1rem;
  font-weight: 700;
  color: #1E293B;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const DetailRow = styled.div`
  font-size: 0.85rem;
  font-weight: 500;
  color: #64748B;
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const VerificationBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  color: #22C55E;
  background: rgba(34, 197, 94, 0.1);
  padding: 4px 8px;
  border-radius: 999px;
`;
