import React, { useState } from 'react';
import { 
  Building, Wifi, Calendar, Zap, Users,
  Thermometer, Droplets, Shield, Bell, Clock,
  ArrowUp, ArrowDown, Filter, Search, Plus, Settings
} from 'lucide-react';
import AssistantDocsTab from './shared/AssistantDocsTab';
import './AssistantDashboard.css';

const FACILITIES = [
  { id: 1, name: 'Swimming Pool', status: 'open', capacity: '50/100', schedule: '6AM - 10PM', maintenance: 'Good' },
  { id: 2, name: 'Gym & Fitness Center', status: 'open', capacity: '28/60', schedule: '5AM - 11PM', maintenance: 'Good' },
  { id: 3, name: 'Tennis Court', status: 'booked', capacity: '2/4', schedule: '6AM - 9PM', maintenance: 'Good' },
  { id: 4, name: 'Kids Play Area', status: 'open', capacity: '12/30', schedule: '8AM - 8PM', maintenance: 'Needs Attention' },
  { id: 5, name: 'BBQ Area', status: 'maintenance', capacity: '0/20', schedule: 'Closed', maintenance: 'Under Repair' }
];

const IOT_DEVICES = [
  { id: 1, zone: 'Lobby', devices: 12, status: 'online', temp: 22, humidity: 45, energy: 'optimal' },
  { id: 2, zone: 'Parking Level 1', devices: 8, status: 'online', temp: 26, humidity: 38, energy: 'high' },
  { id: 3, zone: 'Pool Area', devices: 6, status: 'online', temp: 28, humidity: 65, energy: 'optimal' },
  { id: 4, zone: 'Gym', devices: 10, status: 'partial', temp: 21, humidity: 42, energy: 'optimal' },
  { id: 5, zone: 'Garden', devices: 4, status: 'offline', temp: null, humidity: null, energy: 'N/A' }
];

const COMMUNITY_EVENTS = [
  { id: 1, name: 'Pool Party', date: '2024-01-27', time: '4:00 PM', location: 'Main Pool', attendees: 45, status: 'upcoming' },
  { id: 2, name: 'Yoga Session', date: '2024-01-23', time: '7:00 AM', location: 'Garden', attendees: 18, status: 'scheduled' },
  { id: 3, name: 'Movie Night', date: '2024-01-28', time: '8:00 PM', location: 'Clubhouse', attendees: 32, status: 'upcoming' },
  { id: 4, name: 'Residents Meeting', date: '2024-02-01', time: '6:00 PM', location: 'Conference Room', attendees: 0, status: 'draft' }
];

const ENERGY_DATA = [
  { id: 1, zone: 'Common Areas', usage: '12,500 kWh', change: -8, status: 'optimized' },
  { id: 2, zone: 'Parking', usage: '3,200 kWh', change: -12, status: 'optimized' },
  { id: 3, zone: 'Pool & Gym', usage: '8,400 kWh', change: 5, status: 'needs_review' },
  { id: 4, zone: 'Landscaping', usage: '2,100 kWh', change: -15, status: 'optimized' }
];

const JunoCommunity = () => {
  const [activeTab, setActiveTab] = useState('facilities');

  const getStatusColor = (status) => {
    switch (status) {
      case 'open': case 'online': case 'optimized': return '#10B981';
      case 'booked': case 'partial': case 'scheduled': return '#3B82F6';
      case 'maintenance': case 'offline': case 'needs_review': return '#F59E0B';
      case 'upcoming': return '#8B5CF6';
      default: return '#6B7280';
    }
  };

  return (
    <div className="assistant-dashboard juno">
      <div className="assistant-header">
        <div className="assistant-avatar" style={{ background: 'linear-gradient(135deg, #14B8A6 0%, #0D9488 100%)' }}>
          <Building size={28} />
        </div>
        <div className="assistant-info">
          <h2>Juno - Smart Community & Facilities Manager</h2>
          <p>Integrates with building IoT systems for energy optimization, manages community events, and automates facility service requests</p>
        </div>
        <div className="assistant-status online">
          <span className="status-dot"></span>
          Active
        </div>
      </div>

      <div className="quick-stats">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(20, 184, 166, 0.2)', color: '#14B8A6' }}>
            <Building size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-value">5</span>
            <span className="stat-label">Facilities</span>
          </div>
          <span className="stat-change positive">4 open</span>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(139, 92, 246, 0.2)', color: '#8B5CF6' }}>
            <Wifi size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-value">40</span>
            <span className="stat-label">IoT Devices</span>
          </div>
          <span className="stat-change warning">36 online</span>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#10B981' }}>
            <Zap size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-value">-9%</span>
            <span className="stat-label">Energy Savings</span>
          </div>
          <span className="stat-change positive">This month</span>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.2)', color: '#F59E0B' }}>
            <Calendar size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-value">4</span>
            <span className="stat-label">Upcoming Events</span>
          </div>
          <span className="stat-change">This week</span>
        </div>
      </div>

      <div className="assistant-tabs">
        {['facilities', 'iot', 'events', 'energy', 'docs'].map(tab => (
          <button
            key={tab}
            className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'docs' ? 'Documentation' : tab === 'iot' ? 'IoT' : tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div className="tab-content">
        {activeTab === 'facilities' && (
          <div className="facilities-view">
            <div className="view-header">
              <h3>Facility Status</h3>
              <button className="add-btn"><Settings size={16} /> Manage</button>
            </div>
            <div className="facilities-grid">
              {FACILITIES.map(facility => (
                <div key={facility.id} className="facility-card">
                  <div className="facility-header">
                    <h4>{facility.name}</h4>
                    <span className="facility-status" style={{ 
                      background: `${getStatusColor(facility.status)}20`,
                      color: getStatusColor(facility.status)
                    }}>
                      {facility.status}
                    </span>
                  </div>
                  <div className="facility-details">
                    <span><Users size={14} /> {facility.capacity}</span>
                    <span><Clock size={14} /> {facility.schedule}</span>
                  </div>
                  <div className={`facility-maintenance ${facility.maintenance === 'Good' ? 'good' : 'attention'}`}>
                    {facility.maintenance}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'iot' && (
          <div className="iot-view">
            <h3>IoT Dashboard</h3>
            <div className="iot-grid">
              {IOT_DEVICES.map(zone => (
                <div key={zone.id} className="iot-card">
                  <div className="iot-header">
                    <h4>{zone.zone}</h4>
                    <span className="iot-status" style={{ color: getStatusColor(zone.status) }}>
                      ● {zone.status}
                    </span>
                  </div>
                  <div className="iot-stats">
                    <span><Wifi size={14} /> {zone.devices} devices</span>
                    {zone.temp && (
                      <>
                        <span><Thermometer size={14} /> {zone.temp}°C</span>
                        <span><Droplets size={14} /> {zone.humidity}%</span>
                      </>
                    )}
                  </div>
                  <div className={`iot-energy ${zone.energy}`}>
                    Energy: {zone.energy}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'events' && (
          <div className="events-view">
            <div className="view-header">
              <h3>Community Events</h3>
              <button className="add-btn"><Plus size={16} /> Create Event</button>
            </div>
            <div className="events-list">
              {COMMUNITY_EVENTS.map(event => (
                <div key={event.id} className="event-card">
                  <div className="event-date">
                    <span className="day">{event.date.split('-')[2]}</span>
                    <span className="month">Jan</span>
                  </div>
                  <div className="event-content">
                    <h4>{event.name}</h4>
                    <div className="event-details">
                      <span><Clock size={12} /> {event.time}</span>
                      <span><Building size={12} /> {event.location}</span>
                      <span><Users size={12} /> {event.attendees} attending</span>
                    </div>
                  </div>
                  <span className="event-status" style={{ color: getStatusColor(event.status) }}>
                    {event.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'energy' && (
          <div className="energy-view">
            <h3>Energy Optimization</h3>
            <div className="energy-grid">
              {ENERGY_DATA.map(zone => (
                <div key={zone.id} className="energy-card">
                  <div className="energy-header">
                    <h4>{zone.zone}</h4>
                    <span className={`energy-status ${zone.status}`}>{zone.status.replace('_', ' ')}</span>
                  </div>
                  <div className="energy-usage">{zone.usage}</div>
                  <div className="energy-change" style={{ color: zone.change < 0 ? '#10B981' : '#EF4444' }}>
                    {zone.change < 0 ? <ArrowDown size={14} /> : <ArrowUp size={14} />}
                    {Math.abs(zone.change)}% vs last month
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'docs' && (
          <AssistantDocsTab 
            assistantId="juno" 
            assistantName="Juno" 
            assistantColor="#14B8A6" 
          />
        )}
      </div>
    </div>
  );
};

export default JunoCommunity;
