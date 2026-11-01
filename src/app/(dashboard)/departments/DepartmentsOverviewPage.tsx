import React, { useState, useEffect } from 'react';
import StandbyRosterDrawer from '../../../components/organization/StandbyRosterDrawer';
import './Departments.css';

interface DepartmentCardData {
  _id: string;
  code: string;
  slug: string;
  title: string;
  color?: string;
  order: number;
  subDeptsCount: number;
  squadsCount: number;
  headcount: number;
  directorOrManagerId?: {
    fullName: string;
    role: string;
  };
}

interface DepartmentsOverviewPageProps {
  onSubItemClick?: (id: string) => void;
}

export const DepartmentsOverviewPage: React.FC<DepartmentsOverviewPageProps> = ({ onSubItemClick }) => {
  const [departments, setDepartments] = useState<DepartmentCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/corporate-departments');
      const data = await res.json();
      if (data.success) {
        setDepartments(data.data);
      } else {
        setError(data.message || 'Failed to fetch departments');
      }
    } catch (err) {
      setError('Network error while loading departments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleRename = async (nodeId: string) => {
    if (!editTitle.trim()) return;
    try {
      const token = localStorage.getItem('token') || '';
      const res = await fetch(`/api/corporate-departments/${nodeId}/rename`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ newTitle: editTitle }),
      });
      const data = await res.json();
      if (data.success) {
        setEditingId(null);
        fetchDepartments();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleReorder = async (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= departments.length) return;
    const reordered = [...departments];
    const [moved] = reordered.splice(fromIndex, 1);
    reordered.splice(toIndex, 0, moved);
    setDepartments(reordered);

    try {
      const token = localStorage.getItem('token') || '';
      await fetch('/api/corporate-departments/reorder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ orderedIds: reordered.map((d) => d._id) }),
      });
    } catch (err) {
      console.error(err);
      fetchDepartments();
    }
  };

  const filtered = departments.filter(
    (d) =>
      d.title.toLowerCase().includes(search.toLowerCase()) ||
      d.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="depts-page">
      <div className="depts-topbar">
        <div>
          <h2>Corporate Departments Hierarchy</h2>
          <p className="depts-subtitle">12 Standard Enterprise Operating Units with Sub-Desks and Dynamic Squads</p>
        </div>
        <div className="depts-top-actions">
          <input
            type="text"
            className="dept-search"
            placeholder="Search departments..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="standby-trigger-btn" onClick={() => setIsDrawerOpen(true)}>
            Standby Roster Pool
          </button>
        </div>
      </div>

      {loading ? (
        <div className="depts-loading">Loading 12 Corporate Units...</div>
      ) : error ? (
        <div className="depts-error">{error}</div>
      ) : (
        <div className="depts-grid">
          {filtered.map((dept, index) => (
            <div
              key={dept._id}
              className="dept-card"
              style={{ borderLeftColor: dept.color || '#8B5CF6' }}
            >
              <div className="dept-card-header">
                <span className="dept-code-badge">{dept.code}</span>
                {editingId === dept._id ? (
                  <div className="dept-rename-box">
                    <input
                      type="text"
                      className="dept-rename-input"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                    />
                    <button className="btn-save-rename" onClick={() => handleRename(dept._id)}>✓</button>
                    <button className="btn-cancel-rename" onClick={() => setEditingId(null)}>✕</button>
                  </div>
                ) : (
                  <h3 className="dept-title">{dept.title}</h3>
                )}
              </div>

              <div className="dept-director">
                Director / Lead: <strong>{dept.directorOrManagerId?.fullName || 'Managing Director'}</strong>
              </div>

              <div className="dept-counters">
                <div className="dept-counter">
                  <span className="counter-val">{dept.subDeptsCount}</span>
                  <span className="counter-lbl">Desks</span>
                </div>
                <div className="dept-counter">
                  <span className="counter-val">{dept.squadsCount}</span>
                  <span className="counter-lbl">Squads</span>
                </div>
                <div className="dept-counter">
                  <span className="counter-val">{dept.headcount}</span>
                  <span className="counter-lbl">Staff</span>
                </div>
              </div>

              <div className="dept-card-actions">
                <button
                  className="btn-open-dept"
                  onClick={() => onSubItemClick?.(`dept-detail-${dept.slug}`)}
                >
                  Open Container ➔
                </button>
                <div className="dept-reorder-group">
                  <button
                    className="btn-reorder"
                    disabled={index === 0}
                    onClick={() => handleReorder(index, index - 1)}
                  >
                    ▲
                  </button>
                  <button
                    className="btn-reorder"
                    disabled={index === departments.length - 1}
                    onClick={() => handleReorder(index, index + 1)}
                  >
                    ▼
                  </button>
                  <button
                    className="btn-rename"
                    onClick={() => {
                      setEditingId(dept._id);
                      setEditTitle(dept.title);
                    }}
                  >
                    ✎
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <StandbyRosterDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onAssignSuccess={fetchDepartments}
      />
    </div>
  );
};

export default DepartmentsOverviewPage;

