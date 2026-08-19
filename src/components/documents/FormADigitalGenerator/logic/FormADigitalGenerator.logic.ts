/** FormADigitalGenerator.logic.ts */
import { useState } from 'react';

export interface FormAData {
  sellerName: string; sellerPhone: string; sellerEmail: string;
  agentName: string; agentBrn: string; companyName: string;
  propertyAddress: string; titleDeedNumber: string; listingPrice: string;
  commissionPct: string; exclusivity: 'exclusive' | 'open'; validityDays: string;
}

const INITIAL: FormAData = {
  sellerName: '', sellerPhone: '', sellerEmail: '',
  agentName: 'Arsalan Malik', agentBrn: '44483', companyName: 'White Caves Real Estate LLC',
  propertyAddress: '', titleDeedNumber: '', listingPrice: '', commissionPct: '2',
  exclusivity: 'exclusive', validityDays: '90',
};

export function useFormADigitalGeneratorLogic() {
  const [form, setForm] = useState<FormAData>(INITIAL);
  const [generated, setGenerated] = useState(false);

  function update(field: keyof FormAData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleGenerate() {
    if (!form.sellerName || !form.propertyAddress || !form.listingPrice) {
      alert('Please fill Seller Name, Property Address, and Listing Price.');
      return;
    }
    setGenerated(true);
  }

  function handleReset() {
    setForm(INITIAL);
    setGenerated(false);
  }

  return { form, update, generated, handleGenerate, handleReset };
}
