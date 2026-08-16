import styled from 'styled-components';

export const TimelineWrapper = styled.div`
  padding: 1.5rem;
  background: #0F172A;
  border: 2px solid #EF4444;
  border-radius: 16px;
  color: #FFFFFF;
  margin-top: 1rem;
`;

export const TimelineLine = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  margin-top: 1.5rem;
  padding: 0 1rem;

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 2rem;
    right: 2rem;
    height: 3px;
    background: linear-gradient(90deg, #EF4444 0%, #3B82F6 100%);
    transform: translateY(-50%);
    z-index: 1;
  }
`;

export const MilestoneNode = styled.div<{ $completed: boolean }>`
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  width: 120px;

  .dot {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: ${({ $completed }) => ($completed ? '#EF4444' : '#1E293B')};
    border: 3px solid #FFFFFF;
    box-shadow: 0 0 10px rgba(239, 68, 68, 0.6);
    margin-bottom: 8px;
    transition: transform 0.2s ease;
  }

  .year {
    font-size: 0.85rem;
    font-weight: 800;
    color: #EF4444;
  }

  .title {
    font-size: 0.72rem;
    color: #94A3B8;
    margin-top: 2px;
  }
`;
