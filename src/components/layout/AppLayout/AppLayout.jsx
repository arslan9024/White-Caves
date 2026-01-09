import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Menu, GripVertical } from 'lucide-react';
import DashboardHeader from '../../dashboard/DashboardHeader';
import MainNavBar from '../MainNavBar/MainNavBar';
import AssistantHubSidebar from '../AssistantHubSidebar/AssistantHubSidebar';
import MainGridView from '../../dashboard/MainGridView/MainGridView';
import { setActiveAssistant, setMainViewContent } from '../../../store/appSlice';
import './DashboardAppLayout.css';

const SIDEBAR_MIN = 200;
const SIDEBAR_MAX = 400;
const SIDEBAR_DEFAULT = 280;
const SIDEBAR_COLLAPSED = 70;
const STORAGE_KEY = 'wc-sidebar-width';
const COLLAPSED_KEY = 'wc-sidebar-collapsed';

const DashboardAppLayout = ({ children, user, onLogout }) => {
  const dispatch = useDispatch();
  const resizeRef = useRef(null);
  const isResizing = useRef(false);
  
  const [sidebarWidth, setSidebarWidth] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? parseInt(saved, 10) : SIDEBAR_DEFAULT;
  });
  
  const [isCollapsed, setIsCollapsed] = useState(() => {
    return localStorage.getItem(COLLAPSED_KEY) === 'true';
  });
  
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

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, sidebarWidth.toString());
  }, [sidebarWidth]);

  useEffect(() => {
    localStorage.setItem(COLLAPSED_KEY, isCollapsed.toString());
  }, [isCollapsed]);

  const handleMouseDown = useCallback((e) => {
    e.preventDefault();
    isResizing.current = true;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (!isResizing.current) return;
    const sidebarContainer = document.querySelector('.sidebar-container');
    if (!sidebarContainer) return;
    const sidebarLeft = sidebarContainer.getBoundingClientRect().left;
    const newWidth = Math.max(SIDEBAR_MIN, Math.min(SIDEBAR_MAX, e.clientX - sidebarLeft));
    setSidebarWidth(newWidth);
    setIsCollapsed(false);
  }, []);

  const handleMouseUp = useCallback(() => {
    isResizing.current = false;
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  }, []);

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

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
    if (isMobile) {
      setSidebarOpen(!sidebarOpen);
    } else {
      setIsCollapsed(!isCollapsed);
    }
  };

  const currentWidth = isCollapsed ? SIDEBAR_COLLAPSED : sidebarWidth;

  return (
    <div className="dashboard-app-wrapper">
      <MainNavBar showDashboardNav={true} user={user} onLogout={onLogout} />
      
      <div 
        className={`dashboard-app-layout ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'} ${isTablet ? 'tablet' : ''} ${isMobile ? 'mobile' : ''} ${isCollapsed ? 'collapsed' : ''}`}
        style={{ '--sidebar-width': `${currentWidth}px` }}
      >
        <div className="sidebar-container" style={{ width: currentWidth }}>
          <AssistantHubSidebar 
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            onAssistantSelect={handleAssistantSelect}
            activeAssistant={activeAssistant}
            isCollapsed={isCollapsed}
          />
          
          {!isMobile && !isCollapsed && (
            <div 
              ref={resizeRef}
              className="sidebar-resize-handle"
              onMouseDown={handleMouseDown}
            >
              <GripVertical size={12} />
            </div>
          )}
        </div>
        
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
    </div>
  );
};

export default DashboardAppLayout;
