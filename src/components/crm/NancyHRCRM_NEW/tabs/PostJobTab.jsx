import React from 'react';
import { JobPostComposer } from '../../shared';

export default function PostJobTab({ state }) {
  const { addJob } = state;

  const handlePostJob = (jobData) => {
    const newJob = addJob(jobData);
    alert(`Job posted successfully: ${newJob.title}`);
  };

  return (
    <div className="post-job-view">
      <div className="view-header">
        <h3>Create New Job Posting</h3>
        <p className="view-subtitle">Fill in the details to post a new job opening</p>
      </div>

      <div className="post-job-form-container">
        <JobPostComposer onSubmit={handlePostJob} />
      </div>
    </div>
  );
}
