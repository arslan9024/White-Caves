import type {
  DepartmentNodeItem,
  DepartmentFormData,
} from '../components/crm/DepartmentManager/DepartmentManager.types';
import type { SupervisorDef } from '../data/assistants108Registry.data';
import type { DepartmentSlotDef } from '../components/crm/DepartmentManager/DepartmentManager.data';

export interface DragPayload {
  type: 'dept-slot' | 'pool-item' | 'sub-slot';
  slotIndex?: number;
  subIndex?: number;
  poolItemId?: string;
}

export interface CorporateDepartmentsContextType {
  slots: DepartmentSlotDef[];
  departments: DepartmentNodeItem[];
  selectedSlotIndex: number;
  activeDepartment: DepartmentNodeItem | null;
  activeSubDepts: SupervisorDef[];
  unassignedPool: SupervisorDef[];
  loading: boolean;
  error: string | null;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  isFormOpen: boolean;
  editingNodeId: string | null;
  formData: DepartmentFormData;
  isSubmitting: boolean;
  selectedDeptForModal: DepartmentNodeItem | null;
  draggedSlotIndex: number | null;
  dragOverSlotIndex: number | null;
  draggedSubIndex: number | null;
  dragOverSubIndex: number | null;
  selectSlot: (index: number) => void;
  handleInlineRename: (deptId: string, newTitle: string) => void;
  handleResetDefaults: () => void;
  handleSlotDragStart: (e: React.DragEvent, slotIndex: number) => void;
  handleSlotDragOver: (e: React.DragEvent, slotIndex: number) => void;
  handleSlotDragLeave: (e: React.DragEvent, slotIndex: number) => void;
  handleSlotDrop: (e: React.DragEvent, targetSlotIndex: number) => void;
  handleSlotDragEnd: () => void;
  handleDemoteDepartment: (slotIndex: number) => void;
  handleAssignPoolItemToSlot: (poolItemId: string, targetSlotIndex: number) => void;
  handleSubDragStart: (e: React.DragEvent, subIndex: number) => void;
  handleSubDragOver: (e: React.DragEvent, subIndex: number) => void;
  handleSubDragLeave: (e: React.DragEvent, subIndex: number) => void;
  handleSubDrop: (e: React.DragEvent, targetSubIndex: number) => void;
  handleSubDragEnd: () => void;
  handleDemoteSubDept: (subIndex: number) => void;
  handleAssignPoolItemToSubSlot: (poolItemId: string, targetSubIndex: number) => void;
  handleDropOnPool: (e: React.DragEvent) => void;
  handleOpenCreate: () => void;
  handleOpenEdit: (dept: DepartmentNodeItem) => void;
  handleCloseForm: () => void;
  handleFormChange: (field: keyof DepartmentFormData, value: string) => void;
  handleSubmitForm: (e: React.FormEvent) => Promise<void>;
  handleOpenSubItemsModal: (dept: DepartmentNodeItem) => void;
  handleCloseSubItemsModal: () => void;
}
