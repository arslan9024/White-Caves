import React, { FC } from 'react';
import { ShieldAlert, RefreshCw, CheckCircle, AlertOctagon, Clock, UserCheck, AlertTriangle } from 'lucide-react';
import { useSanctionsLogic } from './SanctionsScreeningWidget.logic';
import {
  WidgetContainer,
  WidgetHeader,
  HeaderTitle,
  ScanButton,
  DatabasesGrid,
  DatabaseCard,
  DatabaseHeader,
  StatusIndicator,
  RecentScansSection,
  ScanList,
  ScanItem,
  ClientInfo,
  ScanActions,
  ActionButton
} from './SanctionsScreeningWidget.style';

export const SanctionsScreeningWidget: FC = () => {
  const {
    t,
    isRtl,
    isScanning,
    databasesStatus,
    recentScans,
    handleManualScan,
    getStatusLabel,
    formatDate
  } = useSanctionsLogic();

  const getStatusIcon = (status: 'clear' | 'flagged' | 'pending') => {
    switch (status) {
      case 'clear': return <CheckCircle size={14} />;
      case 'flagged': return <AlertOctagon size={14} />;
      case 'pending': return <Clock size={14} />;
    }
  };

  return (
    <WidgetContainer $isRtl={isRtl}>
      <WidgetHeader>
        <HeaderTitle>
          <h3><ShieldAlert size={22} /> {t.title}</h3>
          <p>{t.subtitle}</p>
        </HeaderTitle>
        <ScanButton $isScanning={isScanning} onClick={handleManualScan} disabled={isScanning}>
          <RefreshCw size={16} />
          {t.scan_now}
        </ScanButton>
      </WidgetHeader>

      <DatabasesGrid>
        <DatabaseCard $status={databasesStatus.un}>
          <DatabaseHeader>
            <ShieldAlert size={18} />
            {t.database_un}
          </DatabaseHeader>
          <StatusIndicator $status={databasesStatus.un}>
            {getStatusIcon(databasesStatus.un)} {getStatusLabel(databasesStatus.un)}
          </StatusIndicator>
        </DatabaseCard>

        <DatabaseCard $status={databasesStatus.ofac}>
          <DatabaseHeader>
            <ShieldAlert size={18} />
            {t.database_ofac}
          </DatabaseHeader>
          <StatusIndicator $status={databasesStatus.ofac}>
            {getStatusIcon(databasesStatus.ofac)} {getStatusLabel(databasesStatus.ofac)}
          </StatusIndicator>
        </DatabaseCard>

        <DatabaseCard $status={databasesStatus.eu}>
          <DatabaseHeader>
            <ShieldAlert size={18} />
            {t.database_eu}
          </DatabaseHeader>
          <StatusIndicator $status={databasesStatus.eu}>
            {getStatusIcon(databasesStatus.eu)} {getStatusLabel(databasesStatus.eu)}
          </StatusIndicator>
        </DatabaseCard>

        <DatabaseCard $status={databasesStatus.local}>
          <DatabaseHeader>
            <ShieldAlert size={18} />
            {t.database_local}
          </DatabaseHeader>
          <StatusIndicator $status={databasesStatus.local}>
            {getStatusIcon(databasesStatus.local)} {getStatusLabel(databasesStatus.local)}
          </StatusIndicator>
        </DatabaseCard>
      </DatabasesGrid>

      <RecentScansSection>
        <h4>{t.recent_scans}</h4>
        <ScanList>
          {recentScans.map(scan => (
            <ScanItem key={scan.id} $risk={scan.risk}>
              <ClientInfo>
                <span className="name">{scan.clientName}</span>
                <span className="meta">
                  {formatDate(scan.timestamp)} • {scan.risk === 'high' ? <span style={{color: '#ef4444', display: 'inline-flex', alignItems: 'center', gap: '4px'}}><AlertTriangle size={12}/> {t.risk_high}</span> : <span style={{color: '#22c55e', display: 'inline-flex', alignItems: 'center', gap: '4px'}}><UserCheck size={12}/> {t.risk_low}</span>}
                </span>
                <span className="meta" style={{marginTop: '2px'}}>{scan.details}</span>
              </ClientInfo>
              <ScanActions>
                {scan.risk === 'high' && (
                  <ActionButton style={{ borderColor: '#ef4444', color: '#ef4444' }}>
                    {t.action_required}
                  </ActionButton>
                )}
                <ActionButton>
                  {t.view_report}
                </ActionButton>
              </ScanActions>
            </ScanItem>
          ))}
        </ScanList>
      </RecentScansSection>
    </WidgetContainer>
  );
};
