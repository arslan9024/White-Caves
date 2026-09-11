import React, { FC } from 'react';
import { FileSignature, FileText, CheckCircle2, Clock, Check, Download, PenTool } from 'lucide-react';
import { useRERAFormLogic } from './RERAFormWidget.logic';
import {
  WidgetContainer,
  WidgetHeader,
  ControlsContainer,
  SelectGroup,
  DataPreview,
  ActionButton,
  ESignWorkflow,
  ProgressSteps,
  StepNode
} from './RERAFormWidget.style';

export const RERAFormWidget: FC = () => {
  const {
    t,
    isRtl,
    selectedDealId,
    setSelectedDealId,
    selectedForm,
    setSelectedForm,
    selectedDeal,
    deals,
    handleGenerate,
    handleESign,
    isGenerating,
    trackerStatus
  } = useRERAFormLogic();

  return (
    <WidgetContainer $isRtl={isRtl}>
      <WidgetHeader>
        <h3><FileSignature size={28} /> {t.title}</h3>
        <p>{t.subtitle}</p>
      </WidgetHeader>

      <ControlsContainer>
        <SelectGroup>
          <label>{t.select_deal}</label>
          <select 
            value={selectedDealId} 
            onChange={(e) => setSelectedDealId(e.target.value)}
            disabled={trackerStatus > 0}
          >
            <option value="">{t.select_deal}</option>
            {deals.map(deal => (
              <option key={deal.id} value={deal.id}>
                {deal.id} - {deal.client}
              </option>
            ))}
          </select>
        </SelectGroup>

        <SelectGroup>
          <label>{t.form_type}</label>
          <select 
            value={selectedForm} 
            onChange={(e) => setSelectedForm(e.target.value)}
            disabled={trackerStatus > 0}
          >
            <option value="form_a">{t.form_a}</option>
            <option value="form_b">{t.form_b}</option>
            <option value="form_f">{t.form_f}</option>
          </select>
        </SelectGroup>
      </ControlsContainer>

      {selectedDeal && (
        <DataPreview>
          <div className="data-item">
            <span className="label">{t.client_name}</span>
            <span className="value">{selectedDeal.client}</span>
          </div>
          <div className="data-item">
            <span className="label">{t.property_id}</span>
            <span className="value">{selectedDeal.propertyId}</span>
          </div>
          <div className="data-item">
            <span className="label">{t.deal_value}</span>
            <span className="value">AED {selectedDeal.value}</span>
          </div>
        </DataPreview>
      )}

      {trackerStatus === 0 && (
        <ActionButton $primary onClick={handleGenerate} disabled={!selectedDealId || isGenerating}>
          {isGenerating ? <Clock size={18} className="spinner" /> : <FileText size={18} />}
          {isGenerating ? t.generating : t.generate_form}
        </ActionButton>
      )}

      {trackerStatus > 0 && (
        <ESignWorkflow>
          <ProgressSteps>
            <div 
              className="progress-line" 
              style={{ width: trackerStatus === 1 ? '0%' : trackerStatus === 2 ? '50%' : '100%' }}
            />
            <StepNode $completed={trackerStatus > 1} $active={trackerStatus === 1}>
              <div className="circle">
                {trackerStatus > 1 ? <Check size={14} /> : 1}
              </div>
              <span className="label">{t.status_draft}</span>
            </StepNode>
            
            <StepNode $completed={trackerStatus > 2} $active={trackerStatus === 2}>
              <div className="circle">
                {trackerStatus > 2 ? <Check size={14} /> : 2}
              </div>
              <span className="label">{t.status_sent}</span>
            </StepNode>

            <StepNode $completed={trackerStatus === 3} $active={trackerStatus === 3}>
              <div className="circle">
                {trackerStatus === 3 ? <CheckCircle2 size={14} /> : 3}
              </div>
              <span className="label">{t.status_signed}</span>
            </StepNode>
          </ProgressSteps>

          {trackerStatus === 1 && (
            <ActionButton $primary onClick={handleESign}>
              <PenTool size={18} />
              {t.esign_workflow}
            </ActionButton>
          )}

          {trackerStatus === 3 && (
            <ActionButton $primary>
              <Download size={18} />
              Download Signed Form
            </ActionButton>
          )}
        </ESignWorkflow>
      )}
    </WidgetContainer>
  );
};
