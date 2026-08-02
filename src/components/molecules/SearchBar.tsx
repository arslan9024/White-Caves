import React, { FC, ReactNode, useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

export interface SearchBarProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  suggestions?: string[];
  icon?: ReactNode;
  variant?: 'hero' | 'compact' | 'inline';
}

const Container = styled.div<{ $variant: string }>`
  position: relative;
  width: 100%;
  max-width: ${({ $variant }) => $variant === 'hero' ? '680px' : $variant === 'compact' ? '360px' : '100%'};
`;

const InputWrapper = styled.div<{ $variant: string }>`
  display: flex;
  align-items: center;
  background: var(--wc-white, #FFFFFF);
  border: 2px solid ${({ $variant }) => $variant === 'hero' ? 'transparent' : '#E2E8F0'};
  border-radius: ${({ $variant }) => $variant === 'hero' ? '60px' : '12px'};
  padding: ${({ $variant }) => $variant === 'hero' ? '8px 8px 8px 24px' : '6px 6px 6px 16px'};
  box-shadow: ${({ $variant }) =>
    $variant === 'hero'
      ? '0 20px 60px rgba(30, 41, 59, 0.15)'
      : '0 2px 8px rgba(30, 41, 59, 0.06)'
  };
  transition: border-color 0.3s ease, box-shadow 0.3s ease;

  &:focus-within {
    border-color: var(--wc-red-primary, #EF4444);
    box-shadow: 0 8px 40px rgba(239, 68, 68, 0.15);
  }
`;

const IconBox = styled.span`
  display: flex;
  align-items: center;
  margin-right: 10px;
  font-size: 1.2rem;
  color: #94A3B8;
`;

const Input = styled.input`
  flex: 1;
  border: none;
  outline: none;
  font-size: 1rem;
  font-family: 'Inter', sans-serif;
  color: var(--wc-slate, #1E293B);
  background: transparent;

  &::placeholder {
    color: #94A3B8;
  }
`;

const SearchButton = styled(motion.button)<{ $variant: string }>`
  background: var(--wc-red-primary, #EF4444);
  color: var(--wc-white, #FFFFFF);
  border: none;
  border-radius: ${({ $variant }) => $variant === 'hero' ? '50px' : '8px'};
  padding: ${({ $variant }) => $variant === 'hero' ? '14px 32px' : '10px 20px'};
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.2s ease;

  &:hover {
    background: #EF4444;
  }
`;

const SuggestionsDropdown = styled(motion.ul)`
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  right: 0;
  background: var(--wc-white, #FFFFFF);
  border: 1px solid #E2E8F0;
  border-radius: 12px;
  box-shadow: 0 12px 40px rgba(30, 41, 59, 0.12);
  list-style: none;
  padding: 8px 0;
  margin: 0;
  z-index: 50;
  max-height: 240px;
  overflow-y: auto;
`;

const SuggestionItem = styled.li`
  padding: 10px 20px;
  font-size: 0.9rem;
  color: var(--wc-slate, #1E293B);
  cursor: pointer;
  transition: background 0.15s ease;

  &:hover {
    background: rgba(239, 68, 68, 0.06);
    color: var(--wc-red-primary, #EF4444);
  }
`;

export const SearchBar: FC<SearchBarProps> = ({
  placeholder = 'Search properties, areas, communities...',
  onSearch,
  suggestions = [],
  icon,
  variant = 'hero',
}) => {
  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const filtered = suggestions.filter(s =>
    s.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 6);

  const handleSubmit = () => {
    onSearch(query);
    setShowSuggestions(false);
  };

  return (
    <Container $variant={variant}>
      <InputWrapper $variant={variant}>
        {icon && <IconBox>{icon}</IconBox>}
        <Input
          value={query}
          onChange={(e) => { setQuery(e.target.value); setShowSuggestions(true); }}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          placeholder={placeholder}
          aria-label="Search properties"
          role="searchbox"
        />
        <SearchButton
          $variant={variant}
          onClick={handleSubmit}
          whileTap={{ scale: 0.96 }}
        >
          Search
        </SearchButton>
      </InputWrapper>

      <AnimatePresence>
        {showSuggestions && query.length > 0 && filtered.length > 0 && (
          <SuggestionsDropdown
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            {filtered.map((item, idx) => (
              <SuggestionItem
                key={idx}
                onMouseDown={() => {
                  setQuery(item);
                  onSearch(item);
                  setShowSuggestions(false);
                }}
              >
                {item}
              </SuggestionItem>
            ))}
          </SuggestionsDropdown>
        )}
      </AnimatePresence>
    </Container>
  );
};
