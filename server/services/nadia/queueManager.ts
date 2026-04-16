/**
 * NADIA Queue Manager - Conversation routing and assignment
 * Handles priority-based queue ordering and agent assignment
 */

import { prisma } from '../../database.js';
import { createLogger } from '../../utils/logger.js';

const log = createLogger('QueueManager');

// ============================================================================
// QUEUE OPERATIONS
// ============================================================================

/**
 * Get queued conversations sorted by priority and age
 * Hot leads (priority 1-3) are shown first
 */
export async function getQueuedConversations(limit: number = 10) {
  const queued = await prisma.nadiaConversationQueue.findMany({
    where: {
      status: 'queued',
    },
    orderBy: [
      { priority: 'asc' }, // Lower number = higher priority
      { queuedAt: 'asc' }, // Older entries first (FIFO within priority)
    ],
    take: limit,
    include: {
      conversation: {
        include: {
          messages: {
            take: 2,
            orderBy: { timestamp: 'desc' },
          },
        },
      },
    },
  });

  return queued.map((q) => ({
    queueId: q.id,
    conversationId: q.conversation.id,
    priority: q.priority,
    customerPhone: q.conversation.customerPhone,
    status: q.conversation.status,
    intent: q.conversation.intent,
    leadScore: q.conversation.leadScore,
    queuedAt: q.queuedAt,
    waitTimeMinutes: Math.round(
      (Date.now() - q.queuedAt.getTime()) / 60000
    ),
    lastMessage: q.conversation.messages[0]?.body || null,
    messageCount: q.conversation.messages.length,
    priority_label:
      q.priority <= 2
        ? 'ðŸ”¥ HOT'
        : q.priority <= 5
          ? 'â­ WARM'
          : 'â„ï¸ COLD',
  }));
}

/**
 * Calculate priority for a conversation
 * Lower number = higher priority
 * 1-3: Hot (make_offer, schedule_tour, high engagement)
 * 4-6: Warm (interested, gathering info)
 * 7-10: Cold (general inquiry, early stage)
 */
export function calculateQueuePriority(
  leadScore: number,
  intent: string,
  messageCount: number
): number {
  let priority = 5; // Base priority (warm)

  // Lead score boost/penalty
  if (leadScore >= 80) priority -= 3; // Hot
  else if (leadScore >= 60) priority -= 1; // Warm
  else if (leadScore <= 30) priority += 4; // Cold

  // Intent bonus
  if (intent === 'make_offer') priority -= 3; // Hot
  else if (intent === 'schedule_tour') priority -= 2; // Warm
  else if (intent === 'financing') priority -= 1; // Slightly warmer
  else if (intent === 'complaint') priority += 5; // Lower priority

  // Engagement bonus
  if (messageCount >= 10) priority -= 2; // More engaged = higher priority
  else if (messageCount >= 5) priority -= 1;

  // Clamp to 1-10 range
  return Math.max(1, Math.min(10, priority));
}

/**
 * Add a conversation to the routing queue
 * Called when a conversation needs agent assignment
 */
export async function queueConversationForAssignment(
  conversationId: string,
  reason: string = 'awaiting_assignment'
) {
  const conversation = await prisma.nadiaConversation.findUnique({
    where: { id: conversationId },
  });

  if (!conversation) {
    throw new Error(`Conversation ${conversationId} not found`);
  }

  // Calculate priority
  const priority = calculateQueuePriority(
    conversation.leadScore,
    conversation.intent || '',
    0 // Message count would be fetched separately if needed
  );

  // Check if already queued
  const existing = await prisma.nadiaConversationQueue.findUnique({
    where: { conversationId },
  });

  if (existing) {
    // Update priority if conversation state has changed
    return await prisma.nadiaConversationQueue.update({
      where: { id: existing.id },
      data: {
        priority,
        status: 'queued',
      },
      include: {
        conversation: true,
      },
    });
  }

  // Create new queue entry
  return await prisma.nadiaConversationQueue.create({
    data: {
      conversationId,
      priority,
      status: 'queued',
      queuedAt: new Date(),
    },
    include: {
      conversation: true,
    },
  });
}

/**
 * Assign a queued conversation to an agent
 * Moves from queue to assigned state
 */
export async function assignFromQueue(
  queueId: string,
  agentPhone: string
): Promise<any> {
  const queueEntry = await prisma.nadiaConversationQueue.findUnique({
    where: { id: queueId },
    include: {
      conversation: true,
    },
  });

  if (!queueEntry) {
    return null;
  }

  // Update queue status
  const updated = await prisma.nadiaConversationQueue.update({
    where: { id: queueId },
    data: {
      status: 'assigned',
      assignedAt: new Date(),
    },
    include: {
      conversation: true,
    },
  });

  // Update conversation status
  await prisma.nadiaConversation.update({
    where: { id: queueEntry.conversationId },
    data: {
      status: 'assigned_to_agent',
      agentPhone,
      routedAt: new Date(),
    },
  });

  return updated;
}

/**
 * Reassign a queued conversation (change priority or re-queue)
 */
export async function reassignQueuedConversation(
  queueId: string,
  newPriority?: number,
  reason?: string
) {
  const updateData: any = {};

  if (newPriority !== undefined) {
    updateData.priority = Math.max(1, Math.min(10, newPriority));
  }

  if (reason) {
    updateData.routingReason = reason;
  }

  return await prisma.nadiaConversationQueue.update({
    where: { id: queueId },
    data: updateData,
    include: {
      conversation: true,
    },
  });
}

/**
 * Remove a conversation from queue
 * Called when conversation is closed or assigned elsewhere
 */
export async function removeFromQueue(conversationId: string) {
  return await prisma.nadiaConversationQueue.deleteMany({
    where: { conversationId },
  });
}

// ============================================================================
// QUEUE ANALYTICS
// ============================================================================

/**
 * Get queue statistics for dashboard
 */
export async function getQueueStats() {
  const [
    totalQueued,
    hotCount,
    warmCount,
    coldCount,
    averageWaitTime,
    oldestQueuedEntry,
  ] = await Promise.all([
    prisma.nadiaConversationQueue.count({
      where: { status: 'queued' },
    }),
    prisma.nadiaConversationQueue.count({
      where: {
        status: 'queued',
        priority: { lte: 3 },
      },
    }),
    prisma.nadiaConversationQueue.count({
      where: {
        status: 'queued',
        priority: { gt: 3, lte: 6 },
      },
    }),
    prisma.nadiaConversationQueue.count({
      where: {
        status: 'queued',
        priority: { gt: 6 },
      },
    }),
    prisma.nadiaConversationQueue.aggregate({
      where: { status: 'queued' },
      _avg: {
        priority: true,
      },
    }),
    prisma.nadiaConversationQueue.findFirst({
      where: { status: 'queued' },
      orderBy: { queuedAt: 'asc' },
    }),
  ]);

  const oldestWaitMinutes = oldestQueuedEntry
    ? Math.round((Date.now() - oldestQueuedEntry.queuedAt.getTime()) / 60000)
    : 0;

  return {
    totalQueued,
    hotCount,
    warmCount,
    coldCount,
    averagePriority: Math.round(
      (averageWaitTime._avg.priority || 5) * 10
    ) / 10,
    oldestWaitMinutes,
    queueHealth:
      totalQueued === 0
        ? 'Empty'
        : totalQueued < 5
          ? 'Good'
          : totalQueued < 15
            ? 'Busy'
            : 'Overwhelmed',
  };
}

/**
 * Auto-requeue conversations that failed assignment
 */
export async function handleFailedAssignments() {
  const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

  // Find conversations assigned but not updated in 24 hours
  const failed = await prisma.nadiaConversation.findMany({
    where: {
      status: 'assigned_to_agent',
      updatedAt: { lt: dayAgo },
      queue: null, // Not in queue (they should be)
    },
  });

  // Re-queue them with increased priority
  for (const conv of failed) {
    const priority = calculateQueuePriority(
      conv.leadScore,
      conv.intent || '',
      0
    );

    await queueConversationForAssignment(
      conv.id,
      'requeue_failed_assignment'
    );

    // Increase priority since this is a failed assignment
    await reassignQueuedConversation(
      (
        await prisma.nadiaConversationQueue.findUnique({
          where: { conversationId: conv.id },
        })
      )?.id || '',
      Math.max(1, priority - 2),
      'priority_increase_failed_assignment'
    );
  }

  return {
    requeued: failed.length,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Get conversations ready for auto-close (no activity for N days)
 */
export async function getConversationsForAutoClose(
  inactiveDays: number = 7
) {
  const cutoffDate = new Date(
    Date.now() - inactiveDays * 24 * 60 * 60 * 1000
  );

  return await prisma.nadiaConversation.findMany({
    where: {
      status: {
        in: ['active', 'in_bot_flow'],
      },
      updatedAt: { lt: cutoffDate },
    },
    include: {
      messages: {
        orderBy: { timestamp: 'desc' },
        take: 1,
      },
    },
  });
}

/**
 * Auto-close inactive conversations
 */
export async function autoCloseInactiveConversations(
  inactiveDays: number = 7
) {
  const conversations = await getConversationsForAutoClose(inactiveDays);

  for (const conv of conversations) {
    await prisma.nadiaConversation.update({
      where: { id: conv.id },
      data: {
        status: 'closed',
        closedAt: new Date(),
        closedReason: 'auto_closed_inactivity',
      },
    });

    // Remove from queue if exists
    await removeFromQueue(conv.id);
  }

  return {
    autoClosed: conversations.length,
    timestamp: new Date().toISOString(),
  };
}
