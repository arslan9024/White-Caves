import express from 'express';
import recruitmentRouter, {
  __setRecruitmentTestDeps,
  __resetRecruitmentTestDeps
} from '../routes/recruitment.js';

let totalTests = 0;
let passedTests = 0;

function assert(condition, message) {
  if (!condition) {
    throw new Error(message || 'Assertion failed');
  }
}

async function test(name, fn) {
  totalTests++;
  try {
    await fn();
    passedTests++;
    console.log(`✅ ${name}`);
  } catch (error) {
    console.error(`❌ ${name}`);
    console.error(`   ${error.message}`);
  }
}

function createApp() {
  const app = express();
  app.use(express.json());
  app.use('/api/recruitment', recruitmentRouter);
  return app;
}

async function withServer(run) {
  const app = createApp();
  const server = await new Promise((resolve) => {
    const s = app.listen(0, () => resolve(s));
  });

  const { port } = server.address();
  const baseUrl = `http://127.0.0.1:${port}`;

  try {
    await run(baseUrl);
  } finally {
    await new Promise((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
  }
}

console.log('\n🧪 Recruitment Routes Integration Tests\n');

const originalRecruitmentAuthMode = process.env.RECRUITMENT_AUTH_MODE;

await test('GET /jobs/:job_id/screening-metrics returns canonical + alias keys', async () => {
  const prismaMock = {
    candidateScore: {
      findMany: async () => ([
        {
          overall_score: 81,
          screening_status: 'moderate_match',
          skills_score: 84,
          experience_score: 79,
          education_score: 75,
          cultural_fit_score: 78,
          location_match_score: 83
        },
        {
          overall_score: 35,
          screening_status: 'rejected',
          skills_score: 32,
          experience_score: 37,
          education_score: 41,
          cultural_fit_score: 30,
          location_match_score: 34
        }
      ])
    }
  };

  __setRecruitmentTestDeps({ prismaClient: prismaMock });

  await withServer(async (baseUrl) => {
    const response = await fetch(`${baseUrl}/api/recruitment/jobs/job-123/screening-metrics`);
    const body = await response.json();

    assert(response.status === 200, 'Expected HTTP 200');
    assert(body.success === true, 'Expected success flag');
    assert(body.metrics.moderate_matches === 1, 'Expected moderate_matches count');
    assert(body.metrics.rejected_matches === 1, 'Expected rejected_matches count');
    assert(body.metrics.good_matches === 1, 'Expected alias good_matches count');
    assert(body.metrics.no_match === 1, 'Expected alias no_match count');
  });

  __resetRecruitmentTestDeps();
});

await test('GET /jobs/:job_id/screening-metrics rejects unauthenticated request when enforcement is enabled', async () => {
  process.env.RECRUITMENT_AUTH_MODE = 'enforced';

  const prismaMock = {
    candidateScore: {
      findMany: async () => []
    }
  };

  __setRecruitmentTestDeps({ prismaClient: prismaMock });

  await withServer(async (baseUrl) => {
    const response = await fetch(`${baseUrl}/api/recruitment/jobs/job-auth/screening-metrics`);
    const body = await response.json();

    assert(response.status === 401, 'Expected HTTP 401 for missing role');
    assert(body.error === 'Authentication required for recruitment routes', 'Expected auth required error');
  });

  process.env.RECRUITMENT_AUTH_MODE = originalRecruitmentAuthMode;
  __resetRecruitmentTestDeps();
});

await test('POST /jobs/:job_id/score-candidate blocks executive role for write access', async () => {
  process.env.RECRUITMENT_AUTH_MODE = 'enforced';

  __setRecruitmentTestDeps({
    candidateScoringService: {
      scoreCandidateForJob: async () => ({
        candidate_id: 'cand-x',
        job_id: 'job-x',
        screening_status: 'moderate_match'
      })
    }
  });

  await withServer(async (baseUrl) => {
    const response = await fetch(`${baseUrl}/api/recruitment/jobs/job-x/score-candidate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-role': 'executive'
      },
      body: JSON.stringify({ candidate_id: 'cand-x' })
    });

    const body = await response.json();
    assert(response.status === 403, 'Expected HTTP 403 for write role violation');
    assert(body.error.includes('Recruitment write access denied'), 'Expected write access denied message');
  });

  process.env.RECRUITMENT_AUTH_MODE = originalRecruitmentAuthMode;
  __resetRecruitmentTestDeps();
});

await test('POST /jobs/:job_id/score-candidate allows hr role when enforcement is enabled', async () => {
  process.env.RECRUITMENT_AUTH_MODE = 'enforced';

  __setRecruitmentTestDeps({
    candidateScoringService: {
      scoreCandidateForJob: async (candidateId, jobId) => ({
        id: 'score-auth-ok',
        candidate_id: candidateId,
        job_id: jobId,
        overall_score: 78,
        screening_status: 'moderate_match',
        skills_score: 80,
        experience_score: 77,
        education_score: 75,
        cultural_fit_score: 79,
        location_match_score: 81
      })
    }
  });

  await withServer(async (baseUrl) => {
    const response = await fetch(`${baseUrl}/api/recruitment/jobs/job-auth-ok/score-candidate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-role': 'hr'
      },
      body: JSON.stringify({ candidate_id: 'cand-auth-ok' })
    });

    const body = await response.json();
    assert(response.status === 201, 'Expected HTTP 201 for authorized HR request');
    assert(body.success === true, 'Expected success for authorized request');
    assert(body.score.screening_status === 'moderate_match', 'Expected canonical status in authorized response');
  });

  process.env.RECRUITMENT_AUTH_MODE = originalRecruitmentAuthMode;
  __resetRecruitmentTestDeps();
});

await test('POST /jobs/:job_id/score-candidate validates missing candidate_id', async () => {
  __setRecruitmentTestDeps({
    candidateScoringService: {
      scoreCandidateForJob: async () => {
        throw new Error('Should not be called when candidate_id is missing');
      }
    }
  });

  await withServer(async (baseUrl) => {
    const response = await fetch(`${baseUrl}/api/recruitment/jobs/job-abc/score-candidate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ weights: { skills: 0.35 } })
    });

    const body = await response.json();
    assert(response.status === 400, 'Expected HTTP 400 for missing candidate_id');
    assert(body.error === 'candidate_id is required', 'Expected missing candidate_id error');
  });

  __resetRecruitmentTestDeps();
});

await test('POST /jobs/:job_id/score-candidate returns canonical moderate_match', async () => {
  __setRecruitmentTestDeps({
    candidateScoringService: {
      scoreCandidateForJob: async (candidateId, jobId) => ({
        id: 'score-1',
        candidate_id: candidateId,
        job_id: jobId,
        overall_score: 78,
        screening_status: 'moderate_match',
        skills_score: 80,
        experience_score: 77,
        education_score: 75,
        cultural_fit_score: 79,
        location_match_score: 81
      })
    }
  });

  await withServer(async (baseUrl) => {
    const response = await fetch(`${baseUrl}/api/recruitment/jobs/job-xyz/score-candidate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ candidate_id: 'cand-99' })
    });

    const body = await response.json();
    assert(response.status === 201, 'Expected HTTP 201');
    assert(body.success === true, 'Expected success flag');
    assert(body.score.screening_status === 'moderate_match', 'Expected canonical status in response');
    assert(body.score.candidate_id === 'cand-99', 'Expected candidate id passthrough');
  });

  __resetRecruitmentTestDeps();
});

await test('POST /applications/:application_id/approve-offer updates status to offer_approved', async () => {
  const updatedStatuses = [];

  const prismaMock = {
    application: {
      findUnique: async () => ({
        id: 'app-approve-1',
        status: 'offer',
        notes: 'Offer sent',
        candidate_id: 'cand-approve-1',
        candidate: { id: 'cand-approve-1', first_name: 'Lina', email: 'lina@example.com' },
        job: { id: 'job-approve-1', title: 'HR Specialist', department: 'HR' }
      }),
      update: async ({ data }) => {
        updatedStatuses.push(data.status);
        return { status: data.status };
      }
    }
  };

  __setRecruitmentTestDeps({ prismaClient: prismaMock });

  await withServer(async (baseUrl) => {
    const response = await fetch(`${baseUrl}/api/recruitment/applications/app-approve-1/approve-offer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ approved_by: 'HR Director', approval_note: 'Comp band confirmed.' })
    });
    const body = await response.json();

    assert(response.status === 200, 'Expected HTTP 200 for offer approval');
    assert(body.status === 'offer_approved', 'Expected offer_approved status');
    assert(updatedStatuses[0] === 'offer_approved', 'Expected database update to offer_approved');
  });

  __resetRecruitmentTestDeps();
});

await test('POST /applications/:application_id/respond-offer accept records accepted state', async () => {
  const updates = [];
  const candidateUpdates = [];

  const prismaMock = {
    application: {
      findUnique: async () => ({
        id: 'app-respond-1',
        status: 'offer_approved',
        notes: 'Offer approved',
        candidate_id: 'cand-respond-1',
        candidate: { id: 'cand-respond-1', first_name: 'Omar', email: 'omar@example.com' },
        job: { id: 'job-respond-1', title: 'Sales Manager', department: 'Sales' }
      }),
      update: async ({ data }) => {
        updates.push(data.status);
        return { status: data.status };
      }
    },
    candidate: {
      update: async ({ data }) => {
        candidateUpdates.push(data.status);
        return { status: data.status };
      }
    }
  };

  __setRecruitmentTestDeps({ prismaClient: prismaMock });

  await withServer(async (baseUrl) => {
    const response = await fetch(`${baseUrl}/api/recruitment/applications/app-respond-1/respond-offer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ decision: 'accept', response_note: 'Excited to join.' })
    });
    const body = await response.json();

    assert(response.status === 200, 'Expected HTTP 200 for accepted offer');
    assert(body.status === 'offer_accepted', 'Expected offer_accepted application state');
    assert(body.candidate_status === 'selected', 'Expected candidate to remain selected before onboarding');
    assert(updates[0] === 'offer_accepted', 'Expected persisted offer_accepted status');
    assert(candidateUpdates[0] === 'selected', 'Expected persisted candidate selected status');
  });

  __resetRecruitmentTestDeps();
});

await test('POST /applications/:application_id/start-onboarding rejects non-accepted offer status', async () => {
  const prismaMock = {
    application: {
      findUnique: async () => ({
        id: 'app-onboarding-1',
        status: 'offer',
        candidate_id: 'cand-onboarding-1',
        candidate: { id: 'cand-onboarding-1', first_name: 'Maya', email: 'maya@example.com' },
        job: { id: 'job-onboarding-1', title: 'Recruiter', department: 'HR' }
      })
    }
  };

  __setRecruitmentTestDeps({ prismaClient: prismaMock });

  await withServer(async (baseUrl) => {
    const response = await fetch(`${baseUrl}/api/recruitment/applications/app-onboarding-1/start-onboarding`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ start_date: '2026-06-15' })
    });
    const body = await response.json();

    assert(response.status === 409, 'Expected HTTP 409 when onboarding starts before acceptance');
    assert(body.error.includes('Onboarding can only start after offer approval/acceptance'), 'Expected onboarding precondition error');
  });

  __resetRecruitmentTestDeps();
});

console.log(`\n✅ ${passedTests}/${totalTests} recruitment route integration tests passed\n`);
process.env.RECRUITMENT_AUTH_MODE = originalRecruitmentAuthMode;
process.exit(passedTests === totalTests ? 0 : 1);
