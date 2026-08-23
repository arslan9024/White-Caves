/**
 * LanguageSelectorDropdown — Wave 61 FE-GOAL-060
 * Multilingual language selector dropdown with Arabic RTL support
 * White Caves Real Estate LLC — International Suite
 */
import React, { FC, useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  position: relative;
  font-family: 'Inter', sans-serif;
`;

const SelectBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 8px;
  background: rgba(15, 23, 42, 0.85);
  border: 1px solid rgba(100, 116, 139, 0.25);
  color: #FFF;
  font-size: 0.75rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  &:hover { border-color: #EF4444; }
`;

const Dropdown = styled.div`
  position: absolute;
  top: calc(100% + 6px);
  right: 0;
  width: 140px;
  background: #0F172A;
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 10px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.6);
  overflow: hidden;
  z-index: 1000;
`;

const LangOption = styled.button<{ $active: boolean }>`
  width: 100%;
  padding: 8px 12px;
  border: none;
  background: ${p => p.$active ? 'rgba(239, 68, 68, 0.15)' : 'transparent'};
  color: ${p => p.$active ? '#EF4444' : '#E2E8F0'};
  font-size: 0.75rem;
  font-weight: 700;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  &:hover { background: rgba(239, 68, 68, 0.1); }
`;

export const LanguageSelectorDropdown: FC<{ onLanguageChange?: (lang: 'en' | 'ar') => void }> = ({ onLanguageChange }) => {
  const [open, setOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState<'en' | 'ar'>('en');

  const select = (lang: 'en' | 'ar') => {
    setCurrentLang(lang);
    setOpen(false);
    onLanguageChange?.(lang);
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  };

  return (
    <Container data-testid="language-selector-dropdown">
      <SelectBtn onClick={() => setOpen(!open)}>
        <span>🌐</span>
        <span>{currentLang === 'en' ? 'EN (English)' : 'العربية (AR)'}</span>
        <span style={{ fontSize: '0.6rem', color: 'var(--color-94a3b8, #94A3B8)' }}>▼</span>
      </SelectBtn>

      {open && (
        <Dropdown>
          <LangOption $active={currentLang === 'en'} onClick={() => select('en')}>
            <span>English (LTR)</span>
            {currentLang === 'en' && <span>✓</span>}
          </LangOption>
          <LangOption $active={currentLang === 'ar'} onClick={() => select('ar')}>
            <span>العربية (RTL)</span>
            {currentLang === 'ar' && <span>✓</span>}
          </LangOption>
        </Dropdown>
      )}
    </Container>
  );
};

export default LanguageSelectorDropdown;
