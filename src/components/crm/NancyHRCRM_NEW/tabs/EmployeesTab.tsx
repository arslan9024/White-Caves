import React from 'react';
import { Search, Plus, Edit, Trash2, Eye, Download, ChevronDown } from 'lucide-react';

export default function EmployeesTab({ state }) {
  const {
    filteredEmployees,
    departments,
    searchQuery,
    setSearchQuery,
    filterDepartment,
    setFilterDepartment,
    selectedEmployee,
    setSelectedEmployee,
    showEmployeeModal,
    setShowEmployeeModal,
    getStatusColor,
    deleteEmployee
  } = state;

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      deleteEmployee(id);
    }
  };

  return (
    <div className="employees-view">
      <div className="view-header">
        <div className="search-filter">
          <div className="search-box">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search employees..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <select
            value={filterDepartment}
            onChange={(e) => setFilterDepartment(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Departments</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>
        <div className="view-actions">
          <button className="action-btn secondary">
            <Download size={16} /> Export
          </button>
          <button className="action-btn primary">
            <Plus size={16} /> Add Employee
          </button>
        </div>
      </div>

      <div className="employees-table-wrapper">
        <table className="employees-table">
          <thead>
            <tr>
              <th>Employee</th>
              <th>Position</th>
              <th>Department</th>
              <th>Status</th>
              <th>Performance</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.map((emp) => (
              <tr key={emp.id}>
                <td>
                  <div className="employee-cell">
                    <img src={emp.avatar} alt={emp.name} className="employee-avatar" />
                    <div className="employee-info">
                      <span className="employee-name">{emp.name}</span>
                      <span className="employee-email">{emp.email}</span>
                    </div>
                  </div>
                </td>
                <td>{emp.position}</td>
                <td>
                  <span className="dept-badge">{emp.department}</span>
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
                <td>
                  <div className="performance-cell">
                    <div className="perf-bar">
                      <div
                        className="perf-fill"
                        style={{
                          width: `${emp.performance}%`,
                          backgroundColor:
                            emp.performance >= 90
                              ? '#10b981'
                              : emp.performance >= 70
                              ? '#f59e0b'
                              : '#ef4444'
                        }}
                      />
                    </div>
                    <span>{emp.performance}%</span>
                  </div>
                </td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="icon-btn"
                      onClick={() => {
                        setSelectedEmployee(emp);
                        setShowEmployeeModal(true);
                      }}
                    >
                      <Eye size={16} />
                    </button>
                    <button className="icon-btn">
                      <Edit size={16} />
                    </button>
                    <button className="icon-btn danger" onClick={() => handleDelete(emp.id)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
