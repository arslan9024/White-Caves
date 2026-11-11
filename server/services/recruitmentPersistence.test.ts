import { beforeEach, describe, expect, it, vi } from 'vitest';

const db = vi.hoisted(() => ({
  candidate: { findUnique: vi.fn() },
  job: { findUnique: vi.fn() },
  candidateScore: { create: vi.fn() },
  interviewSchedule: { create: vi.fn(), findMany: vi.fn() },
  interview: { findMany: vi.fn() },
}));
vi.mock('@prisma/client', () => ({
  PrismaClient: class {
    constructor() {
      return db;
    }
  },
}));
vi.mock('../lib/database.js', () => ({
  WhatsAppMessage: vi.fn(),
  WhatsAppContact: vi.fn(),
}));

import { InterviewSchedulingService } from './InterviewSchedulingService.js';
import { CandidateScoringService } from './CandidateScoringService.js';

beforeEach(() => {
  vi.restoreAllMocks();
  vi.clearAllMocks();
});

describe('Recruitment service persistence contracts', () => {
  it('creates InterviewSchedule with persisted field names', async () => {
    db.candidate.findUnique.mockResolvedValue({ id: 'c1' });
    db.job.findUnique.mockResolvedValue({ id: 'j1', title: 'Agent' });
    db.interviewSchedule.create.mockResolvedValue({
      id: 's1',
      candidate_id: 'c1',
      job_id: 'j1',
      session_status: 'pending_scheduling',
      interviewer_ids: ['u1'],
      available_slots: [],
    });
    const notify = vi
      .spyOn(InterviewSchedulingService, 'sendInterviewInvitation')
      .mockResolvedValue({});
    const result = await InterviewSchedulingService.createInterviewSession('c1', 'j1', ['u1'], []);
    expect(result.success).toBe(true);
    expect(db.job.findUnique).toHaveBeenCalledWith({ where: { id: 'j1' } });
    expect(db.interviewSchedule.create).toHaveBeenCalledWith({
      data: {
        candidate_id: 'c1',
        job_id: 'j1',
        session_status: 'pending_scheduling',
        interview_type: 'hr',
        interviewer_ids: ['u1'],
        available_slots: [],
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      },
    });
    expect(notify).toHaveBeenCalledWith(
      expect.any(Object),
      expect.any(Object),
      expect.objectContaining({ candidateId: 'c1' }),
      []
    );
  });

  it('uses session_status when aggregating interview statistics', async () => {
    db.interview.findMany.mockResolvedValue([{ status: 'completed' }]);
    db.interviewSchedule.findMany.mockResolvedValue([
      { session_status: 'pending_scheduling' },
      { session_status: 'scheduled' },
    ]);
    const stats = await InterviewSchedulingService.getInterviewStats('j1');
    expect(stats).toMatchObject({ total_sessions: 2, scheduled: 1, pending: 1, completed: 1 });
    expect(db.interviewSchedule.findMany).toHaveBeenCalledWith({ where: { job_id: 'j1' } });
  });

  it.each([true, false])(
    'reports notification outcome %s without duplicate delivery',
    async delivered => {
      db.candidate.findUnique.mockResolvedValue({ id: 'c1', phone: '+971000000000' });
      db.job.findUnique.mockResolvedValue({ id: 'j1' });
      for (const method of [
        'calculateSkillsScore',
        'calculateExperienceScore',
        'calculateEducationScore',
        'calculateCulturalFitScore',
        'calculateLocationMatchScore',
      ] as const) {
        vi.spyOn(CandidateScoringService, method).mockReturnValue(90);
      }
      db.candidateScore.create.mockResolvedValue({
        id: 'score1',
        overall_score: 90,
        cultural_fit: 90,
        location_match: 90,
      });
      const send = vi.spyOn(CandidateScoringService, 'sendScoringResultViaMeta');
      if (delivered) send.mockResolvedValue({ id: 'message1' });
      else send.mockRejectedValue(new Error('delivery unavailable'));
      const result = await CandidateScoringService.scoreCandidateForJob('c1', 'j1');
      expect(result).toMatchObject({ screening_status: 'strong_match', message_sent: delivered });
      expect(send).toHaveBeenCalledTimes(1);
      const payload = db.candidateScore.create.mock.calls[0][0].data;
      expect(payload).toMatchObject({ cultural_fit: 90, location_match: 90 });
      expect(payload).not.toHaveProperty('screening_status');
      expect(payload).not.toHaveProperty('cultural_fit_score');
    }
  );
});
