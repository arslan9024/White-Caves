import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import RoleNavigation from '../../components/RoleNavigation';
import { TrendingUp, ArrowLeft, MessageCircle, Users, Clock, CheckCheck, ArrowUpRight, ArrowDownRight, Calendar } from 'lucide-react';
import './WhatsAppAnalyticsPage.css';

const OWNER_EMAIL = 'arslanmalikgoraha@gmail.com';

const WhatsAppAnalyticsPage = () => {
  const navigate = useNavigate();
  const user = useSelector(state => state.user.currentUser);
  const [dateRange, setDateRange] = useState('7days');

  const [stats, setStats] = useState({
    totalMessages: { value: 1284, change: 12.5, trend: 'up' },
    uniqueContacts: { value: 156, change: 8.3, trend: 'up' },
    avgResponseTime: { value: '2.5 min', change: -15.2, trend: 'down' },
    readRate: { value: '94%', change: 2.1, trend: 'up' }
  });

  const [messagesByDay, setMessagesByDay] = useState([
    { day: 'Mon', incoming: 45, outgoing: 38 },
    { day: 'Tue', incoming: 52, outgoing: 48 },
    { day: 'Wed', incoming: 38, outgoing: 42 },
    { day: 'Thu', incoming: 65, outgoing: 58 },
    { day: 'Fri', incoming: 48, outgoing: 45 },
    { day: 'Sat', incoming: 72, outgoing: 65 },
    { day: 'Sun', incoming: 35, outgoing: 30 }
  ]);

  const [topContacts, setTopContacts] = useState([
    { name: 'Ahmed Hassan', messages: 45, lastActive: '2 hours ago' },
    { name: 'Sarah Johnson', messages: 38, lastActive: '5 hours ago' },
    { name: 'Mohammed Ali', messages: 32, lastActive: '1 day ago' },
    { name: 'Emily Chen', messages: 28, lastActive: '3 hours ago' },
    { name: 'Khalid Rahman', messages: 24, lastActive: '6 hours ago' }
  ]);

  const [chatbotStats, setChatbotStats] = useState({
    automated: 312,
    manual: 972,
    automationRate: '24%'
  });

  const [peakHours, setPeakHours] = useState([
    { hour: '9 AM', messages: 45 },
    { hour: '10 AM', messages: 62 },
    { hour: '11 AM', messages: 58 },
    { hour: '12 PM', messages: 42 },
    { hour: '1 PM', messages: 35 },
    { hour: '2 PM', messages: 48 },
    { hour: '3 PM', messages: 55 },
    { hour: '4 PM', messages: 68 },
    { hour: '5 PM', messages: 72 },
    { hour: '6 PM', messages: 65 },
    { hour: '7 PM', messages: 58 },
    { hour: '8 PM', messages: 45 }
  ]);

  useEffect(() => {
    if (!user || user.email !== OWNER_EMAIL) {
      navigate('/');
    }
  }, [user, navigate]);

  const maxMessages = Math.max(...messagesByDay.map(d => Math.max(d.incoming, d.outgoing)));
  const maxHourlyMessages = Math.max(...peakHours.map(h => h.messages));

  return (
    <div className="whatsapp-analytics-page">
      <RoleNavigation role="owner" userName={user?.displayName || user?.email} />
      
      <div className="analytics-content">
        <div className="analytics-header">
          <div className="header-left">
            <Link to="/owner/whatsapp" className="back-btn">
              <ArrowLeft size={20} /> Back to Messages
            </Link>
            <h1><TrendingUp size={28} /> WhatsApp Analytics</h1>
            <p>Track your messaging performance and engagement</p>
          </div>
          <div className="date-filter">
            <Calendar size={18} />
            <select value={dateRange} onChange={(e) => setDateRange(e.target.value)}>
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
              <option value="90days">Last 90 Days</option>
              <option value="year">This Year</option>
            </select>
          </div>
        </div>

        <div className="stats-overview">
          <div className="stat-card">
            <div className="stat-icon"><MessageCircle size={24} /></div>
            <div className="stat-details">
              <span className="stat-value">{stats.totalMessages.value}</span>
              <span className="stat-label">Total Messages</span>
              <span className={`stat-change ${stats.totalMessages.trend}`}>
                {stats.totalMessages.trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {Math.abs(stats.totalMessages.change)}%
              </span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon"><Users size={24} /></div>
            <div className="stat-details">
              <span className="stat-value">{stats.uniqueContacts.value}</span>
              <span className="stat-label">Unique Contacts</span>
              <span className={`stat-change ${stats.uniqueContacts.trend}`}>
                {stats.uniqueContacts.trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {Math.abs(stats.uniqueContacts.change)}%
              </span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon"><Clock size={24} /></div>
            <div className="stat-details">
              <span className="stat-value">{stats.avgResponseTime.value}</span>
              <span className="stat-label">Avg Response Time</span>
              <span className={`stat-change down`}>
                <ArrowDownRight size={14} />
                {Math.abs(stats.avgResponseTime.change)}%
              </span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon"><CheckCheck size={24} /></div>
            <div className="stat-details">
              <span className="stat-value">{stats.readRate.value}</span>
              <span className="stat-label">Read Rate</span>
              <span className={`stat-change ${stats.readRate.trend}`}>
                {stats.readRate.trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {Math.abs(stats.readRate.change)}%
              </span>
            </div>
          </div>
        </div>

        <div className="charts-grid">
          <div className="chart-card">
            <h3>Messages by Day</h3>
            <div className="bar-chart">
              {messagesByDay.map((day, index) => (
                <div key={index} className="bar-group">
                  <div className="bars">
                    <div 
                      className="bar incoming" 
                      style={{ height: `${(day.incoming / maxMessages) * 100}%` }}
                      title={`Incoming: ${day.incoming}`}
                    ></div>
                    <div 
                      className="bar outgoing" 
                      style={{ height: `${(day.outgoing / maxMessages) * 100}%` }}
                      title={`Outgoing: ${day.outgoing}`}
                    ></div>
                  </div>
                  <span className="bar-label">{day.day}</span>
                </div>
              ))}
            </div>
            <div className="chart-legend">
              <span className="legend-item"><span className="dot incoming"></span> Incoming</span>
              <span className="legend-item"><span className="dot outgoing"></span> Outgoing</span>
            </div>
          </div>

          <div className="chart-card">
            <h3>Peak Activity Hours</h3>
            <div className="horizontal-bar-chart">
              {peakHours.map((hour, index) => (
                <div key={index} className="h-bar-row">
                  <span className="h-bar-label">{hour.hour}</span>
                  <div className="h-bar-container">
                    <div 
                      className="h-bar" 
                      style={{ width: `${(hour.messages / maxHourlyMessages) * 100}%` }}
                    ></div>
                  </div>
                  <span className="h-bar-value">{hour.messages}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bottom-grid">
          <div className="card top-contacts">
            <h3>Top Contacts</h3>
            <div className="contacts-list">
              {topContacts.map((contact, index) => (
                <div key={index} className="contact-row">
                  <div className="contact-rank">{index + 1}</div>
                  <div className="contact-avatar">{contact.name.charAt(0)}</div>
                  <div className="contact-info">
                    <span className="contact-name">{contact.name}</span>
                    <span className="contact-active">{contact.lastActive}</span>
                  </div>
                  <div className="contact-messages">{contact.messages} msgs</div>
                </div>
              ))}
            </div>
          </div>

          <div className="card chatbot-performance">
            <h3>Chatbot Performance</h3>
            <div className="donut-chart-container">
              <div className="donut-chart">
                <svg viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#E8F5E9" strokeWidth="15" />
                  <circle 
                    cx="50" 
                    cy="50" 
                    r="40" 
                    fill="none" 
                    stroke="#25D366" 
                    strokeWidth="15"
                    strokeDasharray={`${(chatbotStats.automated / (chatbotStats.automated + chatbotStats.manual)) * 251.2} 251.2`}
                    strokeLinecap="round"
                    transform="rotate(-90 50 50)"
                  />
                </svg>
                <div className="donut-center">
                  <span className="donut-value">{chatbotStats.automationRate}</span>
                  <span className="donut-label">Automated</span>
                </div>
              </div>
            </div>
            <div className="chatbot-stats">
              <div className="cb-stat">
                <span className="cb-value">{chatbotStats.automated}</span>
                <span className="cb-label">Automated Replies</span>
              </div>
              <div className="cb-stat">
                <span className="cb-value">{chatbotStats.manual}</span>
                <span className="cb-label">Manual Replies</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhatsAppAnalyticsPage;
