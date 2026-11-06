// FILE: src/components/crm/Leaderboard/Leaderboard.test.tsx
/**
 * White Caves Real Estate LLC - Gamified Leaderboard Tests
 * Standard: AEGIS 12-Way Co-Location Architecture Standard (Tests - Tier 6)
 * Single Purpose File Law: < 350 lines
 */

import '@testing-library/jest-dom';
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { LeaderboardView } from './LeaderboardView';
import {
  taskCompletionXpWorkflow,
  evaluatePromotionEligibilityWorkflow,
  executeTierPromotionWorkflow,
} from './Leaderboard.workflow';
import { LeaderboardMember, TaskXpInput } from './Leaderboard.types';
import { INITIAL_LEADERBOARD_DATA } from './Leaderboard.data';
import { LeaderboardFallback } from './Leaderboard.fallback';
import { LeaderboardTelemetry } from './Leaderboard.telemetry';
import { getLeaderboardI18n } from './Leaderboard.i18n';
import {
  saveLeaderboardCache,
  loadLeaderboardCache,
  getLeaderboardMemberByTuringId,
  indexLeaderboardInMemory,
} from './Leaderboard.cache';
import { calculateLeaderboardRanksOffThread } from './Leaderboard.workers';

const mockMemberL4: LeaderboardMember = {
  id: 'TEST-001',
  name: 'Hamdan Al-Falasi',
  avatar: 'https://example.com/avatar.jpg',
  email: 'hamdan@whitecaves.ae',
  departmentId: 'D01',
  departmentName: 'Leasing Brokerage',
  currentTier: 'L4',
  currentRole: 'Leasing Specialist',
  meritXp: 2600,
  tasksCompleted: 26,
  slaOnTimeRate: 95.0,
  promotionStatus: 'ELIGIBLE',
  nextTier: 'L3',
  nextTierProgressPercent: 100,
  badges: [],
  milestones: [],
};

describe('Leaderboard 12-Way Suite', () => {
  beforeEach(() => {
    localStorage.clear();
    indexLeaderboardInMemory(INITIAL_LEADERBOARD_DATA);
    LeaderboardTelemetry.clear();
  });

  // --- Tier 1 & 2: View and Logic Integration ---
  it('renders the corporate leaderboard title and metrics deck', () => {
    render(<LeaderboardView />);

    expect(screen.getByText(/Corporate Merit Leaderboard & Tier Progression/i)).toBeInTheDocument();
    expect(screen.getByText(/Total Merit XP/i)).toBeInTheDocument();
    expect(screen.getByText(/Tasks Completed/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Promotion Ready/i).length).toBeGreaterThan(0);
  });

  it('renders podium members with champion gold badge', () => {
    render(<LeaderboardView />);

    expect(screen.getByText(/Champion • Gold/i)).toBeInTheDocument();
    expect(screen.getByText(/Rank #2 • Silver/i)).toBeInTheDocument();
    expect(screen.getByText(/Rank #3 • Bronze/i)).toBeInTheDocument();
  });

  it('filters members by tier tab', () => {
    render(<LeaderboardView />);

    const l1Tab = screen.getByRole('button', { name: /^L1$/i });
    fireEvent.click(l1Tab);

    expect(screen.getAllByText(/Sophia Al-Hashemi/i).length).toBeGreaterThan(0);
    expect(screen.queryByText(/Tariq Mansoor/i)).not.toBeInTheDocument();
  });

  it('opens promotion drawer and executes promotion', () => {
    render(<LeaderboardView />);

    const promoteButtons = screen.getAllByRole('button', { name: /promote/i });
    expect(promoteButtons.length).toBeGreaterThan(0);
    fireEvent.click(promoteButtons[0]);

    expect(screen.getByText(/Career Dossier & Promotion Audit/i)).toBeInTheDocument();

    const confirmPromoteBtn = screen.getByRole('button', { name: /Promote to/i });
    expect(confirmPromoteBtn).toBeInTheDocument();

    fireEvent.click(confirmPromoteBtn);
    expect(screen.getByText(/promoted to/i)).toBeInTheDocument();
  });

  // --- Tier 7: Pure Workflows ---
  it('awards base and bonus XP on task completion', () => {
    const taskInput: TaskXpInput = {
      taskId: 'T001',
      taskName: 'Qualify tenant lead',
      priority: 'P0',
      resolvedAheadOfSla: true,
      zeroDefectAudit: true,
    };

    const initialMember = { ...mockMemberL4, meritXp: 1000, tasksCompleted: 10 };
    const { updatedMember, result } = taskCompletionXpWorkflow(initialMember, taskInput);

    expect(result.baseXp).toBe(100);
    expect(result.bonusXp).toBe(35);
    expect(result.totalXp).toBe(135);
    expect(updatedMember.meritXp).toBe(1135);
  });

  it('correctly evaluates promotion eligibility', () => {
    const eligibleResult = evaluatePromotionEligibilityWorkflow(mockMemberL4);
    expect(eligibleResult.isEligible).toBe(true);
    expect(eligibleResult.missingRequirements.length).toBe(0);

    const ineligibleMember = { ...mockMemberL4, tasksCompleted: 12, meritXp: 1200 };
    const ineligibleResult = evaluatePromotionEligibilityWorkflow(ineligibleMember);
    expect(ineligibleResult.isEligible).toBe(false);
  });

  it('executes tier promotion and records career milestone', () => {
    const promoted = executeTierPromotionWorkflow(mockMemberL4, 'Executive Board');
    expect(promoted.currentTier).toBe('L3');
    expect(promoted.currentRole).toContain('Operational Supervisor');
    expect(promoted.milestones.length).toBe(1);
  });

  // --- Tier 8: Failure Boundary ---
  it('renders LeaderboardFallback boundary with errorId and triggers onRetry', () => {
    const onRetry = vi.fn();
    const onNavigateBack = vi.fn();

    render(
      <LeaderboardFallback
        error="Leaderboard WebSocket XP Stream Timeout"
        errorId="ERR-LDR-503"
        onRetry={onRetry}
        onNavigateBack={onNavigateBack}
      />
    );

    expect(screen.getByTestId('leaderboard-fallback')).toBeInTheDocument();
    expect(screen.getByText('ERR-LDR-503')).toBeInTheDocument();
    expect(screen.getByText(/Leaderboard WebSocket XP Stream Timeout/i)).toBeInTheDocument();

    const retryBtn = screen.getByTestId('leaderboard-fallback-retry-btn');
    fireEvent.click(retryBtn);
    expect(onRetry).toHaveBeenCalledTimes(1);

    const backBtn = screen.getByTestId('leaderboard-fallback-back-btn');
    fireEvent.click(backBtn);
    expect(onNavigateBack).toHaveBeenCalledTimes(1);
  });

  // --- Tier 9: Real-Time State Attestations & Telemetry ---
  it('tracks leaderboard telemetry events and delivers to queue with non-blocking dispatch', () => {
    LeaderboardTelemetry.track('XP_AWARDED', {
      memberId: 'EMP-001',
      actorRole: 'MANAGING_DIRECTOR',
      awardedXp: 500,
    });

    const events = LeaderboardTelemetry.getRecentEvents();
    expect(events.length).toBeGreaterThan(0);
    const lastEvent = events[events.length - 1];
    expect(lastEvent.eventType).toBe('XP_AWARDED');
    expect(lastEvent.awardedXp).toBe(500);
  });

  // --- Tier 10: 4-Language Translation Schemas ---
  it('resolves 4-language i18n schemas with Arabic RTL compliance', () => {
    const arI18n = getLeaderboardI18n('ar');
    expect(arI18n.dir).toBe('rtl');
    expect(arI18n.workspaceTitle).toContain('الصدارة');

    const enI18n = getLeaderboardI18n('en');
    expect(enI18n.dir).toBe('ltr');
    expect(enI18n.workspaceTitle).toContain('Leaderboard');

    const esI18n = getLeaderboardI18n('es');
    expect(esI18n.workspaceTitle).toContain('Clasificación');

    const ruI18n = getLeaderboardI18n('ru');
    expect(ruI18n.workspaceTitle).toContain('Лидеров');
  });

  // --- Tier 11: Localized State Persistence & O(1) Cache Lookup ---
  it('persists leaderboard cache and provides O(1) lookups by Turing ID', () => {
    saveLeaderboardCache(INITIAL_LEADERBOARD_DATA);
    const cached = loadLeaderboardCache();
    expect(cached).toBeDefined();
    expect(cached?.length).toBe(INITIAL_LEADERBOARD_DATA.length);

    const lookupById = getLeaderboardMemberByTuringId('emp-001');
    expect(lookupById).toBeDefined();
    expect(lookupById?.name).toContain('Tariq');
  });

  // --- Tier 12: Off-Thread Multi-Agent Background Computation ---
  it('calculates leaderboard ranks off-thread with Law 10 gamified XP attribution', async () => {
    const result = await calculateLeaderboardRanksOffThread({
      members: INITIAL_LEADERBOARD_DATA,
      additionalXp: { memberId: 'emp-001', xpBonus: 500 },
    });

    expect(result.sortedMembers.length).toBe(INITIAL_LEADERBOARD_DATA.length);
    expect(result.topPodium.length).toBe(3);
    expect(result.totalMeritXp).toBeGreaterThan(0);
    expect(result.gamifiedAttestationToken).toContain('XP-RANK-ATTEST');
  });
});
