// FILE: src/components/crm/DealManager/DealManagerView.tsx
/**
 * White Caves Real Estate LLC - Deal Manager Workspace View (Tier 1)
 * Standard: AEGIS Canonical 12-Way Architecture Standard
 * Single Purpose File Law: < 350 lines
 */

import React, { FC } from 'react';
import { Handshake, Plus, Search, DollarSign, TrendingUp, Activity, Award } from 'lucide-react';
import { useDealManager, UseDealManagerProps } from './DealManager.logic';
import { DealCard } from './DealCard';
import { DealDetailModal } from './DealDetailModal';
import { DealEditDrawer } from './DealEditDrawer';
import { DealManagerFallback } from './DealManager.fallback';
import {
  DealContainer,
  DealHeader,
  MetricsGrid,
  MetricCard,
  DealFilterBar,
  DealsGrid,
} from './DealManager.styles';

export const DealManagerView: FC<UseDealManagerProps> = props => {
  const {
    deals,
    metrics,
    searchQuery,
    setSearchQuery,
    typeFilter,
    setTypeFilter,
    statusFilter,
    setStatusFilter,
    selectedDealForModal,
    isDrawerOpen,
    editingDeal,
    runtimeError,
    handleResetError,
    t,
    handleOpenDetailModal,
    handleCloseDetailModal,
    handleOpenCreateDrawer,
    handleCloseDrawer,
    handleAdvanceStatus,
    handleSaveDeal,
    highlightedDealId,
  } = useDealManager(props);

  if (runtimeError) {
    return (
      <DealContainer data-testid="deal-manager-view">
        <DealManagerFallback
          error={runtimeError}
          onRetry={handleResetError}
          onNavigateBack={props.onNavigateBack}
        />
      </DealContainer>
    );
  }

  return (
    <DealContainer data-testid="deal-manager-view">
      {props.selectedDealId && selectedDealForModal ? (
        <DealDetailModal
          deal={selectedDealForModal}
          onClose={() => {
            handleCloseDetailModal();
            props.onNavigateBack?.();
          }}
          onAdvanceStatus={handleAdvanceStatus}
          isInline={true}
        />
      ) : (
        <>
          {/* ── 1. Top Executive Header ─────────────────────────────────── */}
          <DealHeader>
            <div className="title-group">
              <h1>
                <Handshake size={24} color="#C084FC" />
                Deal Tracking & Revenue Pipeline
              </h1>
              <p>
                Universal deal ledger binding Properties, Agents, Clients, Statutory Documents, and
                Escrow Revenue.
              </p>
            </div>

            <div className="actions">
              <button
                onClick={handleOpenCreateDrawer}
                data-testid="create-deal-btn"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '10px 18px',
                  borderRadius: '8px',
                  background: '#EF4444',
                  color: '#FFFFFF',
                  border: 'none',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(239, 68, 68, 0.4)',
                }}
              >
                <Plus size={16} />
                <span>Register Deal</span>
              </button>
            </div>
          </DealHeader>

          {/* ── 2. Real-Time Deal Metrics Deck ─────────────────────────── */}
          <MetricsGrid>
            <MetricCard $accentColor="#C084FC">
              <div className="label">Total Deals Ledger</div>
              <div className="value">
                {metrics.totalDealsCount} <span className="sub">Transactions</span>
              </div>
            </MetricCard>

            <MetricCard $accentColor="#34D399">
              <div className="label">Total Gross Commission</div>
              <div className="value">
                AED {(metrics.totalCommissionAED / 1_000_000).toFixed(2)}M
                <span className="sub">Booked Revenue</span>
              </div>
            </MetricCard>

            <MetricCard $accentColor="#38BDF8">
              <div className="label">Completed Sales Volume</div>
              <div className="value">
                AED {(metrics.completedVolumeAED / 1_000_000).toFixed(1)}M
                <span className="sub">Closed</span>
              </div>
            </MetricCard>

            <MetricCard $accentColor="#F59E0B">
              <div className="label">In-Flight Pipeline</div>
              <div className="value">
                {metrics.activePipelineCount} <span className="sub">Active Deals</span>
              </div>
            </MetricCard>
          </MetricsGrid>

          {/* ── 3. Filter & Search Bar ─────────────────────────────────── */}
          <DealFilterBar>
            <div className="search-input">
              <Search size={15} color="#94A3B8" />
              <input
                type="text"
                placeholder="Search deals by ID, property, agent, client or deal #..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                data-testid="deal-search-input"
              />
            </div>

            <div className="filter-group">
              {/* Deal Type Filter */}
              <div
                style={{
                  display: 'flex',
                  background: 'rgba(0,0,0,0.3)',
                  borderRadius: '6px',
                  padding: '2px',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
              >
                <button
                  onClick={() => setTypeFilter('ALL')}
                  data-testid="toggle-type-all"
                  style={{
                    padding: '4px 12px',
                    borderRadius: '4px',
                    border: 'none',
                    background: typeFilter === 'ALL' ? 'rgba(255,255,255,0.15)' : 'transparent',
                    color: typeFilter === 'ALL' ? '#FFFFFF' : '#94A3B8',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  All Types
                </button>
                <button
                  onClick={() => setTypeFilter('LEASING')}
                  data-testid="toggle-type-leasing"
                  style={{
                    padding: '4px 12px',
                    borderRadius: '4px',
                    border: 'none',
                    background:
                      typeFilter === 'LEASING' ? 'rgba(168, 85, 247, 0.25)' : 'transparent',
                    color: typeFilter === 'LEASING' ? '#C084FC' : '#94A3B8',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Leasing
                </button>
                <button
                  onClick={() => setTypeFilter('SALES')}
                  data-testid="toggle-type-sales"
                  style={{
                    padding: '4px 12px',
                    borderRadius: '4px',
                    border: 'none',
                    background: typeFilter === 'SALES' ? 'rgba(56, 189, 248, 0.25)' : 'transparent',
                    color: typeFilter === 'SALES' ? '#38BDF8' : '#94A3B8',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Sales
                </button>
              </div>

              {/* Status Dropdown */}
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value as any)}
                style={{
                  background: '#0B132B',
                  border: '1px solid rgba(255,255,255,0.12)',
                  color: '#FFFFFF',
                  borderRadius: '6px',
                  padding: '6px 12px',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  outline: 'none',
                  cursor: 'pointer',
                }}
              >
                <option value="ALL">All Statuses</option>
                <option value="INQUIRY">Inquiry</option>
                <option value="VIEWING">Viewing</option>
                <option value="OFFER">Offer</option>
                <option value="CONTRACT">Contract</option>
                <option value="EJARI_DLD">Ejari / DLD</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>
          </DealFilterBar>

          {/* ── 4. Deals Grid ─────────────────────────────────────────── */}
          <DealsGrid>
            {deals.map(deal => (
              <DealCard
                key={deal.id}
                deal={deal}
                onInspect={target => {
                  if (props.onSelectDeal) {
                    props.onSelectDeal(target.id);
                  } else {
                    handleOpenDetailModal(target);
                  }
                }}
              />
            ))}
          </DealsGrid>

          {/* ── 5. Detail Inspection Modal (only if not on deep route) ──── */}
          {selectedDealForModal && !props.selectedDealId && (
            <DealDetailModal
              deal={selectedDealForModal}
              onClose={handleCloseDetailModal}
              onAdvanceStatus={handleAdvanceStatus}
            />
          )}
        </>
      )}

      {/* ── 6. Create / Edit Drawer ─────────────────────────────────── */}
      <DealEditDrawer
        isOpen={isDrawerOpen}
        deal={editingDeal}
        onClose={handleCloseDrawer}
        onSave={handleSaveDeal}
      />
    </DealContainer>
  );
};

export default DealManagerView;
