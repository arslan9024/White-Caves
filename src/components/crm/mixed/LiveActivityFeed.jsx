import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  User, 
  FileText, 
  Home, 
  DollarSign,
  MessageSquare,
  Bot,
  ArrowRight
} from 'lucide-react';
import './LiveActivityFeed.css';

const ICON_MAP = {
  success: CheckCircle,
  warning: AlertCircle,
  pending: Clock,
  user: User,
  document: FileText,
  property: Home,
  payment: DollarSign,
  message: MessageSquare,
  ai: Bot
};

const itemVariants = {
  initial: { opacity: 0, x: -20, height: 0 },
  animate: { 
    opacity: 1, 
    x: 0, 
    height: 'auto',
    transition: { duration: 0.3, ease: 'easeOut' }
  },
  exit: { 
    opacity: 0, 
    x: 20, 
    height: 0,
    transition: { duration: 0.2 }
  }
};

export default function LiveActivityFeed({ 
  activities = [], 
  title = 'Recent Activity',
  maxItems = 10,
  showTimestamp = true,
  onActivityClick
}) {
  const displayActivities = activities.slice(0, maxItems);

  return (
    <div className="live-activity-feed">
      <div className="feed-header">
        <h4 className="feed-title">{title}</h4>
        <span className="feed-count">{activities.length} items</span>
      </div>
      
      <div className="feed-list">
        <AnimatePresence mode="popLayout">
          {displayActivities.map((activity, index) => {
            const IconComponent = ICON_MAP[activity.icon] || Clock;
            
            return (
              <motion.div
                key={activity.id || index}
                className={`activity-item ${activity.type || 'default'}`}
                variants={itemVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                layout
                onClick={() => onActivityClick?.(activity)}
                style={{ cursor: onActivityClick ? 'pointer' : 'default' }}
              >
                <div 
                  className={`activity-icon ${activity.type || 'default'}`}
                  style={{ background: activity.iconBg }}
                >
                  <IconComponent size={16} />
                </div>
                
                <div className="activity-content">
                  <p className="activity-text">
                    {activity.actor && (
                      <span className="activity-actor">{activity.actor}</span>
                    )}
                    {activity.action}
                    {activity.target && (
                      <span className="activity-target">{activity.target}</span>
                    )}
                  </p>
                  
                  {showTimestamp && activity.timestamp && (
                    <span className="activity-time">{activity.timestamp}</span>
                  )}
                </div>
                
                {activity.hasAction && (
                  <ArrowRight size={16} className="activity-arrow" />
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
        
        {activities.length === 0 && (
          <div className="feed-empty">
            <Clock size={24} />
            <span>No recent activity</span>
          </div>
        )}
      </div>
      
      {activities.length > maxItems && (
        <button className="feed-view-all">
          View all {activities.length} activities
        </button>
      )}
    </div>
  );
}

export function AIActivityItem({ 
  assistant, 
  action, 
  target, 
  timestamp,
  status = 'completed'
}) {
  return (
    <motion.div
      className={`ai-activity-item ${status}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div 
        className="ai-avatar"
        style={{ background: assistant?.color || '#B03737' }}
      >
        <Bot size={14} />
      </div>
      
      <div className="ai-activity-content">
        <p className="ai-action">
          <span className="ai-name">{assistant?.name || 'AI'}</span>
          {action}
          {target && <span className="ai-target">{target}</span>}
        </p>
        <span className="ai-time">{timestamp}</span>
      </div>
      
      <span className={`ai-status ${status}`}>
        {status === 'completed' && <CheckCircle size={14} />}
        {status === 'pending' && <Clock size={14} />}
        {status === 'error' && <AlertCircle size={14} />}
      </span>
    </motion.div>
  );
}
