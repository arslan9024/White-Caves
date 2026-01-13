import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import LeftSidebarCRM from '../LeftSidebarCRM';
import RightAssistantPanel from '../RightAssistantPanel';
import {
  selectLeftSidebar,
  selectRightSidebar,
  selectDashboardMode,
  selectActiveContext
} from '../../../store/slices/workspaceSlice';
import { AI_ASSISTANTS, DEPARTMENTS } from '../../../config/assistantRegistry';
import WelcomeDashboard from './WelcomeDashboard';
import DepartmentDashboard from './DepartmentDashboard';
import AssistantDashboard from './AssistantDashboard';
import MixedCollaborativeDashboard from './MixedCollaborativeDashboard';
import './TwoPaneLayout.css';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.3 }
  },
  exit: { 
    opacity: 0,
    transition: { duration: 0.2 }
  }
};

export default function TwoPaneLayout({ children }) {
  const leftSidebar = useSelector(selectLeftSidebar);
  const rightSidebar = useSelector(selectRightSidebar);
  const dashboardMode = useSelector(selectDashboardMode);
  const activeContext = useSelector(selectActiveContext);

  const selectedDepartmentData = useMemo(() => {
    if (!activeContext.department) return null;
    return {
      id: activeContext.department,
      ...DEPARTMENTS[activeContext.department]
    };
  }, [activeContext.department]);

  const selectedAssistantData = useMemo(() => {
    if (!activeContext.assistant) return null;
    return AI_ASSISTANTS[activeContext.assistant];
  }, [activeContext.assistant]);

  const renderDashboard = () => {
    switch (dashboardMode) {
      case 'mixed':
        return (
          <MixedCollaborativeDashboard
            department={selectedDepartmentData}
            assistant={selectedAssistantData}
            pillar={activeContext.pillar}
          />
        );
      case 'department':
        return (
          <DepartmentDashboard
            department={selectedDepartmentData}
            pillar={activeContext.pillar}
          />
        );
      case 'assistant':
        return (
          <AssistantDashboard
            assistant={selectedAssistantData}
          />
        );
      case 'welcome':
      default:
        return <WelcomeDashboard />;
    }
  };

  return (
    <div className="two-pane-layout">
      <LeftSidebarCRM />
      
      <main className="main-content-area">
        <div className="dashboard-header-bar">
          <div className="context-breadcrumbs">
            {dashboardMode === 'mixed' && (
              <>
                <span className="breadcrumb-item dept" style={{ color: selectedDepartmentData?.color }}>
                  {selectedDepartmentData?.label}
                </span>
                <span className="breadcrumb-separator">+</span>
                <span className="breadcrumb-item assistant" style={{ color: selectedAssistantData?.color }}>
                  {selectedAssistantData?.name}
                </span>
                <span className="breadcrumb-mode">Collaborative Mode</span>
              </>
            )}
            {dashboardMode === 'department' && (
              <span className="breadcrumb-item">
                {activeContext.pillar ? `Pillar: ${activeContext.pillar}` : selectedDepartmentData?.label}
              </span>
            )}
            {dashboardMode === 'assistant' && (
              <span className="breadcrumb-item" style={{ color: selectedAssistantData?.color }}>
                {selectedAssistantData?.name} - {selectedAssistantData?.title}
              </span>
            )}
            {dashboardMode === 'welcome' && (
              <span className="breadcrumb-item">Dashboard Overview</span>
            )}
          </div>
          <div className="mode-indicator">
            <span className={`mode-badge ${dashboardMode}`}>
              {dashboardMode === 'mixed' ? 'Collaborative' : 
               dashboardMode === 'department' ? 'CRM' :
               dashboardMode === 'assistant' ? 'AI' : 'Overview'}
            </span>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={dashboardMode + (activeContext.department || '') + (activeContext.assistant || '')}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="dashboard-content"
          >
            {renderDashboard()}
          </motion.div>
        </AnimatePresence>
      </main>

      <RightAssistantPanel />
    </div>
  );
}
