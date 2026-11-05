import React, { FC } from 'react';
import { CheckSquare, PlusCircle } from 'lucide-react';
import { buildCanonical200Tasks } from '../../crm/TaskManager/TaskManager.data';
import { SidebarListWrapper } from './SidebarDepartmentsList.styles';

interface SidebarTasksListProps {
  filterQuery?: string;
  selectedTaskId?: string | null;
  onSelectTask?: (id: string, title: string) => void;
  onOpenCreate?: () => void;
}

export const SidebarTasksList: FC<SidebarTasksListProps> = ({
  filterQuery = '',
  selectedTaskId,
  onSelectTask,
  onOpenCreate,
}) => {
  const allTasks = React.useMemo(() => buildCanonical200Tasks(), []);
  const query = filterQuery.trim().toLowerCase();

  const visibleTasks = allTasks.filter(t => {
    if (!query) return true;
    return (
      t.title.toLowerCase().includes(query) ||
      t.taskCode.toLowerCase().includes(query) ||
      (t.statutoryAuthority && t.statutoryAuthority.toLowerCase().includes(query)) ||
      t.reportingChain.supervisorName.toLowerCase().includes(query)
    );
  });

  return (
    <SidebarListWrapper data-testid="sidebar-tasks-list">
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '4px 8px 10px 8px',
        }}
      >
        <span
          style={{
            fontSize: '0.68rem',
            fontWeight: 800,
            color: '#10B981',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}
        >
          Statutory Tasks ({visibleTasks.length}/200)
        </span>
        {onOpenCreate && (
          <button
            onClick={onOpenCreate}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '2px 8px',
              borderRadius: '4px',
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              color: '#34D399',
              fontSize: '0.68rem',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            <PlusCircle size={12} />
            <span>New Task</span>
          </button>
        )}
      </div>

      {visibleTasks.slice(0, 50).map(task => {
        const isSelected = selectedTaskId === task._id;
        return (
          <div
            key={task._id}
            onClick={() => onSelectTask?.(task._id, task.title)}
            data-testid={`sidebar-task-${task.taskCode}`}
            style={{
              padding: '10px 12px',
              borderRadius: '8px',
              background: isSelected ? 'rgba(16, 185, 129, 0.15)' : '#070D18',
              border: isSelected ? '1px solid #10B981' : '1px solid rgba(255, 255, 255, 0.05)',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
              marginBottom: '6px',
              transition: 'all 0.15s ease',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span
                  style={{
                    fontSize: '0.65rem',
                    fontFamily: 'monospace',
                    fontWeight: 800,
                    color: '#34D399',
                    background: 'rgba(16, 185, 129, 0.12)',
                    padding: '1px 5px',
                    borderRadius: '4px',
                  }}
                >
                  {task.taskCode}
                </span>
                {task.statutoryAuthority && (
                  <span style={{ fontSize: '0.62rem', color: '#94A3B8', fontWeight: 600 }}>
                    {task.statutoryAuthority}
                  </span>
                )}
              </div>
              <span
                style={{
                  fontSize: '0.62rem',
                  fontWeight: 800,
                  fontFamily: 'monospace',
                  color:
                    task.priority === 'CRITICAL'
                      ? '#F87171'
                      : task.priority === 'HIGH'
                        ? '#FBBF24'
                        : '#60A5FA',
                }}
              >
                {task.priority}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
              <div
                style={{
                  width: '22px',
                  height: '22px',
                  borderRadius: '6px',
                  background: 'rgba(16, 185, 129, 0.12)',
                  color: '#34D399',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  marginTop: '1px',
                }}
              >
                <CheckSquare size={13} />
              </div>
              <div
                style={{ fontSize: '0.75rem', fontWeight: 700, color: '#FFFFFF', lineHeight: 1.25 }}
              >
                {task.title}
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '0.65rem',
                color: '#64748B',
                borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                paddingTop: '4px',
              }}
            >
              <span>
                Sup:{' '}
                <strong style={{ color: '#94A3B8' }}>{task.reportingChain.supervisorName}</strong>
              </span>
              <span style={{ color: '#10B981', fontFamily: 'monospace' }}>{task.defaultSla}</span>
            </div>
          </div>
        );
      })}

      {visibleTasks.length > 50 && (
        <div style={{ padding: '8px', textAlign: 'center', fontSize: '0.68rem', color: '#64748B' }}>
          Showing 50 of {visibleTasks.length} tasks. Use search to filter.
        </div>
      )}
    </SidebarListWrapper>
  );
};
