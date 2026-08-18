/**
 * DashboardAiTile.tsx
 *
 * Tile 3: AI Command Center (26 AI Assistants) with SearchableSelect.
 */

import React, { FC, useMemo } from 'react';
import { TopLevelTileButton } from '../../../pages/crm/CRMHubPage.styles';
import {
  ALL_AI_ASSISTANTS,
  type AIAssistantOption,
} from '../../../pages/crm/CRMHubPage.logic';
import SearchableSelect, { type SearchableOption } from '../common/SearchableSelect';

export interface DashboardAiTileProps {
  isOpen: boolean;
  isCollapsed: boolean;
  selectedAi: AIAssistantOption;
  selectedAiId: string;
  activeTab?: string;
  onTileClick: () => void;
  onSelectAiAssistant: (option: SearchableOption) => void;
  onSubItemClick?: (itemId: string) => void;
}

export const DashboardAiTile: FC<DashboardAiTileProps> = ({
  isOpen,
  isCollapsed,
  selectedAi,
  selectedAiId,
  activeTab,
  onTileClick,
  onSelectAiAssistant,
  onSubItemClick,
}) => {
  const aiOptions = useMemo<SearchableOption[]>(() => {
    return ALL_AI_ASSISTANTS.map(ai => ({
      id: ai.id,
      num: ai.num,
      name: ai.name,
      role: ai.role,
      icon: ai.icon,
    }));
  }, []);

  return (
    <div>
      <TopLevelTileButton
        $open={isOpen}
        onClick={onTileClick}
        $accentColor="#8B5CF6"
        title="AI Command Center (26 AI Assistants)"
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>🤖</span>
          {!isCollapsed && <span>3. AI Command Center (26 AI)</span>}
        </div>
        {!isCollapsed && <span className="arrow">▶</span>}
      </TopLevelTileButton>

      {isOpen && !isCollapsed && (
        <div style={{ paddingLeft: '0.5rem', marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {/* Reusable Searchable AI Dropdown */}
          <SearchableSelect
            options={aiOptions}
            selectedId={selectedAiId}
            onSelect={onSelectAiAssistant}
            searchPlaceholder="🔍 Search AI (e.g. Nadia, Sophia, Zoe, Henry, Cassie)..."
            accentColor="#8B5CF6"
            borderColor="#8B5CF6"
            labelPrefix="Select AI"
          />

          {/* Quick Active Assistant Card */}
          <div
            style={{
              padding: '10px 12px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.08) 0%, rgba(139, 92, 246, 0.03) 100%)',
              border: '1px solid rgba(139, 92, 246, 0.2)',
              marginTop: '4px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: 800, color: '#8B5CF6' }}>
              <span>{selectedAi.icon}</span>
              <span>{selectedAi.name}</span>
            </div>
            <div style={{ fontSize: '0.73rem', color: '#64748B', marginTop: '2px' }}>
              {selectedAi.role}
            </div>
          </div>

          {/* AI Assistant Sub-Items / Modules (e.g. 3.19.1 Prepare Tenancy Contract) */}
          {selectedAi.items && selectedAi.items.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '4px' }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', paddingLeft: '4px' }}>
                {selectedAi.name} Modules
              </div>
              {selectedAi.items.map((subItem) => (
                <button
                  key={subItem.id}
                  type="button"
                  onClick={() => onSubItemClick?.(subItem.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: '8px',
                    border: '1px solid rgba(139, 92, 246, 0.25)',
                    background: activeTab === subItem.id ? 'linear-gradient(135deg, #8B5CF6, #7C3AED)' : 'rgba(255, 255, 255, 0.8)',
                    color: activeTab === subItem.id ? '#FFFFFF' : '#1E293B',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    textAlign: 'left',
                    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.02)',
                  }}
                  title={`Launch ${subItem.label}`}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>{subItem.icon}</span>
                    <span>{subItem.label}</span>
                  </div>
                  {subItem.badge && (
                    <span
                      style={{
                        fontSize: '0.65rem',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        background: activeTab === subItem.id ? 'rgba(255, 255, 255, 0.25)' : 'rgba(239, 68, 68, 0.15)',
                        color: activeTab === subItem.id ? '#FFFFFF' : '#DC2626',
                        fontWeight: 800,
                      }}
                    >
                      {subItem.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DashboardAiTile;
