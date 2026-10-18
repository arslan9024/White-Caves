import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import en from './data/en.json';
import ar from './data/ar.json';
export interface InvoiceItem {
  desc: string;
  qty: number;
  price: number;
}

export const useArabicRTLInvoiceLogic = () => {
  const isRtl = useSelector((s: RootState) => s.language.isRtl);
  const t = isRtl ? ar : en;
  const subtotal = (t.items as InvoiceItem[]).reduce(
    (sum: number, item: InvoiceItem) => sum + item.qty * item.price,
    0
  );
  const vat = subtotal * 0.05;
  const grandTotal = subtotal + vat;
  return { t, isRtl, subtotal, vat, grandTotal };
};
