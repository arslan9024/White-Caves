import type { useHRData } from '../hooks/useHRData';
import { JobPostComposer } from '../../shared';
import { useToast } from '../../../Toast';
import type { Job as HRJob } from '../data/jobs';

// P1-8: Keep composer payload narrow and convert to the HR job model locally.
interface ComposerJobData {
  title?: string;
  department?: string;
  location?: string;
  description?: string;
  status?: string;
  type?: string;
  salary?: string;
  requirements?: string;
}

interface PostedJob {
  title?: string;
  [key: string]: unknown;
}

type PostJobState = ReturnType<typeof useHRData>;

interface PostJobTabProps {
  state: PostJobState;
}

export default function PostJobTab({ state }: PostJobTabProps) {
  const { addJob } = state;
  const toast = useToast();

  const handlePostJob = (jobData: ComposerJobData) => {
    const newJob = addJob({
      ...jobData,
      requirements: jobData.requirements
        ? jobData.requirements
            .split('\n')
            .map(item => item.trim())
            .filter(Boolean)
        : [],
    });
    toast.success(`Job posted successfully: ${newJob.title || 'Untitled job'}`);
  };

  return (
    <div className="post-job-view">
      <div className="view-header">
        <h3>Create New Job Posting</h3>
        <p className="view-subtitle">Fill in the details to post a new job opening</p>
      </div>

      <div className="post-job-form-container">
        <JobPostComposer onPublish={(data, _platforms) => handlePostJob(data)} />
      </div>
    </div>
  );
}
