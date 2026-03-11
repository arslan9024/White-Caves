import React, { ReactNode, ReactElement } from 'react';
import {
  ErrorBoundaryContainer,
  ErrorBoundaryContent,
  ErrorIconBoundary,
  ErrorTitle,
  ErrorMessage,
  RedirectNotice,
  Countdown,
  ErrorActions,
  ErrorButton,
  ErrorDetails,
  ErrorStack,
} from './ErrorBoundary.styles';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactElement;
  onReset?: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
  countdown: number;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  private redirectTimer: NodeJS.Timeout | null = null;
  private countdownInterval: NodeJS.Timer | null = null;

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { 
      hasError: false,
      error: null,
      errorInfo: null,
      countdown: 5
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { 
      hasError: true,
      error,
      errorInfo: null,
      countdown: 5
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
      countdown: 5
    });
    
    this.startAutoRedirect();
  }

  startAutoRedirect = () => {
    this.countdownInterval = setInterval(() => {
      this.setState((prev: Readonly<ErrorBoundaryState>) => {
        if (prev.countdown <= 1) {
          this.clearTimers();
          window.location.href = '/';
          return prev;
        }
        return { ...prev, countdown: prev.countdown - 1 };
      });
    }, 1000) as unknown as NodeJS.Timeout;
  };

  clearTimers = () => {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval as NodeJS.Timeout);
      this.countdownInterval = null;
    }
    if (this.redirectTimer) {
      clearTimeout(this.redirectTimer as NodeJS.Timeout);
      this.redirectTimer = null;
    }
  };

  componentWillUnmount() {
    this.clearTimers();
  }

  handleReset = () => {
    this.clearTimers();
    this.setState({ 
      hasError: false,
      error: null,
      errorInfo: null,
      countdown: 5
    });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  handleGoHome = () => {
    this.clearTimers();
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <ErrorBoundaryContainer>
          <ErrorBoundaryContent>
            <ErrorIconBoundary>⚠️</ErrorIconBoundary>
            <ErrorTitle>Oops! Something went wrong</ErrorTitle>
            <ErrorMessage>We're sorry for the inconvenience. An unexpected error has occurred.</ErrorMessage>
            <RedirectNotice>
              Redirecting to home page in <Countdown>{this.state.countdown}</Countdown> seconds...
            </RedirectNotice>
            
            <ErrorActions>
              <ErrorButton $variant="primary" onClick={this.handleReset}>
                Try Again
              </ErrorButton>
              <ErrorButton 
                $variant="secondary"
                onClick={this.handleGoHome}
              >
                Go to Home Now
              </ErrorButton>
            </ErrorActions>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <ErrorDetails>
                <summary>Error Details (Development Only)</summary>
                <ErrorStack>
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </ErrorStack>
              </ErrorDetails>
            )}
          </ErrorBoundaryContent>
        </ErrorBoundaryContainer>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
