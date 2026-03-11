import styled from 'styled-components';

export const SearchContainer = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
`;

export const SearchBarContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.5rem;
  flex-wrap: wrap;
  width: 100%;

  @media (max-width: 768px) {
    padding: 0.75rem 1rem;
  }
`;

export const SearchInputWrapper = styled.div`
  flex: 1;
  min-width: 250px;
  position: relative;
`;

export const SearchIcon = styled.svg`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  color: var(--text-muted);
  pointer-events: none;
`;

export const SearchInput = styled.input`
  width: 100%;
  padding: 0.875rem 1rem 0.875rem 3rem;
  font-size: 1rem;
  border: 2px solid var(--border-color);
  border-radius: var(--radius-md);
  background: var(--bg-primary);
  color: var(--text-primary);
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px rgba(196, 24, 53, 0.1);
  }

  &::placeholder {
    color: var(--text-muted);
  }
`;

export const SearchQuickActions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
`;

export const SortSelect = styled.select`
  padding: 0.75rem 2.5rem 0.75rem 1rem;
  font-size: 0.9rem;
  border: 2px solid var(--border-color);
  border-radius: var(--radius-md);
  background: var(--bg-primary);
  color: var(--text-primary);
  appearance: none;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 0.75rem center;
  background-repeat: no-repeat;
  background-size: 1.25em 1.25em;
  cursor: pointer;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: var(--primary-color);
  }

  &:hover {
    border-color: var(--primary-color);
  }
`;

export const FilterToggleBtn = styled.button<{ active?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  font-size: 0.9rem;
  font-weight: 500;
  border: 2px solid var(--border-color);
  border-radius: var(--radius-md);
  background: var(--bg-primary);
  color: var(--text-primary);
  cursor: pointer;
  transition: all 0.2s ease;

  svg {
    width: 18px;
    height: 18px;
  }

  &:hover,
  &.active {
    border-color: var(--primary-color);
    color: var(--primary-color);
  }

  ${({ active }) => active && `
    border-color: var(--primary-color);
    color: var(--primary-color);
  `}
`;

export const FilterCount = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  font-size: 0.75rem;
  font-weight: 600;
  background: var(--primary-color);
  color: white;
  border-radius: var(--radius-full);
  margin-left: 0.5rem;
`;

export const FiltersPanel = styled.div`
  margin-top: 1rem;
  padding: 1.5rem;
  animation: fadeInDown 0.3s ease;

  @keyframes fadeInDown {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

export const FiltersTabs = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  border-bottom: 2px solid var(--border-color);
  padding-bottom: 0.75rem;
  overflow-x: auto;
`;

export const FilterTab = styled.button<{ active?: boolean }>`
  padding: 0.625rem 1rem;
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--text-muted);
  background: none;
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;

  &:hover {
    color: var(--text-primary);
    background: var(--bg-tertiary);
  }

  ${({ active }) => active && `
    color: var(--primary-color);
    background: rgba(196, 24, 53, 0.1);
  `}
`;

export const FiltersContent = styled.div`
  display: grid;
  gap: 2rem;
`;

export const FilterSection = styled.div`
  padding-bottom: 1.5rem;
  border-bottom: 1px solid var(--border-color);

  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }
`;

export const FilterTitle = styled.h4`
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 1rem 0;
`;

export const PriceRangeInputs = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    flex-wrap: wrap;
  }
`;

export const PriceInputGroup = styled.div`
  flex: 1;
`;

export const PriceInputGroupLabel = styled.label`
  display: block;
  font-size: 0.75rem;
  color: var(--text-muted);
  margin-bottom: 0.25rem;
`;

export const PriceDisplay = styled.div`
  width: 100%;
  padding: 0.625rem 0.75rem;
  font-size: 0.9rem;
  font-weight: 600;
  border: 2px solid var(--border-color);
  border-radius: var(--radius-md);
  background: var(--bg-tertiary);
  color: var(--text-primary);
  text-align: center;
`;

export const PriceSeparator = styled.span`
  color: var(--text-muted);
  font-weight: 500;
`;

export const SearchButton = styled.button`
  padding: 0.75rem 2rem;
  font-size: 0.95rem;
  font-weight: 600;
  border: none;
  border-radius: var(--radius-md);
  background: var(--primary-color);
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(196, 24, 53, 0.3);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const ClearButton = styled.button`
  padding: 0.75rem 1.5rem;
  font-size: 0.95rem;
  font-weight: 600;
  border: 2px solid var(--border-color);
  border-radius: var(--radius-md);
  background: transparent;
  color: var(--text-primary);
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: var(--primary-color);
    color: var(--primary-color);
  }
`;
