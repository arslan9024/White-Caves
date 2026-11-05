/**
 * White Caves Real Estate LLC - Deal Edit/Create Drawer Component
 * Standard: AEGIS Canonical 7-Category Architecture Standard (Drawer)
 * Single Purpose File Law: < 350 lines
 */

import React, { FC, useState, useEffect } from 'react';
import { X, Handshake, Save } from 'lucide-react';
import { DealItem, DealType, DealStatus } from './DealManager.types';

interface DealEditDrawerProps {
  isOpen: boolean;
  deal: DealItem | null;
  onClose: () => void;
  onSave: (dealData: Partial<DealItem>) => void;
}

export const DealEditDrawer: FC<DealEditDrawerProps> = ({ isOpen, deal, onClose, onSave }) => {
  const [title, setTitle] = useState('');
  const [dealType, setDealType] = useState<DealType>('LEASING');
  const [status, setStatus] = useState<DealStatus>('INQUIRY');
  const [valueAED, setValueAED] = useState(180000);
  const [propertyId, setPropertyId] = useState('REP-001');
  const [clientName, setClientName] = useState('');
  const [clientRole, setClientRole] = useState<'tenant' | 'buyer'>('tenant');
  const [agentName, setAgentName] = useState('Arslan Malik');

  useEffect(() => {
    if (deal) {
      setTitle(deal.title);
      setDealType(deal.dealType);
      setStatus(deal.status);
      setValueAED(deal.valueAED);
      setPropertyId(deal.propertyId);
      setClientName(deal.clientName);
      setClientRole(deal.clientRole as any);
      setAgentName(deal.agentName);
    } else {
      setTitle('');
      setDealType('LEASING');
      setStatus('INQUIRY');
      setValueAED(180000);
      setPropertyId('REP-001');
      setClientName('');
      setClientRole('tenant');
      setAgentName('Arslan Malik');
    }
  }, [deal, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: deal?.id,
      _id: deal?._id,
      title,
      dealType,
      status,
      valueAED: Number(valueAED),
      propertyId,
      clientName,
      clientRole,
      agentName,
    });
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        backgroundColor: 'rgba(0,0,0,0.6)',
        backdropFilter: 'blur(4px)',
        zIndex: 1100,
        display: 'flex',
        justifyContent: 'flex-end',
      }}
      data-testid="deal-edit-drawer"
    >
      <div
        style={{
          width: '100%',
          maxWidth: '460px',
          height: '100%',
          backgroundColor: '#070D18',
          borderLeft: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '-10px 0 30px rgba(0,0,0,0.5)',
        }}
      >
        {/* Drawer Header */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Handshake size={18} color="#C084FC" />
            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#FFFFFF' }}>
              {deal ? 'Edit Deal Pipeline Record' : 'Register New Real Estate Deal'}
            </h3>
          </div>
          <button
            onClick={onClose}
            data-testid="close-drawer-btn"
            style={{
              background: 'transparent',
              border: 'none',
              color: '#94A3B8',
              cursor: 'pointer',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form
          onSubmit={handleSubmit}
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          <div>
            <label
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                color: '#94A3B8',
                display: 'block',
                marginBottom: '6px',
              }}
            >
              Deal Dossier Title
            </label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. DAMAC Hills 2 Prestige Villa Lease"
              data-testid="deal-title-input"
              required
              style={{
                width: '100%',
                padding: '8px 12px',
                background: '#0F172A',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '6px',
                color: '#FFFFFF',
                fontSize: '0.85rem',
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: '#94A3B8',
                  display: 'block',
                  marginBottom: '6px',
                }}
              >
                Deal Type
              </label>
              <select
                value={dealType}
                onChange={e => {
                  const val = e.target.value as DealType;
                  setDealType(val);
                  setClientRole(val === 'SALES' ? 'buyer' : 'tenant');
                }}
                data-testid="deal-type-select"
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  background: '#0F172A',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '6px',
                  color: '#FFFFFF',
                  fontSize: '0.85rem',
                }}
              >
                <option value="LEASING">LEASING (Rental)</option>
                <option value="SALES">SALES (Acquisition)</option>
              </select>
            </div>

            <div>
              <label
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: '#94A3B8',
                  display: 'block',
                  marginBottom: '6px',
                }}
              >
                Initial Status
              </label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value as DealStatus)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  background: '#0F172A',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '6px',
                  color: '#FFFFFF',
                  fontSize: '0.85rem',
                }}
              >
                <option value="INQUIRY">INQUIRY</option>
                <option value="VIEWING">VIEWING</option>
                <option value="OFFER">OFFER</option>
                <option value="CONTRACT">CONTRACT</option>
                <option value="EJARI_DLD">EJARI / DLD</option>
                <option value="COMPLETED">COMPLETED</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: '#94A3B8',
                  display: 'block',
                  marginBottom: '6px',
                }}
              >
                Value (AED)
              </label>
              <input
                type="number"
                value={valueAED}
                onChange={e => setValueAED(Number(e.target.value))}
                data-testid="deal-value-input"
                required
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  background: '#0F172A',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '6px',
                  color: '#FFFFFF',
                  fontSize: '0.85rem',
                }}
              />
            </div>

            <div>
              <label
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: '#94A3B8',
                  display: 'block',
                  marginBottom: '6px',
                }}
              >
                Inventory Unit ID
              </label>
              <input
                type="text"
                value={propertyId}
                onChange={e => setPropertyId(e.target.value)}
                placeholder="REP-001"
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  background: '#0F172A',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '6px',
                  color: '#FFFFFF',
                  fontSize: '0.85rem',
                }}
              />
            </div>
          </div>

          <div>
            <label
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                color: '#94A3B8',
                display: 'block',
                marginBottom: '6px',
              }}
            >
              Client Full Name ({clientRole.toUpperCase()})
            </label>
            <input
              type="text"
              value={clientName}
              onChange={e => setClientName(e.target.value)}
              placeholder="e.g. Hassan Al-Nuaimi"
              data-testid="deal-client-input"
              required
              style={{
                width: '100%',
                padding: '8px 12px',
                background: '#0F172A',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '6px',
                color: '#FFFFFF',
                fontSize: '0.85rem',
              }}
            />
          </div>

          <div>
            <label
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                color: '#94A3B8',
                display: 'block',
                marginBottom: '6px',
              }}
            >
              Lead Agent / Executive
            </label>
            <input
              type="text"
              value={agentName}
              onChange={e => setAgentName(e.target.value)}
              placeholder="Arslan Malik"
              data-testid="deal-agent-input"
              required
              style={{
                width: '100%',
                padding: '8px 12px',
                background: '#0F172A',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '6px',
                color: '#FFFFFF',
                fontSize: '0.85rem',
              }}
            />
          </div>

          <div style={{ marginTop: 'auto', paddingTop: '16px', display: 'flex', gap: '12px' }}>
            <button
              type="submit"
              data-testid="save-deal-btn"
              style={{
                flex: 1,
                padding: '10px',
                borderRadius: '8px',
                background: '#EF4444',
                color: '#FFFFFF',
                border: 'none',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
              }}
            >
              <Save size={16} />
              Save Deal
            </button>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '10px 16px',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.08)',
                color: '#94A3B8',
                border: 'none',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
