import React from 'react';
import { Megaphone, Rocket, Globe, Mail, MessageCircle, CalendarDays } from 'lucide-react';

const CAMPAIGNS = [
  { id: 1, name: 'Palm Jumeirah Launch', status: 'active', reach: '45K', leads: 120, budget: 'AED 25K' },
  { id: 2, name: 'Q1 Luxury Properties', status: 'active', reach: '32K', leads: 85, budget: 'AED 18K' },
  { id: 3, name: 'Downtown Living', status: 'scheduled', reach: '0', leads: 0, budget: 'AED 30K' },
];

const SOCIAL_CHANNELS = [
  { id: 'instagram', name: 'Instagram', followers: '125K', engagement: '4.2%' },
  { id: 'facebook', name: 'Facebook', followers: '89K', engagement: '2.8%' },
  { id: 'linkedin', name: 'LinkedIn', followers: '45K', engagement: '3.5%' },
  { id: 'youtube', name: 'YouTube', subscribers: '28K', views: '2.1M' },
];

export default function MarketingView({ activeSubItem, subItemConfig, assistantContext }) {
  const renderCampaigns = () => (
    <div className="campaigns-view">
      <h2 className="view-title">Marketing Campaigns</h2>
      <p className="view-subtitle">Active and scheduled campaigns</p>
      
      <div className="campaigns-grid">
        {CAMPAIGNS.map(campaign => (
          <div key={campaign.id} className="campaign-card">
            <div className="campaign-header">
              <Megaphone size={20} color="var(--crm-gold)" />
              <span className={`campaign-status ${campaign.status}`}>{campaign.status}</span>
            </div>
            <h4>{campaign.name}</h4>
            <div className="campaign-stats">
              <div className="campaign-stat">
                <span className="stat-value">{campaign.reach}</span>
                <span className="stat-label">Reach</span>
              </div>
              <div className="campaign-stat">
                <span className="stat-value">{campaign.leads}</span>
                <span className="stat-label">Leads</span>
              </div>
              <div className="campaign-stat">
                <span className="stat-value">{campaign.budget}</span>
                <span className="stat-label">Budget</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderLaunchEvents = () => (
    <div className="launch-events-view">
      <h2 className="view-title">Launch Events</h2>
      <p className="view-subtitle">Property launch and promotional events</p>
      <div className="events-placeholder">
        <Rocket size={48} color="var(--crm-gold)" />
        <p>3 upcoming launch events</p>
        <button className="crm-btn crm-btn-primary">View Calendar</button>
      </div>
    </div>
  );

  const renderContentHub = () => (
    <div className="content-hub-view">
      <h2 className="view-title">Content Hub</h2>
      <p className="view-subtitle">Marketing materials and assets</p>
      <div className="content-stats">
        <div className="content-stat">
          <div className="content-value">245</div>
          <div className="content-label">Images</div>
        </div>
        <div className="content-stat">
          <div className="content-value">45</div>
          <div className="content-label">Videos</div>
        </div>
        <div className="content-stat">
          <div className="content-value">32</div>
          <div className="content-label">Brochures</div>
        </div>
      </div>
    </div>
  );

  const renderSocialIntegration = () => (
    <div className="social-view">
      <h2 className="view-title">Social Media</h2>
      <p className="view-subtitle">Social channel integration and analytics</p>
      <div className="social-channels">
        {SOCIAL_CHANNELS.map(channel => (
          <div key={channel.id} className="social-card">
            <Globe size={24} color="var(--crm-gold)" />
            <h4>{channel.name}</h4>
            <div className="social-stats">
              <span>{channel.followers || channel.subscribers}</span>
              <span>{channel.engagement || channel.views}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderWhatsAppCenter = () => (
    <div className="whatsapp-view">
      <h2 className="view-title">WhatsApp Center</h2>
      <p className="view-subtitle">WhatsApp Business integration</p>
      <div className="whatsapp-stats">
        <div className="wa-stat">
          <MessageCircle size={32} color="#25D366" />
          <div className="wa-value">1,245</div>
          <div className="wa-label">Active Chats</div>
        </div>
        <div className="wa-stat">
          <MessageCircle size={32} color="#25D366" />
          <div className="wa-value">89%</div>
          <div className="wa-label">Response Rate</div>
        </div>
      </div>
      <div className="whatsapp-actions">
        <button className="crm-btn crm-btn-primary">Open WhatsApp Dashboard</button>
        <button className="crm-btn crm-btn-secondary">View Templates</button>
      </div>
    </div>
  );

  const renderEmailCampaigns = () => (
    <div className="email-view">
      <h2 className="view-title">Email Campaigns</h2>
      <p className="view-subtitle">Email marketing management</p>
      <div className="email-stats">
        <div className="email-stat">
          <Mail size={32} color="var(--crm-gold)" />
          <div className="email-value">12,500</div>
          <div className="email-label">Subscribers</div>
        </div>
        <div className="email-stat">
          <Mail size={32} color="var(--crm-gold)" />
          <div className="email-value">42%</div>
          <div className="email-label">Open Rate</div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSubItem) {
      case 'campaigns':
        return renderCampaigns();
      case 'whatsapp-center':
        return renderWhatsAppCenter();
      case 'content-calendar':
        return renderLaunchEvents();
      case 'website-assets':
        return renderContentHub();
      case 'email-templates':
        return renderEmailCampaigns();
      default:
        return renderCampaigns();
    }
  };

  return (
    <div className="view-container marketing-view">
      {renderContent()}
    </div>
  );
}
