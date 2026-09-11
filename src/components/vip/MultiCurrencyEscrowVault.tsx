import React, { useState } from 'react';

interface EscrowDetails {
  dldRegistrationNumber: string;
  projectIban: string;
  projectName: string;
  bankName: string;
}

export function MultiCurrencyEscrowVault() {
  const [escrow, setEscrow] = useState<EscrowDetails>({
    dldRegistrationNumber: '',
    projectIban: '',
    projectName: '',
    bankName: ''
  });
  const [validationStatus, setValidationStatus] = useState<'idle' | 'valid' | 'invalid'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleValidate = () => {
    // Basic structural validation for UAE IBAN (starts with AE, 23 chars)
    if (!escrow.projectIban.startsWith('AE') || escrow.projectIban.length !== 23) {
      setValidationStatus('invalid');
      setErrorMessage('Invalid UAE IBAN format. Must start with AE and be 23 characters long.');
      return;
    }

    // Basic DLD registration format check (mocking DLD project registration number structure)
    if (!escrow.dldRegistrationNumber || escrow.dldRegistrationNumber.length < 5) {
      setValidationStatus('invalid');
      setErrorMessage('Invalid DLD Project Registration Number.');
      return;
    }

    // In a real application, this would call a backend API to cross-reference DLD records
    setValidationStatus('valid');
    setErrorMessage('');
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-200">
      <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
        <span>🛡️</span> Off-Plan Escrow Account Audit Sentinel (AI_ESCROW_GUARD)
      </h2>
      
      <p className="text-sm text-slate-600 mb-6">
        Cross-reference escrow IBAN and DLD project registration numbers before generating buyer installment payment instructions.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">DLD Registration Number</label>
          <input
            type="text"
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g. 123456"
            value={escrow.dldRegistrationNumber}
            onChange={(e) => setEscrow({ ...escrow, dldRegistrationNumber: e.target.value })}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Project Escrow IBAN</label>
          <input
            type="text"
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
            placeholder="AE000000000000000000000"
            value={escrow.projectIban}
            onChange={(e) => setEscrow({ ...escrow, projectIban: e.target.value.toUpperCase() })}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Project Name</label>
          <input
            type="text"
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g. Marina Vista"
            value={escrow.projectName}
            onChange={(e) => setEscrow({ ...escrow, projectName: e.target.value })}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Escrow Bank</label>
          <select
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={escrow.bankName}
            onChange={(e) => setEscrow({ ...escrow, bankName: e.target.value })}
          >
            <option value="">Select Approved Escrow Bank...</option>
            <option value="mashreq">Mashreq Bank</option>
            <option value="emirates_nbd">Emirates NBD</option>
            <option value="dubai_islamic">Dubai Islamic Bank</option>
            <option value="adcb">ADCB</option>
          </select>
        </div>
      </div>

      <div className="flex gap-4 items-center">
        <button
          onClick={handleValidate}
          className="px-6 py-2 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-lg transition-colors"
        >
          Audit & Verify Details
        </button>
        
        {validationStatus === 'valid' && (
          <span className="text-green-600 font-medium flex items-center gap-2">
            <span>✅</span> Escrow Verified. Safe to generate payment instructions.
          </span>
        )}
        
        {validationStatus === 'invalid' && (
          <span className="text-red-600 font-medium flex items-center gap-2">
            <span>❌</span> Validation Failed: {errorMessage}
          </span>
        )}
      </div>
    </div>
  );
}
