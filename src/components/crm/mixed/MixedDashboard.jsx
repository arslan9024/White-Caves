import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './MixedDashboard.css';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' }
  }
};

export default function MixedDashboard({
  departmentId,
  departmentLabel,
  assistantId,
  assistantName,
  statsComponent,
  flowchartComponent,
  tableComponent,
  activityComponent,
  quickActionsComponent,
  children
}) {
  return (
    <motion.div 
      className="mixed-dashboard"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div className="mixed-dashboard-header" variants={itemVariants}>
        <div className="header-info">
          <h2 className="dashboard-title">{departmentLabel}</h2>
          {assistantName && (
            <span className="assistant-badge">
              <span className="assistant-dot"></span>
              Powered by {assistantName}
            </span>
          )}
        </div>
        {quickActionsComponent && (
          <div className="quick-actions-slot">
            {quickActionsComponent}
          </div>
        )}
      </motion.div>

      {statsComponent && (
        <motion.div className="stats-slot" variants={itemVariants}>
          {statsComponent}
        </motion.div>
      )}

      <div className="mixed-dashboard-content">
        <div className="main-content-area">
          {flowchartComponent && (
            <motion.div className="flowchart-slot" variants={itemVariants}>
              {flowchartComponent}
            </motion.div>
          )}

          {tableComponent && (
            <motion.div className="table-slot" variants={itemVariants}>
              {tableComponent}
            </motion.div>
          )}

          {children}
        </div>

        {activityComponent && (
          <motion.div className="activity-slot" variants={itemVariants}>
            {activityComponent}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

export function DashboardSection({ title, icon, children, className = '' }) {
  return (
    <motion.div 
      className={`dashboard-section ${className}`}
      variants={itemVariants}
    >
      {title && (
        <div className="section-header">
          {icon && <span className="section-icon">{icon}</span>}
          <h3 className="section-title">{title}</h3>
        </div>
      )}
      <div className="section-content">
        {children}
      </div>
    </motion.div>
  );
}
