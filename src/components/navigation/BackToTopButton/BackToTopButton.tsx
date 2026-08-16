/**
 * BackToTopButton — Wave 61 FE-GOAL-056
 * Smooth scrolling floating back-to-top button with 400px scroll threshold listener
 * White Caves Real Estate LLC — Navigation Suite
 */
import React, { FC, useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:scale(0.8)}to{opacity:1;transform:scale(1)}`;

const FloatingBtn = styled.button`
  position: fixed;
  bottom: 28px;
  right: 28px;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: #EF4444;
  color: #FFF;
  border: 2px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 24px rgba(239, 68, 68, 0.4);
  font-size: 1.1rem;
  font-weight: 900;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 999;
  transition: all 0.2s ease;
  animation: ${fadeIn} 0.3s ease;
  &:hover { background: #DC2626; transform: translateY(-3px); }
`;

export const BackToTopButton: FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) setVisible(true);
      else setVisible(false);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!visible) return null;

  return (
    <FloatingBtn 
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      data-testid="back-to-top-button"
      aria-label="Back to top"
    >
      ▲
    </FloatingBtn>
  );
};

export default BackToTopButton;
