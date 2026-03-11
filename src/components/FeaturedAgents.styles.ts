import styled from 'styled-components';

export const StyledFeaturedAgentsSection = styled.section`
  padding: 4rem 5%;
  background: #f9f9f9;

  [data-theme='dark'] & {
    background: #1a1a2e;
  }
`;

export const StyledAgentsTitle = styled.h2`
  text-align: center;
  margin-bottom: 3rem;
  font-size: 2.5rem;
  color: #333;

  [data-theme='dark'] & {
    color: #f7fafc;
  }
`;

export const StyledAgentsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

export const StyledAgentCard = styled.div`
  background: white;
  border-radius: 10px;
  padding: 2rem;
  text-align: center;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;

  [data-theme='dark'] & {
    background: #2d3748;
    box-shadow: 0 2px 15px rgba(0, 0, 0, 0.3);
  }

  &:hover {
    transform: translateY(-5px);
  }
`;

export const StyledAgentPhoto = styled.img`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  margin-bottom: 1rem;
  object-fit: cover;
`;

export const StyledAgentName = styled.h3`
  color: #333;
  margin-bottom: 0.5rem;

  [data-theme='dark'] & {
    color: #e2e8f0;
  }
`;

export const StyledSpecialization = styled.p`
  color: #666;
  font-style: italic;
  margin-bottom: 0.5rem;

  [data-theme='dark'] & {
    color: #cbd5e0;
  }
`;

export const StyledExperience = styled.p`
  color: #888;
  font-size: 0.9rem;
  margin-bottom: 1rem;

  [data-theme='dark'] & {
    color: #a0aec0;
  }
`;

export const StyledLanguagesContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
`;

export const StyledLanguageTag = styled.span`
  background: #f0f0f0;
  padding: 0.3rem 0.8rem;
  border-radius: 15px;
  font-size: 0.8rem;
  color: #666;

  [data-theme='dark'] & {
    background: #4a5568;
    color: #cbd5e0;
  }
`;

export const StyledContactAgentButton = styled.button`
  background: #e41e3f;
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s;
  font-weight: 600;
  width: 100%;

  &:hover {
    background: #c41835;
  }

  [data-theme='dark'] & {
    &:hover {
      background: #e41e3f;
    }
  }
`;
