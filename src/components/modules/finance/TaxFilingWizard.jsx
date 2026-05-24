import React, { useState } from 'react';
import PropTypes from 'prop-types';

/**
 * TaxFilingWizard Component
 * 5-step form wizard for filing taxes
 * Step 1: Basic Info, Step 2: Revenue/Expenses, Step 3: Review
 * Step 4: Documents, Step 5: Submit
 * Integrates with Aisha (Corporate Tax Manager) and Noor (Internal Audit Manager)
 * 
 * @component
 * @param {Object} props
 * @param {Function} props.onSubmit - Form submission callback
 * @param {Function} props.onCancel - Cancel callback
 */
const TaxFilingWizard = ({
  onSubmit = () => {},
  onCancel = () => {}
}) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    taxId: '',
    businessName: '',
    totalRevenue: '',
    grossProfit: '',
    totalExpenses: '',
    deductibleExpenses: '',
    documents: [],
    agreement: false
  });
  const [errors, setErrors] = useState({});

  const steps = [
    { number: 1, title: 'Basic Info', icon: '👤' },
    { number: 2, title: 'Revenue & Expenses', icon: '💰' },
    { number: 3, title: 'Review', icon: '✓' },
    { number: 4, title: 'Documents', icon: '📄' },
    { number: 5, title: 'Submit', icon: '✈️' }
  ];

  const validateStep = (currentStep) => {
    const newErrors = {};
    if (currentStep === 1) {
      if (!formData.firstName.trim()) newErrors.firstName = 'Required';
      if (!formData.lastName.trim()) newErrors.lastName = 'Required';
      if (!formData.taxId.trim()) newErrors.taxId = 'Required';
    } else if (currentStep === 2) {
      if (!formData.totalRevenue) newErrors.totalRevenue = 'Required';
      if (!formData.totalExpenses) newErrors.totalExpenses = 'Required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(Math.min(step + 1, 5));
    }
  };

  const handlePrevious = () => {
    setStep(Math.max(step - 1, 1));
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({
      ...prev,
      documents: [...prev.documents, ...files]
    }));
  };

  const removeDocument = (index) => {
    setFormData(prev => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = () => {
    if (formData.agreement) {
      onSubmit(formData);
    } else {
      setErrors(prev => ({ ...prev, agreement: 'You must agree to continue' }));
    }
  };

  const StepIndicator = () => (
    <div className="flex items-center justify-between mb-8">
      {steps.map((s, idx) => (
        <React.Fragment key={s.number}>
          <div className="flex flex-col items-center flex-1">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
              step > s.number
                ? 'bg-green-600 dark:bg-green-500 text-white'
                : step === s.number
                ? 'bg-red-600 dark:bg-red-500 text-white'
                : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
            }`}>
              {step > s.number ? '✓' : s.number}
            </div>
            <p className={`text-xs mt-2 text-center ${
              step >= s.number
                ? 'text-slate-900 dark:text-white font-medium'
                : 'text-slate-500 dark:text-slate-400'
            }`}>
              {s.title}
            </p>
          </div>
          {idx < steps.length - 1 && (
            <div className={`h-1 flex-1 mx-1 mb-6 ${
              step > s.number
                ? 'bg-green-600 dark:bg-green-500'
                : 'bg-slate-200 dark:bg-slate-700'
            }`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );

  const InputField = ({ label, name, type = 'text', placeholder, required = false }) => (
    <div className="mb-6">
      <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
        {label}
        {required && <span className="text-red-600 dark:text-red-400">*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={formData[name]}
        onChange={handleInputChange}
        placeholder={placeholder}
        className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 transition-colors ${
          errors[name]
            ? 'border-red-600 dark:border-red-400'
            : 'border-slate-300 dark:border-slate-600 focus:border-red-600 dark:focus:border-red-400'
        } focus:outline-none`}
      />
      {errors[name] && (
        <p className="text-red-600 dark:text-red-400 text-xs mt-1 flex items-center gap-1">
          ⚠️ {errors[name]}
        </p>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Tax Filing Wizard
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Complete your tax filing in 5 simple steps
          </p>
        </div>

        {/* Step Indicator */}
        <StepIndicator />

        {/* Form Content */}
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6 md:p-8">
          {step === 1 && (
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
                Basic Information
              </h2>
              <InputField label="First Name" name="firstName" placeholder="John" required />
              <InputField label="Last Name" name="lastName" placeholder="Doe" required />
              <InputField label="Tax ID / SSN" name="taxId" placeholder="XX-XXXXXXX" required />
              <InputField label="Business Name" name="businessName" placeholder="Your Business" />
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
                Revenue & Expenses
              </h2>
              <InputField
                label="Total Revenue"
                name="totalRevenue"
                type="number"
                placeholder="0.00"
                required
              />
              <InputField
                label="Gross Profit"
                name="grossProfit"
                type="number"
                placeholder="0.00"
              />
              <InputField
                label="Total Expenses"
                name="totalExpenses"
                type="number"
                placeholder="0.00"
                required
              />
              <InputField
                label="Deductible Expenses"
                name="deductibleExpenses"
                type="number"
                placeholder="0.00"
              />
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
                Review Information
              </h2>
              <div className="space-y-4 bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg">
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Name:</span>
                  <span className="text-slate-900 dark:text-white font-medium">
                    {formData.firstName} {formData.lastName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Tax ID:</span>
                  <span className="text-slate-900 dark:text-white font-medium">
                    {formData.taxId}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Total Revenue:</span>
                  <span className="text-slate-900 dark:text-white font-medium">
                    ${Number(formData.totalRevenue || 0).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Total Expenses:</span>
                  <span className="text-slate-900 dark:text-white font-medium">
                    ${Number(formData.totalExpenses || 0).toFixed(2)}
                  </span>
                </div>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-6">
                Please review the information above. You can go back to edit any details.
              </p>
            </div>
          )}

          {step === 4 && (
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
                Upload Documents
              </h2>
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-900 dark:text-white mb-3">
                  Required Documents
                </label>
                <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-6 text-center hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer">
                  <input
                    type="file"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <div className="text-2xl mb-2">📤</div>
                    <p className="text-slate-900 dark:text-white font-medium">
                      Click to upload
                    </p>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">
                      or drag and drop
                    </p>
                  </label>
                </div>
              </div>

              {formData.documents.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-slate-900 dark:text-white mb-3">
                    Uploaded Files ({formData.documents.length})
                  </p>
                  {formData.documents.map((file, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <span>📄</span>
                        <span className="text-sm text-slate-900 dark:text-white">
                          {file.name}
                        </span>
                      </div>
                      <button
                        onClick={() => removeDocument(idx)}
                        className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {step === 5 && (
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
                Final Submission
              </h2>
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
                <p className="text-sm text-blue-900 dark:text-blue-200">
                  Review all information before submitting. Once submitted, you cannot edit these details.
                </p>
              </div>

              <div className="space-y-4 mb-6">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="agreement"
                    checked={formData.agreement}
                    onChange={handleInputChange}
                    className="mt-1 w-4 h-4 accent-red-600 cursor-pointer"
                  />
                  <span className="text-slate-700 dark:text-slate-300 text-sm">
                    I confirm that all information provided is accurate and complete
                  </span>
                </label>
              </div>

              {errors.agreement && (
                <p className="text-red-600 dark:text-red-400 text-sm flex items-center gap-1 mb-6">
                  ⚠️ {errors.agreement}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex gap-4 mt-8">
          <button
            onClick={handlePrevious}
            disabled={step === 1}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            ← Previous
          </button>

          {step < 5 ? (
            <button
              onClick={handleNext}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 dark:hover:bg-red-500 text-white rounded-lg transition-colors font-medium"
            >
              Next →
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 dark:hover:bg-green-500 text-white rounded-lg transition-colors font-medium"
            >
              Submit Filing
            </button>
          )}

          <button
            onClick={onCancel}
            className="px-6 py-3 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

TaxFilingWizard.propTypes = {
  onSubmit: PropTypes.func,
  onCancel: PropTypes.func
};

export default TaxFilingWizard;
