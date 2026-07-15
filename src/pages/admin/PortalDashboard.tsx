import React, { useEffect, useState } from 'react';
import { RefreshCw, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export function PortalDashboard() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const res = await fetch('/api/v1/portals/stats', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      const data = await res.json();
      if (data.success) {
        setLogs(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch portal logs', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async (portal: string) => {
    try {
      await fetch(`/api/v1/portals/sync/${portal}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      alert(`Sync triggered for ${portal}`);
      setTimeout(fetchLogs, 2000);
    } catch (err) {
      alert('Failed to trigger sync');
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Loading portal stats...</div>;
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Portal Syndication Dashboard</h1>
        <div className="space-x-4">
          <button
            onClick={() => handleSync('propertyfinder')}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center inline-flex"
          >
            <RefreshCw className="w-4 h-4 mr-2" /> Sync PF
          </button>
          <button
            onClick={() => handleSync('bayut')}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center inline-flex"
          >
            <RefreshCw className="w-4 h-4 mr-2" /> Sync Bayut
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow border overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="p-4 font-medium text-gray-600">Portal</th>
              <th className="p-4 font-medium text-gray-600">Status</th>
              <th className="p-4 font-medium text-gray-600">Last Sync</th>
              <th className="p-4 font-medium text-gray-600">Synced</th>
              <th className="p-4 font-medium text-gray-600">Skipped</th>
              <th className="p-4 font-medium text-gray-600">Failed</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {logs.map(log => (
              <tr key={log.id} className="hover:bg-gray-50">
                <td className="p-4 font-medium capitalize">{log.portal}</td>
                <td className="p-4">
                  {log.status === 'success' && (
                    <span className="inline-flex items-center text-green-600">
                      <CheckCircle className="w-4 h-4 mr-1" /> Success
                    </span>
                  )}
                  {log.status === 'partial' && (
                    <span className="inline-flex items-center text-yellow-600">
                      <AlertTriangle className="w-4 h-4 mr-1" /> Partial
                    </span>
                  )}
                  {log.status === 'failed' && (
                    <span className="inline-flex items-center text-red-600">
                      <XCircle className="w-4 h-4 mr-1" /> Failed
                    </span>
                  )}
                </td>
                <td className="p-4 text-gray-600">
                  {formatDistanceToNow(new Date(log.syncStart), { addSuffix: true })}
                </td>
                <td className="p-4 text-gray-900">{log.totalSynced}</td>
                <td className="p-4 text-yellow-600">{log.totalSkipped}</td>
                <td className="p-4 text-red-600">{log.totalFailed}</td>
              </tr>
            ))}
            {logs.length === 0 && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-gray-500">
                  No sync logs found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
