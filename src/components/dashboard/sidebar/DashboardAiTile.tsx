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
  onTileClick: () => void;
  onSelectAiAssistant: (option: SearchableOption) => void;
}

export const DashboardAiTile: FC<DashboardAiTileProps> = ({
  isOpen,
  isCollapsed,
  selectedAi,
  selectedAiId,
  onTileClick,
  onSelectAiAssistant,
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
        </div>
      )}
    </div>
  );
};

export default DashboardAiTile;
