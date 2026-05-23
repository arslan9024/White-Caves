import { useState, useCallback, useMemo, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  MEETINGS,
  TASKS,
  EXECUTIVES,
  ASSISTANT_COLORS,
  Meeting,
  Task,
  Executive,
} from '../data/executive';
import { ZOE_EXECUTIVE_FEATURES } from '../data/features';
import type { ExecutiveSuggestion } from '../../../../store/slices/aiAssistant/types';
import {
  selectFilteredSuggestions,
  selectUnreviewedSuggestionsCount,
  selectCriticalSuggestions,
  selectExecutiveSuggestions,
  updateSuggestionStatus,
  selectLeadFunnelMetrics,
  selectComplianceMetrics,
  selectConfidentialVault,
} from '../../../../store/slices/aiAssistantDashboardSlice';
import { authFetch } from '../../../../utils/authFetch';

// ─── API response adapters ────────────────────────────────────────────────

interface ApiAppointment {
  id: string;
  title?: string | null;
  type: string;
  scheduledAt: string;
  duration?: number | null;
  attendees?: number | null;
  location?: string | null;
  status: string;
}

interface ApiAgent {
  id: string;
  name?: string | null;
  role: string;
  photoUrl?: string | null;
  status: string;
}

function appointmentToMeeting(a: ApiAppointment, index: number): Meeting {
  const date = new Date(a.scheduledAt);
  const time = date.toLocaleTimeString('en-AE', { hour: '2-digit', minute: '2-digit' });
  const durationMin = a.duration ?? 60;
  const duration = durationMin >= 60 ? `${Math.floor(durationMin / 60)}h` : `${durationMin}m`;
  return {
    id: index + 1,
    title: a.title ?? a.type.charAt(0).toUpperCase() + a.type.slice(1),
    time,
    duration,
    type: a.type,
    attendees: a.attendees ?? 1,
    location: a.location ?? 'TBD',
    status: a.status === 'confirmed' || a.status === 'scheduled' ? 'upcoming' : a.status,
  };
}

function agentToExecutive(u: ApiAgent, index: number): Executive {
  const initials = (u.name ?? 'U')
    .split(' ')
    .map(w => w[0] ?? '')
    .join('')
    .slice(0, 2)
    .toUpperCase();
  return {
    id: index + 1,
    name: u.name ?? 'Unknown',
    role: u.role.charAt(0).toUpperCase() + u.role.slice(1),
    avatar: u.photoUrl ?? initials,
    status: u.status === 'active' ? 'available' : 'busy',
  };
}

export const useExecutiveData = () => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState<string>('suggestions');
  const [selectedSuggestion, setSelectedSuggestion] = useState<unknown>(null);
  const [meetings, setMeetings] = useState<Meeting[]>(MEETINGS);
  const [tasks, setTasks] = useState<Task[]>(TASKS);
  const [executives, setExecutives] = useState<Executive[]>(EXECUTIVES);
  const [meetingSearch, setMeetingSearch] = useState<string>('');
  const [taskFilter, setTaskFilter] = useState<string>('all');

  // Load live meetings from /api/appointments/upcoming (type=meeting)
  useEffect(() => {
    authFetch('/api/appointments/upcoming')
      .then(r => r.json())
      .then(res => {
        const appts: ApiAppointment[] = (res.data ?? []).filter(
          (a: ApiAppointment) => a.type === 'meeting'
        );
        if (appts.length > 0) {
          setMeetings(appts.map(appointmentToMeeting));
        }
      })
      .catch(() => {
        // Retain static fallback on API failure — non-critical
      });
  }, []);

  // Load live executives (senior users) from /api/agents
  useEffect(() => {
    authFetch('/api/agents?pageSize=20')
      .then(r => r.json())
      .then(res => {
        const users: ApiAgent[] = res.data ?? [];
        if (users.length > 0) {
          setExecutives(users.map(agentToExecutive));
        }
      })
      .catch(() => {
        // Retain static fallback on API failure — non-critical
      });
  }, []);

  // Redux selectors
  const filteredSuggestions = useSelector(selectFilteredSuggestions);
  const unreviewedCount = useSelector(selectUnreviewedSuggestionsCount);
  const criticalSuggestions = useSelector(selectCriticalSuggestions);
  const { filters } = useSelector(selectExecutiveSuggestions);
  const funnelMetrics = useSelector(selectLeadFunnelMetrics);
  const complianceMetrics = useSelector(selectComplianceMetrics);
  const vault = useSelector(selectConfidentialVault);

  const handleStatusChange = useCallback(
    (suggestionId: string, status: string) => {
      dispatch(
        updateSuggestionStatus({
          suggestionId,
          status: status as ExecutiveSuggestion['status'],
        })
      );
    },
    [dispatch]
  );

  const getUpcomingMeetings = useCallback(() => {
    return meetings.filter(m => m.status === 'upcoming');
  }, [meetings]);

  const getHighPriorityTasks = useCallback(() => {
    return tasks.filter(t => t.priority === 'high');
  }, [tasks]);

  const getTasksByStatus = useCallback(
    (status: string) => {
      if (status === 'all') return tasks;
      return tasks.filter(t => t.status === status);
    },
    [tasks]
  );

  const getAvailableExecutives = useCallback(() => {
    return executives.filter(e => e.status === 'available');
  }, [executives]);

  const filteredMeetings = useMemo(
    () =>
      meetings.filter(
        meeting =>
          meeting.title.toLowerCase().includes(meetingSearch.toLowerCase()) ||
          meeting.location.toLowerCase().includes(meetingSearch.toLowerCase())
      ),
    [meetings, meetingSearch]
  );

  const filteredTasks = useMemo(() => getTasksByStatus(taskFilter), [getTasksByStatus, taskFilter]);

  return {
    activeTab,
    setActiveTab,
    selectedSuggestion,
    setSelectedSuggestion,
    meetings,
    tasks,
    executives,
    meetingSearch,
    setMeetingSearch,
    taskFilter,
    setTaskFilter,
    filteredSuggestions,
    unreviewedCount,
    criticalSuggestions,
    filters,
    funnelMetrics,
    complianceMetrics,
    vault,
    handleStatusChange,
    getUpcomingMeetings,
    getHighPriorityTasks,
    getTasksByStatus,
    getAvailableExecutives,
    filteredMeetings,
    filteredTasks,
    assistantColors: ASSISTANT_COLORS,
    features: ZOE_EXECUTIVE_FEATURES,
  };
};
