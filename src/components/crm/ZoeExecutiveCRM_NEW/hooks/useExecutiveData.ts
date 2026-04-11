import { useState, useCallback, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { MEETINGS, TASKS, EXECUTIVES, ASSISTANT_COLORS, Meeting, Task, Executive } from '../data/executive';
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
  selectConfidentialVault
} from '../../../../store/slices/aiAssistantDashboardSlice';

export const useExecutiveData = () => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState<string>('suggestions');
  const [selectedSuggestion, setSelectedSuggestion] = useState<unknown>(null);
  const [meetings, setMeetings] = useState<Meeting[]>(MEETINGS);
  const [tasks, setTasks] = useState<Task[]>(TASKS);
  const [executives, setExecutives] = useState<Executive[]>(EXECUTIVES);
  const [meetingSearch, setMeetingSearch] = useState<string>('');
  const [taskFilter, setTaskFilter] = useState<string>('all');

  // Redux selectors
  const filteredSuggestions = useSelector(selectFilteredSuggestions);
  const unreviewedCount = useSelector(selectUnreviewedSuggestionsCount);
  const criticalSuggestions = useSelector(selectCriticalSuggestions);
  const { filters } = useSelector(selectExecutiveSuggestions);
  const funnelMetrics = useSelector(selectLeadFunnelMetrics);
  const complianceMetrics = useSelector(selectComplianceMetrics);
  const vault = useSelector(selectConfidentialVault);

  const handleStatusChange = useCallback((suggestionId: string, status: string) => {
    dispatch(updateSuggestionStatus({
      suggestionId,
      status: status as ExecutiveSuggestion['status'],
    }));
  }, [dispatch]);

  const getUpcomingMeetings = useCallback(() => {
    return meetings.filter(m => m.status === 'upcoming');
  }, [meetings]);

  const getHighPriorityTasks = useCallback(() => {
    return tasks.filter(t => t.priority === 'high');
  }, [tasks]);

  const getTasksByStatus = useCallback((status: string) => {
    if (status === 'all') return tasks;
    return tasks.filter(t => t.status === status);
  }, [tasks]);

  const getAvailableExecutives = useCallback(() => {
    return executives.filter(e => e.status === 'available');
  }, [executives]);

  const filteredMeetings = useMemo(() => meetings.filter(meeting =>
    meeting.title.toLowerCase().includes(meetingSearch.toLowerCase()) ||
    meeting.location.toLowerCase().includes(meetingSearch.toLowerCase())
  ), [meetings, meetingSearch]);

  const filteredTasks = useMemo(
    () => getTasksByStatus(taskFilter),
    [getTasksByStatus, taskFilter]
  );

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
    features: ZOE_EXECUTIVE_FEATURES
  };
};
