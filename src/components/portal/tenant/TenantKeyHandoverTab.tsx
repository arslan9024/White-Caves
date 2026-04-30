/**
 * TenantKeyHandoverTab — Stage 8: Key Handover Checklist
 *
 * Shows the tenant their move-in checklist after keys are handed over:
 * - Keys received confirmation
 * - DEWA / gas meter readings
 * - Access card numbers
 * - Parking sticker details
 * - Digital acknowledgement button
 *
 * @component
 */

import React, { FC, useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../store/store';
import '../../../pages/RolePages.css';

interface ChecklistItem {
  key: string;
  label: string;
  checked: boolean;
}

const TenantKeyHandoverTab: FC = () => {
  const currentUser = useSelector((state: RootState) => state.user.currentUser);

  const [checklist, setChecklist] = useState<ChecklistItem[]>([
    { key: 'keys', label: 'Main door keys received', checked: false },
    { key: 'mailbox', label: 'Mailbox key received', checked: false },
    { key: 'accessCard', label: 'Building access card(s) received', checked: false },
    { key: 'parking', label: 'Parking sticker / access card received', checked: false },
    { key: 'dewa', label: 'DEWA meter reading confirmed', checked: false },
    { key: 'gas', label: 'Gas meter reading confirmed (if applicable)', checked: false },
    { key: 'condition', label: 'Property condition inspected and accepted', checked: false },
    { key: 'handoverForm', label: 'Key handover form signed and received', checked: false },
  ]);

  const [meterReadings, setMeterReadings] = useState({
    dewa: '',
    gas: '',
    accessCards: '',
    parkingSticker: '',
  });

  const [acknowledged, setAcknowledged] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const allChecked = checklist.every(item => item.checked);

  const toggleItem = (key: string) => {
    setChecklist(prev =>
      prev.map(item => (item.key === key ? { ...item, checked: !item.checked } : item))
    );
  };

  const handleSubmit = () => {
    if (!allChecked || !acknowledged) return;
    setSubmitting(true);
    // Simulate submission — in production this would call PATCH /api/leases/:id/key-handover
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 800);
  };

  if (!currentUser) {
    return (
      <div className="empty-state">
        <p>You must be logged in to view key handover details.</p>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="tab-content-section tenant-key-handover-tab">
        <div className="tab-header">
          <h3>Key Handover</h3>
        </div>
        <div className="success-message" data-testid="key-handover-success">
          <p>✅ Key handover acknowledged. Welcome to your new home!</p>
          <p>
            Your agent and landlord have been notified. Keep your handover form for your records.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="tab-content-section tenant-key-handover-tab">
      <div className="tab-header">
        <h3>Key Handover Checklist</h3>
        <p>
          Please confirm each item below and record meter readings before signing the digital
          acknowledgement.
        </p>
      </div>

      <div className="checklist-section" data-testid="key-handover-checklist">
        <h4>Move-In Checklist</h4>
        {checklist.map(item => (
          <label
            key={item.key}
            className="checklist-item"
            data-testid={`checklist-item-${item.key}`}
          >
            <input
              type="checkbox"
              checked={item.checked}
              onChange={() => toggleItem(item.key)}
              aria-label={item.label}
            />
            <span className={item.checked ? 'checked-label' : ''}>{item.label}</span>
          </label>
        ))}
      </div>

      <div className="meter-readings-section" data-testid="meter-readings-form">
        <h4>Meter Readings</h4>
        <div className="form-grid">
          <div className="form-field">
            <label htmlFor="dewa-reading">DEWA Meter Reading</label>
            <input
              id="dewa-reading"
              type="text"
              placeholder="e.g. 00123456"
              value={meterReadings.dewa}
              onChange={e => setMeterReadings(prev => ({ ...prev, dewa: e.target.value }))}
              data-testid="dewa-reading-input"
            />
          </div>
          <div className="form-field">
            <label htmlFor="gas-reading">Gas Meter Reading</label>
            <input
              id="gas-reading"
              type="text"
              placeholder="e.g. 00098765 (if applicable)"
              value={meterReadings.gas}
              onChange={e => setMeterReadings(prev => ({ ...prev, gas: e.target.value }))}
              data-testid="gas-reading-input"
            />
          </div>
          <div className="form-field">
            <label htmlFor="access-cards">Access Card Number(s)</label>
            <input
              id="access-cards"
              type="text"
              placeholder="e.g. AC-001, AC-002"
              value={meterReadings.accessCards}
              onChange={e => setMeterReadings(prev => ({ ...prev, accessCards: e.target.value }))}
              data-testid="access-cards-input"
            />
          </div>
          <div className="form-field">
            <label htmlFor="parking-sticker">Parking Sticker / Card Number</label>
            <input
              id="parking-sticker"
              type="text"
              placeholder="e.g. P-4521"
              value={meterReadings.parkingSticker}
              onChange={e =>
                setMeterReadings(prev => ({ ...prev, parkingSticker: e.target.value }))
              }
              data-testid="parking-sticker-input"
            />
          </div>
        </div>
      </div>

      <div className="acknowledgement-section" data-testid="acknowledgement-section">
        <label className="checklist-item" data-testid="acknowledgement-checkbox-label">
          <input
            type="checkbox"
            checked={acknowledged}
            onChange={() => setAcknowledged(prev => !prev)}
            data-testid="acknowledgement-checkbox"
            aria-label="I confirm I have received all items listed above"
          />
          <span>
            I, <strong>{currentUser.name}</strong>, confirm that I have received all keys, access
            cards, and property documents listed above. I acknowledge the property condition at
            handover.
          </span>
        </label>
      </div>

      <div className="form-actions">
        <button
          type="button"
          className="btn-primary"
          disabled={!allChecked || !acknowledged || submitting}
          onClick={handleSubmit}
          data-testid="submit-handover-btn"
        >
          {submitting ? 'Submitting…' : 'Sign & Submit Key Handover'}
        </button>
        {!allChecked && (
          <p className="validation-hint" data-testid="checklist-incomplete-hint">
            Please complete all checklist items before signing.
          </p>
        )}
      </div>
    </div>
  );
};

export default TenantKeyHandoverTab;
