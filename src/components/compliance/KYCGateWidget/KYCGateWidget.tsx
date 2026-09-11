import React, { FC } from 'react';
import { ShieldCheck, Fingerprint, FileText, Banknote, UploadCloud, CheckCircle2, Clock, Send } from 'lucide-react';
import { useKYCGateLogic } from './KYCGateWidget.logic';
import {
  WidgetContainer,
  WidgetHeader,
  DocumentCard,
  SubmitButton,
  SuccessCard
} from './KYCGateWidget.style';

export const KYCGateWidget: FC = () => {
  const {
    t,
    isRtl,
    emiratesIdStatus,
    passportStatus,
    sourceOfFundsStatus,
    handleEmiratesIdUpload,
    handlePassportUpload,
    handleSourceOfFundsUpload,
    isFormComplete,
    isSubmitting,
    isSuccess,
    handleSubmit
  } = useKYCGateLogic();

  return (
    <WidgetContainer $isRtl={isRtl}>
      {!isSuccess ? (
        <>
          <WidgetHeader>
            <h3><ShieldCheck size={28} /> {t.title}</h3>
            <p>{t.subtitle}</p>
          </WidgetHeader>

          <DocumentCard $status={emiratesIdStatus}>
            <div className="doc-info">
              <div className="icon-wrapper">
                <Fingerprint size={24} />
              </div>
              <div>
                <h4>{t.emirates_id_scan}</h4>
                <p>
                  {emiratesIdStatus === 'scanning' && <Clock size={14} className="spinner" />}
                  {emiratesIdStatus === 'idle' && t.upload}
                  {emiratesIdStatus === 'scanning' && t.scanning}
                  {emiratesIdStatus === 'verified' && t.verified}
                </p>
              </div>
            </div>
            <div className="action-area">
              {emiratesIdStatus !== 'verified' ? (
                <>
                  <input type="file" accept="image/*,.pdf" onChange={handleEmiratesIdUpload} disabled={emiratesIdStatus === 'scanning'} />
                  <div className="upload-btn">
                    <UploadCloud size={16} /> {t.scan_now}
                  </div>
                </>
              ) : (
                <div className="verified-badge">
                  <CheckCircle2 size={20} />
                </div>
              )}
            </div>
          </DocumentCard>

          <DocumentCard $status={passportStatus}>
            <div className="doc-info">
              <div className="icon-wrapper">
                <FileText size={24} />
              </div>
              <div>
                <h4>{t.passport_scan}</h4>
                <p>
                  {passportStatus === 'scanning' && <Clock size={14} className="spinner" />}
                  {passportStatus === 'idle' && t.upload}
                  {passportStatus === 'scanning' && t.verifying}
                  {passportStatus === 'verified' && t.verified}
                </p>
              </div>
            </div>
            <div className="action-area">
              {passportStatus !== 'verified' ? (
                <>
                  <input type="file" accept="image/*,.pdf" onChange={handlePassportUpload} disabled={passportStatus === 'scanning'} />
                  <div className="upload-btn">
                    <UploadCloud size={16} /> {t.scan_now}
                  </div>
                </>
              ) : (
                <div className="verified-badge">
                  <CheckCircle2 size={20} />
                </div>
              )}
            </div>
          </DocumentCard>

          <DocumentCard $status={sourceOfFundsStatus}>
            <div className="doc-info">
              <div className="icon-wrapper">
                <Banknote size={24} />
              </div>
              <div>
                <h4>{t.source_of_funds}</h4>
                <p>
                  {sourceOfFundsStatus === 'uploading' && <Clock size={14} className="spinner" />}
                  {sourceOfFundsStatus === 'idle' && t.upload}
                  {sourceOfFundsStatus === 'uploading' && t.verifying}
                  {sourceOfFundsStatus === 'verified' && t.verified}
                </p>
              </div>
            </div>
            <div className="action-area">
              {sourceOfFundsStatus !== 'verified' ? (
                <>
                  <input type="file" accept=".pdf" onChange={handleSourceOfFundsUpload} disabled={sourceOfFundsStatus === 'uploading'} />
                  <div className="upload-btn">
                    <UploadCloud size={16} /> {t.upload}
                  </div>
                </>
              ) : (
                <div className="verified-badge">
                  <CheckCircle2 size={20} />
                </div>
              )}
            </div>
          </DocumentCard>

          <SubmitButton $disabled={!isFormComplete || isSubmitting} onClick={handleSubmit}>
            {isSubmitting ? <Clock size={20} className="spinner" /> : <Send size={20} />}
            {isSubmitting ? t.submitting : t.submit_kyc}
          </SubmitButton>
        </>
      ) : (
        <SuccessCard>
          <ShieldCheck size={64} className="icon" />
          <h4>{t.success}</h4>
        </SuccessCard>
      )}
    </WidgetContainer>
  );
};
