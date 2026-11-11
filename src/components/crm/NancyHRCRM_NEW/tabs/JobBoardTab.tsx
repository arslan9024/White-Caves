import type { useHRData } from '../hooks/useHRData';
import { useState } from 'react';
import { Plus, Edit, Users, Eye, Layers, ShieldCheck } from 'lucide-react';
import { BHAKTI_RECURSIVE_CAPACITY, HR_PROMOTION_BYLAWS } from '../data/jobs';

type JobBoardState = ReturnType<typeof useHRData>;

interface JobBoardTabProps {
  state: JobBoardState;
}

export default function JobBoardTab({ state }: JobBoardTabProps) {
  const {
    filteredJobs,
    filterJobStatus,
    setFilterJobStatus,
    setSelectedJob,
    setShowJobModal,
    getJobStatusBadge,
    deleteJob,
  } = state;

  const [selectedTier, setSelectedTier] = useState<string>('ALL');

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this job posting?')) {
      deleteJob(id);
    }
  };

  const displayedJobs = filteredJobs.filter(job => {
    if (selectedTier === 'ALL') return true;
    return (job as any).tier === selectedTier;
  });

  return (
    <div className="careers-view">
      {/* ── Bhakti 1-12-108 Protocol Capacity Ledger ───────────────────────── */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.8) 100%)',
          border: '1px solid rgba(239, 68, 68, 0.25)',
          borderRadius: '12px',
          padding: '16px',
          marginBottom: '20px',
        }}
        data-testid="bhakti-capacity-ledger"
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div>
            <h4 style={{ margin: 0, fontSize: '0.88rem', fontWeight: 800, color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Layers size={16} color="#EF4444" />
              Bhakti 1-12-108 Recursive Enterprise Capacity
            </h4>
            <span style={{ fontSize: '0.72rem', color: '#94A3B8' }}>
              Formula: 1 MD → 12 Directors (×12) → 108 Managers (×9) → 1,296 Supervisory Desks (×12) → Dynamic Team Leaders (On-Demand Merit)
            </span>
          </div>
          <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#10B981', background: 'rgba(16, 185, 129, 0.12)', padding: '4px 10px', borderRadius: '20px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
            Core Command: 121 Locked Slots · Law B4 Dynamic Scale
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '8px' }}>
          {[
            { label: 'Tier 1 Directors', count: '12 Seats', key: 'DIRECTOR', color: '#8B5CF6' },
            { label: 'Tier 2 Managers', count: '108 Seats', key: 'MANAGER', color: '#3B82F6' },
            { label: 'Tier 3 Desks', count: '1,296 Capacity', key: 'SUPERVISOR', color: '#10B981' },
            { label: 'Tier 4 Team Leaders', count: 'Dynamic (On-Demand)', key: 'TEAM_LEADER', color: '#F59E0B' },
          ].map(tier => (
            <div
              key={tier.key}
              onClick={() => setSelectedTier(selectedTier === tier.key ? 'ALL' : tier.key)}
              style={{
                background: selectedTier === tier.key ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.3)',
                border: `1px solid ${selectedTier === tier.key ? tier.color : 'rgba(255,255,255,0.06)'}`,
                borderRadius: '8px',
                padding: '8px 12px',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              <div style={{ fontSize: '0.66rem', color: '#94A3B8', fontWeight: 600 }}>{tier.label}</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 800, color: tier.color, marginTop: '2px' }}>{tier.count}</div>
            </div>
          ))}
        </div>

        {/* ── HR Promotion Bylaws Summary ── */}
        <div
          style={{
            marginTop: '12px',
            paddingTop: '10px',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '8px',
            fontSize: '0.72rem',
            color: '#94A3B8',
          }}
          data-testid="hr-promotion-bylaws"
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ShieldCheck size={14} color="#10B981" />
            <strong style={{ color: '#E2E8F0' }}>HR Promotion Bylaws:</strong>
            <span>L5 Entry Unlimited</span>
            <span style={{ color: '#64748B' }}>•</span>
            <span>Team Leader: min <strong style={{ color: '#F59E0B' }}>{HR_PROMOTION_BYLAWS.MIN_FOLLOWERS_FOR_TEAM_LEADER}+ active followers</strong></span>
            <span style={{ color: '#64748B' }}>•</span>
            <span>Supervisor: max <strong style={{ color: '#10B981' }}>{HR_PROMOTION_BYLAWS.MAX_TEAM_LEADERS_PER_SUPERVISOR} TLs</strong></span>
            <span style={{ color: '#64748B' }}>•</span>
            <span>Manager: max <strong style={{ color: '#3B82F6' }}>{HR_PROMOTION_BYLAWS.MAX_SUPERVISORS_PER_MANAGER} Sups</strong></span>
          </div>
          <div style={{ color: '#CBD5E1', fontSize: '0.7rem' }}>
            Integrated with <span style={{ color: '#F59E0B', fontWeight: 700 }}>Merit Leaderboard</span>
          </div>
        </div>
      </div>

      <div className="view-header">
        <div className="search-filter" style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <h3>Open Positions ({displayedJobs.length} Requisitions)</h3>
          <select
            value={filterJobStatus}
            onChange={e => setFilterJobStatus(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Statuses</option>
            <option value="open">Open</option>
            <option value="closed">Closed</option>
            <option value="paused">Paused</option>
          </select>
          <select
            value={selectedTier}
            onChange={e => setSelectedTier(e.target.value)}
            className="filter-select"
            data-testid="filter-tier-select"
          >
            <option value="ALL">All Tiers (1 to 4)</option>
            <option value="DIRECTOR">Tier 1: Directors (12)</option>
            <option value="MANAGER">Tier 2: Managers (108)</option>
            <option value="SUPERVISOR">Tier 3: Supervisory Desks (1,296)</option>
            <option value="TEAM_LEADER">Tier 4: Team Leaders (Dynamic Merit)</option>
          </select>
        </div>
        <button className="action-btn primary">
          <Plus size={16} /> Post New Job
        </button>
      </div>

      <div className="jobs-grid">
        {displayedJobs.map(job => {
          const statusStyle = getJobStatusBadge(job.status);
          const tier = (job as any).tier;
          const quota = (job as any).openSlotsQuota || 1;

          return (
            <div key={job.id} className="job-card" data-testid={`job-card-${job.id}`}>
              <div className="job-header">
                <div className="job-title-section">
                  <h4>{job.title}</h4>
                  <div style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
                    <span
                      className="job-status"
                      style={{ backgroundColor: statusStyle.bg, color: statusStyle.color }}
                    >
                      {job.status}
                    </span>
                    {tier && (
                      <span
                        style={{
                          fontSize: '0.62rem',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          background: 'rgba(255,255,255,0.08)',
                          color: '#CBD5E1',
                          fontWeight: 700,
                          border: '1px solid rgba(255,255,255,0.1)',
                        }}
                      >
                        {tier} · {quota} {quota > 1 ? 'Slots' : 'Seat'}
                      </span>
                    )}
                  </div>
                </div>
                <span className="job-id">{job.id}</span>
              </div>

              <div className="job-details">
                <div className="job-detail-row">
                  <span className="detail-label">Department:</span>
                  <span className="detail-value">{job.department}</span>
                </div>
                <div className="job-detail-row">
                  <span className="detail-label">Location:</span>
                  <span className="detail-value">{job.location}</span>
                </div>
                <div className="job-detail-row">
                  <span className="detail-label">Type:</span>
                  <span className="detail-value">{job.type}</span>
                </div>
                <div className="job-detail-row">
                  <span className="detail-label">Salary:</span>
                  <span className="detail-value">{job.salary}</span>
                </div>
              </div>

              <div className="job-requirements">
                <h5>Requirements:</h5>
                <ul>
                  {(job.requirements ?? []).slice(0, 3).map(req => (
                    <li key={req}>{req}</li>
                  ))}
                </ul>
              </div>

              <div className="job-stats">
                <div className="stat">
                  <Users size={14} />
                  <span>{job.applicants} Applicants</span>
                </div>
                <div className="stat">
                  <span>{job.shortlisted} Shortlisted</span>
                </div>
              </div>

              <div className="job-actions">
                <button
                  className="icon-btn"
                  onClick={() => {
                    setSelectedJob(job);
                    setShowJobModal(true);
                  }}
                >
                  <Eye size={16} />
                </button>
                <button className="icon-btn">
                  <Edit size={16} />
                </button>
                <button className="icon-btn danger" onClick={() => handleDelete(job.id)}>
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
