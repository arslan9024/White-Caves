import React from 'react';
import { DollarSign, Users, Eye, TrendingUp, Edit, Trash2 } from 'lucide-react';

interface Campaign {
  id: string | number;
  name: string;
  platform: string;
  status: string;
  budget: number;
  spent: number;
  reach: number;
  cpl: number;
}

interface CampaignStats {
  total: number;
  active: number;
  totalBudget: number;
  totalLeads: number;
}

interface StatusBadgeStyle {
  bg: string;
  color: string;
}

interface CampaignsState {
  filteredCampaigns: Campaign[];
  campaignStats: CampaignStats;
  getCampaignStatusBadge: (status: string) => StatusBadgeStyle;
  deleteCampaign: (id: string | number) => void;
}

interface CampaignsTabProps {
  state: CampaignsState;
}

export default function CampaignsTab({ state }: CampaignsTabProps) {
  const { filteredCampaigns, campaignStats, getCampaignStatusBadge, deleteCampaign } = state;

  return (
    <div className="campaigns-view">
      <div className="view-header">
        <h3>Ad Campaign Management</h3>
        <button className="action-btn primary">+ New Campaign</button>
      </div>

      <div className="campaign-stats">
        <div className="stat-card">
          <span className="stat-value">{campaignStats.total}</span>
          <span className="stat-label">Total Campaigns</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{campaignStats.active}</span>
          <span className="stat-label">Active</span>
        </div>
        <div className="stat-card">
          <DollarSign size={20} />
          <div className="stat-info">
            <span className="stat-value">{(campaignStats.totalBudget / 1000).toFixed(0)}K</span>
            <span className="stat-label">Total Budget</span>
          </div>
        </div>
        <div className="stat-card">
          <Users size={20} />
          <div className="stat-info">
            <span className="stat-value">{campaignStats.totalLeads}</span>
            <span className="stat-label">Total Leads</span>
          </div>
        </div>
      </div>

      <div className="campaigns-table">
        <table>
          <thead>
            <tr>
              <th>Campaign</th>
              <th>Platform</th>
              <th>Status</th>
              <th>Budget / Spent</th>
              <th>Reach</th>
              <th>CPL</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCampaigns.map((campaign: Campaign) => {
              const statusStyle = getCampaignStatusBadge(campaign.status);
              const spent = campaign.budget > 0 ? (campaign.spent / campaign.budget * 100).toFixed(0) : '0';
              return (
                <tr key={campaign.id}>
                  <td><strong>{campaign.name}</strong></td>
                  <td>{campaign.platform}</td>
                  <td>
                    <span style={{ backgroundColor: statusStyle.bg, color: statusStyle.color }} className="status-badge">
                      {campaign.status}
                    </span>
                  </td>
                  <td>{campaign.budget.toLocaleString()} / {campaign.spent.toLocaleString()} ({spent}%)</td>
                  <td>{campaign.reach.toLocaleString()}</td>
                  <td>AED {campaign.cpl}</td>
                  <td>
                    <button className="icon-btn" aria-label={`Edit campaign ${campaign.name}`}><Edit size={14} /></button>
                    <button className="icon-btn danger" onClick={() => { if (window.confirm(`Delete campaign "${campaign.name}"? This cannot be undone.`)) deleteCampaign(campaign.id); }} aria-label={`Delete campaign ${campaign.name}`}><Trash2 size={14} /></button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
