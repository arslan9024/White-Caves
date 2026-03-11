import React, { FC, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import './WhatsAppAnalyticsPage.css';

interface AnalyticsData {
  totalMessages: number;
  sentMessages: number;
  receivedMessages: number;
  averageResponseTime: string;
  topKeywords: string[];
}

interface WhatsAppAnalyticsPageProps {}

const OWNER_EMAIL = 'arslanmalikgoraha@gmail.com';

const WhatsAppAnalyticsPage: FC<WhatsAppAnalyticsPageProps> = () => {
  const navigate = useNavigate();
  const user = useSelector((state: any) => state.user.currentUser);
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalMessages: 0,
    sentMessages: 0,
    receivedMessages: 0,
    averageResponseTime: '0s',
    topKeywords: []
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [dateRange, setDateRange] = useState<string>('7d');

  useEffect(() => {
    if (!user || user.email !== OWNER_EMAIL) {
      navigate('/');
    }
  }, [user, navigate]);

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange]);

  const fetchAnalytics = async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await fetch(`/api/whatsapp/analytics?range=${dateRange}`);
      if (response.ok) {
        const data = await response.json();
        setAnalytics(data);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="whatsapp-analytics-page no-sidebar">
      <div className="analytics-container full-width">
        <header className="analytics-header">
          <h1>WhatsApp Analytics</h1>
          <p>Insights into your WhatsApp communications</p>
        </header>

        <div className="analytics-controls">
          <label>Date Range:</label>
          <select value={dateRange} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setDateRange(e.target.value)}>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
            <option value="1y">Last Year</option>
          </select>
        </div>

        {loading ? (
          <p>Loading analytics...</p>
        ) : (
          <>
            <div className="analytics-stats-grid">
              <div className="analytics-stat-card">
                <span className="stat-icon">📊</span>
                <h3>Total Messages</h3>
                <p className="stat-value">{analytics.totalMessages}</p>
              </div>
              <div className="analytics-stat-card">
                <span className="stat-icon">📤</span>
                <h3>Sent</h3>
                <p className="stat-value">{analytics.sentMessages}</p>
              </div>
              <div className="analytics-stat-card">
                <span className="stat-icon">📥</span>
                <h3>Received</h3>
                <p className="stat-value">{analytics.receivedMessages}</p>
              </div>
              <div className="analytics-stat-card">
                <span className="stat-icon">⚡</span>
                <h3>Avg Response Time</h3>
                <p className="stat-value">{analytics.averageResponseTime}</p>
              </div>
            </div>

            <div className="analytics-section">
              <h3>Top Keywords</h3>
              <div className="keywords-list">
                {analytics.topKeywords.length > 0 ? (
                  analytics.topKeywords.map((keyword, index) => (
                    <span key={index} className="keyword-tag">
                      {keyword}
                    </span>
                  ))
                ) : (
                  <p>No data available</p>
                )}
              </div>
            </div>

            <div className="analytics-charts">
              <div className="chart-placeholder">
                <h3>Message Volume (7 days)</h3>
                <p>Chart visualization goes here</p>
              </div>
              <div className="chart-placeholder">
                <h3>Response Time Distribution</h3>
                <p>Chart visualization goes here</p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default WhatsAppAnalyticsPage;
