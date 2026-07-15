import React, { FC } from 'react';
import styled from 'styled-components';
import { colors, spacing, typography, borderRadius } from '../../../design-tokens';

export interface SearchItem {
  id: string;
  icon: string;
  label: string;
  meta: string;
  type: 'tab' | 'module' | 'record';
  target: string;
}

const DashboardSearchResultButton = styled.button`
  display: grid;
  grid-template-columns: 32px 1fr;
  align-items: center;
  gap: ${spacing[3]};
  width: 100%;
  padding: ${spacing[2]} ${spacing[3]};
  border: 0;
  border-radius: ${borderRadius.lg};
  background: transparent;
  color: ${colors.text.primary};
  text-align: start;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: ${colors.background.hover};
  }

  &:focus-visible {
    outline: 2px solid ${colors.primary[500]};
    outline-offset: 2px;
  }
`;

const SearchResultIcon = styled.span`
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  border-radius: ${borderRadius.md};
  background: ${colors.background.surface};
`;

const SearchResultCopy = styled.span`
  display: flex;
  flex-direction: column;
  gap: ${spacing[1]};

  strong {
    ${typography.presets.label};
    color: ${colors.text.primary};
  }

  small {
    ${typography.presets.caption};
    color: ${colors.text.secondary};
  }
`;

interface DashboardSearchItemProps {
  item: SearchItem;
  onSelect: (item: SearchItem) => void;
}

export const DashboardSearchItem: FC<DashboardSearchItemProps> = ({ item, onSelect }) => (
  <DashboardSearchResultButton
    onMouseDown={event => {
      event.preventDefault();
      onSelect(item);
    }}
  >
    <SearchResultIcon aria-hidden="true">{item.icon}</SearchResultIcon>
    <SearchResultCopy>
      <strong>{item.label}</strong>
      <small>{item.meta}</small>
    </SearchResultCopy>
  </DashboardSearchResultButton>
);

export default DashboardSearchItem;
