// Interfaces
// ---------------------------------------------------------------------------

export interface Department {
  id: string;
  label: string;
  color: string;
  gradient: string;
  icon: string;
}

export type DepartmentId =
  | 'communications'
  | 'operations'
  | 'sales'
  | 'finance'
  | 'marketing'
  | 'executive'
  | 'compliance'
  | 'technology'
  | 'legal'
  | 'intelligence'
  | 'customer_experience'
  | 'data_and_ai';

export type AssistantId =
  | 'nadia'
  | 'nina'
  | 'mary'
  | 'nancy'
  | 'daisy'
  | 'clara'
  | 'sophia'
  | 'theodora'
  | 'olivia'
  | 'zoe'
  | 'laila'
  | 'aurora'
  | 'hazel'
  | 'willow'
  | 'evangeline'
  | 'sentinel'
  | 'hunter'
  | 'henry'
  | 'cipher'
  | 'atlas'
  | 'vesta'
  | 'juno'
  | 'kairos'
  | 'maven'
  | 'linda'
  | 'archer'
  | 'prism'
  | 'sage'
  | 'echo'
  | 'mira'
  | 'rex'
  | 'iris'
  | 'apex'
  | 'halo'
  | 'oracle'
  | 'flux'
  | 'nova'
  | 'quill'
  | 'lumen'
  | 'crest';

export type DataAccessLevel = 'full' | 'departmental';

export interface AssistantPermissions {
  viewableBy: string[];
  accessibleBy: string[];
  dataAccessLevel: DataAccessLevel;
}

export interface AssistantDataFlows {
  outputs: string[];
  inputs: string[];
}

export interface Assistant {
  id: AssistantId;
  name: string;
  title: string;
  department: DepartmentId;
  icon: string;
  color: string;
  avatar: string;
  description: string;
  capabilities: string[];
  permissions: AssistantPermissions;
  apiEndpoints: string[];
  dataFlows: AssistantDataFlows;
}

export interface NavigationItem extends Department {
  assistants: Assistant[];
}
