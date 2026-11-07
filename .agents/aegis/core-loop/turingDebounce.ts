// turingDebounce.ts
// Simple debounce utility for async operations (e.g., file writes).
// Calls the provided function after `wait` ms of inactivity.

type Func<T> = (...args: any[]) => Promise<T> | T;

export function debounce<T>(func: Func<T>, wait: number) {
  let timeout: NodeJS.Timeout | null = null;
  let resolveQueue: ((value: T | PromiseLike<T>) => void)[] = [];
  let rejectQueue: ((reason?: any) => void)[] = [];

  return (...args: any[]): Promise<T> => {
    return new Promise<T>((resolve, reject) => {
      resolveQueue.push(resolve);
      rejectQueue.push(reject);
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(async () => {
        timeout = null;
        try {
          const result = await func(...args);
          resolveQueue.forEach(r => r(result));
        } catch (e) {
          rejectQueue.forEach(r => r(e));
        } finally {
          resolveQueue = [];
          rejectQueue = [];
        }
      }, wait);
    });
  };
}

