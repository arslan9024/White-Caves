/**
 * MobileCRMCommandBar (P0-009)
 * Fixed bottom toolbar for mobile field agents — 8 one-tap CRM actions.
 * Visible only on viewports < 768px (md breakpoint).
 */
import React from 'react';
import {
  Phone,
  Calendar,
  MessageCircle,
  RefreshCw,
  UserCheck,
  FileText,
  Home,
  ShieldCheck,
} from 'lucide-react';

export type CRMCommandAction =
  | { type: 'log_call' }
  | { type: 'schedule_viewing'; leadId: string }
  | { type: 'whatsapp'; phone: string }
  | { type: 'update_status' }
  | { type: 'assign_lead' }
  | { type: 'add_note' }
  | { type: 'view_property'; propertyId: string }
  | { type: 'request_kyc'; leadId: string };

export interface MobileCRMCommandBarProps {
  leadId?: string;
  leadPhone?: string;
  propertyId?: string;
  agentId?: string;
  onAction: (action: CRMCommandAction) => void;
  className?: string;
}

interface ActionConfig {
  id: string;
  label: string;
  icon: React.ReactNode;
  ariaLabel: string;
  isDisabled: (props: MobileCRMCommandBarProps) => boolean;
  buildAction: (props: MobileCRMCommandBarProps) => CRMCommandAction;
}

const ACTIONS: ActionConfig[] = [
  {
    id: 'log_call',
    label: 'Log Call',
    icon: <Phone size={20} />,
    ariaLabel: 'Log call for lead',
    isDisabled: () => false,
    buildAction: () => ({ type: 'log_call' }),
  },
  {
    id: 'schedule_viewing',
    label: 'Schedule',
    icon: <Calendar size={20} />,
    ariaLabel: 'Schedule viewing',
    isDisabled: p => !p.leadId,
    buildAction: p => ({ type: 'schedule_viewing', leadId: p.leadId! }),
  },
  {
    id: 'whatsapp',
    label: 'WhatsApp',
    icon: <MessageCircle size={20} />,
    ariaLabel: 'Send WhatsApp message',
    isDisabled: p => !p.leadPhone,
    buildAction: p => ({ type: 'whatsapp', phone: p.leadPhone! }),
  },
  {
    id: 'update_status',
    label: 'Status',
    icon: <RefreshCw size={20} />,
    ariaLabel: 'Update lead status',
    isDisabled: () => false,
    buildAction: () => ({ type: 'update_status' }),
  },
  {
    id: 'assign_lead',
    label: 'Assign',
    icon: <UserCheck size={20} />,
    ariaLabel: 'Assign lead to agent',
    isDisabled: () => false,
    buildAction: () => ({ type: 'assign_lead' }),
  },
  {
    id: 'add_note',
    label: 'Add Note',
    icon: <FileText size={20} />,
    ariaLabel: 'Add note to lead',
    isDisabled: () => false,
    buildAction: () => ({ type: 'add_note' }),
  },
  {
    id: 'view_property',
    label: 'Property',
    icon: <Home size={20} />,
    ariaLabel: 'View property details',
    isDisabled: p => !p.propertyId,
    buildAction: p => ({ type: 'view_property', propertyId: p.propertyId! }),
  },
  {
    id: 'request_kyc',
    label: 'KYC Docs',
    icon: <ShieldCheck size={20} />,
    ariaLabel: 'Request KYC documents',
    isDisabled: p => !p.leadId,
    buildAction: p => ({ type: 'request_kyc', leadId: p.leadId! }),
  },
];

export default function MobileCRMCommandBar(props: MobileCRMCommandBarProps) {
  const { onAction, className = '' } = props;

  return (
    <div
      role="toolbar"
      aria-label="CRM quick actions"
      className={`md:hidden fixed bottom-0 left-0 right-0 z-50 ${className}`}
      style={{
        background: '#0A0A0A',
        borderTop: '1px solid rgba(212,175,55,0.4)',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}
    >
      <div
        style={{
          display: 'flex',
          overflowX: 'auto',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          padding: '8px 4px',
          gap: '4px',
        }}
      >
        {ACTIONS.map(action => {
          const disabled = action.isDisabled(props);
          return (
            <button
              key={action.id}
              aria-label={action.ariaLabel}
              disabled={disabled}
              onClick={() => {
                if (!disabled) onAction(action.buildAction(props));
              }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px',
                minWidth: '60px',
                minHeight: '60px',
                padding: '8px',
                flexShrink: 0,
                background: 'transparent',
                border: 'none',
                borderRadius: '10px',
                color: disabled ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.8)',
                cursor: disabled ? 'not-allowed' : 'pointer',
                transition: 'background 0.15s',
                WebkitTapHighlightColor: 'rgba(212,175,55,0.2)',
              }}
              onMouseDown={e => {
                if (!disabled)
                  (e.currentTarget as HTMLButtonElement).style.background = 'rgba(212,175,55,0.15)';
              }}
              onMouseUp={e => {
                (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
              }}
              onTouchStart={e => {
                if (!disabled)
                  (e.currentTarget as HTMLButtonElement).style.background = 'rgba(212,175,55,0.15)';
              }}
              onTouchEnd={e => {
                (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
              }}
            >
              {action.icon}
              <span style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.02em' }}>
                {action.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
