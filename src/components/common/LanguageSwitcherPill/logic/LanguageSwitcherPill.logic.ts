/**
 * LanguageSwitcherPill.logic.ts — Hook & Logic Layer
 */

import { useCallback } from 'react';
import { useLanguage, type LanguageType } from '../../../../context/LanguageContext';

export interface UseLanguageSwitcherPillProps {
  onLanguageChange?: (lang: LanguageType) => void;
}

export function useLanguageSwitcherPillLogic(props?: UseLanguageSwitcherPillProps) {
  const { language, setLanguage, supportedLanguages } = useLanguage();

  const handleSelect = useCallback(
    (code: LanguageType) => {
      setLanguage(code);
      props?.onLanguageChange?.(code);
    },
    [setLanguage, props]
  );

  return {
    language,
    handleSelect,
    languagesList: Object.values(supportedLanguages),
  };
}
