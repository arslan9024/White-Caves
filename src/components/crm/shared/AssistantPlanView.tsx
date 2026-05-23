/**
 * AssistantPlanView — Phase 0.8
 *
 * Displays the markdown plan for an AI assistant fetched from /api/assistants/:id/plan.
 * Dispatches fetchAssistantPlan on mount if the plan has not yet been loaded.
 * Renders markdown as pre-formatted text (no HTML injection risk).
 */

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch } from '../../../store/store';
import { fetchAssistantPlan } from '../../../store/slices/aiAssistantDashboardSlice';
import {
  selectAssistantPlan,
  selectAssistantPlanLoading,
  selectAssistantPlanError,
} from '../../../store/slices/aiAssistant/selectors';
import type { RootState } from '../../../store/store';

interface AssistantPlanViewProps {
  assistantId: string;
  assistantName: string;
}

const AssistantPlanView: React.FC<AssistantPlanViewProps> = ({ assistantId, assistantName }) => {
  const dispatch = useDispatch<AppDispatch>();

  const plan = useSelector((state: RootState) => selectAssistantPlan(assistantId)(state));
  const loading = useSelector((state: RootState) => selectAssistantPlanLoading(assistantId)(state));
  const error = useSelector((state: RootState) => selectAssistantPlanError(assistantId)(state));

  useEffect(() => {
    // Only fetch if not already loaded (undefined means never fetched; null means fetched but no plan)
    if (plan === undefined && !loading && !error) {
      dispatch(fetchAssistantPlan(assistantId));
    }
  }, [assistantId, dispatch, error, loading, plan]);

  if (loading || plan === undefined) {
    return (
      <div style={{ padding: '24px', textAlign: 'center', color: '#9CA3AF' }}>
        <div style={{ fontSize: '14px' }}>Loading {assistantName}&apos;s plan…</div>
      </div>
    );
  }

  if (error) {
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
        <strong>Could not load plan:</strong> {error}
        <button
          onClick={() => dispatch(fetchAssistantPlan(assistantId))}
          style={{
            display: 'block',
            marginTop: '8px',
            background: 'none',
            border: '1px solid #B91C1C',
            borderRadius: '4px',
            color: '#B91C1C',
            cursor: 'pointer',
            fontSize: '12px',
            padding: '4px 8px',
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  if (plan === null) {
    return (
      <div
        style={{
          padding: '24px',
          textAlign: 'center',
          color: '#6B7280',
          fontSize: '14px',
        }}
      >
        No plan has been written for <strong>{assistantName}</strong> yet.
      </div>
    );
  }

  return (
    <div
      style={{
        padding: '24px',
        fontFamily: 'Inter, system-ui, sans-serif',
        fontSize: '14px',
        lineHeight: '1.7',
        color: '#1F2937',
        maxWidth: '900px',
      }}
    >
      <pre
        style={{
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
          margin: 0,
          fontFamily: 'inherit',
          fontSize: 'inherit',
          lineHeight: 'inherit',
        }}
      >
        {plan}
      </pre>
    </div>
  );
};

export default AssistantPlanView;
