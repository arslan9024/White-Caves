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
import './CadenceRuleAdminPage.css';

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
        <div role="alert" className="cadence-alert">
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
        <table aria-label="Cadence rules" className="cadence-table">
          <thead>
            <tr>
              <th className="cadence-th">Name</th>
              <th className="cadence-th">Priority</th>
              <th className="cadence-th">Tiers</th>
              <th className="cadence-th">Steps</th>
              <th className="cadence-th">Status</th>
              <th className="cadence-th">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rules.map(rule => (
              <tr key={rule.id}>
                <td className="cadence-td">
                  <strong>{rule.name}</strong>
                  {rule.description && (
                    <div className="cadence-rule-description">{rule.description}</div>
                  )}
                </td>
                <td className="cadence-td">{rule.priority}</td>
                <td className="cadence-td">{rule.leadTiers.join(', ') || '—'}</td>
                <td className="cadence-td">{rule.channelSequence.length}</td>
                <td className="cadence-td">
                  <span
                    className={
                      rule.isActive
                        ? 'cadence-status cadence-status--active'
                        : 'cadence-status cadence-status--inactive'
                    }
                    aria-label={`Status: ${rule.isActive ? 'active' : 'inactive'}`}
                  >
                    {rule.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="cadence-td cadence-actions-cell">
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
          className="cadence-modal-overlay"
        >
          <div className="cadence-modal">
            <h2 id="cadence-modal-title" className="cadence-modal-title">
              {editing ? 'Edit Cadence Rule' : 'New Cadence Rule'}
            </h2>

            <div className="cadence-field">
              <label htmlFor="rule-name" className="cadence-label">
                Rule Name *
              </label>
              <input
                id="rule-name"
                type="text"
                placeholder="e.g. Hot Lead 3-day nurture"
                value={form.name}
                onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
                className="cadence-input"
              />
            </div>

            <div className="cadence-field">
              <label htmlFor="rule-desc" className="cadence-label">
                Description
              </label>
              <input
                id="rule-desc"
                type="text"
                placeholder="Optional description"
                value={form.description ?? ''}
                onChange={e => setForm(prev => ({ ...prev, description: e.target.value || null }))}
                className="cadence-input"
              />
            </div>

            <div className="cadence-row">
              <div className="cadence-priority-col">
                <label htmlFor="rule-priority" className="cadence-label">
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
                  className="cadence-input"
                />
              </div>
              <div className="cadence-active-col">
                <label className="cadence-checkbox-label">
                  <input
                    type="checkbox"
                    checked={form.isActive}
                    onChange={e => setForm(prev => ({ ...prev, isActive: e.target.checked }))}
                  />
                  Active
                </label>
              </div>
            </div>

            <div className="cadence-section">
              <p className="cadence-section-title">Apply to lead tiers:</p>
              <div className="cadence-check-grid">
                {TIER_OPTIONS.map(tier => (
                  <label key={tier} className="cadence-check-label">
                    <input
                      type="checkbox"
                      checked={form.leadTiers.includes(tier)}
                      onChange={() => toggleTier(tier)}
                    />
                    {tier}
                  </label>
                ))}
              </div>
              <small className="cadence-help">Leave empty to match all tiers.</small>
            </div>

            <div className="cadence-section cadence-section--lg">
              <p className="cadence-section-title">Apply to lead sources:</p>
              <div className="cadence-check-grid">
                {SOURCE_OPTIONS.map(src => (
                  <label key={src} className="cadence-check-label">
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

            <div className="cadence-section cadence-section--lg">
              <p className="cadence-section-title">Channel Sequence:</p>
              {form.channelSequence.map((step, i) => (
                <div key={i} className="cadence-step-row">
                  <span className="cadence-step-index">{i + 1}.</span>
                  <label htmlFor={`step-channel-${i}`} className="sr-only">
                    Channel for step {i + 1}
                  </label>
                  <select
                    id={`step-channel-${i}`}
                    title={`Channel for step ${i + 1}`}
                    value={step.channel}
                    onChange={e => updateStep(i, 'channel', e.target.value)}
                    className="cadence-step-select"
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
                    className="cadence-step-input"
                  />
                  <span className="cadence-step-unit">hrs</span>
                  {form.channelSequence.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeStep(i)}
                      aria-label={`Remove step ${i + 1}`}
                      className="cadence-step-remove"
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

            <div className="cadence-footer">
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
