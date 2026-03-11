import styled from 'styled-components';

export const Wrapper = styled.div`
  min-height: 100vh;
  padding: 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
  background-size: 400% 400%;
  animation: gradientShift 15s ease infinite;

  @keyframes gradientShift {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }

  @media (max-width: 1024px) {
    padding: 1rem;
  }
`;

export const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 2rem;
  animation: fadeIn 0.5s ease-out;

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

export const Sidebar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  position: sticky;
  top: 2rem;
  height: fit-content;

  @media (max-width: 1024px) {
    position: static;
  }
`;

export const Card = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 2rem;
  text-align: center;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);

  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

export const AvatarContainer = styled.div`
  position: relative;
  display: inline-block;
  margin-bottom: 1.25rem;
`;

export const Avatar = styled.img`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 4px solid #667eea;
  object-fit: cover;
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);

  @media (max-width: 768px) {
    width: 100px;
    height: 100px;
  }
`;

export const AvatarEditBtn = styled.button`
  position: absolute;
  bottom: 0;
  right: 0;
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: white;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.1);
  }

  input {
    display: none;
  }
`;

export const StatusBadge = styled.div`
  position: absolute;
  top: 5px;
  right: 5px;
  background: #10b981;
  color: white;
  font-size: 0.65rem;
  font-weight: 600;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const Name = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a202c;
  margin: 0 0 0.25rem;
`;

export const NameInput = styled.input`
  width: 100%;
  padding: 0.75rem;
  font-size: 1.25rem;
  font-weight: 600;
  text-align: center;
  border: 2px solid #667eea;
  border-radius: 12px;
  margin-bottom: 0.5rem;
  color: #1a202c;

  &:focus {
    outline: none;
    box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.2);
  }
`;

export const Contact = styled.p`
  font-size: 0.9rem;
  color: #64748b;
  margin: 0 0 1.5rem;
`;

export const QuickStats = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  padding: 1.25rem 0;
  border-top: 1px solid #e2e8f0;
  border-bottom: 1px solid #e2e8f0;
  margin-bottom: 1.5rem;
`;

export const QuickStat = styled.div`
  text-align: center;
`;

export const StatValue = styled.span`
  display: block;
  font-size: 1.5rem;
  font-weight: 700;
  color: #667eea;
`;

export const StatName = styled.span`
  font-size: 0.75rem;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const StatDivider = styled.div`
  width: 1px;
  height: 40px;
  background: #e2e8f0;
`;

export const EditActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

export const Button = styled.button<{ variant?: 'primary' | 'secondary' | 'outline' }>`
  width: 100%;
  padding: 0.875rem;
  border: none;
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  ${props => {
    if (props.variant === 'primary') {
      return `
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;

        &:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
        }

        &:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `;
    } else if (props.variant === 'secondary') {
      return `
        background: #f1f5f9;
        color: #64748b;

        &:hover {
          background: #e2e8f0;
        }
      `;
    } else {
      return `
        background: transparent;
        border: 2px solid #667eea;
        color: #667eea;

        &:hover {
          background: rgba(102, 126, 234, 0.1);
        }
      `;
    }
  }}
`;

export const Nav = styled.nav`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 0.75rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
`;

export const NavItem = styled.button<{ isActive?: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1rem;
  border: none;
  background: ${props => props.isActive ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'transparent'};
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: ${props => props.isActive ? '#ffffff' : '#64748b'};
  font-size: 0.9rem;
  font-weight: 500;
  text-align: left;

  &:hover {
    background: ${props => props.isActive ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'rgba(102, 126, 234, 0.1)'};
    color: ${props => props.isActive ? '#ffffff' : '#667eea'};
  }

  ${props => props.isActive && `
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
  `}
`;

export const NavIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const NavLabel = styled.span`
  flex: 1;
  text-align: left;
`;

export const NavCount = styled.span<{ isActive?: boolean }>`
  background: ${props => props.isActive ? 'rgba(255, 255, 255, 0.2)' : 'rgba(102, 126, 234, 0.2)'};
  color: ${props => props.isActive ? '#ffffff' : '#667eea'};
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.25rem 0.5rem;
  border-radius: 8px;
`;

export const LogoutBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  padding: 1rem;
  background: rgba(239, 68, 68, 0.1);
  border: 2px solid rgba(239, 68, 68, 0.3);
  border-radius: 16px;
  color: #ef4444;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #ef4444;
    border-color: #ef4444;
    color: white;
  }
`;

export const Main = styled.main`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 2.5rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  min-height: 600px;

  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

export const ContentSection = styled.div`
  animation: slideIn 0.3s ease-out;

  @keyframes slideIn {
    from { opacity: 0; transform: translateX(20px); }
    to { opacity: 1; transform: translateX(0); }
  }
`;

export const SectionHeader = styled.div`
  margin-bottom: 2rem;

  h2 {
    font-size: 1.75rem;
    font-weight: 700;
    color: #1a202c;
    margin: 0 0 0.5rem;

    @media (max-width: 768px) {
      font-size: 1.35rem;
    }
  }

  p {
    color: #64748b;
    margin: 0;
  }
`;

export const InfoCardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  margin-bottom: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const InfoCard = styled.div<{ fullWidth?: boolean }>`
  background: #f8fafc;
  border-radius: 16px;
  padding: 1.5rem;
  border: 1px solid #e2e8f0;

  ${props => props.fullWidth && `
    grid-column: 1 / -1;
  `}
`;
