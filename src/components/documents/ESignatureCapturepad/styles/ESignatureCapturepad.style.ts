/** ESignatureCapturepad.style.ts */
import styled from 'styled-components';
export const Root = styled.div`background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 1.25rem; max-width: 480px;`;
export const Title = styled.h3`font-size: 0.9375rem; font-weight: 700; color: #1e293b; margin: 0 0 1rem;`;
export const ModeBar = styled.div`display: flex; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; margin-bottom: 0.75rem;`;
export const ModeBtn = styled.button<{ $active: boolean }>`
  flex: 1; padding: 0.5rem; border: none; font-size: 0.8125rem; font-weight: 600; cursor: pointer;
  background: ${({ $active }) => ($active ? '#ef4444' : '#fff')};
  color: ${({ $active }) => ($active ? '#fff' : '#64748b')};
  transition: background 0.15s;
`;
export const Canvas = styled.canvas`
  width: 100%; height: 120px; border: 1.5px solid #e2e8f0; border-radius: 8px;
  cursor: crosshair; background: #fafafa; touch-action: none;
`;
export const TypeInput = styled.input`
  width: 100%; padding: 0.65rem 0.85rem; border: 1.5px solid #e2e8f0; border-radius: 8px;
  font-size: 1.25rem; font-family: 'Brush Script MT', cursive; color: #1e293b;
  &:focus { outline: 2px solid #ef4444; border-color: transparent; }
`;
export const ActionRow = styled.div`display: flex; gap: 0.5rem; margin-top: 0.75rem;`;
export const ClearBtn = styled.button`
  flex: 1; padding: 0.5rem; background: #f8fafc; color: #64748b; border: 1px solid #e2e8f0;
  border-radius: 7px; font-weight: 600; font-size: 0.875rem; cursor: pointer;
`;
export const SaveBtn = styled.button`
  flex: 2; padding: 0.5rem; background: #ef4444; color: #fff; border: none;
  border-radius: 7px; font-weight: 700; font-size: 0.875rem; cursor: pointer;
  &:hover { background: #dc2626; }
`;
export const SavedBanner = styled.div`
  background: #f0fdf4; border: 1.5px solid #22c55e; border-radius: 8px; padding: 0.85rem;
  text-align: center; color: #15803d; font-weight: 700; font-size: 0.875rem;
`;
