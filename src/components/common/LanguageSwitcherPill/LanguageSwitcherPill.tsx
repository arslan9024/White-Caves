/**
 * LanguageSwitcherPill.tsx — View Layer (4-Way Component Architecture)
 * Sits at folder root: Pure presentational shell drawing data variables and logic hooks.
 */

import React, { FC } from 'react';
import { useLanguageSwitcherPillLogic, UseLanguageSwitcherPillProps } from './logic/LanguageSwitcherPill.logic';
import { LANGUAGE_PILL_TEXT } from './data/LanguageSwitcherPill.data';
import { Container, LangBtn } from './styles/LanguageSwitcherPill.style';
import { type LanguageType } from '../../../context/LanguageContext';

export interface LanguageSwitcherPillProps extends UseLanguageSwitcherPillProps {
  className?: string;
}

export const LanguageSwitcherPill: FC<LanguageSwitcherPillProps> = ({
  onLanguageChange,
  className,
}) => {
  const { language, handleSelect, languagesList } = useLanguageSwitcherPillLogic({ onLanguageChange });

  return (
    <Container className={className} data-testid="language-switcher-pill" aria-label={LANGUAGE_PILL_TEXT.ariaLabel}>
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
