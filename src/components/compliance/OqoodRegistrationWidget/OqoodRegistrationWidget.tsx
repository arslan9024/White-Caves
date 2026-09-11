import React, { FC } from 'react';
import { Building2, UserCircle, Briefcase, Calculator, CheckCircle2, Send, Clock, MapPin } from 'lucide-react';
import { useOqoodRegistrationLogic } from './OqoodRegistrationWidget.logic';
import {
  WidgetContainer,
  WidgetHeader,
  SectionTitle,
  FormGrid,
  FormGroup,
  FinancialSummary,
  ActionButton,
  SuccessCard
} from './OqoodRegistrationWidget.style';

export const OqoodRegistrationWidget: FC = () => {
  const {
    t,
    isRtl,
    buyerName,
    setBuyerName,
    buyerPassport,
    setBuyerPassport,
    buyerNationality,
    setBuyerNationality,
    developerName,
    setDeveloperName,
    projectName,
    setProjectName,
    unitNumber,
    setUnitNumber,
    purchasePrice,
    setPurchasePrice,
    oqoodFee,
    adminFee,
    totalPayable,
    isFormValid,
    isRegistering,
    successReceipt,
    handleRegister
  } = useOqoodRegistrationLogic();

  return (
    <WidgetContainer $isRtl={isRtl}>
      <WidgetHeader>
        <h3><Building2 size={28} /> {t.title}</h3>
        <p>{t.subtitle}</p>
      </WidgetHeader>

      {!successReceipt ? (
        <>
          <SectionTitle>
            <UserCircle size={20} className="icon" />
            {t.buyer_details}
          </SectionTitle>
          <FormGrid>
            <FormGroup>
              <label>{t.buyer_name}</label>
              <input type="text" value={buyerName} onChange={e => setBuyerName(e.target.value)} />
            </FormGroup>
            <FormGroup>
              <label>{t.buyer_passport}</label>
              <input type="text" value={buyerPassport} onChange={e => setBuyerPassport(e.target.value)} />
            </FormGroup>
            <FormGroup>
              <label>{t.buyer_nationality}</label>
              <input type="text" value={buyerNationality} onChange={e => setBuyerNationality(e.target.value)} />
            </FormGroup>
          </FormGrid>

          <SectionTitle>
            <MapPin size={20} className="icon" />
            {t.project_details}
          </SectionTitle>
          <FormGrid>
            <FormGroup>
              <label>{t.developer_name}</label>
              <input type="text" value={developerName} onChange={e => setDeveloperName(e.target.value)} />
            </FormGroup>
            <FormGroup>
              <label>{t.project_name}</label>
              <input type="text" value={projectName} onChange={e => setProjectName(e.target.value)} />
            </FormGroup>
            <FormGroup>
              <label>{t.unit_number}</label>
              <input type="text" value={unitNumber} onChange={e => setUnitNumber(e.target.value)} />
            </FormGroup>
          </FormGrid>

          <SectionTitle>
            <Calculator size={20} className="icon" />
            {t.financials}
          </SectionTitle>
          <FormGrid>
            <FormGroup>
              <label>{t.purchase_price}</label>
              <input type="number" min="0" value={purchasePrice} onChange={e => setPurchasePrice(e.target.value)} />
            </FormGroup>
          </FormGrid>

          <FinancialSummary>
            <div className="row">
              <span className="label">{t.oqood_fee}</span>
              <span className="value">AED {oqoodFee.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
            </div>
            <div className="row">
              <span className="label">{t.admin_fee}</span>
              <span className="value">AED {adminFee.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
            </div>
            <div className="row total">
              <span className="label">{t.total_payable}</span>
              <span className="value">AED {totalPayable.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
            </div>
          </FinancialSummary>

          <ActionButton $disabled={!isFormValid || isRegistering} onClick={handleRegister}>
            {isRegistering ? <Clock size={20} className="spinner" /> : <Send size={20} />}
            {isRegistering ? t.registering : t.register_oqood}
          </ActionButton>
        </>
      ) : (
        <SuccessCard>
          <CheckCircle2 size={64} className="icon" />
          <h4>{t.success}</h4>
          <p>{t.dld_receipt}{successReceipt}</p>
        </SuccessCard>
      )}
    </WidgetContainer>
  );
};
