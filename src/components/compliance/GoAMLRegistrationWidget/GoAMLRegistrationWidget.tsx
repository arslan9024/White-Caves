import React, { FC } from 'react';
import { Send, FileText, AlertTriangle, CheckCircle2, Clock, Banknote, ShieldAlert } from 'lucide-react';
import { useGoAMLRegistrationLogic } from './GoAMLRegistrationWidget.logic';
import {
  WidgetContainer,
  WidgetHeader,
  SectionTitle,
  FormGrid,
  FormGroup,
  ThresholdWarning,
  ActionButton,
  SuccessCard
} from './GoAMLRegistrationWidget.style';

export const GoAMLRegistrationWidget: FC = () => {
  const {
    t,
    isRtl,
    clientName,
    setClientName,
    amount,
    setAmount,
    paymentMethod,
    setPaymentMethod,
    reportType,
    setReportType,
    reason,
    setReason,
    isThresholdMet,
    isFiling,
    goAmlRef,
    isFormValid,
    handleFile
  } = useGoAMLRegistrationLogic();

  return (
    <WidgetContainer $isRtl={isRtl}>
      <WidgetHeader>
        <h3><ShieldAlert size={28} /> {t.title}</h3>
        <p>{t.subtitle}</p>
      </WidgetHeader>

      {!goAmlRef ? (
        <>
          {isThresholdMet && (
            <ThresholdWarning>
              <AlertTriangle size={24} className="icon" />
              <p>{t.threshold_warning}</p>
            </ThresholdWarning>
          )}

          <SectionTitle>
            <Banknote size={20} className="icon" />
            {t.transaction_details}
          </SectionTitle>
          <FormGrid>
            <FormGroup>
              <label>{t.client_name}</label>
              <input type="text" value={clientName} onChange={e => setClientName(e.target.value)} />
            </FormGroup>
            <FormGroup>
              <label>{t.amount_aed}</label>
              <input type="number" min="0" value={amount} onChange={e => setAmount(e.target.value)} />
            </FormGroup>
            <FormGroup>
              <label>{t.payment_method}</label>
              <select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value as any)}>
                <option value="cash">{t.cash}</option>
                <option value="bank_transfer">{t.bank_transfer}</option>
                <option value="cheque">{t.cheque}</option>
                <option value="crypto">{t.crypto}</option>
              </select>
            </FormGroup>
            <FormGroup>
              <label>{t.report_type}</label>
              <select value={reportType} onChange={e => setReportType(e.target.value as any)}>
                <option value="str">{t.str}</option>
                <option value="sar">{t.sar}</option>
                <option value="dpmir">{t.dpmir}</option>
              </select>
            </FormGroup>
          </FormGrid>

          <FormGroup style={{ marginBottom: '1.5rem' }}>
            <label>{t.reason_for_suspicion}</label>
            <textarea value={reason} onChange={e => setReason(e.target.value)} />
          </FormGroup>

          <ActionButton $disabled={!isFormValid || isFiling} onClick={handleFile}>
            {isFiling ? <Clock size={20} className="spinner" /> : <Send size={20} />}
            {isFiling ? t.filing : t.file_goaml}
          </ActionButton>
        </>
      ) : (
        <SuccessCard>
          <CheckCircle2 size={64} className="icon" />
          <h4>{t.success}</h4>
          <p>{t.goaml_ref} {goAmlRef}</p>
        </SuccessCard>
      )}
    </WidgetContainer>
  );
};
