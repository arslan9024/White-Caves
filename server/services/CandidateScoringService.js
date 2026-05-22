import { PrismaClient } from '@prisma/client';
import { ResumeParserService } from './ResumeParserService.js';
import MessageTemplateService from './MessageTemplateService.js';
import { WhatsAppMessage, WhatsAppContact } from '../lib/database.js';
import { SCORE_THRESHOLDS, SCREENING_STATUS } from '../constants/ScoreLevels.js';

const prisma = new PrismaClient();

/**
 * Candidate Scoring Service - Phase 1B
 * 
 * Implements a 5-factor scoring algorithm for resume screening:
 * 1. Skills Match (0-100) - Percentage of job-required skills found
 * 2. Experience Level (0-100) - Years of experience vs. job requirement
 * 3. Education Fit (0-100) - Degree type and field alignment
 * 4. Cultural Fit (0-100) - Company values indicators from resume
 * 5. Location Match (0-100) - Geographic alignment with job location
 * 
 * Overall Score = Weighted average of the 5 factors
 * Weights can be adjusted per job or using defaults
 */

export class CandidateScoringService {
  // Default weights for the 5-factor model (can be customized per job)
  static DEFAULT_WEIGHTS = {
    skills: 0.35,           // 35% - Most important for technical roles
    experience: 0.25,       // 25%
    education: 0.15,        // 15%
    cultural_fit: 0.15,     // 15%
    location_match: 0.10    // 10%
  };

  // Skill proficiency levels (used in experience calculations)
  static SKILL_CATEGORIES = {
    expert: { min_years: 5, weight: 1.0 },
    senior: { min_years: 3, weight: 0.85 },
    mid: { min_years: 1, weight: 0.7 },
    junior: { min_years: 0, weight: 0.5 }
  };

  /**
   * Score a single candidate against a specific job
   * This is the main entry point for scoring
   */
  static async scoreCandidateForJob(candidateId, jobId, weights = null) {
    try {
      // Fetch candidate and job details
      const candidate = await prisma.candidate.findUnique({
        where: { id: candidateId },
        include: { applications: true }
      });

      const job = await prisma.job.findUnique({
        where: { id: jobId }
      });

      if (!candidate || !job) {
        throw new Error('Candidate or Job not found');
      }

      // Use provided weights or defaults
      const finalWeights = weights || this.DEFAULT_WEIGHTS;

      // Calculate individual factor scores
      const skillsScore = this.calculateSkillsScore(candidate, job);
      const experienceScore = this.calculateExperienceScore(candidate, job);
      const educationScore = this.calculateEducationScore(candidate, job);
      const culturalScore = this.calculateCulturalFitScore(candidate, job);
      const locationScore = this.calculateLocationMatchScore(candidate, job);

      // Calculate weighted overall score
      const overallScore = Math.round(
        (skillsScore * finalWeights.skills) +
        (experienceScore * finalWeights.experience) +
        (educationScore * finalWeights.education) +
        (culturalScore * finalWeights.cultural_fit) +
        (locationScore * finalWeights.location_match)
      );

      // Determine screening status based on score
      const screeningStatus = this.determineScreeningStatus(overallScore);

      // Create scoring record in database
      const scoreRecord = await prisma.candidateScore.create({
        data: {
          candidate_id: candidateId,
          job_id: jobId,
          overall_score: overallScore,
          skills_score: skillsScore,
          experience_score: experienceScore,
          education_score: educationScore,
          cultural_fit_score: culturalScore,
          location_match_score: locationScore,
          scoring_method: 'rule_based_v1',
          screening_status: screeningStatus,
          feedback: this.generateFeedback({
            skills: skillsScore,
            experience: experienceScore,
            education: educationScore,
            cultural_fit: culturalScore,
            location_match: locationScore
          })
        }
      });

      // Trigger WhatsApp message if candidate has phone number
      if (candidate.phone_number || candidate.whatsapp_phone) {
        try {
          await this.sendScoringResultViaMeta(candidate, job, scoreRecord);
        } catch (whatsappError) {
          console.warn('Failed to send WhatsApp message:', whatsappError.message);
          // Don't fail the scoring if WhatsApp fails
        }
      }

      return scoreRecord;
    } catch (error) {
      console.error('Error scoring candidate:', error);
      throw error;
    }
  }

  /**
   * Send any recruitment template via WhatsApp
   */
  static async sendTemplateMessageViaMeta(candidate, templateId, variables, messageType = 'text') {
    try {
      const phone = candidate.whatsapp_phone || candidate.phone_number;
      if (!phone) return null;

      const formattedPhone = this.formatPhoneForWhatsApp(phone);
      const waId = formattedPhone.replace('+', '') + '@c.us';
      const messageBody = MessageTemplateService.render(templateId, variables);

      let contact = await WhatsAppContact.findOne({ waId });

      if (!contact) {
        contact = await WhatsAppContact.create({
          waId,
          phoneNumber: formattedPhone,
          name: candidate.first_name || candidate.email,
          lastMessageAt: new Date(),
          unreadCount: 0,
          conversationStatus: 'active'
        });
      } else {
        contact.lastMessageAt = new Date();
        await contact.save();
      }

      const message = await WhatsAppMessage.create({
        waId,
        phoneNumber: formattedPhone,
        contactName: candidate.first_name || 'Candidate',
        direction: 'outgoing',
        messageType,
        content: messageBody,
        status: 'sent',
        createdAt: new Date()
      });

      return message;
    } catch (error) {
      console.error('Error sending WhatsApp template message:', error);
      throw error;
    }
  }

  /**
   * Send screening result via WhatsApp
   * Uses the MessageTemplateService to render personalized messages
   */
  static async sendScoringResultViaMeta(candidate, job, scoreRecord) {
    try {
      const variables = {
        candidate_name: candidate.first_name || candidate.email || 'Candidate',
        job_title: job.title || 'the position',
        overall_score: Math.round(scoreRecord.overall_score),
        screening_status: MessageTemplateService.formatStatus(scoreRecord.screening_status),
        skills_score: Math.round(scoreRecord.skills_score),
        experience_score: Math.round(scoreRecord.experience_score),
        education_score: Math.round(scoreRecord.education_score),
        cultural_fit_score: Math.round(scoreRecord.cultural_fit_score),
        location_match_score: Math.round(scoreRecord.location_match_score),
        feedback: scoreRecord.feedback || 'Great potential!',
        next_action: MessageTemplateService.renderScreeningResult(
          candidate,
          job,
          scoreRecord
        ).split('🎯 *Next Steps:*\n')[1]?.split('\n\nIf you have any questions')[0] || 'We will contact you soon.'
      };

      const message = await this.sendTemplateMessageViaMeta(
        candidate,
        'screening_result',
        variables,
        'text'
      );

      const phone = candidate.whatsapp_phone || candidate.phone_number;
      const formattedPhone = this.formatPhoneForWhatsApp(phone);
      console.log(`✅ Screening result sent to ${formattedPhone} (Message ID: ${message?._id})`);

      return message;
    } catch (error) {
      console.error('Error sending WhatsApp scoring result:', error);
      throw error;
    }
  }

  /**
   * Format phone number to WhatsApp E.164 format
   * Handles various input formats
   */
  static formatPhoneForWhatsApp(phone) {
    // Remove common formatting characters
    let cleaned = phone.replace(/[\s\-()\.]/g, '');

    // Remove leading zeros
    if (cleaned.startsWith('0')) {
      cleaned = cleaned.substring(1);
    }

    // Add country code if missing (assume UAE +971)
    if (!cleaned.startsWith('+')) {
      if (cleaned.startsWith('971')) {
        cleaned = '+' + cleaned;
      } else {
        cleaned = '+971' + cleaned;
      }
    }

    return cleaned;
  }

  /**
   * Calculate Skills Match Score (0-100)
   * Based on percentage of job-required skills found in resume
   */
  static calculateSkillsScore(candidate, job) {
    try {
      // Parse candidate resume to extract skills
      const resumeData = ResumeParserService.parseResumeText(
        candidate.resume_text || ''
      );
      const candidateSkills = resumeData.skills.map(s => s.toLowerCase());

      // Parse job required skills
      const requiredSkills = (job.required_skills || []).map(s => s.toLowerCase());

      if (requiredSkills.length === 0) return 50; // Default if no requirements specified

      // Calculate skill match percentage
      const matchedSkills = requiredSkills.filter(skill =>
        candidateSkills.some(cSkill => cSkill.includes(skill) || skill.includes(cSkill))
      );

      const skillMatchPercentage = (matchedSkills.length / requiredSkills.length) * 100;

      // Bonus for having additional relevant skills not in requirements
      const additionalSkillsCount = candidateSkills.length - matchedSkills.length;
      const additionalBonus = Math.min(additionalSkillsCount * 2, 15); // Max 15% bonus

      return Math.min(Math.round(skillMatchPercentage + additionalBonus), 100);
    } catch (error) {
      console.error('Error calculating skills score:', error);
      return 0;
    }
  }

  /**
   * Calculate Experience Level Score (0-100)
   * Based on years of experience vs. job requirements
   */
  static calculateExperienceScore(candidate, job) {
    try {
      // Extract experience from resume
      const resumeData = ResumeParserService.parseResumeText(
        candidate.resume_text || ''
      );
      const experiences = resumeData.experience || [];

      // Calculate total years of relevant experience
      let totalYears = 0;
      experiences.forEach(exp => {
        const durationMatch = exp.duration?.match(/(\d+)/);
        if (durationMatch) {
          totalYears += parseInt(durationMatch[1]);
        }
      });

      // Default to 0 years if no experience found
      if (totalYears === 0 && experiences.length === 0) {
        totalYears = 0;
      } else if (totalYears === 0 && experiences.length > 0) {
        totalYears = experiences.length; // Estimate 1 year per job
      }

      // Score based on requirement levels
      let experienceScore = 0;

      // Typical job experience requirements
      // Entry-level: 0-2 years, Mid-level: 2-5 years, Senior: 5+ years
      if (totalYears === 0) {
        experienceScore = 30; // Entry-level candidate
      } else if (totalYears <= 2) {
        experienceScore = 60; // Junior candidate
      } else if (totalYears <= 5) {
        experienceScore = 85; // Mid-level candidate
      } else {
        experienceScore = 100; // Senior candidate
      }

      return experienceScore;
    } catch (error) {
      console.error('Error calculating experience score:', error);
      return 0;
    }
  }

  /**
   * Calculate Education Fit Score (0-100)
   * Based on degree type and field of study
   */
  static calculateEducationScore(candidate, job) {
    try {
      // Extract education from resume
      const resumeData = ResumeParserService.parseResumeText(
        candidate.resume_text || ''
      );
      const educations = resumeData.education || [];

      if (educations.length === 0) {
        return 40; // Candidate with no formal education listed
      }

      let highestScore = 0;

      // Degree hierarchy
      const degreeValues = {
        'phd': 100,
        'master': 90,
        'bachelor': 80,
        'associate': 60,
        'diploma': 50,
        'certificate': 40
      };

      educations.forEach(edu => {
        // Extract degree type
        const degreeText = edu.degree.toLowerCase();
        let degreeScore = 40; // Default

        Object.keys(degreeValues).forEach(degree => {
          if (degreeText.includes(degree)) {
            degreeScore = degreeValues[degree];
          }
        });

        // Check if field is relevant to job
        const fieldText = edu.field.toLowerCase();
        const jobDepartment = (job.department || '').toLowerCase();
        const jobTitle = (job.title || '').toLowerCase();

        let fieldBonus = 0;
        if (
          fieldText.includes('computer') || fieldText.includes('software') ||
          fieldText.includes('information') || fieldText.includes('engineering')
        ) {
          if (jobDepartment.includes('tech') || jobTitle.includes('developer') ||
              jobTitle.includes('engineer') || jobTitle.includes('programmer')) {
            fieldBonus = 10;
          }
        }

        const totalScore = Math.min(degreeScore + fieldBonus, 100);
        highestScore = Math.max(highestScore, totalScore);
      });

      return highestScore;
    } catch (error) {
      console.error('Error calculating education score:', error);
      return 40; // Default for error cases
    }
  }

  /**
   * Calculate Cultural Fit Score (0-100)
   * Based on indicators in resume (values, interests, previous roles)
   */
  static calculateCulturalFitScore(candidate, job) {
    try {
      const resumeText = (candidate.resume_text || '').toLowerCase();

      let culturalScore = 50; // Neutral baseline

      // Positive indicators
      const positiveIndicators = [
        'leadership', 'team', 'collaboration', 'innovation', 'problem-solving',
        'initiative', 'mentor', 'volunteer', 'community', 'agile', 'startup',
        'fast-paced', 'growth', 'learning', 'creative', 'dynamic'
      ];

      const positiveMatches = positiveIndicators.filter(indicator =>
        resumeText.includes(indicator)
      ).length;

      culturalScore += Math.min(positiveMatches * 3, 30); // Max +30

      // Company culture alignment (if specified in job description)
      const jobDescription = (job.description || '').toLowerCase();
      const descriptionKeywords = jobDescription.match(/\b\w+\b/g) || [];

      if (descriptionKeywords.length > 0) {
        const alignmentScore = descriptionKeywords.filter(keyword =>
          resumeText.includes(keyword) && keyword.length > 4
        ).length;

        culturalScore += Math.min(alignmentScore * 2, 15); // Max +15
      }

      // Negative indicators that might reduce score
      const redFlags = ['fired', 'terminated', 'lawsuit', 'scandal'];
      const redFlagMatches = redFlags.filter(flag =>
        resumeText.includes(flag)
      ).length;

      culturalScore -= redFlagMatches * 10;

      return Math.max(Math.min(culturalScore, 100), 0);
    } catch (error) {
      console.error('Error calculating cultural fit score:', error);
      return 50; // Neutral default
    }
  }

  /**
   * Calculate Location Match Score (0-100)
   * Based on geographic alignment with job location
   */
  static calculateLocationMatchScore(candidate, job) {
    try {
      const candidateLocation = (candidate.location || '').toLowerCase().trim();
      const jobLocation = (job.location || '').toLowerCase().trim();

      // If either location is not specified, give neutral score
      if (!candidateLocation || !jobLocation) {
        return 50;
      }

      // Exact match
      if (candidateLocation === jobLocation) {
        return 100;
      }

      // Same city/region but different state/country
      const candidateParts = candidateLocation.split(/[,\s]+/);
      const jobParts = jobLocation.split(/[,\s]+/);

      const matchedParts = candidateParts.filter(part =>
        jobParts.some(jobPart => jobPart === part)
      ).length;

      if (matchedParts > 0) {
        // Partial match (same city or region)
        if (candidateParts[0] === jobParts[0]) {
          return 95; // Same city
        }
        return 75; // Same state/country
      }

      // Check for remote work flexibility (if mentioned in resume or job)
      const resumeText = (candidate.resume_text || '').toLowerCase();
      const isRemoteCandidate = resumeText.includes('remote') || resumeText.includes('relocation');
      const isRemoteJob = jobLocation.includes('remote') || jobLocation.includes('anywhere');

      if (isRemoteCandidate && isRemoteJob) {
        return 90;
      }

      if (isRemoteJob) {
        return 80; // Job allows remote, candidate not stated as remote
      }

      if (isRemoteCandidate) {
        return 70; // Candidate willing to relocate, job is local
      }

      // Different locations with no match
      return 30;
    } catch (error) {
      console.error('Error calculating location match score:', error);
      return 50; // Neutral default
    }
  }

  /**
   * Determine screening status based on overall score
   */
  static determineScreeningStatus(score) {
    if (score >= SCORE_THRESHOLDS.EXCELLENT) return SCREENING_STATUS.STRONG_MATCH;
    if (score >= SCORE_THRESHOLDS.STRONG) return SCREENING_STATUS.MODERATE_MATCH;
    if (score >= SCORE_THRESHOLDS.FAIR) return SCREENING_STATUS.WEAK_MATCH;
    return SCREENING_STATUS.REJECTED;
  }

  /**
   * Generate human-readable feedback based on factor scores
   */
  static generateFeedback(scores) {
    const feedback = [];

    // Skills feedback
    if (scores.skills >= 85) {
      feedback.push('Excellent skills match with job requirements');
    } else if (scores.skills >= 70) {
      feedback.push('Good skills match; candidate has most required skills');
    } else if (scores.skills >= 50) {
      feedback.push('Moderate skills match; candidate may need training in some areas');
    } else {
      feedback.push('Weak skills match; significant skill gaps identified');
    }

    // Experience feedback
    if (scores.experience >= 85) {
      feedback.push('Strong experience level for this role');
    } else if (scores.experience >= 60) {
      feedback.push('Adequate experience; suitable for the position');
    } else {
      feedback.push('Limited experience; may require mentoring');
    }

    // Education feedback
    if (scores.education >= 90) {
      feedback.push('Excellent educational background');
    } else if (scores.education >= 75) {
      feedback.push('Solid educational credentials');
    } else if (scores.education >= 50) {
      feedback.push('Basic educational requirements met');
    } else {
      feedback.push('Limited formal education on record');
    }

    // Location feedback
    if (scores.location_match >= 90) {
      feedback.push('Perfect location alignment or remote flexibility');
    } else if (scores.location_match >= 70) {
      feedback.push('Good geographic fit');
    } else if (scores.location_match >= 50) {
      feedback.push('Location considerations may apply');
    }

    return feedback.join('. ');
  }

  /**
   * Batch score multiple candidates for a job
   * Returns sorted list of scores for screening pipeline
   */
  static async batchScoreCandidatesForJob(jobId, weights = null) {
    try {
      const job = await prisma.job.findUnique({
        where: { id: jobId },
        include: {
          applications: {
            include: { candidate: true },
            where: { status: { in: ['applied', 'screening'] } }
          }
        }
      });

      if (!job) {
        throw new Error('Job not found');
      }

      const scores = [];

      // Score each candidate
      for (const application of job.applications) {
        const score = await this.scoreCandidateForJob(
          application.candidate_id,
          jobId,
          weights
        );
        scores.push(score);
      }

      // Sort by overall score (highest first)
      scores.sort((a, b) => b.overall_score - a.overall_score);

      return scores;
    } catch (error) {
      console.error('Error batch scoring candidates:', error);
      throw error;
    }
  }

  /**
   * Get top candidates for a job
   * Returns candidates above a certain score threshold
   */
  static async getTopCandidatesForJob(jobId, threshold = 75, limit = 10) {
    try {
      const topCandidates = await prisma.candidateScore.findMany({
        where: {
          job_id: jobId,
          overall_score: { gte: threshold }
        },
        include: {
          candidate: true,
          job: true
        },
        orderBy: { overall_score: 'desc' },
        take: limit
      });

      return topCandidates;
    } catch (error) {
      console.error('Error fetching top candidates:', error);
      throw error;
    }
  }

  /**
   * Update job weights for scoring
   * Allows customization per job or department
   */
  static async updateJobScoringWeights(jobId, weights) {
    try {
      // Validate weights sum to 1.0
      const totalWeight = Object.values(weights).reduce((sum, w) => sum + w, 0);
      if (Math.abs(totalWeight - 1.0) > 0.01) {
        throw new Error('Weights must sum to 1.0');
      }

      // Store in job metadata or create a separate scoring config
      await prisma.job.update({
        where: { id: jobId },
        data: {
          scoring_weights: JSON.stringify(weights)
        }
      });

      return weights;
    } catch (error) {
      console.error('Error updating job scoring weights:', error);
      throw error;
    }
  }
}
