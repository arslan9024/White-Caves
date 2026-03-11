import styled from 'styled-components';

export const Container = styled.div`
  position: relative;
  display: inline-block;
`;

export const Button = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: ${props => props.theme?.colors?.background?.secondary || '#ffffff'};
  border: 1px solid ${props => props.theme?.colors?.border || '#e0e0e0'};
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  color: ${props => props.theme?.colors?.text?.primary || '#333333'};

  &:hover {
    background: ${props => props.theme?.colors?.background?.tertiary || '#f5f5f5'};
    border-color: ${props => props.theme?.colors?.primary || '#0066cc'};
  }

  @media (max-width: 768px) {
    padding: 6px 10px;
    font-size: 13px;
  }
`;

export const Label = styled.span`
  white-space: nowrap;
`;

export const DropdownIcon = styled.span<{ isOpen: boolean }>`
  display: inline-block;
  font-size: 10px;
  transition: transform 0.2s ease;
  transform: ${props => props.isOpen ? 'rotate(180deg)' : 'rotate(0deg)'};
`;

export const Dropdown = styled.div`
  position: absolute;
  top: calc(100% + 4px);
  right: 0;
  background: ${props => props.theme?.colors?.background?.secondary || '#ffffff'};
  border: 1px solid ${props => props.theme?.colors?.border || '#e0e0e0'};
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  min-width: 240px;
  z-index: 1000;
  overflow: hidden;
  animation: slideDown 0.2s ease;

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-8px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (max-width: 768px) {
    min-width: 200px;
  }
`;

export const DropdownHeader = styled.div`
  padding: 12px 16px;
  border-bottom: 1px solid ${props => props.theme?.colors?.border || '#e0e0e0'};
  background: ${props => props.theme?.colors?.surfaceAlt || '#fafafa'};

  h3 {
    margin: 0;
    font-size: 14px;
    font-weight: 600;
    color: ${props => props.theme?.colors?.text || '#333333'};
  }

  p {
    margin: 4px 0 0 0;
    font-size: 12px;
    color: ${props => props.theme?.colors?.text?.secondary || '#666666'};
  }
`;

export const DropdownList = styled.div`
  max-height: 280px;
  overflow-y: auto;
`;

export const DropdownOption = styled.button<{ isActive: boolean; isDisabled?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 10px 16px;
  background: ${props => props.isActive ? (props.theme?.colors?.primaryLight || '#e6f2ff') : 'none'};
  border: none;
  border-bottom: 1px solid ${props => props.theme?.colors?.borderLight || '#f0f0f0'};
  cursor: ${props => props.isDisabled ? 'not-allowed' : 'pointer'};
  font-size: 13px;
  color: ${props => props.isActive ? (props.theme?.colors?.primary || '#0066cc') : (props.theme?.colors?.text || '#333333')};
  font-weight: ${props => props.isActive ? '500' : '400'};
  transition: all 0.2s ease;
  text-align: left;
  opacity: ${props => props.isDisabled ? 0.5 : 1};

  &:hover:not(:disabled) {
    background: ${props => props.theme?.colors?.hover || '#f5f5f5'};
  }
`;

export const OptionLabel = styled.span`
  flex: 1;
  display: flex;
  align-items: center;
  color: ${props => props.theme?.colors?.text || '#333333'};
  font-size: 0.95rem;
  transition: all 0.3s ease;
`;

export const OptionCheckmark = styled.span`
  color: ${props => props.theme?.colors?.success || '#388E3C'};
  font-weight: bold;
  font-size: 16px;
`;

export const DropdownFooter = styled.div`
  padding: 12px 16px;
  background: ${props => props.theme?.colors?.surfaceAlt || '#fafafa'};
  border-top: 1px solid ${props => props.theme?.colors?.border || '#e0e0e0'};
`;

export const RoleInfo = styled.p`
  margin: 0;
  font-size: 11px;
  color: ${props => props.theme?.colors?.textSecondary || '#666666'};
  font-style: italic;
`;
