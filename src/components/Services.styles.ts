import styled from 'styled-components';

export const ServicesSection = styled.div`
  padding: 4rem 2rem;
  background: #f9f9f9;
  
  /* Dark theme support */
  [data-theme='dark'] & {
    background: #1a1a2e;
  }
  
  @media (max-width: 768px) {
    padding: 2.5rem 1rem;
  }
`;

export const SectionTitle = styled.h2`
  text-align: center;
  margin-bottom: 3rem;
  color: #333;
  font-size: 2.5rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  
  /* Dark theme support */
  [data-theme='dark'] & {
    color: #ffffff;
  }
  
  @media (max-width: 768px) {
    font-size: 1.875rem;
    margin-bottom: 2rem;
  }
`;

export const ServicesContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

export const ServiceCard = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid transparent;
  
  /* Dark theme support */
  [data-theme='dark'] & {
    background: #2a2a3e;
    box-shadow: 0 2px 15px rgba(0, 0, 0, 0.3);
    border-color: rgba(255, 255, 255, 0.05);
  }
  
  &:hover {
    transform: translateY(-5px) translateZ(0);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
    
    [data-theme='dark'] & {
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.4);
    }
  }
  
  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

export const ServiceIcon = styled.i`
  font-size: 2.5rem;
  color: #e41e3f;
  margin-bottom: 1rem;
  display: block;
  
  /* Dark theme support */
  [data-theme='dark'] & {
    color: #ff6b6b;
    opacity: 0.9;
  }
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

export const ServiceTitle = styled.h3`
  color: #333;
  margin-bottom: 1rem;
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: -0.01em;
  
  /* Dark theme support */
  [data-theme='dark'] & {
    color: #ffffff;
  }
`;

export const ServiceDescription = styled.p`
  color: #666;
  margin-bottom: 1.5rem;
  font-size: 0.95rem;
  line-height: 1.6;
  
  /* Dark theme support */
  [data-theme='dark'] & {
    color: #b0b0b0;
  }
`;

export const ServiceList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

export const ServiceListItem = styled.li`
  padding: 0.5rem 0;
  color: #666;
  position: relative;
  padding-left: 1.75rem;
  font-size: 0.9375rem;
  line-height: 1.5;
  transition: all 0.2s ease;
  
  /* Dark theme support */
  [data-theme='dark'] & {
    color: #b0b0b0;
  }
  
  &:before {
    content: "✓";
    color: #e41e3f;
    position: absolute;
    left: 0;
    font-weight: 600;
    font-size: 1.1rem;
    
    /* Dark theme support */
    [data-theme='dark'] &  {
      color: #ff6b6b;
    }
  }
  
  &:hover {
    padding-left: 2rem;
    color: #e41e3f;
    
    [data-theme='dark'] & {
      color: #ff6b6b;
    }
  }
  
  @media (max-width: 768px) {
    font-size: 0.875rem;
    padding-left: 1.5rem;
  }
`;
