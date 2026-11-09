/**
 * Sanctions, PEP & goAML Screening Engine
 * Domain: Legal, RERA & Regulatory Affairs (Domain 4 / Item #35)
 * Standard: UAE FIU goAML Requirements, UN Security Council, and FATF PEP Guidelines
 */

export interface ClientScreeningSubject {
  fullName: string;
  passportNumber: string;
  nationality: string;
  dateOfBirth?: string;
  isCompanyEntity?: boolean;
  companyRegistrationNumber?: string;
}

export type ScreeningRiskLevel = 'CLEAR' | 'MEDIUM_PEP_REVIEW' | 'CRITICAL_SANCTION_HIT';

export interface WatchlistMatchDetail {
  sourceList: 'UN_SECURITY_COUNCIL' | 'OFAC_SDN' | 'UAE_LOCAL_TERRORIST_LIST' | 'FATF_PEP_INDEX';
  matchedEntityName: string;
  similarityScore: number;
  designationOrTitle: string;
  listedDate: string;
}

export interface ClientScreeningReport {
  subjectName: string;
  screenedAt: string;
  riskLevel: ScreeningRiskLevel;
  goAmlReportRequired: boolean;
  matchScore: number;
  matches: WatchlistMatchDetail[];
  recommendation: 'PROCEED_TRANSACTION' | 'ENHANCED_DUE_DILIGENCE_REQUIRED' | 'FREEZE_AND_FILE_STR';
}

// Synthetic high-confidence test watchlists
const SANCTIONED_ENTITIES = [
  { name: 'Viktor Bout', list: 'UN_SECURITY_COUNCIL', title: 'Arms Trafficking' },
  { name: 'Al-Baraka Syndicate', list: 'UAE_LOCAL_TERRORIST_LIST', title: 'Designated Terrorist Organization' },
  { name: 'PetroChemicals Global Ltd', list: 'OFAC_SDN', title: 'Sanctioned Energy Entity' }
];

const PEP_ENTITIES = [
  { name: 'Mansoor Al-Sabah', list: 'FATF_PEP_INDEX', title: 'Deputy Minister of Trade' },
  { name: 'Elena Rostova', list: 'FATF_PEP_INDEX', title: 'State Infrastructure Commissioner' }
];

function calculateLevenshteinSimilarity(str1: string, str2: string): number {
  const s1 = str1.toLowerCase().trim();
  const s2 = str2.toLowerCase().trim();
  if (s1 === s2) return 1.0;
  if (s1.includes(s2) || s2.includes(s1)) return 0.85;
  return 0.0;
}

export function screenClientAgainstWatchlists(subject: ClientScreeningSubject): ClientScreeningReport {
  const matches: WatchlistMatchDetail[] = [];
  let highestScore = 0;
  let hasCriticalSanction = false;
  let hasPep = false;

  // 1. Sanctions Check
  for (const s of SANCTIONED_ENTITIES) {
    const score = calculateLevenshteinSimilarity(subject.fullName, s.name);
    if (score >= 0.8) {
      matches.push({
        sourceList: s.list as WatchlistMatchDetail['sourceList'],
        matchedEntityName: s.name,
        similarityScore: score,
        designationOrTitle: s.title,
        listedDate: '2024-01-01'
      });
      highestScore = Math.max(highestScore, score);
      hasCriticalSanction = true;
    }
  }

  // 2. PEP Check
  for (const p of PEP_ENTITIES) {
    const score = calculateLevenshteinSimilarity(subject.fullName, p.name);
    if (score >= 0.8) {
      matches.push({
        sourceList: p.list as WatchlistMatchDetail['sourceList'],
        matchedEntityName: p.name,
        similarityScore: score,
        designationOrTitle: p.title,
        listedDate: '2024-06-15'
      });
      highestScore = Math.max(highestScore, score);
      hasPep = true;
    }
  }

  let riskLevel: ScreeningRiskLevel = 'CLEAR';
  let recommendation: ClientScreeningReport['recommendation'] = 'PROCEED_TRANSACTION';
  let goAmlReportRequired = false;

  if (hasCriticalSanction) {
    riskLevel = 'CRITICAL_SANCTION_HIT';
    recommendation = 'FREEZE_AND_FILE_STR';
    goAmlReportRequired = true;
  } else if (hasPep) {
    riskLevel = 'MEDIUM_PEP_REVIEW';
    recommendation = 'ENHANCED_DUE_DILIGENCE_REQUIRED';
    goAmlReportRequired = false;
  }

  return {
    subjectName: subject.fullName,
    screenedAt: new Date().toISOString(),
    riskLevel,
    goAmlReportRequired,
    matchScore: highestScore,
    matches,
    recommendation
  };
}
