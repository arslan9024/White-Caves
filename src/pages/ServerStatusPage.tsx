// src/pages/ServerStatusPage.tsx
import React, { useEffect, useState } from 'react';
import './ServerStatusPage.css';

interface StatusResponse {
  services: string[];
  user: string;
}

const ServerStatusPage: React.FC = () => {
  const [status, setStatus] = useState<StatusResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStatus = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/status');
      if (!res.ok) throw new Error('Failed to load status');
      const data = await res.json();
      setStatus(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  const toggleService = async (service: string, action: 'enable' | 'disable') => {
    try {
      const res = await fetch('/api/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ service, action }),
      });
      if (!res.ok) throw new Error('Toggle failed');
      const data = await res.json();
      setStatus(prev => (prev ? { ...prev, services: data.services } : prev));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  if (loading) return <div className="status-loading">Loading...</div>;
  if (error) return <div className="status-error">Error: {error}</div>;

  return (
    <div className="status-container">
      <h1 className="status-title">Server Service Dashboard</h1>
      <p className="status-subtitle">User: {status?.user}</p>
      <ul className="service-list">
        {status?.services.map(svc => (
          <li key={svc} className="service-item">
            <span className="service-name">{svc}</span>
            <button
              className="service-toggle disable"
              onClick={() => toggleService(svc, 'disable')}
            >
              Disable
            </button>
          </li>
        ))}
        {/* Example of enabling a placeholder service */}
        <li className="service-item new-service">
          <input
            type="text"
            placeholder="Service name"
            className="new-service-input"
            id="newServiceInput"
          />
          <button
            className="service-toggle enable"
            onClick={() => {
              const input = document.getElementById('newServiceInput') as HTMLInputElement;
              if (input && input.value) toggleService(input.value, 'enable');
            }}
          >
            Enable
          </button>
        </li>
      </ul>
    </div>
  );
};

export default ServerStatusPage;
