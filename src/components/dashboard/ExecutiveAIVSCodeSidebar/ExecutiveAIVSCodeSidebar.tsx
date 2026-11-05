import React, { FC } from 'react';
import {
  Bot,
  Cpu,
  GitFork,
  MessageSquare,
  Search,
  Sparkles,
  Send,
  PanelRightClose,
  PanelRight,
  Zap,
} from 'lucide-react';
import { useExecutiveAIVSCodeSidebarLogic } from './ExecutiveAIVSCodeSidebar.logic';
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
}

export const ExecutiveAIVSCodeSidebar: FC<ExecutiveAIVSCodeSidebarProps> = ({ onSelectAgent }) => {
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
  } = useExecutiveAIVSCodeSidebarLogic();

  const handleTileClick = (agentId: string, agentName: string) => {
    setSelectedAgentId(agentId);
    if (onSelectAgent) onSelectAgent(agentId, agentName);
  };

  const handleSendDirective = (e: React.FormEvent) => {
    e.preventDefault();
    if (!directiveInput.trim()) return;
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
            <Cpu size={14} color="#EF4444" />
            <span>AI Command Center</span>
          </div>
          <div className="header-actions">
            <button onClick={toggleCollapse} title="Collapse AI Panel">
              {isCollapsed ? <PanelRight size={14} /> : <PanelRightClose size={14} />}
            </button>
          </div>
        </AIDrawerHeader>

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
            />
            <button type="submit" title="Send Directive">
              <Send size={11} />
            </button>
          </form>
        </ZoeExecutiveCard>

        {/* Search Input for 12 Department AI Managers */}
        <div style={{ padding: '0 12px 10px 12px' }}>
          <div
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Search size={13} style={{ position: 'absolute', left: '10px', color: '#64748B' }} />
            <input
              type="text"
              placeholder="Filter 12 AI Department Managers..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                background: '#070D18',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '6px',
                padding: '6px 10px 6px 30px',
                fontSize: '0.72rem',
                color: '#FFFFFF',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>
        </div>

        {/* Scrollable Agent Mesh List */}
        <AIScrollArea>
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
      </AIDrawer>

      {/* ── 3. Vertical Activity Bar on Rightmost Edge (48px) ──── */}
      <AIActivityBar>
        <AIActivityGroup>
          <AIActivityIconBtn
            $isActive={activeTab === 'agent-mesh'}
            onClick={() => handleSelectTab('agent-mesh')}
            title="Multi-Agent Mesh (12 Managers)"
          >
            <Cpu size={18} />
          </AIActivityIconBtn>

          <AIActivityIconBtn
            $isActive={activeTab === 'zoe-chat'}
            onClick={() => handleSelectTab('zoe-chat')}
            title="Executive Zoe Directives"
          >
            <Bot size={18} />
          </AIActivityIconBtn>

          <AIActivityIconBtn
            $isActive={activeTab === 'organogram'}
            onClick={() => handleSelectTab('organogram')}
            title="1-12-108 Live Organogram"
          >
            <GitFork size={18} />
          </AIActivityIconBtn>
        </AIActivityGroup>

        <AIActivityGroup>
          <AIActivityIconBtn
            $isActive={activeTab === 'prompts'}
            onClick={() => handleSelectTab('prompts')}
            title="AI Persona Directives & Guardrails"
          >
            <Sparkles size={18} />
          </AIActivityIconBtn>
        </AIActivityGroup>
      </AIActivityBar>
    </AISidebarLayoutContainer>
  );
};

export default ExecutiveAIVSCodeSidebar;
