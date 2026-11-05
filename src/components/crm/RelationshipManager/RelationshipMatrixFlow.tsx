/**
 * RelationshipMatrixFlow.tsx
 * White Caves Real Estate LLC - Relationships Interactive Node Flow & Metrics View
 * Standard: AEGIS Canonical 7-Category Architecture Standard (View Primitive)
 * Single Purpose File Law: < 350 lines
 */

import React, { FC } from 'react';
import { Search } from 'lucide-react';
import { EntityNodeModal } from './EntityNodeModal';
import type { RelationshipChain, EntityNode } from './RelationshipManager.types';
import { MetricsGrid, MetricCard, NodesFlowContainer } from './RelationshipManager.styles';

export interface RelationshipMatrixFlowProps {
  activeChain: RelationshipChain | null;
  stats: {
    totalEntities: number;
    totalEdges: number;
    totalRevenueAED: number;
    totalMeritXP: number;
  };
  visibleNodes: EntityNode[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedNode: EntityNode | null;
  handleSelectNode: (node: EntityNode) => void;
  handleCloseNodeModal: () => void;
  handleJumpToDeepRoute: (deepRoute: string) => void;
}

export const RelationshipMatrixFlow: FC<RelationshipMatrixFlowProps> = ({
  activeChain,
  stats,
  visibleNodes,
  searchQuery,
  setSearchQuery,
  selectedNode,
  handleSelectNode,
  handleCloseNodeModal,
  handleJumpToDeepRoute,
}) => {
  return (
    <div data-testid="relationship-matrix-flow">
      {/* ── 1. Real-Time Relationship Graph Metrics Deck ─────────────── */}
      <MetricsGrid>
        <MetricCard $accentColor="#10B981">
          <div className="label">Active Relationship Chain</div>
          <div className="value">
            {activeChain?.dealNumber} <span className="sub">Pipeline</span>
          </div>
        </MetricCard>

        <MetricCard $accentColor="#38BDF8">
          <div className="label">Entities in Mesh</div>
          <div className="value">
            {stats.totalEntities} <span className="sub">Nodes</span>
          </div>
        </MetricCard>

        <MetricCard $accentColor="#F59E0B">
          <div className="label">Relational Edges</div>
          <div className="value">
            {stats.totalEdges} <span className="sub">Connections</span>
          </div>
        </MetricCard>

        <MetricCard $accentColor="#C084FC">
          <div className="label">Gross Revenue Booked</div>
          <div className="value">
            AED {stats.totalRevenueAED.toLocaleString()}
            <span className="sub">Escrow</span>
          </div>
        </MetricCard>
      </MetricsGrid>

      {/* ── 2. Chain Narrative Summary Box ──────────────────────────── */}
      {activeChain && (
        <div
          style={{
            padding: '16px 20px',
            background: 'rgba(16, 185, 129, 0.08)',
            border: '1px solid rgba(16, 185, 129, 0.25)',
            borderRadius: '10px',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
          }}
        >
          <div>
            <div
              style={{
                fontSize: '0.75rem',
                fontWeight: 800,
                color: '#34D399',
                textTransform: 'uppercase',
                marginBottom: '4px',
              }}
            >
              {activeChain.name}
            </div>
            <div style={{ fontSize: '0.85rem', color: '#E2E8F0', lineHeight: 1.4 }}>
              {activeChain.summary}
            </div>
          </div>
        </div>
      )}

      {/* ── 3. Search Filter ────────────────────────────────────────── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(0,0,0,0.3)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '8px',
          padding: '8px 14px',
          marginBottom: '20px',
        }}
      >
        <Search size={15} color="#94A3B8" />
        <input
          type="text"
          placeholder="Filter nodes in this relationship matrix..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          data-testid="relationship-search-input"
          style={{
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: '#FFFFFF',
            fontSize: '0.85rem',
            width: '100%',
          }}
        />
      </div>

      {/* ── 4. Sequential Graph Nodes Visual Flow ───────────────────── */}
      <NodesFlowContainer>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '16px',
          }}
        >
          {visibleNodes.map((node, idx) => (
            <div
              key={node.id}
              data-testid={`entity-node-${node.id}`}
              style={{
                background: 'rgba(15, 23, 42, 0.75)',
                border: `1px solid ${node.color}50`,
                borderRadius: '12px',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                position: 'relative',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span
                  style={{
                    fontSize: '0.68rem',
                    fontWeight: 800,
                    padding: '2px 8px',
                    borderRadius: '4px',
                    background: `${node.color}25`,
                    color: node.color,
                    border: `1px solid ${node.color}60`,
                  }}
                >
                  {node.type}
                </span>

                <span style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 800 }}>
                  Node #{idx + 1} · {node.id}
                </span>
              </div>

              <div>
                <h4
                  style={{
                    margin: '0 0 4px 0',
                    fontSize: '0.95rem',
                    fontWeight: 800,
                    color: '#FFFFFF',
                  }}
                >
                  {node.name}
                </h4>
                <p style={{ margin: 0, fontSize: '0.78rem', color: '#94A3B8' }}>
                  {node.description}
                </p>
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderTop: '1px solid rgba(255,255,255,0.06)',
                  paddingTop: '10px',
                  marginTop: 'auto',
                }}
              >
                <span style={{ fontSize: '0.72rem', color: '#CBD5E1', fontWeight: 600 }}>
                  {node.badge}
                </span>

                <button
                  onClick={() => handleSelectNode(node)}
                  data-testid={`inspect-node-${node.id}`}
                  style={{
                    padding: '4px 12px',
                    borderRadius: '6px',
                    background: 'rgba(255,255,255,0.08)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    color: '#FFFFFF',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Inspect Node
                </button>
              </div>
            </div>
          ))}
        </div>
      </NodesFlowContainer>

      {/* ── 5. Detail Modal for Inspected Entity ────────────────────── */}
      <EntityNodeModal
        node={selectedNode}
        onClose={handleCloseNodeModal}
        onJumpToRoute={handleJumpToDeepRoute}
      />
    </div>
  );
};
