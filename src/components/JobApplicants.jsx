
import React, { useState, useEffect } from 'react';
import './JobApplicants.css';

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
    <div className="job-applicants">
      <h2>Job Applications</h2>
      
      <div className="filters">
        <button 
          className={filter === 'all' ? 'active' : ''}
          onClick={() => setFilter('all')}
        >
          All ({applications.length})
        </button>
        <button 
          className={filter === 'PENDING' ? 'active' : ''}
          onClick={() => setFilter('PENDING')}
        >
          Pending ({applications.filter(a => a.status === 'PENDING').length})
        </button>
        <button 
          className={filter === 'REVIEWING' ? 'active' : ''}
          onClick={() => setFilter('REVIEWING')}
        >
          Reviewing ({applications.filter(a => a.status === 'REVIEWING').length})
        </button>
        <button 
          className={filter === 'ACCEPTED' ? 'active' : ''}
          onClick={() => setFilter('ACCEPTED')}
        >
          Accepted ({applications.filter(a => a.status === 'ACCEPTED').length})
        </button>
        <button 
          className={filter === 'REJECTED' ? 'active' : ''}
          onClick={() => setFilter('REJECTED')}
        >
          Rejected ({applications.filter(a => a.status === 'REJECTED').length})
        </button>
      </div>

      <div className="applications-grid">
        {filteredApplications.map(application => (
          <div key={application._id} className="application-card">
            <div className="application-header">
              <h3>{application.applicantName}</h3>
              <span 
                className="status-badge" 
                style={{ backgroundColor: getStatusColor(application.status) }}
              >
                {application.status}
              </span>
            </div>
            
            <div className="application-details">
              <p><strong>Role:</strong> {getRoleName(application.role)}</p>
              <p><strong>Experience:</strong> {application.experience} years</p>
              <p><strong>Languages:</strong> {application.languages}</p>
              <p><strong>Licenses:</strong> {application.licenses}</p>
              <p><strong>Work Location:</strong> {application.workLocation}</p>
              <p><strong>Applied:</strong> {new Date(application.createdAt).toLocaleDateString()}</p>
            </div>

            <div className="application-actions">
              <button onClick={() => setSelectedApplication(application)}>
                View Details
              </button>
              {application.resume && (
                <a 
                  href={application.resume} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="download-resume"
                >
                  Download Resume
                </a>
              )}
            </div>

            {application.status === 'PENDING' && (
              <div className="quick-actions">
                <button 
                  className="review-btn"
                  onClick={() => updateApplicationStatus(application._id, 'REVIEWING')}
                >
                  Start Review
                </button>
                <button 
                  className="accept-btn"
                  onClick={() => updateApplicationStatus(application._id, 'ACCEPTED')}
                >
                  Accept
                </button>
                <button 
                  className="reject-btn"
                  onClick={() => updateApplicationStatus(application._id, 'REJECTED')}
                >
                  Reject
                </button>
              </div>
            )}

            {application.status === 'REVIEWING' && (
              <div className="quick-actions">
                <button 
                  className="accept-btn"
                  onClick={() => updateApplicationStatus(application._id, 'ACCEPTED')}
                >
                  Accept
                </button>
                <button 
                  className="reject-btn"
                  onClick={() => updateApplicationStatus(application._id, 'REJECTED')}
                >
                  Reject
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {selectedApplication && (
        <div className="application-modal" onClick={() => setSelectedApplication(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Application Details</h2>
            <button className="close-modal" onClick={() => setSelectedApplication(null)}>×</button>
            
            <div className="modal-body">
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
                <div className="cover-letter">
                  <h3>Cover Letter</h3>
                  <p>{selectedApplication.coverLetter}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
