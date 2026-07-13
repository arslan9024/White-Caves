import { prisma } from '../database.js';

export class CandidateScoreModel {
  static async create(data) {
    return prisma.candidateScore.create({
      data: {
        candidate_id: data.candidate_id,
        overall_score: data.overall_score || 0,
        skills_score: data.skills_score,
        experience_score: data.experience_score,
        cultural_fit: data.cultural_fit,
        education_score: data.education_score,
        location_match: data.location_match,
        scoring_method: data.scoring_method || 'rule_based',
        feedback: data.feedback
      }
    });
  }

  static async findLatestByCandidate(candidateId) {
    return prisma.candidateScore.findFirst({
      where: { candidate_id: candidateId },
      orderBy: { scored_at: 'desc' }
    });
  }

  static async findByCandidate(candidateId) {
    return prisma.candidateScore.findMany({
      where: { candidate_id: candidateId },
      orderBy: { scored_at: 'desc' }
    });
  }

  static async findById(id) {
    return prisma.candidateScore.findUnique({
      where: { id }
    });
  }

  static async update(id, data) {
    return prisma.candidateScore.update({
      where: { id },
      data: {
        overall_score: data.overall_score,
        skills_score: data.skills_score,
        experience_score: data.experience_score,
        cultural_fit: data.cultural_fit,
        education_score: data.education_score,
        location_match: data.location_match,
        feedback: data.feedback
      }
    });
  }

  static async getScoreDistribution() {
    return prisma.candidateScore.groupBy({
      by: ['scoring_method'],
      _count: {
        id: true
      },
      _avg: {
        overall_score: true
      }
    });
  }

  static async getHighScoredCandidates(minScore = 70) {
    return prisma.candidateScore.findMany({
      where: {
        overall_score: { gte: minScore }
      },
      include: {
        candidate: true
      },
      orderBy: { overall_score: 'desc' }
    });
  }

  static async getReviewQueueCandidates(minScore = 40, maxScore = 70) {
    return prisma.candidateScore.findMany({
      where: {
        overall_score: {
          gte: minScore,
          lte: maxScore
        }
      },
      include: {
        candidate: true
      },
      orderBy: { overall_score: 'desc' }
    });
  }
}

export default CandidateScoreModel;
