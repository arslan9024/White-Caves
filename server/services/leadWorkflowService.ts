import { prisma } from '../database.js';
import { notificationService } from './NotificationService.js';

export const LEAD_SLA_HOURS = 4;
export const LEAD_MANAGER_ESCALATION_HOURS = 8;

type LeadTaskLead = {
  id: string;
  name: string;
  phone?: string | null;
  email?: string | null;
  status: string;
  source?: string | null;
  score?: number | null;
  createdAt: Date;
  lastContact?: Date | null;
  assignedToId?: string | null;
  createdById?: string | null;
  assignedTo?: { id: string; name?: string | null; email?: string | null } | null;
  property?: { id: string; title?: string | null; location?: string | null } | null;
};

type LeadActivity = {
  id: string;
  action: string;
  description: string;
  createdAt: Date;
  user?: { id?: string | null; name?: string | null } | null;
  metadata?: Record<string, unknown> | null;
};

type LeadViewing = {
  id: string;
  status: string;
  type?: string | null;
  scheduledAt: Date;
  createdAt?: Date;
  notes?: string | null;
  property?: { title?: string | null; location?: string | null } | null;
  agent?: { id?: string | null; name?: string | null } | null;
};

type TimelineEntryType = 'inquiry' | 'call' | 'whatsapp' | 'task' | 'viewing' | 'offer' | 'note';

export type LeadTimelineEntry = {
  id: string;
  type: TimelineEntryType;
  title: string;
  description: string;
  createdAt: string;
  userName: string;
  metadata?: Record<string, unknown>;
};

export type CockpitLead = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  status: string;
  source: string;
  score: number;
  createdAt: string;
  lastContact: string | null;
  assignedToId: string | null;
  assignedToName: string;
  propertyTitle: string | null;
  propertyLocation: string | null;
  hoursOpen: number;
  slaRisk: 'breached' | 'at_risk' | 'healthy';
  priorityScore: number;
  priorityRank: number;
  nextAction: string;
};

type TickDependencies = {
  prismaClient?: typeof prisma;
  notifications?: Pick<typeof notificationService, 'pushToUser'>;
  now?: Date;
};

const TASK_COLUMN_KEYS = ['overdue', 'today', 'upcoming'] as const;
type TaskColumnKey = (typeof TASK_COLUMN_KEYS)[number];

function getLeadHoursOpen(lead: LeadTaskLead, now: Date): number {
  return Math.max(0, Math.round(((now.getTime() - lead.createdAt.getTime()) / 36e5) * 10) / 10);
}

function getLeadSlaRisk(lead: LeadTaskLead, now: Date): CockpitLead['slaRisk'] {
  const hoursOpen = getLeadHoursOpen(lead, now);
  const awaitingFirstResponse = ['new', 'contacted'].includes(lead.status);
  if (awaitingFirstResponse && hoursOpen >= LEAD_SLA_HOURS) return 'breached';
  if (awaitingFirstResponse && hoursOpen >= Math.max(1, LEAD_SLA_HOURS / 2)) return 'at_risk';
  return 'healthy';
}

function getStatusWeight(status: string): number {
  switch (status) {
    case 'viewing':
      return 40;
    case 'qualified':
      return 32;
    case 'contacted':
      return 24;
    case 'new':
      return 18;
    case 'offered':
      return 16;
    default:
      return 10;
  }
}

function getNextAction(status: string, slaRisk: CockpitLead['slaRisk']): string {
  if (slaRisk === 'breached') return 'Respond immediately';
  if (slaRisk === 'at_risk') return 'Contact before SLA';
  if (status === 'qualified') return 'Confirm qualification';
  if (status === 'viewing') return 'Prepare viewing';
  return 'Advance follow-up';
}

function getTaskColumn(lead: LeadTaskLead, now: Date): TaskColumnKey {
  const slaRisk = getLeadSlaRisk(lead, now);
  if (slaRisk === 'breached') return 'overdue';
  if (lead.createdAt.toDateString() === now.toDateString() || ['qualified', 'viewing'].includes(lead.status)) {
    return 'today';
  }
  return 'upcoming';
}

function mapCockpitLead(lead: LeadTaskLead, now: Date): CockpitLead {
  const hoursOpen = getLeadHoursOpen(lead, now);
  const slaRisk = getLeadSlaRisk(lead, now);
  const priorityBonus = slaRisk === 'breached' ? 80 : slaRisk === 'at_risk' ? 35 : 0;
  const priorityScore =
    priorityBonus +
    getStatusWeight(lead.status) +
    Math.round(hoursOpen * 3) +
    Math.round((lead.score ?? 0) * 0.4);

  return {
    id: lead.id,
    name: lead.name,
    phone: lead.phone ?? 'No phone',
    email: lead.email ?? null,
    status: lead.status,
    source: lead.source ?? 'direct',
    score: lead.score ?? 0,
    createdAt: lead.createdAt.toISOString(),
    lastContact: lead.lastContact?.toISOString() ?? null,
    assignedToId: lead.assignedToId ?? null,
    assignedToName: lead.assignedTo?.name ?? 'Unassigned',
    propertyTitle: lead.property?.title ?? null,
    propertyLocation: lead.property?.location ?? null,
    hoursOpen,
    slaRisk,
    priorityScore,
    priorityRank: 0,
    nextAction: getNextAction(lead.status, slaRisk),
  };
}

export function buildLeadTaskCockpit(leads: LeadTaskLead[], now = new Date()) {
  const columnByLeadId = new Map<string, TaskColumnKey>(
    leads.map(lead => [lead.id, getTaskColumn(lead, now)])
  );
  const sorted = leads
    .map(lead => mapCockpitLead(lead, now))
    .sort((a, b) => b.priorityScore - a.priorityScore || b.score - a.score || a.hoursOpen - b.hoursOpen)
    .map((lead, index) => ({ ...lead, priorityRank: index + 1 }));

  const columns: Record<TaskColumnKey, CockpitLead[]> = {
    overdue: [],
    today: [],
    upcoming: [],
  };
  sorted.forEach(lead => {
  sorted.forEach(lead => {
    columns[columnByLeadId.get(lead.id) ?? 'upcoming'].push(lead);
  });

  return {
    summary: {
      total: sorted.length,
      overdue: columns.overdue.length,
      today: columns.today.length,
      upcoming: columns.upcoming.length,
      breached: sorted.filter(lead => lead.slaRisk === 'breached').length,
    },
    columns,
    leads: sorted,
  };
}

function getTimelineType(action: string): TimelineEntryType {
  if (action.includes('whatsapp')) return 'whatsapp';
  if (action.includes('call')) return 'call';
  if (action.includes('offer')) return 'offer';
  if (action.includes('task') || action.includes('sla') || action.includes('reminder') || action.includes('bulk_action')) {
    return 'task';
  }
  return 'note';
}

function getTimelineTitle(type: TimelineEntryType): string {
  switch (type) {
    case 'inquiry':
      return 'Inquiry captured';
    case 'call':
      return 'Call logged';
    case 'whatsapp':
      return 'WhatsApp touchpoint';
    case 'task':
      return 'Task update';
    case 'viewing':
      return 'Viewing milestone';
    case 'offer':
      return 'Offer activity';
    default:
      return 'CRM note';
  }
}

export function buildLeadTimeline(input: {
  lead: LeadTaskLead;
  activities: LeadActivity[];
  viewings: LeadViewing[];
}): LeadTimelineEntry[] {
  const inquiryEntry: LeadTimelineEntry = {
    id: `lead-${input.lead.id}-created`,
    type: 'inquiry',
    title: 'Inquiry captured',
    description:
      input.lead.source === 'homepage_search'
        ? 'Web search inquiry captured and routed into CRM.'
        : `Lead entered CRM from ${input.lead.source ?? 'direct'} source.`,
    createdAt: input.lead.createdAt.toISOString(),
    userName: input.lead.assignedTo?.name ?? 'White Caves',
    metadata: {
      source: input.lead.source ?? 'direct',
      propertyTitle: input.lead.property?.title ?? null,
    },
  };

  const activityEntries = input.activities.map(activity => {
    const type = getTimelineType(activity.action);
    return {
      id: activity.id,
      type,
      title: getTimelineTitle(type),
      description: activity.description,
      createdAt: activity.createdAt.toISOString(),
      userName: activity.user?.name ?? 'System',
      metadata: (activity.metadata as Record<string, unknown> | null) ?? undefined,
    } satisfies LeadTimelineEntry;
  });

  const viewingEntries = input.viewings.map(viewing => ({
    id: `viewing-${viewing.id}`,
    type: 'viewing' as const,
    title: 'Viewing milestone',
    description: `${viewing.status === 'completed' ? 'Completed' : 'Scheduled'} ${viewing.type ?? 'in-person'} viewing${viewing.property?.title ? ` for ${viewing.property.title}` : ''}`,
    createdAt: (viewing.createdAt ?? viewing.scheduledAt).toISOString(),
    userName: viewing.agent?.name ?? 'Viewing desk',
    metadata: {
      scheduledAt: viewing.scheduledAt.toISOString(),
      status: viewing.status,
      notes: viewing.notes ?? null,
    },
  }));

  return [inquiryEntry, ...activityEntries, ...viewingEntries].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function runLeadSlaEscalationTick({
  prismaClient = prisma,
  notifications = notificationService,
  now = new Date(),
}: TickDependencies = {}) {
  const threshold = new Date(now.getTime() - LEAD_SLA_HOURS * 36e5);
  const escalatedLeads = await prismaClient.lead.findMany({
    where: {
      status: { in: ['new', 'contacted'] },
      createdAt: { lt: threshold },
    },
    select: {
      id: true,
      name: true,
      createdAt: true,
      status: true,
      assignedToId: true,
      createdById: true,
      assignedTo: { select: { id: true, name: true, email: true } },
    },
    take: 200,
  });

  const managers = await prismaClient.user.findMany({
    where: { role: { in: ['owner', 'manager', 'admin'] } },
    select: { id: true, name: true, email: true },
    take: 25,
  });

  let agentNudges = 0;
  let managerEscalations = 0;

  for (const lead of escalatedLeads) {
    const hoursOpen = getLeadHoursOpen(lead, now);
    const recipientIds = new Set<string>();

    if (lead.assignedToId) {
      recipientIds.add(lead.assignedToId);
    }

    if (hoursOpen >= LEAD_MANAGER_ESCALATION_HOURS) {
      managers.forEach(manager => recipientIds.add(manager.id));
    }

    for (const userId of recipientIds) {
      await notifications.pushToUser({
        userId,
        type: 'lead',
        title:
          hoursOpen >= LEAD_MANAGER_ESCALATION_HOURS
            ? 'Lead SLA escalated to manager'
            : 'Lead SLA breach detected',
        message: `${lead.name} has been waiting ${hoursOpen}h without first response.`,
        metadata: {
          leadId: lead.id,
          hoursOpen,
          slaHours: LEAD_SLA_HOURS,
          escalationLevel:
            hoursOpen >= LEAD_MANAGER_ESCALATION_HOURS ? 'manager' : 'assignee',
        },
      });
    }

    agentNudges += lead.assignedToId ? 1 : 0;
    managerEscalations += hoursOpen >= LEAD_MANAGER_ESCALATION_HOURS ? 1 : 0;

    await prismaClient.activity.create({
      data: {
        type: 'lead',
        action: hoursOpen >= LEAD_MANAGER_ESCALATION_HOURS ? 'sla_escalated' : 'sla_nudge_sent',
        description:
          hoursOpen >= LEAD_MANAGER_ESCALATION_HOURS
            ? `Lead "${lead.name}" escalated to managers after ${hoursOpen}h without response`
            : `Lead "${lead.name}" nudged after ${hoursOpen}h without response`,
        leadId: lead.id,
        userId: lead.createdById ?? null,
        metadata: {
          hoursOpen,
          notifiedUserIds: Array.from(recipientIds),
          escalationLevel:
            hoursOpen >= LEAD_MANAGER_ESCALATION_HOURS ? 'manager' : 'assignee',
        },
      },
    });
  }

  return {
    scanned: escalatedLeads.length,
    agentNudges,
    managerEscalations,
    thresholdHours: LEAD_SLA_HOURS,
  };
}
