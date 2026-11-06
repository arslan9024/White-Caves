// FILE: src/components/crm/AgentListingForm/AgentListingForm.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ChevronLeft, Check, X } from 'lucide-react';
import './AgentListingForm.css';
import { STEPS, INITIAL_FORM_DATA } from './AgentListingForm.data';
import ListingBasicInfoStep from './steps/ListingBasicInfoStep';
import ListingLocationStep from './steps/ListingLocationStep';
import ListingSpecsStep from './steps/ListingSpecsStep';
import ListingPricingStep from './steps/ListingPricingStep';
import ListingMediaStep from './steps/ListingMediaStep';
import ListingLegalStep from './steps/ListingLegalStep';

export default function AgentListingForm({ onClose }) {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleArrayField = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(v => v !== value)
        : [...prev[field], value],
    }));
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 6));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const handleSubmit = async () => {
    if (onClose) onClose();
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <ListingBasicInfoStep formData={formData} updateField={updateField} />;
      case 2:
        return <ListingLocationStep formData={formData} updateField={updateField} />;
      case 3:
        return (
          <ListingSpecsStep
            formData={formData}
            updateField={updateField}
            toggleArrayField={toggleArrayField}
          />
        );
      case 4:
        return <ListingPricingStep formData={formData} updateField={updateField} />;
      case 5:
        return <ListingMediaStep formData={formData} updateField={updateField} />;
      case 6:
        return <ListingLegalStep formData={formData} updateField={updateField} />;
      default:
        return null;
    }
  };

  return (
    <div className="agent-listing-form">
      <div className="form-header">
        <h2>Create Property Listing</h2>
        {onClose && (
          <button className="close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        )}
      </div>

      <div className="form-progress">
        {STEPS.map((step, index) => (
          <React.Fragment key={step.id}>
            <button
              className={`progress-step ${currentStep === step.id ? 'active' : ''} ${currentStep > step.id ? 'completed' : ''}`}
              onClick={() => setCurrentStep(step.id)}
            >
              <div className="step-icon">
                {currentStep > step.id ? <Check size={18} /> : <step.icon size={18} />}
              </div>
              <span className="step-label">{step.title}</span>
            </button>
            {index < STEPS.length - 1 && <div className="progress-line" />}
          </React.Fragment>
        ))}
      </div>

      <div className="form-body">{renderStepContent()}</div>

      <div className="form-footer">
        <button className="btn-secondary" onClick={prevStep} disabled={currentStep === 1}>
          <ChevronLeft size={18} />
          Previous
        </button>

        {currentStep < 6 ? (
          <button className="btn-primary" onClick={nextStep}>
            Next
            <ChevronRight size={18} />
          </button>
        ) : (
          <button className="btn-submit" onClick={handleSubmit}>
            <Check size={18} />
            Submit Listing
          </button>
        )}
      </div>
    </div>
  );
}
