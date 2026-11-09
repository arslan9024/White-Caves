import React, { FC, useState } from 'react';
import { Bot, Cpu, FolderTree, Send, PanelRightClose, PanelRight, Zap } from 'lucide-react';
import { useExecutiveAIVSCodeSidebarLogic } from './ExecutiveAIVSCodeSidebar.logic';
import { SidebarRightExplorerTree } from './SidebarRightExplorerTree';
import {
  AISidebarLayoutContainer,
  AIActivityBar,
  AIActivityGroup,
  AIActivityIconBtn,
  AIDrawer,
  AIDrawerHeader,
  ZoeExecutiveCard,
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

  const [lastDirectiveResult, setLastDirectiveResult] = useState<{
    text: string;
    action: string;
    timestamp: string;
  } | null>(null);

  const handleTileClick = (agentId: string, agentName: string) => {
    setSelectedAgentId(agentId);
    if (onSelectAgent) onSelectAgent(agentId, agentName);
  };

  const handleSendDirective = (e: React.FormEvent) => {
    e.preventDefault();
    if (!directiveInput.trim()) return;

    const input = directiveInput.trim().toLowerCase();
    let action = 'Operations Dispatch';
    let text = `Directive received by AI Zoe: Executing '${directiveInput.trim()}' across 12 departments.`;

    if (input.includes('ejari') || input.includes('expir')) {
      action = 'Dept 04 • Ejari Audit';
      text = 'Zoe audited 14 active Ejari contracts: 2 renewals due in 30 days dispatched to Dept 04.';
    } else if (input.includes('aml') || input.includes('kyc') || input.includes('rera')) {
      action = 'Dept 10 • Statutory Gate';
      text = 'Zoe verified AML/KYC registry: All VIP investors cleared via UAE FIU GoAML screening.';
    } else if (input.includes('luxury') || input.includes('palm') || input.includes('villa')) {
      action = 'Dept 01 • Luxury Matching';
      text = 'Zoe dispatched VIP buyer profile to Dept 01: 3 signature villas matched in Palm Jumeirah.';
    }

    setLastDirectiveResult({
      text,
      action,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    });
    setDirectiveInput('');
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
            {/* 👑 Zoe Executive Chief AI Card */}
            <ZoeExecutiveCard>
              <div className="zoe-top">
                <div className="partner-info">
                  <div className="zoe-avatar">Z</div>
                  <div className="name-group">
                    <span className="name">{zoe.name}</span>
                    <span className="role">COO Executive AI Partner</span>
                  </div>
                </div>
                <div className="status-badge">
                  <Zap size={10} />
                  <span>Optimal</span>
                </div>
              </div>

              <form className="directive-box" onSubmit={handleSendDirective}>
                <input
                  type="text"
                  placeholder="Direct Zoe (e.g. 'audit Ejari expiries')..."
                  value={directiveInput}
                  onChange={e => setDirectiveInput(e.target.value)}
                  data-testid="zoe-directive-input"
                />
                <button type="submit" title="Send Directive" data-testid="zoe-directive-submit">
                  <Send size={11} />
                </button>
              </form>

              {lastDirectiveResult && (
                <div
                  data-testid="zoe-directive-result"
                  style={{
                    marginTop: '8px',
                    padding: '8px 10px',
                    borderRadius: '6px',
                    background: 'rgba(239, 68, 68, 0.12)',
                    border: '1px solid rgba(239, 68, 68, 0.35)',
                    fontSize: '0.68rem',
                    color: '#F8FAFC',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                    <span style={{ fontWeight: 800, color: '#EF4444' }}>{lastDirectiveResult.action}</span>
                    <span style={{ color: '#94A3B8' }}>{lastDirectiveResult.timestamp}</span>
                  </div>
                  <div style={{ lineHeight: 1.35 }}>{lastDirectiveResult.text}</div>
                </div>
              )}
            </ZoeExecutiveCard>

            {/* Scrollable Agent Mesh List */}
            <AIScrollArea>
              <button
                type="button"
                data-testid="open-ai-command-center-main-btn"
                onClick={() => {
                  if (onSelectAgent) onSelectAgent('ai-command', 'AI Command Center');
                }}
                style={{
                  width: '100%',
                  marginBottom: '8px',
                  padding: '8px 10px',
                  borderRadius: '8px',
                  background:
                    'linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(15, 23, 42, 0.9))',
                  border: '1px solid rgba(239, 68, 68, 0.45)',
                  color: '#F8FAFC',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <span>🔱 Open AIAMS Workforce Hub</span>
                <span style={{ color: '#FCA5A5', fontSize: '0.65rem' }}>AIAMS →</span>
              </button>

              <button
                type="button"
                data-testid="open-linda-main-btn"
                onClick={() => {
                  handleTileClick('linda', 'AI Linda · WhatsApp Bot Operations Center');
                }}
                style={{
                  width: '100%',
                  marginBottom: '12px',
                  padding: '8px 10px',
                  borderRadius: '8px',
                  background:
                    'linear-gradient(135deg, rgba(37, 211, 102, 0.22), rgba(15, 23, 42, 0.92))',
                  border: '1px solid rgba(37, 211, 102, 0.5)',
                  color: '#ECFDF5',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <span>🤖 WhatsApp Bot Operations Center (v2.0)</span>
                <span style={{ color: '#86EFAC', fontSize: '0.65rem' }}>Launch UI →</span>
              </button>

              <div
                style={{
                  fontSize: '0.65rem',
                  fontWeight: 800,
                  color: '#64748B',
                  textTransform: 'uppercase',
                  letterSpacing: '0.6px',
                  marginBottom: '8px',
                  paddingLeft: '2px',
                }}
              >
                Department Manager Mesh ({managers.length})
              </div>

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
