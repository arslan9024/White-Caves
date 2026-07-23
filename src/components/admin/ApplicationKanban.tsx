import React, { useEffect, useState } from 'react';

interface Application {
  id: string;
  firstName: string;
  lastName: string;
  stage: string;
  job: { title: string };
  createdAt: string;
}

const STAGES = [
  'Applied',
  'HR Screening',
  'Interview Scheduled',
  'Offer Extended',
  'Hired',
  'Rejected',
];

export const ApplicationKanban: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/v1/careers/applications', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    })
      .then(res => res.json())
      .then(data => {
        setApplications(data.data || []);
        setLoading(false);
      });
  }, []);

  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('appId', id);
  };

  const handleDrop = async (e: React.DragEvent, stage: string) => {
    e.preventDefault();
    const id = e.dataTransfer.getData('appId');
    if (!id) return;

    // Optimistic update
    setApplications(prev => prev.map(app => (app.id === id ? { ...app, stage } : app)));

    try {
      await fetch(`/api/v1/careers/applications/${id}/stage`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ stage }),
      });
    } catch (err) {
      console.error(err);
      // Revert in case of error (would need original state tracking in a real app)
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  if (loading) return <div className="p-4">Loading Kanban...</div>;

  return (
    <div className="p-6 h-screen flex flex-col bg-gray-50">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Application Tracking</h1>

      <div className="flex-1 flex overflow-x-auto gap-4 pb-4">
        {STAGES.map(stage => {
          const columnApps = applications.filter(a => a.stage === stage);
          return (
            <div
              key={stage}
              className="bg-gray-100 rounded-lg min-w-[300px] w-[300px] flex flex-col max-h-full"
              onDrop={e => handleDrop(e, stage)}
              onDragOver={handleDragOver}
            >
              <div className="p-3 border-b border-gray-200 font-semibold flex justify-between text-gray-700">
                <span>{stage}</span>
                <span className="bg-gray-300 text-sm px-2 rounded-full">{columnApps.length}</span>
              </div>
              <div className="flex-1 p-2 overflow-y-auto space-y-3">
                {columnApps.map(app => (
                  <div
                    key={app.id}
                    draggable
                    onDragStart={e => handleDragStart(e, app.id)}
                    className="bg-white p-4 rounded shadow-sm border border-gray-200 cursor-move hover:shadow-md transition"
                  >
                    <div className="font-bold">
                      {app.firstName} {app.lastName}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">{app.job.title}</div>
                    <div className="text-xs text-gray-400 mt-3">
                      {new Date(app.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
