import React from 'react';
import { Instagram, Facebook, Linkedin, Youtube, Users, Heart, MessageCircle } from 'lucide-react';

export default function SocialTab({ state }) {
  const { socialStats, socialMetrics } = state;

  const getPlatformIcon = (platform) => {
    switch (platform.toLowerCase()) {
      case 'instagram': return <Instagram size={20} />;
      case 'facebook': return <Facebook size={20} />;
      case 'linkedin': return <Linkedin size={20} />;
      case 'youtube': return <Youtube size={20} />;
      default: return <Users size={20} />;
    }
  };

  return (
    <div className="social-view">
      <div className="view-header">
        <h3>Social Media Analytics</h3>
        <p className="view-subtitle">Track performance across all social platforms</p>
      </div>

      <div className="social-overview">
        <div className="overview-card">
          <Users size={20} />
          <div>
            <span className="metric-value">{(socialMetrics.totalFollowers / 1000).toFixed(0)}K</span>
            <span className="metric-label">Total Followers</span>
          </div>
        </div>
        <div className="overview-card">
          <MessageCircle size={20} />
          <div>
            <span className="metric-value">{socialMetrics.avgEngagement}%</span>
            <span className="metric-label">Avg Engagement</span>
          </div>
        </div>
        <div className="overview-card">
          <Heart size={20} />
          <div>
            <span className="metric-value">{socialMetrics.totalPosts}</span>
            <span className="metric-label">Total Posts</span>
          </div>
        </div>
      </div>

      <div className="social-platforms">
        <h4>Platform Performance</h4>
        {socialStats.map((platform, idx) => (
          <div key={idx} className="platform-card">
            <div className="platform-header">
              {getPlatformIcon(platform.platform)}
              <div className="platform-info">
                <h5>{platform.platform}</h5>
                <p>{platform.followers.toLocaleString()} followers</p>
              </div>
            </div>
            <div className="platform-metrics">
              <div className="metric">
                <span className="label">Growth</span>
                <span className="value" style={{ color: '#10b981' }}>+{platform.growth}%</span>
              </div>
              <div className="metric">
                <span className="label">Engagement</span>
                <span className="value">{platform.engagement}%</span>
              </div>
              <div className="metric">
                <span className="label">Posts</span>
                <span className="value">{platform.posts}</span>
              </div>
            </div>
            <button className="btn btn-secondary">View Details</button>
          </div>
        ))}
      </div>
    </div>
  );
}
