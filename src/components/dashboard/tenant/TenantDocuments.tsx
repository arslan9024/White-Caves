import React from 'react';
import * as S from '../shared';

export const TenantDocuments: React.FC = () => {
  // Documents are typically stored as lease attachments / metadata
  const documents = [
    { id: '1', name: 'Lease Agreement', type: 'pdf', date: new Date().toISOString(), icon: '📄' },
    {
      id: '2',
      name: 'Move-in Inspection Report',
      type: 'pdf',
      date: new Date().toISOString(),
      icon: '📋',
    },
    { id: '3', name: 'Ejari Certificate', type: 'pdf', date: new Date().toISOString(), icon: '📜' },
  ];

  return (
    <div style={S.tabContainer}>
      <div style={S.pageHeader}>
        <h2 style={S.headerTitle}>📁 Documents</h2>
        <p style={S.headerSubtitle}>Important tenancy documents and certificates</p>
      </div>

      <div style={S.listGrid}>
        {documents.map(doc => (
          <div key={doc.id} style={S.card}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ fontSize: '2rem' }}>{doc.icon}</span>
              <div>
                <h4 style={{ margin: 0 }}>{doc.name}</h4>
                <p style={{ ...S.headerSubtitle, margin: '0.15rem 0 0 0' }}>
                  {doc.type.toUpperCase()} — {S.formatDate(doc.date)}
                </p>
              </div>
            </div>
            <div style={{ marginTop: '0.75rem' }}>
              <button style={S.btnSecondary}>📥 Download</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

