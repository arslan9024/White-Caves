import React from 'react';
import { Trophy, Award, TrendingUp } from 'lucide-react';

export interface LeaderboardAgent {
  rank: number;
  name: string;
  avatarUrl: string;
  volumeAED: number;
  dealCount: number;
  department: string;
}

const DEFAULT_TOP_BROKERS: LeaderboardAgent[] = [
  { rank: 1, name: 'Sarah Al Maktoum', avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop', volumeAED: 42500000, dealCount: 14, department: 'Sales & Secondary Market' },
  { rank: 2, name: 'Omar Zayed Al Fahim', avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop', volumeAED: 31200000, dealCount: 11, department: 'Sales & Secondary Market' },
  { rank: 3, name: 'Laila Hassan Al Rashidi', avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop', volumeAED: 24800000, dealCount: 9, department: 'Off-Plan Developments' },
];

export const SalesLeaderboardPodium: React.FC<{ brokers?: LeaderboardAgent[] }> = ({ brokers = DEFAULT_TOP_BROKERS }) => {
  return (
    <div style={{ backgroundColor: 'var(--wc-surface-canvas, #FFFFFF)', border: '1px solid var(--wc-border-light, #E2E8F0)', borderRadius: '12px', padding: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.04)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', paddingBottom: '12px', borderBottom: '1px solid var(--wc-border-light, #E2E8F0)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Trophy size={22} color="var(--wc-red-primary, #EF4444)" />
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold', color: 'var(--wc-text-primary, #1E293B)' }}>Monthly Broker Sales Leaderboard</h3>
        </div>
        <div style={{ fontSize: '12px', color: 'var(--wc-text-secondary, #64748B)', fontWeight: '600' }}>Live RERA Deal Volume (AED)</div>
      </div>

      {/* Animated 3-Tier Podium */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', alignItems: 'end', marginBottom: '24px' }}>
        {/* 2nd Place */}
        <div style={{ textAlign: 'center', backgroundColor: 'var(--wc-surface-card, #F8FAFC)', padding: '16px', borderRadius: '12px', border: '1px solid var(--wc-border-light, #E2E8F0)' }}>
          <div style={{ position: 'relative', display: 'inline-block', marginBottom: '10px' }}>
            <img src={brokers[1].avatarUrl} alt={brokers[1].name} style={{ width: '64px', height: '64px', borderRadius: '50%', border: '3px solid var(--wc-text-muted, #94A3B8)', objectFit: 'cover' }} />
            <span style={{ position: 'absolute', bottom: '-6px', right: '-6px', backgroundColor: 'var(--wc-text-muted, #94A3B8)', color: '#FFFFFF', fontSize: '11px', fontWeight: 'bold', width: '20px', height: '20px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>2</span>
          </div>
          <div style={{ fontSize: '14px', fontWeight: 'bold', color: 'var(--wc-text-primary, #1E293B)' }}>{brokers[1].name}</div>
          <div style={{ fontSize: '11px', color: 'var(--wc-text-secondary, #64748B)', marginBottom: '8px' }}>{brokers[1].department}</div>
          <div style={{ fontSize: '15px', fontWeight: 'bold', color: 'var(--wc-red-primary, #EF4444)' }}>AED {(brokers[1].volumeAED / 1000000).toFixed(1)}M</div>
          <div style={{ fontSize: '11px', color: 'var(--wc-text-muted, #94A3B8)' }}>{brokers[1].dealCount} Deals Closed</div>
        </div>

        {/* 1st Place (Center / Tallest) */}
        <div style={{ textAlign: 'center', backgroundColor: 'var(--wc-red-light, #FFF5F5)', padding: '24px 16px', borderRadius: '12px', border: '2px solid var(--wc-red-primary, #EF4444)', boxShadow: '0 8px 20px rgba(239, 68, 68, 0.15)', transform: 'translateY(-8px)' }}>
          <div style={{ position: 'relative', display: 'inline-block', marginBottom: '10px' }}>
            <img src={brokers[0].avatarUrl} alt={brokers[0].name} style={{ width: '80px', height: '80px', borderRadius: '50%', border: '4px solid var(--wc-red-primary, #EF4444)', objectFit: 'cover' }} />
            <span style={{ position: 'absolute', bottom: '-8px', right: '-8px', backgroundColor: 'var(--wc-red-primary, #EF4444)', color: '#FFFFFF', fontSize: '12px', fontWeight: 'bold', width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>1</span>
          </div>
          <div style={{ fontSize: '16px', fontWeight: 'bold', color: 'var(--wc-text-primary, #1E293B)' }}>{brokers[0].name}</div>
          <div style={{ fontSize: '12px', color: 'var(--wc-red-primary, #EF4444)', fontWeight: '600', marginBottom: '8px' }}>★ Top Producer</div>
          <div style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--wc-red-primary, #EF4444)' }}>AED {(brokers[0].volumeAED / 1000000).toFixed(1)}M</div>
          <div style={{ fontSize: '12px', color: 'var(--wc-text-secondary, #64748B)' }}>{brokers[0].dealCount} Deals Closed</div>
        </div>

        {/* 3rd Place */}
        <div style={{ textAlign: 'center', backgroundColor: 'var(--wc-surface-card, #F8FAFC)', padding: '16px', borderRadius: '12px', border: '1px solid var(--wc-border-light, #E2E8F0)' }}>
          <div style={{ position: 'relative', display: 'inline-block', marginBottom: '10px' }}>
            <img src={brokers[2].avatarUrl} alt={brokers[2].name} style={{ width: '64px', height: '64px', borderRadius: '50%', border: '3px solid var(--wc-border-light, #CBD5E1)', objectFit: 'cover' }} />
            <span style={{ position: 'absolute', bottom: '-6px', right: '-6px', backgroundColor: 'var(--wc-border-light, #CBD5E1)', color: 'var(--wc-text-primary, #1E293B)', fontSize: '11px', fontWeight: 'bold', width: '20px', height: '20px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>3</span>
          </div>
          <div style={{ fontSize: '14px', fontWeight: 'bold', color: 'var(--wc-text-primary, #1E293B)' }}>{brokers[2].name}</div>
          <div style={{ fontSize: '11px', color: 'var(--wc-text-secondary, #64748B)', marginBottom: '8px' }}>{brokers[2].department}</div>
          <div style={{ fontSize: '15px', fontWeight: 'bold', color: 'var(--wc-red-primary, #EF4444)' }}>AED {(brokers[2].volumeAED / 1000000).toFixed(1)}M</div>
          <div style={{ fontSize: '11px', color: 'var(--wc-text-muted, #94A3B8)' }}>{brokers[2].dealCount} Deals Closed</div>
        </div>
      </div>
    </div>
  );
};

export default SalesLeaderboardPodium;
