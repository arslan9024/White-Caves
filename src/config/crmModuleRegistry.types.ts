import { type ComponentType, type LazyExoticComponent } from 'react';

export type CRMZone =
  | 'executive'
  | 'sales_leads'
  | 'inventory_listings'
  | 'leasing_contracts'
  | 'finance_compliance'
  | 'ai_command';

export interface CRMModuleDefinition {
  id: string;
  label: string;
  icon: string;
  description: string;
  color: string;
  zone: CRMZone;
  Component: LazyExoticComponent<ComponentType<any>>;
  roles?: string[];
  section?: string;
}
