import styled from 'styled-components';
import { colors } from '../styles/theme/colors';
import { transitions } from '../styles/theme/transitions';

export const PropertyDetailContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;

  [data-theme='dark'] & {
  }
`;

export const PropertyHeader = styled.div`
  margin-bottom: 2rem;

  h1 {
    margin: 0 0 1rem 0;
    color: var(--text-primary);
    font-size: 2rem;
    font-weight: 700;

    [data-theme='dark'] & {
      color: white;
    }
  }

  [data-theme='dark'] & {
  }
`;

export const PropertyTypePrice = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
  gap: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }

  [data-theme='dark'] & {
  }
`;

export const ListingType = styled.span`
  background: #e41e3f;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-weight: 600;
  font-size: 0.875rem;

  [data-theme='dark'] & {
    background: ${colors.primary};
  }
`;

export const Price = styled.span`
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--text-primary);

  [data-theme='dark'] & {
    color: white;
  }
`;

export const PropertyImages = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;

  img {
    width: 100%;
    height: 250px;
    object-fit: cover;
    border-radius: 8px;
    background: var(--bg-secondary);
    transition: transform 0.3s ease;

    &:hover {
      transform: scale(1.02);
    }
  }

  [data-theme='dark'] & {
    img {
      background: var(--bg-secondary, #2a2a3e);
    }
  }
`;

export const PropertyDescription = styled.div`
  margin-bottom: 2rem;

  h2 {
    color: var(--text-primary);
    margin: 0 0 1rem 0;
    font-size: 1.5rem;
    font-weight: 700;

    [data-theme='dark'] & {
      color: white;
    }
  }

  p {
    color: var(--text-secondary);
    line-height: 1.6;

    [data-theme='dark'] & {
      color: var(--text-secondary, #a0a0a0);
    }
  }

  [data-theme='dark'] & {
  }
`;

export const PropertyInfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;

  [data-theme='dark'] & {
  }
`;

export const InfoSection = styled.div`
  background: var(--bg-secondary);
  padding: 1.5rem;
  border-radius: 8px;
  border: 1px solid var(--border-color);

  h3 {
    margin-bottom: 1rem;
    color: var(--text-primary);
    font-size: 1.125rem;
    font-weight: 600;

    [data-theme='dark'] & {
      color: white;
    }
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  li {
    margin-bottom: 0.5rem;
    color: var(--text-secondary);
    line-height: 1.5;

    strong {
      color: var(--text-primary);

      [data-theme='dark'] & {
        color: white;
      }
    }

    [data-theme='dark'] & {
      color: var(--text-secondary, #a0a0a0);
    }
  }

  [data-theme='dark'] & {
    background: var(--bg-secondary, #2a2a3e);
    border-color: var(--border-color, #3a3a5a);
  }
`;

export const PropertyAmenities = styled.div`
  margin: 2rem 0;

  h3 {
    color: var(--text-primary);
    margin: 0 0 1rem 0;
    font-size: 1.25rem;
    font-weight: 700;

    [data-theme='dark'] & {
      color: white;
    }
  }

  [data-theme='dark'] & {
  }
`;

export const AmenitiesGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;

  [data-theme='dark'] & {
  }
`;

export const AmenityTag = styled.span`
  background: var(--bg-secondary);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  color: var(--text-secondary);
  border: 1px solid var(--border-color);
  transition: ${transitions.hover};

  &:hover {
    background: var(--primary);
    color: white;
    border-color: var(--primary);
  }

  [data-theme='dark'] & {
    background: var(--bg-secondary, #2a2a3e);
    color: var(--text-secondary, #a0a0a0);
    border-color: var(--border-color, #3a3a5a);

    &:hover {
      background: var(--primary, ${colors.primary});
      color: white;
      border-color: var(--primary, ${colors.primary});
    }
  }
`;

export const PropertyLocation = styled.div`
  margin-top: 2rem;

  h3 {
    color: var(--text-primary);
    margin: 0 0 1rem 0;
    font-size: 1.25rem;
    font-weight: 700;

    [data-theme='dark'] & {
      color: white;
    }
  }

  .map {
    height: 400px;
    border-radius: 8px;
    overflow: hidden;
    border: 1px solid var(--border-color);

    [data-theme='dark'] & {
      border-color: var(--border-color, #3a3a5a);
    }
  }

  [data-theme='dark'] & {
  }
`;
