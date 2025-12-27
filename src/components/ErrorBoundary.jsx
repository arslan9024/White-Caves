import React from 'react';
import './ErrorBoundary.css';

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
        <div className="error-boundary">
          <div className="error-boundary-content">
            <div className="error-icon">⚠️</div>
            <h1>Oops! Something went wrong</h1>
            <p>We're sorry for the inconvenience. An unexpected error has occurred.</p>
            <p className="redirect-notice">
              Redirecting to home page in <span className="countdown">{this.state.countdown}</span> seconds...
            </p>
            
            <div className="error-actions">
              <button onClick={this.handleReset} className="error-button primary">
                Try Again
              </button>
              <button 
                onClick={this.handleGoHome} 
                className="error-button secondary"
              >
                Go to Home Now
              </button>
            </div>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="error-details">
                <summary>Error Details (Development Only)</summary>
                <pre className="error-stack">
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
