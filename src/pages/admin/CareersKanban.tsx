import React, { useEffect, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';

const STAGES = ['applied', 'screening', 'interview', 'offer', 'hired', 'rejected'];

export function CareersKanban() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await fetch('/api/v1/careers/applications', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      const data = await res.json();
      if (data.success) setApplications(data.data);
    } catch (err) {
      console.error('Failed to fetch applications', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('applicationId', id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // Necessary to allow dropping
  };

  const handleDrop = async (e: React.DragEvent, targetStage: string) => {
    e.preventDefault();
    const id = e.dataTransfer.getData('applicationId');
    if (!id) return;

    // Optimistic UI update
    setApplications(prev =>
      prev.map(app => (app.id === id ? { ...app, status: targetStage } : app))
    );

    try {
      await fetch(`/api/v1/careers/applications/${id}/stage`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ stage: targetStage }),
      });
    } catch (err) {
      console.error('Failed to update stage', err);
      // Revert on failure (simplified)
      fetchApplications();
    }
  };

  if (loading) return <div className="p-8 text-center">Loading applications...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Recruitment Kanban</h1>

      <div className="flex space-x-4 overflow-x-auto pb-4">
        {STAGES.map(stage => {
          const stageApps = applications.filter(app => app.status === stage);
          return (
            <div
              key={stage}
              className="flex-shrink-0 w-80 bg-gray-100 rounded-lg flex flex-col max-h-[80vh]"
              onDragOver={handleDragOver}
              onDrop={e => handleDrop(e, stage)}
            >
              <div className="p-3 border-b border-gray-200">
                <h3 className="font-semibold text-gray-700 capitalize flex justify-between">
                  {stage}{' '}
                  <span className="bg-gray-200 px-2 rounded-full text-sm">{stageApps.length}</span>
                </h3>
              </div>
              <div className="p-3 flex-1 overflow-y-auto space-y-3">
                {stageApps.map(app => (
                  <div
                    key={app.id}
                    draggable
                    onDragStart={e => handleDragStart(e, app.id)}
                    className="bg-white p-3 rounded shadow-sm border border-gray-200 cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow"
                  >
                    <div className="font-medium text-gray-900">
                      {app.firstName} {app.lastName}
                    </div>
                    <div className="text-sm text-gray-500 mb-2">
                      {app.job?.title || 'Unknown Role'}
                    </div>
                    <div className="text-xs text-gray-400">
                      Applied {formatDistanceToNow(new Date(app.createdAt))} ago
                    </div>
                  </div>
                ))}
                {stageApps.length === 0 && (
                  <div className="text-center p-4 text-sm text-gray-400 border-2 border-dashed border-gray-200 rounded">
                    Drop candidates here
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
