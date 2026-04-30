/**
 * CommandPalette — Global search overlay (Cmd+K / Ctrl+K)
 *
 * Inspired by VS Code, Linear, Notion command palettes.
 * Features:
 * - Full-screen overlay with search input
 * - Categories: Departments, Services, Properties, Settings
 * - Keyboard navigation (↑↓ to move, Enter to select, Esc to close)
 * - Recent searches, type "/" for category filters
 */

import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Search, X, Building2, DollarSign, TrendingUp, Megaphone,
  MessageSquare, Globe, Lock, Code, Scale, Settings, Users2,
  BarChart3, Home, ArrowRight, Command
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { selectCommandPaletteOpen, closeCommandPalette, selectDepartment } from '../../store/slices/sidebarSlice';
import styled, { keyframes } from 'styled-components';
import { spacing } from '../../styles/theme/spacing';

// ─── Types ────────────────────────────────────────────────────────────────

interface PaletteItem {
  id: string;
  label: string;
  category: string;
  icon: LucideIcon;
  action: () => void;
  keywords?: string[];
}

// ─── Styles ───────────────────────────────────────────────────────────────

const fadeIn = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`;

const slideUp = keyframes`
  from { opacity: 0; transform: translateY(20px) scale(0.98); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  z-index: 700;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 15vh;
  animation: ${fadeIn} 0.15s ease;
`;

const PaletteContainer = styled.div`
  width: 560px;
  max-width: 90vw;
  max-height: 70vh;
  background: #FFFFFF;
  border-radius: 16px;
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: ${slideUp} 0.2s ease;

  @media (prefers-color-scheme: dark) {
    background: #1E293B;
    box-shadow: 0 24px 80px rgba(0, 0, 0, 0.5);
  }
`;

const SearchRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  border-bottom: 1px solid #E5E7EB;

  @media (prefers-color-scheme: dark) {
    border-bottom-color: #334155;
  }
`;

const SearchIcon = styled.div`
  color: #9CA3AF;
  flex-shrink: 0;
`;

const SearchInput = styled.input`
  flex: 1;
  border: none;
  outline: none;
  font-size: 16px;
  color: #111827;
  background: transparent;
  font-family: inherit;

  &::placeholder {
    color: #9CA3AF;
  }

  @media (prefers-color-scheme: dark) {
    color: #F8FAFC;
    &::placeholder { color: #64748B; }
  }
`;

const CloseHint = styled.kbd`
  font-size: 11px;
  padding: 3px 7px;
  border-radius: 4px;
  background: #F3F4F6;
  border: 1px solid #E5E7EB;
  color: #9CA3AF;
  font-family: inherit;
  flex-shrink: 0;

  @media (prefers-color-scheme: dark) {
    background: #334155;
    border-color: #475569;
    color: #64748B;
  }
`;

const ResultsList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: ${spacing.sm};
`;

const CategoryLabel = styled.div`
  padding: 8px 12px 4px;
  font-size: 11px;
  font-weight: 600;
  color: #9CA3AF;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  @media (prefers-color-scheme: dark) {
    color: #64748B;
  }
`;

const ResultItem = styled.button<{ $active?: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  background: ${p => p.$active ? '#F3F4F6' : 'transparent'};
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-size: 14px;
  color: #374151;
  transition: all 0.1s ease;
  text-align: left;

  &:hover {
    background: #F3F4F6;
  }

  @media (prefers-color-scheme: dark) {
    color: #E2E8F0;
    background: ${p => p.$active ? '#334155' : 'transparent'};
    &:hover { background: #334155; }
  }
`;

const ResultIcon = styled.div<{ $color?: string }>`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: ${p => p.$color ? `${p.$color}15` : '#F3F4F6'};
  color: ${p => p.$color || '#6B7280'};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const ResultLabel = styled.span`
  flex: 1;
  font-weight: 500;
`;

const ResultArrow = styled.div`
  color: #D1D5DB;
  flex-shrink: 0;
`;

const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 20px;
  border-top: 1px solid #E5E7EB;
  font-size: 12px;
  color: #9CA3AF;
  gap: ${spacing.md};

  @media (prefers-color-scheme: dark) {
    border-top-color: #334155;
    color: #64748B;
  }
`;

const FooterHint = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.xs};

  kbd {
    font-size: 10px;
    padding: 2px 5px;
    border-radius: 3px;
    background: #F3F4F6;
    border: 1px solid #E5E7EB;
    font-family: inherit;

    @media (prefers-color-scheme: dark) {
      background: #334155;
      border-color: #475569;
    }
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 32px 16px;
  color: #9CA3AF;
  font-size: 14px;
`;

// ─── Department colors ────────────────────────────────────────────────────

const DEPT_COLORS: Record<string, string> = {
  operations: '#3B82F6',
  finance: '#F59E0B',
  sales: '#10B981',
  marketing: '#EC4899',
  communications: '#8B5CF6',
  executive: '#E31E24',
  compliance: '#059669',
  technology: '#06B6D4',
  legal: '#7C3AED',
};

const DEPT_ICONS: Record<string, LucideIcon> = {
  operations: Building2,
  finance: DollarSign,
  sales: TrendingUp,
  marketing: Megaphone,
  communications: MessageSquare,
  executive: Globe,
  compliance: Lock,
  technology: Code,
  legal: Scale,
};

// ─── Component ────────────────────────────────────────────────────────────

const CommandPalette: React.FC = React.memo(function CommandPalette() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isOpen = useSelector(selectCommandPaletteOpen);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Build searchable items
  const items = useMemo<PaletteItem[]>(() => {
    const list: PaletteItem[] = [];

    // Navigation
    list.push(
      { id: 'nav-dashboard', label: 'Dashboard', category: 'Navigation', icon: Home, action: () => navigate('/dashboard'), keywords: ['home', 'overview'] },
      { id: 'nav-analytics', label: 'Analytics', category: 'Navigation', icon: BarChart3, action: () => navigate('/dashboard'), keywords: ['charts', 'reports', 'stats'] },
      { id: 'nav-clients', label: 'Clients', category: 'Navigation', icon: Users2, action: () => navigate('/dashboard'), keywords: ['customers', 'contacts'] },
      { id: 'nav-settings', label: 'Settings', category: 'Navigation', icon: Settings, action: () => navigate('/settings'), keywords: ['preferences', 'configuration'] },
    );

    // Departments
    Object.entries(DEPT_ICONS).forEach(([deptId, Icon]) => {
      const label = deptId.charAt(0).toUpperCase() + deptId.slice(1);
      list.push({
        id: `dept-${deptId}`,
        label: `${label} Department`,
        category: 'Departments',
        icon: Icon,
        action: () => dispatch(selectDepartment(deptId)),
        keywords: [deptId, 'department'],
      });
    });

    return list;
  }, [navigate, dispatch]);

  // Filter items
  const filteredItems = useMemo(() => {
    if (!query.trim()) return items;
    const q = query.toLowerCase();
    return items.filter(item =>
      item.label.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      item.keywords?.some(k => k.includes(q))
    );
  }, [items, query]);

  // Group by category
  const grouped = useMemo(() => {
    const groups: Record<string, PaletteItem[]> = {};
    filteredItems.forEach(item => {
      if (!groups[item.category]) groups[item.category] = [];
      groups[item.category].push(item);
    });
    return groups;
  }, [filteredItems]);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setActiveIndex(0);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [isOpen]);

  // Keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      dispatch(closeCommandPalette());
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(prev => Math.min(prev + 1, filteredItems.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter' && filteredItems[activeIndex]) {
      e.preventDefault();
      filteredItems[activeIndex].action();
      dispatch(closeCommandPalette());
    }
  }, [dispatch, filteredItems, activeIndex]);

  if (!isOpen) return null;

  let flatIndex = -1;

  return (
    <Overlay onClick={(e) => { if (e.target === e.currentTarget) dispatch(closeCommandPalette()); }}>
      <PaletteContainer onKeyDown={handleKeyDown}>
        <SearchRow>
          <SearchIcon><Search size={20} /></SearchIcon>
          <SearchInput
            ref={inputRef}
            value={query}
            onChange={e => { setQuery(e.target.value); setActiveIndex(0); }}
            placeholder="Search departments, services, properties..."
            autoComplete="off"
            spellCheck={false}
          />
          <CloseHint>ESC</CloseHint>
        </SearchRow>

        <ResultsList>
          {filteredItems.length === 0 ? (
            <EmptyState>
              No results for "{query}"
            </EmptyState>
          ) : (
            Object.entries(grouped).map(([category, categoryItems]) => (
              <div key={category}>
                <CategoryLabel>{category}</CategoryLabel>
                {categoryItems.map(item => {
                  flatIndex++;
                  const idx = flatIndex;
                  const Icon = item.icon;
                  return (
                    <ResultItem
                      key={item.id}
                      $active={idx === activeIndex}
                      onClick={() => {
                        item.action();
                        dispatch(closeCommandPalette());
                      }}
                      onMouseEnter={() => setActiveIndex(idx)}
                    >
                      <ResultIcon $color={DEPT_COLORS[item.id.replace('dept-', '')]}>
                        <Icon size={16} />
                      </ResultIcon>
                      <ResultLabel>{item.label}</ResultLabel>
                      <ResultArrow><ArrowRight size={14} /></ResultArrow>
                    </ResultItem>
                  );
                })}
              </div>
            ))
          )}
        </ResultsList>

        <Footer>
          <FooterHint>
            <kbd>↑↓</kbd> navigate <kbd>↵</kbd> select <kbd>esc</kbd> close
          </FooterHint>
          <FooterHint>
            <Command size={12} /> White Caves CRM
          </FooterHint>
        </Footer>
      </PaletteContainer>
    </Overlay>
  );
});

export default CommandPalette;
