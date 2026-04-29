import React, { memo, Suspense, lazy, useCallback, type ReactNode } from 'react';
import { createLogger } from '../../../utils/logger';
import { useSelector, useDispatch } from 'react-redux';
import { Menu, X, RefreshCw } from 'lucide-react';
import AssistantSidebar from './AssistantSidebar';
import { selectCurrentAssistant } from '../../../store/slices/aiAssistantDashboardSlice';
import './UniversalAssistantLayout.css';

const LoadingSpinner = () => (
  <div className="loading-container">
    <RefreshCw size={32} className="spinner" />
    <span>Loading dashboard...</span>
  </div>
);

interface ErrorBoundaryFallbackProps {
  error: Error | null;
  resetError: () => void;
}

const ErrorBoundaryFallback = ({ error, resetError }: ErrorBoundaryFallbackProps) => (
  <div className="error-container">
    <h3>Something went wrong</h3>
    <p>{error?.message || 'An unexpected error occurred'}</p>
    <button onClick={resetError} className="retry-btn">
      <RefreshCw size={16} />
      <span>Try Again</span>
    </button>
  </div>
);

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    createLogger('DashboardErrorBoundary').error('Dashboard Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorBoundaryFallback 
          error={this.state.error}
          resetError={() => this.setState({ hasError: false, error: null })}
        />
      );
    }
    return this.props.children;
  }
}

interface SidebarItem {
  id: string;
  label: string;
  icon?: React.ComponentType<{ size?: number }>;
}

interface UniversalAssistantLayoutProps {
  sidebarItems?: SidebarItem[];
  activeFeature?: string;
  onFeatureChange?: (feature: string) => void;
  children: ReactNode;
  headerActions?: ReactNode;
  showSidebar?: boolean;
  collapsedSidebar?: boolean;
}

const UniversalAssistantLayout = memo(({ 
  sidebarItems = [],
  activeFeature,
  onFeatureChange,
  children,
  headerActions,
  showSidebar = true,
  collapsedSidebar = false
}: UniversalAssistantLayoutProps) => {
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(collapsedSidebar);
  const currentAssistant = useSelector(selectCurrentAssistant);
  
  const handleToggleSidebar = useCallback(() => {
    setSidebarCollapsed(prev => !prev);
  }, []);
  
  const assistantColor = currentAssistant?.colorScheme || '#0EA5E9';
  
  if (!currentAssistant) {
    return (
      <div className="universal-layout empty-state">
        <p>Select an AI assistant to view their dashboard</p>
      </div>
    );
  }
  
  return (
    <div 
      className={`universal-layout ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}
      style={{ '--assistant-color': assistantColor } as React.CSSProperties}
    >
      {showSidebar && (
        <AssistantSidebar
          items={sidebarItems}
          activeItem={activeFeature}
          onItemClick={onFeatureChange}
          collapsed={sidebarCollapsed}
        />
      )}
      
      <div className="layout-main">
        <header className="layout-header">
          <div className="header-left">
            {showSidebar && (
              <button 
                className="sidebar-toggle"
                onClick={handleToggleSidebar}
                title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              >
                {sidebarCollapsed ? <Menu size={20} /> : <X size={20} />}
              </button>
            )}
            <div className="header-title">
              <h1>{currentAssistant.name}</h1>
              <span className="header-subtitle">{currentAssistant.title}</span>
            </div>
          </div>
          
          {headerActions && (
            <div className="header-actions">
              {headerActions}
            </div>
          )}
        </header>
        
        <main className="layout-content">
          <ErrorBoundary>
            <Suspense fallback={<LoadingSpinner />}>
              {children}
            </Suspense>
          </ErrorBoundary>
        </main>
      </div>
    </div>
  );
});

UniversalAssistantLayout.displayName = 'UniversalAssistantLayout';
export default UniversalAssistantLayout;
