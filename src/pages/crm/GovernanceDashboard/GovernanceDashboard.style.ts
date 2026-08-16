import styled from 'styled-components';

export const Container = styled.div`
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
`;

export const Title = styled.h1`
  color: #1E293B;
  font-size: 24px;
  margin-bottom: 24px;
  font-weight: 800;
  border-bottom: 2px solid #EF4444;
  padding-bottom: 12px;
  display: inline-block;
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
`;

export const Card = styled.div<{ $status: string }>`
  background: #FFFFFF;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  border-top: 4px solid ${({ $status }) => 
    $status === 'EXPIRED' ? '#991B1B' : 
    $status === 'WARNING_30' ? '#EF4444' : 
    $status === 'WARNING_90' ? '#F59E0B' : '#10B981'};
`;

export const CardTitle = styled.h3`
  font-size: 18px;
  color: #1E293B;
  margin: 0 0 16px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const StatusBadge = styled.span<{ $status: string }>`
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 4px;
  font-weight: 700;
  background: ${({ $status }) => 
    $status === 'EXPIRED' ? '#FEE2E2' : 
    $status === 'WARNING_30' ? '#FEF2F2' : 
    $status === 'WARNING_90' ? '#FEF3C7' : '#D1FAE5'};
  color: ${({ $status }) => 
    $status === 'EXPIRED' ? '#991B1B' : 
    $status === 'WARNING_30' ? '#EF4444' : 
    $status === 'WARNING_90' ? '#D97706' : '#059669'};
`;

export const DetailRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  font-size: 14px;
  color: #475569;
`;
