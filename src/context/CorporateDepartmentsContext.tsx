import React, { createContext, useContext, ReactNode } from 'react';
import type { CorporateDepartmentsContextType } from './CorporateDepartmentsContext.types';
import { useCorporateDepartmentsState, INITIAL_FORM } from './CorporateDepartmentsContext.logic';
import {
  FALLBACK_12_DEPARTMENTS,
  buildFixed12Slots,
  getDepartmentSubItems,
  getUnassignedSquadPool,
} from '../components/crm/DepartmentManager/DepartmentManager.data';

export * from './CorporateDepartmentsContext.types';
export { useCorporateDepartmentsState } from './CorporateDepartmentsContext.logic';

const CorporateDepartmentsContext = createContext<CorporateDepartmentsContextType | undefined>(
  undefined
);

export const CorporateDepartmentsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const value = useCorporateDepartmentsState();
  return (
    <CorporateDepartmentsContext.Provider value={value}>
      {children}
    </CorporateDepartmentsContext.Provider>
  );
};

const DEFAULT_VALUE: CorporateDepartmentsContextType = {
  slots: buildFixed12Slots(FALLBACK_12_DEPARTMENTS),
  departments: FALLBACK_12_DEPARTMENTS,
  selectedSlotIndex: 0,
  activeDepartment: FALLBACK_12_DEPARTMENTS[0],
  activeSubDepts: getDepartmentSubItems('canonical-luxury_sales'),
  unassignedPool: getUnassignedSquadPool(),
  loading: false,
  error: null,
  searchTerm: '',
  setSearchTerm: () => {},
  isFormOpen: false,
  editingNodeId: null,
  formData: INITIAL_FORM,
  isSubmitting: false,
  selectedDeptForModal: null,
  draggedSlotIndex: null,
  dragOverSlotIndex: null,
  draggedSubIndex: null,
  dragOverSubIndex: null,
  selectSlot: () => {},
  handleSlotDragStart: () => {},
  handleSlotDragOver: () => {},
  handleSlotDragLeave: () => {},
  handleSlotDrop: () => {},
  handleSlotDragEnd: () => {},
  handleDemoteDepartment: () => {},
  handleAssignPoolItemToSlot: () => {},
  handleSubDragStart: () => {},
  handleSubDragOver: () => {},
  handleSubDragLeave: () => {},
  handleSubDrop: () => {},
  handleSubDragEnd: () => {},
  handleDemoteSubDept: () => {},
  handleAssignPoolItemToSubSlot: () => {},
  handleDropOnPool: () => {},
  handleOpenCreate: () => {},
  handleOpenEdit: () => {},
  handleCloseForm: () => {},
  handleFormChange: () => {},
  handleSubmitForm: async () => {},
  handleOpenSubItemsModal: () => {},
  handleCloseSubItemsModal: () => {},
};

export function useCorporateDepartments(): CorporateDepartmentsContextType {
  const context = useContext(CorporateDepartmentsContext);
  return context || DEFAULT_VALUE;
}
