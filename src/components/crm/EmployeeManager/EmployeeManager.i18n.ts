// FILE: src/components/crm/EmployeeManager/EmployeeManager.i18n.ts
/**
 * White Caves Real Estate LLC - EmployeeManager 4-Language Translation Schemas (Tier 10)
 * Standard: AEGIS Canonical 12-Way Architecture Standard
 * Single Purpose File Law: < 350 lines
 */

export type SupportedLanguage = 'en' | 'ar' | 'es' | 'ru';

export interface EmployeeTranslations {
  dir: 'ltr' | 'rtl';
  workspaceTitle: string;
  workspaceSubtitle: string;
  hireEmployeeBtn: string;
  inspectEmployeeBtn: string;
  searchPlaceholder: string;
  totalPersonnel: string;
  activeBrokers: string;
  licensedRera: string;
  totalMeritXp: string;
}

export const EMPLOYEE_TRANSLATIONS: Record<SupportedLanguage, EmployeeTranslations> = {
  en: {
    dir: 'ltr',
    workspaceTitle: 'Sovereign Personnel & Broker Roster',
    workspaceSubtitle:
      'Corporate HR hierarchy, RERA broker accreditation and merit XP tracking engine',
    hireEmployeeBtn: 'Hire Personnel / Broker',
    inspectEmployeeBtn: 'Inspect Employee Dossier',
    searchPlaceholder: 'Search personnel by name, EMP code, department, or RERA card...',
    totalPersonnel: 'Total Registered Staff',
    activeBrokers: 'Active Licensed Brokers',
    licensedRera: 'RERA Certified Ratio',
    totalMeritXp: 'Aggregated Merit XP',
  },
  ar: {
    dir: 'rtl',
    workspaceTitle: 'سجل الموظفين والوسطاء العقاريين المعتمدين',
    workspaceSubtitle: 'الهيكل الوظيفي المؤسسي، رخص وسطاء ريرا ونظام تتبع نقاط الجدارة والخبرة',
    hireEmployeeBtn: 'تعيين موظف / وسيط',
    inspectEmployeeBtn: 'فحص ملف الموظف',
    searchPlaceholder: 'البحث بالاسم، كود الموظف، القسم، أو بطاقة ريرا...',
    totalPersonnel: 'إجمالي الكادر الوظيفي',
    activeBrokers: 'وسطاء مرخصون نشطون',
    licensedRera: 'نسبة التراخيص المعتمدة',
    totalMeritXp: 'إجمالي نقاط الجدارة (XP)',
  },
  es: {
    dir: 'ltr',
    workspaceTitle: 'Nómina de Personal y Corredores',
    workspaceSubtitle:
      'Jerarquía corporativa de RRHH, acreditación de corredores RERA y seguimiento de mérito XP',
    hireEmployeeBtn: 'Contratar Personal / Corredor',
    inspectEmployeeBtn: 'Inspeccionar Expediente de Empleado',
    searchPlaceholder: 'Buscar personal por nombre, código EMP, departamento o tarjeta RERA...',
    totalPersonnel: 'Personal Total Registrado',
    activeBrokers: 'Corredores Activos',
    licensedRera: 'Certificación RERA',
    totalMeritXp: 'XP Total de Mérito',
  },
  ru: {
    dir: 'ltr',
    workspaceTitle: 'Реестр Персонала и Брокеров',
    workspaceSubtitle:
      'Корпоративная иерархия HR, аккредитация брокеров RERA и система начисления баллов XP',
    hireEmployeeBtn: 'Нанять Сотрудника / Брокера',
    inspectEmployeeBtn: 'Изучить Досье Сотрудника',
    searchPlaceholder: 'Поиск по имени, коду EMP, отделу или карте RERA...',
    totalPersonnel: 'Всего Сотрудников',
    activeBrokers: 'Активные Лицензированные Брокеры',
    licensedRera: 'Доля Сертифицированных RERA',
    totalMeritXp: 'Накопленный Опыт (XP)',
  },
};

export function getEmployeeI18n(lang: SupportedLanguage = 'en'): EmployeeTranslations {
  return EMPLOYEE_TRANSLATIONS[lang] || EMPLOYEE_TRANSLATIONS.en;
}

export default EMPLOYEE_TRANSLATIONS;
