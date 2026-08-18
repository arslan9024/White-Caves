/** ContractTemplateLibrary.logic.ts */
import { useState, useMemo } from 'react';

export interface ContractTemplate {
  id: string; title: string; category: string; pages: number;
  requiredFields: string[]; lastUpdated: string; popular?: boolean;
}

const TEMPLATES: ContractTemplate[] = [
  { id: 't1', title: 'Form A — Seller Listing Agreement', category: 'Sales', pages: 3, requiredFields: ['Seller Name', 'RERA BRN', 'Property Address', 'Listing Price', 'Commission %'], lastUpdated: '2026-07-01', popular: true },
  { id: 't2', title: 'Form B — Buyer Representation Agreement', category: 'Sales', pages: 2, requiredFields: ['Buyer Name', 'Agent BRN', 'Budget Range'], lastUpdated: '2026-07-01', popular: true },
  { id: 't3', title: 'Form F — Memorandum of Understanding (MOU)', category: 'Sales', pages: 4, requiredFields: ['Buyer', 'Seller', 'Property', 'Sale Price', 'Completion Date'], lastUpdated: '2026-06-15', popular: true },
  { id: 't4', title: 'Standard Tenancy Agreement', category: 'Leasing', pages: 8, requiredFields: ['Tenant', 'Landlord', 'Property', 'Rent', 'Term Start', 'Term End', 'PDC Schedule'], lastUpdated: '2026-08-01' },
  { id: 't5', title: 'Luxury Tenancy Agreement', category: 'Leasing', pages: 10, requiredFields: ['Tenant', 'Landlord', 'Property', 'Monthly Rent', 'Security Deposit', 'NDA'], lastUpdated: '2026-07-15' },
  { id: 't6', title: 'NOC Letter — Tenant to Landlord', category: 'Compliance', pages: 1, requiredFields: ['Tenant Name', 'Unit', 'Purpose of NOC'], lastUpdated: '2026-05-20' },
  { id: 't7', title: 'Power of Attorney (POA)', category: 'Compliance', pages: 2, requiredFields: ['Principal', 'Agent', 'Scope', 'Notary Date'], lastUpdated: '2026-04-10' },
  { id: 't8', title: 'Commission Invoice — Agent', category: 'Finance', pages: 1, requiredFields: ['Agent Name', 'Deal Reference', 'Commission AED', 'TRN'], lastUpdated: '2026-08-01', popular: true },
];

const CATEGORIES = ['All', 'Sales', 'Leasing', 'Compliance', 'Finance'];

export function useContractTemplateLibraryLogic() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [preview, setPreview] = useState<ContractTemplate | null>(null);

  const filtered = useMemo(() => {
    if (activeCategory === 'All') return TEMPLATES;
    return TEMPLATES.filter((t) => t.category === activeCategory);
  }, [activeCategory]);

  return { filtered, CATEGORIES, activeCategory, setActiveCategory, preview, setPreview };
}
