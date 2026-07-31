import React, { useState } from 'react';
import { Download, Calendar, AlertCircle } from 'lucide-react';

interface Employee {
  id: string | number;
  name: string;
  avatar: string;
  email: string;
  department: string;
  attendance: number;
  leaveBalance: number;
  status: string;
}

interface AttendanceState {
  employees: Employee[];
  getStatusColor: (status: string) => string;
}

interface AttendanceTabProps {
  state: AttendanceState;
}

export default function AttendanceTab({ state }: AttendanceTabProps) {
  const { employees, getStatusColor } = state;
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));

  return (
    <div className="attendance-view">
      <div className="view-header">
        <h3>Attendance & Leaves</h3>
        <div className="header-actions">
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="month-select"
          />
          <button className="action-btn secondary">
            <Download size={16} /> Report
          </button>
        </div>
      </div>

      <div className="attendance-stats">
        <div className="attendance-card">
          <Calendar size={20} />
          <div className="stat-info">
            <span className="stat-value">{employees.filter((e: Employee) => e.attendance >= 95).length}</span>
            <span className="stat-label">Perfect Attendance</span>
          </div>
        </div>
        <div className="attendance-card">
          <AlertCircle size={20} />
          <div className="stat-info">
            <span className="stat-value">{employees.filter((e: Employee) => e.attendance < 90).length}</span>
            <span className="stat-label">Below Target</span>
          </div>
        </div>
        <div className="attendance-card">
          <Calendar size={20} />
          <div className="stat-info">
            <span className="stat-value">{employees.reduce((sum: number, e: Employee) => sum + e.leaveBalance, 0)}</span>
            <span className="stat-label">Total Leave Days</span>
          </div>
        </div>
      </div>

      <div className="attendance-table-wrapper">
        <table className="attendance-table">
          <thead>
            <tr>
              <th>Employee</th>
              <th>Department</th>
              <th>Attendance %</th>
              <th>Leave Balance</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => (
              <tr key={emp.id}>
                <td>
                  <div className="employee-cell">
                    <img src={emp.avatar} alt={emp.name} className="employee-avatar" loading="lazy" width={40} height={40} />
                    <div className="employee-info">
                      <span className="employee-name">{emp.name}</span>
                      <span className="employee-email">{emp.email}</span>
                    </div>
                  </div>
                </td>
                <td>{emp.department}</td>
                <td>
                  <div className="attendance-meter">
                    <div className="meter-bar">
                      <div
                        className="meter-fill"
                        style={{
                          width: `${emp.attendance}%`,
                          backgroundColor: emp.attendance >= 95 ? '#10b981' : emp.attendance >= 90 ? '#f59e0b' : '#ef4444'
                        }}
                      />
                    </div>
                    <span>{emp.attendance}%</span>
                  </div>
                </td>
                <td>
                  <span className="leave-badge">{emp.leaveBalance} days</span>
                </td>
                <td>
                  <span
                    className="status-badge"
                    style={{
                      backgroundColor: `${getStatusColor(emp.status)}20`,
                      color: getStatusColor(emp.status)
                    }}
                  >
                    {emp.status.replace('_', ' ')}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="attendance-legend">
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: 'var(--accent-green, #10b981)' }} />
          <span>95% or higher</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: 'var(--accent-gold, #f59e0b)' }} />
          <span>90% - 95%</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: 'var(--accent-red, #ef4444)' }} />
          <span>Below 90%</span>
        </div>
      </div>
    </div>
  );
}
