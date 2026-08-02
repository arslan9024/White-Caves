/**
 * @deprecated PRISMA MIGRATION — This Mongoose model is scheduled for removal.
 * Replacement: prisma/schema.prisma + src/lib/prisma.ts
 * Do NOT add new fields here. Use Prisma schema instead.
 */
import { prisma } from '../database.js';

export class JobModel {
  static async create(data) {
    return prisma.job.create({
      data: {
        title: data.title,
        description: data.description,
        department: data.department,
        location: data.location,
        salary_min: data.salary_min,
        salary_max: data.salary_max,
        status: data.status || 'open',
        required_skills: data.required_skills || [],
        experience_years: data.experience_years
      }
    });
  }

  static async findById(id) {
    return prisma.job.findUnique({
      where: { id },
      include: {
        applications: {
          include: {
            candidate: true
          }
        }
      }
    });
  }

  static async findAll(filters = {}) {
    return prisma.job.findMany({
      where: filters,
      include: {
        applications: true
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  static async findOpenJobs() {
    return prisma.job.findMany({
      where: { status: 'open' },
      include: {
        applications: true
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  static async update(id, data) {
    return prisma.job.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        department: data.department,
        location: data.location,
        salary_min: data.salary_min,
        salary_max: data.salary_max,
        status: data.status,
        required_skills: data.required_skills,
        experience_years: data.experience_years
      }
    });
  }

  static async delete(id) {
    return prisma.job.delete({
      where: { id }
    });
  }

  static async getApplicationCount(jobId) {
    return prisma.application.count({
      where: { job_id: jobId }
    });
  }

  static async getApplicationsByStatus(jobId, status) {
    return prisma.application.findMany({
      where: {
        job_id: jobId,
        status
      },
      include: {
        candidate: true
      }
    });
  }
}

export default JobModel;
