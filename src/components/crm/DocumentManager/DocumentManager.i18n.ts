// FILE: src/components/crm/DocumentManager/DocumentManager.i18n.ts
/**
 * White Caves Real Estate LLC - DocumentManager 4-Language Translation Schemas (Tier 10)
 * Standard: AEGIS Canonical 12-Way Architecture Standard
 * Single Purpose File Law: < 350 lines
 */

export type SupportedLanguage = 'en' | 'ar' | 'es' | 'ru';

export interface DocumentTranslations {
  dir: 'ltr' | 'rtl';
  workspaceTitle: string;
  workspaceSubtitle: string;
  uploadDocBtn: string;
  inspectDocBtn: string;
  searchPlaceholder: string;
  totalDocuments: string;
  verifiedDocuments: string;
  pendingOcr: string;
  avgConfidence: string;
}

export const DOCUMENT_TRANSLATIONS: Record<SupportedLanguage, DocumentTranslations> = {
  en: {
    dir: 'ltr',
    workspaceTitle: 'Statutory Real Estate Document Vault',
    workspaceSubtitle:
      'DLD, Title Deed, Ejari & KYC regulatory compliance and OCR extraction engine',
    uploadDocBtn: 'Upload Statutory Document',
    inspectDocBtn: 'Inspect Document Dossier',
    searchPlaceholder: 'Search documents by title, code, deal, or entity...',
    totalDocuments: 'Total Vault Documents',
    verifiedDocuments: 'Certified & Verified',
    pendingOcr: 'Pending OCR Ingestion',
    avgConfidence: 'Mean OCR Confidence',
  },
  ar: {
    dir: 'rtl',
    workspaceTitle: 'خزينة المستندات العقارية القانونية',
    workspaceSubtitle:
      'محرك الامتثال التنظيمي واستخراج النصوص لعقود إيجاري وسندات الملكية ودائرة الأراضي والأملاك',
    uploadDocBtn: 'رفع مستند قانوني',
    inspectDocBtn: 'فحص ملف المستند',
    searchPlaceholder: 'البحث عن المستندات بالعنوان، الكود، الصفقة، أو المالك...',
    totalDocuments: 'إجمالي مستندات الخزينة',
    verifiedDocuments: 'معتمدة وموثقة',
    pendingOcr: 'بانتظار المعالجة الضوئية',
    avgConfidence: 'متوسط دقة التعرف الضوئي',
  },
  es: {
    dir: 'ltr',
    workspaceTitle: 'Bóveda de Documentos Estatutarios de Bienes Raíces',
    workspaceSubtitle: 'Motor de cumplimiento regulatorio DLD, Título de Propiedad, Ejari y KYC',
    uploadDocBtn: 'Cargar Documento Estatutario',
    inspectDocBtn: 'Inspeccionar Expediente de Documento',
    searchPlaceholder: 'Buscar documentos por título, código, trato o entidad...',
    totalDocuments: 'Total en Bóveda',
    verifiedDocuments: 'Certificados y Verificados',
    pendingOcr: 'Pendientes de OCR',
    avgConfidence: 'Confianza Media OCR',
  },
  ru: {
    dir: 'ltr',
    workspaceTitle: 'Хранилище Уставных Документов по Недвижимости',
    workspaceSubtitle:
      'Движок соответствия нормам DLD, свидетельств о собственности, договоров Ejari и KYC',
    uploadDocBtn: 'Загрузить Уставной Документ',
    inspectDocBtn: 'Изучить Досье Документа',
    searchPlaceholder: 'Поиск документов по названию, коду, сделке или лицу...',
    totalDocuments: 'Всего Документов в Хранилище',
    verifiedDocuments: 'Заверено и Верифицировано',
    pendingOcr: 'Ожидает Обработки OCR',
    avgConfidence: 'Средняя Точность OCR',
  },
};

export function getDocumentI18n(lang: SupportedLanguage = 'en'): DocumentTranslations {
  return DOCUMENT_TRANSLATIONS[lang] || DOCUMENT_TRANSLATIONS.en;
}

export default DOCUMENT_TRANSLATIONS;
