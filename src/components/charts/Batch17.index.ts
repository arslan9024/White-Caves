/**
 * Advanced Dashboard & Analytics Components
 * Batch 17 - Styled Components Migration
 * 
 * Centralized export point for all advanced dashboard and analytics components.
 * All components support dark theme, responsive design, and animations.
 */

// Priority Group 1 - Dashboard Analytics (6 items)
export { default as KPICard } from './KPICard';
export { default as ChartContainer } from './ChartContainer';
export { default as MetricsPanel } from './MetricsPanel';
export { default as SummaryCard } from './SummaryCard';
export { default as TrendLine } from './TrendLine';
export { default as HeatmapGrid } from './HeatmapGrid';

// Priority Group 2 - Advanced Features (6 items)
export { default as TimelineView } from './TimelineView';
export { default as KanbanBoard } from './KanbanBoard';
export { default as GanttChart } from './GanttChart';
export { default as SparkLine } from './SparkLine';
export { default as PieChart } from './PieChart';
export { default as BarChart } from './BarChart';

// Export all styled components for advanced usage
export * as KPICardStyles from './KPICard.styles';
export * as ChartContainerStyles from './ChartContainer.styles';
export * as MetricsPanelStyles from './MetricsPanel.styles';
export * as SummaryCardStyles from './SummaryCard.styles';
export * as TrendLineStyles from './TrendLine.styles';
export * as HeatmapGridStyles from './HeatmapGrid.styles';
export * as TimelineViewStyles from './TimelineView.styles';
export * as KanbanBoardStyles from './KanbanBoard.styles';
export * as GanttChartStyles from './GanttChart.styles';
export * as SparkLineStyles from './SparkLine.styles';
export * as PieChartStyles from './PieChart.styles';
export * as BarChartStyles from './BarChart.styles';
