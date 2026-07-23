/**
 * Scoring Constants - Priority 5
 * Centralized score thresholds and status enums
 */
export const SCORE_THRESHOLDS = {
  EXCELLENT: 85,
  STRONG: 75,
  GOOD: 65,
  FAIR: 50,
  POOR: 0
};

export const SCREENING_STATUS = {
  PENDING: 'pending',
  STRONG_MATCH: 'strong_match',
  MODERATE_MATCH: 'moderate_match',
  WEAK_MATCH: 'weak_match',
  REJECTED: 'rejected',
  DECLINED_INTERVIEW: 'declined_interview'
};

export const INTERVIEW_STATUS = {
  PENDING: 'pending_scheduling',
  SCHEDULED: 'scheduled',
  IN_PROGRESS: 'in-progress',
  COMPLETED: 'completed',
  NO_SHOW: 'no_show',
  RESCHEDULED: 'rescheduled',
  DECLINED: 'declined',
  CANCELLED: 'cancelled'
};

export const DEGREE_HIERARCHY = {
  'PHD': 5,
  'MASTER': 4,
  'BACHELOR': 3,
  'DIPLOMA': 2,
  'HIGHSCHOOL': 1,
  'OTHER': 0
};

export const INTERVIEW_DURATION_MINUTES = 45;
export const DEFAULT_EDUCATION_SCORE = 40;
export const RESUME_CACHE_TTL_MS = 3600000;
export const WHATSAPP_NUMBER = '+971505110636';

export default {
  SCORE_THRESHOLDS,
  SCREENING_STATUS,
  INTERVIEW_STATUS,
  DEGREE_HIERARCHY,
  INTERVIEW_DURATION_MINUTES,
  DEFAULT_EDUCATION_SCORE,
  RESUME_CACHE_TTL_MS,
  WHATSAPP_NUMBER
};
