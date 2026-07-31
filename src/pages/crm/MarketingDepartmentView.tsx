import React, { FC, useState, useCallback } from 'react';

const RED = '#EF4444';
const WHITE = '#FFFFFF';
const SLATE = '#1E293B';
const BORDER = 'rgba(239, 68, 68, 0.2)';
const CARD_BG = '#F8FAFC';
const TEXT_MUTED = '#64748B';
const GREEN = '#10B981';
const ORANGE = '#F59E0B';
const PURPLE = '#8B5CF6';
const BLUE = '#3B82F6';

interface Campaign {
  id: string;
  name: string;
  channel: 'WhatsApp' | 'Email' | 'Portal' | 'Social';
  status: 'Active' | 'Scheduled' | 'Completed' | 'Draft';
  audience: number;
  sent: number;
  opened: number;
  converted: number;
  scheduledDate: string;
}

const CAMPAIGNS: Campaign[] = [
  { id: 'CMP-001', name: 'Ramadan Off-Plan Launch — Dubai Hills Estate', channel: 'WhatsApp', status: 'Completed', audience: 1240, sent: 1240, opened: 987, converted: 43, scheduledDate: '2026-06-01' },
  { id: 'CMP-002', name: 'DAMAC Hills 2 Investor Showcase Q3', channel: 'Email', status: 'Active', audience: 890, sent: 890, opened: 612, converted: 28, scheduledDate: '2026-07-15' },
  { id: 'CMP-003', name: 'Summer Price Drop — Serviced Apts Dubai Marina', channel: 'Portal', status: 'Active', audience: 4500, sent: 4500, opened: 2310, converted: 97, scheduledDate: '2026-07-20' },
  { id: 'CMP-004', name: 'New Listing Alert — Palm Jumeirah Penthouse', channel: 'WhatsApp', status: 'Scheduled', audience: 320, sent: 0, opened: 0, converted: 0, scheduledDate: '2026-07-30' },
  { id: 'CMP-005', name: 'Tenancy Renewal Reminder — Q3 Ejari Expiries', channel: 'Email', status: 'Scheduled', audience: 156, sent: 0, opened: 0, converted: 0, scheduledDate: '2026-08-01' },
  { id: 'CMP-006', name: 'Monthly Market Insight Newsletter', channel: 'Email', status: 'Draft', audience: 3200, sent: 0, opened: 0, converted: 0, scheduledDate: '2026-08-05' },
  { id: 'CMP-007', name: 'High-Net-Worth Referral Programme', channel: 'Social', status: 'Active', audience: 15000, sent: 15000, opened: 8430, converted: 122, scheduledDate: '2026-07-01' },
];

interface PortalListing {
  portal: string;
  logo: string;
  activeListings: number;
  pendingApproval: number;
  expiredPermits: number;
  avgDaysToEnquiry: number;
  color: string;
}

const PORTALS: PortalListing[] = [
  { portal: 'Property Finder', logo: '🏠', activeListings: 47, pendingApproval: 3, expiredPermits: 2, avgDaysToEnquiry: 4.2, color: BLUE },
  { portal: 'Bayut', logo: '🔍', activeListings: 42, pendingApproval: 1, expiredPermits: 1, avgDaysToEnquiry: 5.8, color: ORANGE },
  { portal: 'Dubizzle', logo: '📋', activeListings: 31, pendingApproval: 0, expiredPermits: 0, avgDaysToEnquiry: 7.1, color: PURPLE },
  { portal: 'Own Website', logo: '🌐', activeListings: 100, pendingApproval: 0, expiredPermits: 0, avgDaysToEnquiry: 2.1, color: GREEN },
];

const statusConfig = {
  Active: { bg: '#DEF7EC', color: GREEN },
  Scheduled: { bg: '#EFF6FF', color: BLUE },
  Completed: { bg: '#F3F4F6', color: SLATE },
  Draft: { bg: '#FEF3C7', color: ORANGE },
};

const channelIcon: Record<string, string> = {
  WhatsApp: '💬',
  Email: '📧',
  Portal: '🌐',
  Social: '📱',
};

export const MarketingDepartmentView: FC = () => {
  const [activeTab, setActiveTab] = useState<'campaigns' | 'portals' | 'seo'>('campaigns');
  const [showNewCampaign, setShowNewCampaign] = useState(false);
  const [newCampaignName, setNewCampaignName] = useState('');
  const [newCampaignChannel, setNewCampaignChannel] = useState<Campaign['channel']>('WhatsApp');
  const [campaigns, setCampaigns] = useState<Campaign[]>(CAMPAIGNS);
  const [toasts, setToasts] = useState<Array<{ id: number; message: string; color: string }>>([]);

  const showToast = useCallback((message: string, color = GREEN) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, color }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3200);
  }, []);

  const totalReach = campaigns.reduce((a, c) => a + c.audience, 0);
  const totalConverted = campaigns.reduce((a, c) => a + c.converted, 0);
  const avgOpenRate = Math.round(campaigns.filter(c => c.sent > 0).reduce((a, c) => a + (c.opened / c.sent), 0) / campaigns.filter(c => c.sent > 0).length * 100);

  const handleAddCampaign = () => {
    if (!newCampaignName) return;
    const newCamp: Campaign = {
      id: `CMP-${String(campaigns.length + 1).padStart(3, '0')}`,
      name: newCampaignName,
      channel: newCampaignChannel,
      status: 'Draft',
      audience: 0,
      sent: 0,
      opened: 0,
      converted: 0,
      scheduledDate: '',
    };
    setCampaigns(prev => [newCamp, ...prev]);
    setNewCampaignName('');
    setShowNewCampaign(false);
  };

  return (
    <div style={{ padding: '24px', background: WHITE, minHeight: '80vh' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.6rem', fontWeight: 800, color: SLATE }}>📣 Marketing & Portal Syndication</h2>
          <p style={{ margin: '6px 0 0 0', color: TEXT_MUTED, fontSize: '0.875rem' }}>
            WhatsApp campaigns, portal listings, email automations, and SEO performance
          </p>
        </div>
        <button
          onClick={() => setShowNewCampaign(true)}
          style={{ background: RED, color: WHITE, border: 'none', padding: '10px 18px', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, fontSize: '0.875rem' }}
        >
          + New Campaign
        </button>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '24px' }}>
        {[
          { label: 'Total Campaign Reach', value: totalReach.toLocaleString(), icon: '👥', color: BLUE },
          { label: 'Total Conversions', value: totalConverted, icon: '🎯', color: GREEN },
          { label: 'Avg Open Rate', value: `${avgOpenRate}%`, icon: '📬', color: ORANGE },
          { label: 'Active Campaigns', value: campaigns.filter(c => c.status === 'Active').length, icon: '🔥', color: RED },
        ].map(kpi => (
          <div key={kpi.label} style={{ background: CARD_BG, padding: '16px', borderRadius: '10px', borderLeft: `4px solid ${kpi.color}` }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '4px' }}>{kpi.icon}</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 900, color: kpi.color }}>{kpi.value}</div>
            <div style={{ fontSize: '0.72rem', color: TEXT_MUTED, fontWeight: 700, textTransform: 'uppercase', marginTop: '2px' }}>{kpi.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: `2px solid ${BORDER}`, marginBottom: '20px' }}>
        {(['campaigns', 'portals', 'seo'] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            style={{ background: 'none', border: 'none', borderBottom: activeTab === tab ? `3px solid ${RED}` : '3px solid transparent', padding: '10px 20px', cursor: 'pointer', fontWeight: activeTab === tab ? 700 : 500, color: activeTab === tab ? RED : TEXT_MUTED, fontSize: '0.9rem', textTransform: 'capitalize', marginBottom: '-2px' }}>
            {tab === 'campaigns' ? '📢 Campaigns' : tab === 'portals' ? '🌐 Portal Syndication' : '🔍 SEO Performance'}
          </button>
        ))}
      </div>

      {/* CAMPAIGNS TAB */}
      {activeTab === 'campaigns' && (
        <>
          {showNewCampaign && (
            <div style={{ background: CARD_BG, padding: '20px', borderRadius: '10px', border: `1px solid ${BORDER}`, marginBottom: '16px' }}>
              <h4 style={{ margin: '0 0 12px 0', color: SLATE }}>Create New Campaign</h4>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end' }}>
                <div style={{ flex: 2 }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: SLATE, display: 'block', marginBottom: '4px' }}>Campaign Name</label>
                  <input value={newCampaignName} onChange={e => setNewCampaignName(e.target.value)} placeholder="e.g. Q3 Off-Plan Launch — Dubai Creek Harbour"
                    style={{ width: '100%', padding: '8px 12px', border: `1px solid ${BORDER}`, borderRadius: '6px', fontSize: '0.875rem', boxSizing: 'border-box' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: SLATE, display: 'block', marginBottom: '4px' }}>Channel</label>
                  <select value={newCampaignChannel} onChange={e => setNewCampaignChannel(e.target.value as Campaign['channel'])}
                    style={{ width: '100%', padding: '8px 12px', border: `1px solid ${BORDER}`, borderRadius: '6px', fontSize: '0.875rem' }}>
                    {['WhatsApp', 'Email', 'Portal', 'Social'].map(ch => <option key={ch}>{ch}</option>)}
                  </select>
                </div>
                <button onClick={handleAddCampaign} style={{ background: RED, color: WHITE, border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 700, whiteSpace: 'nowrap' }}>Add Draft</button>
                <button onClick={() => setShowNewCampaign(false)} style={{ background: 'var(--color-e2e8f0, #E2E8F0)', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' }}>Cancel</button>
              </div>
            </div>
          )}
          <div style={{ background: WHITE, borderRadius: '10px', border: `1px solid ${BORDER}`, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
              <thead>
                <tr style={{ background: SLATE, color: WHITE }}>
                  <th style={{ padding: '10px 14px', textAlign: 'left' }}>CAMPAIGN</th>
                  <th style={{ padding: '10px 14px', textAlign: 'left' }}>CHANNEL</th>
                  <th style={{ padding: '10px 14px', textAlign: 'left' }}>STATUS</th>
                  <th style={{ padding: '10px 14px', textAlign: 'right' }}>AUDIENCE</th>
                  <th style={{ padding: '10px 14px', textAlign: 'right' }}>OPEN RATE</th>
                  <th style={{ padding: '10px 14px', textAlign: 'right' }}>CONVERTED</th>
                  <th style={{ padding: '10px 14px', textAlign: 'center' }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {campaigns.map((c, idx) => {
                  const openRate = c.sent > 0 ? Math.round((c.opened / c.sent) * 100) : 0;
                  const sc = statusConfig[c.status];
                  return (
                    <tr key={c.id} style={{ borderBottom: '1px solid #E2E8F0', background: idx % 2 === 0 ? WHITE : CARD_BG }}>
                      <td style={{ padding: '12px 14px' }}>
                        <div style={{ fontWeight: 600 }}>{c.name}</div>
                        <div style={{ fontSize: '0.7rem', color: TEXT_MUTED, fontFamily: 'monospace' }}>{c.id} · {c.scheduledDate || 'No date set'}</div>
                      </td>
                      <td style={{ padding: '12px 14px' }}>{channelIcon[c.channel]} {c.channel}</td>
                      <td style={{ padding: '12px 14px' }}>
                        <span style={{ background: sc.bg, color: sc.color, padding: '2px 8px', borderRadius: '12px', fontWeight: 700, fontSize: '0.72rem' }}>{c.status}</span>
                      </td>
                      <td style={{ padding: '12px 14px', textAlign: 'right', fontWeight: 700 }}>{c.audience.toLocaleString()}</td>
                      <td style={{ padding: '12px 14px', textAlign: 'right', color: openRate > 50 ? GREEN : openRate > 25 ? ORANGE : TEXT_MUTED, fontWeight: 700 }}>
                        {c.sent > 0 ? `${openRate}%` : '—'}
                      </td>
                      <td style={{ padding: '12px 14px', textAlign: 'right', color: c.converted > 0 ? GREEN : TEXT_MUTED, fontWeight: 700 }}>
                        {c.converted > 0 ? c.converted : '—'}
                      </td>
                      <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                        <button onClick={() => showToast(`📋 Campaign duplicated: ${c.name}`, BLUE)}
                          style={{ background: 'var(--color-e2e8f0, #E2E8F0)', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.72rem', fontWeight: 600 }}>
                          Duplicate
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* PORTALS TAB */}
      {activeTab === 'portals' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
          {PORTALS.map(portal => (
            <div key={portal.portal} style={{ background: CARD_BG, padding: '20px', borderRadius: '12px', border: `2px solid ${portal.color}30` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <span style={{ fontSize: '2rem' }}>{portal.logo}</span>
                <div>
                  <h3 style={{ margin: 0, color: portal.color, fontSize: '1.1rem', fontWeight: 800 }}>{portal.portal}</h3>
                  <span style={{ fontSize: '0.75rem', color: TEXT_MUTED }}>Portal Syndication Status</span>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                {[
                  { label: 'Active Listings', value: portal.activeListings, color: GREEN },
                  { label: 'Pending Approval', value: portal.pendingApproval, color: portal.pendingApproval > 0 ? ORANGE : TEXT_MUTED },
                  { label: 'Expired Permits', value: portal.expiredPermits, color: portal.expiredPermits > 0 ? RED : TEXT_MUTED },
                  { label: 'Avg Days to Enquiry', value: `${portal.avgDaysToEnquiry}d`, color: portal.color },
                ].map(stat => (
                  <div key={stat.label} style={{ background: WHITE, padding: '10px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                    <div style={{ fontSize: '0.7rem', color: TEXT_MUTED, textTransform: 'uppercase', fontWeight: 700 }}>{stat.label}</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: stat.color, marginTop: '2px' }}>{stat.value}</div>
                  </div>
                ))}
              </div>
              <button onClick={() => showToast(`🌐 Opening ${portal.portal} bulk upload panel...`, SLATE)}
                style={{ width: '100%', marginTop: '14px', padding: '9px', background: portal.color, color: WHITE, border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, fontSize: '0.8rem' }}>
                Manage Listings →
              </button>
            </div>
          ))}
        </div>
      )}

      {/* SEO TAB */}
      {activeTab === 'seo' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', marginBottom: '20px' }}>
            {[
              { metric: 'Organic Traffic (Monthly)', value: '12,450', change: '+18%', color: GREEN },
              { metric: 'Google Ranking — "Dubai real estate"', value: '#4', change: '+2 positions', color: BLUE },
              { metric: 'Domain Authority', value: '41/100', change: '+3 pts', color: PURPLE },
              { metric: 'Indexed Pages', value: '1,284', change: '+92 new', color: ORANGE },
              { metric: 'Backlinks', value: '3,891', change: '+124', color: GREEN },
              { metric: 'Core Web Vitals (LCP)', value: '1.8s', change: '✅ PASS', color: GREEN },
            ].map(m => (
              <div key={m.metric} style={{ background: CARD_BG, padding: '16px', borderRadius: '10px', borderLeft: `4px solid ${m.color}` }}>
                <div style={{ fontSize: '0.72rem', color: TEXT_MUTED, fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>{m.metric}</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 900, color: m.color }}>{m.value}</div>
                <div style={{ fontSize: '0.75rem', color: GREEN, fontWeight: 700, marginTop: '4px' }}>{m.change}</div>
              </div>
            ))}
          </div>
          <div style={{ background: CARD_BG, padding: '20px', borderRadius: '10px', border: `1px solid ${BORDER}` }}>
            <h4 style={{ margin: '0 0 12px 0', color: RED }}>Top Ranking Keywords</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                { keyword: 'Dubai real estate agency', position: 4, volume: 8900 },
                { keyword: 'DAMAC Hills 2 properties for rent', position: 2, volume: 3200 },
                { keyword: 'White Caves real estate Dubai', position: 1, volume: 1100 },
                { keyword: 'luxury villas Dubai Hills Estate', position: 7, volume: 4500 },
                { keyword: 'Ejari registration Dubai agent', position: 5, volume: 2800 },
              ].map(kw => (
                <div key={kw.keyword} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: WHITE, padding: '10px 14px', borderRadius: '6px', border: '1px solid #E2E8F0' }}>
                  <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{kw.keyword}</span>
                  <div style={{ display: 'flex', gap: '16px', fontSize: '0.8rem' }}>
                    <span style={{ color: kw.position <= 3 ? GREEN : kw.position <= 7 ? ORANGE : TEXT_MUTED, fontWeight: 700 }}>#{kw.position}</span>
                    <span style={{ color: TEXT_MUTED }}>{kw.volume.toLocaleString()} vol/mo</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      {toasts.length > 0 && (
        <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999, display: 'flex', flexDirection: 'column', gap: '10px', pointerEvents: 'none' }}>
          {toasts.map(t => (
            <div key={t.id} style={{ background: t.color, color: WHITE, padding: '12px 18px', borderRadius: '10px', fontWeight: 600, fontSize: '0.85rem', boxShadow: '0 4px 20px rgba(0,0,0,0.18)', maxWidth: '360px' }}>
              {t.message}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MarketingDepartmentView;
