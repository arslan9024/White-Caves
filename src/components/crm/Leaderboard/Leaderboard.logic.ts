/**
 * White Caves Real Estate LLC - Leaderboard Business Logic
 * Standard: AEGIS Canonical 7-Category Architecture Standard (Logic)
 * Single Purpose File Law: < 350 lines
 */

import { useState, useMemo, useCallback } from 'react';
import {
  LeaderboardMember,
  LeaderboardTimeframe,
  TierLevel,
  TaskXpInput,
} from './Leaderboard.types';
import { INITIAL_LEADERBOARD_DATA } from './Leaderboard.data';
import {
  taskCompletionXpWorkflow,
  executeTierPromotionWorkflow,
  evaluatePromotionEligibilityWorkflow,
} from './Leaderboard.workflow';

export function useLeaderboardLogic() {
  const [members, setMembers] = useState<LeaderboardMember[]>(INITIAL_LEADERBOARD_DATA);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('ALL');
  const [selectedTier, setSelectedTier] = useState<string>('ALL');
  const [selectedTimeframe, setSelectedTimeframe] = useState<LeaderboardTimeframe>('ALL_TIME');
  const [selectedMemberForPromotion, setSelectedMemberForPromotion] =
    useState<LeaderboardMember | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  // Filter and Rank
  const filteredAndRankedMembers = useMemo(() => {
    return members
      .filter(m => {
        const matchesSearch =
          m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          m.currentRole.toLowerCase().includes(searchQuery.toLowerCase()) ||
          m.departmentName.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesDept = selectedDepartment === 'ALL' || m.departmentId === selectedDepartment;
        const matchesTier = selectedTier === 'ALL' || m.currentTier === selectedTier;
        return matchesSearch && matchesDept && matchesTier;
      })
      .sort((a, b) => {
        if (b.meritXp !== a.meritXp) return b.meritXp - a.meritXp;
        return b.slaOnTimeRate - a.slaOnTimeRate;
      });
  }, [members, searchQuery, selectedDepartment, selectedTier]);

  // Podium (Top 3)
  const topThree = useMemo(() => {
    const sortedAll = [...members].sort((a, b) => b.meritXp - a.meritXp);
    return {
      gold: sortedAll[0] || null,
      silver: sortedAll[1] || null,
      bronze: sortedAll[2] || null,
    };
  }, [members]);

  // Aggregate Metrics
  const stats = useMemo(() => {
    const totalXp = members.reduce((acc, m) => acc + m.meritXp, 0);
    const totalTasks = members.reduce((acc, m) => acc + m.tasksCompleted, 0);
    const eligibleCount = members.filter(m => m.promotionStatus === 'ELIGIBLE').length;
    const avgSla =
      members.length > 0
        ? (members.reduce((acc, m) => acc + m.slaOnTimeRate, 0) / members.length).toFixed(1)
        : '0.0';

    return {
      totalXp,
      totalTasks,
      eligibleCount,
      avgSla,
      totalPersonnel: members.length,
    };
  }, [members]);

  // Award Task XP Action
  const handleAwardTaskXp = useCallback((memberId: string, task: TaskXpInput) => {
    setMembers(prev => {
      const target = prev.find(m => m.id === memberId);
      if (!target) return prev;

      const { updatedMember, result } = taskCompletionXpWorkflow(target, task);
      setNotification(
        `+${result.totalXp} XP awarded to ${updatedMember.name} for ${task.taskName}`
      );
      setTimeout(() => setNotification(null), 4000);

      return prev.map(m => (m.id === memberId ? updatedMember : m));
    });
  }, []);

  // Promote Member Action
  const handlePromoteMember = useCallback((memberId: string) => {
    setMembers(prev => {
      const target = prev.find(m => m.id === memberId);
      if (!target) return prev;

      try {
        const promoted = executeTierPromotionWorkflow(target);
        setNotification(`🎉 ${promoted.name} promoted to ${promoted.currentRole}!`);
        setTimeout(() => setNotification(null), 5000);
        setSelectedMemberForPromotion(null);
        return prev.map(m => (m.id === memberId ? promoted : m));
      } catch (err: any) {
        setNotification(`Error: ${err.message}`);
        return prev;
      }
    });
  }, []);

  const openPromotionDrawer = useCallback((member: LeaderboardMember) => {
    setSelectedMemberForPromotion(member);
  }, []);

  const closePromotionDrawer = useCallback(() => {
    setSelectedMemberForPromotion(null);
  }, []);

  // Check criteria for modal
  const promotionAudit = useMemo(() => {
    if (!selectedMemberForPromotion) return null;
    return evaluatePromotionEligibilityWorkflow(selectedMemberForPromotion);
  }, [selectedMemberForPromotion]);

  return {
    members,
    filteredAndRankedMembers,
    topThree,
    stats,
    searchQuery,
    setSearchQuery,
    selectedDepartment,
    setSelectedDepartment,
    selectedTier,
    setSelectedTier,
    selectedTimeframe,
    setSelectedTimeframe,
    selectedMemberForPromotion,
    promotionAudit,
    notification,
    handleAwardTaskXp,
    handlePromoteMember,
    openPromotionDrawer,
    closePromotionDrawer,
  };
}
