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
 * @component
 */

import React, { FC, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../store/store';
import '../../../pages/RolePages.css';

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

const LandlordOfferReviewTab: FC = () => {
  const currentUser = useSelector((state: RootState) => state.user.currentUser);

  const [offers, setOffers] = useState<OfferEntry[]>([
    {
      id: 'offer-001',
      propertyTitle: 'Marina View 2BR Apartment',
      tenantName: 'Ahmed Al Rashid',
      amount: 7500,
      currency: 'AED',
      terms: '1-year lease, monthly PDC cheques, no pets.',
      expiresAt: '2026-05-15',
      status: 'pending',
    },
    {
      id: 'offer-002',
      propertyTitle: 'Downtown Studio',
      tenantName: 'Sarah Johnson',
      amount: 5200,
      currency: 'AED',
      terms: '6-month lease, direct bank transfer.',
      expiresAt: '2026-05-10',
      status: 'pending',
    },
    {
      id: 'offer-003',
      propertyTitle: 'JBR 3BR Villa',
      tenantName: 'Mohammed Al Farsi',
      amount: 18000,
      currency: 'AED',
      terms: '2-year lease, PDC cheques, pet allowed.',
      expiresAt: '2026-05-20',
      status: 'accepted',
    },
  ]);

  const [activeOfferId, setActiveOfferId] = useState<string | null>(null);
  const [actionType, setActionType] = useState<'reject' | 'counter' | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [counterAmount, setCounterAmount] = useState('');

  const pendingOffers = useMemo(() => offers.filter(o => o.status === 'pending'), [offers]);
  const decidedOffers = useMemo(() => offers.filter(o => o.status !== 'pending'), [offers]);

  const handleAccept = (offerId: string) => {
    setOffers(prev => prev.map(o => (o.id === offerId ? { ...o, status: 'accepted' } : o)));
  };

  const handleReject = (offerId: string) => {
    if (!rejectionReason.trim()) return;
    setOffers(prev =>
      prev.map(o => (o.id === offerId ? { ...o, status: 'rejected', rejectionReason } : o))
    );
    setActiveOfferId(null);
    setActionType(null);
    setRejectionReason('');
  };

  const handleCounter = (offerId: string) => {
    const amount = parseFloat(counterAmount);
    if (!amount || amount <= 0) return;
    setOffers(prev =>
      prev.map(o => (o.id === offerId ? { ...o, status: 'countered', counterAmount: amount } : o))
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
            <div
              key={offer.id}
              className="payment-row offer-card"
              data-testid={`offer-card-${offer.id}`}
            >
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
                  data-testid={`accept-offer-${offer.id}`}
                >
                  ✅ Accept
                </button>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => openAction(offer.id, 'counter')}
                  data-testid={`counter-offer-${offer.id}`}
                >
                  🔄 Counter
                </button>
                <button
                  type="button"
                  className="btn-danger"
                  onClick={() => openAction(offer.id, 'reject')}
                  data-testid={`reject-offer-${offer.id}`}
                >
                  ❌ Reject
                </button>
              </div>

              {activeOfferId === offer.id && actionType === 'reject' && (
                <div className="action-form" data-testid={`reject-form-${offer.id}`}>
                  <label htmlFor={`rejection-reason-${offer.id}`}>
                    Rejection Reason (required)
                  </label>
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
            <div
              key={offer.id}
              className="payment-row offer-card"
              data-testid={`decided-offer-${offer.id}`}
            >
              <div className="offer-info">
                <strong>{offer.propertyTitle}</strong>
                <p>Tenant: {offer.tenantName}</p>
                <p>
                  Offered: AED {offer.amount.toLocaleString()} / month
                  {offer.counterAmount
                    ? ` → Counter: AED ${offer.counterAmount.toLocaleString()}`
                    : ''}
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
