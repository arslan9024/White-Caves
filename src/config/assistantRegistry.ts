// ============================================================================
// AI Assistant Registry - TypeScript Facade
// AEGIS V4.1 Single Purpose File Law: Decomposed into modular < 350-line datasets
// ============================================================================

export type {
  Department,
  DepartmentId,
  AssistantId,
  DataAccessLevel,
  AssistantPermissions,
  AssistantDataFlows,
  Assistant,
  NavigationItem,
} from './assistantRegistryData/types';

export { DEPARTMENTS } from './assistantRegistryData/departments.data';
export { AI_ASSISTANTS } from './assistantRegistryData/assistants';

export {
  getAssistantById,
  getAssistantsByDepartment,
  getAllAssistants,
  getAllDepartments,
  getDepartmentById,
  getAssistantCount,
  getDepartmentCount,
  ASSISTANT_IDS,
  DEPARTMENT_IDS,
  getDepartmentOrder,
  getNavigationStructure,
  getDataFlowsForAssistant,
} from './assistantRegistryData/accessors';

import { DEPARTMENTS } from './assistantRegistryData/departments.data';
import { AI_ASSISTANTS } from './assistantRegistryData/assistants';
import {
  getAssistantById,
  getAssistantsByDepartment,
  getAllAssistants,
  getAllDepartments,
  getDepartmentById,
  getAssistantCount,
  getDepartmentCount,
  ASSISTANT_IDS,
  DEPARTMENT_IDS,
  getDepartmentOrder,
  getNavigationStructure,
  getDataFlowsForAssistant,
} from './assistantRegistryData/accessors';

export default {
  AI_ASSISTANTS,
  DEPARTMENTS,
  getAssistantById,
  getAssistantsByDepartment,
  getAllAssistants,
  getAllDepartments,
  getDepartmentById,
  getAssistantCount,
  getDepartmentCount,
  getDepartmentOrder,
  getNavigationStructure,
  getDataFlowsForAssistant,
  ASSISTANT_IDS,
  DEPARTMENT_IDS,
};
