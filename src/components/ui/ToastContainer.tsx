/**
 * Toast Container Component
 * =========================
 * Renders all active toasts from the context with proper positioning,
 * animations, and accessibility features.
 */

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useToast, type Toast as ToastType } from '../../context/useToast';
import ToastComponent from './Toast';

const ToastContainerWrapper = styled.div<{ position: string }>`
  position: fixed;
  pointer-events: none;
  z-index: 9999;

  ${props => {
    switch (props.position) {
      case 'top-left':
        return 'top: 20px; left: 20px;';
      case 'top-center':
        return 'top: 20px; left: 50%; transform: translateX(-50%); width: 90%; max-width: 500px;';
      case 'top-right':
        return 'top: 20px; right: 20px;';
      case 'bottom-left':
        return 'bottom: 20px; left: 20px;';
      case 'bottom-center':
        return 'bottom: 20px; left: 50%; transform: translateX(-50%); width: 90%; max-width: 500px;';
      case 'bottom-right':
        return 'bottom: 20px; right: 20px;';
      default:
        return 'top: 20px; right: 20px;';
    }
  }}
`;

const ToastStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  pointer-events: auto;
`;

/**
 * Toast Container Component
 * Manages rendering of all active toasts
 */
export const ToastContainer: React.FC = () => {
  const { toasts, dismiss } = useToast();

  // Group toasts by position
  const positions = [
    'top-left',
    'top-center',
    'top-right',
    'bottom-left',
    'bottom-center',
    'bottom-right',
  ] as const;

  return (
    <>
      {positions.map(position => {
        const toastsAtPosition = toasts.filter(toast => toast.position === position);

        if (toastsAtPosition.length === 0) return null;

        return (
          <ToastContainerWrapper key={position} position={position}>
            <ToastStack>
              {toastsAtPosition.map(toast => (
                <ToastComponent
                  key={toast.id}
                  message={toast.message}
                  type={toast.type}
                  duration={toast.duration}
                  action={toast.action}
                  onClose={() => {
                    dismiss(toast.id);
                    toast.onClose?.();
                  }}
                />
              ))}
            </ToastStack>
          </ToastContainerWrapper>
        );
      })}
    </>
  );
};

export default ToastContainer;
