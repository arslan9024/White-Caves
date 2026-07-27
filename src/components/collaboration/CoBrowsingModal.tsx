import React, { FC } from 'react';
import { AnnotationLayer } from './AnnotationLayer';
import { useCoBrowsing, DrawingTool } from '../../hooks/useCoBrowsing';
import { X, MousePointer, Edit2, Square, MapPin, Trash2, Users } from 'lucide-react';

interface CoBrowsingModalProps {
  isOpen: boolean;
  onClose: () => void;
  propertyTitle?: string;
  floorPlanUrl?: string;
  sessionId?: string;
}

export const CoBrowsingModal: FC<CoBrowsingModalProps> = ({
  isOpen,
  onClose,
  propertyTitle = 'DAMAC Hills 2 Villa - Master Suite Floorplan',
  floorPlanUrl = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
  sessionId = 'session-101',
}) => {
  const {
    participants,
    annotations,
    activeTool,
    setActiveTool,
    strokeColor,
    setStrokeColor,
    strokeWidth,
    broadcastCursor,
    addAnnotation,
    clearAnnotations,
  } = useCoBrowsing({ sessionId });

  if (!isOpen) return null;

  const tools: { id: DrawingTool; label: string; icon: React.ReactNode }[] = [
    { id: 'select', label: 'Pointer', icon: <MousePointer size={16} /> },
    { id: 'pen', label: 'Freehand', icon: <Edit2 size={16} /> },
    { id: 'rectangle', label: 'Area Box', icon: <Square size={16} /> },
    { id: 'pin', label: 'Callout Pin', icon: <MapPin size={16} /> },
  ];

  const colors = [
    { id: '#EF4444', label: 'White Caves Red' },
    { id: '#1E293B', label: 'Deep Slate' },
    { id: '#D97706', label: 'Metallic Amber' },
  ];

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.8)',
        backdropFilter: 'blur(8px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '1100px',
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
          border: '1px solid #E2E8F0',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '16px 24px',
            backgroundColor: '#FFFFFF',
            borderBottom: '1px solid #E2E8F0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#1E293B', margin: 0 }}>
              {propertyTitle}
            </h2>
            <p style={{ fontSize: '0.875rem', color: '#64748B', margin: '2px 0 0 0' }}>
              Real-time Multi-Agent Co-Browsing Canvas
            </p>
          </div>

          {/* Active Participants Badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: '#F1F5F9',
                padding: '6px 14px',
                borderRadius: '20px',
                fontSize: '0.875rem',
                fontWeight: 600,
                color: '#1E293B',
              }}
            >
              <Users size={16} color="#EF4444" />
              <span>{participants.length || 1} Active Connected</span>
            </div>

            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#64748B',
                padding: '4px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <X size={22} />
            </button>
          </div>
        </div>

        {/* Toolbar */}
        <div
          style={{
            padding: '12px 24px',
            backgroundColor: '#F8FAFC',
            borderBottom: '1px solid #E2E8F0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            flexWrap: 'wrap',
          }}
        >
          {/* Tool Selection */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {tools.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTool(t.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 14px',
                  borderRadius: '8px',
                  border: '1px solid',
                  borderColor: activeTool === t.id ? '#EF4444' : '#CBD5E1',
                  backgroundColor: activeTool === t.id ? '#EF4444' : '#FFFFFF',
                  color: activeTool === t.id ? '#FFFFFF' : '#1E293B',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {t.icon}
                <span>{t.label}</span>
              </button>
            ))}
          </div>

          {/* Color Selector & Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {colors.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setStrokeColor(c.id)}
                  title={c.label}
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    backgroundColor: c.id,
                    border: strokeColor === c.id ? '2px solid #1E293B' : '2px solid transparent',
                    cursor: 'pointer',
                    transform: strokeColor === c.id ? 'scale(1.15)' : 'scale(1)',
                    transition: 'all 0.15s ease',
                  }}
                />
              ))}
            </div>

            <button
              onClick={clearAnnotations}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                borderRadius: '8px',
                border: '1px solid #FECACA',
                backgroundColor: '#FEF2F2',
                color: '#EF4444',
                fontSize: '0.875rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              <Trash2 size={16} />
              <span>Clear Drawings</span>
            </button>
          </div>
        </div>

        {/* Viewport & Canvas Area */}
        <div style={{ padding: '24px', backgroundColor: '#0F172A' }}>
          <AnnotationLayer
            participants={participants}
            annotations={annotations}
            activeTool={activeTool}
            strokeColor={strokeColor}
            strokeWidth={strokeWidth}
            onMouseMove={broadcastCursor}
            onAddAnnotation={addAnnotation}
            onClearAnnotations={clearAnnotations}
            height="560px"
          >
            <img
              src={floorPlanUrl}
              alt="Floor plan"
              style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.85 }}
            />
          </AnnotationLayer>
        </div>
      </div>
    </div>
  );
};

export default CoBrowsingModal;
