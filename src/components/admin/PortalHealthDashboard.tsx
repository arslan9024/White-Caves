import React, { useEffect, useState } from 'react';

interface SyncLogError {
  listingId?: string;
  code?: string;
  message?: string;
}

interface SyncLog {
  id: string;
  portal: string;
  status: string;
  syncStart: string;
  syncEnd: string | null;
  totalSynced: number;
  totalFailed: number;
  totalSkipped: number;
  errors: SyncLogError[] | string | null;
}

type PortalSyncStatus = {
  propertyfinder?: SyncLog;
  bayut?: SyncLog;
};

export const PortalHealthDashboard: React.FC = () => {
  const [logs, setLogs] = useState<SyncLog[]>([]);
  const [latest, setLatest] = useState<PortalSyncStatus>({});
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState<string | null>(null);

  const fetchHealth = async () => {
    try {
      const token = typeof localStorage !== 'undefined' && localStorage?.getItem ? localStorage.getItem('token') : null;
      const res = await fetch('/api/v1/portals/health', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setLogs(data.history || []);
      setLatest(data.latest || {});
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealth();
  }, []);

  const handleManualSync = async (portal: 'propertyfinder' | 'bayut') => {
    setSyncing(portal);
    try {
      const endpoint =
        portal === 'propertyfinder' ? '/api/v1/portals/pf.xml' : '/api/v1/portals/bayut.json';
      await fetch(endpoint, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      await fetchHealth();
    } catch (err) {
      console.error(err);
    } finally {
      setSyncing(null);
    }
  };

  if (loading) return <div className="p-4">Loading Portal Health...</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Portal Sync Health Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {['propertyfinder', 'bayut'].map(p => {
          const portal = p as 'propertyfinder' | 'bayut';
          const log = latest[portal];
          return (
            <div key={portal} className="bg-white p-6 rounded-lg shadow">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold capitalize">
                  {portal === 'propertyfinder' ? 'Property Finder' : 'Bayut'}
                </h2>
                <button
                  onClick={() => handleManualSync(portal)}
                  disabled={syncing === portal}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                >
                  {syncing === portal ? 'Syncing...' : 'Force Sync'}
                </button>
              </div>

              {log ? (
                <div className="space-y-2">
                  <p>
                    <strong>Status:</strong>{' '}
                    <span className={log.status === 'success' ? 'text-green-600' : 'text-red-600'}>
                      {log.status}
                    </span>
                  </p>
                  <p>
                    <strong>Last Sync:</strong> {new Date(log.syncStart).toLocaleString()}
                  </p>
                  <div className="grid grid-cols-3 gap-4 mt-4 text-center">
                    <div className="bg-green-50 p-2 rounded">
                      <div className="text-2xl text-green-700">{log.totalSynced}</div>
                      <div className="text-xs text-green-600">Synced</div>
                    </div>
                    <div className="bg-yellow-50 p-2 rounded">
                      <div className="text-2xl text-yellow-700">{log.totalSkipped}</div>
                      <div className="text-xs text-yellow-600">Skipped</div>
                    </div>
                    <div className="bg-red-50 p-2 rounded">
                      <div className="text-2xl text-red-700">{log.totalFailed}</div>
                      <div className="text-xs text-red-600">Failed</div>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">No sync history found.</p>
              )}
            </div>
          );
        })}
      </div>

      <h2 className="text-2xl font-bold mb-4">Sync History</h2>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Portal
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Time
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stats (S/Sk/F)
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Errors
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {logs.map(log => (
              <tr key={log.id}>
                <td className="px-6 py-4 whitespace-nowrap capitalize">{log.portal}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {new Date(log.syncStart).toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 rounded text-xs ${log.status === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                  >
                    {log.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {log.totalSynced} / {log.totalSkipped} / {log.totalFailed}
                </td>
                <td className="px-6 py-4">
                  {log.errors && Array.isArray(log.errors) && log.errors.length > 0 ? (
                    <div className="max-h-20 overflow-y-auto text-xs text-red-600">
                      {(log.errors as SyncLogError[]).map((e: SyncLogError, i: number) => (
                        <div key={i}>
                          {e.listingId}: {e.message ?? e.code}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
