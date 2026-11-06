// FILE: src/components/crm/DealManager/DealManager.i18n.ts
/**
 * White Caves Real Estate LLC - DealManager 4-Language Translation Schemas (Tier 10)
 * Standard: AEGIS Canonical 12-Way Architecture Standard
 * Single Purpose File Law: < 350 lines
 */

export type SupportedLanguage = 'en' | 'ar' | 'es' | 'ru';

export interface DealTranslations {
  dir: 'ltr' | 'rtl';
  workspaceTitle: string;
  workspaceSubtitle: string;
  newDealBtn: string;
  inspectDealBtn: string;
  advanceStageBtn: string;
  escrowAccountsTitle: string;
  totalVolume: string;
  commissionBooked: string;
  activeContracts: string;
  clearedPdcRate: string;
  searchPlaceholder: string;
  stages: {
    INQUIRY: string;
    VIEWING: string;
    OFFER: string;
    CONTRACT: string;
    EJARI_DLD: string;
    COMPLETED: string;
    CANCELLED: string;
  };
}

export const DEAL_TRANSLATIONS: Record<SupportedLanguage, DealTranslations> = {
  en: {
    dir: 'ltr',
    workspaceTitle: 'Deals & Escrow Pipeline Hub',
    workspaceSubtitle: 'Transaction management across the 18-step Dubai real estate lifecycle',
    newDealBtn: 'Register New Deal',
    inspectDealBtn: 'Inspect Deal Dossier',
    advanceStageBtn: 'Advance Pipeline Stage',
    escrowAccountsTitle: 'RERA Escrow Account Ledger',
    totalVolume: 'Gross Deal Volume',
    commissionBooked: 'Commission Booked',
    activeContracts: 'Active Contracts',
    clearedPdcRate: 'Cleared PDC Cheques',
    searchPlaceholder: 'Search deals by deal number, client, property, or agent...',
    stages: {
      INQUIRY: 'Lead Inquiry',
      VIEWING: 'Property Viewing',
      OFFER: 'Offer Submitted',
      CONTRACT: 'Contract & Form F',
      EJARI_DLD: 'Ejari Attestation',
      COMPLETED: 'Closed & Key Handover',
      CANCELLED: 'Cancelled / Bounced',
    },
  },
  ar: {
    dir: 'rtl',
    workspaceTitle: 'مركز الصفقات وحسابات الضمان المالي',
    workspaceSubtitle:
      'إدارة المعاملات العقارية عبر دورة الحياة المعتمدة من دائرة الأراضي والأملاك',
    newDealBtn: 'تسجيل صفقة جديدة',
    inspectDealBtn: 'فحص ملف الصفقة',
    advanceStageBtn: 'ترقية مرحلة الصفقة',
    escrowAccountsTitle: 'سجل حسابات الضمان العقاري (ريرا)',
    totalVolume: 'إجمالي حجم الصفقات',
    commissionBooked: 'العمولات المحجوزة',
    activeContracts: 'العقود النشطة',
    clearedPdcRate: 'الشيكات المحصلة',
    searchPlaceholder: 'البحث عن الصفقات برقم الصفقة، العميل، العقار، أو الوسيط...',
    stages: {
      INQUIRY: 'استفسار أولي',
      VIEWING: 'معاينة العقار',
      OFFER: 'تقديم العرض',
      CONTRACT: 'العقد واستمارة F',
      EJARI_DLD: 'توثيق إيجاري',
      COMPLETED: 'إتمام الصفقة وتسليم المفتاح',
      CANCELLED: 'ملغاة / مرتجعة',
    },
  },
  es: {
    dir: 'ltr',
    workspaceTitle: 'Centro de Operaciones y Cuentas de Fideicomiso',
    workspaceSubtitle:
      'Gestión de transacciones a lo largo del ciclo de vida inmobiliario de Dubái',
    newDealBtn: 'Registrar Nueva Operación',
    inspectDealBtn: 'Inspeccionar Expediente',
    advanceStageBtn: 'Avanzar Etapa de Negocio',
    escrowAccountsTitle: 'Libro de Cuentas de Garantía RERA',
    totalVolume: 'Volumen Total Bruto',
    commissionBooked: 'Comisiones Registradas',
    activeContracts: 'Contratos Activos',
    clearedPdcRate: 'Cheques PDC Compensados',
    searchPlaceholder: 'Buscar por número de acuerdo, cliente, propiedad o agente...',
    stages: {
      INQUIRY: 'Consulta Inicial',
      VIEWING: 'Visita a la Propiedad',
      OFFER: 'Oferta Presentada',
      CONTRACT: 'Contrato y Formulario F',
      EJARI_DLD: 'Atestación Ejari',
      COMPLETED: 'Cierre y Entrega de Llaves',
      CANCELLED: 'Cancelada',
    },
  },
  ru: {
    dir: 'ltr',
    workspaceTitle: 'Центр Сделок и Эскроу-Счетов',
    workspaceSubtitle:
      'Управление сделками на всех 18 этапах дубайского жизненного цикла недвижимости',
    newDealBtn: 'Зарегистрировать Сделку',
    inspectDealBtn: 'Изучить Досье Сделки',
    advanceStageBtn: 'Продвинуть Этап Сделки',
    escrowAccountsTitle: 'Реестр Эскроу-Счетов RERA',
    totalVolume: 'Общий Объем Сделок',
    commissionBooked: 'Зафиксированная Комиссия',
    activeContracts: 'Активные Контракты',
    clearedPdcRate: 'Проведенные Чеки PDC',
    searchPlaceholder: 'Поиск по номеру сделки, клиенту, объекту или брокеру...',
    stages: {
      INQUIRY: 'Первичный Запрос',
      VIEWING: 'Показ Объекта',
      OFFER: 'Подача Предложения',
      CONTRACT: 'Контракт и Форма F',
      EJARI_DLD: 'Регистрация Ejari',
      COMPLETED: 'Сделка Завершена и Передача Ключей',
      CANCELLED: 'Отменено',
    },
  },
};

export function getDealI18n(lang: SupportedLanguage = 'en'): DealTranslations {
  return DEAL_TRANSLATIONS[lang] || DEAL_TRANSLATIONS.en;
}

export default DEAL_TRANSLATIONS;
