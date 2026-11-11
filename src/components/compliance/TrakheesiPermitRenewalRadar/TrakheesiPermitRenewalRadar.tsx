import React, { FC } from 'react';
import {
  FileText,
  AlertCircle,
  RefreshCw,
  Search,
  CheckCircle2,
  Calendar,
  ToggleLeft,
  ToggleRight,
  Shield,
  Layers,
} from 'lucide-react';
import { TrakheesiPermitRenewalRadarProps } from './TrakheesiPermitRenewalRadar.types';
import { useTrakheesiRadarLogic } from './TrakheesiPermitRenewalRadar.logic';
import {
  RadarContainer,
  RadarHeader,
  MetricDeck,
  MetricTile,
  ControlsBar,
  FilterPill,
  PermitTableContainer,
  RiskBadge,
} from './TrakheesiPermitRenewalRadar.styles';

export const TrakheesiPermitRenewalRadar: FC<TrakheesiPermitRenewalRadarProps> = ({
  initialPermits,
  onTriggerRenewal,
  onSyncDldPortal,
}) => {
  const {
    filteredPermits,
    metrics,
    filterType,
    setFilterType,
    searchQuery,
    setSearchQuery,
    notification,
    handleQueueRenewal,
    handleToggleAutoRenew,
    handlePortalSync,
  } = useTrakheesiRadarLogic(initialPermits, onTriggerRenewal, onSyncDldPortal);

  return (
    <RadarContainer data-testid="trakheesi-permit-renewal-radar">
      {/* 1. Header with Statutory Tag & DLD Gateway Sync */}
      <RadarHeader>
        <div className="title-area">
          <h3>
            <Shield size={18} color="#EF4444" />
            <span>DLD Trakheesi Permit Expiry & Auto-Renewal Radar</span>
          </h3>
          <span className="statutory-tag">RERA 180-Day Mandate</span>
        </div>

        <div className="header-actions">
          <button
            type="button"
            onClick={handlePortalSync}
            style={{
              background: 'linear-gradient(135deg, #EF4444, #DC2626)',
              color: '#FFFFFF',
              border: 'none',
              padding: '6px 12px',
              borderRadius: '6px',
              fontSize: '0.75rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
            data-testid="btn-sync-trakheesi-gateway"
          >
            <RefreshCw size={12} />
            <span>Harmonize DLD Gateway</span>
          </button>
        </div>
      </RadarHeader>

      {/* 2. Compliance Metrics Deck */}
      <MetricDeck>
        <MetricTile $color="#EF4444">
          <div className="label">Critical (&lt; 15 Days)</div>
          <div className="num" data-testid="metric-critical-count">{metrics.criticalCount}</div>
          <div className="sub">Ad Fines / Broker Card Risk</div>
        </MetricTile>

        <MetricTile $color="#F59E0B">
          <div className="label">Warning (15 - 30 Days)</div>
          <div className="num">{metrics.warningCount}</div>
          <div className="sub">Renewal Window Open</div>
        </MetricTile>

        <MetricTile $color="#10B981">
          <div className="label">Compliant Active</div>
          <div className="num">{metrics.compliantCount}</div>
          <div className="sub">Verified on DLD Public Register</div>
        </MetricTile>

        <MetricTile $color="#3B82F6">
          <div className="label">Statutory Capital Required</div>
          <div className="num">AED {metrics.totalRenewalsDueAED.toLocaleString()}</div>
          <div className="sub">RERA Official Portal Fees</div>
        </MetricTile>
      </MetricDeck>

      {/* Notification Toast if action executed */}
      {notification && (
        <div
          data-testid="trakheesi-alert-banner"
          style={{
            background: 'rgba(239, 68, 68, 0.12)',
            border: '1px solid rgba(239, 68, 68, 0.4)',
            color: '#FCA5A5',
            padding: '8px 12px',
            borderRadius: '6px',
            fontSize: '0.75rem',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <AlertCircle size={14} color="#EF4444" />
          <span>{notification}</span>
        </div>
      )}

      {/* 3. Controls & Filter Pills */}
      <ControlsBar>
        <div className="search-wrap">
          <Search size={14} color="#94A3B8" />
          <input
            type="text"
            placeholder="Search permit #, BRN, ORN, or property..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            data-testid="trakheesi-search-input"
          />
        </div>

        <div className="filter-pills">
          <FilterPill
            type="button"
            $isActive={filterType === 'all'}
            onClick={() => setFilterType('all')}
            data-testid="filter-pill-all"
          >
            All Permits ({filteredPermits.length})
          </FilterPill>
          <FilterPill
            type="button"
            $isActive={filterType === 'property_ad'}
            onClick={() => setFilterType('property_ad')}
            data-testid="filter-pill-property-ad"
          >
            Property Ads (180D)
          </FilterPill>
          <FilterPill
            type="button"
            $isActive={filterType === 'broker_card'}
            onClick={() => setFilterType('broker_card')}
            data-testid="filter-pill-broker-card"
          >
            Broker Cards (BRN)
          </FilterPill>
          <FilterPill
            type="button"
            $isActive={filterType === 'company_orn'}
            onClick={() => setFilterType('company_orn')}
            data-testid="filter-pill-company-orn"
          >
            Firm License (ORN)
          </FilterPill>
          <FilterPill
            type="button"
            $isActive={filterType === 'noc_permit'}
            onClick={() => setFilterType('noc_permit')}
            data-testid="filter-pill-noc-permit"
          >
            NOC Permits
          </FilterPill>
        </div>
      </ControlsBar>

      {/* 4. Trakheesi Permit Registry Table */}
      <PermitTableContainer>
        <table>
          <thead>
            <tr>
              <th>Permit No.</th>
              <th>Type</th>
              <th>Holder / Asset</th>
              <th>Reference</th>
              <th>Days Left</th>
              <th>Risk Level</th>
              <th>Fee (AED)</th>
              <th>Auto-Renew</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredPermits.map(permit => (
              <tr key={permit.id} data-testid={`permit-row-${permit.id}`}>
                <td style={{ fontWeight: 800, color: '#FFFFFF', fontFamily: 'monospace' }}>
                  {permit.permitNumber}
                </td>
                <td style={{ textTransform: 'capitalize' }}>{permit.type.replace('_', ' ')}</td>
                <td style={{ fontWeight: 700 }}>{permit.holderName}</td>
                <td style={{ color: '#94A3B8', fontFamily: 'monospace' }}>{permit.referenceCode}</td>
                <td style={{ fontWeight: 800, color: permit.daysRemaining <= 15 ? '#EF4444' : '#F1F5F9' }}>
                  {permit.daysRemaining} days
                </td>
                <td>
                  <RiskBadge $risk={permit.riskLevel}>{permit.riskLevel}</RiskBadge>
                </td>
                <td>AED {permit.statutoryFeeAED.toLocaleString()}</td>
                <td>
                  <button
                    type="button"
                    onClick={() => handleToggleAutoRenew(permit.id)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                    title="Toggle auto-renewal"
                    data-testid={`btn-toggle-auto-${permit.id}`}
                  >
                    {permit.autoRenewEnabled ? (
                      <ToggleRight size={22} color="#10B981" />
                    ) : (
                      <ToggleLeft size={22} color="#64748B" />
                    )}
                  </button>
                </td>
                <td>
                  <button
                    type="button"
                    onClick={() => handleQueueRenewal(permit.id)}
                    disabled={permit.portalSyncStatus === 'renewal_queued'}
                    style={{
                      background:
                        permit.portalSyncStatus === 'renewal_queued'
                          ? '#1E293B'
                          : 'linear-gradient(135deg, #EF4444, #B91C1C)',
                      color: '#FFFFFF',
                      border: 'none',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '0.68rem',
                      fontWeight: 800,
                      cursor: permit.portalSyncStatus === 'renewal_queued' ? 'not-allowed' : 'pointer',
                    }}
                    data-testid={`btn-renew-${permit.id}`}
                  >
                    {permit.portalSyncStatus === 'renewal_queued' ? 'Queued' : 'Renew 180D'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </PermitTableContainer>
    </RadarContainer>
  );
};

export default TrakheesiPermitRenewalRadar;
