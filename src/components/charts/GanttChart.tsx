import React, { memo, useState } from 'react';
import * as S from './GanttChart.styles';

interface GanttTask {
  id: string;
  label: string;
  start: number; // percentage (0-100)
  duration: number; // percentage (0-100)
  color?: string;
  milestone?: boolean;
}

interface GanttChartProps {
  tasks: GanttTask[];
  months?: string[];
}

/**
 * GanttChart - Gantt Chart Component
 * 
 * Displays project timeline with draggable task bars, milestones,
 * and month-based timeline. Perfect for project management views.
 * 
 * @example
 * <GanttChart
 *   tasks={[
 *     {
 *       id: '1',
 *       label: 'Design',
 *       start: 0,
 *       duration: 20,
 *       color: '#3b82f6'
 *     }
 *   ]}
 *   months={['Jan', 'Feb', 'Mar']}
 * />
 */
const GanttChart = memo(({
  tasks,
  months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
}: GanttChartProps) => {
  const [hoveredTask, setHoveredTask] = useState<string | null>(null);

  return (
    <S.GanttChartContainer>
      <S.GanttHeader>
        <S.GanttTitle>Task</S.GanttTitle>
        <S.GanttTimeline>
          {months.map((month, idx) => (
            <S.TimelineMonth key={idx}>{month}</S.TimelineMonth>
          ))}
        </S.GanttTimeline>
      </S.GanttHeader>

      {tasks.map((task) => (
        <S.GanttRow key={task.id}>
          <S.GanttLabel title={task.label}>{task.label}</S.GanttLabel>
          <S.GanttBarContainer
            onMouseEnter={() => setHoveredTask(task.id)}
            onMouseLeave={() => setHoveredTask(null)}
          >
            <S.GanttBar
              startPercent={task.start}
              widthPercent={task.duration}
              color={task.color}
              draggable
              role="progressbar"
              aria-label={`${task.label}: ${task.duration}%`}
            >
              {task.duration > 10 && task.label}
              {hoveredTask === task.id && (
                <S.GanttTooltip style={{ opacity: 1 }}>
                  {task.label} ({task.duration}%)
                </S.GanttTooltip>
              )}
            </S.GanttBar>
            {task.milestone && <S.GanttMilestone />}
          </S.GanttBarContainer>
        </S.GanttRow>
      ))}
    </S.GanttChartContainer>
  );
});

GanttChart.displayName = 'GanttChart';

export default GanttChart;
