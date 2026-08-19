/** FormADigitalGenerator.style.ts */
import styled from 'styled-components';
export const Root = styled.div`background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 1.5rem; max-width: 680px;`;
export const Title = styled.h3`font-size: 0.9375rem; font-weight: 700; color: #1e293b; margin: 0 0 1.25rem;`;
export const Section = styled.div`margin-bottom: 1.25rem;`;
export const SectionTitle = styled.div`font-size: 0.8125rem; font-weight: 700; color: #ef4444; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 0.65rem;`;
export const Grid2 = styled.div`display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem;`;
export const Field = styled.div`display: flex; flex-direction: column; gap: 0.3rem;`;
export const Label = styled.label`font-size: 0.8125rem; font-weight: 600; color: #475569;`;
export const Input = styled.input`
  padding: 0.55rem 0.75rem; border: 1px solid #e2e8f0; border-radius: 7px;
  font-size: 0.875rem; color: #1e293b;
  &:focus { outline: 2px solid #ef4444; border-color: transparent; }
`;
export const Select = styled.select`
  padding: 0.55rem 0.75rem; border: 1px solid #e2e8f0; border-radius: 7px;
  font-size: 0.875rem; color: #1e293b;
`;
export const GenerateBtn = styled.button`
  width: 100%; padding: 0.8rem; background: #ef4444; color: #fff; border: none;
  border-radius: 8px; font-weight: 700; font-size: 0.9375rem; cursor: pointer;
  &:hover { background: #dc2626; }
`;
export const Preview = styled.div`
  background: #f8fafc; border: 1.5px solid #e2e8f0; border-radius: 10px; padding: 1.25rem;
  font-family: 'Georgia', serif; font-size: 0.875rem; color: #1e293b; line-height: 1.7;
`;
export const PreviewTitle = styled.div`font-size: 1.125rem; font-weight: 700; text-align: center; margin-bottom: 1rem; color: #ef4444;`;
