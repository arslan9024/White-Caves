// src/components/layout/DashboardWorkspace/DynamicContentRouter.tsx
import React, { Suspense, useMemo } from 'react';
import styled from 'styled-components';
import { MEDIA_QUERIES, theme } from '../../../styles/theme';
import { featureRegistry, Feature } from './FeatureRegistry';

interface DynamicContentRouterProps {
  activeFeatureId: string | null;
  featureData?: Record<string, unknown>;
  onClose?: () => void;
  isLoading?: boolean;
  fallback?: React.ReactNode;
  errorFallback?: (error: Error) => React.ReactNode;
}

// ============================================================================
// STYLED COMPONENTS
// ============================================================================

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  background: ${theme.colors.background.primary};
  border-radius: ${theme.borderRadius.lg};
  overflow: hidden;

  @media ${MEDIA_QUERIES.tablet} {
    border-radius: ${theme.borderRadius.md};
  }
`;

const ContentWrapper = styled.div`
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;

  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: ${theme.colors.background.secondary};
  }

  &::-webkit-scrollbar-thumb {
    background: ${theme.colors.border};
    border-radius: 4px;

    &:hover {
      background: ${theme.colors.borderDark};
    }
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  background: ${theme.colors.background.primary};
`;

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  padding: 2rem;
  background: ${theme.colors.background.primary};
  color: ${theme.colors.text.secondary};
`;

const ErrorTitle = styled.h2`
  color: ${theme.colors.danger};
  margin-bottom: 1rem;
`;

const ErrorMessage = styled.p`
  text-align: center;
  margin-bottom: 1.5rem;
  line-height: 1.6;
`;

const EmptyStateContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  padding: 2rem;
  background: ${theme.colors.background.primary};
  color: ${theme.colors.text.tertiary};
  text-align: center;

  svg {
    width: 64px;
    height: 64px;
    margin-bottom: 1rem;
    opacity: 0.5;
  }

  p {
    margin: 0;
    font-size: 1.1rem;
  }
`;

const ContentHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  border-bottom: 1px solid ${theme.colors.border};
  background: ${theme.colors.background.secondary};
  flex-shrink: 0;

  @media ${MEDIA_QUERIES.tablet} {
    padding: 1rem;
  }
`;

const ContentTitle = styled.h1`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: ${theme.colors.text.primary};

  svg {
    width: 28px;
    height: 28px;
  }

  @media ${MEDIA_QUERIES.tablet} {
    font-size: 1.25rem;

    svg {
      width: 24px;
      height: 24px;
    }
  }
`;

const ContentActions = styled.div`
  display: flex;
  gap: 0.75rem;
`;

const CloseButton = styled.button`
  display: none;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  padding: 0;
  background: ${theme.colors.background.primary};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.md};
  cursor: pointer;
  color: ${theme.colors.text.secondary};
  transition: all 0.2s ease;

  &:hover {
    background: ${theme.colors.background.tertiary};
    color: ${theme.colors.text.primary};
  }

  svg {
    width: 18px;
    height: 18px;
  }

  @media ${MEDIA_QUERIES.tablet} {
    display: flex;
  }
`;

// ============================================================================
// ERROR BOUNDARY
// ============================================================================

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: (error: Error) => React.ReactNode;
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

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Feature rendering error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError && this.state.error) {
      return (
        <ErrorContainer>
          <ErrorTitle>Oops! Something went wrong</ErrorTitle>
          <ErrorMessage>{this.state.error.message}</ErrorMessage>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#ff4757',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Try Again
          </button>
        </ErrorContainer>
      );
    }

    return this.props.children;
  }
}

// ============================================================================
// LOADING SPINNER
// ============================================================================

const Spinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid ${theme.colors.border};
  border-top-color: ${theme.colors.primary};
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const DefaultLoadingFallback = () => (
  <LoadingContainer>
    <Spinner />
  </LoadingContainer>
);

// ============================================================================
// DYNAMIC CONTENT ROUTER COMPONENT
// ============================================================================

export const DynamicContentRouter: React.FC<DynamicContentRouterProps> = ({
  activeFeatureId,
  featureData,
  onClose,
  isLoading = false,
  fallback,
  errorFallback,
}) => {
  const [feature, setFeature] = React.useState<Feature | undefined>(undefined);
  const [renderKey, setRenderKey] = React.useState(0);

  // Get feature when activeFeatureId changes
  React.useEffect(() => {
    if (activeFeatureId) {
      const f = featureRegistry.getFeature(activeFeatureId);
      setFeature(f);
      setRenderKey(prev => prev + 1); // Force re-render of component
    } else {
      setFeature(undefined);
    }
  }, [activeFeatureId]);

  // Render logic
  const renderContent = useMemo(() => {
    if (isLoading) {
      return fallback || <DefaultLoadingFallback />;
    }

    if (!activeFeatureId || !feature) {
      return (
        <EmptyStateContainer>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
          <p>Select a feature from the sidebar to get started</p>
        </EmptyStateContainer>
      );
    }

    if (feature.disabled) {
      return (
        <EmptyStateContainer>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p>This feature is currently disabled</p>
        </EmptyStateContainer>
      );
    }

    const Component = feature.component;

    return (
      <Component
        key={renderKey}
        featureId={feature.id}
        featureData={featureData}
        isActive={true}
        onClose={onClose}
      />
    );
  }, [activeFeatureId, feature, isLoading, fallback, featureData, onClose, renderKey]);

  return (
    <ContentContainer>
      {feature && !isLoading && (
        <ContentHeader>
          <ContentTitle>
            {feature.icon}
            {feature.label}
          </ContentTitle>
          <ContentActions>
            {onClose && <CloseButton onClick={onClose}>✕</CloseButton>}
          </ContentActions>
        </ContentHeader>
      )}

      <ContentWrapper>
        <ErrorBoundary fallback={errorFallback}>
          <Suspense fallback={fallback || <DefaultLoadingFallback />}>{renderContent}</Suspense>
        </ErrorBoundary>
      </ContentWrapper>
    </ContentContainer>
  );
};

export default DynamicContentRouter;
