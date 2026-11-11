// FILE: src/components/crm/Leaderboard/Leaderboard.i18n.ts
/**
 * White Caves Real Estate LLC - Leaderboard 4-Language Translation Schemas (Tier 10)
 * Standard: AEGIS Canonical 12-Way Architecture Standard
 * Single Purpose File Law: < 350 lines
 */

export type SupportedLanguage = 'en' | 'ar' | 'es' | 'ru';

export interface LeaderboardTranslations {
  dir: 'ltr' | 'rtl';
  workspaceTitle: string;
  workspaceSubtitle: string;
  promoteMemberBtn: string;
  inspectMemberBtn: string;
  searchPlaceholder: string;
  totalMembers: string;
  totalMeritXp: string;
  avgSlaRate: string;
  promotionsThisMonth: string;
}

export const LEADERBOARD_TRANSLATIONS: Record<SupportedLanguage, LeaderboardTranslations> = {
  en: {
    dir: 'ltr',
    workspaceTitle: 'Gamified Promotion & Merit XP Leaderboard',
    workspaceSubtitle:
      'Corporate tier progression, peer endorsements, and real-time XP accumulation ladder',
    promoteMemberBtn: 'Promote Tier Role',
    inspectMemberBtn: 'Inspect Member Dossier',
    searchPlaceholder: 'Search rankings by agent name, department, or tier...',
    totalMembers: 'Ranked Personnel',
    totalMeritXp: 'Total Network Merit XP',
    avgSlaRate: 'Average SLA Compliance',
    promotionsThisMonth: 'Tier Promotions',
  },
  ar: {
    dir: 'rtl',
    workspaceTitle: 'لوحة الصدارة والترقيات ونقاط الجدارة (XP)',
    workspaceSubtitle: 'تدرج الرتب الوظيفية، والتزكيات المهنية، وسلم تراكم نقاط الخبرة اللحظي',
    promoteMemberBtn: 'ترقية الرتبة الوظيفية',
    inspectMemberBtn: 'فحص ملف العضو',
    searchPlaceholder: 'البحث في التصنيف بالاسم، القسم، أو الرتبة...',
    totalMembers: 'الكادر المصنف',
    totalMeritXp: 'إجمالي نقاط الجدارة للمؤسسة',
    avgSlaRate: 'متوسط الامتثال لسرعة الإنجاز',
    promotionsThisMonth: 'الترقيات المنجزة',
  },
  es: {
    dir: 'ltr',
    workspaceTitle: 'Tabla de Clasificación y Mérito XP Gamificado',
    workspaceSubtitle:
      'Progresión de niveles corporativos, respaldos entre pares y escala de XP en tiempo real',
    promoteMemberBtn: 'Promover Nivel',
    inspectMemberBtn: 'Inspeccionar Expediente de Miembro',
    searchPlaceholder: 'Buscar clasificaciones por nombre, departamento o nivel...',
    totalMembers: 'Personal Clasificado',
    totalMeritXp: 'XP Total de Mérito',
    avgSlaRate: 'Cumplimiento Medio SLA',
    promotionsThisMonth: 'Promociones de Nivel',
  },
  ru: {
    dir: 'ltr',
    workspaceTitle: 'Таблица Лидеров и Геймифицированного Опыта (XP)',
    workspaceSubtitle:
      'Корпоративный рост по уровням, рекомендации коллег и лестница накопления опыта XP',
    promoteMemberBtn: 'Повысить Уровень',
    inspectMemberBtn: 'Изучить Досье Участника',
    searchPlaceholder: 'Поиск по имени, отделу или уровню...',
    totalMembers: 'Участников в Рейтинге',
    totalMeritXp: 'Общий Опыт Компании (XP)',
    avgSlaRate: 'Средний Показатель SLA',
    promotionsThisMonth: 'Повышений за Месяц',
  },
};

export function getLeaderboardI18n(lang: SupportedLanguage = 'en'): LeaderboardTranslations {
  return LEADERBOARD_TRANSLATIONS[lang] || LEADERBOARD_TRANSLATIONS.en;
}

export default LEADERBOARD_TRANSLATIONS;
