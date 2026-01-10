import React, { useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import TopCommandBar from './TopCommandBar';
import IntelligentSidebar from './IntelligentSidebar';
import DashboardWorkspace from './DashboardWorkspace';
import { 
  setBreakpoint, 
  selectSidebar, 
  selectLayout,
  closeMobileMenu 
} from '../../store/slices/navigationUISlice';
import { selectActiveRole } from '../../store/slices/accessControlSlice';
import './AppShell.css';

const AppShell = ({ children }) => {
  const dispatch = useDispatch();
  const sidebar = useSelector(selectSidebar);
  const layout = useSelector(selectLayout);
  const activeRole = useSelector(selectActiveRole);

  const handleResize = useCallback(() => {
    dispatch(setBreakpoint(window.innerWidth));
  }, [dispatch]);

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
      }
      if (e.key === 'Escape') {
        dispatch(closeMobileMenu());
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [dispatch]);

  const sidebarWidth = sidebar.isCollapsed ? 72 : 280;
  const isMobile = layout.breakpoint === 'mobile';

  return (
    <div 
      className={`app-shell ${layout.breakpoint} ${sidebar.isCollapsed ? 'sidebar-collapsed' : ''}`}
      style={{
        '--sidebar-width': isMobile ? '0px' : `${sidebarWidth}px`,
        '--topbar-height': '64px'
      }}
    >
      <TopCommandBar />
      
      <div className="app-shell-body">
        <IntelligentSidebar />
        
        <main className="app-shell-main">
          {children || <DashboardWorkspace />}
        </main>
      </div>

      {isMobile && layout.isMobileMenuOpen && (
        <div 
          className="mobile-overlay"
          onClick={() => dispatch(closeMobileMenu())}
        />
      )}
    </div>
  );
};

export default AppShell;
