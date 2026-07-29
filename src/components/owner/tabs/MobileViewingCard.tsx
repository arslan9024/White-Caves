import React, { useState } from 'react';
import { motion, useAnimation, PanInfo, useMotionValue, useTransform } from 'framer-motion';
import styled from 'styled-components';
import { colors, spacing, borderRadius, typography } from '@/design-tokens';

export interface Viewing {
  id: string;
  leadName: string;
  propertyName: string;
  scheduledAt: string;
  status: 'Pending' | 'Confirmed' | 'Cancelled';
}

interface MobileViewingCardProps {
  viewing: Viewing;
  onConfirm: (id: string) => void;
  onReschedule: (id: string) => void;
}

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

const BackgroundActions = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 ${spacing[4]};
  z-index: 0;
`;

const ActionLabel = styled(motion.div)<{ $align: 'left' | 'right'; $color: string }>`
  color: ${({ $color }) => $color};
  font-weight: bold;
  ${typography.presets.bodySmall};
  text-align: ${({ $align }) => $align};
  display: flex;
  align-items: center;
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
  border-left: 4px solid ${({ theme }) => colors.primary[500]};
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

const PropertyName = styled.div`
  ${typography.presets.body};
  font-weight: 500;
  color: ${colors.text.secondary};
`;

const ScheduleText = styled.div`
  ${typography.presets.bodySmall};
  color: ${colors.text.tertiary};
`;

const StatusBadge = styled.span<{ $status: string }>`
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 10px;
  font-weight: bold;
  text-transform: uppercase;
  background: ${({ $status }) =>
    $status === 'Confirmed'
      ? 'rgba(34, 197, 94, 0.1)'
      : $status === 'Cancelled'
        ? 'rgba(239, 68, 68, 0.1)'
        : 'rgba(245, 158, 11, 0.1)'};
  color: ${({ $status }) =>
    $status === 'Confirmed' ? '#22c55e' : $status === 'Cancelled' ? '#ef4444' : '#f59e0b'};
`;

const SWIPE_THRESHOLD = 80; // px

export const MobileViewingCard: React.FC<MobileViewingCardProps> = ({
  viewing,
  onConfirm,
  onReschedule,
}) => {
  const controls = useAnimation();
  const [currentStatus, setCurrentStatus] = useState(viewing.status);

  const x = useMotionValue(0);

  // Visual affordance transforms based on drag 'x' value
  const bgOpacity = useTransform(x, [-100, 0, 100], [1, 0.3, 1]);
  const bgColor = useTransform(
    x,
    [-100, 0, 100],
    ['rgba(245, 158, 11, 0.2)', colors.neutral[200], 'rgba(34, 197, 94, 0.2)']
  );

  const confirmOpacity = useTransform(x, [0, 80], [0, 1]);
  const confirmScale = useTransform(x, [0, 80], [0.8, 1]);

  const rescheduleOpacity = useTransform(x, [0, -80], [0, 1]);
  const rescheduleScale = useTransform(x, [0, -80], [0.8, 1]);

  const triggerHaptic = () => {
    if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate(50); // 50ms vibration feed
    }
  };

  const handleDragEnd = async (e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const offset = info.offset.x;
    const velocity = info.velocity.x;

    // Right swipe: Confirm
    if (offset > SWIPE_THRESHOLD || velocity > 500) {
      triggerHaptic();
      await controls.start({ x: '100%', transition: { duration: 0.2 } });
      onConfirm(viewing.id);
      setCurrentStatus('Confirmed');
      setTimeout(() => {
        controls.start({ x: 0, transition: { type: 'spring', bounce: 0.2 } });
      }, 500);
    }
    // Left swipe: Reschedule
    else if (offset < -SWIPE_THRESHOLD || velocity < -500) {
      triggerHaptic();
      await controls.start({ x: '-100%', transition: { duration: 0.2 } });
      onReschedule(viewing.id);
      setTimeout(() => {
        controls.start({ x: 0, transition: { type: 'spring', bounce: 0.2 } });
      }, 500);
    }
    // Snap back
    else {
      controls.start({ x: 0, transition: { type: 'spring', bounce: 0.3 } });
    }
  };

  return (
    <CardContainer>
      <BackgroundActions style={{ opacity: bgOpacity, background: bgColor }}>
        <ActionLabel
          $align="left"
          $color="#22c55e"
          style={{ opacity: confirmOpacity, scale: confirmScale }}
        >
          Confirm ✓
        </ActionLabel>
        <ActionLabel
          $align="right"
          $color="#f59e0b"
          style={{ opacity: rescheduleOpacity, scale: rescheduleScale }}
        >
          Reschedule ✎
        </ActionLabel>
      </BackgroundActions>

      <ForegroundCard
        style={{ x }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.7}
        onDragEnd={handleDragEnd}
        animate={controls}
      >
        <CardHeader>
          <LeadName>{viewing.leadName}</LeadName>
          <StatusBadge $status={currentStatus}>{currentStatus}</StatusBadge>
        </CardHeader>

        <PropertyName>{viewing.propertyName}</PropertyName>
        <ScheduleText>
          📅{' '}
          {new Date(viewing.scheduledAt).toLocaleString('en-AE', {
            dateStyle: 'medium',
            timeStyle: 'short',
          })}
        </ScheduleText>
      </ForegroundCard>
    </CardContainer>
  );
};
