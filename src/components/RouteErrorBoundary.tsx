/**
 * RouteErrorBoundary — A lightweight error boundary for individual routes/features.
 * Unlike the top-level ErrorBoundary (which auto-redirects to /), this component:
 *   - Displays an inline error message within the page layout
 *   - Provides a "Try Again" button that resets the error state
 *   - Does NOT redirect or reload — keeps the user in context
 *   - Accepts an optional section name for contextual error messages
 */

import React, { ReactNode } from 'react';
import { createLogger } from '../utils/logger';
import { safeRedirect } from '../utils/safeRedirect';
import styled from 'styled-components';

interface Props {
  children: ReactNode;
  /** Human-readable name of the section, e.g. "CRM Dashboard" */
  section?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class RouteErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    const log = createLogger(`RouteErrorBoundary${this.props.section ? ` — ${this.props.section}` : ''}`);
    log.error('Caught error', error, info);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      const section = this.props.section || 'This section';

      return (
        <ErrorContainer role="alert">
          <ErrorIcon>⚠️</ErrorIcon>
          <ErrorHeading>{section} encountered an error</ErrorHeading>
          <ErrorText>
            Something went wrong loading this page. Your data is safe — try again or navigate to another section.
          </ErrorText>
          {import.meta.env.DEV && this.state.error && (
            <ErrorDetail>{this.state.error.message}</ErrorDetail>
          )}
          <ButtonRow>
            <RetryButton onClick={this.handleReset}>Try Again</RetryButton>
            <HomeButton onClick={() => safeRedirect('/')}>Go Home</HomeButton>
          </ButtonRow>
        </ErrorContainer>
      );
    }

    return this.props.children;
  }
}

export default RouteErrorBoundary;

// ─── Styled Components ──────────────────────────────────────────────────

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  padding: 2rem;
  text-align: center;
  gap: 1rem;
`;

const ErrorIcon = styled.div`
  font-size: 3rem;
`;

const ErrorHeading = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-primary, #1a1a2e);
  margin: 0;
`;

const ErrorText = styled.p`
  font-size: 1rem;
  color: var(--text-secondary, #6b7280);
  max-width: 500px;
  margin: 0;
  line-height: 1.6;
`;

const ErrorDetail = styled.pre`
  font-size: 0.8rem;
  color: #EF4444;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  padding: 0.75rem 1rem;
  max-width: 600px;
  overflow-x: auto;
  white-space: pre-wrap;
  word-break: break-word;
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;
`;

const RetryButton = styled.button`
  padding: 0.625rem 1.5rem;
  background: var(--accent-primary, #c8a45a);
  color: #fff;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;
  &:hover { opacity: 0.9; }
`;

const HomeButton = styled.button`
  padding: 0.625rem 1.5rem;
  background: transparent;
  color: var(--text-secondary, #6b7280);
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
  &:hover { background: #f9fafb; }
`;
