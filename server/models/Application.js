import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class ApplicationModel {
  static async create(data) {
    return prisma.application.create({
      data: {
        candidate_id: data.candidate_id,
        job_id: data.job_id,
        status: data.status || 'applied',
        notes: data.notes
      },
      include: {
        candidate: true,
        job: true
      }
    });
  }

  static async findById(id) {
    return prisma.application.findUnique({
      where: { id },
      include: {
        candidate: true,
        job: true
      }
    });
  }

  static async findByJobAndCandidate(jobId, candidateId) {
    return prisma.application.findFirst({
      where: {
        job_id: jobId,
        candidate_id: candidateId
      }
    });
  }

  static async findAll(filters = {}) {
    return prisma.application.findMany({
      where: filters,
      include: {
        candidate: true,
        job: true
      },
      orderBy: { applied_at: 'desc' }
    });
  }

  static async findByJobId(jobId) {
    return prisma.application.findMany({
      where: { job_id: jobId },
      include: {
        candidate: true
      },
      orderBy: { applied_at: 'desc' }
    });
  }

  static async findByCandidateId(candidateId) {
    return prisma.application.findMany({
      where: { candidate_id: candidateId },
      include: {
        job: true
      },
      orderBy: { applied_at: 'desc' }
    });
  }

  static async updateStatus(id, status) {
    return prisma.application.update({
      where: { id },
      data: { status }
    });
  }

  static async updateWhatsAppStatus(id, msgId) {
    return prisma.application.update({
      where: { id },
      data: {
        whatsapp_sent: true,
        whatsapp_msg_id: msgId
      }
    });
  }

  static async update(id, data) {
    return prisma.application.update({
      where: { id },
      data: {
        status: data.status,
        notes: data.notes,
        whatsapp_sent: data.whatsapp_sent,
        whatsapp_msg_id: data.whatsapp_msg_id
      }
    });
  }

  static async delete(id) {
    return prisma.application.delete({
      where: { id }
    });
  }

  static async getApplicationsByStatus(status) {
    return prisma.application.findMany({
      where: { status },
      include: {
        candidate: true,
        job: true
      }
    });
  }

  static async countByStatus(status) {
    return prisma.application.count({
      where: { status }
    });
  }
}

export default ApplicationModel;
