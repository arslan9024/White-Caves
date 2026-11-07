/**
 * DepartmentManager.types.ts
 * Type definitions for Corporate Department CRUD Management (Fixed 12-Slot Architecture)
 */

export interface DepartmentNodeItem {
  _id: string;
  code: string;
  slug: string;
  title: string;
  titleAr?: string;
  level: 'DEPARTMENT' | 'SUB_DEPARTMENT';
  order: number;
  parentDeptId?: string | null;
  directorOrManagerId?: {
    _id?: string;
    fullName: string;
    role: string;
  } | null;
  description?: string;
  color?: string;
  icon?: string;
  subDeptsCount?: number;
  squadsCount?: number;
  headcount?: number;
}

export interface DepartmentFormData {
  title: string;
  titleAr?: string;
  code: string;
  slug: string;
  color: string;
  icon: string;
  description: string;
  directorName?: string;
  directorRole?: string;
}

export interface SubDepartmentFormData {
  parentDeptId: string;
  title: string;
  code: string;
  slug: string;
}
