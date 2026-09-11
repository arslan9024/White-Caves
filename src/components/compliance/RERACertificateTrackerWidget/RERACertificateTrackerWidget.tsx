import React, { FC } from 'react';
import { Award, Search, Users, AlertCircle, FilePlus, RefreshCcw, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';
import { useRERACertificateTrackerLogic } from './RERACertificateTrackerWidget.logic';
import {
  WidgetContainer,
  WidgetHeader,
  StatsGrid,
  StatCard,
  ControlsBar,
  TrackerTable,
  StatusBadge,
  ActionButton
} from './RERACertificateTrackerWidget.style';

export const RERACertificateTrackerWidget: FC = () => {
  const {
    t,
    isRtl,
    searchQuery,
    setSearchQuery,
    filter,
    setFilter,
    filteredBrokers,
    stats,
    handleRenew
  } = useRERACertificateTrackerLogic();

  return (
    <WidgetContainer $isRtl={isRtl}>
      <WidgetHeader>
        <div>
          <h3><Award size={28} /> {t.title}</h3>
          <p>{t.subtitle}</p>
        </div>
      </WidgetHeader>

      <StatsGrid>
        <StatCard $type="total">
          <Users size={32} className="icon" />
          <div className="stat-info">
            <span className="label">{t.stats_total}</span>
            <span className="value">{stats.total}</span>
          </div>
        </StatCard>
        <StatCard $type="active">
          <CheckCircle2 size={32} className="icon" />
          <div className="stat-info">
            <span className="label">{t.stats_active}</span>
            <span className="value">{stats.active}</span>
          </div>
        </StatCard>
        <StatCard $type="warning">
          <AlertCircle size={32} className="icon" />
          <div className="stat-info">
            <span className="label">{t.stats_action_needed}</span>
            <span className="value">{stats.actionNeeded}</span>
          </div>
        </StatCard>
      </StatsGrid>

      <ControlsBar>
        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input 
            type="text" 
            placeholder={t.search_placeholder} 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="filter-group">
          <button className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>{t.filter_all}</button>
          <button className={filter === 'active' ? 'active' : ''} onClick={() => setFilter('active')}>{t.filter_active}</button>
          <button className={filter === 'expiring' ? 'active' : ''} onClick={() => setFilter('expiring')}>{t.filter_expiring}</button>
          <button className={filter === 'expired' ? 'active' : ''} onClick={() => setFilter('expired')}>{t.filter_expired}</button>
        </div>
      </ControlsBar>

      <TrackerTable>
        <table>
          <thead>
            <tr>
              <th>{t.table_broker}</th>
              <th>{t.table_brn}</th>
              <th>{t.table_issue_date}</th>
              <th>{t.table_expiry_date}</th>
              <th>{t.table_status}</th>
              <th>{t.table_action}</th>
            </tr>
          </thead>
          <tbody>
            {filteredBrokers.map(broker => (
              <tr key={broker.id}>
                <td><span className="broker-name">{broker.name}</span></td>
                <td><span className="brn">{broker.brn}</span></td>
                <td>{broker.issueDate}</td>
                <td>{broker.expiryDate}</td>
                <td>
                  <StatusBadge $status={broker.status}>
                    {broker.status === 'active' && <CheckCircle2 size={12} />}
                    {broker.status === 'expiring' && <AlertTriangle size={12} />}
                    {broker.status === 'expired' && <XCircle size={12} />}
                    {broker.status === 'active' ? t.status_active : broker.status === 'expiring' ? t.status_expiring : t.status_expired}
                  </StatusBadge>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {(broker.status === 'expiring' || broker.status === 'expired') ? (
                      <ActionButton $variant="primary" onClick={() => handleRenew(broker.brn)}>
                        <RefreshCcw size={14} /> {t.renew_btn}
                      </ActionButton>
                    ) : (
                      <ActionButton $variant="secondary" onClick={() => {}}>
                        <FilePlus size={14} /> {t.upload_btn}
                      </ActionButton>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </TrackerTable>

    </WidgetContainer>
  );
};
