import styled from 'styled-components';

export const AppointmentSchedulerContainer = styled.div`
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin: 20px 0;

  h3 {
    margin: 0 0 20px 0;
    color: var(--text-primary);
  }
`;

export const DatePickerWrapper = styled.div`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin: 10px 0;

  /* react-datepicker overrides */
  .react-datepicker-wrapper {
    width: 100%;
  }

  .react-datepicker {
    border: 1px solid #ddd;
    font-family: inherit;
  }

  .react-datepicker__header {
    background-color: #f0f0f0;
  }

  .react-datepicker__day--selected,
  .react-datepicker__day--keyboard-selected {
    background-color: #e41e3f;
  }

  .react-datepicker__time-list-item--selected {
    background-color: #e41e3f;
  }
`;

export const ScheduleButton = styled.button`
  background: #e41e3f;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  width: 100%;
  font-weight: 600;
  transition: all 0.3s ease;

  &:hover:not(:disabled) {
    background: #c41a35;
    transform: translateY(-2px);
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

export const MonthSelector = styled.div`
  display: flex;
  gap: 10px;
  margin: 15px 0;
  flex-wrap: wrap;
`;

export const TimeSlot = styled.button<{ $available?: boolean }>`
  padding: 8px 16px;
  border: 1px solid ${props => props.$available ? '#ddd' : '#ccc'};
  background: ${props => props.$available ? 'white' : '#f0f0f0'};
  border-radius: 4px;
  cursor: ${props => props.$available ? 'pointer' : 'not-allowed'};
  color: ${props => props.$available ? 'var(--text-primary)' : '#999'};
  transition: all 0.3s ease;

  &:hover ${props => props.$available ? '' : ':disabled'} {
    border-color: #e41e3f;
    background: rgba(228, 30, 63, 0.05);
  }
`;
