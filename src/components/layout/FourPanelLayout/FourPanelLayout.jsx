import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Menu, X, ChevronRight } from 'lucide-react';
import TopNavigation from './TopNavigation';
import LeftSidebar from './LeftSidebar';
import CentralPane from './CentralPane';
import RightAISidebar from './RightAISidebar';
import './FourPanelLayout.css';

/**
 * FourPanelLayout Component
 * 
 * Master layout component implementing the complete 4-panel architecture:
 * - Top Navigation: Global controls, search, user profile
 * - Left Sidebar: OOP object hierarchy (200+ objects), navigation, favorites
 * - Central Pane: Dynamic content (dashboards, forms, details, analytics)
 * - Right AI Sidebar: 32 AI assistants with context-aware tools
 * 
 * Responsive behavior:
 * - 1440px+: All 4 panels visible
 * - 1024-1439px: Right sidebar collapses to icons
 * - 768-1023px: Left sidebar becomes hamburger
 * - <768px: Single column, bottom navigation
 */

export default function FourPanelLayout({ children }) {
  const dispatch = useDispatch();
  
  // UI State
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(true);
  const [rightSidebarCollapsed, setRightSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [screenSize, setScreenSize] = useState(window.innerWidth);
  
  // Redux State
  const selectedObject = useSelector(state => state.navigation?.selectedObject);
  const currentView = useSelector(state => state.navigation?.currentView);
  const activeAssistant = useSelector(state => state.ai?.activeAssistant);
  
  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setScreenSize(width);
      
      // Auto-collapse sidebars on smaller screens
      if (width < 1024) {
        setRightSidebarCollapsed(true);
      } else {
        setRightSidebarCollapsed(false);
      }
      
      if (width < 768) {
        setLeftSidebarOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Determine panel visibility based on screen size
  const showLeftSidebar = screenSize >= 768 || leftSidebarOpen;
  const showRightSidebar = screenSize >= 1024 && !rightSidebarCollapsed;
  const rightSidebarCompact = screenSize >= 1024 && screenSize < 1440;
  const isMobile = screenSize < 768;
  
  return (
    <div className="four-panel-layout">
      {/* Top Navigation - Always visible */}
      <TopNavigation 
        onMenuToggle={() => setLeftSidebarOpen(!leftSidebarOpen)}
        onAssistantToggle={() => setRightSidebarCollapsed(!rightSidebarCollapsed)}
        mobileMenuOpen={mobileMenuOpen}
      />
      
      <div className="layout-container">
        {/* Left Sidebar - OOP Object Hierarchy */}
        {showLeftSidebar && (
          <aside 
            className={`left-sidebar ${!leftSidebarOpen ? 'collapsed' : ''}`}
            style={{ 
              transform: isMobile && !leftSidebarOpen ? 'translateX(-100%)' : 'translateX(0)'
            }}
          >
            <button 
              className="close-sidebar-mobile"
              onClick={() => setLeftSidebarOpen(false)}
              aria-label="Close sidebar"
            >
              <X size={20} />
            </button>
            <LeftSidebar />
          </aside>
        )}
        
        {/* Overlay for mobile when sidebar is open */}
        {isMobile && leftSidebarOpen && (
          <div 
            className="sidebar-overlay"
            onClick={() => setLeftSidebarOpen(false)}
          />
        )}
        
        {/* Central Dynamic Content Pane */}
        <main className="central-pane">
          <CentralPane view={currentView} object={selectedObject}>
            {children}
          </CentralPane>
        </main>
        
        {/* Right AI Sidebar - 32 Assistants */}
        {showRightSidebar && (
          <aside className={`right-sidebar ${rightSidebarCompact ? 'compact' : ''}`}>
            <RightAISidebar activeAssistant={activeAssistant} />
          </aside>
        )}
      </div>
      
      {/* Mobile Bottom Navigation */}
      {isMobile && (
        <nav className="mobile-bottom-nav">
          <button className="nav-btn active">Dashboard</button>
          <button className="nav-btn">Objects</button>
          <button className="nav-btn">Assistants</button>
          <button className="nav-btn">More</button>
        </nav>
      )}
    </div>
  );
}
