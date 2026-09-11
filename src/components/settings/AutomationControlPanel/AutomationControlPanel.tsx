import React, { FC, useState } from 'react';
import { Settings } from 'lucide-react';
import { PanelWrap, Title, JobList, JobItem, JobInfo, JobName, JobMeta, RunButton } from './AutomationControlPanel.style';

const CRON_JOBS = [
  { id: 'lead-sla', name: 'Lead SLA Escalation', cron: '0 * * * *' },
  { id: 'lead-rescore', name: 'Daily Lead Re-score', cron: '15 1 * * *' },
  { id: 'permit-checks', name: 'Daily Permit Checks', cron: '0 2 * * *' },
  { id: 'rent-gen', name: 'Monthly Rent Generation', cron: '0 3 1 * *' },
  { id: 'lease-expiry', name: 'Lease Expiry Reminders', cron: '0 9 * * *' },
];

export const AutomationControlPanel: FC = () => {
  const [running, setRunning] = useState<Record<string, boolean>>({});

  const handleRun = (id: string) => {
    setRunning(prev => ({ ...prev, [id]: true }));
    setTimeout(() => {
      setRunning(prev => ({ ...prev, [id]: false }));
    }, 1500);
  };

  return (
    <PanelWrap>
      <Title><Settings size={20} color="#38BDF8" /> Background Automation Engine</Title>
      <p style={{ color: '#94A3B8', fontSize: '0.9rem', marginBottom: 24 }}>
        Manage and manually trigger the Node.js SchedulerService tasks.
      </p>
      
      <JobList>
        {CRON_JOBS.map(job => (
          <JobItem key={job.id}>
            <JobInfo>
              <JobName>{job.name}</JobName>
              <JobMeta>Cadence: {job.cron}</JobMeta>
            </JobInfo>
            <RunButton onClick={() => handleRun(job.id)}>
              {running[job.id] ? 'RUNNING...' : 'Run Now'}
            </RunButton>
          </JobItem>
        ))}
      </JobList>
    </PanelWrap>
  );
};
