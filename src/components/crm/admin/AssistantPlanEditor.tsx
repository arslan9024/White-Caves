/**
 * AssistantPlanEditor — Phase 0.8
 *
 * Admin CRUD UI for super-users (owner/admin) to manage AI assistant plans.
 * Visible only to users with role "owner" or "admin".
 *
 * Features:
 *  - Select an assistant from a dropdown
 *  - Load current plan from /api/assistants/:id/plan
 *  - Edit in a textarea
 *  - Save (PUT) or Delete the plan
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../store/store';
import { assistantsService } from '../../../services/assistantsService';
import type { AssistantMeta } from '../../../services/assistantsService';

const isSuperUser = (role?: string): boolean => role === 'owner' || role === 'admin';

const AssistantPlanEditor: React.FC = () => {
  const userRole = useSelector((state: RootState) => state.auth?.user?.role as string | undefined);

  const [assistants, setAssistants] = useState<AssistantMeta[]>([]);
  const [selectedId, setSelectedId] = useState<string>('');
  const [plan, setPlan] = useState<string>('');
  const [planExists, setPlanExists] = useState<boolean>(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'saving' | 'deleting'>('idle');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Load assistant list
  useEffect(() => {
    assistantsService
      .listAll()
      .then(setAssistants)
      .catch(() => setMessage({ type: 'error', text: 'Failed to load assistants.' }));
  }, []);

  // Load plan when selection changes
  const loadPlan = useCallback(async (id: string) => {
    if (!id) return;
    setPlan('');
    setPlanExists(false);
    setStatus('loading');
    setMessage(null);
    try {
      const res = await assistantsService.getPlan(id);
      setPlan(res.plan ?? '');
      setPlanExists(res.exists);
    } catch {
      setMessage({ type: 'error', text: 'Failed to load plan.' });
    } finally {
      setStatus('idle');
    }
  }, []);

  useEffect(() => {
    if (selectedId) loadPlan(selectedId);
  }, [selectedId, loadPlan]);

  const handleSave = async () => {
    if (!selectedId) return;
    setStatus('saving');
    setMessage(null);
    try {
      await assistantsService.updatePlan(selectedId, plan);
      setPlanExists(true);
      setMessage({ type: 'success', text: 'Plan saved successfully.' });
    } catch {
      // Try create if update fails (plan might not exist yet)
      try {
        await assistantsService.createPlan(selectedId, plan);
        setPlanExists(true);
        setMessage({ type: 'success', text: 'Plan created successfully.' });
      } catch {
        setMessage({ type: 'error', text: 'Failed to save plan.' });
      }
    } finally {
      setStatus('idle');
    }
  };

  const handleDelete = async () => {
    if (!selectedId) return;
    if (!window.confirm(`Delete the plan for ${selectedId}? This cannot be undone.`)) return;
    setStatus('deleting');
    setMessage(null);
    try {
      await assistantsService.deletePlan(selectedId);
      setPlan('');
      setPlanExists(false);
      setMessage({ type: 'success', text: 'Plan deleted.' });
    } catch {
      setMessage({ type: 'error', text: 'Failed to delete plan.' });
    } finally {
      setStatus('idle');
    }
  };

  if (!isSuperUser(userRole)) {
    return (
      <div
        role="alert"
        style={{
          padding: '16px',
          background: '#FEF2F2',
          border: '1px solid #FCA5A5',
          borderRadius: '8px',
          color: '#B91C1C',
          fontSize: '13px',
          margin: '16px',
        }}
      >
        Access denied — super-user role required to manage assistant plans.
      </div>
    );
  }

  const busy = status !== 'idle';

  return (
    <div style={{ padding: '24px', maxWidth: '900px', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px', color: '#111827' }}>
        AI Assistant Plan Editor
      </h2>

      {/* Assistant selector */}
      <div style={{ marginBottom: '16px' }}>
        <label
          htmlFor="plan-editor-assistant"
          style={{
            display: 'block',
            fontSize: '13px',
            fontWeight: 500,
            marginBottom: '4px',
            color: '#374151',
          }}
        >
          Select Assistant
        </label>
        <select
          id="plan-editor-assistant"
          value={selectedId}
          onChange={e => setSelectedId(e.target.value)}
          disabled={busy}
          style={{
            width: '100%',
            maxWidth: '320px',
            padding: '8px 12px',
            border: '1px solid #D1D5DB',
            borderRadius: '6px',
            fontSize: '14px',
            background: '#fff',
          }}
        >
          <option value="">— choose an assistant —</option>
          {assistants.map(a => (
            <option key={a.id} value={a.id}>
              {a.avatar} {a.name} — {a.title}
            </option>
          ))}
        </select>
      </div>

      {/* Plan textarea */}
      {selectedId && (
        <>
          <label
            htmlFor="plan-editor-content"
            style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: 500,
              marginBottom: '4px',
              color: '#374151',
            }}
          >
            Plan (Markdown)
          </label>
          <textarea
            id="plan-editor-content"
            value={status === 'loading' ? 'Loading…' : plan}
            onChange={e => setPlan(e.target.value)}
            disabled={busy}
            rows={24}
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #D1D5DB',
              borderRadius: '6px',
              fontSize: '13px',
              fontFamily: 'ui-monospace, Menlo, monospace',
              lineHeight: '1.6',
              resize: 'vertical',
              boxSizing: 'border-box',
            }}
          />

          {/* Actions */}
          <div style={{ display: 'flex', gap: '8px', marginTop: '12px', alignItems: 'center' }}>
            <button
              onClick={handleSave}
              disabled={busy}
              style={{
                padding: '8px 20px',
                background: '#1C6B2A',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                cursor: busy ? 'not-allowed' : 'pointer',
                opacity: busy ? 0.6 : 1,
              }}
            >
              {status === 'saving' ? 'Saving…' : 'Save Plan'}
            </button>

            <button
              onClick={handleDelete}
              disabled={busy || !planExists}
              style={{
                padding: '8px 20px',
                background: 'transparent',
                color: '#DC2626',
                border: '1px solid #DC2626',
                borderRadius: '6px',
                fontSize: '14px',
                cursor: busy || !planExists ? 'not-allowed' : 'pointer',
                opacity: busy || !planExists ? 0.5 : 1,
              }}
            >
              {status === 'deleting' ? 'Deleting…' : 'Delete Plan'}
            </button>

            <button
              onClick={() => loadPlan(selectedId)}
              disabled={busy}
              style={{
                padding: '8px 16px',
                background: 'transparent',
                color: '#6B7280',
                border: '1px solid #D1D5DB',
                borderRadius: '6px',
                fontSize: '14px',
                cursor: busy ? 'not-allowed' : 'pointer',
                opacity: busy ? 0.5 : 1,
              }}
            >
              Reload
            </button>
          </div>
        </>
      )}

      {/* Status message */}
      {message && (
        <div
          role={message.type === 'error' ? 'alert' : 'status'}
          style={{
            marginTop: '12px',
            padding: '10px 14px',
            borderRadius: '6px',
            fontSize: '13px',
            background: message.type === 'success' ? '#F0FDF4' : '#FEF2F2',
            border: `1px solid ${message.type === 'success' ? '#86EFAC' : '#FCA5A5'}`,
            color: message.type === 'success' ? '#166534' : '#B91C1C',
          }}
        >
          {message.text}
        </div>
      )}
    </div>
  );
};

export default AssistantPlanEditor;
