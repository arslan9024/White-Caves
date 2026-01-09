const EVENT_TYPES = {
  LEAD_CAPTURED: 'LEAD_CAPTURED',
  LEAD_QUALIFIED: 'LEAD_QUALIFIED',
  LEAD_CONVERTED: 'LEAD_CONVERTED',
  PROPERTY_LISTED: 'PROPERTY_LISTED',
  PROPERTY_STATUS_UPDATED: 'PROPERTY_STATUS_UPDATED',
  PROPERTY_VIEWED: 'PROPERTY_VIEWED',
  DEAL_STARTED: 'DEAL_STARTED',
  DEAL_CLOSED: 'DEAL_CLOSED',
  DEAL_STALLED: 'DEAL_STALLED',
  INVOICE_CREATED: 'INVOICE_CREATED',
  PAYMENT_RECEIVED: 'PAYMENT_RECEIVED',
  KYC_SUBMITTED: 'KYC_SUBMITTED',
  KYC_APPROVED: 'KYC_APPROVED',
  KYC_FLAGGED: 'KYC_FLAGGED',
  COMPLIANCE_ALERT: 'COMPLIANCE_ALERT',
  MAINTENANCE_REQUEST: 'MAINTENANCE_REQUEST',
  MAINTENANCE_COMPLETED: 'MAINTENANCE_COMPLETED',
  CAMPAIGN_LAUNCHED: 'CAMPAIGN_LAUNCHED',
  SUGGESTION_SUBMITTED: 'SUGGESTION_SUBMITTED',
  TASK_ASSIGNED: 'TASK_ASSIGNED',
  TASK_COMPLETED: 'TASK_COMPLETED',
  LEGAL_RISK_IDENTIFIED: 'LEGAL_RISK_IDENTIFIED',
  CONTRACT_REVIEWED: 'CONTRACT_REVIEWED',
  PROSPECT_IDENTIFIED: 'PROSPECT_IDENTIFIED',
  PROPERTY_ALERT: 'PROPERTY_ALERT'
};

const EVENT_ROUTING = {
  [EVENT_TYPES.LEAD_CAPTURED]: ['clara', 'zoe'],
  [EVENT_TYPES.LEAD_QUALIFIED]: ['sophia', 'linda', 'zoe'],
  [EVENT_TYPES.LEAD_CONVERTED]: ['theodora', 'zoe', 'olivia'],
  [EVENT_TYPES.PROPERTY_LISTED]: ['olivia', 'linda', 'hunter'],
  [EVENT_TYPES.PROPERTY_STATUS_UPDATED]: ['clara', 'olivia', 'daisy'],
  [EVENT_TYPES.PROPERTY_VIEWED]: ['olivia', 'zoe'],
  [EVENT_TYPES.DEAL_STARTED]: ['theodora', 'laila', 'zoe'],
  [EVENT_TYPES.DEAL_CLOSED]: ['theodora', 'zoe', 'nancy', 'olivia'],
  [EVENT_TYPES.DEAL_STALLED]: ['sophia', 'linda', 'zoe'],
  [EVENT_TYPES.INVOICE_CREATED]: ['zoe'],
  [EVENT_TYPES.PAYMENT_RECEIVED]: ['zoe', 'daisy'],
  [EVENT_TYPES.KYC_SUBMITTED]: ['laila', 'evangeline'],
  [EVENT_TYPES.KYC_APPROVED]: ['clara', 'sophia', 'zoe'],
  [EVENT_TYPES.KYC_FLAGGED]: ['laila', 'evangeline', 'zoe'],
  [EVENT_TYPES.COMPLIANCE_ALERT]: ['laila', 'evangeline', 'zoe'],
  [EVENT_TYPES.MAINTENANCE_REQUEST]: ['sentinel', 'daisy'],
  [EVENT_TYPES.MAINTENANCE_COMPLETED]: ['daisy', 'mary'],
  [EVENT_TYPES.CAMPAIGN_LAUNCHED]: ['zoe'],
  [EVENT_TYPES.SUGGESTION_SUBMITTED]: ['zoe'],
  [EVENT_TYPES.TASK_ASSIGNED]: ['zoe'],
  [EVENT_TYPES.TASK_COMPLETED]: ['zoe', 'aurora'],
  [EVENT_TYPES.LEGAL_RISK_IDENTIFIED]: ['evangeline', 'laila', 'zoe'],
  [EVENT_TYPES.CONTRACT_REVIEWED]: ['evangeline', 'laila'],
  [EVENT_TYPES.PROSPECT_IDENTIFIED]: ['hunter', 'clara'],
  [EVENT_TYPES.PROPERTY_ALERT]: ['sentinel', 'mary', 'daisy']
};

const auditLog = [];

const createAuditEntry = (action, prevState, nextState) => ({
  id: `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  timestamp: new Date().toISOString(),
  actionType: action.type,
  payload: action.payload,
  actor: action.meta?.actor || 'system',
  assistantId: action.meta?.assistantId || null,
  changes: summarizeChanges(prevState, nextState)
});

const summarizeChanges = (prevState, nextState) => {
  const changes = [];
  
  if (prevState.aiAssistantDashboard?.ui?.selectedAssistant !== 
      nextState.aiAssistantDashboard?.ui?.selectedAssistant) {
    changes.push({
      field: 'selectedAssistant',
      from: prevState.aiAssistantDashboard?.ui?.selectedAssistant,
      to: nextState.aiAssistantDashboard?.ui?.selectedAssistant
    });
  }
  
  return changes;
};

const eventBusMiddleware = (store) => (next) => (action) => {
  const prevState = store.getState();
  const result = next(action);
  const nextState = store.getState();
  
  if (action.type?.startsWith('aiAssistantDashboard/')) {
    const auditEntry = createAuditEntry(action, prevState, nextState);
    auditLog.push(auditEntry);
    
    if (auditLog.length > 1000) {
      auditLog.shift();
    }
  }
  
  if (action.type === 'eventBus/emit') {
    const { eventType, payload, source } = action.payload;
    const targetAssistants = EVENT_ROUTING[eventType] || [];
    
    targetAssistants.forEach(assistantId => {
      if (assistantId !== source) {
        store.dispatch({
          type: 'aiAssistantDashboard/addNotification',
          payload: {
            assistantId,
            notification: {
              id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
              type: 'event',
              eventType,
              message: `${eventType} from ${source}`,
              data: payload,
              severity: 'info',
              isRead: false,
              timestamp: new Date().toISOString()
            }
          }
        });
      }
    });
  }
  
  return result;
};

export const emitEvent = (eventType, payload, source) => ({
  type: 'eventBus/emit',
  payload: { eventType, payload, source }
});

export const getAuditLog = () => [...auditLog];

export const clearAuditLog = () => {
  auditLog.length = 0;
};

export const getAuditLogForAssistant = (assistantId) => 
  auditLog.filter(entry => entry.assistantId === assistantId);

export { EVENT_TYPES, EVENT_ROUTING };

export default eventBusMiddleware;
