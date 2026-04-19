import { JobPostComposer } from '../../shared';
import { useToast } from '../../../Toast';

interface JobData {
  title: string;
  department?: string;
  location?: string;
  description?: string;
  [key: string]: unknown;
}

interface PostedJob {
  title: string;
  [key: string]: unknown;
}

interface PostJobState {
  addJob: (jobData: JobData) => PostedJob;
}

interface PostJobTabProps {
  state: PostJobState;
}

export default function PostJobTab({ state }: PostJobTabProps) {
  const { addJob } = state;
  const toast = useToast();

  const handlePostJob = (jobData: JobData) => {
    const newJob = addJob(jobData);
    toast.success(`Job posted successfully: ${newJob.title}`);
  };

  return (
    <div className="post-job-view">
      <div className="view-header">
        <h3>Create New Job Posting</h3>
        <p className="view-subtitle">Fill in the details to post a new job opening</p>
      </div>

      <div className="post-job-form-container">
        <JobPostComposer onPublish={((data: JobData) => handlePostJob(data)) as any} />
      </div>
    </div>
  );
}
