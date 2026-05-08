// Executive data for Zoe Executive CRM

export interface Meeting {
  id: number;
  title: string;
  time: string;
  duration: string;
  type: string;
  attendees: number;
  location: string;
  status: string;
}

export interface Task {
  id: number;
  title: string;
  priority: string;
  dueDate: string;
  status: string;
  assignee: string;
}

export interface Executive {
  id: number;
  name: string;
  role: string;
  avatar: string;
  status: string;
}

export const MEETINGS: Meeting[] = [
  {
    id: 1,
    title: 'Board Meeting Q1 Review',
    time: '10:00 AM',
    duration: '2h',
    type: 'board',
    attendees: 8,
    location: 'Conference Room A',
    status: 'upcoming',
  },
  {
    id: 2,
    title: 'Client Meeting - Al Rashid Family',
    time: '2:00 PM',
    duration: '1h',
    type: 'client',
    attendees: 4,
    location: 'VIP Room',
    status: 'upcoming',
  },
  {
    id: 3,
    title: 'Marketing Strategy Review',
    time: '4:00 PM',
    duration: '45m',
    type: 'internal',
    attendees: 5,
    location: 'Zoom',
    status: 'upcoming',
  },
  {
    id: 4,
    title: 'Property Tour - Palm Jumeirah',
    time: '9:00 AM',
    duration: '3h',
    type: 'site_visit',
    attendees: 3,
    location: 'Palm Jumeirah',
    status: 'completed',
  },
];

export const TASKS: Task[] = [
  {
    id: 1,
    title: 'Review Q1 Financial Report',
    priority: 'high',
    dueDate: '2024-01-10',
    status: 'in_progress',
    assignee: 'CEO',
  },
  {
    id: 2,
    title: 'Approve Marketing Budget',
    priority: 'medium',
    dueDate: '2024-01-12',
    status: 'pending',
    assignee: 'CEO',
  },
  {
    id: 3,
    title: 'Sign Partnership Agreement',
    priority: 'high',
    dueDate: '2024-01-09',
    status: 'completed',
    assignee: 'CEO',
  },
  {
    id: 4,
    title: 'Review New Agent Applications',
    priority: 'low',
    dueDate: '2024-01-15',
    status: 'pending',
    assignee: 'CEO',
  },
];

export const EXECUTIVES: Executive[] = [
  { id: 1, name: 'Arslan Malik', role: 'CEO & Founder', avatar: '👨‍💼', status: 'available' },
  { id: 2, name: 'Fatima Hassan', role: 'COO', avatar: '👩‍💼', status: 'in_meeting' },
  { id: 3, name: 'Ahmed Al Rashid', role: 'CFO', avatar: '👨‍💻', status: 'available' },
  { id: 4, name: 'Sarah Al Maktoum', role: 'CMO', avatar: '👩‍💻', status: 'busy' },
];

export const ASSISTANT_COLORS: Record<string, string> = {
  clara: '#F59E0B',
  olivia: '#4FACFE',
  nancy: '#10B981',
  theodora: '#8B5CF6',
  mary: '#EC4899',
  nadia: '#06B6D4',
  nina: '#EF4444',
  laila: '#6366F1',
  aurora: '#14B8A6',
  sophia: '#F97316',
  apex: '#E31E24',
};
