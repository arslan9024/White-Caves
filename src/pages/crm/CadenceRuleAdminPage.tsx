/**
 * Cadence Rule Admin Page — P0-018
 *
 * CRUD interface for dynamic cadence rules that control
 * channel orchestration (WhatsApp / email / call / SMS) per lead tier/source.
 *
 * Routes consumed:
 *   GET  /api/follow-ups/rules
 *   POST /api/follow-ups/rules
 *   PATCH /api/follow-ups/rules/:id
 *   DELETE /api/follow-ups/rules/:id
 */
import React, { FC, useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { authFetch } from '../../utils/authFetch';
import {
  PageContainer,
  PageHeader,
  PageTitle,
  ActionBar,
  PrimaryButton,
  SecondaryButton,
} from './styles/CrmPageStyles';

// ─── Types ───────────────────────────────────────────────────────────────

interface ChannelStep {
  channel: 'whatsapp' | 'email' | 'call' | 'sms';
  delayMs: number;
  templateName?: string;
  description?: string;
}

interface CadenceRule {
  id: string;
  name: string;
  description: string | null;
  isActive: boolean;
  priority: number;
  leadTiers: string[];
  leadSources: string[];
  channelSequence: ChannelStep[];
  createdAt: string;
}

const EMPTY_RULE: Omit<CadenceRule, 'id' | 'createdAt'> = {
  name: '',
  description: null,
  isActive: true,
  priority: 0,
  leadTiers: [],
  leadSources: [],
  channelSequence: [{ channel: 'whatsapp', delayMs: 300000 }],
};

const TIER_OPTIONS = ['hot', 'warm', 'cold', 'inactive'];
const SOURCE_OPTIONS = [
  'direct',
  'website',
  'referral',
  'social',
  'portal',
  'cold_call',
  'event',
  'whatsapp',
];
const CHANNEL_OPTIONS: ChannelStep['channel'][] = ['whatsapp', 'email', 'call', 'sms'];

// ─── Component ───────────────────────────────────────────────────────────

const CadenceRuleAdminPage: FC = () => {
  useDocumentTitle('Cadence Rules');

  const [rules, setRules] = useState<CadenceRule[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<CadenceRule | null>(null);
  const [form, setForm] = useState(EMPTY_RULE);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await authFetch('/api/follow-ups/rules');
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to load rules');
      setRules((json.data || []) as CadenceRule[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load rules');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const openCreate = useCallback(() => {
    setEditing(null);
    setForm(EMPTY_RULE);
    setModalOpen(true);
  }, []);

  const openEdit = useCallback((rule: CadenceRule) => {
    setEditing(rule);
    setForm({
      name: rule.name,
      description: rule.description,
      isActive: rule.isActive,
      priority: rule.priority,
      leadTiers: [...rule.leadTiers],
      leadSources: [...rule.leadSources],
      channelSequence: [...rule.channelSequence],
    });
    setModalOpen(true);
  }, []);

  const handleDeactivate = useCallback(async (id: string) => {
    try {
      const res = await authFetch(`/api/follow-ups/rules/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error || 'Failed to deactivate');
      }
      setRules(prev => prev.map(r => (r.id === id ? { ...r, isActive: false } : r)));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to deactivate rule');
    }
  }, []);

  const handleSave = useCallback(async () => {
    if (!form.name.trim()) return;
    setSaving(true);
    setError(null);
    try {
      const url = editing ? `/api/follow-ups/rules/${editing.id}` : '/api/follow-ups/rules';
      const method = editing ? 'PATCH' : 'POST';
      const res = await authFetch(url, { method, body: JSON.stringify(form) });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to save rule');
      setModalOpen(false);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save rule');
    } finally {
      setSaving(false);
    }
  }, [editing, form, load]);

  const toggleTier = useCallback((tier: string) => {
    setForm(prev => ({
      ...prev,
      leadTiers: prev.leadTiers.includes(tier)
        ? prev.leadTiers.filter(t => t !== tier)
        : [...prev.leadTiers, tier],
    }));
  }, []);

  const toggleSource = useCallback((source: string) => {
    setForm(prev => ({
      ...prev,
      leadSources: prev.leadSources.includes(source)
        ? prev.leadSources.filter(s => s !== source)
        : [...prev.leadSources, source],
    }));
  }, []);

  const addStep = useCallback(() => {
    setForm(prev => ({
      ...prev,
      channelSequence: [...prev.channelSequence, { channel: 'whatsapp', delayMs: 86400000 }],
    }));
  }, []);

  const removeStep = useCallback((index: number) => {
    setForm(prev => ({
      ...prev,
      channelSequence: prev.channelSequence.filter((_, i) => i !== index),
    }));
  }, []);

  const updateStep = useCallback(
    (index: number, field: keyof ChannelStep, value: string | number) => {
      setForm(prev => ({
        ...prev,
        channelSequence: prev.channelSequence.map((step, i) =>
          i === index ? { ...step, [field]: value } : step
        ),
      }));
    },
    []
  );

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>⚙️ Cadence Rules</PageTitle>
        <Link to="/owner/crm">← Back to CRM</Link>
      </PageHeader>

      {error && (
        <div role="alert" style={{ color: '#ef4444', marginBottom: '1rem' }}>
          {error}
        </div>
      )}

      <ActionBar>
        <PrimaryButton onClick={openCreate} aria-label="Create new cadence rule">
          + New Rule
        </PrimaryButton>
      </ActionBar>

      {loading ? (
        <div role="status" aria-live="polite">
          Loading rules…
        </div>
      ) : rules.length === 0 ? (
        <div>No cadence rules yet. Create one to get started.</div>
      ) : (
        <table aria-label="Cadence rules" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', padding: '0.5rem' }}>Name</th>
              <th style={{ textAlign: 'left', padding: '0.5rem' }}>Priority</th>
              <th style={{ textAlign: 'left', padding: '0.5rem' }}>Tiers</th>
              <th style={{ textAlign: 'left', padding: '0.5rem' }}>Steps</th>
              <th style={{ textAlign: 'left', padding: '0.5rem' }}>Status</th>
              <th style={{ textAlign: 'left', padding: '0.5rem' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rules.map(rule => (
              <tr key={rule.id}>
                <td style={{ padding: '0.5rem' }}>
                  <strong>{rule.name}</strong>
                  {rule.description && (
                    <div style={{ fontSize: '0.75rem', color: '#888' }}>{rule.description}</div>
                  )}
                </td>
                <td style={{ padding: '0.5rem' }}>{rule.priority}</td>
                <td style={{ padding: '0.5rem' }}>{rule.leadTiers.join(', ') || '—'}</td>
                <td style={{ padding: '0.5rem' }}>{rule.channelSequence.length}</td>
                <td style={{ padding: '0.5rem' }}>
                  <span
                    style={{ color: rule.isActive ? '#22c55e' : '#ef4444', fontWeight: 600 }}
                    aria-label={`Status: ${rule.isActive ? 'active' : 'inactive'}`}
                  >
                    {rule.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td style={{ padding: '0.5rem', display: 'flex', gap: '0.5rem' }}>
                  <SecondaryButton
                    onClick={() => openEdit(rule)}
                    aria-label={`Edit rule ${rule.name}`}
                  >
                    Edit
                  </SecondaryButton>
                  {rule.isActive && (
                    <SecondaryButton
                      onClick={() => void handleDeactivate(rule.id)}
                      aria-label={`Deactivate rule ${rule.name}`}
                    >
                      Deactivate
                    </SecondaryButton>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Create / Edit Modal */}
      {modalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="cadence-modal-title"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: '#fff',
              borderRadius: 12,
              padding: '2rem',
              width: 560,
              maxHeight: '85vh',
              overflowY: 'auto',
            }}
          >
            <h2 id="cadence-modal-title" style={{ margin: '0 0 1.5rem' }}>
              {editing ? 'Edit Cadence Rule' : 'New Cadence Rule'}
            </h2>

            <div style={{ marginBottom: '1rem' }}>
              <label
                htmlFor="rule-name"
                style={{ display: 'block', marginBottom: 4, fontWeight: 600 }}
              >
                Rule Name *
              </label>
              <input
                id="rule-name"
                type="text"
                placeholder="e.g. Hot Lead 3-day nurture"
                value={form.name}
                onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  borderRadius: 6,
                  border: '1px solid #e2e8f0',
                }}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label
                htmlFor="rule-desc"
                style={{ display: 'block', marginBottom: 4, fontWeight: 600 }}
              >
                Description
              </label>
              <input
                id="rule-desc"
                type="text"
                placeholder="Optional description"
                value={form.description ?? ''}
                onChange={e => setForm(prev => ({ ...prev, description: e.target.value || null }))}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  borderRadius: 6,
                  border: '1px solid #e2e8f0',
                }}
              />
            </div>

            <div style={{ marginBottom: '1rem', display: 'flex', gap: '1rem' }}>
              <div style={{ flex: 1 }}>
                <label
                  htmlFor="rule-priority"
                  style={{ display: 'block', marginBottom: 4, fontWeight: 600 }}
                >
                  Priority
                </label>
                <input
                  id="rule-priority"
                  type="number"
                  min={0}
                  value={form.priority}
                  onChange={e =>
                    setForm(prev => ({ ...prev, priority: parseInt(e.target.value) || 0 }))
                  }
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    borderRadius: 6,
                    border: '1px solid #e2e8f0',
                  }}
                />
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-end', paddingBottom: '0.25rem' }}>
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    cursor: 'pointer',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={form.isActive}
                    onChange={e => setForm(prev => ({ ...prev, isActive: e.target.checked }))}
                  />
                  Active
                </label>
              </div>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <p style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Apply to lead tiers:</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {TIER_OPTIONS.map(tier => (
                  <label
                    key={tier}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                      cursor: 'pointer',
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={form.leadTiers.includes(tier)}
                      onChange={() => toggleTier(tier)}
                    />
                    {tier}
                  </label>
                ))}
              </div>
              <small style={{ color: '#888' }}>Leave empty to match all tiers.</small>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <p style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Apply to lead sources:</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {SOURCE_OPTIONS.map(src => (
                  <label
                    key={src}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                      cursor: 'pointer',
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={form.leadSources.includes(src)}
                      onChange={() => toggleSource(src)}
                    />
                    {src}
                  </label>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <p style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Channel Sequence:</p>
              {form.channelSequence.map((step, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    gap: '0.5rem',
                    marginBottom: '0.5rem',
                    alignItems: 'center',
                  }}
                >
                  <span style={{ minWidth: 20, color: '#888' }}>{i + 1}.</span>
                  <label htmlFor={`step-channel-${i}`} className="sr-only">
                    Channel for step {i + 1}
                  </label>
                  <select
                    id={`step-channel-${i}`}
                    title={`Channel for step ${i + 1}`}
                    value={step.channel}
                    onChange={e => updateStep(i, 'channel', e.target.value)}
                    style={{ padding: '0.35rem', borderRadius: 6, border: '1px solid #e2e8f0' }}
                  >
                    {CHANNEL_OPTIONS.map(c => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                  <label htmlFor={`step-delay-${i}`} className="sr-only">
                    Delay hours for step {i + 1}
                  </label>
                  <input
                    id={`step-delay-${i}`}
                    type="number"
                    min={0}
                    placeholder="Delay (hours)"
                    title={`Delay in hours for step ${i + 1}`}
                    value={Math.round(step.delayMs / 3600000)}
                    onChange={e =>
                      updateStep(i, 'delayMs', parseFloat(e.target.value) * 3600000 || 0)
                    }
                    style={{
                      width: 100,
                      padding: '0.35rem',
                      borderRadius: 6,
                      border: '1px solid #e2e8f0',
                    }}
                  />
                  <span style={{ color: '#888', fontSize: '0.75rem' }}>hrs</span>
                  {form.channelSequence.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeStep(i)}
                      aria-label={`Remove step ${i + 1}`}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: '#ef4444',
                      }}
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
              <SecondaryButton type="button" onClick={addStep} aria-label="Add channel step">
                + Add Step
              </SecondaryButton>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <SecondaryButton onClick={() => setModalOpen(false)}>Cancel</SecondaryButton>
              <PrimaryButton
                onClick={() => void handleSave()}
                disabled={saving || !form.name.trim()}
                aria-label={editing ? 'Save changes to rule' : 'Create cadence rule'}
              >
                {saving ? 'Saving…' : editing ? 'Save Changes' : 'Create Rule'}
              </PrimaryButton>
            </div>
          </div>
        </div>
      )}
    </PageContainer>
  );
};

export default CadenceRuleAdminPage;
