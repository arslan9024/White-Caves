import React from 'react';
import { Search, Edit, Trash2, Eye, Download, Mail } from 'lucide-react';

interface Applicant {
  id: string | number;
  name: string;
  avatar: string;
  email: string;
  job: string;
  status: string;
  phone?: string;
  experience?: string;
  appliedDate?: string;
  score?: number;
}

interface StatusBadgeStyle {
  bg: string;
  color: string;
}

interface ApplicantsState {
  filteredApplicants: Applicant[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filterApplicantStatus: string;
  setFilterApplicantStatus: (status: string) => void;
  selectedApplicant: Applicant | null;
  setSelectedApplicant: (applicant: Applicant | null) => void;
  showApplicantModal: boolean;
  setShowApplicantModal: (show: boolean) => void;
  getApplicantStatusBadge: (status: string) => StatusBadgeStyle;
  updateApplicant: (id: string | number, data: Partial<Applicant>) => void;
  deleteApplicant: (id: string | number) => void;
}

interface ApplicantsTabProps {
  state: ApplicantsState;
}

export default function ApplicantsTab({ state }: ApplicantsTabProps) {
  const {
    filteredApplicants,
    searchQuery,
    setSearchQuery,
    filterApplicantStatus,
    setFilterApplicantStatus,
    selectedApplicant,
    setSelectedApplicant,
    showApplicantModal,
    setShowApplicantModal,
    getApplicantStatusBadge,
    updateApplicant,
    deleteApplicant
  } = state;

  const handleDelete = (id: string | number) => {
    if (window.confirm('Are you sure you want to delete this applicant?')) {
      deleteApplicant(id);
    }
  };

  const handleStatusChange = (id: string | number, newStatus: string) => {
    updateApplicant(id, { status: newStatus });
  };

  return (
    <div className="applicants-view">
      <div className="view-header">
        <div className="search-filter">
          <div className="search-box">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search applicants..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <select
            value={filterApplicantStatus}
            onChange={(e) => setFilterApplicantStatus(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Status</option>
            <option value="new">New</option>
            <option value="shortlisted">Shortlisted</option>
            <option value="interviewed">Interviewed</option>
            <option value="hired">Hired</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
        <div className="view-actions">
          <button className="action-btn secondary">
            <Download size={16} /> Export
          </button>
        </div>
      </div>

      <div className="applicants-grid">
        {filteredApplicants.map((applicant) => {
          const statusStyle = getApplicantStatusBadge(applicant.status);
          return (
            <div key={applicant.id} className="applicant-card">
              <div className="applicant-header">
                <img src={applicant.avatar} alt={applicant.name} className="applicant-avatar" loading="lazy" width={40} height={40} />
                <div className="applicant-info">
                  <h4>{applicant.name}</h4>
                  <p className="applicant-job">{applicant.job}</p>
                </div>
              </div>

              <div className="applicant-details">
                <div className="detail-row">
                  <span className="label">Email:</span>
                  <a href={`mailto:${applicant.email}`}>{applicant.email}</a>
                </div>
                <div className="detail-row">
                  <span className="label">Phone:</span>
                  <span>{applicant.phone}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Experience:</span>
                  <span>{applicant.experience}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Applied:</span>
                  <span>{applicant.appliedDate ? new Date(applicant.appliedDate).toLocaleDateString() : 'N/A'}</span>
                </div>
              </div>

              <div className="applicant-score">
                <div className="score-badge" style={{ color: (applicant.score ?? 0) >= 80 ? '#10b981' : (applicant.score ?? 0) >= 60 ? '#f59e0b' : '#ef4444' }}>
                  Score: {applicant.score ?? 'N/A'}%
                </div>
              </div>

              <div className="status-selector">
                <select
                  value={applicant.status}
                  onChange={(e) => handleStatusChange(applicant.id, e.target.value)}
                  style={{
                    backgroundColor: statusStyle.bg,
                    color: statusStyle.color,
                    border: `1px solid ${statusStyle.color}`
                  }}
                  className="status-select"
                >
                  <option value="new">New</option>
                  <option value="shortlisted">Shortlisted</option>
                  <option value="interviewed">Interviewed</option>
                  <option value="hired">Hired</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              <div className="applicant-actions">
                <button className="action-btn secondary" title="Send Email">
                  <Mail size={16} />
                </button>
                <button
                  className="icon-btn"
                  onClick={() => {
                    setSelectedApplicant(applicant);
                    setShowApplicantModal(true);
                  }}
                >
                  <Eye size={16} />
                </button>
                <button className="icon-btn">
                  <Edit size={16} />
                </button>
                <button className="icon-btn danger" onClick={() => handleDelete(applicant.id)}>
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
