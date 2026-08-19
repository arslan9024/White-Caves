/** LeadNotificationToast.tsx — View Layer */
import React, { FC } from 'react';
import { X, Volume2, VolumeX } from 'lucide-react';
import { useLeadNotificationToastLogic } from './logic/LeadNotificationToast.logic';
import { Container, Toast, ToastIcon, ToastBody, ToastTitle, ToastText, ToastTime, CloseBtn, SoundToggle } from './styles/LeadNotificationToast.style';

export const LeadNotificationToast: FC = () => {
  const { toasts, soundEnabled, toggleSound, dismiss, TYPE_ICONS } = useLeadNotificationToastLogic();
  return (
    <Container data-testid="lead-notification-toast">
      <SoundToggle $on={soundEnabled} onClick={toggleSound}>
        {soundEnabled ? <Volume2 size={12} /> : <VolumeX size={12} />}
        {soundEnabled ? 'Sound On' : 'Sound Off'}
      </SoundToggle>
      {toasts.map((t) => (
        <Toast key={t.id} $type={t.type}>
          <ToastIcon>{TYPE_ICONS[t.type]}</ToastIcon>
          <ToastBody>
            <ToastTitle>{t.title}</ToastTitle>
            <ToastText>{t.body}</ToastText>
            <ToastTime>{t.timestamp}</ToastTime>
          </ToastBody>
          <CloseBtn onClick={() => dismiss(t.id)} aria-label="Dismiss"><X size={14} /></CloseBtn>
        </Toast>
      ))}
    </Container>
  );
};
export default LeadNotificationToast;
