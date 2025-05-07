
import React, { useState, useEffect } from 'react';
import './JobBoard.css';

export default function JobBoard() {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);

  const [applicationForm, setApplicationForm] = useState({
    role: '',
    resume: null,
    experience: '',
    licenses: '',
    languages: ''
  });

  const handleFileChange = (e) => {
    setApplicationForm({
      ...applicationForm,
      resume: e.target.files[0]
    });
  };

  const handleApply = async (jobId) => {
    try {
      const formData = new FormData();
      formData.append('jobId', jobId);
      formData.append('role', applicationForm.role);
      formData.append('resume', applicationForm.resume);
      formData.append('experience', applicationForm.experience);
      formData.append('licenses', applicationForm.licenses);
      formData.append('languages', applicationForm.languages);

      const response = await fetch('/api/job-applications', {
        method: 'POST',
        body: formData
      });
      
      if (response.ok) {
        alert('Application submitted successfully!');
        setApplicationForm({
          role: '',
          resume: null,
          experience: '',
          licenses: '',
          languages: ''
        });
      }
    } catch (error) {
      console.error('Error submitting application:', error);
    }
  };

  return (
    <div className="job-board">
      <h2>Real Estate Agent Positions</h2>
      <div className="jobs-list">
        {jobs.map(job => (
          <div key={job._id} className="job-card">
            <h3>{job.title}</h3>
            <p>{job.description}</p>
            <div className="job-details">
              <span>{job.type}</span>
              <span>{job.location}</span>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              handleApply(job._id);
            }} className="application-form">
              <select 
                value={applicationForm.role}
                onChange={(e) => setApplicationForm({...applicationForm, role: e.target.value})}
                required
              >
                <option value="">Select Role</option>
                <option value="SALES_AGENT">Sales Agent</option>
                <option value="LEASING_AGENT">Leasing Agent</option>
              </select>
              
              <input 
                type="file" 
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                required
              />
              
              <input 
                type="text"
                placeholder="Years of Experience"
                value={applicationForm.experience}
                onChange={(e) => setApplicationForm({...applicationForm, experience: e.target.value})}
                required
              />
              
              <input 
                type="text"
                placeholder="Real Estate Licenses"
                value={applicationForm.licenses}
                onChange={(e) => setApplicationForm({...applicationForm, licenses: e.target.value})}
                required
              />
              
              <input 
                type="text"
                placeholder="Languages Spoken"
                value={applicationForm.languages}
                onChange={(e) => setApplicationForm({...applicationForm, languages: e.target.value})}
                required
              />
              
              <button type="submit">Submit Application</button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}
