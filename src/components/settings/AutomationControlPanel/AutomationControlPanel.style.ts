import styled from 'styled-components';

export const PanelWrap = styled.div`
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(100, 116, 139, 0.2);
  border-radius: 12px;
  padding: 24px;
  backdrop-filter: blur(12px);
`;

export const Title = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  color: #F8FAFC;
  margin: 0 0 16px 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const JobList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const JobItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background: rgba(30, 41, 59, 0.5);
  border-radius: 8px;
  border: 1px solid rgba(100, 116, 139, 0.1);
`;

export const JobInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

export const JobName = styled.div`
  font-size: 1rem;
  font-weight: 600;
  color: #E2E8F0;
`;

export const JobMeta = styled.div`
  font-size: 0.8rem;
  color: #94A3B8;
  margin-top: 4px;
  font-family: monospace;
`;

export const RunButton = styled.button`
  background: rgba(56, 189, 248, 0.1);
  color: #38BDF8;
  border: 1px solid rgba(56, 189, 248, 0.2);
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: rgba(56, 189, 248, 0.2);
  }
`;
