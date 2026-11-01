import React, { useState, useEffect } from 'react';
import './StandbyRosterDrawer.css';

interface StandbyMember {
  _id: string;
  employeeId: string;
  fullName: string;
  role: string;
  employmentType: string;
  isVirtual: boolean;
  title?: string;
  systemPrompt?: string;
}

interface StandbyRosterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onAssignSuccess?: () => void;
}

export const StandbyRosterDrawer: React.FC<StandbyRosterDrawerProps> = ({
  isOpen,
  onClose,
  onAssignSuccess,
}) => {
  const [standbyList, setStandbyList] = useState<StandbyMember[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedMember, setSelectedMember] = useState<StandbyMember | null>(null);
  const [targetSquadId, setTargetSquadId] = useState('');
  const [promptInput, setPromptInput] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchStandby();
    }
  }, [isOpen]);

  const fetchStandby = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/corporate-departments/standby');
      const data = await res.json();
      if (data.success) {
        setStandbyList(data.data);
      }
    } catch (err) {
      console.error('Failed to load standby roster', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = async (memberId: string) => {
    if (!targetSquadId) return;
    setSaving(true);
    try {
      const token = localStorage.getItem('token') || '';
      const res = await fetch(`/api/corporate-departments/personnel/${memberId}/assign`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ targetSquadId }),
      });
      const data = await res.json();
      if (data.success) {
        fetchStandby();
        if (onAssignSuccess) onAssignSuccess();
      }
    } catch (err) {
      console.error('Failed to assign member', err);
    } finally {
      setSaving(false);
      setSelectedMember(null);
    }
  };

  const handlePromptUpdate = async (memberId: string) => {
    setSaving(true);
    try {
      const token = localStorage.getItem('token') || '';
      const res = await fetch(`/api/corporate-departments/personnel/${memberId}/prompt`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ newPrompt: promptInput }),
      });
      const data = await res.json();
      if (data.success) {
        fetchStandby();
      }
    } catch (err) {
      console.error('Failed to update persona prompt', err);
    } finally {
      setSaving(false);
      setSelectedMember(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="standby-drawer-overlay" onClick={onClose}>
      <div className="standby-drawer-content" onClick={(e) => e.stopPropagation()}>
        <div className="standby-drawer-header">
          <h3>Persistent Standby Roster ({standbyList.length})</h3>
          <button className="standby-close-btn" onClick={onClose}>&times;</button>
        </div>
        <p className="standby-desc">
          Universal unassigned personnel pool. Human staff, interns, and virtual assistants preserved under Zero-Data-Loss Law.
        </p>

        {loading ? (
          <div className="standby-loading">Loading standby roster...</div>
        ) : standbyList.length === 0 ? (
          <div className="standby-empty">No personnel currently on standby.</div>
        ) : (
          <div className="standby-list">
            {standbyList.map((m) => (
              <div key={m._id} className="standby-item-card">
                <div className="standby-item-top">
                  <span className={`standby-type-pill ${m.isVirtual ? 'virtual' : 'human'}`}>
                    {m.isVirtual ? '🤖 AI Assistant' : '👤 ' + m.employmentType}
                  </span>
                  <span className="standby-id-badge">{m.employeeId}</span>
                </div>
                <div className="standby-item-title">{m.fullName}</div>
                <div className="standby-item-role">{m.title || m.role}</div>

                <div className="standby-item-actions">
                  <button
                    className="btn-assign-action"
                    onClick={() => {
                      setSelectedMember(m);
                      setPromptInput(m.systemPrompt || '');
                    }}
                  >
                    Quick Assign / Edit
                  </button>
                </div>

                {selectedMember?._id === m._id && (
                  <div className="standby-editor-box">
                    <label>Assign to Team Squad ID:</label>
                    <input
                      type="text"
                      placeholder="Enter Target Squad ID"
                      value={targetSquadId}
                      onChange={(e) => setTargetSquadId(e.target.value)}
                    />
                    <button
                      className="btn-confirm-assign"
                      disabled={saving || !targetSquadId}
                      onClick={() => handleAssign(m._id)}
                    >
                      {saving ? 'Assigning...' : 'Confirm Squad Placement'}
                    </button>

                    {m.isVirtual && (
                      <div className="standby-prompt-edit">
                        <label>AI Persona System Prompt:</label>
                        <textarea
                          rows={3}
                          value={promptInput}
                          onChange={(e) => setPromptInput(e.target.value)}
                        />
                        <button
                          className="btn-save-prompt"
                          disabled={saving}
                          onClick={() => handlePromptUpdate(m._id)}
                        >
                          Update Instructions
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StandbyRosterDrawer;

