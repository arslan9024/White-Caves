import React, { useState, useEffect } from 'react';
import StandbyRosterDrawer from '../../../components/organization/StandbyRosterDrawer';
import './Departments.css';

interface DepartmentDetailPageProps {
  deptSlug?: string;
  onBack?: () => void;
}

export const DepartmentDetailPage: React.FC<DepartmentDetailPageProps> = ({
  deptSlug = 'executive-office',
  onBack,
}) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [newSubTitle, setNewSubTitle] = useState('');
  const [newSubCode, setNewSubCode] = useState('');
  const [newSubSlug, setNewSubSlug] = useState('');
  const [showSubModal, setShowSubModal] = useState(false);

  const [squadName, setSquadName] = useState('');
  const [selectedSubDeptId, setSelectedSubDeptId] = useState('');
  const [supervisorId, setSupervisorId] = useState('');
  const [showSquadModal, setShowSquadModal] = useState(false);

  const fetchDetails = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/corporate-departments/${deptSlug}`);
      const json = await res.json();
      if (json.success) {
        setData(json.data);
      } else {
        setError(json.message || 'Failed to load department container');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [deptSlug]);

  const handleCreateSubDept = async () => {
    if (!newSubTitle || !newSubCode || !newSubSlug || !data?.department?._id) return;
    try {
      const token = localStorage.getItem('token') || '';
      const res = await fetch(`/api/corporate-departments/${data.department._id}/sub-departments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: newSubTitle,
          code: newSubCode,
          slug: newSubSlug,
        }),
      });
      const resData = await res.json();
      if (resData.success) {
        setShowSubModal(false);
        setNewSubTitle('');
        setNewSubCode('');
        setNewSubSlug('');
        fetchDetails();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateSquad = async () => {
    if (!squadName || !selectedSubDeptId || !supervisorId) return;
    try {
      const token = localStorage.getItem('token') || '';
      const res = await fetch('/api/corporate-departments/squads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          subDepartmentId: selectedSubDeptId,
          name: squadName,
          supervisorId,
        }),
      });
      const resData = await res.json();
      if (resData.success) {
        setShowSquadModal(false);
        setSquadName('');
        fetchDetails();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleMoveToStandby = async (personnelId: string) => {
    try {
      const token = localStorage.getItem('token') || '';
      await fetch(`/api/corporate-departments/personnel/${personnelId}/assign`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ targetSquadId: null }),
      });
      fetchDetails();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="depts-loading">Loading Department Workspace...</div>;
  if (error || !data) return <div className="depts-error">{error || 'Not found'}</div>;

  const { department, subDepartments, squads, members } = data;

  return (
    <div className="depts-page">
      <div className="dept-detail-header">
        <button className="btn-back" onClick={onBack}>← Back to Overview</button>
        <div className="dept-detail-title-row">
          <h2>{department.title} ({department.code})</h2>
          <div className="dept-detail-actions">
            <button className="btn-primary" onClick={() => setShowSubModal(true)}>
              + Add Sub-Department Desk
            </button>
            <button className="standby-trigger-btn" onClick={() => setIsDrawerOpen(true)}>
              Standby Pool
            </button>
          </div>
        </div>
      </div>

      <div className="subdepts-grid">
        {subDepartments.map((sub: any) => {
          const subSquads = squads.filter((sq: any) => sq.subDepartmentId === sub._id);
          return (
            <div key={sub._id} className="subdept-card">
              <div className="subdept-card-header">
                <div>
                  <span className="subdept-code">{sub.code}</span>
                  <h4>{sub.title}</h4>
                </div>
                <button
                  className="btn-create-squad"
                  onClick={() => {
                    setSelectedSubDeptId(sub._id);
                    setShowSquadModal(true);
                  }}
                >
                  + Add Squad
                </button>
              </div>

              <div className="squads-container">
                {subSquads.length === 0 ? (
                  <div className="squad-empty">No dynamic squads active on this desk.</div>
                ) : (
                  subSquads.map((sq: any) => {
                    const squadMembers = members.filter((m: any) => m.teamSquadId === sq._id);
                    return (
                      <div key={sq._id} className="squad-box">
                        <div className="squad-box-header">
                          <span className="squad-name">🛡️ {sq.name}</span>
                          <span className="squad-sup">
                            Sup: {sq.supervisorId?.fullName || 'Assigned Supervisor'}
                          </span>
                        </div>
                        <div className="squad-members-list">
                          {squadMembers.map((m: any) => (
                            <div key={m._id} className="squad-member-row">
                              <span className="member-name">
                                {m.isVirtual ? '🤖 ' : '👤 '}
                                {m.fullName} ({m.role})
                              </span>
                              <button
                                className="btn-member-standby"
                                onClick={() => handleMoveToStandby(m._id)}
                              >
                                Move to Standby
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>

      {showSubModal && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <h4>Add Sub-Department Desk</h4>
            <input
              placeholder="Desk Title (e.g. VIP Desk)"
              value={newSubTitle}
              onChange={(e) => setNewSubTitle(e.target.value)}
            />
            <input
              placeholder="Desk Code (e.g. SUB-02-04)"
              value={newSubCode}
              onChange={(e) => setNewSubCode(e.target.value)}
            />
            <input
              placeholder="Slug (e.g. vip-desk)"
              value={newSubSlug}
              onChange={(e) => setNewSubSlug(e.target.value)}
            />
            <div className="modal-actions">
              <button className="btn-primary" onClick={handleCreateSubDept}>Create Desk</button>
              <button className="btn-cancel" onClick={() => setShowSubModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {showSquadModal && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <h4>Create Team Squad</h4>
            <input
              placeholder="Squad Name (e.g. Alpha Luxury Squad)"
              value={squadName}
              onChange={(e) => setSquadName(e.target.value)}
            />
            <input
              placeholder="Supervisor Personnel ID"
              value={supervisorId}
              onChange={(e) => setSupervisorId(e.target.value)}
            />
            <div className="modal-actions">
              <button className="btn-primary" onClick={handleCreateSquad}>Create Squad</button>
              <button className="btn-cancel" onClick={() => setShowSquadModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <StandbyRosterDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onAssignSuccess={fetchDetails}
      />
    </div>
  );
};

export default DepartmentDetailPage;

