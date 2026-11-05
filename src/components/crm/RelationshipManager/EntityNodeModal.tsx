/**
 * White Caves Real Estate LLC - Entity Node Modal Component
 * Standard: AEGIS Canonical 7-Category Architecture Standard (Modal)
 * Single Purpose File Law: < 350 lines
 */

import React, { FC } from 'react';
import { X, ExternalLink } from 'lucide-react';
import { EntityNode } from './RelationshipManager.types';

interface EntityNodeModalProps {
  node: EntityNode | null;
  onClose: () => void;
  onJumpToRoute?: (route: string) => void;
}

export const EntityNodeModal: FC<EntityNodeModalProps> = ({ node, onClose, onJumpToRoute }) => {
  if (!node) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0,0,0,0.75)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '20px',
      }}
      data-testid="entity-node-modal"
    >
      <div
        style={{
          width: '100%',
          maxWidth: '600px',
          backgroundColor: '#070D18',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: '16px',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span
              style={{
                fontSize: '0.72rem',
                fontWeight: 800,
                color: node.color,
                background: `${node.color}20`,
                padding: '2px 8px',
                borderRadius: '4px',
              }}
            >
              {node.type}
            </span>
            <h3
              style={{ margin: '6px 0 0 0', fontSize: '1.2rem', fontWeight: 800, color: '#FFFFFF' }}
            >
              {node.name}
            </h3>
          </div>
          <button
            onClick={onClose}
            data-testid="close-node-modal"
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

        <p style={{ margin: 0, fontSize: '0.85rem', color: '#94A3B8' }}>{node.description}</p>

        <div
          style={{
            background: 'rgba(0,0,0,0.3)',
            padding: '14px',
            borderRadius: '8px',
            border: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <div
            style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 800, marginBottom: '8px' }}
          >
            ENTITY METADATA
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            {Object.entries(node.details).map(([k, v]) => (
              <div key={k}>
                <span style={{ fontSize: '0.7rem', color: '#94A3B8', textTransform: 'capitalize' }}>
                  {k}:{' '}
                </span>
                <strong style={{ fontSize: '0.8rem', color: '#FFFFFF' }}>{String(v)}</strong>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
          {node.deepRoute && (
            <button
              onClick={() => onJumpToRoute?.(node.deepRoute!)}
              data-testid="jump-to-route-btn"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 16px',
                borderRadius: '8px',
                background: 'rgba(16, 185, 129, 0.2)',
                border: '1px solid #10B981',
                color: '#34D399',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              <ExternalLink size={14} />
              <span>Navigate to {node.deepRoute}</span>
            </button>
          )}

          <button
            onClick={onClose}
            style={{
              padding: '8px 18px',
              borderRadius: '8px',
              background: 'rgba(255,255,255,0.1)',
              border: 'none',
              color: '#FFFFFF',
              fontWeight: 700,
              fontSize: '0.8rem',
              cursor: 'pointer',
              marginLeft: 'auto',
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
