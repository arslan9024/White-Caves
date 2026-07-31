/**
 * CadenceRuleAdmin — Admin UI for managing dynamic cadence rules
 *
 * Allows managers/admins/owners to:
 *   - View all cadence rules with status, priority, and tier coverage
 *   - Create new rules with channel sequence steps
 *   - Toggle rules active/inactive
 *   - Edit existing rules
 *
 * Routes consumed:
 *   GET    /api/follow-ups/rules
 *   POST   /api/follow-ups/rules
 *   PATCH  /api/follow-ups/rules/:id
 */

import React, { useState, useEffect, useCallback } from 'react';
import { authFetch } from '../../utils/authFetch';

// ─── Types ──────────────────────────────────────────────────────────────────

interface CadenceRuleStep {
  stepNumber: number;
  channel: 'whatsapp' | 'email' | 'call' | 'sms';
  delayMs: number;
  templateName: string;
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
  dealTypes: string[];
  channelSequence: CadenceRuleStep[];
  quietHoursStart: string | null;
  quietHoursEnd: string | null;
  dailyCapPerLead: number;
  cooldownHours: number;
  createdAt: string;
  updatedAt: string;
}

type FormMode = 'idle' | 'creating' | 'editing';

interface RuleFormState {
  name: string;
  description: string;
  isActive: boolean;
  priority: string;
  leadTiers: string;
  leadSources: string;
  dealTypes: string;
  channelSequence: string;
  quietHoursStart: string;
  quietHoursEnd: string;
  dailyCapPerLead: string;
  cooldownHours: string;
}

const DEFAULT_FORM: RuleFormState = {
  name: '',
  description: '',
  isActive: true,
  priority: '0',
  leadTiers: '',
  leadSources: '',
  dealTypes: '',
  channelSequence: JSON.stringify(
    [{ stepNumber: 1, channel: 'whatsapp', delayMs: 300000, templateName: 'initial_contact', description: 'First touch' }],
    null,
    2,
  ),
  quietHoursStart: '',
  quietHoursEnd: '',
  dailyCapPerLead: '3',
  cooldownHours: '24',
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function csvToArray(csv: string): string[] {
  return csv
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);
}

function ruleToForm(rule: CadenceRule): RuleFormState {
  return {
    name: rule.name,
    description: rule.description ?? '',
    isActive: rule.isActive,
    priority: String(rule.priority),
    leadTiers: rule.leadTiers.join(', '),
    leadSources: rule.leadSources.join(', '),
    dealTypes: rule.dealTypes.join(', '),
    channelSequence: JSON.stringify(rule.channelSequence, null, 2),
    quietHoursStart: rule.quietHoursStart ?? '',
    quietHoursEnd: rule.quietHoursEnd ?? '',
    dailyCapPerLead: String(rule.dailyCapPerLead),
    cooldownHours: String(rule.cooldownHours),
  };
}

function formToPayload(form: RuleFormState): Record<string, unknown> {
  return {
    name: form.name.trim(),
    description: form.description.trim() || null,
    isActive: form.isActive,
    priority: Math.max(0, parseInt(form.priority) || 0),
    leadTiers: csvToArray(form.leadTiers),
    leadSources: csvToArray(form.leadSources),
    dealTypes: csvToArray(form.dealTypes),
    channelSequence: JSON.parse(form.channelSequence) as CadenceRuleStep[],
    quietHoursStart: form.quietHoursStart.trim() || null,
    quietHoursEnd: form.quietHoursEnd.trim() || null,
    dailyCapPerLead: Math.max(1, parseInt(form.dailyCapPerLead) || 3),
    cooldownHours: Math.max(0, parseInt(form.cooldownHours) || 24),
  };
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function TierBadge({ tier }: { tier: string }) {
  const colours: Record<string, string> = {
    hot: '#dc2626',
    warm: '#d97706',
    cold: '#2563eb',
    inactive: '#6b7280',
  };
  return (
    <span
      style={{
        background: colours[tier] ?? '#6b7280',
        color: '#fff',
        padding: '2px 8px',
        borderRadius: 4,
        fontSize: 11,
        fontWeight: 600,
        marginRight: 4,
      }}
    >
      {tier}
    </span>
  );
}

function RuleRow({
  rule,
  onToggle,
  onEdit,
  toggling,
}: {
  rule: CadenceRule;
  onToggle: (id: string, active: boolean) => void;
  onEdit: (rule: CadenceRule) => void;
  toggling: boolean;
}) {
  return (
    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
      <td style={{ padding: '10px 12px' }}>
        <strong style={{ color: rule.isActive ? 'var(--text-primary)' : 'var(--text-secondary)' }}>{rule.name}</strong>
        {rule.description && (
          <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 2 }}>{rule.description}</div>
        )}
      </td>
      <td style={{ padding: '10px 12px', textAlign: 'center' }}>
        <span
          style={{
            display: 'inline-block',
            width: 10,
            height: 10,
            borderRadius: '50%',
            background: rule.isActive ? '#22c55e' : '#6b7280',
            marginRight: 6,
          }}
        />
        {rule.isActive ? 'Active' : 'Inactive'}
      </td>
      <td style={{ padding: '10px 12px', textAlign: 'center' }}>{rule.priority}</td>
      <td style={{ padding: '10px 12px' }}>
        {rule.leadTiers.length > 0
          ? rule.leadTiers.map(t => <TierBadge key={t} tier={t} />)
          : <span style={{ color: '#6b7280', fontSize: 12 }}>all tiers</span>}
      </td>
      <td style={{ padding: '10px 12px', textAlign: 'center' }}>{rule.channelSequence.length} steps</td>
      <td style={{ padding: '10px 12px' }}>
        <button
          aria-label={rule.isActive ? `Deactivate ${rule.name}` : `Activate ${rule.name}`}
          onClick={() => onToggle(rule.id, !rule.isActive)}
          disabled={toggling}
          style={{
            background: rule.isActive ? '#7f1d1d' : '#14532d',
            color: '#fff',
            border: 'none',
            borderRadius: 6,
            padding: '4px 10px',
            fontSize: 12,
            cursor: toggling ? 'not-allowed' : 'pointer',
            marginRight: 6,
          }}
        >
          {rule.isActive ? 'Deactivate' : 'Activate'}
        </button>
        <button
          aria-label={`Edit ${rule.name}`}
          onClick={() => onEdit(rule)}
          style={{
            background: '#1e3a5f',
            color: '#f5f5f0',
            border: 'none',
            borderRadius: 6,
            padding: '4px 10px',
            fontSize: 12,
            cursor: 'pointer',
          }}
        >
          Edit
        </button>
      </td>
    </tr>
  );
}

function RuleForm({
  form,
  onChange,
  onSubmit,
  onCancel,
  submitLabel,
  submitError,
  submitting,
}: {
  form: RuleFormState;
  onChange: (key: keyof RuleFormState, value: string | boolean) => void;
  onSubmit: () => void;
  onCancel: () => void;
  submitLabel: string;
  submitError: string | null;
  submitting: boolean;
}) {
  const [seqError, setSeqError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      JSON.parse(form.channelSequence);
      setSeqError(null);
    } catch {
      setSeqError('channelSequence must be valid JSON');
      return;
    }
    onSubmit();
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: 6,
    color: '#f5f5f0',
    padding: '6px 10px',
    fontSize: 13,
    boxSizing: 'border-box',
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div>
        <label style={{ fontSize: 12, color: '#9ca3af', display: 'block', marginBottom: 4 }}>
          Name *
        </label>
        <input
          required
          value={form.name}
          onChange={e => onChange('name', e.target.value)}
          placeholder="e.g. Hot Lead Rapid Sequence"
          style={inputStyle}
          aria-label="Rule name"
        />
      </div>

      <div>
        <label style={{ fontSize: 12, color: '#9ca3af', display: 'block', marginBottom: 4 }}>
          Description
        </label>
        <input
          value={form.description}
          onChange={e => onChange('description', e.target.value)}
          placeholder="Optional description"
          style={inputStyle}
          aria-label="Description"
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div>
          <label style={{ fontSize: 12, color: '#9ca3af', display: 'block', marginBottom: 4 }}>
            Priority (higher = runs first)
          </label>
          <input
            type="number"
            min={0}
            value={form.priority}
            onChange={e => onChange('priority', e.target.value)}
            style={inputStyle}
            aria-label="Priority"
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingTop: 20 }}>
          <input
            id="isActive"
            type="checkbox"
            checked={form.isActive}
            onChange={e => onChange('isActive', e.target.checked)}
            aria-label="Active"
          />
          <label htmlFor="isActive" style={{ fontSize: 13, color: '#f5f5f0' }}>
            Active
          </label>
        </div>
      </div>

      <div>
        <label style={{ fontSize: 12, color: '#9ca3af', display: 'block', marginBottom: 4 }}>
          Lead Tiers (comma-separated: hot, warm, cold, inactive)
        </label>
        <input
          value={form.leadTiers}
          onChange={e => onChange('leadTiers', e.target.value)}
          placeholder="hot, warm  (leave empty to match all tiers)"
          style={inputStyle}
          aria-label="Lead tiers"
        />
      </div>

      <div>
        <label style={{ fontSize: 12, color: '#9ca3af', display: 'block', marginBottom: 4 }}>
          Channel Sequence (JSON array of steps)
        </label>
        <textarea
          value={form.channelSequence}
          onChange={e => onChange('channelSequence', e.target.value)}
          rows={6}
          style={{ ...inputStyle, fontFamily: 'monospace', resize: 'vertical' }}
          aria-label="Channel sequence JSON"
        />
        {seqError && <div style={{ color: '#f87171', fontSize: 12, marginTop: 4 }}>{seqError}</div>}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div>
          <label style={{ fontSize: 12, color: '#9ca3af', display: 'block', marginBottom: 4 }}>
            Daily cap per lead
          </label>
          <input
            type="number"
            min={1}
            value={form.dailyCapPerLead}
            onChange={e => onChange('dailyCapPerLead', e.target.value)}
            style={inputStyle}
            aria-label="Daily cap per lead"
          />
        </div>
        <div>
          <label style={{ fontSize: 12, color: '#9ca3af', display: 'block', marginBottom: 4 }}>
            Cooldown hours
          </label>
          <input
            type="number"
            min={0}
            value={form.cooldownHours}
            onChange={e => onChange('cooldownHours', e.target.value)}
            style={inputStyle}
            aria-label="Cooldown hours"
          />
        </div>
      </div>

      {submitError && (
        <div style={{ color: '#f87171', fontSize: 13, padding: '6px 10px', background: 'rgba(239,68,68,0.1)', borderRadius: 6 }}>
          {submitError}
        </div>
      )}

      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
        <button
          type="button"
          onClick={onCancel}
          style={{
            background: 'rgba(255,255,255,0.06)',
            color: '#f5f5f0',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: 6,
            padding: '7px 16px',
            cursor: 'pointer',
          }}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting}
          style={{
            background: '#c9a84c',
            color: '#0a0a0a',
            border: 'none',
            borderRadius: 6,
            padding: '7px 16px',
            fontWeight: 700,
            cursor: submitting ? 'not-allowed' : 'pointer',
          }}
        >
          {submitting ? 'Saving…' : submitLabel}
        </button>
      </div>
    </form>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function CadenceRuleAdmin() {
  const [rules, setRules] = useState<CadenceRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [formMode, setFormMode] = useState<FormMode>('idle');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<RuleFormState>(DEFAULT_FORM);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [togglingId, setTogglingId] = useState<string | null>(null);

  // ── Load rules ───────────────────────────────────────────────────────
  const loadRules = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const res = await authFetch('/api/follow-ups/rules');
      if (!res.ok) {
        const json = await res.json().catch(() => ({})) as { error?: string };
        throw new Error(json.error ?? 'Failed to load cadence rules');
      }
      const json = await res.json() as { data: CadenceRule[] };
      setRules(json.data ?? []);
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : 'Failed to load cadence rules');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadRules();
  }, [loadRules]);

  // ── Toggle active/inactive ────────────────────────────────────────────
  const handleToggle = useCallback(async (id: string, active: boolean) => {
    setTogglingId(id);
    try {
      const res = await authFetch(`/api/follow-ups/rules/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: active }),
      });
      if (!res.ok) {
        const json = await res.json().catch(() => ({})) as { error?: string };
        throw new Error(json.error ?? 'Failed to update rule');
      }
      const json = await res.json() as { data: CadenceRule };
      setRules(prev => prev.map(r => (r.id === id ? json.data : r)));
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : 'Failed to update rule');
    } finally {
      setTogglingId(null);
    }
  }, []);

  // ── Open create form ──────────────────────────────────────────────────
  const handleOpenCreate = () => {
    setForm(DEFAULT_FORM);
    setSubmitError(null);
    setEditingId(null);
    setFormMode('creating');
  };

  // ── Open edit form ────────────────────────────────────────────────────
  const handleOpenEdit = (rule: CadenceRule) => {
    setForm(ruleToForm(rule));
    setSubmitError(null);
    setEditingId(rule.id);
    setFormMode('editing');
  };

  // ── Handle form field change ──────────────────────────────────────────
  const handleFormChange = (key: keyof RuleFormState, value: string | boolean) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  // ── Submit create/edit ────────────────────────────────────────────────
  const handleSubmit = useCallback(async () => {
    setSubmitting(true);
    setSubmitError(null);
    try {
      let payload: Record<string, unknown>;
      try {
        payload = formToPayload(form);
      } catch {
        setSubmitError('channelSequence must be valid JSON');
        setSubmitting(false);
        return;
      }

      const isEdit = formMode === 'editing' && editingId;
      const url = isEdit ? `/api/follow-ups/rules/${editingId}` : '/api/follow-ups/rules';
      const method = isEdit ? 'PATCH' : 'POST';

      const res = await authFetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const json = await res.json().catch(() => ({})) as { error?: string };
        throw new Error(json.error ?? 'Failed to save rule');
      }

      const json = await res.json() as { data: CadenceRule };
      if (isEdit) {
        setRules(prev => prev.map(r => (r.id === editingId ? json.data : r)));
      } else {
        setRules(prev => [json.data, ...prev]);
      }
      setFormMode('idle');
      setEditingId(null);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Failed to save rule');
    } finally {
      setSubmitting(false);
    }
  }, [editingId, form, formMode]);

  const handleCancel = () => {
    setFormMode('idle');
    setEditingId(null);
    setSubmitError(null);
  };

  // ── Render ────────────────────────────────────────────────────────────
  return (
    <div
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 12,
        padding: 24,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h2 style={{ color: '#f5f5f0', fontSize: 18, fontWeight: 700, margin: 0 }}>
            Cadence Rule Admin
          </h2>
          <p style={{ color: '#9ca3af', fontSize: 13, margin: '4px 0 0' }}>
            Manage dynamic follow-up cadence rules. Active rules are evaluated each scheduler cycle.
          </p>
        </div>
        {formMode === 'idle' && (
          <button
            onClick={handleOpenCreate}
            aria-label="Create new cadence rule"
            style={{
              background: '#c9a84c',
              color: '#0a0a0a',
              border: 'none',
              borderRadius: 8,
              padding: '8px 18px',
              fontWeight: 700,
              cursor: 'pointer',
              fontSize: 13,
            }}
          >
            + New Rule
          </button>
        )}
      </div>

      {/* ── Form panel ── */}
      {(formMode === 'creating' || formMode === 'editing') && (
        <div
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(201,168,76,0.3)',
            borderRadius: 10,
            padding: 20,
            marginBottom: 24,
          }}
          aria-label={formMode === 'creating' ? 'Create cadence rule form' : 'Edit cadence rule form'}
        >
          <h3 style={{ color: '#c9a84c', fontSize: 15, fontWeight: 700, marginTop: 0, marginBottom: 16 }}>
            {formMode === 'creating' ? 'New Cadence Rule' : `Editing: ${form.name}`}
          </h3>
          <RuleForm
            form={form}
            onChange={handleFormChange}
            onSubmit={() => void handleSubmit()}
            onCancel={handleCancel}
            submitLabel={formMode === 'creating' ? 'Create Rule' : 'Save Changes'}
            submitError={submitError}
            submitting={submitting}
          />
        </div>
      )}

      {/* ── Loading ── */}
      {loading && (
        <div style={{ textAlign: 'center', color: '#9ca3af', padding: 40 }} aria-label="Loading cadence rules">
          Loading cadence rules…
        </div>
      )}

      {/* ── Load error ── */}
      {!loading && loadError && (
        <div
          style={{ color: '#f87171', background: 'rgba(239,68,68,0.1)', borderRadius: 8, padding: 14 }}
          role="alert"
        >
          {loadError}
        </div>
      )}

      {/* ── Empty state ── */}
      {!loading && !loadError && rules.length === 0 && (
        <div style={{ textAlign: 'center', color: '#6b7280', padding: 48 }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>📋</div>
          <div>No cadence rules yet. Create your first rule to get started.</div>
        </div>
      )}

      {/* ── Rules table ── */}
      {!loading && !loadError && rules.length > 0 && (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                {['Rule', 'Status', 'Priority', 'Lead Tiers', 'Steps', 'Actions'].map(h => (
                  <th
                    key={h}
                    style={{
                      padding: '8px 12px',
                      textAlign: h === 'Rule' || h === 'Lead Tiers' ? 'left' : 'center',
                      color: '#9ca3af',
                      fontWeight: 600,
                      fontSize: 11,
                      textTransform: 'uppercase',
                      letterSpacing: 1,
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rules.map(rule => (
                <RuleRow
                  key={rule.id}
                  rule={rule}
                  onToggle={(id, active) => void handleToggle(id, active)}
                  onEdit={handleOpenEdit}
                  toggling={togglingId === rule.id}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
