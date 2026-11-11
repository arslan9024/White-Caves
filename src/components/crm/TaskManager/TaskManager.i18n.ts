// FILE: src/components/crm/TaskManager/TaskManager.i18n.ts
/**
 * White Caves Real Estate LLC - TaskManager 4-Language Translation Schemas (Tier 10)
 * Standard: AEGIS Canonical 12-Way Architecture Standard
 * Single Purpose File Law: < 350 lines
 */

export type SupportedLanguage = 'en' | 'ar' | 'es' | 'ru';

export interface TaskTranslations {
  dir: 'ltr' | 'rtl';
  workspaceTitle: string;
  workspaceSubtitle: string;
  createTaskBtn: string;
  inspectTaskBtn: string;
  searchPlaceholder: string;
  totalTasks: string;
  completedTasks: string;
  slaBreachRate: string;
  totalMeritXp: string;
}

export const TASK_TRANSLATIONS: Record<SupportedLanguage, TaskTranslations> = {
  en: {
    dir: 'ltr',
    workspaceTitle: 'Statutory Operations & RUP Tasks Engine',
    workspaceSubtitle:
      '600+ departmental operational procedures, DLD compliance and escalation automation',
    createTaskBtn: 'Dispatch New Task',
    inspectTaskBtn: 'Inspect Task Dossier',
    searchPlaceholder: 'Search tasks by title, code, pillar, or role...',
    totalTasks: 'Total Tasks Ledger',
    completedTasks: 'Completed & Certified',
    slaBreachRate: 'SLA Escalation Margin',
    totalMeritXp: 'Earnable Merit XP',
  },
  ar: {
    dir: 'rtl',
    workspaceTitle: 'محرك المهام والعمليات القانونية (RUP)',
    workspaceSubtitle:
      'أكثر من 600 إجراء تشغيلي للأقسام، وامتثال دائرة الأراضي والأملاك ونظام التصعيد',
    createTaskBtn: 'إسناد مهمة جديدة',
    inspectTaskBtn: 'فحص ملف المهمة',
    searchPlaceholder: 'البحث عن المهام بالعنوان، الكود، الركيزة، أو المسمى الوظيفي...',
    totalTasks: 'إجمالي دفتر المهام',
    completedTasks: 'المهام المنجزة والمعتمدة',
    slaBreachRate: 'هامش الالتزام باتفاقية الخدمة',
    totalMeritXp: 'نقاط الجدارة المستحقة (XP)',
  },
  es: {
    dir: 'ltr',
    workspaceTitle: 'Motor de Operaciones Estatutarias y Tareas RUP',
    workspaceSubtitle:
      'Más de 600 procedimientos departamentales, cumplimiento DLD y automatización de escalamiento',
    createTaskBtn: 'Despachar Nueva Tarea',
    inspectTaskBtn: 'Inspeccionar Expediente de Tarea',
    searchPlaceholder: 'Buscar tareas por título, código, pilar o rol...',
    totalTasks: 'Total de Tareas',
    completedTasks: 'Completadas y Certificadas',
    slaBreachRate: 'Margen de Escalamiento SLA',
    totalMeritXp: 'XP de Mérito Ganable',
  },
  ru: {
    dir: 'ltr',
    workspaceTitle: 'Движок Уставных Операций и Задач RUP',
    workspaceSubtitle: '600+ регламентов департаментов, соответствие нормам DLD и эскалация',
    createTaskBtn: 'Назначить Новую Задачу',
    inspectTaskBtn: 'Изучить Досье Задачи',
    searchPlaceholder: 'Поиск задач по названию, коду, направлению или роли...',
    totalTasks: 'Всего Задач в Реестре',
    completedTasks: 'Завершено и Верифицировано',
    slaBreachRate: 'Соблюдение Сроков (SLA)',
    totalMeritXp: 'Доступный Опыт (XP)',
  },
};

export function getTaskI18n(lang: SupportedLanguage = 'en'): TaskTranslations {
  return TASK_TRANSLATIONS[lang] || TASK_TRANSLATIONS.en;
}

export default TASK_TRANSLATIONS;
