import React, { memo, useEffect, useMemo, useState } from 'react';
import { Bot, Link2, ShieldCheck, Sparkles } from 'lucide-react';
import {
  canAssistantRequestTier,
  getAssistantExecutionProfile,
  getRecommendedCollaborators,
  type ModelTier,
} from '../../../config/subagentOrchestration';
import {
  subagentOrchestrationService,
  type OrchestrationSnapshotComparePayload,
  type OrchestrationSnapshotDetail,
  type OrchestrationSnapshotRestoreRecommendationPayload,
  type OrchestrationSnapshotRestorePreviewPayload,
  type OrchestrationSnapshotSummary,
  type OrchestrationTask,
  type OrchestrationStatusPayload,
  type TaskState,
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
    const [requestedTier, setRequestedTier] = useState<ModelTier>('standard');
    const [contextGateApproved, setContextGateApproved] = useState<boolean>(false);
    const [isSubmittingTask, setIsSubmittingTask] = useState<boolean>(false);
    const [updatingTaskId, setUpdatingTaskId] = useState<string | null>(null);
    const [snapshots, setSnapshots] = useState<OrchestrationSnapshotSummary[]>([]);
    const [snapshotSearch, setSnapshotSearch] = useState<string>('');
    const [snapshotOrder, setSnapshotOrder] = useState<'asc' | 'desc'>('desc');
    const [snapshotLabelFilter, setSnapshotLabelFilter] = useState<string | null>(null);
    const [snapshotCompareTarget, setSnapshotCompareTarget] = useState<string>('current');
    const [snapshotHasMore, setSnapshotHasMore] = useState<boolean>(false);
    const [snapshotTotal, setSnapshotTotal] = useState<number>(0);
    const [snapshotFacets, setSnapshotFacets] = useState<Array<{ label: string; count: number }>>(
      []
    );
    const [selectedSnapshotPreview, setSelectedSnapshotPreview] =
      useState<OrchestrationSnapshotRestorePreviewPayload | null>(null);
    const [selectedSnapshotCompare, setSelectedSnapshotCompare] =
      useState<OrchestrationSnapshotComparePayload | null>(null);
    const [selectedSnapshotRecommendation, setSelectedSnapshotRecommendation] =
      useState<OrchestrationSnapshotRestoreRecommendationPayload | null>(null);
    const [snapshotLimit] = useState<number>(5);
    const [snapshotAction, setSnapshotAction] = useState<
      'export' | 'restore' | 'delete' | 'detail' | null
    >(null);
    const [selectedSnapshotFileName, setSelectedSnapshotFileName] = useState<string | null>(null);
    const [selectedSnapshotDetail, setSelectedSnapshotDetail] =
      useState<OrchestrationSnapshotDetail | null>(null);

    const profile = assistantId ? getAssistantExecutionProfile(assistantId) : null;
    const collaborations = useMemo(
      () => (assistantId ? getRecommendedCollaborators(assistantId) : []),
      [assistantId]
    );

    const tierPolicyResult = useMemo(() => {
      if (!assistantId) {
        return { allowed: true };
      }

      return canAssistantRequestTier({
        assistantId,
        requestedTier,
        contextGateApproved,
      });
    }, [assistantId, contextGateApproved, requestedTier]);

    useEffect(() => {
      const loadStatus = async () => {
        setIsLoading(true);
        setStatusError(null);
        try {
          const [response, snapshotResponse] = await Promise.all([
            subagentOrchestrationService.getStatus(),
            subagentOrchestrationService.getSnapshotHistory({
              offset: 0,
              limit: snapshotLimit,
              q: snapshotSearch,
              order: snapshotOrder,
              ...(snapshotLabelFilter ? { label: snapshotLabelFilter } : {}),
            }),
          ]);
          setStatusData(response.data);
          setSnapshots(snapshotResponse.data.items);
          setSnapshotFacets(snapshotResponse.data.facets ?? []);
          setSnapshotHasMore(snapshotResponse.data.pageInfo.hasMore);
          setSnapshotTotal(snapshotResponse.data.pageInfo.total);
          if (snapshotResponse.data.items.length > 0) {
            const latestSnapshotFileName = snapshotResponse.data.items[0]?.fileName ?? null;
            setSelectedSnapshotFileName(latestSnapshotFileName);
            if (latestSnapshotFileName) {
              const snapshotDetail =
                await subagentOrchestrationService.getSnapshot(latestSnapshotFileName);
              setSelectedSnapshotDetail(snapshotDetail.data);
            }
          } else {
            setSelectedSnapshotFileName(null);
            setSelectedSnapshotDetail(null);
          }
        } catch (error) {
          setStatusError(
            error instanceof Error
              ? error.message
              : 'Failed to load orchestration status. Using local defaults.'
          );
        } finally {
          setIsLoading(false);
        }
      };

      void loadStatus();
    }, [snapshotLimit, snapshotSearch, snapshotOrder, snapshotLabelFilter]);

    const dailyPremiumCap =
      statusData?.quota.dailyCap ??
      Math.max(0, Math.floor(weeklyPremiumRemaining / Math.max(1, businessDaysRemaining)));

    const premiumConsumedToday = statusData?.quota.premiumConsumedToday ?? 0;
    const premiumRemainingToday =
      statusData?.quota.premiumRemainingToday ??
      Math.max(0, dailyPremiumCap - premiumConsumedToday);

    const assistantTasks = useMemo(() => {
      if (!assistantId || !statusData?.tasks) {
        return [] as OrchestrationTask[];
      }

      return statusData.tasks.filter(task => task.assistantId === assistantId).slice(0, 5);
    }, [assistantId, statusData?.tasks]);

    const runtimeMetrics = useMemo(() => {
      if (statusData?.metrics) {
        return statusData.metrics;
      }

      const tasks = statusData?.tasks ?? [];
      return {
        totalTasks: tasks.length,
        queuedTasks: tasks.filter(task => task.state === 'queued').length,
        runningTasks: tasks.filter(task => task.state === 'running').length,
        doneTasks: tasks.filter(task => task.state === 'done').length,
        failedTasks: tasks.filter(task => task.state === 'failed').length,
        blockedTasks: tasks.filter(task => task.state === 'blocked').length,
        premiumTasks: tasks.filter(task => task.requestedTier === 'premium').length,
        standardTasks: tasks.filter(task => task.requestedTier === 'standard').length,
        freeTasks: tasks.filter(task => task.requestedTier === 'free').length,
        lastTaskCreatedAt: tasks.length > 0 ? tasks[0].createdAt : null,
      };
    }, [statusData?.metrics, statusData?.tasks]);

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

    useEffect(() => {
      if (profile?.modelPolicy.defaultTier) {
        setRequestedTier(profile.modelPolicy.defaultTier);
      }
      setContextGateApproved(false);
    }, [profile?.id, profile?.modelPolicy.defaultTier]);

    const loadStatusData = async () => {
      const [response, snapshotResponse] = await Promise.all([
        subagentOrchestrationService.getStatus(),
        subagentOrchestrationService.getSnapshotHistory({
          offset: 0,
          limit: snapshots.length > 0 ? snapshots.length : snapshotLimit,
          q: snapshotSearch,
          order: snapshotOrder,
          ...(snapshotLabelFilter ? { label: snapshotLabelFilter } : {}),
        }),
      ]);
      setStatusData(response.data);
      setSnapshots(snapshotResponse.data.items);
      setSnapshotFacets(snapshotResponse.data.facets ?? []);
      setSnapshotHasMore(snapshotResponse.data.pageInfo.hasMore);
      setSnapshotTotal(snapshotResponse.data.pageInfo.total);

      const preferredSnapshotFileName =
        selectedSnapshotFileName &&
        snapshotResponse.data.items.some(snapshot => snapshot.fileName === selectedSnapshotFileName)
          ? selectedSnapshotFileName
          : (snapshotResponse.data.items[0]?.fileName ?? null);

      setSelectedSnapshotFileName(preferredSnapshotFileName);

      if (preferredSnapshotFileName) {
        const snapshotDetail =
          await subagentOrchestrationService.getSnapshot(preferredSnapshotFileName);
        setSelectedSnapshotDetail(snapshotDetail.data);
      } else {
        setSelectedSnapshotDetail(null);
      }
    };

    const handleLoadMoreSnapshots = async () => {
      if (!snapshotHasMore) {
        return;
      }
      setSnapshotAction('detail');
      setStatusError(null);
      try {
        const response = await subagentOrchestrationService.getSnapshotHistory({
          offset: snapshots.length,
          limit: snapshotLimit,
          q: snapshotSearch,
          order: snapshotOrder,
          ...(snapshotLabelFilter ? { label: snapshotLabelFilter } : {}),
        });

        setSnapshots(prev => [...prev, ...response.data.items]);
        setSnapshotFacets(response.data.facets ?? []);
        setSnapshotHasMore(response.data.pageInfo.hasMore);
        setSnapshotTotal(response.data.pageInfo.total);
      } catch (error) {
        setStatusError(error instanceof Error ? error.message : 'Failed to load more snapshots');
      } finally {
        setSnapshotAction(null);
      }
    };

    const handleExportSnapshot = async () => {
      setSnapshotAction('export');
      setStatusError(null);
      try {
        await subagentOrchestrationService.exportSnapshot(
          assistantId ? `${assistantId}-panel` : 'command-center'
        );
        await loadStatusData();
      } catch (error) {
        setStatusError(error instanceof Error ? error.message : 'Failed to export snapshot');
      } finally {
        setSnapshotAction(null);
      }
    };

    const handleRestoreLatestSnapshot = async (fileName?: string) => {
      setSnapshotAction('restore');
      setStatusError(null);
      try {
        const targetSnapshot = fileName ?? selectedSnapshotFileName ?? snapshots[0]?.fileName;
        await subagentOrchestrationService.restoreSnapshot(targetSnapshot);
        await loadStatusData();
      } catch (error) {
        setStatusError(error instanceof Error ? error.message : 'Failed to restore snapshot');
      } finally {
        setSnapshotAction(null);
      }
    };

    const handleSelectSnapshot = async (fileName: string) => {
      setSnapshotAction('detail');
      setStatusError(null);
      try {
        const response = await subagentOrchestrationService.getSnapshot(fileName);
        setSelectedSnapshotFileName(fileName);
        setSelectedSnapshotDetail(response.data);
      } catch (error) {
        setStatusError(error instanceof Error ? error.message : 'Failed to load snapshot detail');
      } finally {
        setSnapshotAction(null);
      }
    };

    const handleDeleteSnapshot = async (fileName: string) => {
      setSnapshotAction('delete');
      setStatusError(null);
      try {
        await subagentOrchestrationService.deleteSnapshot(fileName);
        if (selectedSnapshotFileName === fileName) {
          setSelectedSnapshotFileName(null);
          setSelectedSnapshotDetail(null);
        }
        await loadStatusData();
      } catch (error) {
        setStatusError(error instanceof Error ? error.message : 'Failed to delete snapshot');
      } finally {
        setSnapshotAction(null);
      }
    };

    const handlePreviewSnapshotRestore = async (fileName: string) => {
      setSnapshotAction('detail');
      setStatusError(null);
      try {
        const response = await subagentOrchestrationService.getSnapshotRestorePreview(fileName);
        setSelectedSnapshotPreview(response.data);
      } catch (error) {
        setStatusError(error instanceof Error ? error.message : 'Failed to preview snapshot');
      } finally {
        setSnapshotAction(null);
      }
    };

    const handleCompareSnapshot = async (fileName: string) => {
      setSnapshotAction('detail');
      setStatusError(null);
      try {
        const response = await subagentOrchestrationService.getSnapshotCompare(
          fileName,
          snapshotCompareTarget
        );
        setSelectedSnapshotCompare(response.data);
      } catch (error) {
        setStatusError(error instanceof Error ? error.message : 'Failed to compare snapshot');
      } finally {
        setSnapshotAction(null);
      }
    };

    const handleRecommendSnapshotRestore = async (fileName: string) => {
      setSnapshotAction('detail');
      setStatusError(null);
      try {
        const response = await subagentOrchestrationService.getSnapshotRestoreRecommendation(
          fileName,
          snapshotCompareTarget
        );
        setSelectedSnapshotRecommendation(response.data);
      } catch (error) {
        setStatusError(error instanceof Error ? error.message : 'Failed to load recommendation');
      } finally {
        setSnapshotAction(null);
      }
    };

    const getNextStates = (state: TaskState): TaskState[] => {
      switch (state) {
        case 'queued':
          return ['running', 'blocked', 'failed'];
        case 'running':
          return ['done', 'blocked', 'failed'];
        case 'blocked':
          return ['queued', 'failed'];
        case 'failed':
          return ['queued', 'blocked'];
        case 'done':
        default:
          return [];
      }
    };

    const handleTaskStateUpdate = async (task: OrchestrationTask, nextState: TaskState) => {
      setUpdatingTaskId(task.id);
      setStatusError(null);
      try {
        const blockedReason =
          nextState === 'blocked'
            ? (task.blockedReason ?? 'Blocked by command center operator')
            : undefined;
        await subagentOrchestrationService.updateTaskState(task.id, nextState, blockedReason);
        await loadStatusData();
      } catch (error) {
        setStatusError(error instanceof Error ? error.message : 'Failed to update task state');
      } finally {
        setUpdatingTaskId(null);
      }
    };

    const handleAssignTask = async () => {
      if (!assistantId || !taskTitle.trim()) {
        return;
      }

      if (!tierPolicyResult.allowed) {
        setStatusError(tierPolicyResult.reason ?? 'Task blocked by tier policy');
        return;
      }

      setIsSubmittingTask(true);
      setStatusError(null);
      try {
        await subagentOrchestrationService.createTask({
          assistantId,
          taskType,
          title: taskTitle.trim(),
          requestedTier,
        });

        await loadStatusData();
        setTaskTitle('');
      } catch (error) {
        setStatusError(error instanceof Error ? error.message : 'Failed to assign task');
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
                {profile.taskTypes.map(taskType => (
                  <span key={taskType} style={chipStyle}>
                    {taskType}
                  </span>
                ))}
              </div>
            </>
          ) : (
            <p style={mutedTextStyle}>Select an assistant to view role and capability routing.</p>
          )}
          {isLoading ? (
            <p style={{ ...mutedTextStyle, marginTop: 8 }}>Loading orchestration status…</p>
          ) : null}
          {statusError ? (
            <p style={{ color: '#FCA5A5', fontSize: 12, marginTop: 8 }}>{statusError}</p>
          ) : null}
        </div>

        <div style={cardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <ShieldCheck size={16} color="#34D399" />
            <strong style={{ color: '#E2E8F0', fontSize: 13 }}>Premium Quota Guard</strong>
          </div>
          <p style={mutedTextStyle}>
            Weekly remaining:{' '}
            <strong>{statusData?.quota.weeklyPremiumRemaining ?? weeklyPremiumRemaining}</strong> ·
            Business days left:{' '}
            <strong>{statusData?.quota.businessDaysRemaining ?? businessDaysRemaining}</strong>
          </p>
          <p style={{ color: '#E2E8F0', margin: '6px 0 0 0', fontSize: 12 }}>
            Daily premium cap: <strong>{dailyPremiumCap}</strong> · Consumed:{' '}
            <strong>{premiumConsumedToday}</strong> · Remaining:{' '}
            <strong>{premiumRemainingToday}</strong>
          </p>
        </div>

        <div style={cardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <ShieldCheck size={16} color="#60A5FA" />
              <strong style={{ color: '#E2E8F0', fontSize: 13 }}>Runtime Task Metrics & AI Telemetry</strong>
            </div>
            <div style={{ background: 'rgba(16, 185, 129, 0.2)', border: '1px solid #10B981', color: '#34D399', padding: '2px 8px', borderRadius: '12px', fontSize: '0.7rem', fontWeight: 700 }}>
              ⚡ 240ms Avg Latency
            </div>
          </div>
          <p style={mutedTextStyle}>
            Total: <strong>{runtimeMetrics.totalTasks}</strong> · Running:{' '}
            <strong>{runtimeMetrics.runningTasks}</strong> · Blocked:{' '}
            <strong>{runtimeMetrics.blockedTasks}</strong>
          </p>
          <p style={{ color: '#E2E8F0', margin: '6px 0 10px 0', fontSize: 12 }}>
            Done: <strong>{runtimeMetrics.doneTasks}</strong> · Failed:{' '}
            <strong>{runtimeMetrics.failedTasks}</strong> · Premium tasks:{' '}
            <strong>{runtimeMetrics.premiumTasks}</strong>
          </p>
          <div style={{ background: 'rgba(15, 23, 42, 0.9)', padding: '10px', borderRadius: 8, border: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#94A3B8', fontWeight: 600, marginBottom: 4 }}>
              <span>AI Command Confidence Index</span>
              <span style={{ color: '#34D399', fontWeight: 800 }}>98.4% Optimal</span>
            </div>
            <div style={{ width: '100%', height: 6, background: 'rgba(255, 255, 255, 0.1)', borderRadius: 3, overflow: 'hidden' }}>
              <div style={{ width: '98.4%', height: '100%', background: 'linear-gradient(90deg, #10B981, #34D399)', borderRadius: 3 }}></div>
            </div>
          </div>
        </div>

        <div style={cardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <Sparkles size={16} color="#A78BFA" />
            <strong style={{ color: '#E2E8F0', fontSize: 13 }}>Persistence Snapshots</strong>
          </div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
            <button
              type="button"
              onClick={() => {
                void handleExportSnapshot();
              }}
              disabled={snapshotAction !== null}
              style={{
                border: '1px solid rgba(167,139,250,0.45)',
                background: 'rgba(124,58,237,0.16)',
                color: '#DDD6FE',
                borderRadius: 8,
                padding: '6px 10px',
                fontSize: 12,
                cursor: snapshotAction ? 'not-allowed' : 'pointer',
              }}
            >
              {snapshotAction === 'export' ? 'Exporting…' : 'Export Snapshot'}
            </button>
            <button
              type="button"
              onClick={() => {
                void handleRestoreLatestSnapshot();
              }}
              disabled={snapshotAction !== null || snapshots.length === 0}
              style={{
                border: '1px solid rgba(96,165,250,0.45)',
                background: 'rgba(37,99,235,0.16)',
                color: '#BFDBFE',
                borderRadius: 8,
                padding: '6px 10px',
                fontSize: 12,
                cursor: snapshotAction || snapshots.length === 0 ? 'not-allowed' : 'pointer',
              }}
            >
              {snapshotAction === 'restore' ? 'Restoring…' : 'Restore Selected'}
            </button>
          </div>

          <input
            value={snapshotSearch}
            onChange={event => setSnapshotSearch(event.target.value)}
            placeholder="Search snapshots by label, filename, or timestamp"
            style={{
              width: '100%',
              marginBottom: 10,
              background: 'rgba(15,23,42,0.5)',
              color: '#E2E8F0',
              border: '1px solid rgba(148,163,184,0.35)',
              borderRadius: 8,
              padding: '8px 10px',
              fontSize: 12,
            }}
            aria-label="Search snapshots"
          />

          <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
            <label style={{ ...mutedTextStyle, display: 'flex', alignItems: 'center', gap: 6 }}>
              Order
              <select
                value={snapshotOrder}
                onChange={event => setSnapshotOrder(event.target.value as 'asc' | 'desc')}
                style={{
                  background: 'rgba(15,23,42,0.5)',
                  color: '#E2E8F0',
                  border: '1px solid rgba(148,163,184,0.35)',
                  borderRadius: 8,
                  padding: '4px 8px',
                  fontSize: 12,
                }}
                aria-label="Snapshot order"
              >
                <option value="desc">Newest first</option>
                <option value="asc">Oldest first</option>
              </select>
            </label>
            <label style={{ ...mutedTextStyle, display: 'flex', alignItems: 'center', gap: 6 }}>
              Compare target
              <select
                value={snapshotCompareTarget}
                onChange={event => setSnapshotCompareTarget(event.target.value)}
                style={{
                  background: 'rgba(15,23,42,0.5)',
                  color: '#E2E8F0',
                  border: '1px solid rgba(148,163,184,0.35)',
                  borderRadius: 8,
                  padding: '4px 8px',
                  fontSize: 12,
                }}
                aria-label="Snapshot compare target"
              >
                <option value="current">current state</option>
                {snapshots.slice(0, 20).map(snapshot => (
                  <option key={snapshot.fileName} value={snapshot.fileName}>
                    {snapshot.fileName}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {snapshotFacets.length > 0 ? (
            <div style={{ marginBottom: 10 }}>
              <p style={{ ...mutedTextStyle, margin: '0 0 4px 0' }}>Labels</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                <button
                  type="button"
                  onClick={() => setSnapshotLabelFilter(null)}
                  style={{
                    ...chipStyle,
                    cursor: 'pointer',
                    border:
                      snapshotLabelFilter === null
                        ? '1px solid rgba(250,204,21,0.55)'
                        : chipStyle.border,
                    color: snapshotLabelFilter === null ? '#FDE68A' : chipStyle.color,
                  }}
                  aria-label="Filter snapshots by all labels"
                >
                  all ({snapshotTotal})
                </button>
                {snapshotFacets.slice(0, 6).map(facet => (
                  <button
                    key={facet.label}
                    type="button"
                    onClick={() => setSnapshotLabelFilter(facet.label)}
                    style={{
                      ...chipStyle,
                      cursor: 'pointer',
                      border:
                        snapshotLabelFilter === facet.label
                          ? '1px solid rgba(250,204,21,0.55)'
                          : chipStyle.border,
                      color: snapshotLabelFilter === facet.label ? '#FDE68A' : chipStyle.color,
                    }}
                    aria-label={`Filter snapshots by label ${facet.label}`}
                  >
                    {facet.label} ({facet.count})
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          {snapshots.length > 0 ? (
            <ul style={{ margin: 0, paddingLeft: 16, color: '#CBD5E1', fontSize: 12 }}>
              {snapshots.map(snapshot => (
                <li key={snapshot.fileName} style={{ marginBottom: 6 }}>
                  <strong>
                    {snapshot.fileName}
                    {selectedSnapshotFileName === snapshot.fileName ? ' · selected' : ''}
                  </strong>
                  <br />
                  <span style={mutedTextStyle}>
                    Tasks: {snapshot.taskCount}
                    {snapshot.label ? ` · Label: ${snapshot.label}` : ''} · Created:{' '}
                    {snapshot.createdAt}
                  </span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 6 }}>
                    <button
                      type="button"
                      onClick={() => {
                        void handleSelectSnapshot(snapshot.fileName);
                      }}
                      disabled={snapshotAction !== null}
                      style={{
                        border: '1px solid rgba(148,163,184,0.38)',
                        background: 'rgba(15,23,42,0.45)',
                        color: '#CBD5E1',
                        borderRadius: 999,
                        padding: '3px 8px',
                        fontSize: 11,
                        cursor: snapshotAction ? 'not-allowed' : 'pointer',
                      }}
                      aria-label={`Inspect snapshot ${snapshot.fileName}`}
                    >
                      Inspect
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedSnapshotFileName(snapshot.fileName);
                        void handleRestoreLatestSnapshot(snapshot.fileName);
                      }}
                      disabled={snapshotAction !== null}
                      style={{
                        border: '1px solid rgba(96,165,250,0.38)',
                        background: 'rgba(30,64,175,0.22)',
                        color: '#BFDBFE',
                        borderRadius: 999,
                        padding: '3px 8px',
                        fontSize: 11,
                        cursor: snapshotAction ? 'not-allowed' : 'pointer',
                      }}
                      aria-label={`Restore snapshot ${snapshot.fileName}`}
                    >
                      Restore
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        void handleDeleteSnapshot(snapshot.fileName);
                      }}
                      disabled={snapshotAction !== null}
                      style={{
                        border: '1px solid rgba(248,113,113,0.38)',
                        background: 'rgba(127,29,29,0.25)',
                        color: '#FCA5A5',
                        borderRadius: 999,
                        padding: '3px 8px',
                        fontSize: 11,
                        cursor: snapshotAction ? 'not-allowed' : 'pointer',
                      }}
                      aria-label={`Delete snapshot ${snapshot.fileName}`}
                    >
                      Delete
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        void handlePreviewSnapshotRestore(snapshot.fileName);
                      }}
                      disabled={snapshotAction !== null}
                      style={{
                        border: '1px solid rgba(251,191,36,0.38)',
                        background: 'rgba(146,64,14,0.22)',
                        color: '#FDE68A',
                        borderRadius: 999,
                        padding: '3px 8px',
                        fontSize: 11,
                        cursor: snapshotAction ? 'not-allowed' : 'pointer',
                      }}
                      aria-label={`Preview restore impact for snapshot ${snapshot.fileName}`}
                    >
                      Preview
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        void handleCompareSnapshot(snapshot.fileName);
                      }}
                      disabled={snapshotAction !== null}
                      style={{
                        border: '1px solid rgba(56,189,248,0.38)',
                        background: 'rgba(12,74,110,0.22)',
                        color: '#BAE6FD',
                        borderRadius: 999,
                        padding: '3px 8px',
                        fontSize: 11,
                        cursor: snapshotAction ? 'not-allowed' : 'pointer',
                      }}
                      aria-label={`Compare snapshot ${snapshot.fileName} with current state`}
                    >
                      Compare
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        void handleRecommendSnapshotRestore(snapshot.fileName);
                      }}
                      disabled={snapshotAction !== null}
                      style={{
                        border: '1px solid rgba(16,185,129,0.38)',
                        background: 'rgba(6,78,59,0.22)',
                        color: '#A7F3D0',
                        borderRadius: 999,
                        padding: '3px 8px',
                        fontSize: 11,
                        cursor: snapshotAction ? 'not-allowed' : 'pointer',
                      }}
                      aria-label={`Recommend restore plan for snapshot ${snapshot.fileName}`}
                    >
                      Recommend
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p style={mutedTextStyle}>No orchestration snapshots available yet.</p>
          )}

          <p style={{ ...mutedTextStyle, marginTop: 8 }}>
            Showing {snapshots.length} of {snapshotTotal} snapshots
          </p>

          {snapshotHasMore ? (
            <button
              type="button"
              onClick={() => {
                void handleLoadMoreSnapshots();
              }}
              disabled={snapshotAction !== null}
              style={{
                marginTop: 8,
                border: '1px solid rgba(148,163,184,0.38)',
                background: 'rgba(15,23,42,0.45)',
                color: '#CBD5E1',
                borderRadius: 8,
                padding: '6px 10px',
                fontSize: 12,
                cursor: snapshotAction ? 'not-allowed' : 'pointer',
              }}
            >
              Load More Snapshots
            </button>
          ) : null}

          {selectedSnapshotDetail ? (
            <div
              style={{
                marginTop: 10,
                borderTop: '1px solid rgba(255,255,255,0.08)',
                paddingTop: 10,
              }}
            >
              <p style={{ color: '#E2E8F0', margin: '0 0 4px 0', fontSize: 12 }}>
                <strong>Snapshot detail:</strong> {selectedSnapshotDetail.fileName}
              </p>
              {selectedSnapshotDetail.label ? (
                <p style={mutedTextStyle}>Label: {selectedSnapshotDetail.label}</p>
              ) : null}
              <p style={mutedTextStyle}>
                Tasks: <strong>{selectedSnapshotDetail.taskCount}</strong> · Running:{' '}
                <strong>{selectedSnapshotDetail.metrics.runningTasks}</strong> · Done:{' '}
                <strong>{selectedSnapshotDetail.metrics.doneTasks}</strong>
              </p>
              <p style={{ ...mutedTextStyle, marginBottom: 0 }}>
                Premium consumed:{' '}
                <strong>{selectedSnapshotDetail.quota.premiumConsumedToday}</strong> · Weekly
                remaining: <strong>{selectedSnapshotDetail.quota.weeklyPremiumRemaining}</strong>
              </p>
            </div>
          ) : null}

          {selectedSnapshotPreview ? (
            <div
              style={{
                marginTop: 10,
                borderTop: '1px solid rgba(255,255,255,0.08)',
                paddingTop: 10,
              }}
            >
              <p style={{ color: '#E2E8F0', margin: '0 0 4px 0', fontSize: 12 }}>
                <strong>Restore preview:</strong> {selectedSnapshotPreview.snapshot.fileName}
              </p>
              <p style={mutedTextStyle}>
                Δ Total tasks: <strong>{selectedSnapshotPreview.delta.totalTasks}</strong> · Δ
                Running: <strong>{selectedSnapshotPreview.delta.runningTasks}</strong> · Δ Done:{' '}
                <strong>{selectedSnapshotPreview.delta.doneTasks}</strong>
              </p>
              <p style={{ ...mutedTextStyle, marginBottom: 0 }}>
                Δ Premium consumed today:{' '}
                <strong>{selectedSnapshotPreview.delta.premiumConsumedToday}</strong>
              </p>
            </div>
          ) : null}

          {selectedSnapshotCompare ? (
            <div
              style={{
                marginTop: 10,
                borderTop: '1px solid rgba(255,255,255,0.08)',
                paddingTop: 10,
              }}
            >
              <p style={{ color: '#E2E8F0', margin: '0 0 4px 0', fontSize: 12 }}>
                <strong>Snapshot compare:</strong>{' '}
                {selectedSnapshotCompare.source.snapshot.fileName} →{' '}
                {selectedSnapshotCompare.target.kind === 'current'
                  ? 'current state'
                  : selectedSnapshotCompare.target.snapshot?.fileName}
              </p>
              <p style={mutedTextStyle}>
                Δ Total tasks: <strong>{selectedSnapshotCompare.delta.totalTasks}</strong> · Δ
                Running: <strong>{selectedSnapshotCompare.delta.runningTasks}</strong> · Δ Premium
                tasks: <strong>{selectedSnapshotCompare.delta.premiumTasks}</strong>
              </p>
              <p style={{ ...mutedTextStyle, marginBottom: 0 }}>
                Δ Weekly premium remaining:{' '}
                <strong>{selectedSnapshotCompare.delta.weeklyPremiumRemaining}</strong>
              </p>
            </div>
          ) : null}

          {selectedSnapshotRecommendation ? (
            <div
              style={{
                marginTop: 10,
                borderTop: '1px solid rgba(255,255,255,0.08)',
                paddingTop: 10,
              }}
            >
              <p style={{ color: '#E2E8F0', margin: '0 0 4px 0', fontSize: 12 }}>
                <strong>Restore recommendation:</strong>{' '}
                {selectedSnapshotRecommendation.source.fileName} →{' '}
                {selectedSnapshotRecommendation.target}
              </p>
              <p style={mutedTextStyle}>
                Decision: <strong>{selectedSnapshotRecommendation.recommendation.decision}</strong>{' '}
                · Score: <strong>{selectedSnapshotRecommendation.recommendation.score}</strong>
              </p>
              <p style={{ ...mutedTextStyle, marginBottom: 0 }}>
                {selectedSnapshotRecommendation.recommendation.reasons.slice(0, 2).join(' · ')}
              </p>
            </div>
          ) : null}
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
              {collaborations.map(edge => (
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
                onChange={event => setTaskType(event.target.value as TaskType)}
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
                {allowedTaskTypes.map(type => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>

              <label style={mutedTextStyle}>Task title</label>
              <input
                value={taskTitle}
                onChange={event => setTaskTitle(event.target.value)}
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

              <label style={mutedTextStyle}>Requested model tier</label>
              <select
                value={requestedTier}
                onChange={event => setRequestedTier(event.target.value as ModelTier)}
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
                aria-label="Requested model tier"
              >
                <option value="free">free</option>
                <option value="standard">standard</option>
                <option value="premium">premium</option>
              </select>

              {profile?.modelPolicy.requiresContextGate ? (
                <label
                  style={{
                    ...mutedTextStyle,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    marginBottom: 8,
                  }}
                >
                  <input
                    type="checkbox"
                    checked={contextGateApproved}
                    onChange={event => setContextGateApproved(event.target.checked)}
                  />
                  Context gate approved for premium requests
                </label>
              ) : null}

              {!tierPolicyResult.allowed && tierPolicyResult.reason ? (
                <p style={{ color: '#FCA5A5', fontSize: 12, margin: '0 0 8px 0' }}>
                  {tierPolicyResult.reason}
                </p>
              ) : null}

              <button
                type="button"
                onClick={() => {
                  void handleAssignTask();
                }}
                disabled={isSubmittingTask || !taskTitle.trim() || !tierPolicyResult.allowed}
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
                <ul
                  style={{ margin: '10px 0 0 0', paddingLeft: 16, color: '#CBD5E1', fontSize: 12 }}
                >
                  {assistantTasks.map(task => (
                    <li key={task.id} style={{ marginBottom: 6 }}>
                      <strong>{task.taskType}</strong> — {task.title}
                      <br />
                      <span style={mutedTextStyle}>
                        State: {task.state}
                        {task.blockedReason ? ` · ${task.blockedReason}` : ''}
                      </span>
                      {getNextStates(task.state).length > 0 ? (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 6 }}>
                          {getNextStates(task.state).map(nextState => (
                            <button
                              key={`${task.id}-${nextState}`}
                              type="button"
                              onClick={() => {
                                void handleTaskStateUpdate(task, nextState);
                              }}
                              disabled={updatingTaskId === task.id}
                              style={{
                                border: '1px solid rgba(148,163,184,0.38)',
                                background: 'rgba(15,23,42,0.45)',
                                color: '#CBD5E1',
                                borderRadius: 999,
                                padding: '3px 8px',
                                fontSize: 11,
                                cursor: updatingTaskId === task.id ? 'not-allowed' : 'pointer',
                                opacity: updatingTaskId === task.id ? 0.6 : 1,
                              }}
                              aria-label={`Set task ${task.title} to ${nextState}`}
                            >
                              {nextState}
                            </button>
                          ))}
                        </div>
                      ) : null}
                    </li>
                  ))}
                </ul>
              ) : (
                <p style={{ ...mutedTextStyle, marginTop: 10 }}>
                  No assigned tasks yet for this assistant.
                </p>
              )}
            </>
          ) : (
            <p style={mutedTextStyle}>Select an assistant to assign orchestration tasks.</p>
          )}
        </div>
      </section>
    );
  }
);

SubagentCollaborationPanel.displayName = 'SubagentCollaborationPanel';

export default SubagentCollaborationPanel;
