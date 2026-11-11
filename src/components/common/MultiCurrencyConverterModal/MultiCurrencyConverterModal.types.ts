/**
 * MultiCurrencyConverterModal.types.ts
 * Types for Real-Time Multi-Currency & Crypto Escrow Converter
 * Architecture: AEGIS Single Purpose File Law (< 350 lines)
 * Law: AEG-001–009, Context Triad, Statutory CBUAE Rates
 */

import { CurrencyCode } from '../../../context/CurrencyContext';

export interface CurrencyRateInfo {
  code: CurrencyCode;
  name: string;
  symbol: string;
  flag: string;
  rateToAED: number;
  inverseRate: number; // 1 unit in AED
  source: 'CBUAE' | 'Binance_Oracle' | 'ECB';
}

export interface MultiCurrencyConverterModalProps {
  isOpen: boolean;
  onClose: () => void;
  baseAmountAED?: number;
  propertyTitle?: string;
}
