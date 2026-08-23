import React, { useState, useEffect } from 'react';
import { 
  Building, Calendar, Wrench, Bell, CheckCircle2, 
  Clock, Plus, Search, Filter, MessageSquare, AlertCircle
} from 'lucide-react';
import './AssistantDashboard.css';

export interface AuthUser {
  id?: string;
  name?: string;
  email?: string;
  role?: string;
  [key: string]: unknown;
}

interface JunoProps {
  moduleId?: string;
  role?: string;
  user?: AuthUser;
}

export const JunoCommunity: React.FC<JunoProps> = ({ moduleId }) => {
  const [activeTab, setActiveTab] = useState<'booking' | 'maintenance' | 'service' | 'notices'>('booking');

  useEffect(() => {
    if (!moduleId) return;
    if (moduleId.includes('booking') || moduleId.includes('facility')) setActiveTab('booking');
    else if (moduleId.includes('maintenance')) setActiveTab('maintenance');
    else if (moduleId.includes('service')) setActiveTab('service');
    else if (moduleId.includes('notice')) setActiveTab('notices');
  }, [moduleId]);

  // Feature 1: Facility Booking
  const [bookings, setBookings] = useState([
    { id: 'BKG-401', amenity: 'Rooftop Infinity Pool & Cabana', tenant: 'Marcus Vance (Unit 1102)', date: '2026-08-25', time: '14:00 - 18:00', status: 'CONFIRMED' },
    { id: 'BKG-402', amenity: 'Padel Tennis Court 1', tenant: 'Elena Rostova (Unit 404)', date: '2026-08-26', time: '08:00 - 10:00', status: 'CONFIRMED' },
    { id: 'BKG-403', amenity: 'Private Residents Cinema', tenant: 'Khalid Al Hashemi (Unit 2501)', date: '2026-08-27', time: '20:00 - 23:00', status: 'PENDING_APPROVAL' },
  ]);

  // Feature 2: Maintenance Tickets
  const [tickets, setTickets] = useState([
    { id: 'TKT-881', unit: 'Unit 704', category: 'Chilled Water AC Issue', priority: 'HIGH', slaRemaining: '2h 15m', status: 'DISPATCHED' },
    { id: 'TKT-882', unit: 'Tower B Lift 3', category: 'Elevator Sensor Calibration', priority: 'CRITICAL', slaRemaining: '45m', status: 'TECH_ON_SITE' },
    { id: 'TKT-883', unit: 'Podium Garden', category: 'Irrigation Sprinkler Leak', priority: 'LOW', slaRemaining: '18h', status: 'SCHEDULED' },
  ]);

  // Feature 4: Community Notices
  const [notices, setNotices] = useState([
    { id: 1, title: 'Annual Water Tank Sanitization & Disinfection', date: '2026-08-28', impact: 'Low Water Pressure between 01:00 - 05:00', author: 'White Caves FM' },
    { id: 2, title: 'Dubai Fire & Civil Defence Annual Evacuation Drill', date: '2026-09-02', impact: 'Building Alarms Active at 10:30 AM', author: 'Security Command' },
  ]);

  return (
    <div className="crm-container" style={{ maxWidth: '100%', padding: '0.5rem' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #4C1D95 0%, #2E1065 100%)', color: '#FFFFFF', padding: '1.25rem 1.5rem', borderRadius: '16px', marginBottom: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
            🏘️
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 800 }}>Juno AI — Community Operations & Facilities</h2>
              <span style={{ fontSize: '0.7rem', background: 'rgba(255, 255, 255, 0.15)', padding: '2px 8px', borderRadius: '4px', color: '#DDD6FE', fontWeight: 800 }}>
                Residents Experience Hub
              </span>
            </div>
            <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.82rem', color: '#EDE9FE' }}>
              Amenity reservations, rapid maintenance ticket SLA dispatch, tenant request logs & community broadcast bulletins.
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', background: '#FFFFFF', padding: '8px 12px', borderRadius: '12px', border: '1px solid #E2E8F0', marginBottom: '1.25rem' }}>
        <button onClick={() => setActiveTab('booking')} style={{ padding: '6px 12px', borderRadius: '6px', border: activeTab === 'booking' ? '1px solid #7C3AED' : '1px solid transparent', background: activeTab === 'booking' ? '#7C3AED' : '#F8FAFC', color: activeTab === 'booking' ? '#FFF' : '#334155', fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer' }}>
          3.24.1 Facility Booking Desk
        </button>
        <button onClick={() => setActiveTab('maintenance')} style={{ padding: '6px 12px', borderRadius: '6px', border: activeTab === 'maintenance' ? '1px solid #7C3AED' : '1px solid transparent', background: activeTab === 'maintenance' ? '#7C3AED' : '#F8FAFC', color: activeTab === 'maintenance' ? '#FFF' : '#334155', fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer' }}>
          3.24.2 Maintenance Ticket SLA
        </button>
        <button onClick={() => setActiveTab('service')} style={{ padding: '6px 12px', borderRadius: '6px', border: activeTab === 'service' ? '1px solid #7C3AED' : '1px solid transparent', background: activeTab === 'service' ? '#7C3AED' : '#F8FAFC', color: activeTab === 'service' ? '#FFF' : '#334155', fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer' }}>
          3.24.3 Tenant Service Tracker
        </button>
        <button onClick={() => setActiveTab('notices')} style={{ padding: '6px 12px', borderRadius: '6px', border: activeTab === 'notices' ? '1px solid #7C3AED' : '1px solid transparent', background: activeTab === 'notices' ? '#7C3AED' : '#F8FAFC', color: activeTab === 'notices' ? '#FFF' : '#334155', fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer' }}>
          3.24.4 Community Notice Board
        </button>
      </div>

      {/* Tab 1: Bookings */}
      {activeTab === 'booking' && (
        <div style={{ background: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#475569', fontWeight: 800 }}>
                <th style={{ padding: '10px 14px' }}>Booking ID</th>
                <th style={{ padding: '10px 14px' }}>Amenity Facility</th>
                <th style={{ padding: '10px 14px' }}>Tenant Name & Unit</th>
                <th style={{ padding: '10px 14px' }}>Date</th>
                <th style={{ padding: '10px 14px' }}>Slot</th>
                <th style={{ padding: '10px 14px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map(b => (
                <tr key={b.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '10px 14px', fontWeight: 800, color: '#7C3AED' }}>{b.id}</td>
                  <td style={{ padding: '10px 14px', fontWeight: 700, color: '#1E293B' }}>{b.amenity}</td>
                  <td style={{ padding: '10px 14px', color: '#475569' }}>{b.tenant}</td>
                  <td style={{ padding: '10px 14px', color: '#64748B' }}>{b.date}</td>
                  <td style={{ padding: '10px 14px', fontWeight: 700, color: '#1E293B' }}>{b.time}</td>
                  <td style={{ padding: '10px 14px' }}>
                    <span style={{ padding: '2px 8px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 800, background: b.status === 'CONFIRMED' ? '#ECFDF5' : '#FEF3C7', color: b.status === 'CONFIRMED' ? '#047857' : '#B45309' }}>
                      {b.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 2: Maintenance SLA */}
      {activeTab === 'maintenance' && (
        <div style={{ background: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#475569', fontWeight: 800 }}>
                <th style={{ padding: '10px 14px' }}>Ticket #</th>
                <th style={{ padding: '10px 14px' }}>Location</th>
                <th style={{ padding: '10px 14px' }}>Category Issue</th>
                <th style={{ padding: '10px 14px' }}>SLA Timer</th>
                <th style={{ padding: '10px 14px' }}>Priority</th>
                <th style={{ padding: '10px 14px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map(t => (
                <tr key={t.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '10px 14px', fontWeight: 800, color: '#7C3AED' }}>{t.id}</td>
                  <td style={{ padding: '10px 14px', fontWeight: 700, color: '#1E293B' }}>{t.unit}</td>
                  <td style={{ padding: '10px 14px', color: '#475569' }}>{t.category}</td>
                  <td style={{ padding: '10px 14px', fontWeight: 800, color: '#DC2626' }}>{t.slaRemaining}</td>
                  <td style={{ padding: '10px 14px' }}>
                    <span style={{ padding: '2px 8px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 800, background: t.priority === 'CRITICAL' ? '#FEF2F2' : '#FEF3C7', color: t.priority === 'CRITICAL' ? '#DC2626' : '#B45309' }}>
                      {t.priority}
                    </span>
                  </td>
                  <td style={{ padding: '10px 14px', fontSize: '0.75rem', fontWeight: 700, color: '#1E293B' }}>
                    {t.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 4: Notice Board */}
      {activeTab === 'notices' && (
        <div style={{ background: '#FFFFFF', padding: '1.5rem', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
          <h4 style={{ margin: '0 0 1rem 0', fontSize: '1rem', fontWeight: 800, color: '#1E293B' }}>
            Official Community Bulletins & Resident Notices
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {notices.map(n => (
              <div key={n.id} style={{ padding: '1.25rem', background: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 800, color: '#1E293B', fontSize: '0.95rem' }}>{n.title}</span>
                  <span style={{ fontSize: '0.75rem', color: '#64748B' }}>{n.date}</span>
                </div>
                <div style={{ fontSize: '0.82rem', color: '#475569', marginTop: '6px' }}>Impact: {n.impact}</div>
                <div style={{ fontSize: '0.72rem', color: '#7C3AED', fontWeight: 800, marginTop: '4px' }}>Issued by {n.author}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Service */}
      {activeTab === 'service' && (
        <div style={{ background: '#FFFFFF', padding: '1.5rem', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
          <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem', fontWeight: 800, color: '#1E293B' }}>
            Tenant Concierge & Service Desk Inquiries
          </h4>
          <p style={{ fontSize: '0.85rem', color: '#64748B' }}>
            All tenant tickets are routed with automated Nadia WhatsApp notification updates.
          </p>
        </div>
      )}
    </div>
  );
};

export default JunoCommunity;
