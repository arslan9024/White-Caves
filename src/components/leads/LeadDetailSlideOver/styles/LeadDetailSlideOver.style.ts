/**
 * LeadDetailSlideOver.style.ts — Styles Layer
 */
import styled from 'styled-components';

export const Overlay = styled.div<{ $open: boolean }>`
  position: fixed; inset: 0; background: rgba(0,0,0,0.4); z-index: 1900;
  opacity: ${({ $open }) => ($open ? 1 : 0)};
  pointer-events: ${({ $open }) => ($open ? 'all' : 'none')};
  transition: opacity 0.25s ease;
`;

export const Panel = styled.aside<{ $open: boolean }>`
  position: fixed; top: 0; right: 0; width: 420px; height: 100vh;
  background: #fff; box-shadow: -4px 0 32px rgba(0,0,0,0.12); z-index: 2000;
  transform: translateX(${({ $open }) => ($open ? '0' : '100%')});
  transition: transform 0.3s cubic-bezier(0.4,0,0.2,1);
  display: flex; flex-direction: column;
`;

export const PanelHeader = styled.div`
  background: #1e293b; color: #fff; padding: 1.25rem 1.5rem;
  display: flex; align-items: center; justify-content: space-between;
`;

export const PanelTitle = styled.h2`
  font-size: 1.0625rem; font-weight: 700; margin: 0;
`;

export const CloseBtn = styled.button`
  background: none; border: none; color: #fff; cursor: pointer; padding: 0.25rem;
  &:hover { color: #ef4444; }
`;

export const TabBar = styled.div`
  display: flex; border-bottom: 2px solid #e2e8f0;
`;

export const Tab = styled.button<{ $active: boolean }>`
  flex: 1; padding: 0.75rem; font-size: 0.875rem; font-weight: 600; border: none;
  background: none; cursor: pointer;
  color: ${({ $active }) => ($active ? '#ef4444' : '#64748b')};
  border-bottom: 2px solid ${({ $active }) => ($active ? '#ef4444' : 'transparent')};
  margin-bottom: -2px;
  transition: color 0.2s;
`;

export const PanelBody = styled.div`
  flex: 1; overflow-y: auto; padding: 1.25rem;
`;

export const TimelineItem = styled.div`
  display: flex; gap: 0.75rem; padding: 0.75rem 0;
  border-bottom: 1px solid #f1f5f9;
`;

export const TimelineDot = styled.div<{ $type: string }>`
  width: 32px; height: 32px; border-radius: 50%; flex-shrink: 0;
  background: ${({ $type }) => $type === 'call' ? '#dbeafe' : $type === 'viewing' ? '#dcfce7' : $type === 'offer' ? '#fef9c3' : $type === 'whatsapp' ? '#d1fae5' : '#f1f5f9'};
  display: flex; align-items: center; justify-content: center;
  font-size: 0.875rem;
`;

export const TimelineContent = styled.div`flex: 1;`;
export const TimelineLabel = styled.div`font-weight: 600; font-size: 0.875rem; color: #1e293b;`;
export const TimelineTime = styled.div`font-size: 0.75rem; color: #94a3b8; margin-bottom: 0.25rem;`;
export const TimelineDetail = styled.div`font-size: 0.8125rem; color: #64748b;`;

export const DetailRow = styled.div`
  display: flex; justify-content: space-between; padding: 0.5rem 0;
  border-bottom: 1px solid #f1f5f9;
`;

export const DetailLabel = styled.span`font-size: 0.8125rem; color: #94a3b8; font-weight: 500;`;
export const DetailValue = styled.span`font-size: 0.8125rem; color: #1e293b; font-weight: 600;`;
