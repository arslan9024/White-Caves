import React, { FC, useState } from 'react';
import { Bot, Cpu, FolderTree, PanelRightClose, PanelRight, ChevronDown, ChevronRight, Layers, Mic } from 'lucide-react';
import { useExecutiveAIVSCodeSidebarLogic } from './ExecutiveAIVSCodeSidebar.logic';
import { SidebarRightExplorerTree } from './SidebarRightExplorerTree';
import { ExecutiveZoeCard } from './ExecutiveZoeCard';
import { LiveVoiceDispatchDrawer } from './LiveVoiceDispatch';
import {
  AISidebarLayoutContainer,
  AIActivityBar,
  AIActivityGroup,
  AIActivityIconBtn,
  AIDrawer,
  AIDrawerHeader,
  AIScrollArea,
  AgentMeshList,
  AgentTile,
  LeftResizeHandle,
} from './ExecutiveAIVSCodeSidebar.styles';

export interface ExecutiveAIVSCodeSidebarProps {
  onSelectAgent?: (agentId: string, agentName: string) => void;
  onSelectItem?: (key: string, label: string) => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  activeDomain?: string;
  activeEntityId?: string;
}

export const ExecutiveAIVSCodeSidebar: FC<ExecutiveAIVSCodeSidebarProps> = ({
  onSelectAgent,
  onSelectItem,
  isCollapsed: controlledCollapsed,
  onToggleCollapse,
  activeDomain,
  activeEntityId,
}) => {
  const {
    activeTab,
    isCollapsed,
    width,
    searchQuery,
    setSearchQuery,
    selectedAgentId,
    setSelectedAgentId,
    directiveInput,
    setDirectiveInput,
    toggleCollapse,
    handleSelectTab,
    handleMouseDown,
    zoe,
    managers,
  } = useExecutiveAIVSCodeSidebarLogic({
    isCollapsed: controlledCollapsed,
    onToggleCollapse,
  });

  const handleTileClick = (agentId: string, agentName: string) => {
    setSelectedAgentId(agentId);
    if (onSelectAgent) onSelectAgent(agentId, agentName);
  };

  const [isZoeSubNodesExpanded, setIsZoeSubNodesExpanded] = useState(true);
  const [isManagersExpanded, setIsManagersExpanded] = useState(true);

  const handleOpenZoeRoot = () => {
    setSelectedAgentId('zoe');
    if (onSelectAgent) onSelectAgent('zoe', 'AI Zoe · Chief Operations Officer');
  };

  return (
    <AISidebarLayoutContainer
      $isCollapsed={isCollapsed}
      $width={width}
      data-testid="executive-ai-vscode-sidebar"
    >
      {/* ── 1. Draggable Resizing Splitter on the Left Edge ─────── */}
      {!isCollapsed && <LeftResizeHandle onMouseDown={handleMouseDown} />}

      {/* ── 2. Collapsible AI Drawer ───────────────────────────── */}
      <AIDrawer $isCollapsed={isCollapsed}>
        {/* Drawer Header */}
        <AIDrawerHeader>
          <div className="title-wrap">
            {activeTab === 'explorer' ? (
              <>
                <FolderTree size={14} color="#EF4444" />
                <span>White Caves Explorer</span>
              </>
            ) : (
              <>
                <Cpu size={14} color="#EF4444" />
                <span>AI Command Center</span>
              </>
            )}
          </div>
          <div className="header-actions">
            <button onClick={toggleCollapse} title="Collapse AI Panel">
              {isCollapsed ? <PanelRight size={14} /> : <PanelRightClose size={14} />}
            </button>
          </div>
        </AIDrawerHeader>

        {/* ── View Selection in Drawer ── */}
        {activeTab === 'explorer' ? (
          <SidebarRightExplorerTree
            filterQuery={searchQuery}
            activeDomain={activeDomain}
            activeEntityId={activeEntityId}
            onSelectItem={(key, label) => {
              if (onSelectItem) onSelectItem(key, label);
            }}
          />
        ) : (
          <>
            {/* 👑 Zoe Executive Chief AI Root Card */}
            <ExecutiveZoeCard
              zoeName={zoe.name}
              directiveInput={directiveInput}
              setDirectiveInput={setDirectiveInput}
              onDispatchRoute={route => onSelectItem?.(`route-${route}`, route)}
              onOpenZoeSuite={handleOpenZoeRoot}
              isExpanded={isZoeSubNodesExpanded}
              onToggleExpand={() => setIsZoeSubNodesExpanded(prev => !prev)}
              isSelected={selectedAgentId === 'zoe'}
            />

            {/* Scrollable Sub-Items Nested Under Zoe Root */}
            <AIScrollArea>
              {isZoeSubNodesExpanded && (
                <div
                  style={{
                    paddingLeft: '6px',
                    borderLeft: '1px dashed rgba(239, 68, 68, 0.3)',
                    marginLeft: '8px',
                    marginBottom: '12px',
                  }}
                  data-testid="zoe-sub-nodes-container"
                >
                  <div
                    style={{
                      fontSize: '0.62rem',
                      fontWeight: 800,
                      color: '#94A3B8',
                      textTransform: 'uppercase',
                      letterSpacing: '0.6px',
                      marginBottom: '6px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <Layers size={11} color="#EF4444" />
                    <span>Zoe Sovereign Mesh Sub-Items</span>
                  </div>

                  <button
                    type="button"
                    data-testid="open-ai-command-center-main-btn"
                    onClick={() => {
                      if (onSelectAgent) onSelectAgent('ai-command', 'AI Command Center');
                    }}
                    style={{
                      width: '100%',
                      marginBottom: '6px',
                      padding: '7px 9px',
                      borderRadius: '7px',
                      background:
                        'linear-gradient(135deg, rgba(239, 68, 68, 0.15), rgba(15, 23, 42, 0.85))',
                      border: '1px solid rgba(239, 68, 68, 0.4)',
                      color: '#F8FAFC',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <span>🔱 AIAMS Workforce Hub (120 Nodes)</span>
                    <span style={{ color: '#FCA5A5', fontSize: '0.62rem' }}>AIAMS →</span>
                  </button>

                  <button
                    type="button"
                    data-testid="open-linda-main-btn"
                    onClick={() => {
                      handleTileClick('linda', 'AI Linda · WhatsApp Bot Operations Center');
                    }}
                    style={{
                      width: '100%',
                      marginBottom: '6px',
                      padding: '7px 9px',
                      borderRadius: '7px',
                      background:
                        'linear-gradient(135deg, rgba(37, 211, 102, 0.18), rgba(15, 23, 42, 0.85))',
                      border: '1px solid rgba(37, 211, 102, 0.45)',
                      color: '#ECFDF5',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <span>🤖 AI Linda · WhatsApp Operations</span>
                    <span style={{ color: '#86EFAC', fontSize: '0.62rem' }}>Launch →</span>
                  </button>

                  <button
                    type="button"
                    data-testid="open-mary-main-btn"
                    onClick={() => {
                      handleTileClick('mary', 'AI Mary · 9,378+ Inventory Master Control');
                    }}
                    style={{
                      width: '100%',
                      marginBottom: '8px',
                      padding: '7px 9px',
                      borderRadius: '7px',
                      background:
                        'linear-gradient(135deg, rgba(59, 130, 246, 0.18), rgba(15, 23, 42, 0.85))',
                      border: '1px solid rgba(59, 130, 246, 0.45)',
                      color: '#EFF6FF',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <span>📦 AI Mary · Inventory Studio</span>
                    <span style={{ color: '#93C5FD', fontSize: '0.62rem' }}>Studio →</span>
                  </button>

                  {/* Collapsible 12 Department Managers Sub-Group */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '0.62rem',
                      fontWeight: 800,
                      color: '#94A3B8',
                      textTransform: 'uppercase',
                      letterSpacing: '0.6px',
                      margin: '10px 0 6px 0',
                      cursor: 'pointer',
                      userSelect: 'none',
                    }}
                    onClick={() => setIsManagersExpanded(prev => !prev)}
                    data-testid="toggle-managers-subgroup-btn"
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                      {isManagersExpanded ? <ChevronDown size={11} /> : <ChevronRight size={11} />}
                      <span>12 Dept Managers ({managers.length})</span>
                    </span>
                    <span style={{ color: '#64748B', fontSize: '0.58rem' }}>Under Zoe</span>
                  </div>

                  {isManagersExpanded && (
                    <AgentMeshList>
                      {managers.map(mgr => {
                        const isSelected = selectedAgentId === mgr.id;
                        return (
                          <AgentTile
                            key={mgr.id}
                            data-testid={`right-sidebar-agent-${mgr.id}`}
                            $accentColor={mgr.color}
                            $isSelected={isSelected}
                            onClick={() => handleTileClick(mgr.id, `${mgr.name} · ${mgr.title}`)}
                          >
                            <div className="agent-header">
                              <div className="name-title">
                                <span className="agent-name">{mgr.name}</span>
                                <span className="agent-code">{mgr.deptCode}</span>
                              </div>
                              <span className="sla-rate">99.8% SLA</span>
                            </div>
                            <div className="agent-desc">
                              {mgr.title} · {mgr.deptName}
                            </div>
                          </AgentTile>
                        );
                      })}
                    </AgentMeshList>
                  )}
                </div>
              )}
            </AIScrollArea>
          </>
        )}
      </AIDrawer>

      {/* ── 3. Vertical Activity Bar on Rightmost Edge (48px) ──── */}
      <AIActivityBar>
        <AIActivityGroup>
          <AIActivityIconBtn
            $isActive={activeTab === 'ai-command'}
            onClick={() => {
              handleSelectTab('ai-command');
              if (onSelectAgent) onSelectAgent('ai-command', 'AI Command Center');
            }}
            title="AI Command Center (Zoe + Multi-Agent Mesh)"
            data-testid="activity-btn-ai-command"
          >
            <Bot size={18} />
          </AIActivityIconBtn>

          <AIActivityIconBtn
            $isActive={activeTab === 'explorer'}
            onClick={() => handleSelectTab('explorer')}
            title="White Caves Explorer (1-12-108 Hierarchy)"
            data-testid="activity-btn-explorer-right"
          >
            <FolderTree size={18} />
          </AIActivityIconBtn>
        </AIActivityGroup>
      </AIActivityBar>
    </AISidebarLayoutContainer>
  );
};

export default ExecutiveAIVSCodeSidebar;
