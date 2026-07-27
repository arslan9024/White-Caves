import React, { useState } from 'react';

export interface PortalSyncStatus {
  portal: string;
  lastSyncTime: string;
  syncedCount: number;
  failedCount: number;
  skippedCount: number;
  status: 'HEALTHY' | 'WARNING' | 'ERROR';
}

export const PortalSyncDashboardPage: React.FC = () => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatuses, setSyncStatuses] = useState<PortalSyncStatus[]>([
    {
      portal: 'PropertyFinder XML',
      lastSyncTime: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
      syncedCount: 142,
      failedCount: 3,
      skippedCount: 0,
      status: 'HEALTHY',
    },
    {
      portal: 'Bayut JSON',
      lastSyncTime: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
      syncedCount: 139,
      failedCount: 6,
      skippedCount: 2,
      status: 'HEALTHY',
    },
    {
      portal: 'Dubizzle',
      lastSyncTime: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
      syncedCount: 135,
      failedCount: 10,
      skippedCount: 5,
      status: 'WARNING',
    },
  ]);

  const handleManualSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setSyncStatuses((prev) =>
        prev.map((s) => ({
          ...s,
          lastSyncTime: new Date().toISOString(),
          syncedCount: s.syncedCount + 1,
        }))
      );
      setIsSyncing(false);
    }, 1500);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Portal Syndication Dashboard</h1>
          <p className="text-sm text-gray-500">
            Monitor real-time feed syndication health to PropertyFinder, Bayut, and Dubizzle
          </p>
        </div>
        <button
          onClick={handleManualSync}
          disabled={isSyncing}
          className="px-4 py-2 bg-amber-600 text-white rounded-md text-sm font-medium hover:bg-amber-700 disabled:opacity-50 transition-colors"
        >
          {isSyncing ? 'Syncing Feeds...' : 'Trigger Manual Re-sync'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {syncStatuses.map((item) => (
          <div key={item.portal} className="border rounded-lg p-5 shadow-sm bg-white space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-lg">{item.portal}</span>
              <span
                className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  item.status === 'HEALTHY'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}
              >
                {item.status}
              </span>
            </div>
            <div className="text-sm text-gray-500">
              Last Sync: {new Date(item.lastSyncTime).toLocaleTimeString()}
            </div>
            <div className="grid grid-cols-3 gap-2 text-center pt-2 border-t">
              <div>
                <div className="text-lg font-bold text-emerald-600">{item.syncedCount}</div>
                <div className="text-xs text-gray-400">Synced</div>
              </div>
              <div>
                <div className="text-lg font-bold text-rose-600">{item.failedCount}</div>
                <div className="text-xs text-gray-400">Failed</div>
              </div>
              <div>
                <div className="text-lg font-bold text-amber-600">{item.skippedCount}</div>
                <div className="text-xs text-gray-400">Skipped</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PortalSyncDashboardPage;
