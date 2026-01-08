import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';

const AI_ASSISTANTS = {
  linda: {
    id: 'linda',
    name: 'Linda',
    role: 'WhatsApp CRM Manager',
    avatar: '👩‍💼',
    color: '#25D366',
    description: 'Manages WhatsApp conversations, lead pre-qualification, and customer engagement',
    capabilities: ['conversation_management', 'lead_scoring', 'quick_replies', 'ai_insights'],
    dataFlows: {
      outputs: ['clara'],
      inputs: ['nina']
    }
  },
  mary: {
    id: 'mary',
    name: 'Mary',
    role: 'Inventory CRM Manager',
    avatar: '👩‍💻',
    color: '#3B82F6',
    description: 'Manages DAMAC Hills 2 property inventory with 9,378+ units',
    capabilities: ['property_crud', 'data_tools', 'asset_fetcher', 'filtering'],
    dataFlows: {
      outputs: ['clara', 'linda'],
      inputs: ['clara']
    }
  },
  clara: {
    id: 'clara',
    name: 'Clara',
    role: 'Leads CRM Manager',
    avatar: '👩‍🎯',
    color: '#8B5CF6',
    description: 'Manages lead pipeline, scoring, and conversion tracking',
    capabilities: ['lead_management', 'stage_tracking', 'activity_timeline', 'scoring'],
    dataFlows: {
      outputs: ['mary', 'linda'],
      inputs: ['linda', 'mary']
    }
  },
  nina: {
    id: 'nina',
    name: 'Nina',
    role: 'WhatsApp Bot Developer',
    avatar: '👩‍🔧',
    color: '#F59E0B',
    description: 'Develops and manages WhatsApp bots for automated customer service',
    capabilities: ['bot_management', 'code_modules', 'session_control', 'analytics'],
    dataFlows: {
      outputs: ['linda'],
      inputs: []
    }
  },
  nancy: {
    id: 'nancy',
    name: 'Nancy',
    role: 'HR Manager',
    avatar: '👩‍⚖️',
    color: '#EC4899',
    description: 'Manages employees, recruitment, attendance, and performance reviews',
    capabilities: ['employee_directory', 'job_board', 'applicant_tracking', 'performance'],
    dataFlows: {
      outputs: [],
      inputs: []
    }
  }
};

const FEATURE_MAP = {
  whatsapp_lead_capture: {
    id: 'whatsapp_lead_capture',
    name: 'WhatsApp Lead Capture',
    description: 'Captures leads from WhatsApp conversations',
    sourceAssistant: 'linda',
    targetAssistant: 'clara',
    dataType: 'lead',
    automationLevel: 'semi-auto'
  },
  lead_property_matching: {
    id: 'lead_property_matching',
    name: 'Lead Property Matching',
    description: 'Matches leads with suitable properties from inventory',
    sourceAssistant: 'clara',
    targetAssistant: 'mary',
    dataType: 'property_match',
    automationLevel: 'ai-powered'
  },
  bot_conversation_routing: {
    id: 'bot_conversation_routing',
    name: 'Bot Conversation Routing',
    description: 'Routes bot conversations to Linda for human follow-up',
    sourceAssistant: 'nina',
    targetAssistant: 'linda',
    dataType: 'conversation',
    automationLevel: 'automated'
  },
  property_inquiry_notification: {
    id: 'property_inquiry_notification',
    name: 'Property Inquiry Notification',
    description: 'Notifies when leads inquire about specific properties',
    sourceAssistant: 'mary',
    targetAssistant: 'clara',
    dataType: 'inquiry',
    automationLevel: 'automated'
  },
  agent_assignment: {
    id: 'agent_assignment',
    name: 'Agent Assignment',
    description: 'Assigns leads to sales agents based on criteria',
    sourceAssistant: 'clara',
    targetAssistant: 'nancy',
    dataType: 'assignment',
    automationLevel: 'semi-auto'
  }
};

const generateActivities = () => {
  const now = Date.now();
  return [
    { id: 1, assistant: 'linda', action: 'New lead captured', target: 'Ahmed Al-Rashid', timestamp: new Date(now - 300000).toISOString(), status: 'success' },
    { id: 2, assistant: 'clara', action: 'Lead stage updated', target: 'Sarah Johnson', timestamp: new Date(now - 600000).toISOString(), status: 'success' },
    { id: 3, assistant: 'mary', action: 'Property updated', target: 'Villa 348, Cluster 6', timestamp: new Date(now - 900000).toISOString(), status: 'success' },
    { id: 4, assistant: 'nina', action: 'Bot session started', target: 'Lion0 Bot', timestamp: new Date(now - 1200000).toISOString(), status: 'active' },
    { id: 5, assistant: 'nancy', action: 'Interview scheduled', target: 'Mohammed Ali', timestamp: new Date(now - 1500000).toISOString(), status: 'pending' },
    { id: 6, assistant: 'linda', action: 'Message sent', target: 'Fatima Hassan', timestamp: new Date(now - 1800000).toISOString(), status: 'success' },
    { id: 7, assistant: 'clara', action: 'Lead qualified', target: 'James Wilson', timestamp: new Date(now - 2100000).toISOString(), status: 'success' },
    { id: 8, assistant: 'mary', action: 'Asset fetched', target: 'SD348 Layout', timestamp: new Date(now - 2400000).toISOString(), status: 'success' }
  ];
};

const DASHBOARD_STATS = {
  linda: { conversations: 47, leadsToday: 12, responseRate: 94, avgResponseTime: '2.3 min' },
  mary: { totalProperties: 9378, updatedToday: 23, pendingReview: 8, assetsFetched: 156 },
  clara: { totalLeads: 234, hotLeads: 18, conversions: 7, pipelineValue: 'AED 45.2M' },
  nina: { activeBots: 3, messagesHandled: 892, automationRate: 78, uptime: '99.9%' },
  nancy: { employees: 24, openPositions: 3, applicants: 12, reviewsPending: 5 }
};

const getInitialState = () => ({
  assistants: AI_ASSISTANTS,
  featureMap: FEATURE_MAP,
  activeAssistant: null,
  activities: generateActivities(),
  stats: DASHBOARD_STATS,
  crossFlowQueue: [],
  syncStatus: 'idle',
  lastSync: null,
  notifications: [],
  ownerAccessOnly: true,
  initialized: false
});

const initialState = getInitialState();

export const syncAssistantData = createAsyncThunk(
  'aiAssistants/syncData',
  async ({ sourceId, targetId, data }, { getState }) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { sourceId, targetId, data, timestamp: new Date().toISOString() };
  }
);

export const transferLead = createAsyncThunk(
  'aiAssistants/transferLead',
  async ({ lead, fromAssistant, toAssistant }, { dispatch }) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    dispatch(addActivity({
      assistant: toAssistant,
      action: `Lead transferred from ${fromAssistant}`,
      target: lead.name,
      status: 'success'
    }));
    return { lead, fromAssistant, toAssistant };
  }
);

const aiAssistantsSlice = createSlice({
  name: 'aiAssistants',
  initialState,
  reducers: {
    setActiveAssistant: (state, action) => {
      state.activeAssistant = action.payload;
    },
    addActivity: (state, action) => {
      const newActivity = {
        id: Date.now(),
        ...action.payload,
        timestamp: new Date().toISOString()
      };
      state.activities = [newActivity, ...state.activities].slice(0, 50);
    },
    updateStats: (state, action) => {
      const { assistantId, stats } = action.payload;
      if (state.stats[assistantId]) {
        state.stats[assistantId] = { ...state.stats[assistantId], ...stats };
      }
    },
    addToFlowQueue: (state, action) => {
      state.crossFlowQueue.push({
        ...action.payload,
        id: Date.now(),
        status: 'pending'
      });
    },
    processFlowQueue: (state, action) => {
      const itemId = action.payload;
      const item = state.crossFlowQueue.find(i => i.id === itemId);
      if (item) {
        item.status = 'processed';
      }
    },
    addNotification: (state, action) => {
      state.notifications.unshift({
        id: Date.now(),
        ...action.payload,
        read: false
      });
    },
    markNotificationRead: (state, action) => {
      const notification = state.notifications.find(n => n.id === action.payload);
      if (notification) notification.read = true;
    },
    clearNotifications: (state) => {
      state.notifications = [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(syncAssistantData.pending, (state) => {
        state.syncStatus = 'syncing';
      })
      .addCase(syncAssistantData.fulfilled, (state, action) => {
        state.syncStatus = 'idle';
        state.lastSync = action.payload.timestamp;
      })
      .addCase(transferLead.fulfilled, (state, action) => {
        const { toAssistant } = action.payload;
        if (toAssistant === 'clara') {
          state.stats.clara.totalLeads += 1;
        }
      });
  }
});

export const {
  setActiveAssistant,
  addActivity,
  updateStats,
  addToFlowQueue,
  processFlowQueue,
  addNotification,
  markNotificationRead,
  clearNotifications
} = aiAssistantsSlice.actions;

const selectAssistantsState = (state) => state.aiAssistants.assistants;

export const selectAllAssistants = createSelector(
  [selectAssistantsState],
  (assistants) => Object.values(assistants)
);

export const selectAssistantById = (id) => (state) => state.aiAssistants.assistants[id];
export const selectActiveAssistant = (state) => state.aiAssistants.activeAssistant;
export const selectFeatureMap = (state) => state.aiAssistants.featureMap;
export const selectActivities = (state) => state.aiAssistants.activities;
export const selectStats = (state) => state.aiAssistants.stats;
export const selectAssistantStats = (id) => (state) => state.aiAssistants.stats[id];
export const selectNotifications = (state) => state.aiAssistants.notifications;

export const selectUnreadCount = createSelector(
  [selectNotifications],
  (notifications) => notifications.filter(n => !n.read).length
);

export default aiAssistantsSlice.reducer;
