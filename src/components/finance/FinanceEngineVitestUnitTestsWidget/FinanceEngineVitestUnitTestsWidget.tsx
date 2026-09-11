import React from 'react';
import {
  WidgetContainer,
  WidgetHeader,
  RunButton,
  StepList,
  StepItem,
  CoverageCard
} from './FinanceEngineVitestUnitTestsWidget.style';
import { useFinanceEngineVitestUnitTestsLogic } from './FinanceEngineVitestUnitTestsWidget.logic';
import { Play, CheckCircle2, XCircle, Clock, Loader2, FlaskConical, TestTube2, Scale, Percent } from 'lucide-react';

export const FinanceEngineVitestUnitTestsWidget: React.FC = () => {
  const {
    t,
    isRtl,
    steps,
    isRunning,
    coverage,
    runTests
  } = useFinanceEngineVitestUnitTestsLogic();

  const getStepIcon = (id: string) => {
    switch (id) {
      case 'vat': return <Percent size={20} />;
      case 'double_entry': return <Scale size={20} />;
      case 'payroll': return <TestTube2 size={20} />;
      default: return <FlaskConical size={20} />;
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
            <div className="status-wrapper">
              {step.durationMs && <span className="duration">{step.durationMs}ms</span>}
              <div className="status">
                {getStatusIcon(step.status)}
                {getStatusText(step.status)}
              </div>
            </div>
          </StepItem>
        ))}
      </StepList>

      <CoverageCard>
        <div className="info">
          <h4>{t.coverage_title}</h4>
          <p>{t.coverage_desc}</p>
        </div>
        <div className="metric">
          {coverage}%
        </div>
      </CoverageCard>
    </WidgetContainer>
  );
};
