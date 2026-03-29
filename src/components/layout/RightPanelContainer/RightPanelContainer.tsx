/**
 * RightPanelContainer — Contextual Slide-In Panel
 *
 * Only appears when triggered (click AI icon in rail, or Ctrl+A).
 * When closed, full dashboard width is available for content.
 *
 * Features:
 * - Slide from right with smooth animation
 * - AI assistant list with search, filter, grouping
 * - Mobile: bottom drawer
 * - Keyboard: Escape to close
 */

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { X, Search, Bot, MessageSquare, BarChart3, Settings, ChevronDown } from 'lucide-react';
import {
  selectRightPanelOpen,
  selectSelectedAssistant,
  closeRightPanel,
  selectAssistant,
} from '../../../store/slices/sidebarSlice';
import styled, { keyframes } from 'styled-components';

// ─── Assistant data ───────────────────────────────────────────────────────

interface AssistantItem {
  id: string;
  name: string;
  description: string;
  group: 'CRM' | 'Operations' | 'Technical';
  status: 'online' | 'offline';
}

const ASSISTANTS: AssistantItem[] = [
  { id: 'hazel', name: 'Hazel', description: 'CRM & Client Management', group: 'CRM', status: 'online' },
  { id: 'clara', name: 'Clara', description: 'Communications & Scheduling', group: 'CRM', status: 'online' },
  { id: 'mary', name: 'Mary', description: 'Inventory & Properties', group: 'Operations', status: 'online' },
  { id: 'james', name: 'James', description: 'Legal & Contracts', group: 'Operations', status: 'offline' },
  { id: 'sarah', name: 'Sarah', description: 'Financial Analysis', group: 'Operations', status: 'online' },
  { id: 'alex', name: 'Alex', description: 'Tech Support & Systems', group: 'Technical', status: 'online' },
  { id: 'dan', name: 'Dan', description: 'Data Intelligence', group: 'Technical', status: 'offline' },
];

// ─── Styles ───────────────────────────────────────────────────────────────

const slideIn = keyframes`
  from { transform: translateX(100%); }
  to   { transform: translateX(0); }
`;

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  top: 56px;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(2px);
  z-index: 299;
  
  @media (min-width: 1200px) {
    display: none;
  }
`;

const Panel = styled.aside<{ $open: boolean }>`
  position: fixed;
  top: 56px;
  right: 0;
  width: 360px;
  height: calc(100vh - 56px);
  background: #FFFFFF;
  border-left: 1px solid #E5E7EB;
  box-shadow: -8px 0 30px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  z-index: 300;
  transform: translateX(${p => p.$open ? '0' : '100%'});
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  @media (max-width: 768px) {
    top: auto;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    height: 70vh;
    border-left: none;
    border-top: 1px solid #E5E7EB;
    border-radius: 16px 16px 0 0;
    transform: translateY(${p => p.$open ? '0' : '100%'});
    animation: ${p => p.$open ? slideIn : 'none'} 0.3s ease;
  }

  @media (prefers-color-scheme: dark) {
    background: #1E293B;
    border-left-color: #334155;
    box-shadow: -8px 0 30px rgba(0, 0, 0, 0.3);
  }
`;

const PanelHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid #E5E7EB;

  @media (prefers-color-scheme: dark) {
    border-bottom-color: #334155;
  }
`;

const PanelTitle = styled.h2`
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #111827;
  display: flex;
  align-items: center;
  gap: 8px;

  @media (prefers-color-scheme: dark) {
    color: #F8FAFC;
  }
`;

const CloseBtn = styled.button`
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  color: #6B7280;
  transition: all 0.15s ease;

  &:hover {
    background: #F3F4F6;
    color: #111827;
  }

  @media (prefers-color-scheme: dark) {
    color: #94A3B8;
    &:hover { background: #334155; color: #F8FAFC; }
  }
`;

const SearchBar = styled.div`
  padding: 12px 20px;
  border-bottom: 1px solid #F3F4F6;

  @media (prefers-color-scheme: dark) {
    border-bottom-color: #2D2D44;
  }
`;

const SearchInput = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: #F3F4F6;
  border-radius: 8px;
  border: 1px solid transparent;
  transition: all 0.15s ease;

  &:focus-within {
    border-color: #E31E24;
    background: #FFFFFF;
    box-shadow: 0 0 0 3px rgba(227, 30, 36, 0.1);
  }

  input {
    flex: 1;
    border: none;
    outline: none;
    background: transparent;
    font-size: 13px;
    color: #374151;
    font-family: inherit;

    &::placeholder { color: #9CA3AF; }
  }

  @media (prefers-color-scheme: dark) {
    background: #334155;
    &:focus-within { background: #1E293B; }
    input { color: #E2E8F0; &::placeholder { color: #64748B; } }
  }
`;

const GroupSection = styled.div`
  &:not(:last-child) {
    border-bottom: 1px solid #F3F4F6;

    @media (prefers-color-scheme: dark) {
      border-bottom-color: #2D2D44;
    }
  }
`;

const GroupHeader = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px;
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 11px;
  font-weight: 600;
  color: #9CA3AF;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  transition: all 0.15s ease;

  &:hover { color: #6B7280; }

  @media (prefers-color-scheme: dark) {
    color: #64748B;
    &:hover { color: #94A3B8; }
  }
`;

const AssistantList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 4px 0;
`;

const AssistantBtn = styled.button<{ $selected?: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 20px;
  background: ${p => p.$selected ? '#FFEBEE' : 'transparent'};
  border: none;
  cursor: pointer;
  transition: all 0.15s ease;
  text-align: left;

  &:hover {
    background: ${p => p.$selected ? '#FFEBEE' : '#F9FAFB'};
  }

  @media (prefers-color-scheme: dark) {
    background: ${p => p.$selected ? 'rgba(227, 30, 36, 0.12)' : 'transparent'};
    &:hover { background: ${p => p.$selected ? 'rgba(227, 30, 36, 0.12)' : 'rgba(255,255,255,0.04)'}; }
  }
`;

const AssistantAvatar = styled.div<{ $online?: boolean }>`
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: linear-gradient(135deg, #E31E24, #C62828);
  color: #FFFFFF;
  font-size: 14px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  flex-shrink: 0;

  &::after {
    content: '';
    position: absolute;
    bottom: -1px;
    right: -1px;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: ${p => p.$online ? '#10B981' : '#9CA3AF'};
    border: 2px solid #FFFFFF;

    @media (prefers-color-scheme: dark) {
      border-color: #1E293B;
    }
  }
`;

const AssistantInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const AssistantName = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: #111827;

  @media (prefers-color-scheme: dark) {
    color: #F8FAFC;
  }
`;

const AssistantDesc = styled.div`
  font-size: 12px;
  color: #6B7280;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  @media (prefers-color-scheme: dark) {
    color: #94A3B8;
  }
`;

const Footer = styled.div`
  padding: 12px 20px;
  border-top: 1px solid #E5E7EB;
  font-size: 12px;
  color: #9CA3AF;
  text-align: center;

  @media (prefers-color-scheme: dark) {
    border-top-color: #334155;
    color: #64748B;
  }

  kbd {
    padding: 2px 5px;
    border-radius: 3px;
    background: #F3F4F6;
    border: 1px solid #E5E7EB;
    font-size: 11px;
    font-family: inherit;

    @media (prefers-color-scheme: dark) {
      background: #334155;
      border-color: #475569;
    }
  }
`;

// ─── Component ────────────────────────────────────────────────────────────

const RightPanelContainer: React.FC = () => {
  const dispatch = useDispatch();
  const isOpen = useSelector(selectRightPanelOpen);
  const selectedAssistant = useSelector(selectSelectedAssistant);
  const [search, setSearch] = useState('');
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    CRM: true,
    Operations: true,
    Technical: true,
  });

  // Keyboard: Escape to close, Ctrl+A to toggle
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        dispatch(closeRightPanel());
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [dispatch, isOpen]);

  const filteredAssistants = useMemo(() => {
    if (!search.trim()) return ASSISTANTS;
    const q = search.toLowerCase();
    return ASSISTANTS.filter(a =>
      a.name.toLowerCase().includes(q) ||
      a.description.toLowerCase().includes(q)
    );
  }, [search]);

  const grouped = useMemo(() => {
    const groups: Record<string, AssistantItem[]> = {};
    filteredAssistants.forEach(a => {
      if (!groups[a.group]) groups[a.group] = [];
      groups[a.group].push(a);
    });
    return groups;
  }, [filteredAssistants]);

  return (
    <>
      {isOpen && <Backdrop onClick={() => dispatch(closeRightPanel())} />}
      <Panel $open={isOpen}>
        <PanelHeader>
          <PanelTitle>
            <Bot size={18} /> AI Assistants
          </PanelTitle>
          <CloseBtn onClick={() => dispatch(closeRightPanel())} aria-label="Close panel">
            <X size={18} />
          </CloseBtn>
        </PanelHeader>

        <SearchBar>
          <SearchInput>
            <Search size={16} style={{ color: '#9CA3AF', flexShrink: 0 }} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search assistants..."
              autoComplete="off"
            />
          </SearchInput>
        </SearchBar>

        <AssistantList>
          {Object.entries(grouped).map(([group, items]) => (
            <GroupSection key={group}>
              <GroupHeader onClick={() => setExpandedGroups(prev => ({ ...prev, [group]: !prev[group] }))}>
                <span>{group} ({items.length})</span>
                <ChevronDown
                  size={14}
                  style={{
                    transform: expandedGroups[group] ? 'rotate(0deg)' : 'rotate(-90deg)',
                    transition: 'transform 0.2s ease',
                  }}
                />
              </GroupHeader>
              {expandedGroups[group] && items.map(assistant => (
                <AssistantBtn
                  key={assistant.id}
                  $selected={selectedAssistant === assistant.id}
                  onClick={() => dispatch(selectAssistant(assistant.id))}
                >
                  <AssistantAvatar $online={assistant.status === 'online'}>
                    {assistant.name[0]}
                  </AssistantAvatar>
                  <AssistantInfo>
                    <AssistantName>{assistant.name}</AssistantName>
                    <AssistantDesc>{assistant.description}</AssistantDesc>
                  </AssistantInfo>
                </AssistantBtn>
              ))}
            </GroupSection>
          ))}
        </AssistantList>

        <Footer>
          Press <kbd>Esc</kbd> to close
        </Footer>
      </Panel>
    </>
  );
};

export default RightPanelContainer;
