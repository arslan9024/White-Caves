# Tuesday Recruitment API Specification

**Updated:** May 22, 2026
**Scope:** Nancy scoring, Linda messaging, Zoe metrics

## Objectives

- Standardize the recruitment API surface already implemented under `server/routes/recruitment.js`
- Define canonical status values for candidate screening and messaging flows
- Document response contracts needed by Nancy, Linda, and Zoe consumers

## Canonical Screening Statuses

The system now treats these values as canonical:

- `strong_match`
- `moderate_match`
- `weak_match`
- `rejected`
- `declined_interview`

Backward-compatible aliases are disabled by default and can be requested temporarily:

- `good_matches` maps to `moderate_matches`
- `potential_matches` maps to `weak_matches`
- `no_match` maps to `rejected_matches`

## Core Endpoints

### `POST /api/recruitment/jobs/:job_id/score-candidate`

Scores a single candidate against a job.

Request body:

```json
{
  "candidate_id": "cand_123",
  "weights": {
    "skills": 0.35,
    "experience": 0.25,
    "education": 0.15,
    "cultural_fit": 0.15,
    "location_match": 0.10
  }
}
```

Response:

```json
{
  "success": true,
  "score": {
    "candidate_id": "cand_123",
    "job_id": "job_456",
    "overall_score": 82,
    "screening_status": "moderate_match",
    "skills_score": 88,
    "experience_score": 79,
    "education_score": 76,
    "cultural_fit_score": 80,
    "location_match_score": 90,
    "feedback": "Good skills match; candidate has most required skills. Adequate experience; suitable for the position."
  }
}
```

### `POST /api/recruitment/jobs/:job_id/batch-score`

Scores all candidates for a job and returns ranked results.

Response:

```json
{
  "success": true,
  "job_id": "job_456",
  "count": 24,
  "scores": [
    {
      "candidate_id": "cand_001",
      "overall_score": 91,
      "screening_status": "strong_match"
    },
    {
      "candidate_id": "cand_002",
      "overall_score": 82,
      "screening_status": "moderate_match"
    }
  ]
}
```

### `GET /api/recruitment/jobs/:job_id/top-candidates`

Query params:

- `threshold` default `75`
- `limit` default `10`

Returns only candidates above the requested score threshold.

### `GET /api/recruitment/overview`

Returns aggregate recruitment dashboard payload with KPI trend metrics.

Trend payload fields:

- `overview.kpi_trends.latest.avg_time_to_hire`
- `overview.kpi_trends.latest.avg_cost_per_hire`
- `overview.kpi_trends.latest.automation_percentage`
- `overview.kpi_trends.deltas.time_to_hire_days`
- `overview.kpi_trends.deltas.cost_per_hire`
- `overview.kpi_trends.points` (up to 6 recent trend points)

### `GET /api/recruitment/overview/export`

Exports recruitment KPI trend history as CSV for executive reporting.

Response:

- `Content-Type: text/csv`
- `Content-Disposition: attachment; filename=recruitment-kpi-trends-YYYY-MM-DD.csv`

### `GET /api/recruitment/jobs/:job_id/screening-metrics`

Returns canonical metric keys by default.

Optional query params:

- `include_legacy_aliases` default `false`

Response shape:

```json
{
  "success": true,
  "job_id": "job_456",
  "metrics": {
    "total_candidates": 24,
    "strong_matches": 4,
    "moderate_matches": 6,
    "weak_matches": 9,
    "rejected_matches": 5,
    "average_score": 68,
    "median_score": 70,
    "factor_averages": {
      "skills": 71,
      "experience": 64,
      "education": 66,
      "cultural_fit": 73,
      "location_match": 78
    },
    "score_distribution": {
      "very_high": 4,
      "high": 6,
      "medium": 9,
      "low": 5,
      "very_low": 5
    }
  }
}
```

### `POST /api/recruitment/jobs/:job_id/send-whatsapp-results`

Triggers Linda-compatible WhatsApp result messages for already scored candidates.

Response contract:

```json
{
  "success": true,
  "sent": 18,
  "skipped": 6,
  "failed": 0
}
```

### `POST /api/recruitment/jobs/:job_id/batch-score-and-notify`

Runs scoring then immediately sends Linda messages to contactable candidates.

### `GET /api/recruitment/whatsapp/templates/production-validation`

Runs Linda template production-readiness checks.

Query params:

- `template_id` optional single-template validation
- `max_body_length` optional character cap override (default `3500`)

Response shape:

```json
{
  "success": true,
  "summary": {
    "total_templates": 7,
    "valid_templates": 7,
    "invalid_templates": 0,
    "checked_at": "2026-05-22T00:00:00.000Z"
  },
  "templates": []
}
```

### `GET /api/recruitment/jobs/:job_id/manager-shortlist`

Returns manager shortlist recommendations derived from candidate scores.

Query params:

- `min_score` default `70`
- `limit` default `20`

### `POST /api/recruitment/applications/:application_id/manager-review`

Records manager review decisions.

Request body:

```json
{
  "decision": "shortlist",
  "review_note": "Proceed to interview panel"
}
```

Allowed decisions: `shortlist`, `hold`, `reject`.

## Integration Expectations

### Nancy

- Owns candidate, job, and score persistence
- Treats `moderate_match` as interview-review eligible
- Uses score details for recruiter review screens

### Linda

- Receives only contactable candidates with `phone_number` or `whatsapp_phone`
- Uses rendered message templates from `MessageTemplateService`
- Logs outbound messages into WhatsApp collections

### Zoe

- Reads aggregate metrics only
- Should migrate consumers to canonical keys first, then drop aliases later

## Deprecation Plan

Legacy keys are now opt-in compatibility fields only:

1. Use canonical keys in all new UI work.
2. Use `include_legacy_aliases=true` only for temporary bridge integrations.
3. Remove alias compatibility mode after all integrations confirm canonical usage.
