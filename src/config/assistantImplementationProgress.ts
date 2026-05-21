export type AssistantImplementationStatus = 'complete' | 'incomplete';

export interface AssistantImplementationProgress {
  id: string;
  status: AssistantImplementationStatus;
  phase: number;
}

export const ASSISTANT_IMPLEMENTATION_PROGRESS: AssistantImplementationProgress[] = [
  { id: 'mary', status: 'complete', phase: 1 },
  { id: 'theodora', status: 'complete', phase: 1 },
  { id: 'olivia', status: 'complete', phase: 1 },
  { id: 'zoe', status: 'complete', phase: 1 },
  { id: 'laila', status: 'complete', phase: 1 },
  { id: 'nadia', status: 'complete', phase: 1 },
  { id: 'sophia', status: 'complete', phase: 1 },
  { id: 'daisy', status: 'complete', phase: 1 },
  { id: 'clara', status: 'complete', phase: 1 },
  { id: 'nina', status: 'complete', phase: 1 },
  { id: 'nancy', status: 'complete', phase: 1 },
  { id: 'aurora', status: 'complete', phase: 1 },
  { id: 'hazel', status: 'complete', phase: 1 },
  { id: 'willow', status: 'complete', phase: 1 },
  { id: 'hunter', status: 'incomplete', phase: 2 },
  { id: 'vesta', status: 'incomplete', phase: 2 },
  { id: 'maven', status: 'incomplete', phase: 2 },
  { id: 'kairos', status: 'incomplete', phase: 2 },
  { id: 'juno', status: 'incomplete', phase: 2 },
  { id: 'henry', status: 'complete', phase: 2 },
  { id: 'cipher', status: 'incomplete', phase: 3 },
  { id: 'sentinel', status: 'incomplete', phase: 3 },
  { id: 'atlas', status: 'incomplete', phase: 3 },
  { id: 'evangeline', status: 'incomplete', phase: 3 },
];

export const ASSISTANT_SEQUENCE_PLAN: string[] = [
  'hunter',
  'vesta',
  'maven',
  'kairos',
  'juno',
  'cipher',
  'sentinel',
  'atlas',
  'evangeline',
];

export const ASSISTANT_PROGRESS_SUMMARY = {
  total: ASSISTANT_IMPLEMENTATION_PROGRESS.length,
  complete: ASSISTANT_IMPLEMENTATION_PROGRESS.filter(item => item.status === 'complete').length,
  incomplete: ASSISTANT_IMPLEMENTATION_PROGRESS.filter(item => item.status === 'incomplete').length,
};
