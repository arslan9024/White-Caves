import React from 'react';
import { Users, Heart, MessageCircle, Calendar, Star, Award } from 'lucide-react';
import './shared/CRMDashboard.css';

const JunoCommunityCRM = ({ assistant }) => {
  const stats = [
    { label: 'Active Members', value: '2,847', icon: Users, trend: '+156 this month' },
    { label: 'Engagement Rate', value: '68%', icon: Heart, trend: '+5% vs last month' },
    { label: 'Upcoming Events', value: '8', icon: Calendar, trend: '3 this week' },
    { label: 'Satisfaction Score', value: '4.7', icon: Star, trend: '/5.0' }
  ];

  return (
    <div className="crm-dashboard juno-community">
      <div className="crm-header">
        <div className="crm-title-section">
          <div className="crm-icon" style={{ background: `${assistant?.color || '#EC4899'}20` }}>
            <Users size={28} style={{ color: assistant?.color || '#EC4899' }} />
          </div>
          <div className="crm-title-info">
            <h1>{assistant?.name || 'Juno'}</h1>
            <p>{assistant?.title || 'Community & Tenant Relations'}</p>
          </div>
        </div>
      </div>

      <div className="crm-stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className="stat-icon">
              <stat.icon size={24} />
            </div>
            <div className="stat-info">
              <span className="stat-value">{stat.value}</span>
              <span className="stat-label">{stat.label}</span>
              <span className="stat-trend">{stat.trend}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="crm-content-grid">
        <div className="crm-panel">
          <div className="panel-header">
            <h3>Recent Feedback</h3>
            <MessageCircle size={18} />
          </div>
          <div className="panel-content">
            {[
              { tenant: 'Ahmed Al Maktoum', property: 'Marina Tower', rating: 5, feedback: 'Excellent service!' },
              { tenant: 'Sarah Williams', property: 'Palm Villa', rating: 4, feedback: 'Quick maintenance response' },
              { tenant: 'Mohammed Khan', property: 'Downtown Apt', rating: 5, feedback: 'Love the community events' },
              { tenant: 'Jennifer Lee', property: 'JBR Suite', rating: 4, feedback: 'Great amenities' }
            ].map((item, index) => (
              <div key={index} className="list-item">
                <div className="item-info">
                  <span className="item-name">{item.tenant}</span>
                  <span className="item-meta">{item.property} • "{item.feedback}"</span>
                </div>
                <span className="rating-badge">
                  <Star size={12} fill="currentColor" /> {item.rating}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="crm-panel">
          <div className="panel-header">
            <h3>Upcoming Community Events</h3>
            <Calendar size={18} />
          </div>
          <div className="panel-content">
            {[
              { event: 'Residents BBQ Night', date: 'Jan 12, 6:00 PM', location: 'Pool Area', rsvps: 45 },
              { event: 'Yoga in the Park', date: 'Jan 14, 7:00 AM', location: 'Community Garden', rsvps: 28 },
              { event: 'Movie Night', date: 'Jan 16, 8:00 PM', location: 'Rooftop Lounge', rsvps: 32 },
              { event: 'Kids Art Workshop', date: 'Jan 18, 3:00 PM', location: 'Activity Room', rsvps: 18 }
            ].map((item, index) => (
              <div key={index} className="list-item">
                <div className="item-info">
                  <span className="item-name">{item.event}</span>
                  <span className="item-meta">{item.date} • {item.location}</span>
                </div>
                <span className="rsvp-badge">{item.rsvps} RSVPs</span>
              </div>
            ))}
          </div>
        </div>

        <div className="crm-panel full-width">
          <div className="panel-header">
            <h3>Top Community Contributors</h3>
            <Award size={18} />
          </div>
          <div className="panel-content categories">
            {[
              { name: 'Ahmed Al Rashid', points: 1250, badge: 'Community Star' },
              { name: 'Sarah Martinez', points: 980, badge: 'Event Champion' },
              { name: 'Michael Chen', points: 845, badge: 'Helpful Neighbor' },
              { name: 'Emma Wilson', points: 720, badge: 'Social Butterfly' },
              { name: 'John Davidson', points: 650, badge: 'Welcome Host' },
              { name: 'Lisa Thompson', points: 580, badge: 'Feedback Pro' }
            ].map((member, index) => (
              <div key={index} className="category-card">
                <span className="category-name">{member.name}</span>
                <span className="category-count">{member.points} pts • {member.badge}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JunoCommunityCRM;
