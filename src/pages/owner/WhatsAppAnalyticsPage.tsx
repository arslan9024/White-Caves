import React, { FC, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createLogger } from '../../utils/logger';
import { authFetch } from '../../utils/authFetch';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store/store';
import { isAdminOrAbove } from '../../utils/roleHelpers';
import './WhatsAppAnalyticsPage.css';

const log = createLogger('WhatsAppAnalytics');

interface AnalyticsData {
  totalMessages: number;
  sentMessages: number;
  receivedMessages: number;
  averageResponseTime: string;
  topKeywords: string[];
}

const WhatsAppAnalyticsPage: FC = () => {
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.user.currentUser);
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
    if (!user || !isAdminOrAbove(user.role)) {
      navigate('/');
    }
  }, [user, navigate]);

  useEffect(() => {
    const controller = new AbortController();
    fetchAnalytics(controller.signal);
    return () => controller.abort();
  }, [dateRange]);

  const fetchAnalytics = async (signal?: AbortSignal): Promise<void> => {
    try {
      setLoading(true);
      const response = await authFetch(
        `/api/whatsapp/analytics?range=${encodeURIComponent(dateRange)}`,
        { signal }
      );
      if (response.ok) {
        const data = await response.json();
        setAnalytics(data);
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return;
      log.error('Error fetching analytics:', error);
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
          <label htmlFor="wa-analytics-date-range">Date Range:</label>
          <select id="wa-analytics-date-range" value={dateRange} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setDateRange(e.target.value)}>
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
                  analytics.topKeywords.map((keyword) => (
                    <span key={keyword} className="keyword-tag">
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
