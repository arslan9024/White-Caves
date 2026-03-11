import styled from 'styled-components';

export const AgentsDashboardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const AgentsDashboardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

export const AgentsDashboardTitle = styled.h1`
  margin: 0 0 8px 0;
  font-size: 28px;
  font-weight: 700;
  color: var(--color-gray-900, #111827);
`;

export const AgentsDashboardSubtitle = styled.p`
  margin: 0;
  font-size: 14px;
  color: var(--color-gray-500, #6b7280);
`;

export const AgentsActionBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: var(--color-purple-600, #9333ea);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: var(--color-purple-700, #7e22ce);
  }
`;

export const AgentsFiltersBar = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  padding: 16px;
  background: white;
  border-radius: 10px;
  border: 1px solid var(--color-gray-200, #e5e7eb);
`;

export const AgentsSearchBox = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  padding: 0 12px;
  background: var(--color-gray-50, #f9fafb);
  border: 1px solid var(--color-gray-300, #d1d5db);
  border-radius: 8px;
  color: var(--color-gray-500, #6b7280);

  &:focus-within {
    background: white;
    border-color: var(--color-purple-400, #c084fc);
    color: var(--color-purple-600, #9333ea);
  }

  input {
    flex: 1;
    border: none;
    background: transparent;
    padding: 8px 0;
    font-size: 14px;
    color: var(--color-gray-900, #111827);

    &::placeholder {
      color: var(--color-gray-400, #9ca3af);
    }
  }
`;

export const AgentsViewToggle = styled.div`
  display: flex;
  gap: 6px;
  margin-left: auto;
`;

export const AgentsViewBtn = styled.button<{ $active?: boolean }>`
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${(props) =>
    props.$active
      ? 'var(--color-purple-600, #9333ea)'
      : 'var(--color-gray-100, #f3f4f6)'};
  border: 1px solid
    ${(props) =>
      props.$active
        ? 'var(--color-purple-600, #9333ea)'
        : 'var(--color-gray-300, #d1d5db)'};
  color: ${(props) => (props.$active ? 'white' : 'var(--color-gray-600, #4b5563)')};
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover,
  &.active {
    background: var(--color-purple-600, #9333ea);
    border-color: var(--color-purple-600, #9333ea);
    color: white;
  }
`;

export const AgentsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 16px;
`;

export const AgentCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 20px;
  background: white;
  border-radius: 10px;
  border: 1px solid var(--color-gray-200, #e5e7eb);
  transition: all 0.3s ease;

  &:hover {
    border-color: var(--color-purple-300, #e9d5ff);
    box-shadow: 0 8px 16px rgba(147, 51, 234, 0.1);
  }
`;

export const AgentAvatar = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 20px;
  margin-bottom: 12px;
`;

export const AgentName = styled.h3`
  margin: 0 0 4px 0;
  font-size: 15px;
  font-weight: 600;
  color: var(--color-gray-900, #111827);
`;

export const AgentDepartment = styled.p`
  margin: 0 0 10px 0;
  font-size: 12px;
  color: var(--color-gray-500, #6b7280);
  text-transform: uppercase;
`;

export const AgentStats = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  width: 100%;
  margin-bottom: 10px;
`;

export const Stat = styled.div`
  display: flex;
  flex-direction: column;
  padding: 8px;
  background: var(--color-purple-50, #faf5ff);
  border-radius: 6px;
`;

export const StatValue = styled.span`
  font-size: 18px;
  font-weight: 700;
  color: var(--color-purple-600, #9333ea);
`;

export const StatLabel = styled.span`
  font-size: 10px;
  color: var(--color-gray-500, #6b7280);
  text-transform: uppercase;
  margin-top: 2px;
`;

export const AgentCommission = styled.p`
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 700;
  color: var(--color-green-600, #16a34a);
`;

export const AgentStatus = styled.span<{ $status?: string }>`
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 600;
  background: ${(props) =>
    props.$status === 'online'
      ? 'rgba(34, 197, 94, 0.1)'
      : 'rgba(107, 114, 128, 0.1)'};
  color: ${(props) =>
    props.$status === 'online' ? '#22c55e' : '#6b7280'};
`;

export const AgentsTableWrapper = styled.div`
  overflow-x: auto;
  background: white;
  border-radius: 10px;
  border: 1px solid var(--color-gray-200, #e5e7eb);
`;

export const AgentsTable = styled.table`
  width: 100%;
  border-collapse: collapse;

  thead {
    background: var(--color-gray-50, #f9fafb);
    border-bottom: 1px solid var(--color-gray-200, #e5e7eb);
  }

  th {
    padding: 12px 16px;
    text-align: left;
    font-size: 12px;
    font-weight: 600;
    color: var(--color-gray-600, #4b5563);
    text-transform: uppercase;
  }

  td {
    padding: 12px 16px;
    border-top: 1px solid var(--color-gray-200, #e5e7eb);
    font-size: 14px;
    color: var(--color-gray-900, #111827);
  }

  tbody tr:hover {
    background: var(--color-gray-50, #f9fafb);
  }
`;
