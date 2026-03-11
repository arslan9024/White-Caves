import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const FullScreenModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--bg-overlay, rgba(0, 0, 0, 0.8));
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${fadeIn} 0.2s ease;
`;

export const FullScreenModalContainer = styled.div`
  width: 95vw;
  height: 95vh;
  max-width: 1600px;
  background: var(--bg-primary, #ffffff);
  border-radius: 24px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: ${slideUp} 0.3s ease;

  [data-theme="dark"] & {
    background: var(--bg-primary, #0f172a);
  }

  @media (max-width: 768px) {
    width: 100vw;
    height: 100vh;
    border-radius: 0;
  }
`;

export const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid var(--border-color, #e5e7eb);
  background: var(--bg-secondary, #f9fafb);

  [data-theme="dark"] & {
    background: var(--bg-secondary, #1e293b);
    border-color: var(--border-color-dark, #374151);
  }

  @media (max-width: 768px) {
    padding: 16px;
  }
`;

export const ModalTitleSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const ModalTitle = styled.h2`
  font-size: 24px;
  font-weight: 700;
  color: var(--text-primary, #1f2937);
  margin: 0;

  [data-theme="dark"] & {
    color: var(--text-primary-dark, #f9fafb);
  }

  @media (max-width: 768px) {
    font-size: 18px;
  }
`;

export const ModalSubtitle = styled.p`
  font-size: 14px;
  color: var(--text-secondary, #6b7280);
  margin: 0;

  [data-theme="dark"] & {
    color: var(--text-secondary-dark, #cbd5e1);
  }
`;

export const ModalHeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const HeaderActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: var(--bg-card, #ffffff);
  border: 1px solid var(--border-color, #e5e7eb);
  border-radius: 10px;
  color: var(--text-secondary, #6b7280);
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;

  &:hover {
    background: var(--bg-hover, #f3f4f6);
    color: var(--primary-color, #dc2626);
    border-color: var(--primary-color, #dc2626);
  }

  [data-theme="dark"] & {
    background: var(--bg-card, #1e293b);
    border-color: var(--border-color-dark, #374151);

    &:hover {
      background: var(--bg-hover, #334155);
    }
  }
`;

export const CloseButton = styled(HeaderActionButton)`
  margin-left: 8px;

  &:hover {
    background: var(--error-bg, #fee2e2);
    color: var(--error-color, #ef4444);
    border-color: var(--error-color, #ef4444);
  }
`;

export const ModalBody = styled.div<{ $hasSidebar?: boolean }>`
  flex: 1;
  display: grid;
  grid-template-columns: ${props => props.$hasSidebar ? '1fr 380px' : '1fr'};
  overflow: hidden;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

export const ModalGallery = styled.div`
  display: flex;
  flex-direction: column;
  border-bottom: 1px solid var(--border-color, #e5e7eb);

  [data-theme="dark"] & {
    border-color: var(--border-color-dark, #374151);
  }
`;

export const GalleryMain = styled.div`
  position: relative;
  height: 400px;
  background: var(--bg-tertiary, #f3f4f6);
  display: flex;
  align-items: center;
  justify-content: center;

  [data-theme="dark"] & {
    background: var(--bg-tertiary, #334155);
  }

  @media (max-width: 768px) {
    height: 250px;
  }
`;

export const GalleryMainImage = styled.img`
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
`;

export const GalleryNav = styled.button<{ $direction: 'prev' | 'next' }>`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  ${props => props.$direction === 'prev' ? 'left: 16px;' : 'right: 16px;'}
  width: 48px;
  height: 48px;
  background: var(--bg-card, #ffffff);
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-primary, #1f2937);
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: all 0.2s ease;

  &:hover {
    background: var(--primary-color, #dc2626);
    color: white;
  }

  [data-theme="dark"] & {
    background: var(--bg-card, #1e293b);
    color: var(--text-primary-dark, #f9fafb);

    &:hover {
      background: var(--primary-color, #dc2626);
    }
  }
`;

export const GalleryCounter = styled.div`
  position: absolute;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
`;

export const GalleryThumbnails = styled.div`
  display: flex;
  gap: 8px;
  padding: 12px 16px;
  overflow-x: auto;
  background: var(--bg-secondary, #f9fafb);

  [data-theme="dark"] & {
    background: var(--bg-secondary, #1e293b);
  }
`;

export const Thumbnail = styled.button<{ $isActive?: boolean }>`
  width: 80px;
  height: 60px;
  border: 2px solid ${props => props.$isActive ? 'var(--primary-color, #dc2626)' : 'transparent'};
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  flex-shrink: 0;
  transition: all 0.2s ease;
  padding: 0;
  background: none;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const ModalContentArea = styled.div`
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

export const ModalTabs = styled.div`
  display: flex;
  gap: 4px;
  padding: 16px 24px;
  border-bottom: 1px solid var(--border-color, #e5e7eb);
  background: var(--bg-secondary, #f9fafb);
  overflow-x: auto;

  [data-theme="dark"] & {
    background: var(--bg-secondary, #1e293b);
    border-color: var(--border-color-dark, #374151);
  }
`;

export const ModalTab = styled.button<{ $isActive?: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: ${props => props.$isActive ? 'var(--primary-color, #dc2626)' : 'transparent'};
  color: ${props => props.$isActive ? 'white' : 'var(--text-secondary, #6b7280)'};
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;

  &:hover {
    background: var(--bg-hover, #f3f4f6);
    color: var(--text-primary, #1f2937);
  }

  ${props => props.$isActive && `
    &:hover {
      background: var(--primary-hover, #b91c1c);
    }
  `}

  [data-theme="dark"] & {
    &:hover {
      background: var(--bg-hover, #334155);
    }
  }
`;

export const ModalContent = styled.div`
  flex: 1;
  padding: 24px;
  overflow-y: auto;
`;

export const ModalSidebar = styled.div`
  border-left: 1px solid var(--border-color, #e5e7eb);
  padding: 24px;
  overflow-y: auto;
  background: var(--bg-secondary, #f9fafb);

  [data-theme="dark"] & {
    background: var(--bg-secondary, #1e293b);
    border-color: var(--border-color-dark, #374151);
  }

  @media (max-width: 1024px) {
    border-left: none;
    border-top: 1px solid var(--border-color, #e5e7eb);
  }
`;

export const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 20px 24px;
  border-top: 1px solid var(--border-color, #e5e7eb);
  background: var(--bg-secondary, #f9fafb);

  [data-theme="dark"] & {
    background: var(--bg-secondary, #1e293b);
    border-color: var(--border-color-dark, #374151);
  }
`;

export const FooterActionButton = styled.button<{ $variant?: 'default' | 'primary' | 'danger' }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: ${props => {
    switch (props.$variant) {
      case 'primary': return 'var(--primary-color, #dc2626)';
      case 'danger': return 'transparent';
      default: return 'var(--bg-card, #ffffff)';
    }
  }};
  color: ${props => {
    switch (props.$variant) {
      case 'primary': return 'white';
      case 'danger': return 'var(--error-color, #ef4444)';
      default: return 'var(--text-primary, #1f2937)';
    }
  }};
  border: 2px solid ${props => {
    switch (props.$variant) {
      case 'primary': return 'var(--primary-color, #dc2626)';
      case 'danger': return 'var(--error-color, #ef4444)';
      default: return 'var(--border-color, #e5e7eb)';
    }
  }};
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    ${props => {
      switch (props.$variant) {
        case 'primary': return 'background: var(--primary-hover, #b91c1c);';
        case 'danger': return 'background: var(--error-bg, #fee2e2);';
        default: return 'background: var(--bg-hover, #f3f4f6);';
      }
    }}
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  [data-theme="dark"] & {
    background: ${props => {
      switch (props.$variant) {
        case 'primary': return 'var(--primary-color, #dc2626)';
        case 'danger': return 'transparent';
        default: return 'var(--bg-card, #1e293b)';
      }
    }};
  }
`;
