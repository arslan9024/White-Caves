import { useEffect, useRef, useCallback, useState } from 'react';

export interface PredictivePoint {
  x: number;
  y: number;
  time: number;
}

export interface PredictiveTarget {
  id: string;
  bounds: { left: number; top: number; right: number; bottom: number };
  onPrefetch: () => void;
}

/**
 * Hook that calculates mouse velocity & trajectory to trigger predictive prefetching
 * before hover completes.
 */
export function usePredictiveHover(targets: PredictiveTarget[] = [], minVelocity: number = 0.5) {
  const lastMousePos = useRef<PredictivePoint | null>(null);
  const [prefetchedIds, setPrefetchedIds] = useState<string[]>([]);

  const checkTrajectoryIntersection = useCallback(
    (current: PredictivePoint, previous: PredictivePoint) => {
      const dx = current.x - previous.x;
      const dy = current.y - previous.y;
      const dt = current.time - previous.time || 1;

      const velocity = Math.sqrt(dx * dx + dy * dy) / dt;
      if (velocity < minVelocity) return;

      // Project mouse position 200ms into the future
      const projectedX = current.x + dx * 5;
      const projectedY = current.y + dy * 5;

      targets.forEach((target) => {
        if (prefetchedIds.includes(target.id)) return;

        const { left, top, right, bottom } = target.bounds;
        const isProjectedInside =
          projectedX >= left && projectedX <= right && projectedY >= top && projectedY <= bottom;

        if (isProjectedInside) {
          target.onPrefetch();
          setPrefetchedIds((prev) => [...prev, target.id]);
        }
      });
    },
    [targets, minVelocity, prefetchedIds]
  );

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const currentPoint: PredictivePoint = { x: e.clientX, y: e.clientY, time: Date.now() };

      if (lastMousePos.current) {
        checkTrajectoryIntersection(currentPoint, lastMousePos.current);
      }

      lastMousePos.current = currentPoint;
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [checkTrajectoryIntersection]);

  const clearPrefetched = useCallback(() => {
    setPrefetchedIds([]);
  }, []);

  return {
    prefetchedIds,
    clearPrefetched,
  };
}
