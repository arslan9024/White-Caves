/**
 * White Caves Real Estate LLC - AI Assistants CRUD Management View
 * Standard: AEGIS Canonical 12-Way Architecture Standard & Single Purpose File Law (< 350 lines)
 * Primitives: Chakra UI <Flex>, <Grid>, <Card> & Theme token dynamic colors (#0F172A / #FFFFFF)
 */

import React, { FC, useState } from 'react';
import { Bot, Plus, Trash2, RefreshCw, Cpu } from 'lucide-react';
import { Flex, Grid, Card, CardHeader, CardBody } from '../../ui/chakra';
import { useTheme } from '../../../context/ThemeContext';

export interface AiAssistantRecord {
  id: string;
  agentId: string;
  name: string;
  role: string;
  department: string;
  status: string;
  tier: string;
  model: string;
  activeWorkload: number;
}

const INITIAL_SEED: AiAssistantRecord[] = [
  {
    id: 'ai-linda-001',
    agentId: 'linda',
    name: 'AI Linda',
    role: 'Autonomous WhatsApp Broker & Lead Nurturer',
    department: 'Marketing & Strategic Growth',
    status: 'ACTIVE',
    tier: 'SPECIALIST',
    model: 'gemini-1.5-flash',
    activeWorkload: 14,
  },
  {
    id: 'ai-zoe-001',
    agentId: 'zoe',
    name: 'AI Zoe',
    role: 'Chief Operating Partner & Autonomous Workforce Orchestrator',
    department: 'Executive Governance & Sovereign Operations',
    status: 'ACTIVE',
    tier: 'EXECUTIVE',
    model: 'gemini-1.5-pro',
    activeWorkload: 28,
  },
  {
    id: 'ai-ada-001',
    agentId: 'ada',
    name: 'Ada Lovelace',
    role: 'Chief Architect Lead',
    department: 'Autonomous Agent Orchestration',
    status: 'ACTIVE',
    tier: 'SUPERVISOR',
    model: 'gemini-1.5-pro',
    activeWorkload: 8,
  },
];

export const AiAssistantCrudTable: FC = () => {
  const { isDark } = useTheme();
  const [assistants, setAssistants] = useState<AiAssistantRecord[]>(INITIAL_SEED);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    agentId: '',
    name: '',
    role: '',
    department: 'Autonomous Agent Orchestration',
    tier: 'SUPERVISOR',
    status: 'ACTIVE',
  });

  const cardBg = isDark ? '#0F172A' : '#FFFFFF';
  const textColor = isDark ? '#F8FAFC' : '#0F172A';
  const subtextColor = isDark ? '#94A3B8' : '#64748B';
  const borderTone = isDark ? 'rgba(255, 255, 255, 0.08)' : '#E2E8F0';

  const fetchAssistants = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/v1/ai-assistants');
      if (res.ok) {
        const body = await res.json();
        if (body.data && Array.isArray(body.data)) setAssistants(body.data);
      }
    } catch {
      // Retain local state
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.agentId || !formData.name || !formData.role) return;

    const newRecord: AiAssistantRecord = {
      id: `ai-${Date.now()}`,
      agentId: formData.agentId,
      name: formData.name,
      role: formData.role,
      department: formData.department,
      status: formData.status,
      tier: formData.tier,
      model: 'gemini-1.5-flash',
      activeWorkload: 0,
    };

    setAssistants(prev => [newRecord, ...prev]);
    setIsCreating(false);
    setFormData({
      agentId: '',
      name: '',
      role: '',
      department: 'Autonomous Agent Orchestration',
      tier: 'SUPERVISOR',
      status: 'ACTIVE',
    });
  };

  const handleDelete = (agentId: string) => {
    setAssistants(prev => prev.filter(a => a.agentId !== agentId && a.id !== agentId));
  };

  return (
    <Flex direction="column" gap={16} w="100%" p={16} data-testid="ai-assistant-crud-root">
      <Flex align="center" justify="space-between" wrap="wrap" gap={12}>
        <Flex align="center" gap={10}>
          <Cpu size={24} color="#EF4444" />
          <div>
            <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: textColor }}>
              AI Mesh Management & Sovereign Agent Ledger
            </h2>
            <p style={{ margin: 0, fontSize: '0.8rem', color: subtextColor }}>
              AiAssistantAgent relational database CRUD table & 1-12-108 workforce synchronizer
            </p>
          </div>
        </Flex>

        <Flex gap={8}>
          <button
            type="button"
            onClick={fetchAssistants}
            data-testid="refresh-ai-assistants-btn"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              background: isDark ? '#1E293B' : '#F1F5F9',
              color: textColor,
              border: `1px solid ${borderTone}`,
              borderRadius: '8px',
              fontSize: '0.78rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <RefreshCw size={13} className={isLoading ? 'animate-spin' : ''} />
            Refresh
          </button>
          <button
            type="button"
            onClick={() => setIsCreating(prev => !prev)}
            data-testid="add-ai-assistant-btn"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              background: '#EF4444',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '8px',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            <Plus size={14} /> Register Agent
          </button>
        </Flex>
      </Flex>

      {isCreating && (
        <Card bg={cardBg} borderColor="#EF4444" p={16} data-testid="ai-assistant-form-card">
          <form onSubmit={handleCreate}>
            <Grid templateColumns="repeat(auto-fit, minmax(200px, 1fr))" gap={12} m="0 0 12px 0">
              <div>
                <label
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: subtextColor,
                    display: 'block',
                    marginBottom: '4px',
                  }}
                >
                  Agent ID (Key)
                </label>
                <input
                  required
                  placeholder="e.g. dept-02-sup-01"
                  value={formData.agentId}
                  onChange={e => setFormData({ ...formData, agentId: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: '6px',
                    border: `1px solid ${borderTone}`,
                    background: isDark ? '#020617' : '#F8FAFC',
                    color: textColor,
                    fontSize: '0.8rem',
                  }}
                  data-testid="input-agent-id"
                />
              </div>
              <div>
                <label
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: subtextColor,
                    display: 'block',
                    marginBottom: '4px',
                  }}
                >
                  Agent Name
                </label>
                <input
                  required
                  placeholder="e.g. Una View Primitive"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: '6px',
                    border: `1px solid ${borderTone}`,
                    background: isDark ? '#020617' : '#F8FAFC',
                    color: textColor,
                    fontSize: '0.8rem',
                  }}
                  data-testid="input-agent-name"
                />
              </div>
              <div>
                <label
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: subtextColor,
                    display: 'block',
                    marginBottom: '4px',
                  }}
                >
                  Role & Specialization
                </label>
                <input
                  required
                  placeholder="e.g. UI/UX View Architect"
                  value={formData.role}
                  onChange={e => setFormData({ ...formData, role: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: '6px',
                    border: `1px solid ${borderTone}`,
                    background: isDark ? '#020617' : '#F8FAFC',
                    color: textColor,
                    fontSize: '0.8rem',
                  }}
                  data-testid="input-agent-role"
                />
              </div>
            </Grid>
            <Flex justify="flex-end" gap={8}>
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  border: `1px solid ${borderTone}`,
                  background: 'transparent',
                  color: textColor,
                  fontSize: '0.78rem',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                data-testid="submit-create-agent-btn"
                style={{
                  padding: '6px 14px',
                  borderRadius: '6px',
                  border: 'none',
                  background: '#10B981',
                  color: '#FFFFFF',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Save Agent to Table
              </button>
            </Flex>
          </form>
        </Card>
      )}

      <Grid
        templateColumns="repeat(auto-fill, minmax(320px, 1fr))"
        gap={16}
        data-testid="chakra-agent-grid"
      >
        {assistants.map(item => (
          <Card
            key={item.agentId}
            bg={cardBg}
            borderColor={borderTone}
            data-testid={`agent-card-${item.agentId}`}
          >
            <CardHeader>
              <Flex align="center" gap={8}>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    background: 'rgba(239, 68, 68, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#EF4444',
                  }}
                >
                  <Bot size={18} />
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 800, color: textColor }}>
                    {item.name}
                  </h4>
                  <span style={{ fontSize: '0.68rem', color: '#EF4444', fontWeight: 700 }}>
                    {item.tier}
                  </span>
                </div>
              </Flex>
              <span
                style={{
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  padding: '2px 8px',
                  borderRadius: '12px',
                  background:
                    item.status === 'ACTIVE'
                      ? 'rgba(16, 185, 129, 0.15)'
                      : 'rgba(239, 68, 68, 0.15)',
                  color: item.status === 'ACTIVE' ? '#10B981' : '#EF4444',
                }}
              >
                {item.status}
              </span>
            </CardHeader>

            <CardBody>
              <p style={{ margin: 0, fontSize: '0.78rem', color: subtextColor, minHeight: '36px' }}>
                {item.role}
              </p>
              <div
                style={{
                  fontSize: '0.72rem',
                  color: textColor,
                  background: isDark ? '#020617' : '#F8FAFC',
                  padding: '6px 10px',
                  borderRadius: '6px',
                }}
              >
                <strong>Dept:</strong> {item.department}
              </div>
              <Flex
                justify="space-between"
                align="center"
                style={{ fontSize: '0.7rem', color: subtextColor }}
              >
                <span>Workload: {item.activeWorkload} tasks</span>
                <span>Model: {item.model}</span>
              </Flex>
            </CardBody>

            <Flex
              justify="flex-end"
              gap={6}
              style={{ marginTop: '12px', paddingTop: '8px', borderTop: `1px solid ${borderTone}` }}
            >
              <button
                type="button"
                onClick={() => handleDelete(item.agentId)}
                data-testid={`delete-agent-${item.agentId}`}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#EF4444',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  padding: '4px 8px',
                }}
              >
                <Trash2 size={13} /> Delete
              </button>
            </Flex>
          </Card>
        ))}
      </Grid>
    </Flex>
  );
};

export default AiAssistantCrudTable;
