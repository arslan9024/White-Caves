import { computeScreeningMetrics, buildRecruitmentOverview, buildOnboardingChecklist } from '../routes/recruitment.js';
import MessageTemplateService from '../services/MessageTemplateService.js';

let totalTests = 0;
let passedTests = 0;

function assert(condition, message) {
  if (!condition) {
    throw new Error(message || 'Assertion failed');
  }
}

function test(name, fn) {
  totalTests++;
  try {
    fn();
    passedTests++;
    console.log(`✅ ${name}`);
  } catch (error) {
    console.error(`❌ ${name}`);
    console.error(`   ${error.message}`);
  }
}

console.log('\n📦 Recruitment Route Helper Tests\n');

test('computeScreeningMetrics returns canonical and legacy keys', () => {
  const metrics = computeScreeningMetrics([
    { overall_score: 91, screening_status: 'strong_match', skills_score: 90, experience_score: 88, education_score: 80, cultural_fit_score: 84, location_match_score: 92 },
    { overall_score: 77, screening_status: 'moderate_match', skills_score: 78, experience_score: 79, education_score: 75, cultural_fit_score: 74, location_match_score: 80 },
    { overall_score: 62, screening_status: 'weak_match', skills_score: 63, experience_score: 61, education_score: 58, cultural_fit_score: 66, location_match_score: 70 },
    { overall_score: 22, screening_status: 'rejected', skills_score: 20, experience_score: 22, education_score: 30, cultural_fit_score: 26, location_match_score: 12 }
  ]);

  assert(metrics.strong_matches === 1, 'Should count strong matches');
  assert(metrics.moderate_matches === 1, 'Should count moderate matches');
  assert(metrics.weak_matches === 1, 'Should count weak matches');
  assert(metrics.rejected_matches === 1, 'Should count rejected matches');
  assert(metrics.good_matches === 1, 'Legacy alias should map to moderate matches');
  assert(metrics.potential_matches === 1, 'Legacy alias should map to weak matches');
  assert(metrics.no_match === 1, 'Legacy alias should map to rejected matches');
});

test('buildRecruitmentOverview aggregates pipeline totals', () => {
  const overview = buildRecruitmentOverview(
    [
      { id: 'job-1', title: 'Sales Agent', department: 'Sales', status: 'open', _count: { applications: 8 } },
      { id: 'job-2', title: 'HR Coordinator', department: 'HR', status: 'closed', _count: { applications: 4 } }
    ],
    [
      { status: 'applied' },
      { status: 'interview' },
      { status: 'offer' },
      { status: 'hired' },
      { status: 'rejected' }
    ],
    [
      { overall_score: 84, screening_status: 'moderate_match', skills_score: 80, experience_score: 82, education_score: 77, cultural_fit_score: 79, location_match_score: 85 }
    ]
  );

  assert(overview.totals.jobs === 2, 'Should count all jobs');
  assert(overview.totals.open_jobs === 1, 'Should count open jobs');
  assert(overview.totals.active_applications === 3, 'Should count non-final applications');
  assert(overview.totals.interview_pipeline === 1, 'Should count interview stage');
  assert(overview.totals.offer_pipeline === 1, 'Should count offer stage');
  assert(overview.totals.hired === 1, 'Should count hired stage');
});

test('buildOnboardingChecklist returns onboarding payload ready for Linda', () => {
  const checklist = buildOnboardingChecklist(
    { first_name: 'Fatima', last_name: 'Ali', email: 'fatima@example.com' },
    { title: 'Senior Frontend Developer', department: 'Engineering' },
    '2026-06-01'
  );

  assert(checklist.candidate_name === 'Fatima Ali', 'Should build candidate full name');
  assert(checklist.training_modules.length === 3, 'Should include training modules');
  assert(checklist.checklist_items.length >= 4, 'Should include checklist items');
});

test('onboarding message template renders expected fields', () => {
  const rendered = MessageTemplateService.render('onboarding_welcome', {
    candidate_name: 'Fatima Ali',
    company_name: 'White Caves Real Estate',
    job_title: 'Senior Frontend Developer',
    start_date: '2026-06-01',
    checklist_items: '• Bring Emirates ID',
    buddy_name: 'Sarah Johnson',
    training_modules: '• CRM Access Setup'
  });

  assert(rendered.includes('Fatima Ali'), 'Rendered onboarding message should include candidate name');
  assert(rendered.includes('Senior Frontend Developer'), 'Rendered onboarding message should include job title');
  assert(rendered.includes('Sarah Johnson'), 'Rendered onboarding message should include buddy name');
});

console.log(`\n✅ ${passedTests}/${totalTests} recruitment helper tests passed\n`);
process.exit(passedTests === totalTests ? 0 : 1);