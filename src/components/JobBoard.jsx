
import React, { useState, useEffect } from 'react';
import './JobBoard.css';

export default function JobBoard() {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);

  const handleApply = async (jobId) => {
    try {
      const response = await fetch('/api/job-applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobId,
          resume: 'resume_url',
          coverLetter: 'cover_letter_text'
        })
      });
      if (response.ok) {
        alert('Application submitted successfully!');
      }
    } catch (error) {
      console.error('Error submitting application:', error);
    }
  };

  return (
    <div className="job-board">
      <h2>Open Positions</h2>
      <div className="jobs-list">
        {jobs.map(job => (
          <div key={job._id} className="job-card">
            <h3>{job.title}</h3>
            <p>{job.description}</p>
            <div className="job-details">
              <span>{job.type}</span>
              <span>{job.location}</span>
            </div>
            <button onClick={() => handleApply(job._id)}>Apply Now</button>
          </div>
        ))}
      </div>
    </div>
  );
}
