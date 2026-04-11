/**
 * Conversation & Activity Data Generator
 * ========================================
 * Generates WhatsApp conversations (Nadia) + CRM activity feed.
 * Matches NadiaConversation/NadiaMessage + Activity Prisma shapes.
 */

import { createRng } from './rng';

// ─── Constants ────────────────────────────────────────────────

export const CONVERSATION_STATUSES = ['ACTIVE', 'PENDING', 'CLOSED', 'SPAM'] as const;
export const CONVERSATION_PRIORITIES = ['URGENT', 'HIGH', 'NORMAL', 'LOW'] as const;
export const MESSAGE_SENDERS = ['CUSTOMER', 'AGENT', 'SYSTEM'] as const;
export const MESSAGE_INTENTS = [
  'PROPERTY_INQUIRY', 'VIEWING_REQUEST', 'PURCHASE_INTEREST',
  'COMPLAINT', 'PRICE_NEGOTIATION', 'GENERAL_QUESTION', 'UNKNOWN',
] as const;
export const MESSAGE_SENTIMENTS = ['POSITIVE', 'NEUTRAL', 'NEGATIVE'] as const;

export const ACTIVITY_TYPES = [
  'deal_closed', 'lead_created', 'stage_change', 'client_created',
  'deal_cancelled', 'property_added', 'agent_added', 'alert',
  'call', 'email', 'whatsapp', 'visit', 'note',
] as const;

const ACTIVITY_ICONS: Record<string, string> = {
  deal_closed: '✅', lead_created: '🔥', stage_change: '📈',
  client_created: '👤', deal_cancelled: '❌', property_added: '🏠',
  agent_added: '👥', alert: '⭐', call: '📞', email: '📧',
  whatsapp: '💬', visit: '🏢', note: '📝',
};

const CUSTOMER_NAMES = [
  'Alexander Petrov', 'Viktor Ivanov', 'Chen Wei', 'Raj Kumar',
  'Pierre Dubois', 'Giovanni Rossi', 'James Anderson', 'Sophie Laurent',
  'Elena Volkov', 'Natasha Kim', 'Hugo Martinez', 'Oliver Schmidt',
  'Isabella Park', 'Lucas Tanaka', 'Amir Hassan', 'Charlotte Williams',
  'Sergei Novak', 'Hans Fischer', 'Carlos Garcia', 'William O\'Brien',
];

const CUSTOMER_MESSAGES = [
  'Hi, I\'m interested in properties in {community}. Do you have anything available?',
  'What\'s the price range for {type} in Dubai Marina?',
  'I saw your listing on Bayut. Can I schedule a viewing this weekend?',
  'I\'m looking for a {beds}-bedroom apartment with sea view. Budget around AED {budget}M.',
  'Can you send me the floor plans for the {community} property?',
  'Is the price negotiable? I\'m a cash buyer.',
  'I need something ready to move in by next month. What do you have?',
  'Hello, I was referred by a friend. Looking for investment properties.',
  'Can we arrange a virtual tour? I\'m currently based overseas.',
  'What are the service charges for {community}?',
  'Is there a payment plan available for off-plan projects?',
  'I\'d like to compare 3 properties this Saturday. Can your agent meet me?',
  'What\'s the ROI expectation for {type} in Business Bay?',
  'My family is relocating to Dubai. We need a villa with garden.',
  'Are there any new launches in {community}?',
];

const AGENT_MESSAGES = [
  'Thank you for your interest! Let me share some options with you.',
  'I have several properties matching your criteria in {community}.',
  'Absolutely! I can arrange viewings this weekend. What time works best?',
  'The price for this unit is AED {price}. Payment plans are available.',
  'I\'m sending the floor plans and brochure to your email right now.',
  'Great news — the developer is offering a special launch price this week.',
  'I\'d recommend viewing these 3 properties: they match your budget perfectly.',
  'Welcome! As a first-time buyer, I\'ll guide you through the entire process.',
  'Video tour link has been sent. Would you like to discuss after viewing?',
  'Service charges are approximately AED {charge}/sqft per year.',
  'Yes, flexible payment plans available — 60/40 and 70/30 options.',
  'I\'ve blocked 3 viewing slots for Saturday: 10am, 12pm, and 3pm.',
  'Expected ROI is 7-9% for this area. I can share market data.',
  'I have a beautiful villa in Arabian Ranches — 4BR with private garden.',
  'New phase launching next week. Shall I register you for priority access?',
];

const ACTIVITY_TEMPLATES: Record<string, string[]> = {
  deal_closed: [
    '{agent} closed a deal worth AED {amount}',
    'Sale completed — {property} sold for AED {amount}',
    'Rental agreement signed — AED {amount}/year',
  ],
  lead_created: [
    '{lead} added as new hot lead',
    'New inquiry from {lead} via {source}',
    '{lead} registered interest in {property}',
  ],
  stage_change: [
    '{lead} moved to negotiation stage',
    '{lead} upgraded from warm to hot',
    '{lead} moved to proposal stage',
  ],
  client_created: [
    '{client} registered as new client',
    'New client onboarded: {client}',
    '{client} account activated',
  ],
  deal_cancelled: [
    '{lead} requested deal cancellation',
    'Transaction cancelled — buyer withdrew',
    'Deal voided due to financing issues',
  ],
  property_added: [
    'New luxury {type} added to inventory',
    '{property} listed in {community}',
    'Off-plan {type} added — {community}',
  ],
  agent_added: [
    '{agent} joined the {dept} team',
    'New agent onboarded: {agent}',
  ],
  alert: [
    '{agent} achieved top performer status',
    'Monthly target exceeded by {dept} team',
    'System: Database backup completed',
    'Unusual login detected — security review triggered',
  ],
  call: [
    '{agent} called {lead} — discussed {property}',
    'Follow-up call with {lead} — 15 min',
  ],
  email: [
    'Proposal sent to {lead} for {property}',
    'Market report emailed to {client}',
  ],
  whatsapp: [
    'WhatsApp conversation with {lead} — viewing confirmed',
    '{agent} shared property photos via WhatsApp to {lead}',
  ],
  visit: [
    '{lead} visited {property} — positive feedback',
    'Property tour completed: {community} {type}',
  ],
  note: [
    '{agent} added note: "{lead} prefers corner unit"',
    'Internal note: Financing pre-approved for {lead}',
  ],
};

const COMMUNITIES = [
  'Palm Jumeirah', 'Downtown Dubai', 'Dubai Marina', 'Business Bay',
  'JBR', 'Dubai Hills Estate', 'Arabian Ranches', 'Dubai Creek Harbour',
];

const PROP_TYPES = ['Villa', 'Apartment', 'Penthouse', 'Townhouse', 'Studio'];

// ─── Interfaces ───────────────────────────────────────────────

export interface GeneratedMessage {
  id: string;
  conversationId: string;
  sender: string;
  content: string;
  sentiment: string;
  intent: string;
  leadScore: number;
  messageType: string;
  status: string;
  timestamp: string;
}

export interface GeneratedConversation {
  id: string;
  customerPhone: string;
  customerName: string;
  status: string;
  priority: string;
  leadScore: number;
  assignedAgent: string;
  messages: GeneratedMessage[];
  messageCount: number;
  unreadCount: number;
  lastMessage: string;
  createdAt: string;
  updatedAt: string;
  closedAt: string | null;
}

export interface GeneratedActivity {
  id: number;
  timestamp: string;
  action: string;
  description: string;
  user: string;
  type: string;
  icon: string;
}

// ─── Conversation Generator ──────────────────────────────────

function fillTemplate(template: string, rng: ReturnType<typeof createRng>): string {
  return template
    .replace('{community}', rng.pick(COMMUNITIES))
    .replace('{type}', rng.pick(PROP_TYPES))
    .replace('{beds}', String(rng.int(1, 5)))
    .replace('{budget}', String(rng.int(1, 15)))
    .replace('{price}', `${(rng.int(500, 5000) * 1000).toLocaleString('en-US')}`)
    .replace('{charge}', String(rng.int(12, 45)));
}

export function generateConversations(count = 25, seed = 300): GeneratedConversation[] {
  const rng = createRng(seed);
  const conversations: GeneratedConversation[] = [];

  for (let i = 0; i < count; i++) {
    const convId = `conv-${String(i + 1).padStart(3, '0')}`;
    const customerName = rng.pick(CUSTOMER_NAMES);
    const status = rng.pick(CONVERSATION_STATUSES);
    const priority = rng.pick(CONVERSATION_PRIORITIES);
    const leadScore = priority === 'URGENT' ? rng.int(80, 100)
                    : priority === 'HIGH' ? rng.int(60, 85)
                    : priority === 'NORMAL' ? rng.int(30, 65)
                    : rng.int(5, 35);

    const agentId = `agent-${String(rng.int(1, 20)).padStart(2, '0')}`;
    const daysAgo = rng.int(0, 90);
    const createdAt = new Date(Date.now() - daysAgo * 86400000).toISOString();
    const updatedAt = new Date(Date.now() - rng.int(0, Math.min(daysAgo, 3)) * 86400000).toISOString();
    const closedAt = status === 'CLOSED'
      ? new Date(Date.now() - rng.int(0, daysAgo) * 86400000).toISOString()
      : null;

    // Generate 3-12 messages per conversation
    const msgCount = rng.int(3, 12);
    const messages: GeneratedMessage[] = [];
    const msgBaseTime = Date.now() - daysAgo * 86400000;

    for (let m = 0; m < msgCount; m++) {
      const isCustomer = m === 0 ? true : rng.chance(0.45); // First message always from customer
      const sender = isCustomer ? 'CUSTOMER' : (rng.chance(0.9) ? 'AGENT' : 'SYSTEM');
      const templates = sender === 'CUSTOMER' ? CUSTOMER_MESSAGES : AGENT_MESSAGES;
      const content = sender === 'SYSTEM'
        ? rng.pick(['Conversation assigned to agent.', 'Auto-reply sent.', 'Lead score updated.', 'Priority escalated.'])
        : fillTemplate(rng.pick(templates), rng);

      const sentiment = sender === 'CUSTOMER'
        ? rng.pick(['POSITIVE', 'POSITIVE', 'NEUTRAL', 'NEUTRAL', 'NEUTRAL', 'NEGATIVE'])
        : 'NEUTRAL';
      const intent = sender === 'CUSTOMER'
        ? rng.pick(MESSAGE_INTENTS)
        : 'UNKNOWN';

      const msgTimestamp = new Date(msgBaseTime + m * rng.int(60_000, 7_200_000)).toISOString();

      messages.push({
        id: `msg-${convId}-${String(m + 1).padStart(2, '0')}`,
        conversationId: convId,
        sender,
        content,
        sentiment,
        intent,
        leadScore: sender === 'CUSTOMER' ? rng.int(Math.max(leadScore - 10, 0), Math.min(leadScore + 10, 100)) : 0,
        messageType: 'text',
        status: rng.pick(['sent', 'delivered', 'read']),
        timestamp: msgTimestamp,
      });
    }

    const lastMsg = messages[messages.length - 1];
    const unread = status === 'ACTIVE' ? rng.int(0, 5) : 0;

    const phone = `+971 5${rng.int(0, 8)} ${rng.int(100, 999)} ${rng.int(1000, 9999)}`;

    conversations.push({
      id: convId,
      customerPhone: phone,
      customerName,
      status,
      priority,
      leadScore,
      assignedAgent: agentId,
      messages,
      messageCount: msgCount,
      unreadCount: unread,
      lastMessage: lastMsg.content,
      createdAt,
      updatedAt,
      closedAt,
    });
  }

  return conversations;
}

// ─── Activity Generator ──────────────────────────────────────

export function generateActivities(count = 50, seed = 400): GeneratedActivity[] {
  const rng = createRng(seed);
  const activities: GeneratedActivity[] = [];

  const agentNames = [
    'Ahmed Hassan', 'Fatima Al-Mansoori', 'Mohammed Al-Mazrouei',
    'Leila Al-Falasiri', 'Rashid Al-Ketbi', 'Noor Al-Suwaidi',
    'Youssef Al-Shamsi', 'Sara Al-Nahyan', 'Omar Al-Habtoor',
    'Layla Al-Mansouri',
  ];

  const leadNames = [
    'Alexander Petrov', 'Chen Wei', 'Raj Kumar', 'Viktor Ivanov',
    'Pierre Dubois', 'Giovanni Rossi', 'Oliver Schmidt', 'Sergei Novak',
    'Hugo Martinez', 'Isabella Park',
  ];

  const clientNames = [
    'Royal Investment Group', 'Gulf Trading LLC', 'Al Noor Holdings',
    'Premier Properties', 'Horizon Capital', 'Golden Gate Investments',
  ];

  for (let i = 0; i < count; i++) {
    const type = rng.pick(ACTIVITY_TYPES);
    const templates = ACTIVITY_TEMPLATES[type] || [`Activity: ${type}`];
    let desc = rng.pick(templates);

    // Fill placeholders
    desc = desc
      .replace('{agent}', rng.pick(agentNames))
      .replace('{lead}', rng.pick(leadNames))
      .replace('{client}', rng.pick(clientNames))
      .replace('{property}', `${rng.pick(PROP_TYPES)} in ${rng.pick(COMMUNITIES)}`)
      .replace('{community}', rng.pick(COMMUNITIES))
      .replace('{type}', rng.pick(PROP_TYPES))
      .replace('{source}', rng.pick(['Bayut', 'Website', 'WhatsApp', 'Referral', 'Walk-In']))
      .replace('{dept}', rng.pick(['Sales', 'Leasing', 'Operations']))
      .replace('{amount}', `${(rng.int(500, 15000) * 1000).toLocaleString('en-US')}`);

    // Action label (human-readable)
    const actionMap: Record<string, string> = {
      deal_closed: 'Deal closed',
      lead_created: 'New lead created',
      stage_change: 'Lead stage updated',
      client_created: 'New client registered',
      deal_cancelled: 'Deal cancelled',
      property_added: 'Property listed',
      agent_added: 'New agent onboarded',
      alert: 'System alert',
      call: 'Call logged',
      email: 'Email sent',
      whatsapp: 'WhatsApp message',
      visit: 'Property visit',
      note: 'Note added',
    };

    activities.push({
      id: i + 1,
      timestamp: '', // filled after sort
      action: actionMap[type] || type,
      description: desc,
      user: rng.pick([...agentNames, 'System']),
      type,
      icon: ACTIVITY_ICONS[type] || '📋',
      _hoursAgo: i * rng.int(1, 6), // temp sort key
    });
  }

  // Sort by hoursAgo ascending (most-recent first = lowest hoursAgo)
  activities.sort((a, b) => (a as any)._hoursAgo - (b as any)._hoursAgo);

  // Assign timestamps and IDs after sort, then strip temp field
  return activities.map((a, idx) => {
    const hoursAgo = idx * 2 + 1; // guaranteed descending
    const ts = new Date(Date.now() - hoursAgo * 3600000)
      .toISOString()
      .replace('T', ' ')
      .slice(0, 16);
    const { _hoursAgo, ...rest } = a as any;
    return { ...rest, id: idx + 1, timestamp: ts } as GeneratedActivity;
  });
}
