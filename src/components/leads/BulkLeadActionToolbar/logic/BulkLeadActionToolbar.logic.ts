/** BulkLeadActionToolbar.logic.ts */
import { useState, useCallback } from 'react';

export function useBulkLeadActionToolbarLogic(selectedCount: number) {
  const [confirmAction, setConfirmAction] = useState<string | null>(null);

  const handleAssign = useCallback(() => setConfirmAction('assign'), []);
  const handleTag = useCallback(() => setConfirmAction('tag'), []);
  const handleExport = useCallback(() => {
    alert(`Exporting ${selectedCount} leads as CSV…`);
  }, [selectedCount]);
  const handleDelete = useCallback(() => setConfirmAction('delete'), []);
  const handleConfirm = useCallback(() => {
    setConfirmAction(null);
  }, []);
  const handleCancel = useCallback(() => setConfirmAction(null), []);

  return { confirmAction, handleAssign, handleTag, handleExport, handleDelete, handleConfirm, handleCancel };
}
