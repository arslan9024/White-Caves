/**
 * MobilePropertyQuickActions.tsx — View Layer (4-Way Component Architecture)
 * Bottom-sheet quick-action panel for property listings on mobile CRM.
 */

import React, { FC } from 'react';
import {
  MessageCircle,
  Phone,
  Eye,
  Calendar,
  BarChart2,
  Share2,
  Heart,
  FileText,
  Zap,
} from 'lucide-react';
import { useMobilePropertyQuickActionsLogic } from './logic/MobilePropertyQuickActions.logic';
import {
  Overlay,
  Sheet,
  SheetHandle,
  SheetTitle,
  ActionsGrid,
  ActionTile,
  ActionIcon,
  ActionLabel,
  TriggerBtn,
} from './styles/MobilePropertyQuickActions.style';

const ICON_MAP: Record<string, React.ReactNode> = {
  MessageCircle: <MessageCircle size={20} color="#fff" />,
  Phone: <Phone size={20} color="#fff" />,
  Eye: <Eye size={20} color="#fff" />,
  Calendar: <Calendar size={20} color="#fff" />,
  BarChart2: <BarChart2 size={20} color="#fff" />,
  Share2: <Share2 size={20} color="#fff" />,
  Heart: <Heart size={20} color="#fff" />,
  FileText: <FileText size={20} color="#fff" />,
};

export const MobilePropertyQuickActions: FC = () => {
  const { actions, isOpen, handleOpen, handleClose, handleAction } =
    useMobilePropertyQuickActionsLogic();

  return (
    <>
      <TriggerBtn onClick={handleOpen} data-testid="quick-actions-trigger">
        <Zap size={16} />
        Quick Actions
      </TriggerBtn>

      {isOpen && (
        <>
          <Overlay onClick={handleClose} />
          <Sheet data-testid="quick-actions-sheet">
            <SheetHandle />
            <SheetTitle>Property Actions</SheetTitle>
            <ActionsGrid>
              {actions.map(a => (
                <ActionTile
                  key={a.id}
                  $color={a.color}
                  aria-label={a.description}
                  onClick={() => handleAction(a.id)}
                >
                  <ActionIcon $color={a.color}>{ICON_MAP[a.icon]}</ActionIcon>
                  <ActionLabel>{a.label}</ActionLabel>
                </ActionTile>
              ))}
            </ActionsGrid>
          </Sheet>
        </>
      )}
    </>
  );
};

export default MobilePropertyQuickActions;
