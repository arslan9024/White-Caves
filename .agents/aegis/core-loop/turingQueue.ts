/**
 * turingQueue.ts — Minimal async task queue with configurable concurrency limit and graceful shutdown.
 * No external dependencies – pure TypeScript.
 */

export type Task<T = unknown> = () => Promise<T>;

/**
 * Minimal async task queue with configurable concurrency limit.
 * Provides FIFO scheduling of async tasks and ensures that no more than
 * `maxConcurrent` tasks run simultaneously.
 *
 * @class TuringQueue
 * @see AEG-001 – Orchestration API contract (queue semantics).
 */
export class TuringQueue {
  public readonly maxConcurrent: number;
  private readonly concurrency: number;
  private running = 0;
  private peakRunning = 0;
  private queue: Array<() => void> = [];
  private closed = false;

  constructor(concurrency: number = 5) {
    this.concurrency = Math.max(1, concurrency);
    this.maxConcurrent = this.concurrency;
  }

  /** Current number of active tasks. */
  public get activeCount(): number {
    return this.running;
  }

  /** Peak concurrent tasks observed. */
  public get peakConcurrentCount(): number {
    return this.peakRunning;
  }

  /** Number of tasks waiting in the queue. */
  public get pendingCount(): number {
    return this.queue.length;
  }

  /** Enqueue a task and return a promise that resolves with its result. */
  public enqueue<T>(task: Task<T>): Promise<T> {
    if (this.closed) {
      return Promise.reject(new Error('TuringQueue is shut down'));
    }
    return new Promise<T>((resolve, reject) => {
      const wrapped = async () => {
        try {
          const result = await task();
          resolve(result);
        } catch (e) {
          reject(e);
        } finally {
          this.running--;
          this.next();
        }
      };
      this.queue.push(wrapped);
      this.next();
    });
  }

  /** Gracefully clears pending tasks and resets queue state. */
  public shutdown(): void {
    this.closed = true;
    this.queue = [];
    this.running = 0;
    this.closed = false;
  }

  private next(): void {
    while (this.running < this.concurrency && this.queue.length > 0) {
      const task = this.queue.shift();
      if (!task) break;
      this.running++;
      if (this.running > this.peakRunning) {
        this.peakRunning = this.running;
      }
      task();
    }
  }
}
