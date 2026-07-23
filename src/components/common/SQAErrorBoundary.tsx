import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * Global Software Quality Assurance (SQA) Error Boundary
 * Prevents React application crashes, logs component stack trace,
 * and renders high-fidelity recovery fallback UI.
 */
export class SQAErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({ errorInfo });
    console.error('[SQA Error Boundary Caught Exception]:', error, errorInfo);
  }

  private handleReset = (): void => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  public render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div
          className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6"
          data-testid="sqa-error-boundary"
        >
          <div className="max-w-xl w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl space-y-6">
            <div className="flex items-center gap-3">
              <span className="text-3xl">⚠️</span>
              <div>
                <h1 className="text-xl font-bold text-slate-100">System Recovery Guard Active</h1>
                <p className="text-xs text-slate-400">
                  Software Quality Assurance caught an unhandled rendering exception.
                </p>
              </div>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs font-mono text-rose-400 overflow-x-auto">
              <p className="font-bold">
                {this.state.error?.name || 'Error'}:{' '}
                {this.state.error?.message || 'Unknown Exception'}
              </p>
              {this.state.errorInfo?.componentStack && (
                <pre className="mt-2 text-slate-500 text-[10px] leading-relaxed">
                  {this.state.errorInfo.componentStack.trim().slice(0, 300)}...
                </pre>
              )}
            </div>

            <div className="flex gap-4">
              <button
                onClick={this.handleReset}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold rounded-lg shadow-lg transition-all"
              >
                🔄 Refresh Application State
              </button>
              <button
                onClick={() => (window.location.href = '/')}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium rounded-lg transition-all"
              >
                🏠 Go to Main Dashboard
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
