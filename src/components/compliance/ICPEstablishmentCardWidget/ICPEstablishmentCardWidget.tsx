import React, { FC } from 'react';
import { CreditCard, AlertTriangle, CheckCircle2, Clock, Calendar, Users, FileText, Send, Building2 } from 'lucide-react';
import { useICPEstablishmentCardLogic } from './ICPEstablishmentCardWidget.logic';
import {
  WidgetContainer,
  WidgetHeader,
  AlertBanner,
  GridContainer,
  InfoCard,
  InfoRow,
  StatusBadge,
  ActionButton,
  ActivityList
} from './ICPEstablishmentCardWidget.style';

export const ICPEstablishmentCardWidget: FC = () => {
  const {
    t,
    isRtl,
    data,
    handleRenewICP,
    handleFileMoHRE
  } = useICPEstablishmentCardLogic();

  return (
    <WidgetContainer $isRtl={isRtl}>
      <WidgetHeader>
        <div>
          <h3><Building2 size={28} /> {t.title}</h3>
          <p>{t.subtitle}</p>
        </div>
      </WidgetHeader>

      {data.status === 'expiring' && (
        <AlertBanner $type="warning">
          <AlertTriangle size={20} />
          <span>{t.alert_icp.replace('{days}', data.daysRemaining.toString())}</span>
        </AlertBanner>
      )}

      {data.mohreStatus === 'pending' && (
        <AlertBanner $type="danger">
          <AlertTriangle size={20} />
          <span>{t.alert_mohre}</span>
        </AlertBanner>
      )}

      <GridContainer>
        {/* ICP Establishment Card */}
        <InfoCard>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <CreditCard size={20} color="var(--accent-gold)" />
            <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--color-1e293b)' }}>ICP Establishment Card</span>
          </div>

          <InfoRow>
            <span className="label">{t.card_number}</span>
            <span className="value highlight">{data.icpCardNumber}</span>
          </InfoRow>

          <InfoRow>
            <span className="label">{t.card_status}</span>
            <StatusBadge $status={data.status}>
              {data.status === 'active' && <CheckCircle2 size={12} />}
              {data.status === 'expiring' && <Clock size={12} />}
              {data.status === 'active' ? t.status_active : t.status_expiring}
            </StatusBadge>
          </InfoRow>

          <InfoRow>
            <span className="label">{t.issue_date}</span>
            <span className="value"><Calendar size={14} style={{ marginRight: '4px', display: 'inline-block', verticalAlign: 'middle' }}/> {data.issueDate}</span>
          </InfoRow>

          <InfoRow>
            <span className="label">{t.expiry_date}</span>
            <span className="value"><Calendar size={14} style={{ marginRight: '4px', display: 'inline-block', verticalAlign: 'middle' }}/> {data.expiryDate}</span>
          </InfoRow>

          <InfoRow>
            <span className="label">{t.days_remaining}</span>
            <span className="value" style={{ color: data.daysRemaining < 30 ? 'var(--color-dc2626)' : 'inherit' }}>
              {data.daysRemaining}
            </span>
          </InfoRow>

          <ActionButton $variant="primary" onClick={handleRenewICP}>
            <Send size={16} /> {t.renew_icp_btn}
          </ActionButton>
        </InfoCard>

        {/* MoHRE Status */}
        <InfoCard>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Users size={20} color="var(--accent-gold)" />
            <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--color-1e293b)' }}>MoHRE Filing (WPS & Emiratisation)</span>
          </div>

          <InfoRow>
            <span className="label">{t.mohre_status}</span>
            <StatusBadge $status={data.mohreStatus}>
              {data.mohreStatus === 'compliant' && <CheckCircle2 size={12} />}
              {data.mohreStatus === 'pending' && <Clock size={12} />}
              {data.mohreStatus === 'compliant' ? t.mohre_compliant : t.mohre_pending}
            </StatusBadge>
          </InfoRow>

          <InfoRow>
            <span className="label">{t.mohre_last_filed}</span>
            <span className="value"><Calendar size={14} style={{ marginRight: '4px', display: 'inline-block', verticalAlign: 'middle' }}/> {data.mohreLastFiled}</span>
          </InfoRow>

          <ActionButton $variant="secondary" onClick={handleFileMoHRE}>
            <FileText size={16} /> {t.file_mohre_btn}
          </ActionButton>
        </InfoCard>
      </GridContainer>

      <ActivityList>
        <h4>{t.recent_activity}</h4>
        {data.recentActivity.map(item => (
          <div className="activity-item" key={item.id}>
            <div className="icon-box">
              {item.type === 'visa' && <Users size={16} />}
              {item.type === 'quota' && <Building2 size={16} />}
              {item.type === 'mohre' && <FileText size={16} />}
            </div>
            <div className="details">
              <span className="desc">{item.desc}</span>
              <span className="date">{item.date}</span>
            </div>
          </div>
        ))}
      </ActivityList>

    </WidgetContainer>
  );
};
