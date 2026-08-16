export interface Milestone {
  year: string;
  title: string;
  completed: boolean;
}

export const MILESTONES: Milestone[] = [
  { year: '2023', title: 'Incorporation & DET License 1388443', completed: true },
  { year: '2024', title: 'RERA ORN 44483 & 12 Corporate Depts', completed: true },
  { year: '2025', title: 'White Caves Sovereign OS Release 1.0', completed: true },
  { year: '2026', title: 'AEGIS V3 100-Turn Autopilot Matrix', completed: true },
];

export function useCareerMilestoneTimelineLogic() {
  return {
    milestones: MILESTONES,
  };
}
