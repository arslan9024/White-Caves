/**
 * White Caves Real Estate LLC - Customer Registration Drawer Component
 * Standard: AEGIS Canonical 7-Category Architecture Standard (Drawer)
 * Single Purpose File Law: < 350 lines
 */

import React, { FC, useState, CSSProperties } from 'react';
import { X, UserPlus } from 'lucide-react';
import { CustomerItem, CustomerType } from './CustomerManager.types';

const lbl: CSSProperties = {
  fontSize: '0.72rem',
  fontWeight: 800,
  color: '#94A3B8',
  textTransform: 'uppercase',
};
const inp: CSSProperties = {
  width: '100%',
  marginTop: '6px',
  padding: '10px 14px',
  background: '#0F172A',
  border: '1px solid rgba(255, 255, 255, 0.15)',
  borderRadius: '8px',
  color: '#FFFFFF',
  fontSize: '0.85rem',
};

interface CustomerRegistrationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (customer: Omit<CustomerItem, 'id' | 'createdAt' | 'interactions'>) => void;
}

export const CustomerRegistrationDrawer: FC<CustomerRegistrationDrawerProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [fullName, setFullName] = useState('');
  const [customerCode, setCustomerCode] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [customerType, setCustomerType] = useState<CustomerType>('LEAD');
  const [preferredCommunity, setPreferredCommunity] = useState('DAMAC Hills 2');
  const [budgetAED, setBudgetAED] = useState<number>(150000);
  const [assignedAgentName, setAssignedAgentName] = useState('Arslan Malik');
  const [source, setSource] = useState('PROPERTY_FINDER');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim()) return;

    onSubmit({
      customerCode: customerCode.trim() || `CUST-AUTO-${Math.floor(Math.random() * 900 + 100)}`,
      fullName: fullName.trim(),
      email: email.trim(),
      phone: phone.trim() || '+971 50 000 0000',
      customerType,
      currentStep: 1,
      stepName: 'LEAD_CAPTURE',
      assignedAgentId: 'EMP-001',
      assignedAgentName,
      preferredCommunity,
      budgetAED: Number(budgetAED) || 100000,
      kycVerified: false,
      source,
    });
    setFullName('');
    setCustomerCode('');
    setEmail('');
    setPhone('');
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        justifyContent: 'flex-end',
        zIndex: 1000,
      }}
      data-testid="customer-registration-drawer"
    >
      <div
        style={{
          width: '100%',
          maxWidth: '480px',
          height: '100%',
          backgroundColor: '#070D18',
          borderLeft: '1px solid rgba(255, 255, 255, 0.12)',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '-10px 0 30px rgba(0, 0, 0, 0.5)',
          overflowY: 'auto',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '20px 24px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <UserPlus size={18} color="#34D399" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
              Onboard Client / Lead
            </h3>
          </div>
          <button
            onClick={onClose}
            data-testid="close-customer-drawer"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: 'none',
              color: '#94A3B8',
              padding: '6px',
              borderRadius: '8px',
              cursor: 'pointer',
            }}
          >
            <X size={18} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          style={{
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            flex: 1,
          }}
        >
          <div>
            <label style={lbl}>Full Legal Name *</label>
            <input
              type="text"
              required
              data-testid="customer-name-input"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              placeholder="e.g. Fatima Al-Mansoor"
              style={inp}
            />
          </div>

          <div>
            <label style={lbl}>Client ID Code</label>
            <input
              type="text"
              data-testid="customer-code-input"
              value={customerCode}
              onChange={e => setCustomerCode(e.target.value)}
              placeholder="Leave blank for auto-code"
              style={inp}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={lbl}>Email *</label>
              <input
                type="email"
                required
                data-testid="customer-email-input"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="client@whitecaves.ae"
                style={inp}
              />
            </div>
            <div>
              <label style={lbl}>Phone Number</label>
              <input
                type="text"
                data-testid="customer-phone-input"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="+971 50 123 4567"
                style={inp}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={lbl}>Customer Type</label>
              <select
                value={customerType}
                onChange={e => setCustomerType(e.target.value as CustomerType)}
                style={inp}
              >
                <option value="LEAD">LEAD</option>
                <option value="BUYER">BUYER</option>
                <option value="TENANT">TENANT</option>
                <option value="LANDLORD">LANDLORD</option>
                <option value="INVESTOR">INVESTOR</option>
              </select>
            </div>
            <div>
              <label style={lbl}>Lead Source</label>
              <select value={source} onChange={e => setSource(e.target.value)} style={inp}>
                <option value="PROPERTY_FINDER">Property Finder</option>
                <option value="BAYUT">Bayut / Dubizzle</option>
                <option value="DIRECT_REFERRAL">Direct Referral</option>
                <option value="WHATSAPP_CAMPAIGN">WhatsApp Campaign</option>
                <option value="WEBSITE_ORGANIC">Website Organic</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={lbl}>Preferred Community</label>
              <input
                type="text"
                value={preferredCommunity}
                onChange={e => setPreferredCommunity(e.target.value)}
                style={inp}
              />
            </div>
            <div>
              <label style={lbl}>Budget (AED)</label>
              <input
                type="number"
                value={budgetAED}
                onChange={e => setBudgetAED(Number(e.target.value))}
                style={inp}
              />
            </div>
          </div>

          <div>
            <label style={lbl}>Assigned Consultant</label>
            <input
              type="text"
              value={assignedAgentName}
              onChange={e => setAssignedAgentName(e.target.value)}
              style={inp}
            />
          </div>

          <div
            style={{
              marginTop: 'auto',
              paddingTop: '20px',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
            <button
              type="submit"
              data-testid="submit-customer-btn"
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #10B981, #059669)',
                border: 'none',
                color: '#FFFFFF',
                fontWeight: 700,
                fontSize: '0.9rem',
                cursor: 'pointer',
              }}
            >
              Confirm Client Onboarding
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
