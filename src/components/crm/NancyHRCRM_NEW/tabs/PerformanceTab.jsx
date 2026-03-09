import React from 'react';
import { Plus, Star } from 'lucide-react';

export default function PerformanceTab({ state }) {
  const { employees } = state;

  return (
    <div className="performance-view">
      <div className="view-header">
        <h3>Performance Reviews</h3>
        <button className="action-btn primary">
          <Plus size={16} /> New Review
        </button>
      </div>

      <div className="performance-grid">
        {employees.map((emp) => (
          <div key={emp.id} className="performance-card">
            <div className="perf-header">
              <img src={emp.avatar} alt={emp.name} className="perf-avatar" />
              <div className="perf-info">
                <h4>{emp.name}</h4>
                <p>{emp.position}</p>
              </div>
            </div>

            <div className="perf-score">
              <div
                className="score-circle"
                style={{
                  background: `conic-gradient(${emp.performance >= 90 ? '#10b981' : emp.performance >= 70 ? '#f59e0b' : '#ef4444'} ${emp.performance * 3.6}deg, var(--bg-tertiary) 0deg)`
                }}
              >
                <div className="score-inner">
                  <span>{emp.performance}</span>
                </div>
              </div>
              <div className="score-rating">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={16}
                    fill={star <= Math.round(emp.performance / 20) ? '#f59e0b' : 'none'}
                    stroke={star <= Math.round(emp.performance / 20) ? '#f59e0b' : 'currentColor'}
                  />
                ))}
              </div>
            </div>

            <div className="perf-metrics">
              <div className="metric">
                <span className="metric-label">Productivity</span>
                <span className="metric-value">{Math.round(emp.performance * 0.95)}%</span>
              </div>
              <div className="metric">
                <span className="metric-label">Attendance</span>
                <span className="metric-value">{emp.attendance}%</span>
              </div>
              <div className="metric">
                <span className="metric-label">Collaboration</span>
                <span className="metric-value">{Math.round(emp.performance * 0.98)}%</span>
              </div>
            </div>

            <div className="perf-meta">
              <span className="meta-item">Dept: {emp.department}</span>
              <span className="meta-item">Salary: {emp.salary.toLocaleString()} AED</span>
            </div>

            <button className="action-btn secondary">View Full Review</button>
          </div>
        ))}
      </div>
    </div>
  );
}
