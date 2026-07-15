import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';

export function CareersPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<any | null>(null);

  useEffect(() => {
    fetch('/api/v1/careers')
      .then(res => res.json())
      .then(data => {
        if (data.success) setJobs(data.data);
      })
      .finally(() => setLoading(false));
  }, []);

  const generateJobJSONLD = (job: any) => {
    return {
      '@context': 'https://schema.org/',
      '@type': 'JobPosting',
      title: job.title,
      description: job.description,
      datePosted: job.createdAt,
      hiringOrganization: {
        '@type': 'Organization',
        name: 'White Caves Real Estate LLC',
        sameAs: 'https://whitecaves.ae',
      },
      jobLocation: {
        '@type': 'Place',
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Dubai',
          addressCountry: 'AE',
        },
      },
    };
  };

  const handleApply = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    try {
      const res = await fetch('/api/v1/careers/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobId: selectedJob.id,
          firstName: formData.get('firstName'),
          lastName: formData.get('lastName'),
          email: formData.get('email'),
          phone: formData.get('phone'),
          linkedinUrl: formData.get('linkedinUrl'),
          reraBrn: formData.get('reraBrn'),
          cvUrl: 'https://cloudinary.com/dummy-cv.pdf', // W25-005 requires validated PDF upload in real implementation
        }),
      });
      const data = await res.json();
      if (data.success) {
        alert('Application submitted successfully! Check your email for acknowledgement.');
        setSelectedJob(null);
      }
    } catch (err) {
      alert('Failed to submit application');
    }
  };

  if (loading) return <div className="p-8 text-center">Loading jobs...</div>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-900">
        Join White Caves Real Estate
      </h1>

      {/* W25-013: JSON-LD Structured Data */}
      {jobs.map(job => (
        <Helmet key={job.id}>
          <script type="application/ld+json">{JSON.stringify(generateJobJSONLD(job))}</script>
        </Helmet>
      ))}

      <div className="grid md:grid-cols-2 gap-6">
        {jobs.map(job => (
          <div key={job.id} className="border p-6 rounded-lg shadow-sm bg-white">
            <h2 className="text-xl font-semibold mb-2">{job.title}</h2>
            <p className="text-gray-600 mb-4">
              {job.department} • {job.location}
            </p>
            <p className="text-gray-700 mb-6">{job.description.substring(0, 150)}...</p>
            <button
              onClick={() => setSelectedJob(job)}
              className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
            >
              Apply Now
            </button>
          </div>
        ))}
      </div>

      {selectedJob && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-8 rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-bold mb-4">Apply for {selectedJob.title}</h3>
            <form onSubmit={handleApply} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input
                  required
                  name="firstName"
                  placeholder="First Name"
                  className="border p-2 rounded w-full"
                />
                <input
                  required
                  name="lastName"
                  placeholder="Last Name"
                  className="border p-2 rounded w-full"
                />
              </div>
              <input
                required
                name="email"
                type="email"
                placeholder="Email Address"
                className="border p-2 rounded w-full"
              />
              <input
                required
                name="phone"
                placeholder="Phone Number"
                className="border p-2 rounded w-full"
              />
              <input
                name="linkedinUrl"
                placeholder="LinkedIn URL"
                className="border p-2 rounded w-full"
              />
              <input
                name="reraBrn"
                placeholder="RERA BRN (if applicable)"
                className="border p-2 rounded w-full"
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  CV (PDF, max 5MB)
                </label>
                <input required type="file" accept=".pdf" className="border p-2 rounded w-full" />
              </div>
              <div className="flex space-x-4 mt-6">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                >
                  Submit Application
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedJob(null)}
                  className="flex-1 bg-gray-200 text-gray-800 py-2 rounded hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
