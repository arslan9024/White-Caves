import React from 'react';
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

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false,
      error: null,
      errorInfo: null,
      countdown: 5
    };
    this.redirectTimer = null;
    this.countdownInterval = null;
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
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
      this.setState(prev => {
        if (prev.countdown <= 1) {
          this.clearTimers();
          window.location.href = '/';
          return prev;
        }
        return { countdown: prev.countdown - 1 };
      });
    }, 1000);
  };

  clearTimers = () => {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
      this.countdownInterval = null;
    }
    if (this.redirectTimer) {
      clearTimeout(this.redirectTimer);
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
