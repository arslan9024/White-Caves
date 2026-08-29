import React, { FC, useState, useEffect } from 'react';
import { Z_INDEX } from '../../styles/zIndexTokens';
import { useTheme } from '../theme/ThemeProvider';
import { useLanguage } from '../../context/LanguageContext';
import { Sparkles, Sun, Moon, MessageSquare, Phone, Calculator, Shield, ChevronUp } from 'lucide-react';
import ClickToChat from '../ClickToChat';
import UAEMortgageCalculatorModal from '../finance/UAEMortgageCalculatorModal';

interface UniversalVisualMatrixShellProps {
  children: React.ReactNode;
}

export const UniversalVisualMatrixShell: FC<UniversalVisualMatrixShellProps> = ({ children }) => {
  const { isDark, toggleTheme } = useTheme();
  const { isRtl, language } = useLanguage();
  const [showMortgageModal, setShowMortgageModal] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div
      className={`universal-visual-matrix-shell min-h-screen relative transition-colors duration-300 ${
        isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
      }`}
      style={{ isolation: 'isolate' }}
    >
      {/* ── Layer 0: Canvas Ambient Gradient Mesh ──────────────────────── */}
      <div
        className="fixed inset-0 pointer-events-none transition-opacity duration-500"
        style={{
          zIndex: Z_INDEX.CANVAS,
          background: isDark
            ? 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(217, 119, 6, 0.08), transparent 70%), radial-gradient(ellipse 60% 40% at 80% 100%, rgba(30, 41, 59, 0.5), transparent)'
            : 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(245, 158, 11, 0.05), transparent 70%), radial-gradient(ellipse 60% 40% at 80% 100%, rgba(241, 245, 249, 0.8), transparent)',
        }}
      />

      {/* ── Layer 10: Main Content Stream ───────────────────────────────── */}
      <main className="relative w-full" style={{ zIndex: Z_INDEX.CONTENT }}>
        {children}
      </main>

      {/* ── Layer 50: Symmetrical Bottom Floating Widget Dock ──────────── */}
      <div
        className="fixed bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-2 p-1.5 rounded-full backdrop-blur-xl shadow-2xl transition-all duration-300 border"
        style={{
          zIndex: Z_INDEX.BOTTOM_DOCK,
          backgroundColor: isDark ? 'rgba(15, 23, 42, 0.85)' : 'rgba(255, 255, 255, 0.90)',
          borderColor: isDark ? 'rgba(217, 119, 6, 0.25)' : 'rgba(226, 232, 240, 0.8)',
          boxShadow: isDark
            ? '0 20px 35px -10px rgba(0, 0, 0, 0.7), 0 0 20px rgba(217, 119, 6, 0.15)'
            : '0 20px 35px -10px rgba(0, 0, 0, 0.15), 0 0 15px rgba(217, 119, 6, 0.1)',
        }}
      >
        {/* Day / Night Luxury Binary Switcher */}
        <button
          onClick={toggleTheme}
          title={isDark ? 'Switch to Light Luxury White' : 'Switch to Dark Sovereign Slate'}
          className="flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-semibold tracking-wide transition-all active:scale-95"
          style={{
            backgroundColor: isDark ? 'rgba(30, 41, 59, 0.9)' : 'rgba(241, 245, 249, 0.9)',
            color: isDark ? '#F59E0B' : '#0F172A',
          }}
        >
          {isDark ? <Sun className="w-3.5 h-3.5 text-amber-400 animate-spin-slow" /> : <Moon className="w-3.5 h-3.5 text-slate-700" />}
          <span className="hidden sm:inline">{isDark ? 'Day' : 'Night'}</span>
        </button>

        {/* UAE Mortgage Calculator Modal Trigger */}
        <button
          onClick={() => setShowMortgageModal(true)}
          title="Open UAE CBUAE Mortgage & DLD 4% Calculator"
          className="flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-semibold tracking-wide transition-all active:scale-95 hover:bg-amber-500/10 text-amber-500"
        >
          <Calculator className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Mortgage</span>
        </button>

        {/* Scroll To Top Action (Conditional) */}
        {showScrollTop && (
          <button
            onClick={scrollToTop}
            title="Scroll to Top"
            className="p-2 rounded-full transition-all active:scale-95 hover:bg-slate-700/20 text-slate-400 hover:text-amber-500"
          >
            <ChevronUp className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* ── Layer 70: Interactive Modals ───────────────────────────────── */}
      {showMortgageModal && (
        <div style={{ position: 'relative', zIndex: Z_INDEX.MODAL }}>
          <UAEMortgageCalculatorModal isOpen={showMortgageModal} onClose={() => setShowMortgageModal(false)} />
        </div>
      )}

      {/* ── Integrated Dual-Mode ClickToChat ───────────────────────────── */}
      <div style={{ position: 'relative', zIndex: Z_INDEX.BOTTOM_DOCK }}>
        <ClickToChat />
      </div>
    </div>
  );
};

export default UniversalVisualMatrixShell;
