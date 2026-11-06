// FILE: src/components/crm/RoleManager/RoleManager.i18n.ts
/**
 * White Caves Real Estate LLC - Role Manager 4-Language Localization Schemas (Tier 10)
 * Standard: AEGIS Canonical 12-Way Architecture Standard
 * Single Purpose File Law: < 350 lines
 */

export interface RoleManagerTranslations {
  workspaceTitle: string;
  subtitle: string;
  totalRoles: string;
  totalAssigned: string;
  activeLevel: string;
  searchPlaceholder: string;
  allTiers: string;
  tier1: string;
  tier2: string;
  tier3: string;
  simulate: string;
  currentSimulated: string;
  permissions: string;
  dir: 'ltr' | 'rtl';
}

export const ROLE_MANAGER_I18N: Record<string, RoleManagerTranslations> = {
  en: {
    workspaceTitle: 'User Role & Sovereign RBAC Matrix',
    subtitle: '14 Definitive Enterprise Roles, 5 Access Levels, and Multi-Tenant Portal Boundaries',
    totalRoles: 'Total Sovereign Roles',
    totalAssigned: 'Personnel & Clients Assigned',
    activeLevel: 'Current Clearance Level',
    searchPlaceholder: 'Search roles, tiers, and permissions...',
    allTiers: 'All Tiers',
    tier1: 'Tier 1: Internal Corporate',
    tier2: 'Tier 2: Client Portals',
    tier3: 'Tier 3: Strategic Partners',
    simulate: 'Simulate Role',
    currentSimulated: 'Active Role',
    permissions: 'Permissions',
    dir: 'ltr',
  },
  ar: {
    workspaceTitle: 'مصفوفة أدوار المستخدمين وصلاحيات الوصول السيادية',
    subtitle: '١٤ دوراً مؤسسياً، ٥ مستويات وصول، وحدود بوابات متعددة المستأجرين',
    totalRoles: 'إجمالي الأدوار السيادية',
    totalAssigned: 'الموظفون والعملاء المخصصون',
    activeLevel: 'مستوى التصريح النشط',
    searchPlaceholder: 'بحث في الأدوار والمستويات والصلاحيات...',
    allTiers: 'جميع الفئات',
    tier1: 'الفئة ١: الهيكل المؤسسي الداخلي',
    tier2: 'الفئة ٢: بوابات العملاء',
    tier3: 'الفئة ٣: الشركاء الاستراتيجيون',
    simulate: 'محاكاة الدور',
    currentSimulated: 'الدور النشط',
    permissions: 'الصلاحيات',
    dir: 'rtl',
  },
  es: {
    workspaceTitle: 'Matriz de Roles de Usuario y RBAC Soberano',
    subtitle: '14 Roles Empresariales, 5 Niveles de Acceso y Límites de Portales',
    totalRoles: 'Roles Soberanos Totales',
    totalAssigned: 'Personal y Clientes Asignados',
    activeLevel: 'Nivel de Autorización Activo',
    searchPlaceholder: 'Buscar roles, niveles y permisos...',
    allTiers: 'Todos los Niveles',
    tier1: 'Nivel 1: Corporativo Interno',
    tier2: 'Nivel 2: Portales de Clientes',
    tier3: 'Nivel 3: Socios Estratégicos',
    simulate: 'Simular Rol',
    currentSimulated: 'Rol Activo',
    permissions: 'Permisos',
    dir: 'ltr',
  },
  ru: {
    workspaceTitle: 'Матрица Полномочий и Ролей Пользователей (RBAC)',
    subtitle: '14 Корпоративных Ролей, 5 Уровней Доступа и Границы Порталов',
    totalRoles: 'Всего Ролей',
    totalAssigned: 'Назначено Пользователей',
    activeLevel: 'Активный Уровень Доступа',
    searchPlaceholder: 'Поиск ролей, уровней и прав...',
    allTiers: 'Все Уровни',
    tier1: 'Уровень 1: Внутренний Корпоративный',
    tier2: 'Уровень 2: Порталы Клиентов',
    tier3: 'Уровень 3: Стратегические Партнеры',
    simulate: 'Симулировать Роль',
    currentSimulated: 'Активная Роль',
    permissions: 'Полномочия',
    dir: 'ltr',
  },
};
