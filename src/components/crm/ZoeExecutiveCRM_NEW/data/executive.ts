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
  dispatchedByZoe?: boolean;
  departmentCode?: string;
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
    title: 'Audit 14 Active Ejari Contracts for Renewal',
    priority: 'high',
    dueDate: '2026-11-20',
    status: 'in_progress',
    assignee: 'AI Clara (DEPT-05)',
    dispatchedByZoe: true,
    departmentCode: 'DEPT-05',
  },
  {
    id: 2,
    title: 'Review Q1 Financial Report & UAE 5% VAT Escrow',
    priority: 'high',
    dueDate: '2026-11-25',
    status: 'in_progress',
    assignee: 'AI Theodora (DEPT-10)',
    dispatchedByZoe: true,
    departmentCode: 'DEPT-10',
  },
  {
    id: 3,
    title: 'RERA Trakheesi Permit Verification for Off-Plan Units',
    priority: 'medium',
    dueDate: '2026-11-28',
    status: 'completed',
    assignee: 'AI Sofia (DEPT-11)',
    dispatchedByZoe: true,
    departmentCode: 'DEPT-11',
  },
  {
    id: 4,
    title: 'Review New Broker License Applications (Nancy HR)',
    priority: 'low',
    dueDate: '2026-12-01',
    status: 'pending',
    assignee: 'AI Selena (DEPT-03)',
    dispatchedByZoe: false,
    departmentCode: 'DEPT-03',
  },
];

export const EXECUTIVES: Executive[] = [
  { id: 1, name: 'AI Zayed', role: 'Floor 12 · Executive, Governance & Strategy Director', avatar: '🏛️', status: 'available' },
  { id: 2, name: 'AI Sofia', role: 'Floor 11 · Legal, Compliance & Audit Director (RERA/AML)', avatar: '⚖️', status: 'available' },
  { id: 3, name: 'AI Theodora', role: 'Floor 10 · Accounting, Finance & Tax Director (FTA/VAT)', avatar: '💰', status: 'available' },
  { id: 4, name: 'AI Elena', role: 'Floor 09 · Research, Analytics & Market Intelligence Director', avatar: '📊', status: 'available' },
  { id: 5, name: 'AI Maya', role: 'Floor 08 · Media, Public Relations & Communications Director', avatar: '🎙️', status: 'available' },
  { id: 6, name: 'AI Maktoum', role: 'Floor 07 · Partnerships, Alliances & Capital Growth Director', avatar: '🤝', status: 'available' },
  { id: 7, name: 'AI Sentinel', role: 'Floor 06 · Inventory, Portfolio & Asset Management Director', avatar: '📦', status: 'available' },
  { id: 8, name: 'AI Clara', role: 'Floor 05 · Sales, Services & Operations Director', avatar: '💎', status: 'available' },
  { id: 9, name: 'AI Aurora', role: 'Floor 04 · Technology, Systems & Digital Infrastructure Director', avatar: '💻', status: 'available' },
  { id: 10, name: 'AI Selena', role: 'Floor 03 · Human Resources, Performance & Recruiting Director', avatar: '👥', status: 'available' },
  { id: 11, name: 'AI Olivia', role: 'Floor 02 · Marketing, Branding & Digital Acquisition Director', avatar: '📢', status: 'available' },
  { id: 12, name: 'AI Corinne', role: 'Floor 01 · Customer Experience, Concierge & Hospitality Director', avatar: '🛎️', status: 'available' },
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
  apex: '#C9A84C',
};
