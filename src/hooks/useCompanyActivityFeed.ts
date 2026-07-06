import { useEffect, useMemo, useRef, useState } from 'react';
import { authFetch } from '../utils/authFetch';

export interface CompanyActivityItem {
  id: string;
  actor: string;
  action: string;
  entity: string;
  timestamp: string;
}

const normalizeActivity = (raw: Record<string, unknown>, index: number): CompanyActivityItem => {
  const id = String(raw.id ?? raw._id ?? `activity-${index}`);
  const actor = String(raw.actor ?? raw.agentName ?? raw.userName ?? 'System');
  const action = String(raw.action ?? raw.type ?? 'updated');
  const entity = String(raw.entityName ?? raw.entity ?? raw.title ?? 'record');
  const timestamp = String(raw.timestamp ?? raw.createdAt ?? new Date().toISOString());

  return { id, actor, action, entity, timestamp };
};

const timeAgo = (timestamp: string): string => {
  const diff = Date.now() - new Date(timestamp).getTime();
  const mins = Math.max(1, Math.floor(diff / 60000));
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hr ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days > 1 ? 's' : ''} ago`;
};

export function useCompanyActivityFeed(seedItems: Record<string, unknown>[] = []) {
  const [items, setItems] = useState<CompanyActivityItem[]>(
    seedItems.slice(0, 8).map((item, index) => normalizeActivity(item, index))
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const response = await authFetch('/api/activities?limit=8');
        if (!response.ok) {
          throw new Error('Unable to load company activity feed');
        }
        const payload = (await response.json()) as {
          data?: { activities?: Record<string, unknown>[] };
        };
        const normalized = (payload.data?.activities || []).map((item, index) =>
          normalizeActivity(item, index)
        );
        if (normalized.length > 0) {
          setItems(normalized);
        }
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to load activities');
      } finally {
        setIsLoading(false);
      }
    };

    void load();
    timerRef.current = setInterval(() => {
      void load();
    }, 30_000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const decoratedItems = useMemo(
    () => items.map(item => ({ ...item, relativeTime: timeAgo(item.timestamp) })),
    [items]
  );

  return {
    items: decoratedItems,
    isLoading,
    error,
  };
}
