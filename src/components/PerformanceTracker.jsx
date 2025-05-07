
import React, { useState, useEffect } from 'react';
import './PerformanceTracker.css';

export default function PerformanceTracker({ userId }) {
  const [performance, setPerformance] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPerformanceData();
  }, [userId]);

  const fetchPerformanceData = async () => {
    try {
      const response = await fetch(`/api/performance/${userId}`);
      const data = await response.json();
      setPerformance(data);
    } catch (error) {
      console.error('Error fetching performance data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading performance data...</div>;

  return (
    <div className="performance-tracker">
      <h3>Performance & Rewards</h3>
      
      <div className="metrics-grid">
        <div className="metric-card">
          <h4>Overall Rating</h4>
          <div className="rating">{performance?.rating || 'N/A'}/5</div>
        </div>
        
        <div className="metric-card">
          <h4>Sales Closed</h4>
          <div className="metric-value">{performance?.metrics?.salesClosed || 0}</div>
        </div>
        
        <div className="metric-card">
          <h4>Client Satisfaction</h4>
          <div className="metric-value">{performance?.metrics?.clientSatisfaction || 0}%</div>
        </div>
      </div>

      <div className="rewards-section">
        <h4>Rewards & Achievements</h4>
        <div className="rewards-list">
          {performance?.rewards?.map((reward, index) => (
            <div key={index} className="reward-card">
              <h5>{reward.title}</h5>
              <p>{reward.description}</p>
              <span className="points">+{reward.points} points</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
