/** ContractTemplateLibrary.style.ts */
import styled from 'styled-components';
export const Root = styled.div`background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 1.25rem;`;
export const Title = styled.h3`font-size: 0.9375rem; font-weight: 700; color: #1e293b; margin: 0 0 1rem;`;
export const FilterBar = styled.div`display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 1rem;`;
export const FilterPill = styled.button<{ $active: boolean }>`
  padding: 0.3rem 0.85rem; border-radius: 999px; border: 1.5px solid ${({ $active }) => ($active ? '#ef4444' : '#e2e8f0')};
  background: ${({ $active }) => ($active ? '#fef2f2' : '#fff')}; color: ${({ $active }) => ($active ? '#ef4444' : '#64748b')};
  font-size: 0.8125rem; font-weight: 600; cursor: pointer;
`;
export const Grid = styled.div`display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 0.75rem;`;
export const Card = styled.div`
  border: 1px solid #e2e8f0; border-radius: 10px; padding: 1rem; cursor: pointer;
  transition: box-shadow 0.2s; &:hover { box-shadow: 0 4px 14px rgba(239,68,68,0.12); border-color: #ef4444; }
`;
export const CardTitle = styled.div`font-size: 0.875rem; font-weight: 600; color: #1e293b; margin-bottom: 0.4rem;`;
export const CardMeta = styled.div`font-size: 0.75rem; color: #94a3b8;`;
export const PopularTag = styled.span`
  display: inline-block; background: #fef2f2; color: #ef4444; border-radius: 4px;
  font-size: 0.625rem; font-weight: 700; padding: 0.1rem 0.4rem; margin-bottom: 0.35rem;
`;
export const UseBtn = styled.button`
  margin-top: 0.75rem; width: 100%; padding: 0.45rem;
  background: #ef4444; color: #fff; border: none; border-radius: 6px;
  font-size: 0.8125rem; font-weight: 700; cursor: pointer;
  &:hover { background: #dc2626; }
`;
