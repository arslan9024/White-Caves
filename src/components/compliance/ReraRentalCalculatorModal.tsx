import React, { FC, useState } from 'react';
import {
  Calculator,
  ShieldAlert,
  CheckCircle2,
  AlertCircle,
  FileText,
  Clock,
  Building,
} from 'lucide-react';
import {
  calculateReraPermissibleRent,
  type ReraRentalCalcResult,
} from '../../services/reraRentalCalculator';

export interface ReraRentalCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultCurrentRent?: number;
  defaultBenchmarkRent?: number;
  defaultPropertyType?: 'APARTMENT' | 'VILLA' | 'COMMERCIAL';
  className?: string;
}

export const ReraRentalCalculatorModal: FC<ReraRentalCalculatorModalProps> = ({
  isOpen,
  onClose,
  defaultCurrentRent = 120000,
  defaultBenchmarkRent = 150000,
  defaultPropertyType = 'APARTMENT',
  className = '',
}) => {
  const [currentRent, setCurrentRent] = useState<number>(defaultCurrentRent);
  const [benchmarkRent, setBenchmarkRent] = useState<number>(defaultBenchmarkRent);
  const [propertyType, setPropertyType] = useState<'APARTMENT' | 'VILLA' | 'COMMERCIAL'>(
    defaultPropertyType
  );
  const [result, setResult] = useState<ReraRentalCalcResult | null>(() => {
    try {
      return calculateReraPermissibleRent({
        currentRentAed: defaultCurrentRent,
        benchmarkAverageRentAed: defaultBenchmarkRent,
        propertyType: defaultPropertyType,
        contractRenewalDate: new Date().toISOString(),
      });
    } catch {
      return null;
    }
  });

  if (!isOpen) return null;

  const handleCalculate = () => {
    try {
      const res = calculateReraPermissibleRent({
        currentRentAed: Number(currentRent),
        benchmarkAverageRentAed: Number(benchmarkRent),
        propertyType,
        contractRenewalDate: new Date().toISOString(),
      });
      setResult(res);
    } catch {
      setResult(null);
    }
  };

  return (
    <div
      role="dialog"
      aria-labelledby="rera-calc-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div
        className={`w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl p-6 text-slate-100 ${className}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-red-600 to-rose-600 text-white shadow-lg shadow-red-600/30">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 id="rera-calc-title" className="text-base font-extrabold text-white">
                Official RERA Rental Calculator
              </h3>
              <p className="text-xs text-slate-400">
                Statutory Decree No. (43) of 2013 · Dubai Land Department
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Close calculator"
          >
            ✕
          </button>
        </div>

        {/* Inputs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-5">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Current Contract Rent (AED)
            </label>
            <input
              type="number"
              aria-label="Current Contract Rent in AED"
              value={currentRent}
              onChange={e => setCurrentRent(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-700 rounded-xl text-sm font-bold text-white focus:outline-none focus:border-red-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              RERA Index Benchmark (AED)
            </label>
            <input
              type="number"
              aria-label="RERA Index Benchmark in AED"
              value={benchmarkRent}
              onChange={e => setBenchmarkRent(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-700 rounded-xl text-sm font-bold text-white focus:outline-none focus:border-red-500"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Property Classification
            </label>
            <div className="flex gap-2">
              {(['APARTMENT', 'VILLA', 'COMMERCIAL'] as const).map(type => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setPropertyType(type)}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all border ${
                    propertyType === type
                      ? 'bg-red-600/20 border-red-500 text-red-400'
                      : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleCalculate}
          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-red-600/30 transition-all"
        >
          Compute Permissible Rate
        </button>

        {/* Result Envelope */}
        {result && (
          <div className="mt-5 p-4 rounded-xl bg-slate-950/90 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-medium">Permissible Rent Increase</span>
              <span
                className={`text-sm font-black ${
                  result.isEligibleForIncrease ? 'text-amber-400' : 'text-emerald-400'
                }`}
              >
                {result.maxPermissibleIncreasePercentage}% ({result.annualRentIncreaseAmountAed.toLocaleString()} AED)
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-medium">New Maximum Annual Rent</span>
              <span className="text-base font-extrabold text-white">
                {result.maxPermissibleNewRentAed.toLocaleString()} AED
              </span>
            </div>

            <div className="pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
              <div className="flex items-center gap-1.5 text-slate-400">
                <Clock className="w-3.5 h-3.5 text-sky-400" />
                <span>Notice Window:</span>
                <strong className="text-white">{result.legalNoticeRequirementDays} Days Prior</strong>
              </div>
              <span className="text-slate-500 font-mono text-[10px]">
                Gap: {result.gapPercentage}%
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReraRentalCalculatorModal;
