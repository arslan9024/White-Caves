/* eslint-disable @typescript-eslint/no-explicit-any */
import EventEmitter from 'events';
import logger from '../utils/logger.js';

interface QueueTask {
  id: string;
  type: string;
  data: unknown;
  priority: 'low' | 'normal' | 'high';
  createdAt: Date;
  attempts: number;
  maxAttempts: number;
  nextRetry?: Date;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  error?: string;
}

interface QueueWorker {
  type: string;
  handler: (data: unknown) => Promise<void>;
  concurrency: number;
}

export class MessageQueueService extends EventEmitter {
  private tasks: Map<string, QueueTask> = new Map();
  private workers: Map<string, QueueWorker> = new Map();
  private processingTasks: Set<string> = new Set();
  private deadLetterQueue: QueueTask[] = [];
  private taskId: number = 0;

  constructor() {
    super();
    this.setupCleanup();
  }

  /**
   * Register a worker for task type
   */
  public registerWorker(
    type: string,
    handler: (data: unknown) => Promise<void>,
    concurrency: number = 5
  ): void {
    this.workers.set(type, { type, handler, concurrency });
    logger.info(`Registered worker for task type: ${type}`);
  }

  /**
   * Add task to queue
   */
  public async addTask(
    type: string,
    data: unknown,
    priority: 'low' | 'normal' | 'high' = 'normal',
    maxAttempts: number = 3
  ): Promise<string> {
    const taskId = `task-${Date.now()}-${++this.taskId}`;

    const task: QueueTask = {
      id: taskId,
      type,
      data,
      priority,
      createdAt: new Date(),
      attempts: 0,
      maxAttempts,
      status: 'pending',
    };

    this.tasks.set(taskId, task);
    logger.info(`Task added to queue: ${taskId} (${type})`);

    // Process immediately if worker is available
    this.processNextTask();

    return taskId;
  }

  /**
   * Process next task from queue
   */
  private async processNextTask(): Promise<void> {
    // Get highest priority pending task
    let nextTask: QueueTask | null = null;
    let nextTaskId: string | null = null;

    const priorityOrder = { high: 0, normal: 1, low: 2 };

    for (const [id, task] of this.tasks.entries()) {
      if (task.status === 'pending' && !this.processingTasks.has(id)) {
        // Check if we should retry
        if (task.nextRetry && task.nextRetry > new Date()) {
          continue;
        }

        if (!nextTask || priorityOrder[task.priority] < priorityOrder[nextTask.priority]) {
          nextTask = task;
          nextTaskId = id;
        }
      }
    }

    if (!nextTask || !nextTaskId) {
      return;
    }

    const worker = this.workers.get(nextTask.type);
    if (!worker) {
      logger.warn(`No worker registered for task type: ${nextTask.type}`);
      return;
    }

    // Check if worker has available concurrency
    const processingCount = Array.from(this.processingTasks.values()).filter(id => {
      const task = this.tasks.get(id);
      return task?.type === nextTask!.type;
    }).length;

    if (processingCount >= worker.concurrency) {
      return;
    }

    // Process task
    this.processingTasks.add(nextTaskId);
    nextTask.status = 'processing';
    nextTask.attempts++;

    try {
      logger.info(`Processing task: ${nextTaskId}`);
      await worker.handler(nextTask.data);

      nextTask.status = 'completed';
      this.emit('task-completed', { taskId: nextTaskId, task: nextTask });
      logger.info(`Task completed: ${nextTaskId}`);
    } catch (error) {
      logger.error(`Task failed: ${nextTaskId}`, error);

      if (nextTask.attempts < nextTask.maxAttempts) {
        // Retry with exponential backoff
        const delayMs = Math.pow(2, nextTask.attempts) * 1000; // 2s, 4s, 8s...
        nextTask.nextRetry = new Date(Date.now() + delayMs);
        nextTask.status = 'pending';
        this.emit('task-retry', { taskId: nextTaskId, task: nextTask, delay: delayMs });
        logger.info(`Task will retry in ${delayMs}ms: ${nextTaskId}`);
      } else {
        // Move to dead letter queue
        nextTask.status = 'failed';
        nextTask.error = (error as Error).message;
        this.deadLetterQueue.push(nextTask);
        this.emit('task-failed', { taskId: nextTaskId, task: nextTask, error });
        logger.error(`Task moved to DLQ: ${nextTaskId}`);
      }
    } finally {
      this.processingTasks.delete(nextTaskId);
      // Process next task
      setTimeout(() => this.processNextTask(), 100);
    }
  }

  /**
   * Get task status
   */
  public getTaskStatus(taskId: string): QueueTask | null {
    return this.tasks.get(taskId) || null;
  }

  /**
   * Get queue stats
   */
  public getStats(): {
    pending: number;
    processing: number;
    completed: number;
    failed: number;
    dlqSize: number;
    totalTasks: number;
  } {
    let pending = 0;
    let processing = 0;
    let completed = 0;
    let failed = 0;

    for (const task of this.tasks.values()) {
      if (task.status === 'pending') pending++;
      else if (task.status === 'processing') processing++;
      else if (task.status === 'completed') completed++;
      else if (task.status === 'failed') failed++;
    }

    return {
      pending,
      processing,
      completed,
      failed,
      dlqSize: this.deadLetterQueue.length,
      totalTasks: this.tasks.size,
    };
  }

  /**
   * Get queue metrics
   */
  public getMetrics(): {
    avgProcessingTime: number;
    avgRetries: number;
    successRate: number;
  } {
    let totalTime = 0;
    let totalRetries = 0;
    let completedTasks = 0;

    for (const task of this.tasks.values()) {
      if (task.status === 'completed') {
        const processingTime = task.createdAt ? new Date().getTime() - task.createdAt.getTime() : 0;
        totalTime += processingTime;
        totalRetries += task.attempts - 1;
        completedTasks++;
      }
    }

    const avgProcessingTime = completedTasks > 0 ? totalTime / completedTasks : 0;
    const avgRetries = completedTasks > 0 ? totalRetries / completedTasks : 0;
    const successRate = completedTasks / (this.tasks.size || 1);

    return {
      avgProcessingTime,
      avgRetries,
      successRate,
    };
  }

  /**
   * Get dead letter queue
   */
  public getDeadLetterQueue(): QueueTask[] {
    return this.deadLetterQueue;
  }

  /**
   * Retry task from DLQ
   */
  public async retryFromDLQ(taskId: string): Promise<boolean> {
    const index = this.deadLetterQueue.findIndex(t => t.id === taskId);
    if (index === -1) {
      return false;
    }

    const task = this.deadLetterQueue.splice(index, 1)[0];
    task.status = 'pending';
    task.attempts = 0;
    task.error = undefined;

    this.tasks.set(taskId, task);
    this.processNextTask();

    return true;
  }

  /**
   * Clear completed tasks
   */
  public clearCompleted(olderThanHours: number = 24): number {
    const cutoff = new Date(Date.now() - olderThanHours * 60 * 60 * 1000);
    let deleted = 0;

    for (const [id, task] of this.tasks.entries()) {
      if (task.status === 'completed' && task.createdAt < cutoff) {
        this.tasks.delete(id);
        deleted++;
      }
    }

    logger.info(`Cleared ${deleted} completed tasks`);
    return deleted;
  }

  /**
   * Setup cleanup interval
   */
  private setupCleanup(): void {
    setInterval(
      () => {
        this.clearCompleted(24);
        const stats = this.getStats();
        logger.debug(
          `Queue stats - Pending: ${stats.pending}, Processing: ${stats.processing}, Completed: ${stats.completed}, Failed: ${stats.failed}, DLQ: ${stats.dlqSize}`
        );
      },
      60 * 60 * 1000
    ); // Every hour
  }

  /**
   * Pause queue
   */
  public pause(): void {
    this.processingTasks.clear();
    logger.info('Queue paused');
  }

  /**
   * Resume queue
   */
  public resume(): void {
    logger.info('Queue resumed');
    this.processNextTask();
  }

  /**
   * Shutdown queue gracefully
   */
  public async shutdown(timeoutMs: number = 30000): Promise<void> {
    logger.info('Shutting down message queue...');

    const startTime = Date.now();
    while (this.processingTasks.size > 0 && Date.now() - startTime < timeoutMs) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    if (this.processingTasks.size > 0) {
      logger.warn(`Queue shutdown timeout - ${this.processingTasks.size} tasks still processing`);
    }

    logger.info('Message queue shutdown complete');
  }
}

export default MessageQueueService;
