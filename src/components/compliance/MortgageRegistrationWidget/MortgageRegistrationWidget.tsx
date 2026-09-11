import React, { FC } from 'react';
import { Landmark, Calculator, Send, CheckCircle2, FileText, Check, Download, CreditCard, Clock } from 'lucide-react';
import { useMortgageRegistrationLogic } from './MortgageRegistrationWidget.logic';
import {
  WidgetContainer,
  WidgetHeader,
  SelectGroup,
  FeeCalculatorBox,
  ActionButton,
  TrackerContainer,
  StepItem
} from './MortgageRegistrationWidget.style';

export const MortgageRegistrationWidget: FC = () => {
  const {
    t,
    isRtl,
    selectedMortgageId,
    setSelectedMortgageId,
    selectedMortgage,
    mortgages,
    dldFee,
    knowledgeFee,
    grandTotal,
    handleSubmit,
    isSubmitting,
    trackerStatus
  } = useMortgageRegistrationLogic();

  return (
    <WidgetContainer $isRtl={isRtl}>
      <WidgetHeader>
        <h3><Landmark size={28} /> {t.title}</h3>
        <p>{t.subtitle}</p>
      </WidgetHeader>

      <SelectGroup>
        <label>{t.select_deal}</label>
        <select 
          value={selectedMortgageId} 
          onChange={(e) => setSelectedMortgageId(e.target.value)}
          disabled={trackerStatus > 0}
        >
          <option value="">{t.select_deal}</option>
          {mortgages.map(m => (
            <option key={m.id} value={m.id}>
              {m.id} - {m.client} (AED {m.amount.toLocaleString()})
            </option>
          ))}
        </select>
      </SelectGroup>

      {selectedMortgage && (
        <FeeCalculatorBox>
          <h4><Calculator size={18} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'text-bottom' }}/> {t.fee_calculation}</h4>
          
          <div className="fee-row">
            <span className="label">{t.mortgage_amount}</span>
            <span className="value">AED {selectedMortgage.amount.toLocaleString()}</span>
          </div>
          
          <div className="fee-row">
            <span className="label">{t.dld_fee_rate}</span>
            <span className="value">AED {dldFee.toLocaleString()}</span>
          </div>
          
          <div className="fee-row">
            <span className="label">{t.knowledge_fee}</span>
            <span className="value">AED {knowledgeFee.toLocaleString()}</span>
          </div>
          
          <div className="fee-row total">
            <span className="label">{t.grand_total}</span>
            <span className="value">AED {grandTotal.toLocaleString()}</span>
          </div>

          {trackerStatus === 0 && (
            <ActionButton $primary onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? <Clock size={18} className="spinner" /> : <Send size={18} />}
              {isSubmitting ? t.submitting : t.submit_dld}
            </ActionButton>
          )}
        </FeeCalculatorBox>
      )}

      {trackerStatus > 0 && (
        <TrackerContainer>
          <h4>{t.status_tracker}</h4>
          
          <StepItem $completed={trackerStatus > 0} $active={trackerStatus === 1}>
            <div className="icon-wrapper">
              {trackerStatus > 0 ? <Check size={14} /> : <FileText size={14} />}
            </div>
            <div className="step-text">{t.status_draft}</div>
          </StepItem>

          <StepItem $completed={trackerStatus > 1} $active={trackerStatus === 2}>
            <div className="icon-wrapper">
              {trackerStatus > 1 ? <Check size={14} /> : <Send size={14} />}
            </div>
            <div className="step-text">{t.status_submitted}</div>
          </StepItem>

          <StepItem $completed={trackerStatus > 2} $active={trackerStatus === 3}>
            <div className="icon-wrapper">
              {trackerStatus > 2 ? <Check size={14} /> : <CreditCard size={14} />}
            </div>
            <div className="step-text">{t.status_payment}</div>
          </StepItem>

          <StepItem $completed={trackerStatus > 3} $active={trackerStatus === 4}>
            <div className="icon-wrapper">
              {trackerStatus > 3 ? <Check size={14} /> : <CheckCircle2 size={14} />}
            </div>
            <div className="step-text">{t.status_registered}</div>
          </StepItem>

          {trackerStatus === 3 && (
            <div style={{ marginTop: '24px' }}>
              <ActionButton $primary>
                <Download size={18} />
                {t.download_certificate}
              </ActionButton>
            </div>
          )}
        </TrackerContainer>
      )}
    </WidgetContainer>
  );
};
