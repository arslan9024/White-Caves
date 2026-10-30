import React from 'react';
import * as S from '../shared';

export const SystemSettings: React.FC = () => {
  return (
    <div style={S.tabContainer}>
      <div style={S.pageHeader}>
        <h2 style={S.headerTitle}>⚙️ System Settings</h2>
        <p style={S.headerSubtitle}>Platform configuration and preferences</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1rem' }}>
        <div style={S.card}>
          <h3 style={S.cardTitle}>🏢 Organization</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary, #6b7280)', marginBottom: '0.25rem' }}>Company Name</label>
              <input defaultValue="White Caves Real Estate LLC" style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--color-e5e7eb, #e5e7eb)', fontSize: '0.9rem' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary, #6b7280)', marginBottom: '0.25rem' }}>Support Email</label>
              <input defaultValue="support@whitecaves.ae" style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--color-e5e7eb, #e5e7eb)', fontSize: '0.9rem' }} />
            </div>
          </div>
        </div>

        <div style={S.card}>
          <h3 style={S.cardTitle}>💬 WhatsApp Config</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary, #6b7280)', marginBottom: '0.25rem' }}>Meta Business ID</label>
              <input defaultValue="••••••••••" type="password" style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--color-e5e7eb, #e5e7eb)', fontSize: '0.9rem' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary, #6b7280)', marginBottom: '0.25rem' }}>Phone Number ID</label>
              <input defaultValue="••••••••••" type="password" style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--color-e5e7eb, #e5e7eb)', fontSize: '0.9rem' }} />
            </div>
          </div>
        </div>

        <div style={S.card}>
          <h3 style={S.cardTitle}>🗄️ Database</h3>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary, #6b7280)', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <span>Provider: MongoDB Atlas</span>
            <span>ORM: Prisma 6.6</span>
            <span>Connection: ••••••••••</span>
          </div>
          <button style={{ ...S.btnSecondary, marginTop: '0.75rem' }}>Test Connection</button>
        </div>

        <div style={S.card}>
          <h3 style={S.cardTitle}>🔐 Security</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input type="checkbox" defaultChecked />
              <span style={{ fontSize: '0.9rem' }}>Enforce RBAC on all API routes</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input type="checkbox" defaultChecked />
              <span style={{ fontSize: '0.9rem' }}>Firebase Auth required</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input type="checkbox" />
              <span style={{ fontSize: '0.9rem' }}>Two-factor authentication</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

