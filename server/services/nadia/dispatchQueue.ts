/**
 * W5-003 — Nadia WABA Dispatch Queue
 *
 * Provider-aware in-memory dispatch queue with:
 *  - pair-rate guard (configurable msgs/sec ceiling)
 *  - exponential backoff retry on failure
 *  - dead-letter tracking for exhausted jobs
 */

export type DispatchJobStatus = 'pending' | 'processing' | 'succeeded' | 'failed' | 'dead_letter';

export interface DispatchJob {
  id: string;
  to: string;
  payload: Record<string, unknown>;
  retries: number;
  maxRetries: number;
  lastAttemptAt: Date | null;
  status: DispatchJobStatus;
  createdAt: Date;
}

export interface DrainResult {
  processed: number;
  succeeded: number;
  failed: number;
  deadLettered: number;
  durationMs: number;
}

export type AsyncSendFn = (job: DispatchJob) => Promise<void>;

export interface DispatchQueueStats {
  pending: number;
  processing: number;
  succeeded: number;
  failed: number;
  deadLettered: number;
  lastDrainAt: Date | null;
}

export interface DispatchQueueOptions {
  /** Maximum messages per second (pair-rate guard). Default: 80 */
  rateLimit?: number;
  /** Maximum retry attempts before dead-lettering. Default: 3 */
  maxRetries?: number;
  /** Base backoff delay in ms. Default: 500 */
  backoffBase?: number;
  /** Maximum backoff delay cap in ms. Default: 10 000 */
  backoffMax?: number;
}

const DEFAULT_RATE_LIMIT = 80;
const DEFAULT_MAX_RETRIES = 3;
const DEFAULT_BACKOFF_BASE = 500;
const DEFAULT_BACKOFF_MAX = 10_000;

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function backoffMs(attempt: number, base: number, max: number): number {
  // Exponential: base * 2^attempt, capped at max
  return Math.min(base * Math.pow(2, attempt), max);
}

function generateId(): string {
  return `dq-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export class DispatchQueue {
  private readonly jobs: Map<string, DispatchJob> = new Map();
  private readonly rateLimit: number;
  private readonly maxRetries: number;
  private readonly backoffBase: number;
  private readonly backoffMax: number;
  private lastDrainAt: Date | null = null;
  private stats = { succeeded: 0, failed: 0, deadLettered: 0 };

  constructor(options: DispatchQueueOptions = {}) {
    this.rateLimit = options.rateLimit ?? DEFAULT_RATE_LIMIT;
    this.maxRetries = options.maxRetries ?? DEFAULT_MAX_RETRIES;
    this.backoffBase = options.backoffBase ?? DEFAULT_BACKOFF_BASE;
    this.backoffMax = options.backoffMax ?? DEFAULT_BACKOFF_MAX;
  }

  /**
   * Add a job to the dispatch queue.
   * Returns the generated job ID.
   */
  enqueue(to: string, payload: Record<string, unknown>): string {
    const id = generateId();
    const job: DispatchJob = {
      id,
      to,
      payload,
      retries: 0,
      maxRetries: this.maxRetries,
      lastAttemptAt: null,
      status: 'pending',
      createdAt: new Date(),
    };
    this.jobs.set(id, job);
    return id;
  }

  /**
   * Drain all pending jobs using the provided sender function.
   * Enforces pair-rate guard (msgs/sec) and exponential backoff on failure.
   */
  async drain(sender: AsyncSendFn): Promise<DrainResult> {
    const start = Date.now();
    let processed = 0;
    let succeeded = 0;
    let failed = 0;
    let deadLettered = 0;

    const pending = Array.from(this.jobs.values()).filter(j => j.status === 'pending');

    // Pair-rate tracking
    const minIntervalMs = this.rateLimit > 0 ? 1000 / this.rateLimit : 0;
    let lastSentAt = 0;

    for (const job of pending) {
      job.status = 'processing';
      job.lastAttemptAt = new Date();

      let attempt = 0;
      let lastError: unknown;

      while (attempt <= job.maxRetries) {
        // Apply backoff for retries
        if (attempt > 0) {
          const delay = backoffMs(attempt - 1, this.backoffBase, this.backoffMax);
          await sleep(delay);
        }

        // Pair-rate guard: ensure minimum interval between sends
        const now = Date.now();
        const elapsed = now - lastSentAt;
        if (lastSentAt > 0 && elapsed < minIntervalMs) {
          await sleep(minIntervalMs - elapsed);
        }

        try {
          await sender(job);
          job.status = 'succeeded';
          job.retries = attempt;
          lastSentAt = Date.now();
          succeeded++;
          this.stats.succeeded++;
          break;
        } catch (err) {
          lastError = err;
          attempt++;
          job.retries = attempt;
        }
      }

      if (job.status !== 'succeeded') {
        if (job.retries > job.maxRetries) {
          job.status = 'dead_letter';
          deadLettered++;
          this.stats.deadLettered++;
        } else {
          job.status = 'failed';
          failed++;
          this.stats.failed++;
        }
        // Surface the last error for observability
        void lastError;
      }

      processed++;
    }

    this.lastDrainAt = new Date();

    return {
      processed,
      succeeded,
      failed,
      deadLettered,
      durationMs: Date.now() - start,
    };
  }

  /**
   * Get current queue statistics.
   */
  getStats(): DispatchQueueStats {
    let pending = 0;
    let processing = 0;

    for (const job of this.jobs.values()) {
      if (job.status === 'pending') pending++;
      else if (job.status === 'processing') processing++;
    }

    return {
      pending,
      processing,
      succeeded: this.stats.succeeded,
      failed: this.stats.failed,
      deadLettered: this.stats.deadLettered,
      lastDrainAt: this.lastDrainAt,
    };
  }

  /**
   * Get a job by ID.
   */
  getJob(id: string): DispatchJob | undefined {
    return this.jobs.get(id);
  }

  /**
   * Clear all jobs (for testing / housekeeping).
   */
  clear(): void {
    this.jobs.clear();
    this.stats = { succeeded: 0, failed: 0, deadLettered: 0 };
    this.lastDrainAt = null;
  }
}

/**
 * Factory — creates a fresh DispatchQueue instance.
 */
export function createDispatchQueue(options?: DispatchQueueOptions): DispatchQueue {
  return new DispatchQueue(options);
}
