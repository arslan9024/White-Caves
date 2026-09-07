import React, { FC, useEffect, useMemo, useState } from 'react';
import { useReporting } from '../../../hooks/crm/useReporting';
import type { AgentPerformance, ExecutiveReport, LeadFunnel, PropertyAging, TrendSeries, KPIs } from '../../../hooks/crm/useReporting';
import { normalizeDashboardAccessRole } from './moduleAccessPolicy';
import './CommandCenter.css';

export interface CommandCenterProps { onNavigateToModule?: (moduleId: string) => void; serverRole?: string; }
export type ExecutiveRole = 'managing_director' | 'owner' | 'manager' | 'admin' | 'finance';
type ReportAttempt = 'idle' | 'loading' | 'complete' | 'partial' | 'failed';
const EXECUTIVE_ROLES = new Set<ExecutiveRole>(['managing_director', 'owner', 'manager', 'admin', 'finance']);
const FOCUSED_ROLES = new Set(['agent', 'supervisor']);
const money = (value: number | undefined) => typeof value === 'number' ? `AED ${value.toLocaleString('en-US')}` : '—';
const number = (value: number | undefined) => typeof value === 'number' ? value.toLocaleString('en-US') : '—';

const StateBlock: FC<{ loading: boolean; error: string | null; empty: boolean; retry: () => void; children: React.ReactNode }> = ({ loading, error, empty, retry, children }) => {
  if (loading) return <div className="cc-loading" role="status">Loading report…</div>;
  if (error) return <div className="cc-error" role="alert">{error}<button onClick={retry}>Retry</button></div>;
  if (empty) return <div className="cc-empty">No records returned for this period.</div>;
  return <>{children}</>;
};

export const CommandCenter: FC<CommandCenterProps> = ({ onNavigateToModule, serverRole }) => {
  const reports = useReporting();
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  const [attempt, setAttempt] = useState<ReportAttempt>('idle');
  const assignedRole = String(serverRole ?? '').toLowerCase();
  const roleName = normalizeDashboardAccessRole(assignedRole);
  const authorized = EXECUTIVE_ROLES.has(roleName as ExecutiveRole);
  const isAuthenticated = Boolean(assignedRole);
  const refresh = async () => {
    setAttempt('loading');
    const result = await reports.fetchAllReports(30);
    const nextAttempt: ReportAttempt = result.failedCount === 0 ? 'complete' : result.failedCount === 6 ? 'failed' : 'partial';
    setAttempt(nextAttempt);
    if (nextAttempt === 'complete') setLastRefresh(new Date());
  };
  useEffect(() => { if (authorized) void refresh(); }, [authorized]);

  const executive: ExecutiveReport | null = reports.executive;
  const kpis: KPIs | null = reports.kpis;
  const funnel: LeadFunnel | null = reports.leadFunnel;
  const trends: TrendSeries | null = reports.trends;
  const aging: PropertyAging | null = reports.propertyAging;
  const agents: AgentPerformance | null = reports.agentPerformance;
  const series = useMemo(() => trends?.series.slice(-14) ?? [], [trends]);
  const maxLeads = Math.max(...series.map(item => item.leads), 1);

  if (!authorized && isAuthenticated && FOCUSED_ROLES.has(roleName)) return <section className="command-center" data-testid="agent-command-center"><div className="cc-shell"><header className="cc-header"><div><div className="cc-kicker">White Caves / Team workspace</div><h1>Today’s workbench</h1><p>Use your assigned CRM tools. Executive analytics are restricted by the server role.</p></div><button className="cc-button primary" onClick={() => onNavigateToModule?.('leads')}>Open assigned leads</button></header><div className="cc-meta"><span>Role: {assignedRole.replaceAll('_', ' ')}</span><span>Data scope: server-assigned workspace</span></div><div className="cc-grid"><article className="cc-card cc-wide"><h2>Next actions</h2><div className="cc-nav"><button className="active" onClick={() => onNavigateToModule?.('leads')}>Assigned leads</button><button onClick={() => onNavigateToModule?.('valuation')}>Property valuation</button><button onClick={() => onNavigateToModule?.('henry-tenancy-journey')}>Tenancy contracts</button><button onClick={() => onNavigateToModule?.('agent-task-cockpit')}>Task cockpit</button></div><p className="cc-empty">Open a module to work with live assigned records. Executive reporting was not requested for this role.</p></article><article className="cc-card cc-side"><h2>Access boundary</h2><p className="cc-empty">Pipeline totals, team performance and portfolio analytics are not available in this workspace.</p></article></div></div></section>;
  if (!authorized) return <section className="command-center" data-testid="command-center-unauthorized"><div className="cc-unauthorized"><span className="cc-kicker">Access boundary</span><h1>Dashboard unavailable</h1><p>Your server-assigned role does not authorize executive reporting. No analytics requests were made.</p></div></section>;

  const attemptLabel = attempt === 'complete' ? `Last complete refresh ${lastRefresh?.toLocaleTimeString() ?? 'just now'}` : attempt === 'loading' ? 'Refreshing reports…' : attempt === 'partial' ? 'Partial refresh — some reports unavailable' : attempt === 'failed' ? 'Refresh failed — no complete snapshot' : 'Awaiting first refresh';
  return <section className="command-center" data-testid="founder-executive-dashboard" aria-label="White Caves Executive Command Center"><div className="cc-shell">
    <header className="cc-header"><div><div className="cc-kicker">White Caves / Executive Command Center</div><h1>Operating picture</h1><p>Leadership view across pipeline, inventory, revenue and team execution.</p></div><div className="cc-actions"><button className="cc-button" onClick={() => onNavigateToModule?.('leads')}>Open CRM</button><button className="cc-button primary" onClick={refresh} disabled={attempt === 'loading'}>{attempt === 'loading' ? 'Refreshing…' : 'Refresh reports'}</button></div></header>
    <div className="cc-meta"><span>Role: {roleName.replaceAll('_', ' ')}</span><span>Sources: /api/dashboard reporting endpoints · {attemptLabel}</span></div>
    <nav className="cc-nav" aria-label="Command center modules"><button className="active" aria-current="page">Overview</button><button onClick={() => onNavigateToModule?.('leads')}>Lead operations</button><button onClick={() => onNavigateToModule?.('mary')}>Inventory</button><button onClick={() => onNavigateToModule?.('theodora')}>Finance</button></nav>
    {attempt === 'partial' && <div className="cc-error" role="status">Some reports are unavailable. Visible values remain server-derived.<button onClick={refresh}>Retry all</button></div>}
    {attempt === 'failed' && <div className="cc-error" role="alert">No complete report snapshot is available.<button onClick={refresh}>Retry all</button></div>}
    <div className="cc-grid">
      {[
        ['Open portfolio value', money(executive?.portfolioValue), 'Executive · current'],
        ['New leads', number(kpis?.newLeads), 'KPIs · trailing 30 days'],
        ['Won deals', number(kpis?.wonDeals), 'KPIs · trailing 30 days'],
        ['Available inventory', number(aging?.totalAvailable), 'Property aging · current'],
      ].map(([label, value, source]) => <article className="cc-card cc-kpi" key={label}><div className="label">{label}</div><div className="value">{attempt === 'loading' && value === '—' ? '…' : value}</div><div className="source">{source}</div></article>)}
      <article className="cc-card cc-wide"><h2>Lead activity <span className="cc-status">Trends · {trends?.period ?? '30d'}</span></h2><StateBlock loading={attempt === 'loading' && !trends} error={!trends && attempt === 'partial' ? 'Trends report failed to load.' : null} empty={!series.length} retry={() => reports.fetchTrends(30)}><div className="cc-bars" aria-label="Daily lead counts for the reporting period">{series.map(item => <div className="cc-bar" key={item.date} style={{ height: `${Math.max(5, (item.leads / maxLeads) * 100)}%` }} title={`${item.date}: ${item.leads} leads`}><span>{item.date.slice(5)}</span></div>)}</div></StateBlock></article>
      <article className="cc-card cc-side"><h2>Conversion funnel <span className="cc-status">Lead funnel</span></h2><StateBlock loading={attempt === 'loading' && !funnel} error={!funnel && attempt === 'partial' ? 'Lead funnel report failed to load.' : null} empty={!funnel?.funnel.length} retry={() => reports.fetchFunnel()}><div className="cc-table-wrap"><table className="cc-table"><caption className="cc-kicker">Server counts by stage</caption><tbody>{funnel?.funnel.map(item => <tr key={item.stage}><td>{item.stage}</td><td>{number(item.count)}</td><td>{number(item.percentage)}%</td></tr>)}</tbody></table></div></StateBlock></article>
      <article className="cc-card cc-side"><h2>Inventory aging <span className="cc-status">Available properties</span></h2><StateBlock loading={attempt === 'loading' && !aging} error={!aging && attempt === 'partial' ? 'Property aging report failed to load.' : null} empty={!aging?.buckets.length} retry={() => reports.fetchAging()}><div className="cc-table-wrap"><table className="cc-table"><caption className="cc-kicker">Days on market distribution</caption><tbody>{aging?.buckets.map(item => <tr key={item.label}><td>{item.label}</td><td>{number(item.count)}</td></tr>)}</tbody></table></div></StateBlock></article>
      <article className="cc-card cc-wide"><h2>Agent performance <span className="cc-status">Ranked by paid commission</span></h2><StateBlock loading={attempt === 'loading' && !agents} error={!agents && attempt === 'partial' ? 'Agent performance report failed to load.' : null} empty={!agents?.agents.length} retry={() => reports.fetchAgents()}><div className="cc-table-wrap"><table className="cc-table"><caption className="cc-kicker">Current server response · {number(agents?.total)} agents</caption><thead><tr><th>Agent</th><th>Leads</th><th>Won</th><th>Commission</th></tr></thead><tbody>{agents?.agents.slice(0, 8).map(item => <tr key={item.id}><td>{item.name}</td><td>{number(item.totalLeads)}</td><td>{number(item.wonLeads)}</td><td>{money(item.totalCommission)}</td></tr>)}</tbody></table></div></StateBlock></article>
    </div>
  </div></section>;
};
export default CommandCenter;