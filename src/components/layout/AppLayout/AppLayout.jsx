import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Menu } from 'lucide-react';
import DashboardHeader from '../../dashboard/DashboardHeader';
import AssistantHubSidebar from '../AssistantHubSidebar/AssistantHubSidebar';
import MainGridView from '../../dashboard/MainGridView/MainGridView';
import { setActiveAssistant, setMainViewContent } from '../../../store/appSlice';
import './DashboardAppLayout.css';

const DashboardAppLayout = ({ children, user, onLogout }) => {
  const dispatch = useDispatch();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isTablet, setIsTablet] = useState(window.innerWidth >= 768 && window.innerWidth < 1024);
  
  const activeAssistant = useSelector(state => state.app?.activeAssistant);
  const mainViewContent = useSelector(state => state.app?.mainViewContent);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
      
      if (width < 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleAssistantSelect = (assistant) => {
    dispatch(setActiveAssistant(assistant));
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  const handleFeatureSelect = (feature) => {
    dispatch(setMainViewContent({
      component: feature.component,
      props: feature.props || {}
    }));
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className={`dashboard-app-layout ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'} ${isTablet ? 'tablet' : ''} ${isMobile ? 'mobile' : ''}`}>
      <AssistantHubSidebar 
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onAssistantSelect={handleAssistantSelect}
        activeAssistant={activeAssistant}
        isCollapsed={isTablet && !isMobile}
      />
      
      <div className="dashboard-app-main">
        <DashboardHeader 
          activeAssistant={activeAssistant}
          onFeatureSelect={handleFeatureSelect}
          onMenuToggle={toggleSidebar}
          user={user}
          onLogout={onLogout}
        />
        
        <main className="dashboard-main-grid-area">
          <MainGridView 
            content={mainViewContent}
            activeAssistant={activeAssistant}
          >
            {children}
          </MainGridView>
        </main>
      </div>

      {isMobile && sidebarOpen && (
        <div className="dashboard-sidebar-overlay" onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  );
};

export default DashboardAppLayout;
