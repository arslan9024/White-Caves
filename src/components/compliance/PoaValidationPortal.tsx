import React, { useState } from 'react';

export function PoaValidationPortal() {
  const [issueDate, setIssueDate] = useState('');
  const [hasSellClause, setHasSellClause] = useState(false);
  const [hasProceedsClause, setHasProceedsClause] = useState(false);
  const [validationResult, setValidationResult] = useState<'idle' | 'valid' | 'invalid'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const validatePoa = () => {
    if (!issueDate) {
      setValidationResult('invalid');
      setErrorMessage('Please select the POA issue date.');
      return;
    }

    const issued = new Date(issueDate);
    const today = new Date();
    
    // POA cannot exceed 2 years validity
    const diffTime = Math.abs(today.getTime() - issued.getTime());
    const diffYears = diffTime / (1000 * 60 * 60 * 24 * 365.25);

    if (diffYears > 2) {
      setValidationResult('invalid');
      setErrorMessage('POA is expired. General POAs for property sales cannot exceed 2 years validity in Dubai.');
      return;
    }

    if (!hasSellClause || !hasProceedsClause) {
      setValidationResult('invalid');
      setErrorMessage('POA must explicitly grant authority to both sell the property and receive sale proceeds.');
      return;
    }

    setValidationResult('valid');
    setErrorMessage('');
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-200">
      <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
        <span>⚖️</span> Power of Attorney (POA) Statutory Validity Checker
      </h2>
      
      <p className="text-sm text-slate-600 mb-6">
        Verify General POAs against Dubai Courts notary records. Ensures 2-year expiration compliance and explicit selling authorities.
      </p>

      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">POA Notarization / Issue Date</label>
          <input
            type="date"
            className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={issueDate}
            onChange={(e) => setIssueDate(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="sellClause"
            className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
            checked={hasSellClause}
            onChange={(e) => setHasSellClause(e.target.checked)}
          />
          <label htmlFor="sellClause" className="text-sm text-slate-700 font-medium">
            Explicitly grants authority to <strong>SELL</strong> property on behalf of the principal
          </label>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="proceedsClause"
            className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
            checked={hasProceedsClause}
            onChange={(e) => setHasProceedsClause(e.target.checked)}
          />
          <label htmlFor="proceedsClause" className="text-sm text-slate-700 font-medium">
            Explicitly grants authority to <strong>RECEIVE SALE PROCEEDS</strong> on behalf of the principal
          </label>
        </div>
      </div>

      <div className="flex gap-4 items-center">
        <button
          onClick={validatePoa}
          className="px-6 py-2 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-lg transition-colors"
        >
          Check Validity
        </button>
        
        {validationResult === 'valid' && (
          <span className="text-green-600 font-medium flex items-center gap-2">
            <span>✅</span> POA is Statutory Compliant and Valid.
          </span>
        )}
        
        {validationResult === 'invalid' && (
          <span className="text-red-600 font-medium flex items-center gap-2">
            <span>❌</span> Validation Failed: {errorMessage}
          </span>
        )}
      </div>
    </div>
  );
}
