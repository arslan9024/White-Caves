import React from 'react';
import { useLanguage, LANGUAGES } from '../context/LanguageContext';
import { Globe } from 'lucide-react';
import {
  StyledLanguageToggleButton,
  StyledLanguageIcon,
  StyledLanguageLabel,
  StyledLanguageIndicator,
} from './LanguageToggle.styles';

const LanguageToggle = ({ variant = 'default', showLabel = true }) => {
  const { language, toggleLanguage, isRTL } = useLanguage();

  return (
    <StyledLanguageToggleButton
      variant={variant}
      onClick={toggleLanguage}
      aria-label={`Switch to ${language === LANGUAGES.EN ? 'Arabic' : 'English'}`}
      title={language === LANGUAGES.EN ? 'التبديل إلى العربية' : 'Switch to English'}
    >
      <StyledLanguageIcon as={Globe} size={18} />
      {showLabel && (
        <StyledLanguageLabel>
          {language === LANGUAGES.EN ? 'عربي' : 'EN'}
        </StyledLanguageLabel>
      )}
      <StyledLanguageIndicator>
        {language.toUpperCase()}
      </StyledLanguageIndicator>
    </StyledLanguageToggleButton>
  );
};

export default LanguageToggle;
