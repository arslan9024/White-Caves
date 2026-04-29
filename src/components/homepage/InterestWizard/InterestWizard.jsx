import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Building2, Key, ArrowRight, CheckCircle } from 'lucide-react';
import './InterestWizard.css';

const INTEREST_OPTIONS = [
  { 
    id: 'buying', 
    label: 'I want to Buy', 
    icon: Home,
    description: 'Find your dream property in Dubai',
    path: '/properties?type=buy'
  },
  { 
    id: 'selling', 
    label: 'I want to Sell', 
    icon: Building2,
    description: 'List your property with us',
    path: '/list-property'
  },
  { 
    id: 'renting', 
    label: 'I want to Rent', 
    icon: Key,
    description: 'Discover rental properties',
    path: '/properties?type=rent'
  },
];

export default function InterestWizard() {
  const navigate = useNavigate();
  const [selectedInterest, setSelectedInterest] = useState(null);
  const [step, setStep] = useState(1);

  const handleSelect = (interest) => {
    setSelectedInterest(interest);
    setStep(2);
    setTimeout(() => {
      navigate(interest.path);
    }, 800);
  };

  return (
    <section className="interest-wizard-section">
      <div className="wizard-container">
        <div className="wizard-header">
          <h2 className="wizard-title">What brings you here today?</h2>
          <p className="wizard-subtitle">Let us personalize your experience</p>
        </div>

        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: step === 1 ? '50%' : '100%' }}
          />
        </div>

        <div className="options-grid">
          {INTEREST_OPTIONS.map((option) => {
            const Icon = option.icon;
            const isSelected = selectedInterest?.id === option.id;
            
            return (
              <button
                key={option.id}
                className={`interest-option ${isSelected ? 'selected' : ''}`}
                onClick={() => handleSelect(option)}
              >
                <div className="option-icon">
                  {isSelected ? <CheckCircle size={32} /> : <Icon size={32} />}
                </div>
                <h3 className="option-label">{option.label}</h3>
                <p className="option-description">{option.description}</p>
                <ArrowRight size={20} className="option-arrow" />
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
