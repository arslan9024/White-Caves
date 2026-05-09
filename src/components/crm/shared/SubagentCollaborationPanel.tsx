import React, { memo, useEffect, useMemo, useState } from 'react';
import { Bot, Link2, ShieldCheck, Sparkles } from 'lucide-react';
import {
  ASSISTANT_EXECUTION_PROFILES,
  getRecommendedCollaborators,
} from '../../../config/subagentOrchestration';
import {
  subagentOrchestrationService,
  type OrchestrationTask,
  type OrchestrationStatusPayload,
  type TaskType,
} from '../../../services/subagentOrchestrationService';

interface SubagentCollaborationPanelProps {
  assistantId?: string;
  weeklyPremiumRemaining?: number;
  businessDaysRemaining?: number;
}

const cardStyle: React.CSSProperties = {
  background: 'rgba(15, 23, 42, 0.72)',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  borderRadius: 12,
  padding: 14,
  marginBottom: 14,
};

const mutedTextStyle: React.CSSProperties = {
  color: '#94A3B8',
  fontSize: 12,
};

const chipStyle: React.CSSProperties = {
  padding: '4px 8px',
  borderRadius: 999,
  background: 'rgba(14, 165, 233, 0.14)',
  border: '1px solid rgba(14, 165, 233, 0.32)',
  color: '#BAE6FD',
  fontSize: 11,
};

const SubagentCollaborationPanel = memo(
  ({
    assistantId,
    weeklyPremiumRemaining = 48,
    businessDaysRemaining = 5,
  }: SubagentCollaborationPanelProps) => {
    const [statusData, setStatusData] = useState<OrchestrationStatusPayload | null>(null);
    const [statusError, setStatusError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [taskTitle, setTaskTitle] = useState<string>('');
    const [taskType, setTaskType] = useState<TaskType>('planning');
    const [isSubmittingTask, setIsSubmittingTask] = useState<boolean>(false);

    const profile = assistantId ? ASSISTANT_EXECUTION_PROFILES[assistantId] : undefined;
    const collaborations = useMemo(
      () => (assistantId ? getRecommendedCollaborators(assistantId) : []),
      [assistantId],
    );

    useEffect(() => {
      const loadStatus = async () => {
        setIsLoading(true);
        setStatusError(null);
        try {
          const response = await subagentOrchestrationService.getStatus();
          setStatusData(response.data);
        } catch (error) {
          setStatusError(
            error instanceof Error
              ? error.message
              : 'Failed to load orchestration status. Using local defaults.',
          );
        } finally {
          setIsLoading(false);
        }
      };

      void loadStatus();
    }, []);

    const dailyPremiumCap = statusData?.quota.dailyCap
      ?? Math.max(0, Math.floor(weeklyPremiumRemaining / Math.max(1, businessDaysRemaining)));

    const premiumConsumedToday = statusData?.quota.premiumConsumedToday ?? 0;
    const premiumRemainingToday = statusData?.quota.premiumRemainingToday ?? Math.max(0, dailyPremiumCap - premiumConsumedToday);

    const assistantTasks = useMemo(() => {
      if (!assistantId || !statusData?.tasks) {
        return [] as OrchestrationTask[];
      }

      return statusData.tasks
        .filter((task) => task.assistantId === assistantId)
        .slice(0, 5);
    }, [assistantId, statusData?.tasks]);

    const allowedTaskTypes = useMemo(() => {
      if (!profile) {
        return ['planning'] as TaskType[];
      }
      return profile.taskTypes as TaskType[];
    }, [profile]);

    useEffect(() => {
      if (!allowedTaskTypes.includes(taskType)) {
        setTaskType(allowedTaskTypes[0] ?? 'planning');
      }
    }, [allowedTaskTypes, taskType]);

    const handleAssignTask = async () => {
      if (!assistantId || !taskTitle.trim()) {
        return;
      }

      setIsSubmittingTask(true);
      setStatusError(null);
      try {
        await subagentOrchestrationService.createTask({
          assistantId,
          taskType,
          title: taskTitle.trim(),
        });

        const response = await subagentOrchestrationService.getStatus();
        setStatusData(response.data);
        setTaskTitle('');
      } catch (error) {
        setStatusError(
          error instanceof Error ? error.message : 'Failed to assign task',
        );
      } finally {
        setIsSubmittingTask(false);
      }
    };

    return (
      <section aria-label="Subagent collaboration panel">
        <div style={cardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <Sparkles size={16} color="#FBBF24" />
            <strong style={{ color: '#E2E8F0', fontSize: 13 }}>Subagent Collaboration</strong>
          </div>

          {profile ? (
            <>
              <p style={{ color: '#E2E8F0', margin: '0 0 8px 0', fontSize: 13 }}>
                <strong>{profile.role}</strong>
              </p>
              <p style={mutedTextStyle}>
                Model tier: <strong>{profile.modelPolicy.defaultTier}</strong> · Premium allowed:{' '}
                <strong>{profile.modelPolicy.premiumAllowed ? 'Yes' : 'No'}</strong>
              </p>

              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 6,
                  marginTop: 8,
                }}
              >
                {profile.taskTypes.map((taskType) => (
                  <span key={taskType} style={chipStyle}>
                    {taskType}
                  </span>
                ))}
              </div>
            </>
          ) : (
            <p style={mutedTextStyle}>Select an assistant to view role and capability routing.</p>
          )}
          {isLoading ? <p style={{ ...mutedTextStyle, marginTop: 8 }}>Loading orchestration status…</p> : null}
          {statusError ? <p style={{ color: '#FCA5A5', fontSize: 12, marginTop: 8 }}>{statusError}</p> : null}
        </div>

        <div style={cardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <ShieldCheck size={16} color="#34D399" />
            <strong style={{ color: '#E2E8F0', fontSize: 13 }}>Premium Quota Guard</strong>
          </div>
          <p style={mutedTextStyle}>
            Weekly remaining: <strong>{statusData?.quota.weeklyPremiumRemaining ?? weeklyPremiumRemaining}</strong> · Business days left:{' '}
            <strong>{statusData?.quota.businessDaysRemaining ?? businessDaysRemaining}</strong>
          </p>
          <p style={{ color: '#E2E8F0', margin: '6px 0 0 0', fontSize: 12 }}>
            Daily premium cap: <strong>{dailyPremiumCap}</strong> · Consumed:{' '}
            <strong>{premiumConsumedToday}</strong> · Remaining:{' '}
            <strong>{premiumRemainingToday}</strong>
          </p>
        </div>

        <div style={cardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <Link2 size={16} color="#60A5FA" />
            <strong style={{ color: '#E2E8F0', fontSize: 13 }}>Routing Chain</strong>
          </div>

          {collaborations.length === 0 ? (
            <p style={mutedTextStyle}>No chain available for the selected assistant.</p>
          ) : (
            <ul style={{ margin: 0, paddingLeft: 16, color: '#CBD5E1', fontSize: 12 }}>
              {collaborations.map((edge) => (
                <li key={`${edge.from}-${edge.to}`} style={{ marginBottom: 6 }}>
                  <strong>{edge.from}</strong> → <strong>{edge.to}</strong>
                  <br />
                  <span style={mutedTextStyle}>{edge.reason}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div style={cardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <Bot size={16} color="#22D3EE" />
            <strong style={{ color: '#E2E8F0', fontSize: 13 }}>Task Assignment</strong>
          </div>

          {assistantId ? (
            <>
              <label style={mutedTextStyle}>Task type</label>
              <select
                value={taskType}
                onChange={(event) => setTaskType(event.target.value as TaskType)}
                style={{
                  width: '100%',
                  marginTop: 4,
                  marginBottom: 8,
                  background: 'rgba(15,23,42,0.5)',
                  color: '#E2E8F0',
                  border: '1px solid rgba(148,163,184,0.35)',
                  borderRadius: 8,
                  padding: '8px 10px',
                }}
              >
                {allowedTaskTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>

              <label style={mutedTextStyle}>Task title</label>
              <input
                value={taskTitle}
                onChange={(event) => setTaskTitle(event.target.value)}
                placeholder="e.g. Draft AI handoff rules for leasing pipeline"
                style={{
                  width: '100%',
                  marginTop: 4,
                  marginBottom: 8,
                  background: 'rgba(15,23,42,0.5)',
                  color: '#E2E8F0',
                  border: '1px solid rgba(148,163,184,0.35)',
                  borderRadius: 8,
                  padding: '8px 10px',
                }}
              />

              <button
                type="button"
                onClick={() => {
                  void handleAssignTask();
                }}
                disabled={isSubmittingTask || !taskTitle.trim()}
                style={{
                  width: '100%',
                  border: '1px solid rgba(56,189,248,0.45)',
                  background: 'rgba(14,165,233,0.16)',
                  color: '#BAE6FD',
                  borderRadius: 8,
                  padding: '8px 10px',
                  cursor: isSubmittingTask ? 'not-allowed' : 'pointer',
                  opacity: isSubmittingTask ? 0.7 : 1,
                }}
              >
                {isSubmittingTask ? 'Assigning…' : 'Assign Task'}
              </button>

              {assistantTasks.length > 0 ? (
                <ul style={{ margin: '10px 0 0 0', paddingLeft: 16, color: '#CBD5E1', fontSize: 12 }}>
                  {assistantTasks.map((task) => (
                    <li key={task.id} style={{ marginBottom: 6 }}>
                      <strong>{task.taskType}</strong> — {task.title}
                      <br />
                      <span style={mutedTextStyle}>
                        State: {task.state}
                        {task.blockedReason ? ` · ${task.blockedReason}` : ''}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p style={{ ...mutedTextStyle, marginTop: 10 }}>No assigned tasks yet for this assistant.</p>
              )}
            </>
          ) : (
            <p style={mutedTextStyle}>Select an assistant to assign orchestration tasks.</p>
          )}
        </div>
      </section>
    );
  },
);

SubagentCollaborationPanel.displayName = 'SubagentCollaborationPanel';

export default SubagentCollaborationPanel;
