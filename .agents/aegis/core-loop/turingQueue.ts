// turingQueue.ts
// Minimal async task queue with configurable concurrency limit.
// No external dependencies – pure TypeScript.

type Task<T = any> = () => Promise<T>;

/**
 * Minimal async task queue with configurable concurrency limit.
 * Provides FIFO scheduling of async tasks and ensures that no more than
 * `concurrency` tasks run simultaneously.
 *
 * @class TuringQueue
 * @see AEG-001 – Orchestration API contract (queue semantics).
 */
export class TuringQueue {
  private readonly concurrency: number;
  private running = 0;
  private queue: Task[] = [];

  constructor(concurrency: number = 5) {
    this.concurrency = concurrency;
  }

  /** Enqueue a task and return a promise that resolves with its result. */
  public enqueue<T>(task: Task<T>): Promise<T> {
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

  private next() {
    if (this.running >= this.concurrency) return;
    const task = this.queue.shift();
    if (!task) return;
    this.running++;
    // Fire‑and‑forget – the wrapped task resolves/rejects its own promise.
    task();
  }
}

