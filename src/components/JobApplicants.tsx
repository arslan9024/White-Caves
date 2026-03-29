
import React, { useState, useEffect, useRef } from 'react';
import { createLogger } from '../utils/logger';
import { authFetch } from '../utils/authFetch';
import { useToast } from './Toast';

const log = createLogger('JobApplicants');
import {
  StyledJobApplicants,
  StyledJobTitle,
  StyledFilters,
  StyledFilterButton,
  StyledApplicationsGrid,
  StyledApplicationCard,
  StyledApplicationHeader,
  StyledStatusBadge,
  StyledApplicationDetails,
  StyledApplicationActions,
  StyledDownloadResume,
  StyledQuickActions,
  StyledReviewBtn,
  StyledAcceptBtn,
  StyledRejectBtn,
  StyledDetailModal,
  StyledDetailModalContent,
  StyledLoadingContainer,
  StyledSpinner,
  StyledErrorBanner,
  StyledEmptyState,
} from './JobApplicants.styles';

interface JobApplication {
  _id: string;
  applicantName: string;
  applicantEmail?: string;
  role: string;
  status: string;
  email?: string;
  phone?: string;
  experience?: string;
  languages?: string;
  licenses?: string;
  workLocation?: string;
  coverLetter?: string;
  resume?: string;
  createdAt?: string;
  [key: string]: unknown;
}

export default function JobApplicants() {
  const toast = useToast();
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState('all');
  const [selectedApplication, setSelectedApplication] = useState<JobApplication | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    abortRef.current = controller;
    fetchApplications(controller.signal);
    return () => { controller.abort(); };
  }, []);

  const fetchApplications = async (signal?: AbortSignal): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const response = await authFetch('/api/job-applications', { signal });
      if (!response.ok) throw new Error(`Failed to load applications: HTTP ${response.status}`);
      const data = await response.json();
      setApplications(Array.isArray(data) ? data : []);
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') return;
      const msg = err instanceof Error ? err.message : 'Failed to load applications';
      setError(msg);
      log.error('Error fetching applications:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateApplicationStatus = async (applicationId: string, newStatus: string): Promise<void> => {
    try {
      const response = await authFetch(`/api/job-applications/${applicationId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (response.ok) {
        toast.success('Application status updated successfully!');
        fetchApplications(abortRef.current?.signal);
        setSelectedApplication(null);
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        toast.error(errorData.error || errorData.message || 'Failed to update application status');
        log.error('Status update failed:', { applicationId, newStatus, status: response.status });
      }
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Failed to update application status';
      toast.error(msg);
      log.error('Error updating application:', error);
    }
  };

  const filteredApplications = applications.filter(app => {
    if (filter === 'all') return true;
    return app.status === filter;
  });

  const getRoleName = (role: string): string => {
    const roleNames: Record<string, string> = {
      'LEASING_AGENT': 'Leasing Agent',
      'SALES_AGENT_SECONDARY': 'Sales Agent - Secondary Properties',
      'SALES_AGENT_OFF_PLAN': 'Sales Agent - Off Plan Properties',
      'FREELANCE_AGENT': 'Freelance Agent',
      'FREELANCE_CONSULTANT': 'Freelance Consultant'
    };
    return roleNames[role] || role;
  };

  const getStatusColor = (status: string): string => {
    const colors: Record<string, string> = {
      'PENDING': '#FFA500',
      'REVIEWING': '#2196F3',
      'ACCEPTED': '#4CAF50',
      'REJECTED': '#F44336'
    };
    return colors[status] || '#666';
  };

  return (
    <StyledJobApplicants>
      <StyledJobTitle>Job Applications</StyledJobTitle>
      
      <StyledFilters>
        <StyledFilterButton 
          className={filter === 'all' ? 'active' : ''}
          onClick={() => setFilter('all')}
        >
          All ({applications.length})
        </StyledFilterButton>
        <StyledFilterButton 
          className={filter === 'PENDING' ? 'active' : ''}
          onClick={() => setFilter('PENDING')}
        >
          Pending ({applications.filter(a => a.status === 'PENDING').length})
        </StyledFilterButton>
        <StyledFilterButton 
          className={filter === 'REVIEWING' ? 'active' : ''}
          onClick={() => setFilter('REVIEWING')}
        >
          Reviewing ({applications.filter(a => a.status === 'REVIEWING').length})
        </StyledFilterButton>
        <StyledFilterButton 
          className={filter === 'ACCEPTED' ? 'active' : ''}
          onClick={() => setFilter('ACCEPTED')}
        >
          Accepted ({applications.filter(a => a.status === 'ACCEPTED').length})
        </StyledFilterButton>
        <StyledFilterButton 
          className={filter === 'REJECTED' ? 'active' : ''}
          onClick={() => setFilter('REJECTED')}
        >
          Rejected ({applications.filter(a => a.status === 'REJECTED').length})
        </StyledFilterButton>
      </StyledFilters>

      <StyledApplicationsGrid>
        {loading && (
          <StyledLoadingContainer>
            <StyledSpinner />
            <p>Loading job applications…</p>
          </StyledLoadingContainer>
        )}

        {!loading && error && (
          <StyledErrorBanner>
            <p>⚠️ {error}</p>
            <button onClick={() => fetchApplications(abortRef.current?.signal)}>Retry</button>
          </StyledErrorBanner>
        )}

        {!loading && !error && filteredApplications.length === 0 && (
          <StyledEmptyState>
            <span>📋</span>
            <p>{filter !== 'all'
              ? `No ${filter.toLowerCase()} applications found.`
              : 'No job applications yet.'}
            </p>
          </StyledEmptyState>
        )}

        {!loading && !error && filteredApplications.map(application => (
          <StyledApplicationCard key={application._id}>
            <StyledApplicationHeader>
              <h3>{application.applicantName}</h3>
              <StyledStatusBadge $backgroundColor={getStatusColor(application.status)}>
                {application.status}
              </StyledStatusBadge>
            </StyledApplicationHeader>
            
            <StyledApplicationDetails>
              <p><strong>Role:</strong> {getRoleName(application.role)}</p>
              <p><strong>Experience:</strong> {application.experience} years</p>
              <p><strong>Languages:</strong> {application.languages}</p>
              <p><strong>Licenses:</strong> {application.licenses}</p>
              <p><strong>Work Location:</strong> {application.workLocation}</p>
              <p><strong>Applied:</strong> {application.createdAt ? new Date(application.createdAt).toLocaleDateString() : 'Unknown'}</p>
            </StyledApplicationDetails>

            <StyledApplicationActions>
              <button onClick={() => setSelectedApplication(application)}>
                View Details
              </button>
              {application.resume && (
                <StyledDownloadResume 
                  href={application.resume} 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  Download Resume
                </StyledDownloadResume>
              )}
            </StyledApplicationActions>

            {application.status === 'PENDING' && (
              <StyledQuickActions>
                <StyledReviewBtn
                  onClick={() => updateApplicationStatus(application._id, 'REVIEWING')}
                >
                  Start Review
                </StyledReviewBtn>
                <StyledAcceptBtn
                  onClick={() => updateApplicationStatus(application._id, 'ACCEPTED')}
                >
                  Accept
                </StyledAcceptBtn>
                <StyledRejectBtn
                  onClick={() => updateApplicationStatus(application._id, 'REJECTED')}
                >
                  Reject
                </StyledRejectBtn>
              </StyledQuickActions>
            )}

            {application.status === 'REVIEWING' && (
              <StyledQuickActions>
                <StyledAcceptBtn
                  onClick={() => updateApplicationStatus(application._id, 'ACCEPTED')}
                >
                  Accept
                </StyledAcceptBtn>
                <StyledRejectBtn
                  onClick={() => updateApplicationStatus(application._id, 'REJECTED')}
                >
                  Reject
                </StyledRejectBtn>
              </StyledQuickActions>
            )}
          </StyledApplicationCard>
        ))}
      </StyledApplicationsGrid>

      {selectedApplication && (
        <StyledDetailModal onClick={() => setSelectedApplication(null)}>
          <StyledDetailModalContent onClick={(e) => e.stopPropagation()}>
            <h2>Application Details</h2>
            <button 
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: 'none',
                border: 'none',
                fontSize: '2rem',
                cursor: 'pointer',
                color: 'inherit'
              }}
              onClick={() => setSelectedApplication(null)}
            >
              ×
            </button>
            
            <div style={{ marginTop: '1.5rem' }}>
              <p><strong>Applicant:</strong> {selectedApplication.applicantName}</p>
              <p><strong>Email:</strong> {selectedApplication.applicantEmail}</p>
              <p><strong>Role:</strong> {getRoleName(selectedApplication.role)}</p>
              <p><strong>Experience:</strong> {selectedApplication.experience} years</p>
              <p><strong>Languages:</strong> {selectedApplication.languages}</p>
              <p><strong>Licenses:</strong> {selectedApplication.licenses}</p>
              <p><strong>Work Location Preference:</strong> {selectedApplication.workLocation}</p>
              <p><strong>Status:</strong> {selectedApplication.status}</p>
              <p><strong>Applied On:</strong> {selectedApplication.createdAt ? new Date(selectedApplication.createdAt).toLocaleString() : 'Unknown'}</p>
              
              {selectedApplication.coverLetter && (
                <div style={{ marginTop: '1.5rem' }}>
                  <h3>Cover Letter</h3>
                  <p>{selectedApplication.coverLetter}</p>
                </div>
              )}
            </div>
          </StyledDetailModalContent>
        </StyledDetailModal>
      )}
    </StyledJobApplicants>
  );
}
