import React from 'react';
import styled from 'styled-components';
import { createLogger } from '../../utils/logger';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  title?: string;
  message?: string;
  onRetry?: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  private readonly log = createLogger('ErrorBoundary');

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    this.log.error('UI render error captured', { error: error.message, stack: info.componentStack });
  }

  handleRetry = () => {
    this.setState({ hasError: false });
    this.props.onRetry?.();
  };

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <Wrapper role="alert">
        <h3>{this.props.title ?? 'Something went wrong'}</h3>
        <p>{this.props.message ?? 'Please try again. If the issue continues, refresh the page.'}</p>
        <button type="button" onClick={this.handleRetry}>
          Try again
        </button>
      </Wrapper>
    );
  }
}

const Wrapper = styled.section`
  margin: 1rem 0;
  padding: 1rem;
  border: 1px solid #fecaca;
  border-radius: 10px;
  background: #fef2f2;
  color: #991b1b;

  h3 {
    margin: 0 0 0.35rem;
    font-size: 1rem;
    font-weight: 700;
  }

  p {
    margin: 0 0 0.75rem;
    font-size: 0.9rem;
  }

  button {
    border: 1px solid #fca5a5;
    border-radius: 8px;
    background: #fff;
    color: #991b1b;
    min-height: 34px;
    padding: 0 0.75rem;
    cursor: pointer;
    font-size: 0.82rem;
    font-weight: 600;
  }
`;

export default ErrorBoundary;
