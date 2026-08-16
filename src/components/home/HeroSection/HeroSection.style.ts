import styled from 'styled-components';

export const HeroWrapper = styled.div`
  position: relative;
  background: linear-gradient(135deg, #0F172A 0%, #1E293B 100%);
  color: #FFFFFF;
  padding: 5rem 1.5rem 4rem;
  border-bottom: 2px solid #EF4444;
  text-align: center;
  overflow: hidden;
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

export const HeroSubtitle = styled.p`
  font-size: 1.1rem;
  color: #94A3B8;
  max-width: 750px;
  margin: 0 auto 2.5rem;
`;

export const SearchForm = styled.form`
  display: flex;
  align-items: center;
  gap: 10px;
  background: #FFFFFF;
  border-radius: 999px;
  padding: 8px 12px 8px 24px;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.3);
  max-width: 800px;
  margin: 0 auto 2rem;

  input {
    flex: 1;
    border: none;
    outline: none;
    font-size: 1rem;
    color: #1E293B;
    background: transparent;
  }

  button {
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
  }
`;

export const CommunityPillsWrapper = styled.div`
  display: flex;
  justify-content: center;
  gap: 8px;
  flex-wrap: wrap;

  .label {
    font-size: 0.85rem;
    color: #94A3B8;
    align-self: center;
    margin-right: 6px;
  }
`;

export const CommunityPill = styled.button<{ $active: boolean }>`
  background: ${({ $active }) => ($active ? '#EF4444' : 'rgba(255, 255, 255, 0.08)')};
  color: #FFFFFF;
  border: 1px solid ${({ $active }) => ($active ? '#EF4444' : 'rgba(255, 255, 255, 0.15)')};
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
`;
