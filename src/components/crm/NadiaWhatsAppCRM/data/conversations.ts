// WhatsApp conversations data for Nadia CRM

export interface ContactInfo {
  name: string;
  phone: string;
  avatar: string;
  status: string;
}

export interface Message {
  id: number;
  type: string;
  text: string;
  time: string;
  status?: string;
}

export interface Conversation {
  id: string;
  contact: ContactInfo;
  lastMessage: string;
  unread: number;
  time: string;
  priority: string;
  tags: string[];
  messages: Message[];
  leadId?: string | null;   // P0-017: set when conversation has been converted to a CRM lead
}

export interface QuickReply {
  id: number;
  text: string;
}

export const DUMMY_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv-1',
    contact: {
      name: 'Mohammed Al Rashid',
      phone: '+971501234567',
      avatar: 'https://i.pravatar.cc/150?img=11',
      status: 'online'
    },
    lastMessage: 'I am interested in the Marina apartment',
    unread: 3,
    time: '2 min ago',
    priority: 'hot',
    tags: ['buyer', 'luxury'],
    messages: [
      { id: 1, type: 'received', text: 'Hello, I saw your property listing', time: '10:30 AM', status: 'read' },
      { id: 2, type: 'sent', text: 'Hi Mohammed! Which property are you interested in?', time: '10:32 AM', status: 'read' },
      { id: 3, type: 'received', text: 'The 3BR apartment in Dubai Marina', time: '10:33 AM', status: 'read' },
      { id: 4, type: 'received', text: 'What is the asking price?', time: '10:33 AM', status: 'read' },
      { id: 5, type: 'ai', text: 'Nadia AI: This lead shows high buying intent. Recommend scheduling a viewing within 24 hours.', time: '10:34 AM' },
      { id: 6, type: 'received', text: 'I am interested in the Marina apartment', time: '10:35 AM', status: 'delivered' }
    ]
  },
  {
    id: 'conv-2',
    contact: {
      name: 'Sarah Williams',
      phone: '+971502345678',
      avatar: 'https://i.pravatar.cc/150?img=5',
      status: 'offline'
    },
    lastMessage: 'Can we schedule a viewing?',
    unread: 0,
    time: '1 hour ago',
    priority: 'warm',
    tags: ['tenant', 'family'],
    messages: [
      { id: 1, type: 'received', text: 'Hi, I need a 2BR apartment for rent', time: '9:00 AM', status: 'read' },
      { id: 2, type: 'sent', text: 'Hello Sarah! We have several options. What is your budget?', time: '9:05 AM', status: 'read' },
      { id: 3, type: 'received', text: 'Around 80-100k per year', time: '9:10 AM', status: 'read' },
      { id: 4, type: 'received', text: 'Can we schedule a viewing?', time: '9:15 AM', status: 'read' }
    ]
  },
  {
    id: 'conv-3',
    contact: {
      name: 'Ahmad Khalil',
      phone: '+971503456789',
      avatar: 'https://i.pravatar.cc/150?img=12',
      status: 'away'
    },
    lastMessage: 'Thank you, will get back to you',
    unread: 0,
    time: '3 hours ago',
    priority: 'cold',
    tags: ['investor'],
    messages: [
      { id: 1, type: 'received', text: 'Looking for investment properties', time: '7:00 AM', status: 'read' },
      { id: 2, type: 'sent', text: 'We have great ROI properties in Business Bay', time: '7:30 AM', status: 'read' },
      { id: 3, type: 'received', text: 'Thank you, will get back to you', time: '8:00 AM', status: 'read' }
    ]
  }
];

export const QUICK_REPLIES: QuickReply[] = [
  { id: 1, text: 'Thank you for your interest! How can I help you today?' },
  { id: 2, text: 'Would you like to schedule a property viewing?' },
  { id: 3, text: 'I will send you more details about this property.' },
  { id: 4, text: 'What is your preferred budget range?' },
  { id: 5, text: 'Our office hours are 9 AM to 6 PM, Sunday to Thursday.' }
];
