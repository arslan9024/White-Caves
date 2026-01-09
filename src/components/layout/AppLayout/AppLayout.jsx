import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Menu } from 'lucide-react';
import MainNavBar from '../MainNavBar/MainNavBar';
import DashboardFeatureBar from '../../dashboard/DashboardFeatureBar/DashboardFeatureBar';
import AssistantHubSidebar from '../AssistantHubSidebar/AssistantHubSidebar';
import MainGridView from '../../dashboard/MainGridView/MainGridView';
import { setActiveAssistant, setMainViewContent } from '../../../store/appSlice';
import './DashboardAppLayout.css';

const DashboardAppLayout = ({ children, user, onLogout }) => {
  const dispatch = useDispatch();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isTablet, setIsTablet] = useState(window.innerWidth >= 768 && window.innerWidth < 1024);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  
  const activeAssistant = useSelector(state => state.app?.activeAssistant);
  const mainViewContent = useSelector(state => state.app?.mainViewContent);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
      
      if (width >= 768) {
        setMobileSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleAssistantSelect = (assistant) => {
    dispatch(setActiveAssistant(assistant));
    if (isMobile) {
      setMobileSidebarOpen(false);
    }
  };

  const handleFeatureSelect = (feature) => {
    dispatch(setMainViewContent({
      component: feature.component,
      props: feature.props || {}
    }));
  };

  const toggleMobileSidebar = () => {
    setMobileSidebarOpen(!mobileSidebarOpen);
  };

  return (
    <div className={`dashboard-app-layout ${isMobile ? 'mobile' : ''} ${isTablet ? 'tablet' : ''}`}>
      <MainNavBar />
      
      <div className="dashboard-content-wrapper">
        <AssistantHubSidebar 
          onAssistantSelect={handleAssistantSelect}
          activeAssistant={activeAssistant}
          isMobileOpen={mobileSidebarOpen}
        />
        
        <div className="dashboard-main-section">
          <DashboardFeatureBar />
          
          <main className="dashboard-main-grid-area">
            <MainGridView 
              content={mainViewContent}
              activeAssistant={activeAssistant}
            >
              {children}
            </MainGridView>
          </main>
        </div>
      </div>

      {isMobile && (
        <button className="mobile-menu-toggle" onClick={toggleMobileSidebar}>
          <Menu size={24} />
        </button>
      )}

      {isMobile && mobileSidebarOpen && (
        <div className="dashboard-sidebar-overlay" onClick={() => setMobileSidebarOpen(false)} />
      )}
    </div>
  );
};

export default DashboardAppLayout;
