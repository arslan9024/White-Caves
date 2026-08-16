import styled from 'styled-components';

export const ModalOverlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(15, 23, 42, 0.85);
  backdrop-filter: blur(12px);
  z-index: 2500;
  display: ${({ $isOpen }) => ($isOpen ? 'flex' : 'none')};
  align-items: center;
  justify-content: center;
`;

export const ModalCard = styled.div`
  width: 440px;
  background: #1E293B;
  border: 2px solid #EF4444;
  border-radius: 16px;
  padding: 1.5rem;
  color: #FFFFFF;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6);
`;

export const CropPreviewArea = styled.div`
  width: 140px;
  height: 140px;
  border-radius: 50%;
  border: 3.5px solid #EF4444;
  margin: 1.25rem auto;
  overflow: hidden;
  background: #0F172A;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 20px rgba(239, 68, 68, 0.5);
`;
