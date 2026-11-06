// FILE: src/components/crm/TaskManager/TaskManager.cache.ts
/**
 * White Caves Real Estate LLC - TaskManager Localized State Persistence & Cache (Tier 11)
 * Standard: AEGIS Canonical 12-Way Architecture Standard
 * Single Purpose File Law: < 350 lines
 */

import type { TaskNode } from './TaskManager.types';
import { buildCanonical200Tasks } from './TaskManager.data';

const STORAGE_KEY = 'whitecaves_tasks_cache';
const CACHE_TTL_MS = 15 * 60 * 1000; // 15 Minutes TTL

interface CacheEnvelope {
  timestamp: number;
  data: TaskNode[];
}

// In-memory O(1) Map Index for instantaneous lookup by Turing ID
const inMemoryIndex = new Map<string, TaskNode>();

export function indexTasksInMemory(tasks: TaskNode[]): void {
  inMemoryIndex.clear();
  if (!Array.isArray(tasks)) return;
  for (const task of tasks) {
    const id = task?.id || task?._id;
    if (id) {
      inMemoryIndex.set(id.toUpperCase(), task);
    }
    if (task && task.taskCode) {
      inMemoryIndex.set(task.taskCode.toUpperCase(), task);
    }
  }
}

export function getTaskByTuringId(turingId: string): TaskNode | null {
  if (!turingId) return null;
  const cleanId = turingId.trim().toUpperCase();
  return inMemoryIndex.get(cleanId) || null;
}

export function loadTasksCache(): TaskNode[] | null {
  if (typeof window === 'undefined') return buildCanonical200Tasks();

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const canonical = buildCanonical200Tasks();
      indexTasksInMemory(canonical);
      return canonical;
    }

    const envelope: CacheEnvelope = JSON.parse(raw);
    const isExpired = Date.now() - envelope.timestamp > CACHE_TTL_MS;

    if (isExpired || !Array.isArray(envelope.data) || envelope.data.length === 0) {
      const canonical = buildCanonical200Tasks();
      indexTasksInMemory(canonical);
      return canonical;
    }

    indexTasksInMemory(envelope.data);
    return envelope.data;
  } catch {
    const canonical = buildCanonical200Tasks();
    indexTasksInMemory(canonical);
    return canonical;
  }
}

export function saveTasksCache(tasks: TaskNode[]): void {
  if (typeof window === 'undefined') return;

  try {
    const envelope: CacheEnvelope = {
      timestamp: Date.now(),
      data: tasks,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(envelope));
    indexTasksInMemory(tasks);
  } catch {
    // Non-fatal fallback
  }
}
