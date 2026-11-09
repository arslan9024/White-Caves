import { useEffect, useCallback, useState } from 'react';

export interface UseDirtyStateGuardOptions {
  isDirty: boolean;
  onConfirmDiscard?: () => void;
  message?: string;
}

export interface DirtyStateGuardReturn {
  showPrompt: boolean;
  proceed: () => void;
  cancel: () => void;
  confirmExit: (nextAction?: () => void) => void;
}

/**
 * useDirtyStateGuard
 * Standardized dirty-state & unsaved changes hook for White Caves CRM.
 * Protects against accidental browser reloads (beforeunload) and internal drawer/modal navigation discards.
 */
export function useDirtyStateGuard({
  isDirty,
  onConfirmDiscard,
  message = 'You have unsaved changes. Are you sure you want to discard them?',
}: UseDirtyStateGuardOptions): DirtyStateGuardReturn {
  const [showPrompt, setShowPrompt] = useState<boolean>(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  // 1. Browser reload / close tab guard
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!isDirty) return;
      e.preventDefault();
      e.returnValue = message;
      return message;
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty, message]);

  // 2. Intercept internal cancel / close / navigate actions
  const confirmExit = useCallback(
    (nextAction?: () => void) => {
      if (isDirty) {
        if (nextAction) setPendingAction(() => nextAction);
        setShowPrompt(true);
      } else {
        if (nextAction) nextAction();
      }
    },
    [isDirty]
  );

  const proceed = useCallback(() => {
    setShowPrompt(false);
    if (pendingAction) {
      pendingAction();
      setPendingAction(null);
    }
    if (onConfirmDiscard) {
      onConfirmDiscard();
    }
  }, [pendingAction, onConfirmDiscard]);

  const cancel = useCallback(() => {
    setShowPrompt(false);
    setPendingAction(null);
  }, []);

  return {
    showPrompt,
    proceed,
    cancel,
    confirmExit,
  };
}
