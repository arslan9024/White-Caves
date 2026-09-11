import React from 'react';
import {
  WidgetContainer,
  WidgetHeader,
  StatusBanner,
  MetricsGrid,
  MetricCard,
  ActionButton
} from './FinanceEngineLedgerBenchmarkWidget.style';
import { useFinanceEngineLedgerBenchmarkLogic } from './FinanceEngineLedgerBenchmarkWidget.logic';
import { Zap, Play, Activity, Clock, Database, CheckCircle, XCircle } from 'lucide-react';

export const FinanceEngineLedgerBenchmarkWidget: React.FC = () => {
  const {
    t,
    isRtl,
    status,
    resultTime,
    isPass,
    handleRunBenchmark
  } = useFinanceEngineLedgerBenchmarkLogic();

  return (
    <WidgetContainer $isRtl={isRtl}>
      <WidgetHeader>
        <div>
          <h3>{t.title}</h3>
          <p>{t.subtitle}</p>
        </div>
        <Zap size={32} color="var(--accent-red, #EF4444)" />
      </WidgetHeader>

      <StatusBanner $status={status} $isPass={isPass}>
        {status === 'idle' && <Activity size={24} />}
        {status === 'running' && <Clock size={24} className="animate-spin" />}
        {status === 'complete' && (isPass ? <CheckCircle size={24} /> : <XCircle size={24} />)}
        <span>
          {status === 'idle' && t.status_idle}
          {status === 'running' && t.status_running}
          {status === 'complete' && t.status_complete}
        </span>
      </StatusBanner>

      <MetricsGrid>
        <MetricCard>
          <Database size={20} color="var(--color-64748b, #64748B)" style={{ marginBottom: '8px' }} />
          <span className="label">{t.metric_records}</span>
          <span className="value">1,000,000+</span>
        </MetricCard>

        <MetricCard>
          <Clock size={20} color="var(--color-64748b, #64748B)" style={{ marginBottom: '8px' }} />
          <span className="label">{t.metric_target}</span>
          <span className="value">&lt; 20ms</span>
        </MetricCard>

        <MetricCard $highlight={status === 'complete'} $isPass={isPass}>
          <Activity size={20} color={status === 'complete' ? (isPass ? 'var(--color-059669, #059669)' : 'var(--color-dc2626, #DC2626)') : 'var(--color-64748b, #64748B)'} style={{ marginBottom: '8px' }} />
          <span className="label">{t.metric_time}</span>
          <span className="value">
            {status === 'idle' && '--'}
            {status === 'running' && '...'}
            {status === 'complete' && `${resultTime}ms`}
          </span>
        </MetricCard>

        <MetricCard $highlight={status === 'complete'} $isPass={isPass}>
          {status === 'complete' && isPass ? (
            <CheckCircle size={20} color="var(--color-059669, #059669)" style={{ marginBottom: '8px' }} />
          ) : status === 'complete' && !isPass ? (
            <XCircle size={20} color="var(--color-dc2626, #DC2626)" style={{ marginBottom: '8px' }} />
          ) : (
             <Zap size={20} color="var(--color-64748b, #64748B)" style={{ marginBottom: '8px' }} />
          )}
          <span className="label">{t.metric_status}</span>
          <span className="value" style={{ fontSize: '1.25rem' }}>
            {status === 'idle' && 'READY'}
            {status === 'running' && 'TESTING'}
            {status === 'complete' && (isPass ? t.pass : t.fail)}
          </span>
        </MetricCard>
      </MetricsGrid>

      <ActionButton 
        onClick={handleRunBenchmark}
        disabled={status === 'running'}
        $isRunning={status === 'running'}
      >
        <Play size={20} />
        {t.btn_run}
      </ActionButton>
    </WidgetContainer>
  );
};
