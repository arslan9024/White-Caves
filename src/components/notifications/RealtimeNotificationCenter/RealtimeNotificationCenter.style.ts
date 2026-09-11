import styled, { keyframes } from 'styled-components';

const slideIn = keyframes`
  from { opacity: 0; transform: translateX(20px); }
  to { opacity: 1; transform: translateX(0); }
`;

export const CenterWrap = styled.div`
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(100, 116, 139, 0.2);
  border-radius: 12px;
  padding: 24px;
  backdrop-filter: blur(12px);
  margin-bottom: 24px;
  max-height: 400px;
  display: flex;
  flex-direction: column;
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
`;

export const Title = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  color: #F8FAFC;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const StatusBadge = styled.div<{ $connected: boolean }>`
  background: ${({ $connected }) => $connected ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)'};
  color: ${({ $connected }) => $connected ? '#22C55E' : '#EF4444'};
  border: 1px solid ${({ $connected }) => $connected ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)'};
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 6px;

  &::before {
    content: '';
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: ${({ $connected }) => $connected ? '#22C55E' : '#EF4444'};
  }
`;

export const FeedList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  overflow-y: auto;
  padding-right: 8px;

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(100, 116, 139, 0.4);
    border-radius: 4px;
  }
`;

export const FeedItem = styled.div<{ $type: string }>`
  animation: ${slideIn} 0.3s ease-out forwards;
  background: rgba(30, 41, 59, 0.5);
  border-left: 3px solid ${({ $type }) => {
    switch ($type) {
      case 'alert': return '#EF4444';
      case 'assignment': return '#38BDF8';
      case 'success': return '#22C55E';
      default: return '#94A3B8';
    }
  }};
  border-radius: 6px;
  padding: 12px 16px;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const FeedItemTitle = styled.div`
  font-size: 0.95rem;
  font-weight: 600;
  color: #E2E8F0;
`;

export const FeedItemMessage = styled.div`
  font-size: 0.85rem;
  color: #94A3B8;
`;

export const FeedItemTime = styled.div`
  font-size: 0.75rem;
  color: #64748B;
  margin-top: 4px;
`;

export const TestControls = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid rgba(100, 116, 139, 0.2);
`;

export const TestButton = styled.button`
  background: rgba(100, 116, 139, 0.1);
  color: #E2E8F0;
  border: 1px solid rgba(100, 116, 139, 0.3);
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: rgba(100, 116, 139, 0.2);
  }
`;
