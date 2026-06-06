import { describe, expect, it, vi } from 'vitest';

vi.mock('../../database.js', () => ({
  prisma: {},
}));

vi.mock('../NotificationService.js', () => ({
  notificationService: { pushToUser: vi.fn() },
}));

import {
  LEAD_SLA_HOURS,
  buildLeadTaskCockpit,
  buildLeadTimeline,
  runLeadSlaEscalationTick,
} from '../leadWorkflowService.js';

describe('leadWorkflowService', () => {
  it('builds cockpit columns with priority ranks and SLA breach grouping', () => {
    const now = new Date('2026-05-27T12:00:00.000Z');
    const cockpit = buildLeadTaskCockpit(
      [
        {
          id: 'lead-1',
          name: 'Overdue Lead',
          status: 'new',
          source: 'website',
          score: 90,
          createdAt: new Date('2026-05-27T05:00:00.000Z'),
          assignedToId: 'agent-1',
        },
        {
          id: 'lead-2',
          name: 'Today Lead',
          status: 'qualified',
          source: 'website',
          score: 60,
          createdAt: new Date('2026-05-27T09:30:00.000Z'),
          assignedToId: 'agent-1',
        },
      ],
      now
    );

    expect(cockpit.summary.total).toBe(2);
    expect(cockpit.summary.breached).toBe(1);
    expect(cockpit.columns.overdue[0]?.priorityRank).toBe(1);
    expect(cockpit.columns.overdue[0]?.slaRisk).toBe('breached');
    expect(cockpit.columns.today[0]?.nextAction).toMatch(/confirm qualification/i);
  });

  it('builds a unified lead timeline from inquiry, activities, and viewings', () => {
    const timeline = buildLeadTimeline({
      lead: {
        id: 'lead-1',
        name: 'Lead One',
        status: 'viewing',
        source: 'website',
        createdAt: new Date('2026-05-27T09:00:00.000Z'),
        assignedTo: { id: 'agent-1', name: 'Agent One' },
        property: { id: 'prop-1', title: 'Marina Tower', location: 'Dubai Marina' },
      },
      activities: [
        {
          id: 'act-1',
          action: 'whatsapp_follow_up',
          description: 'Sent WhatsApp brochure',
          createdAt: new Date('2026-05-27T10:00:00.000Z'),
          user: { id: 'agent-1', name: 'Agent One' },
        },
      ],
      viewings: [
        {
          id: 'view-1',
          status: 'scheduled',
          type: 'in_person',
          scheduledAt: new Date('2026-05-28T12:00:00.000Z'),
          createdAt: new Date('2026-05-27T11:00:00.000Z'),
          property: { title: 'Marina Tower', location: 'Dubai Marina' },
          agent: { id: 'agent-1', name: 'Agent One' },
        },
      ],
    });

    expect(timeline[0]?.type).toBe('viewing');
    expect(timeline.some(entry => entry.type === 'inquiry')).toBe(true);
    expect(timeline.some(entry => entry.type === 'whatsapp')).toBe(true);
  });

  it('sends assignee and manager SLA escalations for severely overdue leads', async () => {
    const pushToUser = vi.fn().mockResolvedValue(undefined);
    const activityCreate = vi.fn().mockResolvedValue({ id: 'activity-1' });

    const result = await runLeadSlaEscalationTick({
      now: new Date('2026-05-27T12:00:00.000Z'),
      notifications: { pushToUser },
      prismaClient: {
        lead: {
          findMany: vi.fn().mockResolvedValue([
            {
              id: 'lead-1',
              name: 'Overdue Lead',
              status: 'new',
              createdAt: new Date(
                `2026-05-27T${String(12 - LEAD_SLA_HOURS - 5).padStart(2, '0')}:00:00.000Z`
              ),
              assignedToId: 'agent-1',
              createdById: 'manager-1',
              assignedTo: { id: 'agent-1', name: 'Agent One', email: 'agent@wc.ae' },
            },
          ]),
        },
        user: {
          findMany: vi
            .fn()
            .mockResolvedValue([{ id: 'manager-1', name: 'Manager One', email: 'manager@wc.ae' }]),
        },
        activity: {
          create: activityCreate,
        },
      } as never,
    });

    expect(result.managerEscalations).toBe(1);
    expect(pushToUser).toHaveBeenCalledWith(expect.objectContaining({ userId: 'agent-1' }));
    expect(pushToUser).toHaveBeenCalledWith(expect.objectContaining({ userId: 'manager-1' }));
    expect(activityCreate).toHaveBeenCalled();
  });
});
