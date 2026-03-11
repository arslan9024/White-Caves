import styled from 'styled-components';

export const Container = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 24px;
  max-width: 600px;
  margin: 0 auto;

  @media (max-width: 600px) {
    padding: 1rem;
  }
`;

export const Header = styled.div`
  text-align: center;
  margin-bottom: 20px;

  h3 {
    font-size: 1.25rem;
    color: white;
    margin-bottom: 8px;
    margin: 0 0 8px;
  }

  p {
    color: rgba(255, 255, 255, 0.7);
    font-size: 0.875rem;
    margin: 0;
  }

  strong {
    color: #d4af37;
  }
`;

export const CanvasWrapper = styled.div`
  position: relative;
  background: white;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);

  @media (max-width: 600px) {
    padding: 12px;
    margin-bottom: 12px;
  }
`;

export const Canvas = styled.canvas`
  width: 100% !important;
  height: 200px !important;
  border: 2px dashed rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  cursor: crosshair;
  transition: border-color 0.2s ease;

  &:hover {
    border-color: rgba(0, 0, 0, 0.4);
  }

  @media (max-width: 600px) {
    height: 150px !important;
  }
`;

export const SignatureLine = styled.div`
  position: absolute;
  bottom: 60px;
  left: 40px;
  right: 40px;
  border-top: 1px solid rgba(0, 0, 0, 0.3);
  text-align: center;

  span {
    position: relative;
    top: 5px;
    background: white;
    padding: 0 10px;
    color: rgba(0, 0, 0, 0.4);
    font-size: 0.75rem;
  }

  @media (max-width: 600px) {
    bottom: 45px;
    left: 20px;
    right: 20px;
  }
`;

export const Actions = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;

  @media (max-width: 600px) {
    gap: 8px;
  }
`;

export const Button = styled.button<{ variant?: 'primary' | 'secondary' | 'danger' }>`
  padding: 12px 24px;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  font-size: 0.95rem;

  ${props => {
    switch (props.variant) {
      case 'primary':
        return `
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;

          &:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
          }

          &:disabled {
            opacity: 0.5;
            cursor: not-allowed;
          }
        `;
      case 'danger':
        return `
          background: #ef4444;
          color: white;

          &:hover {
            background: #dc2626;
            transform: translateY(-2px);
          }
        `;
      default:
        return `
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: white;

          &:hover {
            background: rgba(255, 255, 255, 0.15);
          }
        `;
    }
  }}

  @media (max-width: 600px) {
    padding: 10px 16px;
    font-size: 0.85rem;
    flex: 1;
    min-width: 100px;
  }
`;

export const Preview = styled.div`
  background: white;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 20px;
  min-height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(0, 0, 0, 0.1);

  img {
    max-width: 100%;
    max-height: 120px;
    border-radius: 8px;
  }

  p {
    color: rgba(0, 0, 0, 0.4);
    font-style: italic;
    margin: 0;
  }

  @media (max-width: 600px) {
    padding: 12px;
    min-height: 100px;
  }
`;

export const Message = styled.div<{ type?: 'success' | 'error' | 'info' }>`
  padding: 12px 16px;
  border-radius: 8px;
  margin: 12px 0 0;
  font-size: 0.9rem;
  font-weight: 500;
  animation: slideDown 0.3s ease;

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  ${props => {
    switch (props.type) {
      case 'success':
        return `
          background: #d4edda;
          color: #155724;
          border: 1px solid #c3e6cb;
        `;
      case 'error':
        return `
          background: #f8d7da;
          color: #721c24;
          border: 1px solid #f5c6cb;
        `;
      default:
        return `
          background: #d1ecf1;
          color: #0c5460;
          border: 1px solid #bee5eb;
        `;
    }
  }}
`;

export const Instructions = styled.div`
  background: rgba(255, 255, 255, 0.08);
  border-left: 3px solid #d4af37;
  padding: 12px 16px;
  border-radius: 4px;
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.9);
  margin: 0 0 16px;

  ul {
    margin: 0;
    padding-left: 20px;

    li {
      margin: 4px 0;
    }
  }

  strong {
    color: #d4af37;
  }
`;
