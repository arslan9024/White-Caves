/**
 * White Caves Real Estate LLC - Gamified Leaderboard Tests
 * Standard: AEGIS Canonical 7-Category Architecture Standard (Tests)
 * Single Purpose File Law: < 350 lines
 */

import '@testing-library/jest-dom';
import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { LeaderboardView } from './LeaderboardView';
import {
  taskCompletionXpWorkflow,
  evaluatePromotionEligibilityWorkflow,
  executeTierPromotionWorkflow,
} from './Leaderboard.workflow';
import { LeaderboardMember, TaskXpInput } from './Leaderboard.types';

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

describe('Leaderboard Pure Workflows', () => {
  it('awards base and bonus XP on task completion', () => {
    const taskInput: TaskXpInput = {
      taskId: 'T001',
      taskName: 'Qualify tenant lead',
      priority: 'P0',
      resolvedAheadOfSla: true, // +20%
      zeroDefectAudit: true, // +15%
    };

    const initialMember = { ...mockMemberL4, meritXp: 1000, tasksCompleted: 10 };
    const { updatedMember, result } = taskCompletionXpWorkflow(initialMember, taskInput);

    expect(result.baseXp).toBe(100);
    expect(result.bonusXp).toBe(35); // 100 * (0.20 + 0.15) = 35
    expect(result.totalXp).toBe(135);
    expect(updatedMember.meritXp).toBe(1135);
    expect(updatedMember.tasksCompleted).toBe(11);
  });

  it('correctly evaluates promotion eligibility', () => {
    // Meets all criteria for L4 -> L3 (min 25 tasks, 2500 XP, 90% SLA)
    const eligibleResult = evaluatePromotionEligibilityWorkflow(mockMemberL4);
    expect(eligibleResult.isEligible).toBe(true);
    expect(eligibleResult.missingRequirements.length).toBe(0);

    // Below criteria
    const ineligibleMember = { ...mockMemberL4, tasksCompleted: 12, meritXp: 1200 };
    const ineligibleResult = evaluatePromotionEligibilityWorkflow(ineligibleMember);
    expect(ineligibleResult.isEligible).toBe(false);
    expect(ineligibleResult.missingRequirements.length).toBeGreaterThan(0);
  });

  it('executes tier promotion and records career milestone', () => {
    const promoted = executeTierPromotionWorkflow(mockMemberL4, 'Executive Board');
    expect(promoted.currentTier).toBe('L3');
    expect(promoted.currentRole).toContain('Operational Supervisor');
    expect(promoted.milestones.length).toBe(1);
    expect(promoted.milestones[0].fromTier).toBe('L4');
    expect(promoted.milestones[0].toTier).toBe('L3');
    expect(promoted.nextTier).toBe('L2');
  });
});

describe('LeaderboardView UI Component', () => {
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

    // Should show L1 directors
    expect(screen.getAllByText(/Sophia Al-Hashemi/i).length).toBeGreaterThan(0);
    expect(screen.queryByText(/Tariq Mansoor/i)).not.toBeInTheDocument();
  });

  it('opens promotion drawer and executes promotion', () => {
    render(<LeaderboardView />);

    // Click Promote button on first eligible member (Karim Bennani or Tariq Mansoor)
    const promoteButtons = screen.getAllByRole('button', { name: /promote/i });
    expect(promoteButtons.length).toBeGreaterThan(0);
    fireEvent.click(promoteButtons[0]);

    // Drawer should open
    expect(screen.getByText(/Career Dossier & Promotion Audit/i)).toBeInTheDocument();

    // Find the confirmation button in the drawer footer
    const confirmPromoteBtn = screen.getByRole('button', { name: /Promote to/i });
    expect(confirmPromoteBtn).toBeInTheDocument();

    fireEvent.click(confirmPromoteBtn);

    // Toast or role transition should update
    expect(screen.getByText(/promoted to/i)).toBeInTheDocument();
  });
});
