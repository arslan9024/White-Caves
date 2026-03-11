import styled from 'styled-components';

export const DashboardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const DashboardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

export const DashboardTitle = styled.h1`
  margin: 0 0 8px 0;
  font-size: 28px;
  font-weight: 700;
  color: var(--color-gray-900, #111827);
`;

export const DashboardSubtitle = styled.p`
  margin: 0;
  font-size: 14px;
  color: var(--color-gray-500, #6b7280);
`;

export const ActionBtn = styled.button<{ $color?: string }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: ${(props) => props.$color || 'var(--color-green-600, #16a34a)'};
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    filter: brightness(0.9);
  }
`;

export const FiltersBar = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  padding: 16px;
  background: white;
  border-radius: 10px;
  border: 1px solid var(--color-gray-200, #e5e7eb);
`;

export const SearchBox = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  padding: 0 12px;
  background: var(--color-gray-50, #f9fafb);
  border: 1px solid var(--color-gray-300, #d1d5db);
  border-radius: 8px;

  &:focus-within {
    background: white;
    border-color: var(--color-purple-400, #c084fc);
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

export const ViewToggle = styled.div`
  display: flex;
  gap: 6px;
  margin-left: auto;
`;

export const ViewBtn = styled.button<{ $active?: boolean }>`
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

  &:hover {
    background: var(--color-purple-600, #9333ea);
    border-color: var(--color-purple-600, #9333ea);
    color: white;
  }
`;

export const ClientsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 16px;
`;

export const ClientCard = styled.div`
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
    border-color: var(--color-green-300, #86efac);
    box-shadow: 0 8px 16px rgba(22, 163, 74, 0.1);
  }
`;

export const ClientAvatar = styled.div`
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

export const ClientName = styled.h3`
  margin: 0 0 4px 0;
  font-size: 15px;
  font-weight: 600;
  color: var(--color-gray-900, #111827);
`;

export const ClientType = styled.p`
  margin: 0 0 10px 0;
  font-size: 12px;
  color: var(--color-gray-500, #6b7280);
  text-transform: uppercase;
`;

export const ClientValue = styled.p`
  margin: 0 0 10px 0;
  font-size: 16px;
  font-weight: 700;
  color: var(--color-green-600, #16a34a);
`;

export const ClientStats = styled.div`
  display: flex;
  width: 100%;
  gap: 10px;
  margin-bottom: 10px;
  font-size: 12px;

  span {
    flex: 1;
    padding: 6px;
    background: var(--color-green-50, #f0fdf4);
    border-radius: 6px;
    color: var(--color-gray-700, #374151);
  }
`;

export const ViewBtnSmall = styled.button`
  padding: 8px 16px;
  background: var(--color-green-600, #16a34a);
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: var(--color-green-700, #15803d);
  }
`;

export const ClientsTableWrapper = styled.div`
  overflow-x: auto;
  background: white;
  border-radius: 10px;
  border: 1px solid var(--color-gray-200, #e5e7eb);
`;

export const ClientsTable = styled.table`
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
