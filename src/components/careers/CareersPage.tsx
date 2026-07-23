import React, { useEffect, useState } from 'react';

interface JobPosting {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  description: string;
  requirements: string[];
}

export const CareersPage: React.FC = () => {
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<JobPosting | null>(null);

  // Application Form State
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    linkedinUrl: '',
    reraBrn: '',
    cvUrl: 'https://example.com/dummy-cv.pdf', // Mock upload
  });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetch('/api/v1/careers')
      .then(res => res.json())
      .then(data => {
        setJobs(data.data || []);
        setLoading(false);
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJob) return;

    try {
      await fetch('/api/v1/careers/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, jobId: selectedJob.id }),
      });
      setSubmitted(true);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="p-10 text-center">Loading Careers...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">Join White Caves</h1>

      {!selectedJob ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {jobs.map(job => (
            <div key={job.id} className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              {/* SEO: JSON-LD for JobPosting */}
              <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                  __html: JSON.stringify({
                    '@context': 'https://schema.org/',
                    '@type': 'JobPosting',
                    title: job.title,
                    description: job.description,
                    datePosted: new Date().toISOString(),
                    employmentType: job.type.toUpperCase().replace('-', '_'),
                    hiringOrganization: {
                      '@type': 'Organization',
                      name: 'White Caves Real Estate',
                      sameAs: 'https://www.whitecaves.com',
                    },
                    jobLocation: {
                      '@type': 'Place',
                      address: {
                        '@type': 'PostalAddress',
                        addressLocality: 'Dubai',
                        addressCountry: 'AE',
                      },
                    },
                  }),
                }}
              />

              <h2 className="text-2xl font-bold mb-2">{job.title}</h2>
              <p className="text-gray-600 mb-4">
                {job.department} • {job.location} • {job.type}
              </p>
              <p className="text-gray-700 mb-6 line-clamp-3">{job.description}</p>
              <button
                onClick={() => setSelectedJob(job)}
                className="w-full bg-black text-white py-2 rounded font-semibold hover:bg-gray-800 transition"
              >
                Apply Now
              </button>
            </div>
          ))}
          {jobs.length === 0 && <p className="text-gray-500">No open positions at the moment.</p>}
        </div>
      ) : (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow border border-gray-200">
          <button
            onClick={() => {
              setSelectedJob(null);
              setSubmitted(false);
            }}
            className="text-blue-600 mb-6 hover:underline"
          >
            &larr; Back to Open Roles
          </button>

          <h2 className="text-3xl font-bold mb-2">{selectedJob.title}</h2>
          <p className="text-gray-600 mb-8">
            {selectedJob.department} • {selectedJob.location}
          </p>

          {submitted ? (
            <div className="bg-green-50 border border-green-200 text-green-800 p-6 rounded text-center">
              <h3 className="text-2xl font-bold mb-2">Application Submitted!</h3>
              <p>We've received your application and will be in touch within 5 business days.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input
                    required
                    type="text"
                    className="w-full p-2 border rounded"
                    value={formData.firstName}
                    onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input
                    required
                    type="text"
                    className="w-full p-2 border rounded"
                    value={formData.lastName}
                    onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    required
                    type="email"
                    className="w-full p-2 border rounded"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    required
                    type="tel"
                    className="w-full p-2 border rounded"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn URL</label>
                <input
                  type="url"
                  className="w-full p-2 border rounded"
                  value={formData.linkedinUrl}
                  onChange={e => setFormData({ ...formData, linkedinUrl: e.target.value })}
                />
              </div>

              {selectedJob.department === 'Sales' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    RERA BRN (If applicable)
                  </label>
                  <input
                    type="text"
                    pattern="\d{6}"
                    className="w-full p-2 border rounded"
                    placeholder="6 digit number"
                    value={formData.reraBrn}
                    onChange={e => setFormData({ ...formData, reraBrn: e.target.value })}
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Resume / CV (PDF ≤ 5MB)
                </label>
                <input type="file" accept=".pdf" className="w-full p-2 border rounded" />
                <p className="text-xs text-gray-500 mt-1">
                  Mock upload: File selection does not actually upload right now.
                </p>
              </div>

              <button
                type="submit"
                className="w-full bg-black text-white py-3 rounded font-bold hover:bg-gray-800 transition"
              >
                Submit Application
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
};
