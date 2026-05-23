export type AMLRiskLevel = 'low' | 'medium' | 'high';

export interface AMLScreeningInput {
  leadId: string;
  leadName?: string | null;
  amount?: number | null;
  currency?: string | null;
  transactionType?: string | null;
  nationality?: string | null;
  sourceOfFunds?: string | null;
}

export interface AMLScreeningResult {
  provider: string;
  providerReference: string;
  riskScore: number;
  riskLevel: AMLRiskLevel;
  flags: string[];
  screenedAt: string;
}

interface AMLProvider {
  screen(input: AMLScreeningInput): Promise<AMLScreeningResult>;
}

const HIGH_RISK_NATIONALITY_KEYWORDS = ['north korea', 'iran', 'syria', 'afghanistan', 'myanmar'];

class InternalAMLProvider implements AMLProvider {
  async screen(input: AMLScreeningInput): Promise<AMLScreeningResult> {
    let riskScore = 0;
    const flags: string[] = [];

    const amount = Number(input.amount || 0);
    const normalizedNationality = String(input.nationality || '').toLowerCase();
    const normalizedSof = String(input.sourceOfFunds || '').toLowerCase();

    if (amount >= 500000) {
      riskScore += 35;
      flags.push('high_value_transaction');
    }

    if (amount >= 1000000) {
      riskScore += 25;
      flags.push('very_high_value_transaction');
    }

    if (HIGH_RISK_NATIONALITY_KEYWORDS.some(keyword => normalizedNationality.includes(keyword))) {
      riskScore += 35;
      flags.push('high_risk_nationality');
    }

    if (
      normalizedSof.includes('cash') ||
      normalizedSof.includes('unknown') ||
      normalizedSof.includes('unverified')
    ) {
      riskScore += 20;
      flags.push('source_of_funds_review_required');
    }

    const transactionType = String(input.transactionType || '').toLowerCase();
    if (transactionType === 'sale') {
      riskScore += 10;
    }

    riskScore = Math.min(100, riskScore);

    const riskLevel: AMLRiskLevel = riskScore >= 70 ? 'high' : riskScore >= 40 ? 'medium' : 'low';

    return {
      provider: 'internal_aml_baseline',
      providerReference: `AML-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
      riskScore,
      riskLevel,
      flags,
      screenedAt: new Date().toISOString(),
    };
  }
}

const internalProvider = new InternalAMLProvider();

export async function screenAML(input: AMLScreeningInput): Promise<AMLScreeningResult> {
  // W4-005 abstraction point: provider switch can be expanded to external APIs later.
  return internalProvider.screen(input);
}
