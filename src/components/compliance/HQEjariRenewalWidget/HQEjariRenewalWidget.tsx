import React, { FC } from 'react';
import { Home, AlertTriangle, Calendar, MapPin, Building, Key, Zap, CheckCircle2, XCircle, FileUp, ArrowRight } from 'lucide-react';
import { useHQEjariRenewalLogic } from './HQEjariRenewalWidget.logic';
import {
  WidgetContainer,
  WidgetHeader,
  AlertBanner,
  MainContentGrid,
  InfoCard,
  DetailGroup,
  SidePanel,
  StatusCard,
  ActionButton,
  Checklist
} from './HQEjariRenewalWidget.style';

export const HQEjariRenewalWidget: FC = () => {
  const {
    t,
    isRtl,
    data,
    handleRenew,
    handleUpload
  } = useHQEjariRenewalLogic();

  return (
    <WidgetContainer $isRtl={isRtl}>
      <WidgetHeader>
        <div>
          <h3><Home size={28} /> {t.title}</h3>
          <p>{t.subtitle}</p>
        </div>
      </WidgetHeader>

      {data.status === 'expiring' && (
        <AlertBanner $type="warning">
          <AlertTriangle size={20} />
          <span>{t.alert_warning.replace('{days}', data.daysRemaining.toString())}</span>
        </AlertBanner>
      )}

      <MainContentGrid>
        <InfoCard>
          <DetailGroup>
            <span className="label">{t.ejari_no}</span>
            <span className="value mono">{data.ejariNumber}</span>
          </DetailGroup>
          <DetailGroup>
            <span className="label">{t.location}</span>
            <span className="value" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <MapPin size={16} color="var(--color-64748b)" /> {data.location}
            </span>
          </DetailGroup>
          
          <DetailGroup>
            <span className="label">{t.landlord}</span>
            <span className="value" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Building size={16} color="var(--color-64748b)" /> {data.landlord}
            </span>
          </DetailGroup>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <DetailGroup>
              <span className="label">{t.dewa_premise}</span>
              <span className="value" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Zap size={16} color="var(--color-64748b)" /> {data.dewaPremise}
              </span>
            </DetailGroup>
            <DetailGroup>
              <span className="label">{t.makani_no}</span>
              <span className="value" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Key size={16} color="var(--color-64748b)" /> {data.makaniNumber}
              </span>
            </DetailGroup>
          </div>

          <DetailGroup>
            <span className="label">{t.issue_date}</span>
            <span className="value" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Calendar size={16} color="var(--color-64748b)" /> {data.issueDate}
            </span>
          </DetailGroup>
          <DetailGroup>
            <span className="label">{t.expiry_date}</span>
            <span className="value" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Calendar size={16} color="var(--color-64748b)" /> {data.expiryDate}
            </span>
          </DetailGroup>
        </InfoCard>

        <SidePanel>
          <StatusCard>
            <div>
              <div className="days-left">{data.daysRemaining}</div>
              <div className="days-label">{t.days_remaining}</div>
            </div>
            <ActionButton $variant="primary" onClick={handleRenew}>
              {t.renew_btn} <ArrowRight size={18} />
            </ActionButton>
            <ActionButton $variant="secondary" onClick={handleUpload}>
              <FileUp size={18} /> {t.upload_btn}
            </ActionButton>
          </StatusCard>

          <Checklist>
            <h4>{t.doc_checklist}</h4>
            <div className={`check-item ${data.documentsReady.tradeLicense ? 'ready' : 'missing'}`}>
              {data.documentsReady.tradeLicense ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
              <span>{t.doc_trade_license}</span>
            </div>
            <div className={`check-item ${data.documentsReady.emiratesId ? 'ready' : 'missing'}`}>
              {data.documentsReady.emiratesId ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
              <span>{t.doc_emirates_id}</span>
            </div>
            <div className={`check-item ${data.documentsReady.titleDeed ? 'ready' : 'missing'}`}>
              {data.documentsReady.titleDeed ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
              <span>{t.doc_title_deed}</span>
            </div>
            <div className={`check-item ${data.documentsReady.dewaBill ? 'ready' : 'missing'}`}>
              {data.documentsReady.dewaBill ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
              <span>{t.doc_dewa}</span>
            </div>
          </Checklist>
        </SidePanel>
      </MainContentGrid>

    </WidgetContainer>
  );
};
