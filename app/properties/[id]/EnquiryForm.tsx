'use client';

/**
 * EnquiryForm.tsx — Client Component (Next.js 15 App Router)
 *
 * Interactive property enquiry form. `use client` because it has
 * controlled input state and form submission.
 *
 * Posts to POST /api/leads — the App Router route handler.
 */

import React, { useState } from 'react';

interface EnquiryFormProps {
  propertyId: string;
  propertyTitle?: string;
}

type SubmitState = 'idle' | 'loading' | 'success' | 'error';

export default function EnquiryForm({ propertyId, propertyTitle }: EnquiryFormProps) {
  const [name,    setName]    = useState('');
  const [email,   setEmail]   = useState('');
  const [phone,   setPhone]   = useState('');
  const [message, setMessage] = useState('');
  const [status,  setStatus]  = useState<SubmitState>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          phone: phone || undefined,
          source: `property_enquiry:${propertyId}`,
          notes: message || undefined,
        }),
      });
      if (res.ok || res.status === 201) {
        setStatus('success');
        setName(''); setEmail(''); setPhone(''); setMessage('');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px 14px',
    minHeight: '44px',
    borderRadius: '8px',
    border: '1px solid var(--text-secondary, #E2E8F0)',
    fontSize: '0.9rem',
    color: 'var(--color-1e293b, #1E293B)',
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
    transition: 'border-color 0.15s ease',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '0.8rem',
    fontWeight: 600,
    color: 'var(--text-secondary, #64748B)',
    marginBottom: '6px',
    textTransform: 'uppercase',
    letterSpacing: '0.4px',
  };

  return (
    <div style={{ background: 'var(--white, #FFFFFF)', borderRadius: '16px', border: '1px solid var(--text-secondary, #E2E8F0)', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)', padding: '24px' }}>
        <div style={{ fontSize: '0.75rem', color: 'var(--accent-red, #EF4444)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>
          🏠 Enquire About This Property
        </div>
        {propertyTitle && (
          <div style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.4 }}>
            {propertyTitle}
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>

        {status === 'success' && (
          <div style={{ padding: '16px', background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '10px', color: '#166534', fontSize: '0.9rem', fontWeight: 600, textAlign: 'center' }}>
            ✓ Enquiry sent! Our agent will contact you shortly.
          </div>
        )}

        {status === 'error' && (
          <div style={{ padding: '16px', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '10px', color: '#991B1B', fontSize: '0.9rem', textAlign: 'center' }}>
            ⚠ Something went wrong. Please try again or call us directly.
          </div>
        )}

        <div>
          <label htmlFor="enq-name" style={labelStyle}>Full Name *</label>
          <input id="enq-name" type="text" required value={name} onChange={e => setName(e.target.value)} placeholder="Your full name" style={inputStyle} />
        </div>

        <div>
          <label htmlFor="enq-email" style={labelStyle}>Email Address *</label>
          <input id="enq-email" type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" style={inputStyle} />
        </div>

        <div>
          <label htmlFor="enq-phone" style={labelStyle}>Phone / WhatsApp</label>
          <input id="enq-phone" type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+971 50 000 0000" style={inputStyle} />
        </div>

        <div>
          <label htmlFor="enq-message" style={labelStyle}>Message</label>
          <textarea
            id="enq-message"
            value={message}
            onChange={e => setMessage(e.target.value)}
            placeholder="I'm interested in this property and would like to schedule a viewing..."
            rows={4}
            style={{ ...inputStyle, resize: 'vertical', minHeight: '90px' }}
          />
        </div>

        <button
          id="enq-submit"
          type="submit"
          disabled={status === 'loading'}
          style={{ padding: '14px', minHeight: '44px', borderRadius: '10px', background: status === 'loading' ? 'var(--color-94a3b8, #94A3B8)' : 'var(--accent-red, #EF4444)', color: 'var(--white, #FFFFFF)', fontWeight: 700, fontSize: '0.95rem', border: 'none', cursor: status === 'loading' ? 'not-allowed' : 'pointer', transition: 'opacity 0.15s ease', letterSpacing: '0.3px' }}
        >
          {status === 'loading' ? 'Sending...' : 'Send Enquiry →'}
        </button>

        <p style={{ margin: 0, textAlign: 'center', fontSize: '0.75rem', color: 'var(--color-94a3b8, #94A3B8)' }}>
          🔒 Your details are 100% confidential · RERA Licensed
        </p>
      </form>
    </div>
  );
}
