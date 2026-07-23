import { lazy, ComponentType } from 'react';

const retryPromise = <R>(
  fn: () => Promise<R>,
  retriesLeft: number = 3,
  interval: number = 1000
): Promise<R> => {
  return fn().catch((error) => {
    if (retriesLeft <= 1) {
      throw error;
    }
    return new Promise<R>((resolve) => {
      setTimeout(() => {
        resolve(retryPromise(fn, retriesLeft - 1, interval));
      }, interval);
    });
  });
};

export const lazyRetry = <T extends ComponentType<any>>(
  componentImport: () => Promise<{ default: T }>,
  retriesLeft: number = 3,
  interval: number = 1000
) => {
  return lazy(() => retryPromise(componentImport, retriesLeft, interval));
};
