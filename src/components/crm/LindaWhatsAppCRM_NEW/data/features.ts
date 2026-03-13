// Linda WhatsApp CRM feature catalog

export interface WhatsAppFeature {
  id: string;
  name: string;
  description: string;
  category: string;
  status: string;
}

export const LINDA_WHATSAPP_FEATURES: WhatsAppFeature[] = [
  {
    id: 'ai-messaging',
    name: 'AI-Powered Messaging',
    description: 'Linda AI provides intelligent responses and lead scoring',
    category: 'AI Features',
    status: 'active'
  },
  {
    id: 'conversation-management',
    name: 'Conversation Management',
    description: 'Organize and track all customer conversations',
    category: 'Communication',
    status: 'active'
  },
  {
    id: 'quick-replies',
    name: 'Quick Replies',
    description: 'Pre-defined responses for common questions',
    category: 'Automation',
    status: 'active'
  },
  {
    id: 'lead-scoring',
    name: 'Lead Scoring',
    description: 'Automatic lead qualification and prioritization',
    category: 'CRM',
    status: 'active'
  },
  {
    id: 'agent-assignment',
    name: 'Agent Assignment',
    description: 'Route conversations to appropriate team members',
    category: 'Organization',
    status: 'active'
  },
  {
    id: 'message-templates',
    name: 'Message Templates',
    description: 'Create and manage response templates',
    category: 'Communication',
    status: 'active'
  },
  {
    id: 'contact-tagging',
    name: 'Contact Tagging',
    description: 'Organize contacts with custom tags',
    category: 'CRM',
    status: 'active'
  },
  {
    id: 'conversation-history',
    name: 'Conversation History',
    description: 'Full message history and search capabilities',
    category: 'Organization',
    status: 'active'
  }
];
