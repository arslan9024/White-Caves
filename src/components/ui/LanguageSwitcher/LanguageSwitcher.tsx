import React from 'react';
import { Globe } from 'lucide-react';
import { useLanguage, LANGUAGES } from '../../../context/LanguageContext';
import './LanguageSwitcher.css';

interface LanguageSwitcherProps {
  /** Optional extra class for positioning within parent layouts */
  className?: string;
}

/**
 * LanguageSwitcher
 * Renders a compact EN / AR toggle button.
 * Clicking it calls `toggleLanguage()` from LanguageContext, which also:
 *   - sets `dir="rtl"` / `dir="ltr"` on <html>
 *   - switches font-family to Cairo (Arabic) or Inter/Montserrat (English)
 *   - persists the choice to localStorage
 */
const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ className }) => {
  const { language, toggleLanguage } = useLanguage();
  const isArabic = language === LANGUAGES.AR;

  return (
    <button
      type="button"
      className={`lang-switcher${isArabic ? ' lang-switcher--ar' : ''}${className ? ` ${className}` : ''}`}
      onClick={toggleLanguage}
      aria-label={isArabic ? 'Switch to English' : 'التبديل إلى العربية'}
      title={isArabic ? 'Switch to English' : 'التبديل إلى العربية'}
    >
      <Globe size={16} className="lang-switcher__icon" aria-hidden="true" />
      <span className="lang-switcher__label">{isArabic ? 'English' : 'العربية'}</span>
    </button>
  );
};

export default LanguageSwitcher;
