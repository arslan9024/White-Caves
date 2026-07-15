import React, { useState } from 'react';
import { motion, useAnimation, PanInfo } from 'framer-motion';
import styled from 'styled-components';
import { Lead } from './types';
import { colors, spacing, borderRadius, typography } from '@/design-tokens';

const CardContainer = styled.div`
  position: relative;
  width: 100%;
  margin-bottom: ${spacing[3]};
  border-radius: ${borderRadius.md};
  overflow: hidden;
  background: ${colors.background.surface};
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  touch-action: pan-y;
`;

const BackgroundActions = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 ${spacing[4]};
  background: ${colors.neutral[200]};
  z-index: 0;
`;

const CallAction = styled.div`
  color: ${colors.primary[700]};
  font-weight: bold;
  ${typography.presets.bodySmall};
`;

const SnoozeAction = styled.div`
  color: ${colors.error[700]};
  font-weight: bold;
  ${typography.presets.bodySmall};
`;

const ForegroundCard = styled(motion.div)`
  position: relative;
  background: ${colors.background.default};
  padding: ${spacing[4]};
  z-index: 1;
  border-radius: ${borderRadius.md};
  display: flex;
  flex-direction: column;
  gap: ${spacing[2]};
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

const LeadName = styled.h4`
  ${typography.presets.heading4};
  margin: 0;
  color: ${colors.text.primary};
`;

const LeadDetails = styled.div`
  ${typography.presets.bodySmall};
  color: ${colors.text.secondary};
  display: flex;
  flex-direction: column;
  gap: ${spacing[1]};
`;

const Badges = styled.div`
  display: flex;
  gap: ${spacing[2]};
  margin-top: ${spacing[2]};
`;

const Badge = styled.span<{ $variant: 'new' | 'contacted' | 'high' | 'medium' }>`
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 10px;
  font-weight: bold;
  text-transform: uppercase;
  background: ${({ $variant }) =>
    $variant === 'new'
      ? colors.primary[100]
      : $variant === 'high'
        ? colors.error[100]
        : colors.neutral[100]};
  color: ${({ $variant }) =>
    $variant === 'new'
      ? colors.primary[800]
      : $variant === 'high'
        ? colors.error[800]
        : colors.neutral[800]};
`;

interface MobileLeadCardProps {
  lead: Lead;
  onSnooze: (id: number) => void;
}

const SWIPE_THRESHOLD = 80; // px

export const MobileLeadCard: React.FC<MobileLeadCardProps> = ({ lead, onSnooze }) => {
  const controls = useAnimation();
  const [snoozed, setSnoozed] = useState(false);

  const handleDragEnd = async (e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const offset = info.offset.x;
    const velocity = info.velocity.x;

    // Right swipe: Call
    if (offset > SWIPE_THRESHOLD || velocity > 500) {
      await controls.start({ x: '100%', transition: { duration: 0.2 } });
      window.location.href = `tel:${lead.phone}`;
      // Return card to normal after brief delay
      setTimeout(() => {
        controls.start({ x: 0, transition: { type: 'spring', bounce: 0.2 } });
      }, 500);
    }
    // Left swipe: Snooze
    else if (offset < -SWIPE_THRESHOLD || velocity < -500) {
      await controls.start({ x: '-100%', transition: { duration: 0.2 } });
      if (window.confirm(`Snooze lead ${lead.name} for 7 days?`)) {
        setSnoozed(true);
        onSnooze(lead.id);
      } else {
        controls.start({ x: 0, transition: { type: 'spring', bounce: 0.2 } });
      }
    }
    // Snap back
    else {
      controls.start({ x: 0, transition: { type: 'spring', bounce: 0.3 } });
    }
  };

  if (snoozed) return null;

  return (
    <CardContainer>
      <BackgroundActions>
        <CallAction>Call</CallAction>
        <SnoozeAction>Snooze</SnoozeAction>
      </BackgroundActions>

      <ForegroundCard
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.7}
        onDragEnd={handleDragEnd}
        animate={controls}
      >
        <CardHeader>
          <LeadName>{lead.name}</LeadName>
          <Badge $variant={lead.priority as 'high' | 'medium'}>{lead.priority}</Badge>
        </CardHeader>

        <LeadDetails>
          <span>{lead.interest}</span>
          <span>{lead.phone}</span>
        </LeadDetails>

        <Badges>
          <Badge $variant={lead.status as 'new' | 'contacted'}>{lead.status}</Badge>
        </Badges>
      </ForegroundCard>
    </CardContainer>
  );
};
