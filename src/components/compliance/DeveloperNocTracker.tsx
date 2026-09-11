import React, { useState } from 'react';

type NocStage = 'application' | 'service_charge' | 'inspection' | 'issued';

interface NocApplication {
  id: string;
  developer: 'EMAAR' | 'DAMAC' | 'Nakheel' | 'Sobha';
  unit: string;
  stage: NocStage;
  applicant: string;
}

const INITIAL_APPLICATIONS: NocApplication[] = [
  { id: 'NOC-001', developer: 'EMAAR', unit: 'Marina Promenade 104', stage: 'application', applicant: 'John Doe' },
  { id: 'NOC-002', developer: 'DAMAC', unit: 'Aykon City 402', stage: 'service_charge', applicant: 'Jane Smith' },
  { id: 'NOC-003', developer: 'Nakheel', unit: 'Palm Jumeirah V-12', stage: 'inspection', applicant: 'Ahmed Ali' },
];

export function DeveloperNocTracker() {
  const [applications, setApplications] = useState<NocApplication[]>(INITIAL_APPLICATIONS);

  const moveApplication = (id: string, newStage: NocStage) => {
    setApplications(apps => apps.map(app => app.id === id ? { ...app, stage: newStage } : app));
  };

  const stages: { key: NocStage; label: string; color: string }[] = [
    { key: 'application', label: '1. Application Filed', color: 'bg-slate-100' },
    { key: 'service_charge', label: '2. Service Charge Clearance', color: 'bg-blue-50' },
    { key: 'inspection', label: '3. Inspection Pending', color: 'bg-amber-50' },
    { key: 'issued', label: '4. Final NOC Issued', color: 'bg-green-50' },
  ];

  return (
    <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-200">
      <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
        <span>🏢</span> Developer NOC (No Objection Certificate) Status Tracker
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stages.map(stage => (
          <div key={stage.key} className={`rounded-xl p-4 border border-slate-200 ${stage.color} min-h-[400px]`}>
            <h3 className="font-semibold text-slate-800 mb-4">{stage.label}</h3>
            
            <div className="space-y-3">
              {applications.filter(app => app.stage === stage.key).map(app => (
                <div key={app.id} className="bg-white p-3 rounded-lg shadow-sm border border-slate-200">
                  <div className="text-xs font-bold text-blue-600 mb-1">{app.developer}</div>
                  <div className="font-medium text-sm text-slate-800">{app.unit}</div>
                  <div className="text-xs text-slate-500 mt-1">{app.applicant}</div>
                  
                  <div className="mt-3 flex flex-wrap gap-2">
                    {stage.key !== 'application' && (
                      <button 
                        onClick={() => moveApplication(app.id, stages[stages.findIndex(s => s.key === stage.key) - 1].key)}
                        className="text-xs px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded text-slate-600 transition-colors"
                      >
                        ← Back
                      </button>
                    )}
                    {stage.key !== 'issued' && (
                      <button 
                        onClick={() => moveApplication(app.id, stages[stages.findIndex(s => s.key === stage.key) + 1].key)}
                        className="text-xs px-2 py-1 bg-blue-100 hover:bg-blue-200 rounded text-blue-700 transition-colors"
                      >
                        Advance →
                      </button>
                    )}
                  </div>
                </div>
              ))}
              
              {applications.filter(app => app.stage === stage.key).length === 0 && (
                <div className="text-sm text-slate-400 text-center py-4 border-2 border-dashed border-slate-200 rounded-lg">
                  No applications
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
