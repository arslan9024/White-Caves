/** DocumentVersionHistory.style.ts */
import styled from 'styled-components';
export const Root = styled.div`display: flex; gap: 1rem; background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;`;
export const Sidebar = styled.div`width: 180px; flex-shrink: 0; border-right: 1px solid #e2e8f0; padding: 1rem;`;
export const SidebarTitle = styled.div`font-size: 0.75rem; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 0.75rem;`;
export const VersionItem = styled.div<{ $selected: boolean; $current?: boolean }>`
  padding: 0.6rem 0.75rem; border-radius: 8px; cursor: pointer; margin-bottom: 0.35rem;
  background: ${({ $selected }) => ($selected ? '#fef2f2' : 'transparent')};
  border: 1.5px solid ${({ $selected }) => ($selected ? '#ef4444' : 'transparent')};
  &:hover { background: #fef2f2; }
`;
export const VersionTag = styled.div<{ $current?: boolean }>`
  font-size: 0.8125rem; font-weight: 700; color: ${({ $current }) => ($current ? '#ef4444' : '#1e293b')};
`;
export const VersionMeta = styled.div`font-size: 0.6875rem; color: #94a3b8;`;
export const CurrentBadge = styled.span`
  display: inline-block; background: #ef4444; color: #fff;
  font-size: 0.5625rem; font-weight: 700; padding: 0.05rem 0.35rem;
  border-radius: 3px; margin-left: 0.35rem; vertical-align: middle;
`;
export const Content = styled.div`flex: 1; padding: 1.25rem;`;
export const DiffTitle = styled.h4`font-size: 0.875rem; font-weight: 700; color: #1e293b; margin: 0 0 0.5rem;`;
export const ChangesBox = styled.div`
  background: #f0fdf4; border-left: 3px solid #22c55e; border-radius: 4px;
  padding: 0.75rem 1rem; font-size: 0.8125rem; color: #15803d; line-height: 1.6;
`;
export const AuthorRow = styled.div`margin-top: 0.75rem; font-size: 0.75rem; color: #94a3b8;`;
