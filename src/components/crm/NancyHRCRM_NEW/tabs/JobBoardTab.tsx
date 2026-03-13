import React from 'react';
import { Plus, Edit, Trash2, Users, Eye } from 'lucide-react';

export default function JobBoardTab({ state }) {
  const {
    filteredJobs,
    filterJobStatus,
    setFilterJobStatus,
    selectedJob,
    setSelectedJob,
    showJobModal,
    setShowJobModal,
    getJobStatusBadge,
    deleteJob
  } = state;

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this job posting?')) {
      deleteJob(id);
    }
  };

  const uniqueStatuses = ['all', 'open', 'closed', 'paused'];

  return (
    <div className="careers-view">
      <div className="view-header">
        <div className="search-filter">
          <h3>Open Positions</h3>
          <select
            value={filterJobStatus}
            onChange={(e) => setFilterJobStatus(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Positions</option>
            <option value="open">Open</option>
            <option value="closed">Closed</option>
            <option value="paused">Paused</option>
          </select>
        </div>
        <button className="action-btn primary">
          <Plus size={16} /> Post New Job
        </button>
      </div>

      <div className="jobs-grid">
        {filteredJobs.map((job) => {
          const statusStyle = getJobStatusBadge(job.status);
          return (
            <div key={job.id} className="job-card">
              <div className="job-header">
                <div className="job-title-section">
                  <h4>{job.title}</h4>
                  <span
                    className="job-status"
                    style={{ backgroundColor: statusStyle.bg, color: statusStyle.color }}
                  >
                    {job.status}
                  </span>
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
                  {job.requirements.map((req, idx) => (
                    <li key={idx}>{req}</li>
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
                <button className="icon-btn" onClick={() => { setSelectedJob(job); setShowJobModal(true); }}>
                  <Eye size={16} />
                </button>
                <button className="icon-btn">
                  <Edit size={16} />
                </button>
                <button className="icon-btn danger" onClick={() => handleDelete(job.id)}>
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
