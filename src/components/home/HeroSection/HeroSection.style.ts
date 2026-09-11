import styled from 'styled-components';

export const HeroWrapper = styled.div<{ $theme?: 'dark' | 'light' }>`
  position: relative;
  background: ${({ $theme }) => $theme === 'light' ? 'linear-gradient(135deg, #F8FAFC 0%, #E2E8F0 100%)' : 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)'};
  color: ${({ $theme }) => $theme === 'light' ? '#1E293B' : '#FFFFFF'};
  padding: 5rem 1.5rem 4rem;
  border-bottom: 2px solid #EF4444;
  text-align: center;
  overflow: hidden;
  transition: background 0.3s ease, color 0.3s ease;
`;

export const DecorativeOrb = styled.div`
  position: absolute;
  top: -100px;
  left: 50%;
  transform: translateX(-50%);
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(239, 68, 68, 0.15) 0%, rgba(0, 0, 0, 0) 70%);
  pointer-events: none;
`;

export const HeroContent = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
`;

export const BadgeTag = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 16px;
  border-radius: 999px;
  background: rgba(239, 68, 68, 0.15);
  border: 1px solid rgba(239, 68, 68, 0.4);
  color: #EF4444;
  font-size: 0.82rem;
  font-weight: 800;
  margin-bottom: 1.5rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

export const HeroTitle = styled.h1`
  font-size: 2.8rem;
  font-weight: 900;
  margin: 0 0 1rem;
  line-height: 1.2;

  span {
    color: #EF4444;
  }
`;

export const HeroSubtitle = styled.p<{ $theme?: 'dark' | 'light' }>`
  font-size: 1.1rem;
  color: ${({ $theme }) => $theme === 'light' ? '#475569' : '#94A3B8'};
  max-width: 750px;
  margin: 0 auto 2.5rem;
  transition: color 0.3s ease;
`;

export const SearchFormWrapper = styled.div`
  position: relative;
  max-width: 800px;
  margin: 0 auto 2rem;
`;

export const SearchForm = styled.form`
  display: flex;
  align-items: center;
  gap: 10px;
  background: #FFFFFF;
  border-radius: 999px;
  padding: 8px 12px 8px 12px;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.3);
  width: 100%;
  position: relative;
  z-index: 20;

  input {
    flex: 1;
    border: none;
    outline: none;
    font-size: 1rem;
    color: #1E293B;
    background: transparent;
  }

  button[type="submit"] {
    background: linear-gradient(135deg, #EF4444 0%, #B91C1C 100%);
    color: #FFFFFF;
    border: none;
    border-radius: 999px;
    padding: 12px 28px;
    font-weight: 800;
    font-size: 0.95rem;
    cursor: pointer;
    box-shadow: 0 4px 16px rgba(239, 68, 68, 0.4);
    transition: transform 0.2s ease;

    &:hover {
      transform: scale(1.02);
    }

    @media (prefers-reduced-motion: reduce) {
      transition: none;
      &:hover {
        transform: none;
      }
    }
  }
`;

export const FilterSelect = styled.select`
  appearance: none;
  background: #F1F5F9;
  border: none;
  border-radius: 999px;
  padding: 8px 16px;
  font-size: 0.95rem;
  font-weight: 700;
  color: #1E293B;
  cursor: pointer;
  outline: none;
  margin-right: 8px;
`;

export const AutocompleteDropdown = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: #FFFFFF;
  border-radius: 16px;
  margin-top: 8px;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  z-index: 15;
  text-align: left;
  
  ul {
    list-style: none;
    margin: 0;
    padding: 8px 0;
    
    li {
      padding: 12px 24px;
      font-size: 0.95rem;
      color: #334155;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 12px;
      
      &:hover {
        background: #F8FAFC;
        color: #EF4444;
      }
    }
  }
`;

export const CommunityPillsWrapper = styled.div<{ $theme?: 'dark' | 'light' }>`
  display: flex;
  justify-content: center;
  gap: 8px;
  flex-wrap: wrap;

  .label {
    font-size: 0.85rem;
    color: ${({ $theme }) => $theme === 'light' ? '#475569' : '#94A3B8'};
    align-self: center;
    margin-right: 6px;
    transition: color 0.3s ease;
  }
`;

export const CommunityPill = styled.button<{ $active: boolean; $theme?: 'dark' | 'light' }>`
  background: ${({ $active, $theme }) => $active ? '#EF4444' : ($theme === 'light' ? 'rgba(0, 0, 0, 0.05)' : 'rgba(255, 255, 255, 0.08)')};
  color: ${({ $active, $theme }) => $active ? '#FFFFFF' : ($theme === 'light' ? '#1E293B' : '#FFFFFF')};
  border: 1px solid ${({ $active, $theme }) => $active ? '#EF4444' : ($theme === 'light' ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.15)')};
  border-radius: 999px;
  padding: 6px 14px;
  font-size: 0.8rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #EF4444;
    border-color: #EF4444;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

export const TrustBadgesWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  margin-top: 3rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  flex-wrap: wrap;
`;

export const TrustBadge = styled.div<{ $theme?: 'dark' | 'light' }>`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.85rem;
  font-weight: 600;
  color: ${({ $theme }) => $theme === 'light' ? '#475569' : '#94A3B8'};
  
  svg {
    opacity: 0.8;
  }
`;

export const FloatingPropertyBadge = styled.div<{ $theme?: 'dark' | 'light' }>`
  position: absolute;
  top: 15%;
  left: 5%;
  background: ${({ $theme }) => $theme === 'light' ? 'rgba(255, 255, 255, 0.9)' : 'rgba(30, 41, 59, 0.9)'};
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  padding: 12px 20px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  display: flex;
  flex-direction: column;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  z-index: 10;
  animation: float 6s ease-in-out infinite;

  @keyframes float {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
    100% { transform: translateY(0px); }
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }

  .count {
    font-size: 1.25rem;
    font-weight: 800;
    color: #EF4444;
    line-height: 1.2;
  }

  .label {
    font-size: 0.75rem;
    font-weight: 600;
    color: ${({ $theme }) => $theme === 'light' ? '#64748B' : '#94A3B8'};
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  @media (max-width: 768px) {
    display: none;
  }
`;
