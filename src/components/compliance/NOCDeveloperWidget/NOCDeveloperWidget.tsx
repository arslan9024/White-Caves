import React, { FC } from 'react';
import { Building, Send, FileText, CheckCircle2, Clock, Check, Download } from 'lucide-react';
import { useNOCDeveloperLogic } from './NOCDeveloperWidget.logic';
import {
  WidgetContainer,
  WidgetHeader,
  FormGrid,
  InputGroup,
  ActionButton,
  TrackerContainer,
  StepItem
} from './NOCDeveloperWidget.style';

export const NOCDeveloperWidget: FC = () => {
  const {
    t,
    isRtl,
    formData,
    handleInputChange,
    handleGenerate,
    isGenerating,
    trackerStatus
  } = useNOCDeveloperLogic();

  return (
    <WidgetContainer $isRtl={isRtl}>
      <WidgetHeader>
        <h3><Building size={28} /> {t.title}</h3>
        <p>{t.subtitle}</p>
      </WidgetHeader>

      <FormGrid onSubmit={handleGenerate}>
        <InputGroup>
          <label>{t.developer_name}</label>
          <input 
            type="text" 
            name="developerName" 
            value={formData.developerName} 
            onChange={handleInputChange} 
            required
            disabled={trackerStatus > 0}
          />
        </InputGroup>
        
        <InputGroup>
          <label>{t.project_name}</label>
          <input 
            type="text" 
            name="projectName" 
            value={formData.projectName} 
            onChange={handleInputChange} 
            required
            disabled={trackerStatus > 0}
          />
        </InputGroup>

        <InputGroup>
          <label>{t.unit_number}</label>
          <input 
            type="text" 
            name="unitNumber" 
            value={formData.unitNumber} 
            onChange={handleInputChange} 
            required
            disabled={trackerStatus > 0}
          />
        </InputGroup>

        <InputGroup>
          <label>{t.buyer_name}</label>
          <input 
            type="text" 
            name="buyerName" 
            value={formData.buyerName} 
            onChange={handleInputChange} 
            required
            disabled={trackerStatus > 0}
          />
        </InputGroup>

        <InputGroup>
          <label>{t.seller_name}</label>
          <input 
            type="text" 
            name="sellerName" 
            value={formData.sellerName} 
            onChange={handleInputChange} 
            required
            disabled={trackerStatus > 0}
          />
        </InputGroup>

        {trackerStatus === 0 && (
          <ActionButton type="submit" $primary disabled={isGenerating}>
            {isGenerating ? <Clock size={18} className="spinner" /> : <Send size={18} />}
            {isGenerating ? t.generating : t.generate_noc}
          </ActionButton>
        )}
      </FormGrid>

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
            <div className="step-text">{t.status_sent}</div>
          </StepItem>

          <StepItem $completed={trackerStatus > 2} $active={trackerStatus === 3}>
            <div className="icon-wrapper">
              {trackerStatus > 2 ? <Check size={14} /> : <Clock size={14} />}
            </div>
            <div className="step-text">{t.status_pending}</div>
          </StepItem>

          <StepItem $completed={trackerStatus > 3} $active={trackerStatus === 4}>
            <div className="icon-wrapper">
              {trackerStatus > 3 ? <Check size={14} /> : <CheckCircle2 size={14} />}
            </div>
            <div className="step-text">{t.status_approved}</div>
          </StepItem>

          {trackerStatus === 4 && (
            <div style={{ marginTop: '24px' }}>
              <ActionButton $primary>
                <Download size={18} />
                {t.download_noc}
              </ActionButton>
            </div>
          )}
        </TrackerContainer>
      )}
    </WidgetContainer>
  );
};
