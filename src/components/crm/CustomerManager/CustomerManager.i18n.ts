// FILE: src/components/crm/CustomerManager/CustomerManager.i18n.ts
/**
 * White Caves Real Estate LLC - CustomerManager 4-Language Translation Schemas (Tier 10)
 * Standard: AEGIS Canonical 12-Way Architecture Standard
 * Single Purpose File Law: < 350 lines
 */

export type SupportedLanguage = 'en' | 'ar' | 'es' | 'ru';

export interface CustomerTranslations {
  dir: 'ltr' | 'rtl';
  workspaceTitle: string;
  workspaceSubtitle: string;
  registerCustomerBtn: string;
  inspectCustomerBtn: string;
  searchPlaceholder: string;
  totalCustomers: string;
  verifiedKyc: string;
  activeLeads: string;
  conversionRate: string;
}

export const CUSTOMER_TRANSLATIONS: Record<SupportedLanguage, CustomerTranslations> = {
  en: {
    dir: 'ltr',
    workspaceTitle: 'Client & Investor Registry',
    workspaceSubtitle:
      'Omnichannel client relationship governance across 18-step Dubai real estate journey',
    registerCustomerBtn: 'Register New Client',
    inspectCustomerBtn: 'Inspect Client Dossier',
    searchPlaceholder: 'Search clients by name, code, phone, or community...',
    totalCustomers: 'Total Clients Ledger',
    verifiedKyc: 'KYC Verified Clients',
    activeLeads: 'Active In-Progress Deals',
    conversionRate: 'Pipeline Conversion',
  },
  ar: {
    dir: 'rtl',
    workspaceTitle: 'سجل العملاء والمستثمرين',
    workspaceSubtitle: 'حوكمة علاقات العملاء عبر مسار المراحل الـ 18 في سوق عقارات دبي',
    registerCustomerBtn: 'تسجيل عميل جديد',
    inspectCustomerBtn: 'فحص ملف العميل',
    searchPlaceholder: 'البحث عن العملاء بالاسم، الكود، الهاتف، أو المنطقة...',
    totalCustomers: 'إجمالي دفتر العملاء',
    verifiedKyc: 'عملاء موثقون (اعرف عميلك)',
    activeLeads: 'صفقات نشطة قيد التنفيذ',
    conversionRate: 'معدل التحويل التشغيلي',
  },
  es: {
    dir: 'ltr',
    workspaceTitle: 'Registro de Clientes e Inversionistas',
    workspaceSubtitle:
      'Gobernanza de relaciones de clientes en el recorrido de 18 etapas de bienes raíces en Dubái',
    registerCustomerBtn: 'Registrar Nuevo Cliente',
    inspectCustomerBtn: 'Inspeccionar Expediente de Cliente',
    searchPlaceholder: 'Buscar clientes por nombre, código, teléfono o comunidad...',
    totalCustomers: 'Libro Mayor de Clientes',
    verifiedKyc: 'Clientes con KYC Verificado',
    activeLeads: 'Tratos Activos en Curso',
    conversionRate: 'Conversión de Embudo',
  },
  ru: {
    dir: 'ltr',
    workspaceTitle: 'Реестр Клиентов и Инвесторов',
    workspaceSubtitle:
      'Управление отношениями с клиентами на всех 18 этапах пути на рынке недвижимости Дубая',
    registerCustomerBtn: 'Зарегистрировать Клиента',
    inspectCustomerBtn: 'Изучить Досье Клиента',
    searchPlaceholder: 'Поиск клиентов по имени, коду, телефону или району...',
    totalCustomers: 'Общий Реестр Клиентов',
    verifiedKyc: 'Верифицированные Клиенты (KYC)',
    activeLeads: 'Активные Сделки',
    conversionRate: 'Конверсия Воронки',
  },
};

export function getCustomerI18n(lang: SupportedLanguage = 'en'): CustomerTranslations {
  return CUSTOMER_TRANSLATIONS[lang] || CUSTOMER_TRANSLATIONS.en;
}

export default CUSTOMER_TRANSLATIONS;
