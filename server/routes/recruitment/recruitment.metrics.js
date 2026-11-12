/**
 * recruitment.metrics.js — Pure screening metrics, KPI trends & CSV export helpers
 * Extracted from recruitment.js (Single Purpose File decomposition)
 */
const OFFER_PIPELINE_STATUSES = ['offer', 'offer_approved', 'offer_accepted'];

export function computeScreeningMetrics(scores = [], options = {}) {
  const includeLegacyAliases = options.includeLegacyAliases === true;

  const withOptionalLegacyAliases = metrics => {
    if (!includeLegacyAliases) {
      return metrics;
    }

    return {
      ...metrics,
      good_matches: metrics.moderate_matches,
      potential_matches: metrics.weak_matches,
      no_match: metrics.rejected_matches,
    };
  };

  if (!scores.length) {
    return withOptionalLegacyAliases({
      total_candidates: 0,
      strong_matches: 0,
      moderate_matches: 0,
      weak_matches: 0,
      rejected_matches: 0,
      average_score: 0,
      median_score: 0,
      factor_averages: {
        skills: 0,
        experience: 0,
        education: 0,
        cultural_fit: 0,
        location_match: 0,
      },
      score_distribution: {
        very_high: 0,
        high: 0,
        medium: 0,
        low: 0,
        very_low: 0,
      },
    });
  }

  const statusCounts = {
    strong_match: 0,
    moderate_match: 0,
    weak_match: 0,
    rejected: 0,
  };

  let totalScore = 0;
  const sortedScores = [];

  scores.forEach(score => {
    if (statusCounts[score.screening_status] !== undefined) {
      statusCounts[score.screening_status]++;
    }
    totalScore += score.overall_score || 0;
    sortedScores.push(score.overall_score || 0);
  });

  sortedScores.sort((a, b) => a - b);
  const medianScore =
    sortedScores.length % 2 === 0
      ? (sortedScores[sortedScores.length / 2 - 1] + sortedScores[sortedScores.length / 2]) / 2
      : sortedScores[Math.floor(sortedScores.length / 2)];

  return withOptionalLegacyAliases({
    total_candidates: scores.length,
    strong_matches: statusCounts.strong_match,
    moderate_matches: statusCounts.moderate_match,
    weak_matches: statusCounts.weak_match,
    rejected_matches: statusCounts.rejected,
    average_score: Math.round(totalScore / scores.length),
    median_score: Math.round(medianScore),
    factor_averages: {
      skills: Math.round(scores.reduce((sum, s) => sum + (s.skills_score || 0), 0) / scores.length),
      experience: Math.round(
        scores.reduce((sum, s) => sum + (s.experience_score || 0), 0) / scores.length
      ),
      education: Math.round(
        scores.reduce((sum, s) => sum + (s.education_score || 0), 0) / scores.length
      ),
      cultural_fit: Math.round(
        scores.reduce((sum, s) => sum + (s.cultural_fit_score || 0), 0) / scores.length
      ),
      location_match: Math.round(
        scores.reduce((sum, s) => sum + (s.location_match_score || 0), 0) / scores.length
      ),
    },
    score_distribution: (() => {
      const dist = { very_high: 0, high: 0, medium: 0, low: 0, very_low: 0 };
      for (const s of scores) {
        const val = s.overall_score || 0;
        if (val >= 85) dist.very_high++;
        else if (val >= 75) dist.high++;
        else if (val >= 50) dist.medium++;
        else if (val >= 25) dist.low++;
        else dist.very_low++;
      }
      return dist;
    })(),
  });
}

export function buildRecruitmentOverview(jobs = [], applications = [], scores = []) {
  const metrics = computeScreeningMetrics(scores);
  const openJobs = jobs.filter(job => job.status === 'open');

  // 300% Acceleration Protocol: Single pass O(n) application pipeline categorization
  const offerStatusesSet = new Set(OFFER_PIPELINE_STATUSES);
  let active_applications = 0;
  let interview_pipeline = 0;
  let offer_pipeline = 0;
  let hired = 0;

  for (const app of applications) {
    const st = app.status;
    if (st !== 'hired' && st !== 'rejected') active_applications++;
    if (st === 'interview') interview_pipeline++;
    if (offerStatusesSet.has(st)) offer_pipeline++;
    if (st === 'hired') hired++;
  }

  return {
    totals: {
      jobs: jobs.length,
      open_jobs: openJobs.length,
      active_applications,
      interview_pipeline,
      offer_pipeline,
      hired,
    },
    screening: metrics,
    recent_jobs: jobs.slice(0, 5).map(job => ({
      id: job.id,
      title: job.title,
      department: job.department,
      status: job.status,
      applications: job._count?.applications || 0,
    })),
  };
}

export function buildKpiTrends(recruitmentMetrics = []) {
  if (!recruitmentMetrics.length) {
    return {
      latest: {
        avg_time_to_hire: 0,
        avg_cost_per_hire: 0,
        automation_percentage: 0,
      },
      deltas: {
        time_to_hire_days: 0,
        cost_per_hire: 0,
        automation_percentage: 0,
      },
      points: [],
    };
  }

  const sorted = [...recruitmentMetrics].sort(
    (a, b) =>
      new Date(a.metric_date || a.createdAt || 0) - new Date(b.metric_date || b.createdAt || 0)
  );

  const latest = sorted[sorted.length - 1];
  const previous = sorted.length > 1 ? sorted[sorted.length - 2] : null;
  const toNumber = value => (Number.isFinite(Number(value)) ? Number(value) : 0);

  return {
    latest: {
      avg_time_to_hire: toNumber(latest.avg_time_to_hire),
      avg_cost_per_hire: toNumber(latest.avg_cost_per_hire),
      automation_percentage: toNumber(latest.automation_percentage),
    },
    deltas: {
      time_to_hire_days: previous
        ? toNumber(latest.avg_time_to_hire) - toNumber(previous.avg_time_to_hire)
        : 0,
      cost_per_hire: previous
        ? toNumber(latest.avg_cost_per_hire) - toNumber(previous.avg_cost_per_hire)
        : 0,
      automation_percentage: previous
        ? toNumber(latest.automation_percentage) - toNumber(previous.automation_percentage)
        : 0,
    },
    points: sorted.slice(-6).map(metric => ({
      date: metric.metric_date || metric.createdAt,
      avg_time_to_hire: toNumber(metric.avg_time_to_hire),
      avg_cost_per_hire: toNumber(metric.avg_cost_per_hire),
      automation_percentage: toNumber(metric.automation_percentage),
    })),
  };
}

export function buildKpiTrendExportRows(kpiTrends = {}) {
  const points = Array.isArray(kpiTrends.points) ? kpiTrends.points : [];
  return points.map(point => ({
    date: point.date,
    avg_time_to_hire: point.avg_time_to_hire,
    avg_cost_per_hire: point.avg_cost_per_hire,
    automation_percentage: point.automation_percentage,
  }));
}

export function toCsv(rows = []) {
  if (!rows.length) {
    return 'date,avg_time_to_hire,avg_cost_per_hire,automation_percentage\n';
  }

  const headers = Object.keys(rows[0]);
  const escapeCell = value => `"${String(value ?? '').replace(/"/g, '""')}"`;
  const lines = rows.map(row => headers.map(header => escapeCell(row[header])).join(','));
  return `${headers.join(',')}\n${lines.join('\n')}\n`;
}

export function buildOnboardingChecklist(candidate, job, startDate) {
  const fullName =
    [candidate.first_name, candidate.last_name].filter(Boolean).join(' ') ||
    candidate.email ||
    'Candidate';
  return {
    candidate_name: fullName,
    company_name: 'White Caves Real Estate',
    job_title: job.title,
    start_date: startDate,
    buddy_name: 'Sarah Johnson',
    training_modules: [
      'HR Orientation',
      'CRM Access Setup',
      `${job.department || 'Department'} Workflow Training`,
    ],
    checklist_items: [
      'Bring Emirates ID and work authorization documents',
      'Sign HR and payroll documents',
      'Collect laptop and access credentials from IT',
      'Attend manager introduction and workflow briefing',
    ],
  };
}
