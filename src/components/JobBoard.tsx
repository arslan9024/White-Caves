
import React, { useState, useEffect } from 'react';
import { createLogger } from '../utils/logger';
import { authFetch } from '../utils/authFetch';
import { useToast } from './Toast';

const log = createLogger('JobBoard');
import {
  JobBoardContainer,
  BoardTitle,
  JobsList,
  JobCard,
  JobTitle,
  JobDescription,
  JobDetails,
  DetailBadge,
  SubmitButton,
  ApplicationForm,
  FormSelect,
  FormInput,
  FormTextarea,
  FormSubmitButton,
  FormGroup,
  FormLabel,
  ErrorMessage,
  SuccessMessage,
  EmptyState,
  EmptyStateIcon,
  EmptyStateTitle,
  EmptyStateDescription,
  FilterBar,
  FilterButton,
  SortDropdown,
  JobCount,
} from './JobBoard.styles';

interface Job {
  _id: string;
  title: string;
  description: string;
  type: string;
  location: string;
}

interface ApplicationFormState {
  role: string;
  resume: File | null;
  experience: string;
  licenses: string;
  languages: string;
  workLocation?: string;
}

export default function JobBoard() {
  const toast = useToast();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [applicationForm, setApplicationForm] = useState<ApplicationFormState>({
    role: '',
    resume: null,
    experience: '',
    licenses: '',
    languages: ''
  });

  const MAX_RESUME_SIZE = 5 * 1024 * 1024; // 5MB

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setApplicationForm({ ...applicationForm, resume: null });
      return;
    }
    // Validate file size
    if (file.size > MAX_RESUME_SIZE) {
      setSubmitError(`File size exceeds ${MAX_RESUME_SIZE / (1024 * 1024)}MB limit`);
      e.target.value = ''; // Reset file input
      return;
    }
    // Validate MIME type
    const validMimes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!validMimes.includes(file.type)) {
      setSubmitError('Invalid file type. Only PDF, DOC, DOCX allowed.');
      e.target.value = '';
      return;
    }
    setSubmitError(null);
    setApplicationForm({ ...applicationForm, resume: file });
  };

  const handleApply = async (jobId: string): Promise<void> => {
    if (isSubmitting) return; // Guard against double-submit

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const formData = new FormData();
      formData.append('jobId', jobId);
      formData.append('role', applicationForm.role);
      if (applicationForm.resume) {
        formData.append('resume', applicationForm.resume);
      }
      formData.append('experience', applicationForm.experience);
      formData.append('licenses', applicationForm.licenses);
      formData.append('languages', applicationForm.languages);

      const response = await authFetch('/api/job-applications', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          (errorData as { message?: string }).message ||
          `HTTP ${response.status}: ${response.statusText}`
        );
      }

      toast.success('Application submitted successfully!');
      setApplicationForm({
        role: '',
        resume: null,
        experience: '',
        licenses: '',
        languages: ''
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to submit application. Please try again.';
      log.error('Error submitting application:', error);
      setSubmitError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
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
                <option value="LEASING_AGENT">Leasing Agent</option>
                <option value="SALES_AGENT_SECONDARY">Sales Agent - Secondary Properties</option>
                <option value="SALES_AGENT_OFF_PLAN">Sales Agent - Off Plan Properties</option>
                <option value="FREELANCE_AGENT">Freelance Agent</option>
                <option value="FREELANCE_CONSULTANT">Freelance Consultant</option>
              </select>
              
              <select 
                value={applicationForm.workLocation}
                onChange={(e) => setApplicationForm({...applicationForm, workLocation: e.target.value})}
                required
              >
                <option value="">Select Work Location</option>
                <option value="ONSITE">On-site</option>
                <option value="REMOTE">Remote</option>
                <option value="HYBRID">Hybrid</option>
              </select>
              
              <input 
                type="file" 
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                aria-label="Upload resume (PDF, DOC, DOCX)"
                required
              />
              
              <input 
                type="text"
                placeholder="Years of Experience"
                value={applicationForm.experience}
                onChange={(e) => setApplicationForm({...applicationForm, experience: e.target.value})}
                aria-label="Years of experience"
                required
              />
              
              <input 
                type="text"
                placeholder="Real Estate Licenses"
                value={applicationForm.licenses}
                onChange={(e) => setApplicationForm({...applicationForm, licenses: e.target.value})}
                aria-label="Real estate licenses"
                required
              />
              
              <input 
                type="text"
                placeholder="Languages Spoken"
                value={applicationForm.languages}
                onChange={(e) => setApplicationForm({...applicationForm, languages: e.target.value})}
                aria-label="Languages spoken"
                required
              />
              
              <button
                type="submit"
                disabled={isSubmitting}
                aria-busy={isSubmitting}
                aria-label={isSubmitting ? 'Submitting application...' : 'Submit application'}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Application'}
              </button>
              {submitError && (
                <div className="error-message" role="alert" style={{ color: '#dc3545', marginTop: '0.5rem' }}>
                  {submitError}
                </div>
              )}
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}
