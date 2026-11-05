/**
 * TaskManager.logic.ts
 * 7-Category Architecture: Logic Layer
 * State management, search, and hierarchy workflow orchestration for 200+ Tasks
 */

import { useState, useMemo, useCallback } from 'react';
import type { TaskNode, TaskStatus } from './TaskManager.types';
import { buildCanonical200Tasks, TASK_PILLARS, TASK_CATEGORIES } from './TaskManager.data';
import {
  executeCreateTaskWorkflow,
  executeUpdateTaskWorkflow,
  executeAdvanceTaskStatusWorkflow,
  executeReassignTaskChainWorkflow,
} from './TaskManager.workflow';

export function useTaskManager() {
  const [tasks, setTasks] = useState<TaskNode[]>(buildCanonical200Tasks);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPillar, setSelectedPillar] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'board'>('grid');
  const [statusToast, setStatusToast] = useState<string | null>(null);

  // Drawer / modal states
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskNode | null>(null);

  const showStatus = useCallback((msg: string) => {
    setStatusToast(msg);
    setTimeout(() => setStatusToast(null), 4000);
  }, []);

  const handleCreateTask = useCallback(
    (payload: Omit<TaskNode, '_id' | 'taskCode'>) => {
      setTasks(prev => {
        const res = executeCreateTaskWorkflow(prev, payload);
        showStatus(res.message);
        return res.success ? res.tasks : prev;
      });
      setIsDrawerOpen(false);
    },
    [showStatus]
  );

  const handleUpdateTask = useCallback(
    (id: string, patch: Partial<TaskNode>) => {
      setTasks(prev => {
        const res = executeUpdateTaskWorkflow(prev, id, patch);
        showStatus(res.message);
        return res.success ? res.tasks : prev;
      });
      setIsDrawerOpen(false);
    },
    [showStatus]
  );

  const handleAdvanceStatus = useCallback(
    (id: string, newStatus: TaskStatus) => {
      setTasks(prev => {
        const res = executeAdvanceTaskStatusWorkflow(prev, id, newStatus);
        showStatus(res.message);
        return res.success ? res.tasks : prev;
      });
    },
    [showStatus]
  );

  const handleReassignChain = useCallback(
    (id: string, chain: any) => {
      setTasks(prev => {
        const res = executeReassignTaskChainWorkflow(prev, id, chain);
        showStatus(res.message);
        return res.success ? res.tasks : prev;
      });
    },
    [showStatus]
  );

  const handleOpenCreate = useCallback(() => {
    setEditingTask(null);
    setIsDrawerOpen(true);
  }, []);

  const handleOpenEdit = useCallback((task: TaskNode) => {
    setEditingTask(task);
    setIsDrawerOpen(true);
  }, []);

  const handleCloseDrawer = useCallback(() => {
    setIsDrawerOpen(false);
    setEditingTask(null);
  }, []);

  // Filtered tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter(t => {
      if (selectedPillar !== 'all' && t.pillarId !== selectedPillar) return false;
      if (selectedCategory !== 'all' && t.category !== selectedCategory) return false;
      if (selectedPriority !== 'all' && t.priority !== selectedPriority) return false;
      if (selectedStatus !== 'all' && t.status !== selectedStatus) return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        t.title.toLowerCase().includes(q) ||
        t.taskCode.toLowerCase().includes(q) ||
        (t.statutoryAuthority && t.statutoryAuthority.toLowerCase().includes(q)) ||
        t.reportingChain.supervisorName.toLowerCase().includes(q) ||
        t.reportingChain.directorName.toLowerCase().includes(q)
      );
    });
  }, [tasks, searchQuery, selectedPillar, selectedCategory, selectedPriority, selectedStatus]);

  // Task metrics
  const metrics = useMemo(() => {
    const total = tasks.length;
    const pending = tasks.filter(t => t.status === 'PENDING').length;
    const inProgress = tasks.filter(t => t.status === 'IN_PROGRESS').length;
    const review = tasks.filter(t => t.status === 'REVIEW').length;
    const completed = tasks.filter(t => t.status === 'COMPLETED').length;
    const critical = tasks.filter(t => t.priority === 'CRITICAL').length;
    return { total, pending, inProgress, review, completed, critical };
  }, [tasks]);

  return {
    tasks,
    filteredTasks,
    searchQuery,
    setSearchQuery,
    selectedPillar,
    setSelectedPillar,
    selectedCategory,
    setSelectedCategory,
    selectedPriority,
    setSelectedPriority,
    selectedStatus,
    setSelectedStatus,
    viewMode,
    setViewMode,
    statusToast,
    isDrawerOpen,
    editingTask,
    metrics,
    pillars: TASK_PILLARS,
    categories: TASK_CATEGORIES,
    handleCreateTask,
    handleUpdateTask,
    handleAdvanceStatus,
    handleReassignChain,
    handleOpenCreate,
    handleOpenEdit,
    handleCloseDrawer,
  };
}
