/**
 * LandlordOfferReviewTab — Offer Review: Approve / Reject Tenant Offers
 *
 * Shows landlord all lease offers on their properties with:
 * - Property name, tenant name, offered monthly rent
 * - Offer terms and expiry date
 * - Accept / Reject / Counter controls
 * - Rejection reason input
 * - Counter-amount input
 *
 * Phase 31: Wired to live API — GET /api/offers/received, PATCH /api/offers/:id
 *
 * @component
 */

import React, { FC, useMemo, useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../store/store';
import { authFetch } from '../../../utils/authFetch';
import { createLogger } from '../../../utils/logger';
import '../../../pages/RolePages.css';

const log = createLogger('LandlordOfferReviewTab');

type OfferStatus = 'pending' | 'accepted' | 'rejected' | 'countered';

interface OfferEntry {
  id: string;
  propertyTitle: string;
  tenantName: string;
  amount: number;
  currency: string;
  terms: string;
  expiresAt: string;
  status: OfferStatus;
  counterAmount?: number;
  rejectionReason?: string;
}

interface ApiOffer {
  id: string;
  amount: number;
  terms: string | null;
  expiresAt: string | null;
  status: string;
  counterAmount: number | null;
  rejectionReason: string | null;
  property: {
    id: string;
    title: string;
    location: string;
  } | null;
  buyer: {
    id: string;
    name: string;
    email: string;
  } | null;
}

const apiOfferToEntry = (o: ApiOffer): OfferEntry => ({
  id: o.id,
  propertyTitle: o.property?.title ?? 'Unknown Property',
  tenantName: o.buyer?.name ?? 'Unknown Applicant',
  amount: o.amount ?? 0,
  currency: 'AED',
  terms: o.terms ?? '—',
  expiresAt: o.expiresAt
    ? new Date(o.expiresAt).toLocaleDateString('en-AE', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : '—',
  status: (['pending', 'accepted', 'rejected', 'countered'].includes(o.status)
    ? o.status
    : 'pending') as OfferStatus,
  counterAmount: o.counterAmount ?? undefined,
  rejectionReason: o.rejectionReason ?? undefined,
});

const LandlordOfferReviewTab: FC = () => {
  const currentUser = useSelector((state: RootState) => state.user.currentUser);

  const [offers, setOffers] = useState<OfferEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeOfferId, setActiveOfferId] = useState<string | null>(null);
  const [actionType, setActionType] = useState<'reject' | 'counter' | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [counterAmount, setCounterAmount] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // ── Fetch received offers ──────────────────────────────────────────────────
  useEffect(() => {
    if (!currentUser) return;
    let cancelled = false;

    authFetch('/api/offers/received')
      .then(r => r.json())
      .then(data => {
        if (!cancelled) {
          const raw: ApiOffer[] = data.data ?? [];
          setOffers(raw.map(apiOfferToEntry));
          setLoading(false);
        }
      })
      .catch(err => {
        if (!cancelled) {
          log.error('Failed to load offers:', err);
          setError('Unable to load offers. Please refresh.');
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [currentUser]);

  // ── Decision helpers ───────────────────────────────────────────────────────
  const patchOffer = useCallback(
    async (
      offerId: string,
      body: Record<string, unknown>,
      optimisticUpdate: (prev: OfferEntry[]) => OfferEntry[],
    ) => {
      setSubmitting(true);
      // Optimistic update
      setOffers(optimisticUpdate);
      try {
        const res = await authFetch(`/api/offers/${offerId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.message ?? 'Request failed');
        }
      } catch (err) {
        log.error('Offer action failed, reverting:', err);
        // Revert optimistic update on failure
        setOffers(prev =>
          prev.map(o =>
            o.id === offerId ? { ...o, status: 'pending' as OfferStatus } : o,
          ),
        );
        setError('Action failed. Please try again.');
      } finally {
        setSubmitting(false);
      }
    },
    [],
  );

  const pendingOffers = useMemo(() => offers.filter(o => o.status === 'pending'), [offers]);
  const decidedOffers = useMemo(() => offers.filter(o => o.status !== 'pending'), [offers]);

  const handleAccept = (offerId: string) => {
    void patchOffer(
      offerId,
      { status: 'accepted' },
      prev => prev.map(o => (o.id === offerId ? { ...o, status: 'accepted' as OfferStatus } : o)),
    );
  };

  const handleReject = (offerId: string) => {
    if (!rejectionReason.trim()) return;
    void patchOffer(
      offerId,
      { status: 'rejected', rejectionReason },
      prev =>
        prev.map(o =>
          o.id === offerId ? { ...o, status: 'rejected' as OfferStatus, rejectionReason } : o,
        ),
    );
    setActiveOfferId(null);
    setActionType(null);
    setRejectionReason('');
  };

  const handleCounter = (offerId: string) => {
    const amount = parseFloat(counterAmount);
    if (!amount || amount <= 0) return;
    void patchOffer(
      offerId,
      { status: 'countered', counterAmount: amount },
      prev =>
        prev.map(o =>
          o.id === offerId
            ? { ...o, status: 'countered' as OfferStatus, counterAmount: amount }
            : o,
        ),
    );
    setActiveOfferId(null);
    setActionType(null);
    setCounterAmount('');
  };

  const openAction = (offerId: string, type: 'reject' | 'counter') => {
    setActiveOfferId(offerId);
    setActionType(type);
    setRejectionReason('');
    setCounterAmount('');
  };

  const cancelAction = () => {
    setActiveOfferId(null);
    setActionType(null);
  };

  if (!currentUser) {
    return (
      <div className="empty-state">
        <p>You must be logged in to review offers.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="tab-content-section">
        <p className="empty-state-text">⏳ Loading offers…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="tab-content-section">
        <p className="empty-state-text" style={{ color: 'var(--error-red, #ef4444)' }}>
          {error}
        </p>
      </div>
    );
  }

  return (
    <div className="tab-content-section landlord-offer-review-tab">
      <div className="tab-header">
        <h3>Offer Review</h3>
        <p>Review, approve, reject, or counter incoming lease offers on your properties.</p>
      </div>

      <div className="summary-grid" data-testid="offer-review-summary">
        <div className="summary-card">
          <h4>Pending Review</h4>
          <p>{pendingOffers.length}</p>
        </div>
        <div className="summary-card">
          <h4>Accepted</h4>
          <p>{offers.filter(o => o.status === 'accepted').length}</p>
        </div>
        <div className="summary-card">
          <h4>Countered</h4>
          <p>{offers.filter(o => o.status === 'countered').length}</p>
        </div>
        <div className="summary-card">
          <h4>Rejected</h4>
          <p>{offers.filter(o => o.status === 'rejected').length}</p>
        </div>
      </div>

      {pendingOffers.length > 0 && (
        <section data-testid="pending-offers-section">
          <h4>Pending Offers</h4>
          {pendingOffers.map(offer => (
            <div key={offer.id} className="payment-row offer-card" data-testid={`offer-card-${offer.id}`}>
              <div className="offer-info">
                <strong>{offer.propertyTitle}</strong>
                <p>Tenant: {offer.tenantName}</p>
                <p>Offered Rent: AED {offer.amount.toLocaleString()} / month</p>
                <p>Terms: {offer.terms}</p>
                <p>Expires: {offer.expiresAt}</p>
              </div>
              <div className="offer-actions">
                <button
                  type="button"
                  className="btn-primary"
                  onClick={() => handleAccept(offer.id)}
                  disabled={submitting}
                  data-testid={`accept-offer-${offer.id}`}
                >
                  ✅ Accept
                </button>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => openAction(offer.id, 'counter')}
                  disabled={submitting}
                  data-testid={`counter-offer-${offer.id}`}
                >
                  🔄 Counter
                </button>
                <button
                  type="button"
                  className="btn-danger"
                  onClick={() => openAction(offer.id, 'reject')}
                  disabled={submitting}
                  data-testid={`reject-offer-${offer.id}`}
                >
                  ❌ Reject
                </button>
              </div>

              {activeOfferId === offer.id && actionType === 'reject' && (
                <div className="action-form" data-testid={`reject-form-${offer.id}`}>
                  <label htmlFor={`rejection-reason-${offer.id}`}>Rejection Reason (required)</label>
                  <input
                    id={`rejection-reason-${offer.id}`}
                    type="text"
                    placeholder="e.g. Rent too low, preferred longer lease"
                    value={rejectionReason}
                    onChange={e => setRejectionReason(e.target.value)}
                    data-testid={`rejection-reason-input-${offer.id}`}
                  />
                  <div className="form-actions">
                    <button
                      type="button"
                      className="btn-danger"
                      disabled={!rejectionReason.trim()}
                      onClick={() => handleReject(offer.id)}
                      data-testid={`confirm-reject-${offer.id}`}
                    >
                      Confirm Rejection
                    </button>
                    <button type="button" className="btn-secondary" onClick={cancelAction}>
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {activeOfferId === offer.id && actionType === 'counter' && (
                <div className="action-form" data-testid={`counter-form-${offer.id}`}>
                  <label htmlFor={`counter-amount-${offer.id}`}>
                    Counter Offer Amount (AED/month)
                  </label>
                  <input
                    id={`counter-amount-${offer.id}`}
                    type="number"
                    placeholder="e.g. 8000"
                    min="1"
                    value={counterAmount}
                    onChange={e => setCounterAmount(e.target.value)}
                    data-testid={`counter-amount-input-${offer.id}`}
                  />
                  <div className="form-actions">
                    <button
                      type="button"
                      className="btn-primary"
                      disabled={!counterAmount || parseFloat(counterAmount) <= 0}
                      onClick={() => handleCounter(offer.id)}
                      data-testid={`confirm-counter-${offer.id}`}
                    >
                      Send Counter Offer
                    </button>
                    <button type="button" className="btn-secondary" onClick={cancelAction}>
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </section>
      )}

      {decidedOffers.length > 0 && (
        <section data-testid="decided-offers-section">
          <h4>Previous Decisions</h4>
          {decidedOffers.map(offer => (
            <div key={offer.id} className="payment-row offer-card" data-testid={`decided-offer-${offer.id}`}>
              <div className="offer-info">
                <strong>{offer.propertyTitle}</strong>
                <p>Tenant: {offer.tenantName}</p>
                <p>
                  Offered: AED {offer.amount.toLocaleString()} / month
                  {offer.counterAmount ? ` → Counter: AED ${offer.counterAmount.toLocaleString()}` : ''}
                </p>
                {offer.rejectionReason && <p>Reason: {offer.rejectionReason}</p>}
              </div>
              <div>
                <span className={`status-badge status-${offer.status}`}>{offer.status}</span>
              </div>
            </div>
          ))}
        </section>
      )}

      {offers.length === 0 && (
        <div className="empty-state" data-testid="no-offers-state">
          <p>No offers on your properties yet.</p>
        </div>
      )}
    </div>
  );
};

export default LandlordOfferReviewTab;
