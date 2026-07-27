/**
 * FloatingActionButton — Wave 23 (W23-009)
 *
 * Context-aware FAB for mobile CRM:
 *  - On Leads page: "Add Lead"
 *  - On Properties page: "Add Property"
 *  - On Viewings page: "Book Viewing"
 *  - Default: expandable menu with all options
 *
 * 56px diameter, gold accent, safe-area aware.
 * Only visible on mobile (≤ 768px).
 *
 * @agent @Una + @Tracy
 */

import React, { useState, useCallback } from 'react';
import { Plus, UserPlus, Home, Calendar, X } from 'lucide-react';

export type FABContext = 'leads' | 'properties' | 'viewings' | 'default';

interface FloatingActionButtonProps {
  context?: FABContext;
  onAddLead?: () => void;
  onAddProperty?: () => void;
  onBookViewing?: () => void;
}

interface FABAction {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  color: string;
}

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  context = 'default',
  onAddLead,
  onAddProperty,
  onBookViewing,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handlePrimaryClick = useCallback(() => {
    switch (context) {
      case 'leads':
        onAddLead?.();
        break;
      case 'properties':
        onAddProperty?.();
        break;
      case 'viewings':
        onBookViewing?.();
        break;
      default:
        setIsExpanded((prev) => !prev);
    }
  }, [context, onAddLead, onAddProperty, onBookViewing]);

  const actions: FABAction[] = [
    {
      label: 'Add Lead',
      icon: <UserPlus size={20} />,
      onClick: () => { onAddLead?.(); setIsExpanded(false); },
      color: '#22C55E',
    },
    {
      label: 'Add Property',
      icon: <Home size={20} />,
      onClick: () => { onAddProperty?.(); setIsExpanded(false); },
      color: '#3B82F6',
    },
    {
      label: 'Book Viewing',
      icon: <Calendar size={20} />,
      onClick: () => { onBookViewing?.(); setIsExpanded(false); },
      color: '#8B5CF6',
    },
  ];

  const contextIcons: Record<FABContext, React.ReactNode> = {
    leads: <UserPlus size={24} />,
    properties: <Home size={24} />,
    viewings: <Calendar size={24} />,
    default: isExpanded ? <X size={24} /> : <Plus size={24} />,
  };

  const contextLabels: Record<FABContext, string> = {
    leads: 'Add Lead',
    properties: 'Add Property',
    viewings: 'Book Viewing',
    default: isExpanded ? 'Close menu' : 'Quick actions',
  };

  return (
    <>
      {/* Backdrop when expanded */}
      {isExpanded && (
        <div
          onClick={() => setIsExpanded(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.3)',
            zIndex: 998,
          }}
          aria-hidden="true"
        />
      )}

      <div
        style={{
          position: 'fixed',
          right: 20,
          bottom: `calc(72px + env(safe-area-inset-bottom, 0px))`,
          zIndex: 999,
          display: 'flex',
          flexDirection: 'column-reverse',
          alignItems: 'center',
          gap: 12,
        }}
        className="fab-container"
      >
        {/* Primary FAB button */}
        <button
          onClick={handlePrimaryClick}
          aria-label={contextLabels[context]}
          style={{
            width: 56,
            height: 56,
            borderRadius: '50%',
            border: 'none',
            background: 'linear-gradient(135deg, #C9A84C 0%, #A08838 100%)',
            color: '#0a0a0f',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 20px rgba(201,168,76,0.4)',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            transform: isExpanded ? 'rotate(45deg)' : 'rotate(0)',
          }}
        >
          {contextIcons[context]}
        </button>

        {/* Expandable actions (only in default context) */}
        {context === 'default' && isExpanded && (
          <>
            {actions.map((action, i) => (
              <div
                key={action.label}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  animation: `fabSlideIn 0.2s ease ${i * 0.05}s both`,
                }}
              >
                <span
                  style={{
                    background: '#1a1a2e',
                    color: '#f5f5f0',
                    padding: '6px 12px',
                    borderRadius: 8,
                    fontSize: 13,
                    fontWeight: 500,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {action.label}
                </span>
                <button
                  onClick={action.onClick}
                  aria-label={action.label}
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: '50%',
                    border: 'none',
                    background: action.color,
                    color: '#fff',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 12px rgba(0,0,0,0.3)',
                  }}
                >
                  {action.icon}
                </button>
              </div>
            ))}
          </>
        )}
      </div>

      {/* FAB animation styles — injected once */}
      <style>{`
        @keyframes fabSlideIn {
          from { opacity: 0; transform: translateY(10px) scale(0.8); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @media (min-width: 769px) {
          .fab-container { display: none !important; }
        }
        @media (prefers-reduced-motion: reduce) {
          .fab-container * { animation: none !important; transition: none !important; }
        }
      `}</style>
    </>
  );
};

export default FloatingActionButton;
