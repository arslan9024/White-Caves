import React from 'react';
import { useLanguage, LANGUAGES } from '../context/LanguageContext';
import { Globe } from 'lucide-react';
import './LanguageToggle.css';

const LanguageToggle = ({ variant = 'default', showLabel = true }) => {
  const { language, toggleLanguage, isRTL } = useLanguage();

  return (
    <button
      className={`language-toggle language-toggle--${variant}`}
      onClick={toggleLanguage}
      aria-label={`Switch to ${language === LANGUAGES.EN ? 'Arabic' : 'English'}`}
      title={language === LANGUAGES.EN ? 'التبديل إلى العربية' : 'Switch to English'}
    >
      <Globe className="language-toggle__icon" size={18} />
      {showLabel && (
        <span className="language-toggle__label">
          {language === LANGUAGES.EN ? 'عربي' : 'EN'}
        </span>
      )}
      <span className="language-toggle__indicator">
        {language.toUpperCase()}
      </span>
    </button>
  );
};

export default LanguageToggle;
