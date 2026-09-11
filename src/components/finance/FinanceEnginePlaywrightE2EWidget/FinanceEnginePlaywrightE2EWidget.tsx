import React from 'react';
import {
  WidgetContainer,
  WidgetHeader,
  RunButton,
  StepList,
  StepItem,
  LogsContainer,
  LogLine
} from './FinanceEnginePlaywrightE2EWidget.style';
import { useFinanceEnginePlaywrightE2ELogic } from './FinanceEnginePlaywrightE2EWidget.logic';
import { Play, CheckCircle2, XCircle, Clock, Loader2, Terminal, FileSignature, ThumbsUp, CreditCard, Scale } from 'lucide-react';

export const FinanceEnginePlaywrightE2EWidget: React.FC = () => {
  const {
    t,
    isRtl,
    steps,
    logs,
    isRunning,
    runTests
  } = useFinanceEnginePlaywrightE2ELogic();

  const getStepIcon = (id: string) => {
    switch (id) {
      case 'create': return <FileSignature size={20} />;
      case 'approve': return <ThumbsUp size={20} />;
      case 'pay': return <CreditCard size={20} />;
      case 'reconcile': return <Scale size={20} />;
      default: return <Clock size={20} />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed': return <CheckCircle2 size={18} />;
      case 'failed': return <XCircle size={18} />;
      case 'running': return <Loader2 size={18} className="spin" />;
      default: return <Clock size={18} />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'passed': return t.status_passed;
      case 'failed': return t.status_failed;
      case 'running': return t.status_running;
      default: return t.status_idle;
    }
  };

  return (
    <WidgetContainer $isRtl={isRtl}>
      <WidgetHeader>
        <div>
          <h3>{t.title}</h3>
          <p>{t.subtitle}</p>
        </div>
        <RunButton $isRunning={isRunning} onClick={runTests} disabled={isRunning}>
          {isRunning ? <Loader2 size={18} className="spin" /> : <Play size={18} />}
          {t.run_all}
        </RunButton>
      </WidgetHeader>

      <StepList>
        {steps.map(step => (
          <StepItem key={step.id} $status={step.status}>
            <div className="name">
              {getStepIcon(step.id)}
              {step.name}
            </div>
            <div className="status">
              {getStatusIcon(step.status)}
              {getStatusText(step.status)}
            </div>
          </StepItem>
        ))}
      </StepList>

      <div style={{ marginTop: '2rem' }}>
        <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1rem', color: 'var(--color-334155, #334155)', marginBottom: '1rem' }}>
          <Terminal size={18} />
          {t.log_title}
        </h4>
        <LogsContainer>
          {logs.length === 0 && <span style={{ color: 'var(--color-64748b, #64748B)' }}>Waiting to start...</span>}
          {logs.map((log, index) => (
            <LogLine key={index}>{log}</LogLine>
          ))}
        </LogsContainer>
      </div>
    </WidgetContainer>
  );
};
