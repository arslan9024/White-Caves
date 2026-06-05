/**
 * useFacets — Fetches property facet counts (W18.1-P0-002)
 */

import { useState, useEffect } from 'react';

export interface FacetCounts {
  type: Record<string, number>;
  status: Record<string, number>;
  furnishing: { furnished: number; unfurnished: number; all: number };
  handoverStage: Record<string, number>;
  permitStatus: Record<string, number>;
  feeBand: Record<string, number>;
}

export interface UseFacetsResult {
  data: FacetCounts | null;
  loading: boolean;
  error: string | null;
}

export function useFacets(): UseFacetsResult {
  const [data, setData]       = useState<FacetCounts | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError]     = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const run = async (): Promise<void> => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/properties/facets');
        if (!res.ok) {
          throw new Error(`Failed to fetch facets: ${res.status} ${res.statusText}`);
        }
        const json = (await res.json()) as { success: boolean; data: FacetCounts };
        if (!cancelled) setData(json.data);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Unknown error fetching facets');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void run();
    return () => { cancelled = true; };
  }, []);

  return { data, loading, error };
}
