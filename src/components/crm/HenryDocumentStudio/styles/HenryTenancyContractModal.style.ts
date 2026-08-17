/**
 * HenryTenancyContractModal.style.ts
 *
 * Styled Components for the Split-Pane DLD Tenancy Contract Preparation Modal.
 */

import styled from 'styled-components';
import { motion } from 'framer-motion';

export const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(15, 23, 42, 0.75);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  box-sizing: border-box;
`;

export const ModalContainer = styled(motion.div)`
  background: #0F172A;
  border: 1px solid rgba(239, 68, 68, 0.35);
  border-radius: 20px;
  width: 100%;
  max-width: 1480px;
  height: 92vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 25px 60px -15px rgba(0, 0, 0, 0.7), 0 0 30px rgba(239, 68, 68, 0.2);
  overflow: hidden;
  color: #F8FAFC;
`;

export const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.2rem 1.75rem;
  background: linear-gradient(90deg, #1E293B 0%, #0F172A 100%);
  border-bottom: 1px solid rgba(239, 68, 68, 0.2);

  .header-left {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .header-title {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 900;
    color: #FFFFFF;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .header-subtitle {
    font-size: 0.8rem;
    color: #94A3B8;
    margin: 0;
  }

  .header-actions {
    display: flex;
    align-items: center;
    gap: 10px;
  }
`;

export const HeaderBtn = styled.button<{ $variant?: 'primary' | 'secondary' | 'danger' | 'success' }>`
  background: ${({ $variant }) =>
    $variant === 'primary'
      ? 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)'
      : $variant === 'success'
      ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)'
      : $variant === 'danger'
      ? 'rgba(239, 68, 68, 0.15)'
      : 'rgba(255, 255, 255, 0.08)'};
  color: ${({ $variant }) =>
    $variant === 'danger' ? '#EF4444' : '#FFFFFF'};
  border: 1px solid
    ${({ $variant }) =>
      $variant === 'primary'
        ? '#DC2626'
        : $variant === 'success'
        ? '#059669'
        : $variant === 'danger'
        ? 'rgba(239, 68, 68, 0.3)'
        : 'rgba(255, 255, 255, 0.15)'};
  border-radius: 8px;
  padding: 6px 14px;
  font-size: 0.82rem;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }
`;

export const SplitPaneBody = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  flex: 1;
  min-height: 0;
  overflow: hidden;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    overflow-y: auto;
  }
`;

export const LeftPreviewPane = styled.div`
  background: #090D16;
  border-right: 1px solid rgba(239, 68, 68, 0.15);
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow: hidden;
`;

export const PreviewToolbar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1.25rem;
  background: #111827;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);

  .page-switcher {
    display: flex;
    gap: 6px;
  }

  .zoom-controls {
    display: flex;
    align-items: center;
    gap: 6px;
  }
`;

export const PageSwitchBtn = styled.button<{ $active: boolean }>`
  background: ${({ $active }) => ($active ? '#EF4444' : 'rgba(255, 255, 255, 0.06)')};
  color: ${({ $active }) => ($active ? '#FFFFFF' : '#94A3B8')};
  border: 1px solid ${({ $active }) => ($active ? '#DC2626' : 'rgba(255, 255, 255, 0.1)')};
  border-radius: 6px;
  padding: 4px 10px;
  font-size: 0.78rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    color: #FFFFFF;
    background: ${({ $active }) => ($active ? '#EF4444' : 'rgba(255, 255, 255, 0.12)')};
  }
`;

export const PreviewScrollArea = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
  display: flex;
  justify-content: center;
  background: #090D16;
`;

export const PreviewCanvasWrapper = styled.div<{ $zoom: number }>`
  transform: scale(${({ $zoom }) => $zoom});
  transform-origin: top center;
  transition: transform 0.2s ease;
  width: 100%;
  max-width: 680px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  border-radius: 8px;
  overflow: hidden;
`;

export const RightFormPane = styled.div`
  background: #0F172A;
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow: hidden;
`;

export const StepperHeader = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  background: #111827;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
`;

export const StepTabBtn = styled.button<{ $active: boolean; $completed: boolean }>`
  background: ${({ $active }) => ($active ? 'rgba(239, 68, 68, 0.12)' : 'transparent')};
  border: none;
  border-bottom: 2px solid ${({ $active }) => ($active ? '#EF4444' : 'transparent')};
  padding: 12px 8px;
  color: ${({ $active, $completed }) => ($active ? '#EF4444' : $completed ? '#10B981' : '#94A3B8')};
  font-size: 0.8rem;
  font-weight: 800;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  transition: all 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.04);
  }
`;

export const FormScrollArea = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
`;

export const FormGroup = styled.div`
  margin-bottom: 1.25rem;

  label {
    display: block;
    font-size: 0.82rem;
    font-weight: 700;
    color: #CBD5E1;
    margin-bottom: 6px;
  }

  .label-arabic {
    color: #94A3B8;
    font-size: 0.76rem;
    margin-left: 6px;
  }
`;

export const InputField = styled.input`
  width: 100%;
  background: rgba(15, 23, 42, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 8px;
  padding: 10px 14px;
  color: #F8FAFC;
  font-size: 0.88rem;
  box-sizing: border-box;
  outline: none;
  transition: border-color 0.2s;

  &:focus {
    border-color: #EF4444;
    box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.2);
  }

  &::placeholder {
    color: #64748B;
  }
`;

export const SelectField = styled.select`
  width: 100%;
  background: #0F172A;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 8px;
  padding: 10px 14px;
  color: #F8FAFC;
  font-size: 0.88rem;
  box-sizing: border-box;
  outline: none;

  &:focus {
    border-color: #EF4444;
  }
`;

export const FormGrid = styled.div<{ $cols?: number }>`
  display: grid;
  grid-template-columns: repeat(${({ $cols }) => $cols || 2}, 1fr);
  gap: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const OcrDropzone = styled.div`
  background: rgba(239, 68, 68, 0.05);
  border: 2px dashed rgba(239, 68, 68, 0.4);
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
  margin-bottom: 1.5rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: rgba(239, 68, 68, 0.1);
    border-color: #EF4444;
  }

  .dropzone-title {
    font-size: 0.95rem;
    font-weight: 800;
    color: #EF4444;
    margin-bottom: 4px;
  }

  .dropzone-desc {
    font-size: 0.78rem;
    color: #94A3B8;
    margin-bottom: 12px;
  }
`;

export const FormFooterActions = styled.div`
  padding: 1rem 1.5rem;
  background: #111827;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
