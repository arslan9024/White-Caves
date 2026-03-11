
import React, { useState, useEffect } from 'react';
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
} from './JobApplicants.styles';

export default function JobApplicants() {
  const [applications, setApplications] = useState([]);
  const [filter, setFilter] = useState('all');
  const [selectedApplication, setSelectedApplication] = useState(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await fetch('/api/job-applications');
      const data = await response.json();
      setApplications(data);
    } catch (error) {
      console.error('Error fetching applications:', error);
    }
  };

  const updateApplicationStatus = async (applicationId, newStatus) => {
    try {
      const response = await fetch(`/api/job-applications/${applicationId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (response.ok) {
        alert('Application status updated successfully!');
        fetchApplications();
        setSelectedApplication(null);
      }
    } catch (error) {
      console.error('Error updating application:', error);
    }
  };

  const filteredApplications = applications.filter(app => {
    if (filter === 'all') return true;
    return app.status === filter;
  });

  const getRoleName = (role) => {
    const roleNames = {
      'LEASING_AGENT': 'Leasing Agent',
      'SALES_AGENT_SECONDARY': 'Sales Agent - Secondary Properties',
      'SALES_AGENT_OFF_PLAN': 'Sales Agent - Off Plan Properties',
      'FREELANCE_AGENT': 'Freelance Agent',
      'FREELANCE_CONSULTANT': 'Freelance Consultant'
    };
    return roleNames[role] || role;
  };

  const getStatusColor = (status) => {
    const colors = {
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
        {filteredApplications.map(application => (
          <StyledApplicationCard key={application._id}>
            <StyledApplicationHeader>
              <h3>{application.applicantName}</h3>
              <StyledStatusBadge backgroundColor={getStatusColor(application.status)}>
                {application.status}
              </StyledStatusBadge>
            </StyledApplicationHeader>
            
            <StyledApplicationDetails>
              <p><strong>Role:</strong> {getRoleName(application.role)}</p>
              <p><strong>Experience:</strong> {application.experience} years</p>
              <p><strong>Languages:</strong> {application.languages}</p>
              <p><strong>Licenses:</strong> {application.licenses}</p>
              <p><strong>Work Location:</strong> {application.workLocation}</p>
              <p><strong>Applied:</strong> {new Date(application.createdAt).toLocaleDateString()}</p>
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
              <p><strong>Applied On:</strong> {new Date(selectedApplication.createdAt).toLocaleString()}</p>
              
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
