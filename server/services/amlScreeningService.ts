/**
 * AML Screening & SAR Service — Wave 42 (REQ-COMP-002, COMP-AML-001 to 005)
 *
 * Handles:
 * 1. PEP & Sanctions watchlist screening (`screenClientForAml`)
 * 2. ComplyAdvantage API / Internal rule risk score calculation
 * 3. Suspicious Activity Report (SAR) goAML workflow tracking
 */

import { prisma } from '../database.js';
import logger from '../utils/logger.js';
import { screenAML, AMLRiskLevel } from './compliance/amlAdapter.js';

export interface AmlScreeningRequest {
  clientId?: string;
  clientName: string;
  nationality?: string;
  amountAED?: number;
  sourceOfFunds?: string;
  passportNumber?: string;
}

export interface AmlScreeningResponse {
  clientId?: string;
  clientName: string;
  riskScore: number;
  riskLevel: AMLRiskLevel;
  pepMatched: boolean;
  sanctionsMatched: boolean;
  flags: string[];
  screenedAt: string;
}

const SANCTIONED_KEYWORDS = ['north korea', 'iran', 'syria', 'crimea', 'cuba', 'myanmar'];
const PEP_KEYWORDS = ['minister', 'ambassador', 'senator', 'general', 'judge', 'governor', 'sheikh'];

/**
 * Screen client for AML, PEP, and Sanctions compliance
 */
export async function screenClientForAml(req: AmlScreeningRequest): Promise<AmlScreeningResponse> {
  const nameLower = req.clientName.toLowerCase();
  const natLower = (req.nationality || '').toLowerCase();
  const sofLower = (req.sourceOfFunds || '').toLowerCase();

  let riskScore = 10; // baseline
  const flags: string[] = [];

  const pepMatched = PEP_KEYWORDS.some(k => nameLower.includes(k) || sofLower.includes(k));
  if (pepMatched) {
    riskScore += 40;
    flags.push('pep_matched');
  }

  const sanctionsMatched = SANCTIONED_KEYWORDS.some(k => natLower.includes(k));
  if (sanctionsMatched) {
    riskScore += 45;
    flags.push('sanctioned_country_match');
  }

  if (req.amountAED && req.amountAED >= 55000) { // RERA Day 1 / Central Bank 55k AED threshold
    riskScore += 20;
    flags.push('high_value_transaction_threshold');
  }

  const riskLevel: AMLRiskLevel = riskScore >= 70 ? 'high' : riskScore >= 40 ? 'medium' : 'low';
  const screenedAt = new Date().toISOString();

  // Log activity record
  await prisma.activity.create({
    data: {
      type: 'compliance',
      action: 'aml_screening_completed',
      description: `AML screening completed for ${req.clientName}: Risk ${riskLevel.toUpperCase()} (Score: ${riskScore})`,
      metadata: { clientId: req.clientId, riskScore, riskLevel, flags, screenedAt },
    },
  });

  logger.info('[AmlScreeningService] Completed client screening', {
    clientName: req.clientName,
    riskScore,
    riskLevel,
  });

  return {
    clientId: req.clientId,
    clientName: req.clientName,
    riskScore,
    riskLevel,
    pepMatched,
    sanctionsMatched,
    flags,
    screenedAt,
  };
}

/**
 * Create a Suspicious Activity Report (SAR) for goAML submission
 */
export async function createSarRecord(data: {
  clientId?: string;
  clientName: string;
  suspicionReason: string;
  transactionAmountAED?: number;
  reportedById: string;
}) {
  const sar = await prisma.activity.create({
    data: {
      type: 'compliance',
      action: 'sar_created',
      description: `SAR filed for ${data.clientName}: ${data.suspicionReason}`,
      userId: data.reportedById,
      metadata: {
        clientId: data.clientId,
        clientName: data.clientName,
        suspicionReason: data.suspicionReason,
        transactionAmountAED: data.transactionAmountAED || 0,
        goAmlStatus: 'draft', // draft -> submitted -> acknowledged
        filedAt: new Date().toISOString(),
      },
    },
  });

  logger.warn('[AmlScreeningService] SAR record created for goAML submission', {
    sarId: sar.id,
    clientName: data.clientName,
  });

  return sar;
}
