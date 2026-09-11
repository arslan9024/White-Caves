import React, { FC } from 'react';
import { ShieldAlert, User, MapPin, ScanSearch, Clock, CheckCircle2, AlertTriangle, Download } from 'lucide-react';
import { useAMLPolicyScreeningLogic } from './AMLPolicyScreeningWidget.logic';
import {
  WidgetContainer,
  WidgetHeader,
  SectionTitle,
  FormGrid,
  FormGroup,
  ToggleGroup,
  CheckboxGroup,
  ActionButton,
  ResultCard
} from './AMLPolicyScreeningWidget.style';

export const AMLPolicyScreeningWidget: FC = () => {
  const {
    t,
    isRtl,
    clientName,
    setClientName,
    nationality,
    setNationality,
    screeningType,
    setScreeningType,
    enablePep,
    setEnablePep,
    enableSanctions,
    setEnableSanctions,
    isScanning,
    scanResult,
    riskScore,
    isFormValid,
    handleScan
  } = useAMLPolicyScreeningLogic();

  return (
    <WidgetContainer $isRtl={isRtl}>
      <WidgetHeader>
        <h3><ShieldAlert size={28} /> {t.title}</h3>
        <p>{t.subtitle}</p>
      </WidgetHeader>

      {!scanResult ? (
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
              <label>{t.nationality}</label>
              <input type="text" value={nationality} onChange={e => setNationality(e.target.value)} />
            </FormGroup>
          </FormGrid>

          <SectionTitle>
            <ScanSearch size={20} className="icon" />
            {t.screening_type}
          </SectionTitle>
          
          <ToggleGroup>
            <div 
              className={`toggle-btn ${screeningType === 'cdd' ? 'active' : ''}`}
              onClick={() => setScreeningType('cdd')}
            >
              {t.cdd}
            </div>
            <div 
              className={`toggle-btn ${screeningType === 'edd' ? 'active' : ''}`}
              onClick={() => setScreeningType('edd')}
            >
              {t.edd}
            </div>
          </ToggleGroup>

          <CheckboxGroup>
            <label>
              <input type="checkbox" checked={enablePep} onChange={e => setEnablePep(e.target.checked)} />
              {t.pep_screening}
            </label>
            <label>
              <input type="checkbox" checked={enableSanctions} onChange={e => setEnableSanctions(e.target.checked)} />
              {t.sanctions_screening}
            </label>
          </CheckboxGroup>

          <ActionButton $disabled={!isFormValid || isScanning} onClick={handleScan}>
            {isScanning ? <Clock size={20} className="spinner" /> : <ScanSearch size={20} />}
            {isScanning ? t.scanning : t.scan_now}
          </ActionButton>
        </>
      ) : (
        <ResultCard $status={scanResult}>
          {scanResult === 'clear' ? <CheckCircle2 size={64} className="icon" /> : <AlertTriangle size={64} className="icon" />}
          <h4>{scanResult === 'clear' ? t.status_clear : t.status_flagged}</h4>
          <div className="score-badge">
            {t.risk_score}: {riskScore} / 100
          </div>
          <button className="download-btn" onClick={() => window.alert('Downloading CDD/EDD Report PDF...')}>
            <Download size={16} /> {t.download_report}
          </button>
        </ResultCard>
      )}
    </WidgetContainer>
  );
};
