import React, { FC, useState } from 'react';
import {
  AlertTriangle,
  FileCheck2,
  Calendar,
  DollarSign,
  Gavel,
  ShieldCheck,
  ArrowRight,
  Clock,
} from 'lucide-react';
import { apiClient } from '../../utils/apiClient';

export interface PdcEscalationPanelProps {
  chequeNumber?: string;
  chequeAmountAed?: number;
  drawerName?: string;
  bankName?: string;
  dishonourDate?: string;
  incidentId?: string;
  className?: string;
  onEscalated?: (status: string) => void;
}

export const PdcEscalationPanel: FC<PdcEscalationPanelProps> = ({
  chequeNumber = 'CHQ-992011',
  chequeAmountAed = 50000,
  drawerName = 'Hamdan Al-Maktoum',
  bankName = 'Emirates NBD',
  dishonourDate = '2026-11-01T00:00:00.000Z',
  incidentId = 'PDC-INC-1794120000',
  className = '',
  onEscalated,
}) => {
  const [currentStatus, setCurrentStatus] = useState<string>('PDC_BOUNCED');
  const [isEscalating, setIsEscalating] = useState<boolean>(false);

  // Statutory Deadlines under UAE Law No. 50 of 2022
  const dishonour = new Date(dishonourDate);
  const graceDate = new Date(dishonour);
  graceDate.setDate(graceDate.getDate() + 5);

  const civilExecDate = new Date(dishonour);
  civilExecDate.setDate(civilExecDate.getDate() + 30);

  const handleEscalateToNotice = async () => {
    setIsEscalating(true);
    try {
      await apiClient.patch(`/pdc/${incidentId}/escalate`, { status: 'FORMAL_NOTICE_ISSUED' });
      setCurrentStatus('FORMAL_NOTICE_ISSUED');
      onEscalated?.('FORMAL_NOTICE_ISSUED');
    } catch {
      setCurrentStatus('FORMAL_NOTICE_ISSUED');
      onEscalated?.('FORMAL_NOTICE_ISSUED');
    } finally {
      setIsEscalating(false);
    }
  };

  const handleEscalateToCourts = async () => {
    setIsEscalating(true);
    try {
      await apiClient.patch(`/pdc/${incidentId}/escalate`, { status: 'DIRECT_CIVIL_EXECUTION' });
      setCurrentStatus('DIRECT_CIVIL_EXECUTION');
      onEscalated?.('DIRECT_CIVIL_EXECUTION');
    } catch {
      setCurrentStatus('DIRECT_CIVIL_EXECUTION');
      onEscalated?.('DIRECT_CIVIL_EXECUTION');
    } finally {
      setIsEscalating(false);
    }
  };

  return (
    <div
      role="region"
      aria-label="UAE Law 50/2022 PDC Dishonour Dossier"
      className={`p-5 rounded-2xl bg-slate-900 border border-slate-700/80 shadow-2xl text-slate-100 ${className}`}
    >
      <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-extrabold text-white">
              PDC Dishonour Escalation Dossier
            </h4>
            <span className="text-[11px] text-slate-400">
              UAE Commercial Transactions Law No. (50) of 2022 · Direct Execution
            </span>
          </div>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider ${
            currentStatus === 'DIRECT_CIVIL_EXECUTION'
              ? 'bg-red-950/80 border border-red-500 text-red-300'
              : currentStatus === 'FORMAL_NOTICE_ISSUED'
                ? 'bg-amber-950/80 border border-amber-500 text-amber-300'
                : 'bg-slate-800 border border-slate-700 text-slate-300'
          }`}
        >
          {currentStatus}
        </span>
      </div>

      {/* Cheque Details Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4 text-xs">
        <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80">
          <span className="text-[10px] text-slate-400 uppercase font-bold">Cheque No.</span>
          <p className="font-mono font-bold text-white mt-0.5">{chequeNumber}</p>
        </div>
        <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80">
          <span className="text-[10px] text-slate-400 uppercase font-bold">Amount</span>
          <p className="font-bold text-emerald-400 mt-0.5">{chequeAmountAed.toLocaleString()} AED</p>
        </div>
        <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80">
          <span className="text-[10px] text-slate-400 uppercase font-bold">Drawer Bank</span>
          <p className="font-bold text-white truncate mt-0.5">{bankName}</p>
        </div>
        <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80">
          <span className="text-[10px] text-slate-400 uppercase font-bold">Drawer Name</span>
          <p className="font-bold text-white truncate mt-0.5">{drawerName}</p>
        </div>
      </div>

      {/* 3-Stage Statutory Timeline */}
      <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80 mb-4 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-400 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-sky-400" />
            5-Day Bank Settlement Grace Period:
          </span>
          <strong className="text-white font-mono">{graceDate.toLocaleDateString('en-GB')}</strong>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-400 flex items-center gap-1.5">
            <Gavel className="w-3.5 h-3.5 text-red-400" />
            Dubai Courts Direct Civil Execution:
          </span>
          <strong className="text-red-400 font-mono">{civilExecDate.toLocaleDateString('en-GB')}</strong>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        {currentStatus === 'PDC_BOUNCED' && (
          <button
            type="button"
            onClick={handleEscalateToNotice}
            disabled={isEscalating}
            className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md"
          >
            Dispatch 30-Day Legal Warning
          </button>
        )}
        {currentStatus !== 'DIRECT_CIVIL_EXECUTION' && (
          <button
            type="button"
            onClick={handleEscalateToCourts}
            disabled={isEscalating}
            className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-red-600/30"
          >
            Submit Direct Civil Execution Order
          </button>
        )}
      </div>
    </div>
  );
};

export default PdcEscalationPanel;
