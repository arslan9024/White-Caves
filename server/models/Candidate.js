import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class CandidateModel {
  static async create(data) {
    return prisma.candidate.create({
      data: {
        email: data.email,
        phone: data.phone,
        first_name: data.first_name,
        last_name: data.last_name,
        location: data.location,
        linkedin_url: data.linkedin_url,
        resume_url: data.resume_url,
        resume_text: data.resume_text,
        source: data.source || 'manual_upload',
        status: data.status || 'new',
        notes: data.notes
      }
    });
  }

  static async findById(id) {
    return prisma.candidate.findUnique({
      where: { id },
      include: {
        applications: true,
        scores: true,
        interviews: true
      }
    });
  }

  static async findByEmail(email) {
    return prisma.candidate.findUnique({
      where: { email }
    });
  }

  static async findAll(filters = {}) {
    return prisma.candidate.findMany({
      where: filters,
      include: {
        applications: true,
        scores: { orderBy: { scored_at: 'desc' }, take: 1 }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  static async update(id, data) {
    return prisma.candidate.update({
      where: { id },
      data: {
        email: data.email,
        phone: data.phone,
        first_name: data.first_name,
        last_name: data.last_name,
        location: data.location,
        linkedin_url: data.linkedin_url,
        resume_url: data.resume_url,
        resume_text: data.resume_text,
        status: data.status,
        notes: data.notes
      }
    });
  }

  static async delete(id) {
    return prisma.candidate.delete({
      where: { id }
    });
  }

  static async updateStatus(id, status) {
    return prisma.candidate.update({
      where: { id },
      data: { status }
    });
  }

  static async getWithLatestScore(id) {
    return prisma.candidate.findUnique({
      where: { id },
      include: {
        scores: {
          orderBy: { scored_at: 'desc' },
          take: 1
        },
        applications: true,
        interviews: true
      }
    });
  }
}

export default CandidateModel;
