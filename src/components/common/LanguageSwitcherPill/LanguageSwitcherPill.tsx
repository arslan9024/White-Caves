/**
 * LanguageSwitcherPill — Multi-Language Selector Pill
 * Supports 4 Universal Languages: English (EN), Arabic (AR), Spanish (ES), Russian (RU)
 * White Caves Real Estate LLC — Internationalization & UI/UX Suite
 */
import React, { FC } from 'react';
import styled from 'styled-components';
import { useLanguage, type LanguageType } from '../../../context/LanguageContext';

const Container = styled.div`
  display: inline-flex;
  align-items: center;
  background: rgba(15, 23, 42, 0.85);
  border: 1px solid rgba(100, 116, 139, 0.25);
  border-radius: 999px;
  padding: 3px;
  gap: 2px;
  font-family: 'Inter', sans-serif;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
`;

const LangBtn = styled.button<{ $active: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 9px;
  border-radius: 999px;
  border: none;
  background: ${p => (p.$active ? '#EF4444' : 'transparent')};
  color: ${p => (p.$active ? '#FFFFFF' : '#94A3B8')};
  font-size: 0.72rem;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    color: #FFFFFF;
    background: ${p => (p.$active ? '#EF4444' : 'rgba(255, 255, 255, 0.08)')};
  }

  .flag {
    font-size: 0.85rem;
    line-height: 1;
  }
`;

export interface LanguageSwitcherPillProps {
  onLanguageChange?: (lang: LanguageType) => void;
  className?: string;
}

export const LanguageSwitcherPill: FC<LanguageSwitcherPillProps> = ({
  onLanguageChange,
  className,
}) => {
  const { language, setLanguage, supportedLanguages } = useLanguage();

  const handleSelect = (code: LanguageType) => {
    setLanguage(code);
    onLanguageChange?.(code);
  };

  const languagesList = Object.values(supportedLanguages);

  return (
    <Container className={className} data-testid="language-switcher-pill" aria-label="Select Language">
      {languagesList.map(item => {
        const isActive = language === item.code;
        return (
          <LangBtn
            key={item.code}
            $active={isActive}
            onClick={() => handleSelect(item.code as LanguageType)}
            data-testid={`lang-btn-${item.code}`}
            title={`${item.name} (${item.nativeName})`}
            aria-pressed={isActive}
          >
            <span className="flag">{item.flag}</span>
            <span>{item.code.toUpperCase()}</span>
          </LangBtn>
        );
      })}
    </Container>
  );
};

export default LanguageSwitcherPill;
