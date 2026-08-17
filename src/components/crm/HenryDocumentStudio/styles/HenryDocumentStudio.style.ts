/**
 * HenryDocumentStudio.style.ts — Styled Components & Visual Theme Layer
 */

import styled from 'styled-components';

export const StudioContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  font-family: 'Inter', sans-serif;
`;

export const StudioHeader = styled.div`
  background: linear-gradient(135deg, #1E293B 0%, #0F172A 100%);
  border-radius: 16px;
  padding: 24px 32px;
  color: #FFFFFF;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid rgba(239, 68, 68, 0.3);
  box-shadow: 0 12px 32px rgba(15, 23, 42, 0.15);

  h2 {
    font-size: 1.5rem;
    font-weight: 800;
    margin: 0 0 6px;
    display: flex;
    align-items: center;
    gap: 12px;
  }
`;

export const Badge = styled.span`
  background: #EF4444;
  color: #FFFFFF;
  padding: 4px 10px;
  border-radius: 9999px;
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.05em;
  text-transform: uppercase;
`;

export const WorkspaceSplit = styled.div`
  display: grid;
  grid-template-columns: 360px 1fr;
  gap: 24px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

export const SidebarControlPanel = styled.div`
  background: #FFFFFF;
  border: 1px solid #E2E8F0;
  border-radius: 14px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
  height: fit-content;
`;

export const SectionLabel = styled.h4`
  font-size: 0.82rem;
  font-weight: 800;
  text-transform: uppercase;
  color: #64748B;
  letter-spacing: 0.05em;
  margin: 0 0 8px;
`;

export const TemplateCard = styled.button<{ $selected: boolean }>`
  width: 100%;
  text-align: left;
  padding: 12px 14px;
  border-radius: 10px;
  border: 1.5px solid ${({ $selected }) => ($selected ? '#EF4444' : '#E2E8F0')};
  background: ${({ $selected }) => ($selected ? 'rgba(239, 68, 68, 0.04)' : '#FFFFFF')};
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 4px;
  transition: all 0.2s ease;

  &:hover {
    border-color: #EF4444;
    background: rgba(239, 68, 68, 0.02);
  }

  .card-title {
    font-size: 0.88rem;
    font-weight: 700;
    color: #1E293B;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .card-desc {
    font-size: 0.76rem;
    color: #64748B;
    line-height: 1.4;
  }
`;

export const PreviewCanvasCard = styled.div`
  background: #FFFFFF;
  border: 1px solid #E2E8F0;
  border-radius: 14px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
`;

export const ToolbarHeader = styled.div`
  background: #0F172A;
  color: #FFFFFF;
  padding: 12px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2px solid #EF4444;
`;

export const ToolButtonGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const ActionButton = styled.button<{ $primary?: boolean }>`
  background: ${({ $primary }) => ($primary ? '#EF4444' : 'rgba(255, 255, 255, 0.12)')};
  color: #FFFFFF;
  border: 1px solid ${({ $primary }) => ($primary ? '#EF4444' : 'rgba(255, 255, 255, 0.25)')};
  padding: 6px 14px;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ $primary }) => ($primary ? '#DC2626' : 'rgba(255, 255, 255, 0.25)')};
    transform: translateY(-1px);
  }
`;

export const PreviewFrame = styled.iframe`
  width: 100%;
  height: 750px;
  border: none;
  background: #F8FAFC;
`;
