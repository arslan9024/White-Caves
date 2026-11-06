/**
 * White Caves Real Estate LLC - Entity & Relationship Management View
 * Standard: AEGIS Canonical 7-Category Architecture Standard (View)
 * Single Purpose File Law: < 350 lines
 */

import React, { FC, useState, useEffect } from 'react';
import { Network, Database, Layers, GitFork } from 'lucide-react';
import { useRelationshipManager, UseRelationshipManagerProps } from './RelationshipManager.logic';
import { RelationshipEntitiesHub } from './RelationshipEntitiesHub';
import { RelationshipErdVisualizer } from './RelationshipErdVisualizer';
import { RelationshipMatrixFlow } from './RelationshipMatrixFlow';
import { RelationshipSingleLinkView } from './RelationshipSingleLinkView';
import type { RelationshipTab } from './RelationshipManager.types';
import { RelationshipContainer, RelationshipHeader } from './RelationshipManager.styles';

export const RelationshipManagerView: FC<UseRelationshipManagerProps> = props => {
  const [activeTab, setActiveTab] = useState<RelationshipTab>(props.initialTab || 'relationships');

  useEffect(() => {
    if (props.initialTab) {
      setActiveTab(props.initialTab);
    }
  }, [props.initialTab]);
  const {
    chains,
    activeChain,
    activeChainId,
    setActiveChainId,
    visibleNodes,
    stats,
    searchQuery,
    setSearchQuery,
    selectedNode,
    handleSelectNode,
    handleCloseNodeModal,
    handleJumpToDeepRoute,
  } = useRelationshipManager(props);

  return (
    <RelationshipContainer data-testid="relationship-manager-view">
      {/* ── 1. Top Executive Header ─────────────────────────────────── */}
      <RelationshipHeader>
        <div className="title-group">
          <h1>
            <Network size={24} color="#10B981" />
            Entities & Relational Matrix Hub
          </h1>
          <p>
            Deterministic graph linking Users, Employees, Roles, Properties, Clients, Tasks,
            Documents, Closed Deals, and Revenue.
          </p>
        </div>

        {activeTab === 'relationships' && (
          <div className="chain-switcher">
            {chains.map(chain => (
              <button
                key={chain.id}
                onClick={() => setActiveChainId(chain.id)}
                data-testid={`switch-chain-${chain.id}`}
                style={{
                  padding: '6px 14px',
                  borderRadius: '8px',
                  border: `1px solid ${activeChainId === chain.id ? '#10B981' : 'rgba(255, 255, 255, 0.1)'}`,
                  background:
                    activeChainId === chain.id
                      ? 'rgba(16, 185, 129, 0.2)'
                      : 'rgba(255, 255, 255, 0.04)',
                  color: activeChainId === chain.id ? '#34D399' : '#94A3B8',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                }}
              >
                {chain.id}
              </button>
            ))}
          </div>
        )}
      </RelationshipHeader>

      {/* ── 2. Primary 3-Way Mode Switcher ─────────────────────────── */}
      <div
        data-testid="relationship-tabs"
        style={{
          display: 'flex',
          gap: '10px',
          paddingBottom: '16px',
          marginBottom: '20px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        <button
          type="button"
          onClick={() => setActiveTab('entities')}
          data-testid="tab-entities-hub"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '9px 18px',
            borderRadius: '9px',
            fontSize: '0.84rem',
            fontWeight: 800,
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            border:
              activeTab === 'entities' ? '1px solid #10B981' : '1px solid rgba(255, 255, 255, 0.1)',
            background:
              activeTab === 'entities' ? 'rgba(16, 185, 129, 0.18)' : 'rgba(255, 255, 255, 0.03)',
            color: activeTab === 'entities' ? '#34D399' : '#94A3B8',
          }}
        >
          <Database size={15} /> 📑 Entities Hub (CRUD)
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('relationships')}
          data-testid="tab-relationships-matrix"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '9px 18px',
            borderRadius: '9px',
            fontSize: '0.84rem',
            fontWeight: 800,
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            border:
              activeTab === 'relationships'
                ? '1px solid #38BDF8'
                : '1px solid rgba(255, 255, 255, 0.1)',
            background:
              activeTab === 'relationships'
                ? 'rgba(56, 189, 248, 0.18)'
                : 'rgba(255, 255, 255, 0.03)',
            color: activeTab === 'relationships' ? '#38BDF8' : '#94A3B8',
          }}
        >
          <GitFork size={15} /> 🔗 Relationships Matrix
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('erd')}
          data-testid="tab-uml-erd"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '9px 18px',
            borderRadius: '9px',
            fontSize: '0.84rem',
            fontWeight: 800,
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            border:
              activeTab === 'erd' ? '1px solid #A855F7' : '1px solid rgba(255, 255, 255, 0.1)',
            background:
              activeTab === 'erd' ? 'rgba(168, 85, 247, 0.18)' : 'rgba(255, 255, 255, 0.03)',
            color: activeTab === 'erd' ? '#C084FC' : '#94A3B8',
          }}
        >
          <Layers size={15} /> 📐 UML ERD Visualizer
        </button>
      </div>

      {/* ── 3. Tab Body Viewports ───────────────────────────────────── */}
      {props.selectedRelationshipId ? (
        <RelationshipSingleLinkView
          relationshipId={props.selectedRelationshipId}
          onBack={() => {
            props.onSelectRelationship?.('');
            props.onNavigateToDeepRoute?.('/dashboard/erms/relationships');
          }}
          onNavigateToEntity={() => {
            setActiveTab('entities');
            props.onNavigateToDeepRoute?.('/dashboard/erms/entities');
          }}
        />
      ) : (
        <>
          {activeTab === 'entities' && (
            <RelationshipEntitiesHub
              selectedEntityId={props.selectedEntityId}
              onSelectEntity={props.onSelectEntity}
              onNavigateBack={() => {
                props.onSelectEntity?.('');
                props.onNavigateToDeepRoute?.('/dashboard/erms/entities');
              }}
            />
          )}

          {activeTab === 'erd' && <RelationshipErdVisualizer />}

          {activeTab === 'relationships' && (
            <RelationshipMatrixFlow
              activeChain={activeChain}
              stats={stats}
              visibleNodes={visibleNodes}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedNode={selectedNode}
              handleSelectNode={handleSelectNode}
              handleCloseNodeModal={handleCloseNodeModal}
              handleJumpToDeepRoute={handleJumpToDeepRoute}
            />
          )}
        </>
      )}
    </RelationshipContainer>
  );
};

export default RelationshipManagerView;
