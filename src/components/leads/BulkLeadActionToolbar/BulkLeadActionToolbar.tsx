/** BulkLeadActionToolbar.tsx — View Layer */
import React, { FC } from 'react';
import { UserPlus, Tag, Download, Trash2 } from 'lucide-react';
import { useBulkLeadActionToolbarLogic } from './logic/BulkLeadActionToolbar.logic';
import { ToolbarRoot, Count, ActionBtn, Divider } from './styles/BulkLeadActionToolbar.style';

interface Props { selectedCount: number; onClearSelection: () => void; }

export const BulkLeadActionToolbar: FC<Props> = ({ selectedCount, onClearSelection }) => {
  const { handleAssign, handleTag, handleExport, handleDelete } = useBulkLeadActionToolbarLogic(selectedCount);
  if (selectedCount === 0) return null;
  return (
    <ToolbarRoot data-testid="bulk-lead-toolbar">
      <Count>{selectedCount}</Count>
      <span style={{ fontSize: '0.875rem' }}>leads selected</span>
      <Divider />
      <ActionBtn onClick={handleAssign}><UserPlus size={14} /> Assign</ActionBtn>
      <ActionBtn onClick={handleTag}><Tag size={14} /> Tag</ActionBtn>
      <ActionBtn onClick={handleExport}><Download size={14} /> Export</ActionBtn>
      <ActionBtn $variant="danger" onClick={handleDelete}><Trash2 size={14} /> Delete</ActionBtn>
      <Divider />
      <ActionBtn onClick={onClearSelection}>✕ Clear</ActionBtn>
    </ToolbarRoot>
  );
};
export default BulkLeadActionToolbar;
