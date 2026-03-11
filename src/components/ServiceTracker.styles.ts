import styled from 'styled-components';

export const Container = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

export const ServiceForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
  background: ${props => props.theme?.colors?.bgPrimary || '#ffffff'};
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

export const FormControl = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const Label = styled.label`
  font-weight: 600;
  font-size: 0.9rem;
  color: ${props => props.theme?.colors?.text || '#333333'};
`;

export const Select = styled.select`
  padding: 0.8rem;
  border: 1px solid ${props => props.theme?.colors?.border || '#ddd'};
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.theme?.colors?.primary || '#e41e3f'};
    box-shadow: 0 0 0 3px ${props => props.theme?.colors?.primary || 'rgba(228, 30, 63, 0.1)'};
  }
`;

export const Textarea = styled.textarea`
  padding: 0.8rem;
  border: 1px solid ${props => props.theme?.colors?.border || '#ddd'};
  border-radius: 4px;
  font-size: 1rem;
  font-family: inherit;
  min-height: 100px;
  resize: vertical;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.theme?.colors?.primary || '#e41e3f'};
    box-shadow: 0 0 0 3px ${props => props.theme?.colors?.primary || 'rgba(228, 30, 63, 0.1)'};
  }
`;

export const Button = styled.button`
  padding: 1rem;
  background: ${props => props.theme?.colors?.danger || '#e41e3f'};
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme?.colors?.dangerDark || '#c41e3f'};
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const ServicesList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const ServiceCard = styled.div`
  background: ${props => props.theme?.colors?.bgPrimary || '#ffffff'};
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;

  &:hover {
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    transform: translateY(-2px);
  }
`;

export const ServiceHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
  gap: 1rem;
`;

export const ServiceType = styled.span<{ type: 'buyer' | 'seller' | 'landlord' | 'tenant' }>`
  padding: 0.3rem 0.8rem;
  border-radius: 15px;
  font-size: 0.9rem;
  font-weight: 600;

  ${props => {
    switch (props.type) {
      case 'buyer':
        return `background: #e3f2fd; color: #1976d2;`;
      case 'seller':
        return `background: #f3e5f5; color: #7b1fa2;`;
      case 'landlord':
        return `background: #fff3e0; color: #f57c00;`;
      case 'tenant':
        return `background: #f0f4c3; color: #827717;`;
      default:
        return `background: #f5f5f5; color: #666;`;
    }
  }}
`;

export const ServiceStatus = styled.span<{ status: 'pending' | 'active' | 'completed' | 'cancelled' }>`
  padding: 0.3rem 0.8rem;
  border-radius: 15px;
  font-size: 0.9rem;
  font-weight: 600;

  ${props => {
    switch (props.status) {
      case 'active':
        return `background: #4caf50; color: white;`;
      case 'pending':
        return `background: #ff9800; color: white;`;
      case 'completed':
        return `background: #2196f3; color: white;`;
      case 'cancelled':
        return `background: #f44336; color: white;`;
      default:
        return `background: #f5f5f5; color: #666;`;
    }
  }}
`;

export const ServiceDescription = styled.p`
  margin: 1rem 0;
  color: ${props => props.theme?.colors?.textSecondary || '#666'};
  line-height: 1.5;
`;

export const ServiceMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid ${props => props.theme?.colors?.border || '#eee'};
  font-size: 0.85rem;
  color: ${props => props.theme?.colors?.textSecondary || '#999'};
`;

export const ServiceActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

export const ActionButton = styled.button`
  padding: 0.4rem 0.8rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 600;
  transition: all 0.2s ease;

  &:first-child {
    background: ${props => props.theme?.colors?.primary || '#0066cc'};
    color: white;

    &:hover {
      opacity: 0.9;
    }
  }

  &:last-child {
    background: ${props => props.theme?.colors?.danger || '#f44336'};
    color: white;

    &:hover {
      opacity: 0.9;
    }
  }
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 1rem;
  color: ${props => props.theme?.colors?.textSecondary || '#999'};

  p {
    margin: 0;
    font-size: 1.1rem;
  }
`;
