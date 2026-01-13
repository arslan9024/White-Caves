import React, { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { 
  Shield, Upload, FileCheck, AlertTriangle, CheckCircle,
  User, CreditCard, Building, ChevronRight, X, Loader2
} from 'lucide-react';
import { addNotification } from '../store/slices/kycAmlSlice';
import './KYCVerificationStep.css';

const ROLES_REQUIRING_KYC = ['buyer', 'seller', 'landlord', 'tenant', 'investor', 'agent'];

const DOCUMENT_TYPES = {
  emirates_id: {
    label: 'Emirates ID',
    description: 'Front and back of valid Emirates ID card',
    required: true,
    icon: CreditCard
  },
  passport: {
    label: 'Passport',
    description: 'Bio-data page of valid passport',
    required: true,
    icon: User
  },
  visa: {
    label: 'UAE Visa',
    description: 'Valid UAE residence visa (if applicable)',
    required: false,
    icon: FileCheck
  },
  proof_of_address: {
    label: 'Proof of Address',
    description: 'Utility bill or bank statement (within 3 months)',
    required: false,
    icon: Building
  }
};

const KYCVerificationStep = ({ user, token, role, onComplete, onSkip }) => {
  const dispatch = useDispatch();
  const [step, setStep] = useState('intro');
  const [loading, setLoading] = useState(false);
  const [documents, setDocuments] = useState({});
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    nationality: '',
    emiratesId: '',
    dateOfBirth: '',
    sourceOfFunds: '',
    occupation: '',
    employerName: '',
    annualIncome: ''
  });

  const requiredDocs = Object.entries(DOCUMENT_TYPES)
    .filter(([_, info]) => info.required)
    .map(([type]) => type);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleFileChange = useCallback((docType, e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, [docType]: 'File size must be less than 10MB' }));
        return;
      }
      const validTypes = ['image/jpeg', 'image/png', 'application/pdf'];
      if (!validTypes.includes(file.type)) {
        setErrors(prev => ({ ...prev, [docType]: 'Only JPG, PNG, or PDF files are allowed' }));
        return;
      }
      setDocuments(prev => ({ ...prev, [docType]: file }));
      setErrors(prev => ({ ...prev, [docType]: null }));
    }
  }, []);

  const removeDocument = useCallback((docType) => {
    setDocuments(prev => {
      const updated = { ...prev };
      delete updated[docType];
      return updated;
    });
  }, []);

  const validatePersonalInfo = () => {
    const newErrors = {};
    if (!formData.nationality) newErrors.nationality = 'Nationality is required';
    if (!formData.emiratesId && role !== 'tourist') {
      newErrors.emiratesId = 'Emirates ID number is required';
    }
    if (formData.emiratesId && !/^784-\d{4}-\d{7}-\d$/.test(formData.emiratesId)) {
      newErrors.emiratesId = 'Invalid format (e.g., 784-XXXX-XXXXXXX-X)';
    }
    if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
    if (!formData.sourceOfFunds) newErrors.sourceOfFunds = 'Source of funds is required';
    if (!formData.occupation) newErrors.occupation = 'Occupation is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateDocuments = () => {
    const newErrors = {};
    requiredDocs.forEach(docType => {
      if (!documents[docType]) {
        newErrors[docType] = `${DOCUMENT_TYPES[docType].label} is required`;
      }
    });
    setErrors(prev => ({ ...prev, ...newErrors }));
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 'intro') {
      setStep('personal');
    } else if (step === 'personal') {
      if (validatePersonalInfo()) {
        setStep('documents');
      }
    } else if (step === 'documents') {
      if (validateDocuments()) {
        handleSubmit();
      }
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('userId', user.id);
      formDataToSend.append('userType', role.toUpperCase());
      formDataToSend.append('fullName', user.name || '');
      formDataToSend.append('email', user.email || '');
      formDataToSend.append('nationality', formData.nationality);
      formDataToSend.append('emiratesIdNumber', formData.emiratesId);
      formDataToSend.append('dateOfBirth', formData.dateOfBirth);
      formDataToSend.append('sourceOfFunds', formData.sourceOfFunds);
      formDataToSend.append('occupation', formData.occupation);
      formDataToSend.append('employerName', formData.employerName || '');
      formDataToSend.append('annualIncome', formData.annualIncome || '');

      Object.entries(documents).forEach(([docType, file]) => {
        formDataToSend.append(`document_${docType}`, file);
      });

      const response = await fetch('/api/compliance/profiles', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataToSend
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'KYC submission failed');
      }

      dispatch(addNotification({
        type: 'kyc_submitted',
        title: 'KYC Verification Submitted',
        message: 'Your documents have been submitted for verification. We will notify you once reviewed.',
        severity: 'success'
      }));

      setStep('success');
    } catch (error) {
      console.error('KYC submission error:', error);
      setErrors({ submit: error.message });
    } finally {
      setLoading(false);
    }
  };

  const renderIntro = () => (
    <div className="kyc-step-content intro">
      <div className="kyc-icon-wrapper">
        <Shield size={48} />
      </div>
      <h2>Identity Verification Required</h2>
      <p>
        As a {role}, we need to verify your identity to comply with UAE regulations 
        and ensure secure transactions on our platform.
      </p>
      
      <div className="kyc-info-cards">
        <div className="info-card">
          <CheckCircle size={20} />
          <div>
            <h4>Quick & Secure</h4>
            <p>Takes only 5 minutes to complete</p>
          </div>
        </div>
        <div className="info-card">
          <Shield size={20} />
          <div>
            <h4>Bank-Grade Security</h4>
            <p>Your data is encrypted with AES-256</p>
          </div>
        </div>
        <div className="info-card">
          <FileCheck size={20} />
          <div>
            <h4>UAE Compliant</h4>
            <p>Follows RERA and AML regulations</p>
          </div>
        </div>
      </div>

      <div className="kyc-requirements">
        <h4>You will need:</h4>
        <ul>
          <li><CreditCard size={16} /> Valid Emirates ID (front & back)</li>
          <li><User size={16} /> Passport (bio-data page)</li>
          <li><Building size={16} /> Proof of address (optional)</li>
        </ul>
      </div>
    </div>
  );

  const renderPersonalInfo = () => (
    <div className="kyc-step-content personal-info">
      <h2>Personal Information</h2>
      <p>Please provide accurate information as it appears on your ID documents</p>

      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="nationality">Nationality *</label>
          <select 
            id="nationality"
            name="nationality"
            value={formData.nationality}
            onChange={handleInputChange}
            className={errors.nationality ? 'error' : ''}
          >
            <option value="">Select nationality...</option>
            <option value="UAE">United Arab Emirates</option>
            <option value="SA">Saudi Arabia</option>
            <option value="IN">India</option>
            <option value="PK">Pakistan</option>
            <option value="GB">United Kingdom</option>
            <option value="US">United States</option>
            <option value="CN">China</option>
            <option value="RU">Russia</option>
            <option value="EG">Egypt</option>
            <option value="JO">Jordan</option>
            <option value="LB">Lebanon</option>
            <option value="PH">Philippines</option>
            <option value="other">Other</option>
          </select>
          {errors.nationality && <span className="error-text">{errors.nationality}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="emiratesId">Emirates ID Number *</label>
          <input
            type="text"
            id="emiratesId"
            name="emiratesId"
            value={formData.emiratesId}
            onChange={handleInputChange}
            placeholder="784-XXXX-XXXXXXX-X"
            className={errors.emiratesId ? 'error' : ''}
          />
          {errors.emiratesId && <span className="error-text">{errors.emiratesId}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="dateOfBirth">Date of Birth *</label>
          <input
            type="date"
            id="dateOfBirth"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleInputChange}
            className={errors.dateOfBirth ? 'error' : ''}
          />
          {errors.dateOfBirth && <span className="error-text">{errors.dateOfBirth}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="occupation">Occupation *</label>
          <input
            type="text"
            id="occupation"
            name="occupation"
            value={formData.occupation}
            onChange={handleInputChange}
            placeholder="e.g., Business Owner, Engineer"
            className={errors.occupation ? 'error' : ''}
          />
          {errors.occupation && <span className="error-text">{errors.occupation}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="employerName">Employer Name</label>
          <input
            type="text"
            id="employerName"
            name="employerName"
            value={formData.employerName}
            onChange={handleInputChange}
            placeholder="Company or business name"
          />
        </div>

        <div className="form-group">
          <label htmlFor="sourceOfFunds">Source of Funds *</label>
          <select
            id="sourceOfFunds"
            name="sourceOfFunds"
            value={formData.sourceOfFunds}
            onChange={handleInputChange}
            className={errors.sourceOfFunds ? 'error' : ''}
          >
            <option value="">Select source...</option>
            <option value="SALARY">Employment Salary</option>
            <option value="BUSINESS">Business Income</option>
            <option value="INVESTMENTS">Investments / Trading</option>
            <option value="INHERITANCE">Inheritance</option>
            <option value="SAVINGS">Personal Savings</option>
            <option value="LOAN">Bank Loan / Mortgage</option>
            <option value="GIFT">Gift from Family</option>
            <option value="OTHER">Other</option>
          </select>
          {errors.sourceOfFunds && <span className="error-text">{errors.sourceOfFunds}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="annualIncome">Annual Income Range (AED)</label>
          <select
            id="annualIncome"
            name="annualIncome"
            value={formData.annualIncome}
            onChange={handleInputChange}
          >
            <option value="">Prefer not to say</option>
            <option value="below_100k">Below 100,000</option>
            <option value="100k_250k">100,000 - 250,000</option>
            <option value="250k_500k">250,000 - 500,000</option>
            <option value="500k_1m">500,000 - 1,000,000</option>
            <option value="1m_5m">1,000,000 - 5,000,000</option>
            <option value="above_5m">Above 5,000,000</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderDocuments = () => (
    <div className="kyc-step-content documents">
      <h2>Upload Documents</h2>
      <p>Please upload clear, unedited photos or scans of your documents</p>

      <div className="document-upload-grid">
        {Object.entries(DOCUMENT_TYPES).map(([docType, info]) => {
          const Icon = info.icon;
          const uploaded = documents[docType];
          const hasError = errors[docType];

          return (
            <div 
              key={docType} 
              className={`document-upload-card ${uploaded ? 'uploaded' : ''} ${hasError ? 'error' : ''}`}
            >
              <div className="doc-icon">
                <Icon size={24} />
              </div>
              <div className="doc-info">
                <h4>
                  {info.label}
                  {info.required && <span className="required">*</span>}
                </h4>
                <p>{info.description}</p>
              </div>

              {uploaded ? (
                <div className="uploaded-file">
                  <CheckCircle size={16} className="success-icon" />
                  <span className="file-name">{uploaded.name}</span>
                  <button 
                    type="button" 
                    className="remove-btn"
                    onClick={() => removeDocument(docType)}
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <label className="upload-btn">
                  <Upload size={16} />
                  <span>Upload</span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,application/pdf"
                    onChange={(e) => handleFileChange(docType, e)}
                    hidden
                  />
                </label>
              )}

              {hasError && <span className="doc-error">{hasError}</span>}
            </div>
          );
        })}
      </div>

      <div className="upload-guidelines">
        <AlertTriangle size={16} />
        <span>Ensure documents are clear, not expired, and all corners are visible</span>
      </div>
    </div>
  );

  const renderSuccess = () => (
    <div className="kyc-step-content success">
      <div className="success-icon-wrapper">
        <CheckCircle size={64} />
      </div>
      <h2>Verification Submitted!</h2>
      <p>
        Your documents have been submitted for review. Our compliance team will 
        verify your identity within 1-2 business days.
      </p>
      <div className="success-next-steps">
        <h4>What happens next?</h4>
        <ul>
          <li>You can browse properties while we verify your identity</li>
          <li>We'll notify you via email and SMS once verified</li>
          <li>Some features may be limited until verification is complete</li>
        </ul>
      </div>
      <button className="btn-primary" onClick={() => onComplete({ kycSubmitted: true })}>
        Continue to Dashboard
      </button>
    </div>
  );

  if (!ROLES_REQUIRING_KYC.includes(role?.toLowerCase())) {
    return null;
  }

  return (
    <div className="kyc-verification-overlay">
      <div className="kyc-verification-modal">
        {step !== 'success' && (
          <div className="kyc-header">
            <div className="step-indicator">
              <div className={`step ${step === 'intro' ? 'active' : step !== 'intro' ? 'completed' : ''}`}>
                <span>1</span>
              </div>
              <div className="step-line" />
              <div className={`step ${step === 'personal' ? 'active' : step === 'documents' || step === 'success' ? 'completed' : ''}`}>
                <span>2</span>
              </div>
              <div className="step-line" />
              <div className={`step ${step === 'documents' ? 'active' : step === 'success' ? 'completed' : ''}`}>
                <span>3</span>
              </div>
            </div>
            <button className="close-btn" onClick={onSkip} title="Skip for now">
              <X size={20} />
            </button>
          </div>
        )}

        {errors.submit && (
          <div className="submit-error">
            <AlertTriangle size={16} />
            <span>{errors.submit}</span>
          </div>
        )}

        {step === 'intro' && renderIntro()}
        {step === 'personal' && renderPersonalInfo()}
        {step === 'documents' && renderDocuments()}
        {step === 'success' && renderSuccess()}

        {step !== 'success' && (
          <div className="kyc-actions">
            {step !== 'intro' && (
              <button 
                className="btn-secondary"
                onClick={() => setStep(step === 'documents' ? 'personal' : 'intro')}
                disabled={loading}
              >
                Back
              </button>
            )}
            <button 
              className="btn-primary"
              onClick={handleNext}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="spinner" />
                  Submitting...
                </>
              ) : (
                <>
                  {step === 'documents' ? 'Submit for Verification' : 'Continue'}
                  <ChevronRight size={16} />
                </>
              )}
            </button>
            {step === 'intro' && (
              <button className="btn-skip" onClick={onSkip}>
                Skip for now
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default KYCVerificationStep;
