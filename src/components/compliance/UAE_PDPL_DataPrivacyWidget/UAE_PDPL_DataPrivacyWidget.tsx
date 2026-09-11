import React, { FC } from 'react';
import { ShieldCheck, User, Database, CheckCircle2, Clock, FileText, Download } from 'lucide-react';
import { useUAEPDPLDataPrivacyLogic } from './UAE_PDPL_DataPrivacyWidget.logic';
import {
  WidgetContainer,
  WidgetHeader,
  SectionTitle,
  FormGrid,
  FormGroup,
  ConsentList,
  ActionButton,
  SuccessCard
} from './UAE_PDPL_DataPrivacyWidget.style';

export const UAE_PDPL_DataPrivacyWidget: FC = () => {
  const {
    t,
    isRtl,
    clientName,
    setClientName,
    email,
    setEmail,
    phone,
    setPhone,
    marketingConsent,
    setMarketingConsent,
    thirdPartyConsent,
    setThirdPartyConsent,
    biometricConsent,
    setBiometricConsent,
    purpose,
    setPurpose,
    retention,
    setRetention,
    isLogging,
    pdplRef,
    isFormValid,
    handleLogConsent,
    handleDownloadDPA
  } = useUAEPDPLDataPrivacyLogic();

  return (
    <WidgetContainer $isRtl={isRtl}>
      <WidgetHeader>
        <div>
          <h3><ShieldCheck size={28} /> {t.title}</h3>
          <p>{t.subtitle}</p>
        </div>
        <button className="dpa-btn" onClick={handleDownloadDPA}>
          <FileText size={18} /> {t.generate_dpa}
        </button>
      </WidgetHeader>

      {!pdplRef ? (
        <>
          <SectionTitle>
            <User size={20} className="icon" />
            {t.client_details}
          </SectionTitle>
          <FormGrid>
            <FormGroup>
              <label>{t.client_name}</label>
              <input type="text" value={clientName} onChange={e => setClientName(e.target.value)} />
            </FormGroup>
            <FormGroup>
              <label>{t.email}</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} />
            </FormGroup>
            <FormGroup>
              <label>{t.phone}</label>
              <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} />
            </FormGroup>
          </FormGrid>

          <SectionTitle>
            <Database size={20} className="icon" />
            {t.data_mapping}
          </SectionTitle>
          <FormGrid>
            <FormGroup>
              <label>{t.purpose_of_processing}</label>
              <select value={purpose} onChange={e => setPurpose(e.target.value)}>
                <option value="sales">{t.purpose_sales}</option>
                <option value="leasing">{t.purpose_leasing}</option>
                <option value="aml">{t.purpose_aml}</option>
              </select>
            </FormGroup>
            <FormGroup>
              <label>{t.retention_period}</label>
              <select value={retention} onChange={e => setRetention(e.target.value)}>
                <option value="5_years">{t.retention_5_years}</option>
                <option value="10_years">{t.retention_10_years}</option>
              </select>
            </FormGroup>
          </FormGrid>

          <SectionTitle>
            <ShieldCheck size={20} className="icon" />
            {t.consent_register}
          </SectionTitle>
          <ConsentList>
            <label>
              <input type="checkbox" checked={marketingConsent} onChange={e => setMarketingConsent(e.target.checked)} />
              {t.marketing_consent}
            </label>
            <label>
              <input type="checkbox" checked={thirdPartyConsent} onChange={e => setThirdPartyConsent(e.target.checked)} />
              {t.third_party_consent}
            </label>
            <label>
              <input type="checkbox" checked={biometricConsent} onChange={e => setBiometricConsent(e.target.checked)} />
              {t.biometric_consent}
            </label>
          </ConsentList>

          <ActionButton $disabled={!isFormValid || isLogging} onClick={handleLogConsent}>
            {isLogging ? <Clock size={20} className="spinner" /> : <CheckCircle2 size={20} />}
            {isLogging ? t.logging : t.log_consent}
          </ActionButton>
        </>
      ) : (
        <SuccessCard>
          <CheckCircle2 size={64} className="icon" />
          <h4>{t.success}</h4>
          <p>{t.pdpl_reference} {pdplRef}</p>
          <button className="dpa-btn" onClick={handleDownloadDPA} style={{ marginTop: '1rem' }}>
            <Download size={18} /> {t.download_dpa}
          </button>
        </SuccessCard>
      )}
    </WidgetContainer>
  );
};
