/**
 * Leads Service
 * Business logic for lead management
 */

import { prisma } from '../database';
import { sanitizeString } from '../utils/sanitize';

const DEFAULT_LEAD_STATUS = 'new';
const DEFAULT_LEAD_SOURCE = 'direct';

/** Input for creating a new lead */
interface CreateLeadInput {
  name: string;
  email?: string;
  phone?: string;
  source?: string;
  status?: string;
  propertyId?: string;
  notes?: string;
}

/** Input for updating an existing lead */
interface UpdateLeadInput {
  name?: string;
  email?: string;
  phone?: string;
  source?: string;
  status?: string;
  propertyId?: string;
  notes?: string;
  assignedToId?: string;
}

export class LeadsService {
  /**
   * Get all leads with filters
   */
  async getAllLeads(filters?: { status?: string; source?: string }) {
    const where: Record<string, unknown> = {};
    if (filters?.status) where.status = filters.status;
    if (filters?.source) where.source = filters.source;

    return prisma.lead.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        assignedTo: { select: { id: true, name: true, email: true } },
        property: { select: { id: true, title: true, location: true } },
      },
    });
  }

  /**
   * Get lead by ID
   */
  async getLeadById(id: string) {
    return prisma.lead.findUnique({
      where: { id },
      include: {
        assignedTo: { select: { id: true, name: true, email: true } },
        property: { select: { id: true, title: true, location: true } },
      },
    });
  }

  /**
   * Create new lead
   */
  async createLead(leadData: CreateLeadInput) {
    if (!leadData.name || !leadData.name.trim()) {
      throw new Error('Lead name is required');
    }

    const payload = {
      name: sanitizeString(leadData.name.trim()),
      email: leadData.email?.trim().toLowerCase() || null,
      phone: leadData.phone?.trim() || null,
      source: leadData.source || DEFAULT_LEAD_SOURCE,
      status: leadData.status || DEFAULT_LEAD_STATUS,
      propertyId: leadData.propertyId || null,
      notes: leadData.notes ? sanitizeString(leadData.notes) : null,
    };

    return prisma.lead.create({
      data: payload,
      include: {
        assignedTo: { select: { id: true, name: true, email: true } },
      },
    });
  }

  /**
   * Update lead
   */
  async updateLead(id: string, updateData: UpdateLeadInput) {
    const existing = await prisma.lead.findUnique({ where: { id }, select: { id: true } });
    if (!existing) return null;

    const payload: Record<string, unknown> = {};
    if (updateData.name !== undefined) payload.name = sanitizeString(updateData.name.trim());
    if (updateData.email !== undefined) payload.email = updateData.email ? updateData.email.trim().toLowerCase() : null;
    if (updateData.phone !== undefined) payload.phone = updateData.phone ? updateData.phone.trim() : null;
    if (updateData.source !== undefined) payload.source = updateData.source;
    if (updateData.status !== undefined) payload.status = updateData.status;
    if (updateData.propertyId !== undefined) payload.propertyId = updateData.propertyId || null;
    if (updateData.notes !== undefined) payload.notes = updateData.notes ? sanitizeString(updateData.notes) : null;
    if (updateData.assignedToId !== undefined) payload.assignedToId = updateData.assignedToId || null;

    return prisma.lead.update({
      where: { id },
      data: payload,
      include: {
        assignedTo: { select: { id: true, name: true, email: true } },
      },
    });
  }

  /**
   * Delete lead
   */
  async deleteLead(id: string) {
    const existing = await prisma.lead.findUnique({ where: { id }, select: { id: true } });
    if (!existing) return false;

    await prisma.lead.delete({ where: { id } });
    return true;
  }

  /**
   * Convert lead to client
   */
  async convertLeadToClient(leadId: string) {
    const existing = await prisma.lead.findUnique({ where: { id: leadId }, select: { id: true } });
    if (!existing) return null;

    return prisma.lead.update({
      where: { id: leadId },
      data: { status: 'won' },
      include: {
        assignedTo: { select: { id: true, name: true, email: true } },
      },
    });
  }

  /**
   * Get lead statistics
   */
  async getLeadStatistics() {
    const [total, byStatusRows, bySourceRows] = await Promise.all([
      prisma.lead.count(),
      prisma.lead.groupBy({ by: ['status'], _count: { _all: true } }),
      prisma.lead.groupBy({ by: ['source'], _count: { _all: true } }),
    ]);

    const byStatus: Record<string, number> = {};
    byStatusRows.forEach((row) => {
      byStatus[row.status] = row._count._all;
    });

    const bySource: Record<string, number> = {};
    bySourceRows.forEach((row) => {
      bySource[row.source] = row._count._all;
    });

    return {
      total,
      byStatus,
      bySource,
    };
  }
}

export default new LeadsService();
