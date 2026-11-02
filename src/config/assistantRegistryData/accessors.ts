import type {
  Assistant,
  AssistantId,
  Department,
  DepartmentId,
  NavigationItem,
  AssistantDataFlows,
} from './types';
import { DEPARTMENTS } from './departments.data';
import { AI_ASSISTANTS } from './assistants';

export const getAssistantById = (id: AssistantId): Assistant | null =>
  // eslint-disable-next-line security/detect-object-injection
  AI_ASSISTANTS[id] || null;

export const getAssistantsByDepartment = (departmentId: DepartmentId): Assistant[] => {
  return Object.values(AI_ASSISTANTS).filter(assistant => assistant.department === departmentId);
};

export const getAllAssistants = (): Assistant[] => Object.values(AI_ASSISTANTS);

export const getAllDepartments = (): Department[] => Object.values(DEPARTMENTS);

export const getDepartmentById = (id: DepartmentId): Department | null =>
  // eslint-disable-next-line security/detect-object-injection
  DEPARTMENTS[id] || null;

export const getAssistantCount = (): number => Object.keys(AI_ASSISTANTS).length;

export const getDepartmentCount = (): number => Object.keys(DEPARTMENTS).length;

export const ASSISTANT_IDS: AssistantId[] = Object.keys(AI_ASSISTANTS) as AssistantId[];

export const DEPARTMENT_IDS: DepartmentId[] = Object.keys(DEPARTMENTS) as DepartmentId[];

export const getDepartmentOrder = (): DepartmentId[] => [
  'communications',
  'operations',
  'sales',
  'finance',
  'marketing',
  'executive',
  'compliance',
  'legal',
  'technology',
  'intelligence',
  'customer_experience',
  'data_and_ai',
];

export const getNavigationStructure = (): NavigationItem[] => {
  const order = getDepartmentOrder();
  return order.map(deptId => ({
    // eslint-disable-next-line security/detect-object-injection
    ...DEPARTMENTS[deptId],
    assistants: getAssistantsByDepartment(deptId),
  }));
};

export const getDataFlowsForAssistant = (assistantId: AssistantId): AssistantDataFlows => {
  // eslint-disable-next-line security/detect-object-injection
  const assistant = AI_ASSISTANTS[assistantId];
  if (!assistant?.dataFlows) return { inputs: [], outputs: [] };
  return {
    inputs: assistant.dataFlows.inputs || [],
    outputs: assistant.dataFlows.outputs || [],
  };
};
