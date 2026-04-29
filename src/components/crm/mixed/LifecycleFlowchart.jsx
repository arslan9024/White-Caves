import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Circle, ArrowRight, Clock, AlertCircle } from 'lucide-react';
import './LifecycleFlowchart.css';

const stageVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: (i) => ({
    opacity: 1,
    scale: 1,
    transition: {
      delay: i * 0.15,
      duration: 0.4,
      ease: 'easeOut'
    }
  })
};

const connectorVariants = {
  hidden: { scaleX: 0 },
  visible: (i) => ({
    scaleX: 1,
    transition: {
      delay: i * 0.15 + 0.2,
      duration: 0.3,
      ease: 'easeOut'
    }
  })
};

const pulseVariants = {
  animate: {
    scale: [1, 1.2, 1],
    opacity: [0.5, 1, 0.5],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut'
    }
  }
};

export default function LifecycleFlowchart({ 
  stages = [], 
  currentStage = 0,
  stageData = {},
  title = 'Lifecycle',
  onStageClick,
  compact = false
}) {
  const getStageStatus = (index) => {
    if (index < currentStage) return 'completed';
    if (index === currentStage) return 'active';
    return 'pending';
  };

  const getStageIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle size={compact ? 16 : 20} />;
      case 'active':
        return <Clock size={compact ? 16 : 20} />;
      default:
        return <Circle size={compact ? 16 : 20} />;
    }
  };

  return (
    <div className={`lifecycle-flowchart ${compact ? 'compact' : ''}`}>
      {title && <h4 className="flowchart-title">{title}</h4>}
      
      <div className="stages-container">
        {stages.map((stage, index) => {
          const status = getStageStatus(index);
          const data = stageData[stage] || {};
          
          return (
            <React.Fragment key={stage}>
              <motion.div
                className={`stage-node ${status}`}
                custom={index}
                variants={stageVariants}
                initial="hidden"
                animate="visible"
                onClick={() => onStageClick?.(stage, index)}
                style={{ cursor: onStageClick ? 'pointer' : 'default' }}
              >
                <div className="stage-icon-wrapper">
                  {status === 'active' && (
                    <motion.div 
                      className="pulse-ring"
                      variants={pulseVariants}
                      animate="animate"
                    />
                  )}
                  <div className="stage-icon">
                    {getStageIcon(status)}
                  </div>
                </div>
                
                <div className="stage-info">
                  <span className="stage-name">{stage}</span>
                  {data.count !== undefined && (
                    <span className="stage-count">{data.count}</span>
                  )}
                </div>
                
                {data.alert && (
                  <div className="stage-alert">
                    <AlertCircle size={14} />
                  </div>
                )}
              </motion.div>
              
              {index < stages.length - 1 && (
                <motion.div
                  className={`stage-connector ${status === 'completed' ? 'completed' : ''}`}
                  custom={index}
                  variants={connectorVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <div className="connector-line" />
                  <ArrowRight size={14} className="connector-arrow" />
                </motion.div>
              )}
            </React.Fragment>
          );
        })}
      </div>
      
      {!compact && (
        <div className="stage-legend">
          <div className="legend-item">
            <span className="legend-dot completed"></span>
            <span>Completed</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot active"></span>
            <span>Active</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot pending"></span>
            <span>Pending</span>
          </div>
        </div>
      )}
    </div>
  );
}

export function VerticalLifecycle({ stages = [], currentStage = 0, stageData = {} }) {
  const getStageStatus = (index) => {
    if (index < currentStage) return 'completed';
    if (index === currentStage) return 'active';
    return 'pending';
  };

  return (
    <div className="vertical-lifecycle">
      {stages.map((stage, index) => {
        const status = getStageStatus(index);
        const data = stageData[stage] || {};
        
        return (
          <motion.div
            key={stage}
            className={`vertical-stage ${status}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="vertical-connector">
              <div className={`connector-dot ${status}`} />
              {index < stages.length - 1 && <div className={`connector-line ${status}`} />}
            </div>
            <div className="vertical-content">
              <span className="stage-label">{stage}</span>
              {data.description && <p className="stage-desc">{data.description}</p>}
              {data.count !== undefined && <span className="stage-badge">{data.count}</span>}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
