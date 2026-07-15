import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Mail, MessageSquare, CheckCircle, Clock } from 'lucide-react';

export function SequenceReport() {
  const [metrics, setMetrics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock fetching from an analytics endpoint
  useEffect(() => {
    setTimeout(() => {
      setMetrics([
        {
          id: 'new_lead_7day_nurture',
          name: 'New Lead 7-Day Nurture',
          sentCount: 1245,
          openRate: 68.4,
          replyRate: 24.2,
          viewingRate: 12.5,
          closedRate: 3.2,
        },
        {
          id: 'lease_renewal_90day',
          name: 'Lease Renewal (90 Days)',
          sentCount: 380,
          openRate: 85.1,
          replyRate: 45.0,
          viewingRate: 0,
          closedRate: 78.5,
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {metrics.map(seq => (
          <div key={seq.id} className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{seq.name}</h3>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center text-sm font-medium text-gray-500 mb-1">
                  <Mail className="w-4 h-4 mr-2" /> Sent Count
                </div>
                <div className="text-2xl font-bold text-gray-900">{seq.sentCount}</div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center text-sm font-medium text-gray-500 mb-1">
                  <MessageSquare className="w-4 h-4 mr-2" /> Reply Rate
                </div>
                <div className="text-2xl font-bold text-gray-900">{seq.replyRate}%</div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center text-sm font-medium text-gray-500 mb-1">
                  <Clock className="w-4 h-4 mr-2" /> Open Rate
                </div>
                <div className="text-2xl font-bold text-gray-900">{seq.openRate}%</div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center text-sm font-medium text-gray-500 mb-1">
                  <CheckCircle className="w-4 h-4 mr-2" /> Success Rate
                </div>
                <div className="text-2xl font-bold text-green-600">{seq.closedRate}%</div>
              </div>
            </div>

            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[seq]}>
                  <XAxis dataKey="name" hide />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="openRate" fill="#3b82f6" name="Open %" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="replyRate" fill="#8b5cf6" name="Reply %" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="closedRate" fill="#10b981" name="Success %" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
