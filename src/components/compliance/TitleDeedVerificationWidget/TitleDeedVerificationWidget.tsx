import React, { FC } from 'react';
import { ShieldCheck, QrCode, Search, AlertTriangle, XCircle, FileCheck, CheckCircle2, UploadCloud, Clock } from 'lucide-react';
import { useTitleDeedVerificationLogic } from './TitleDeedVerificationWidget.logic';
import {
  WidgetContainer,
  WidgetHeader,
  FormGrid,
  FormGroup,
  QRUploadZone,
  ActionRow,
  ValidateButton,
  ResultCard,
  ResultHeader,
  DetailGrid,
  DetailItem
} from './TitleDeedVerificationWidget.style';

export const TitleDeedVerificationWidget: FC = () => {
  const {
    t,
    isRtl,
    certNumber,
    setCertNumber,
    certYear,
    setCertYear,
    ownerName,
    setOwnerName,
    isVerifying,
    result,
    handleValidate,
    handleQRUpload
  } = useTitleDeedVerificationLogic();

  return (
    <WidgetContainer $isRtl={isRtl}>
      <WidgetHeader>
        <h3><ShieldCheck size={28} /> {t.title}</h3>
        <p>{t.subtitle}</p>
      </WidgetHeader>

      <QRUploadZone>
        <input type="file" accept="image/*,.pdf" onChange={handleQRUpload} />
        <QrCode size={40} className="icon" />
        <span className="text">{t.upload_qr}</span>
      </QRUploadZone>

      <FormGrid>
        <FormGroup>
          <label>{t.certificate_number}</label>
          <input 
            type="text" 
            placeholder="e.g. 12345678" 
            value={certNumber} 
            onChange={(e) => setCertNumber(e.target.value)}
          />
        </FormGroup>
        
        <FormGroup>
          <label>{t.certificate_year}</label>
          <input 
            type="text" 
            placeholder="e.g. 2024" 
            value={certYear} 
            onChange={(e) => setCertYear(e.target.value)}
          />
        </FormGroup>

        <FormGroup>
          <label>{t.owner_name}</label>
          <input 
            type="text" 
            placeholder="Enter full name" 
            value={ownerName} 
            onChange={(e) => setOwnerName(e.target.value)}
          />
        </FormGroup>
      </FormGrid>

      <ActionRow>
        <ValidateButton $isVerifying={isVerifying} onClick={handleValidate} disabled={isVerifying || !certNumber}>
          {isVerifying ? <Clock size={18} className="spinner" /> : <Search size={18} />}
          {isVerifying ? t.verifying : t.validate_dld}
        </ValidateButton>
      </ActionRow>

      {result && (
        <ResultCard $status={result.status}>
          <ResultHeader $status={result.status}>
            {result.status === 'verified' && <CheckCircle2 size={24} className="icon" />}
            {result.status === 'fraud' && <XCircle size={24} className="icon" />}
            {result.status === 'mismatch' && <AlertTriangle size={24} className="icon" />}
            <h4>
              {result.status === 'verified' && t.status_verified}
              {result.status === 'fraud' && t.status_fraud}
              {result.status === 'mismatch' && t.status_mismatch}
            </h4>
          </ResultHeader>

          {result.status === 'verified' && (
            <DetailGrid>
              <DetailItem>
                <span className="label">{t.dld_reference}</span>
                <span className="value">{result.dldReference}</span>
              </DetailItem>
              <DetailItem>
                <span className="label">{t.property_type}</span>
                <span className="value">{result.propertyType}</span>
              </DetailItem>
              <DetailItem>
                <span className="label">{t.municipality}</span>
                <span className="value">{result.municipality}</span>
              </DetailItem>
              <DetailItem>
                <span className="label">{t.area}</span>
                <span className="value">{result.area}</span>
              </DetailItem>
              <DetailItem>
                <span className="label">{t.issue_date}</span>
                <span className="value">{result.issueDate}</span>
              </DetailItem>
              <DetailItem>
                <span className="label">{t.share_percentage}</span>
                <span className="value">{result.sharePercentage}</span>
              </DetailItem>
            </DetailGrid>
          )}
        </ResultCard>
      )}
    </WidgetContainer>
  );
};
