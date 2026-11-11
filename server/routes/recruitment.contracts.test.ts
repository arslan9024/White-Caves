import { afterEach, describe, expect, it, vi } from 'vitest';
import express from 'express';
import request from 'supertest';
import type { AuthRequest } from '../middleware/auth.js';
import router, { __setRecruitmentTestDeps, __resetRecruitmentTestDeps } from './recruitment.js';
import { normalizeCandidateScore } from '../services/recruitmentRecordMapper.js';
import { ResumeParserService } from '../services/ResumeParserService.js';

function appFor(role?: string) {
  const app = express();
  app.use(express.json());
  app.use((req: AuthRequest, _res, next) => {
    if (role) req.user = { id: 'verified-user', role, email: 'fixture@example.test' };
    next();
  });
  app.use('/api/recruitment', router);
  return app;
}

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllEnvs();
  __resetRecruitmentTestDeps();
});

describe('Recruitment persistence and authorization contracts', () => {
  it.each([
    ['get', '/candidates'],
    ['get', '/jobs'],
    ['get', '/applications'],
    ['delete', '/candidates/c1'],
    ['delete', '/jobs/j1'],
    ['put', '/applications/a1/status'],
    ['post', '/applications/a1/manager-review'],
  ] as const)('rejects spoofed role on %s %s', async (method, path) => {
    vi.stubEnv('RECRUITMENT_AUTH_MODE', 'enforced');
    const client = request(appFor());
    const response = await client[method](`/api/recruitment${path}`)
      .set('x-user-role', 'hr')
      .send({});
    expect(response.status).toBe(401);
  });

  it('does not let a role header elevate a verified executive', async () => {
    vi.stubEnv('RECRUITMENT_AUTH_MODE', 'enforced');
    const response = await request(appFor('executive'))
      .delete('/api/recruitment/candidates/c1')
      .set('x-user-role', 'hr');
    expect(response.status).toBe(403);
  });

  it('derives classifications and factors from persisted CandidateScore fields', () => {
    const record = normalizeCandidateScore({
      overall_score: 88,
      cultural_fit: 70,
      location_match: 90,
    });
    expect(record.screening_status).toBe('strong_match');
    expect(record.cultural_fit_score).toBe(70);
    expect(record.location_match_score).toBe(90);
  });

  it('queries newest KPI records and the persisted scoring timestamp', async () => {
    const scores = vi.fn().mockResolvedValue([]);
    const metrics = vi.fn().mockResolvedValue([]);
    __setRecruitmentTestDeps({
      prismaClient: {
        job: { findMany: vi.fn().mockResolvedValue([]) },
        application: { findMany: vi.fn().mockResolvedValue([]) },
        candidateScore: { findMany: scores },
        recruitmentMetric: { findMany: metrics },
      },
    });
    expect((await request(appFor()).get('/api/recruitment/overview')).status).toBe(200);
    expect(scores).toHaveBeenCalledWith({ orderBy: { scored_at: 'desc' } });
    expect(metrics).toHaveBeenCalledWith({ orderBy: { metric_date: 'desc' }, take: 12 });
  });

  it('does not advance an offer when no message was created', async () => {
    const update = vi.fn();
    __setRecruitmentTestDeps({
      prismaClient: {
        application: {
          findUnique: vi.fn().mockResolvedValue({
            candidate: { first_name: 'Fixture' },
            job: { title: 'Agent' },
          }),
          update,
        },
      },
      candidateScoringService: { sendTemplateMessageViaMeta: vi.fn().mockResolvedValue(null) },
    });
    const response = await request(appFor())
      .post('/api/recruitment/applications/a1/send-offer')
      .send({ salary: 1000, start_date: '2026-12-01' });
    expect(response.status).toBe(422);
    expect(update).not.toHaveBeenCalled();
  });

  it('returns a database failure instead of a successful empty lead list', async () => {
    const query = vi.fn().mockRejectedValue(new Error('database unavailable'));
    __setRecruitmentTestDeps({ prismaClient: { leadScore: { findMany: query } } });
    const response = await request(appFor()).get('/api/recruitment/leads?temperature=hot&jobId=j1');
    expect(response.status).toBe(500);
    expect(query).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { lead_temperature: 'HOT', job_id: 'j1' },
        orderBy: { overall_score: 'desc' },
      })
    );
  });

  it('does not report lead-score persistence success when writing fails', async () => {
    const create = vi.fn().mockRejectedValue(new Error('write rejected'));
    __setRecruitmentTestDeps({
      prismaClient: {
        leadScore: {
          findFirst: vi.fn().mockResolvedValue(null),
          create,
        },
      },
    });
    const response = await request(appFor())
      .post('/api/recruitment/leads/c1/calculate-score')
      .send({ jobId: 'j1', resumeScore: 80, conversationMessages: [] });
    expect(response.status).toBe(500);
    expect(create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          candidate_id: 'c1',
          job_id: 'j1',
        }),
      })
    );
  });

  it('uses the scheduling model and maps its public session shape', async () => {
    __setRecruitmentTestDeps({
      prismaClient: {
        interviewSchedule: {
          findUnique: vi.fn().mockResolvedValue({
            id: 's1',
            candidate_id: 'c1',
            job_id: 'j1',
            session_status: 'scheduled',
          }),
        },
      },
    });
    const response = await request(appFor()).get('/api/recruitment/interview/sessions/s1');
    expect(response.status).toBe(200);
    expect(response.body.session).toMatchObject({
      candidateId: 'c1',
      jobId: 'j1',
      status: 'scheduled',
    });
  });

  it('combines review notes into supported feedback and sets completed_at', async () => {
    const update = vi.fn().mockResolvedValue({ id: 'i1', status: 'completed' });
    __setRecruitmentTestDeps({ prismaClient: { interview: { update } } });
    const response = await request(appFor())
      .patch('/api/recruitment/interview/i1/status')
      .send({ status: 'completed', feedback: 'Reviewed', notes: 'Follow up' });
    expect(response.status).toBe(200);
    expect(update).toHaveBeenCalledWith({
      where: { id: 'i1' },
      data: {
        status: 'completed',
        feedback: 'Reviewed\nFollow up',
        completed_at: expect.any(Date),
        updatedAt: expect.any(Date),
      },
    });
  });

  it('extracts the supported candidate resume without a nonexistent upload relation', async () => {
    const findUnique = vi.fn().mockResolvedValue({ id: 'c1', resume_url: 'uploads/fixture.pdf' });
    const update = vi.fn().mockResolvedValue({ id: 'c1' });
    vi.spyOn(ResumeParserService, 'extractTextFromResume').mockResolvedValue({
      text: 'Fixture resume',
      method: 'native',
      pageCount: 1,
    });
    vi.spyOn(ResumeParserService, 'parseResumeText').mockReturnValue({
      skills: [],
      experience: [],
      education: [],
      contact: {},
    });
    __setRecruitmentTestDeps({ prismaClient: { candidate: { findUnique, update } } });
    const response = await request(appFor()).post('/api/recruitment/candidates/c1/extract-resume');
    expect(response.status).toBe(200);
    expect(findUnique).toHaveBeenCalledWith({ where: { id: 'c1' } });
    expect(update).toHaveBeenCalledWith({
      where: { id: 'c1' },
      data: { resume_text: 'Fixture resume' },
    });
  });

  it.each([true, false])('uses the single scoring-service notification outcome %s', async sent => {
    const send = vi.fn();
    const score = vi.fn().mockResolvedValue({
      overall_score: 80,
      screening_status: 'moderate_match',
      message_sent: sent,
    });
    __setRecruitmentTestDeps({
      prismaClient: { job: { findUnique: vi.fn().mockResolvedValue({ title: 'Agent' }) } },
      candidateScoringService: { scoreCandidateForJob: score, sendScoringResultViaMeta: send },
    });
    const response = await request(appFor())
      .post('/api/recruitment/jobs/j1/batch-score-and-notify')
      .send({ candidate_ids: ['c1'] });
    expect(response.status).toBe(200);
    expect(response.body.results.messaged).toBe(sent ? 1 : 0);
    expect(response.body.results.candidates[0].message_sent).toBe(sent);
    expect(send).not.toHaveBeenCalled();
  });
});
