import React, { useState, useEffect } from 'react';
import { Receipt, CheckCircle, Clock, X, Plus, Filter, Search, ShieldCheck, CreditCard, Wallet, Tag } from 'lucide-react';
import type { Expense } from '../data/finance';

interface ExpenseCatalogItem {
  expense_id: string;
  name: string;
  description: string;
  uae_vat_rate: number;
  fta_ct_deductible: boolean;
  accounting_ledger_code: string;
}

interface ExpenseCategory {
  category_id: string;
  category_name: string;
  items: ExpenseCatalogItem[];
}

interface ExpensesTabProps {
  expenses: Expense[];
  onApprove: (id: number) => void;
  onReject: (id: number) => void;
}

export const ExpensesTab: React.FC<ExpensesTabProps> = ({ expenses, onApprove, onReject }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showCatalogModal, setShowCatalogModal] = useState<boolean>(false);
  const [showAddExpenseModal, setShowAddExpenseModal] = useState<boolean>(false);

  // Master Catalog (42 items from data/expenses-master-schema.json)
  const [catalog, setCatalog] = useState<ExpenseCategory[]>([]);
  const [loadingCatalog, setLoadingCatalog] = useState(true);

  // New Expense Form State
  const [newExpense, setNewExpense] = useState({
    expense_id: 'EXP-001',
    amount: '',
    payment_source: 'DIRECTORS_LOAN_ACCOUNT_OWNERS_EQUITY',
    notes: '',
    vendor: 'Property Finder',
    date: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    fetch('/api/finance/expense-catalog')
      .then(res => res.json())
      .then(json => {
        if (json?.data?.expense_categories) {
          setCatalog(json.data.expense_categories);
        }
      })
      .catch(err => {
        console.warn('Could not load expense catalog via API, using fallback:', err);
      })
      .finally(() => setLoadingCatalog(false));
  }, []);

  const allCatalogItems: (ExpenseCatalogItem & { category_name: string; category_id: string })[] = catalog.flatMap(
    cat => cat.items.map(item => ({ ...item, category_name: cat.category_name, category_id: cat.category_id }))
  );

  const filteredCatalogItems = allCatalogItems.filter(item => {
    const matchesCategory = selectedCategory === 'ALL' || item.category_id === selectedCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.expense_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.accounting_ledger_code.includes(searchQuery);
    return matchesCategory && matchesSearch;
  });

  const selectedCatalogItem = allCatalogItems.find(i => i.expense_id === newExpense.expense_id);
  const vatRate = selectedCatalogItem ? selectedCatalogItem.uae_vat_rate : 5.0;
  const numAmount = parseFloat(newExpense.amount) || 0;
  const computedVat = (numAmount * (vatRate / 100)).toFixed(2);
  const computedGross = (numAmount + parseFloat(computedVat)).toFixed(2);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-1e293b, #1E293B)' }}>
            Payables & Operating Expenditures (42 Master Register)
          </h3>
          <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.82rem', color: 'var(--text-secondary, #64748B)' }}>
            All outlays classified with UAE VAT (5% / 0%), Corporate Tax deductibility, and Wio vs. Director Loan tracking.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={() => setShowCatalogModal(true)}
            style={{
              background: '#F1F5F9',
              color: '#475569',
              border: '1px solid #CBD5E1',
              borderRadius: '8px',
              padding: '8px 14px',
              fontSize: '0.85rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Tag size={16} /> 42 Expense Codes Reference
          </button>

          <button
            onClick={() => setShowAddExpenseModal(true)}
            style={{
              background: '#8B5CF6',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '8px',
              padding: '8px 16px',
              fontSize: '0.85rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 2px 6px rgba(139, 92, 246, 0.3)',
            }}
          >
            <Plus size={16} /> Record Outlay / Advance
          </button>
        </div>
      </div>

      {/* Categories Filter Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        <button
          onClick={() => setSelectedCategory('ALL')}
          style={{
            padding: '6px 12px',
            borderRadius: '6px',
            border: selectedCategory === 'ALL' ? '1px solid #8B5CF6' : '1px solid #E2E8F0',
            background: selectedCategory === 'ALL' ? '#8B5CF6' : '#FFFFFF',
            color: selectedCategory === 'ALL' ? '#FFFFFF' : '#475569',
            fontSize: '0.8rem',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          All Accounts ({allCatalogItems.length})
        </button>
        {catalog.map(cat => (
          <button
            key={cat.category_id}
            onClick={() => setSelectedCategory(cat.category_id)}
            style={{
              padding: '6px 12px',
              borderRadius: '6px',
              border: selectedCategory === cat.category_id ? '1px solid #8B5CF6' : '1px solid #E2E8F0',
              background: selectedCategory === cat.category_id ? '#8B5CF6' : '#FFFFFF',
              color: selectedCategory === cat.category_id ? '#FFFFFF' : '#475569',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            {cat.category_name} ({cat.items.length})
          </button>
        ))}
      </div>

      {/* Expenses Table */}
      <div style={{ background: 'var(--white, #FFFFFF)', borderRadius: '12px', border: '1px solid var(--text-secondary, #E2E8F0)', overflow: 'hidden' }}>
        <div style={{ padding: '0.75rem 1rem', background: 'var(--color-f8fafc, #F8FAFC)', borderBottom: '1px solid var(--text-secondary, #E2E8F0)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '300px' }}>
            <Search size={16} color="#94A3B8" />
            <input
              type="text"
              placeholder="Search expenses by code or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: '100%', border: 'none', background: 'transparent', outline: 'none', fontSize: '0.85rem' }}
            />
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary, #64748B)', fontWeight: 700 }}>
            Showing {filteredCatalogItems.length} Classified Expense Accounts
          </span>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
          <thead>
            <tr style={{ background: 'var(--color-f8fafc, #F8FAFC)', borderBottom: '1px solid var(--text-secondary, #E2E8F0)', color: 'var(--color-475569, #475569)' }}>
              <th style={{ padding: '12px 16px' }}>Expense ID & Code</th>
              <th style={{ padding: '12px 16px' }}>Expense Name & Scope</th>
              <th style={{ padding: '12px 16px' }}>Category</th>
              <th style={{ padding: '12px 16px' }}>VAT Rate</th>
              <th style={{ padding: '12px 16px' }}>Corporate Tax</th>
              <th style={{ padding: '12px 16px' }}>Payment Mode</th>
            </tr>
          </thead>
          <tbody>
            {filteredCatalogItems.map(item => (
              <tr key={item.expense_id} style={{ borderBottom: '1px solid var(--color-f1f5f9, #F1F5F9)' }}>
                <td style={{ padding: '12px 16px' }}>
                  <div style={{ fontWeight: 800, color: 'var(--color-1e293b, #1E293B)' }}>{item.expense_id}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--accent-purple, #8B5CF6)', fontWeight: 800 }}>Ledger: {item.accounting_ledger_code}</div>
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <div style={{ fontWeight: 700, color: 'var(--color-1e293b, #1E293B)' }}>{item.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary, #64748B)', maxWidth: '380px' }}>{item.description}</div>
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{ display: 'inline-block', padding: '2px 8px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 700, background: 'var(--color-f1f5f9, #F1F5F9)', color: 'var(--color-334155, #334155)' }}>
                    {item.category_id}
                  </span>
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{ fontWeight: 800, color: item.uae_vat_rate > 0 ? 'var(--accent-green, #10B981)' : 'var(--text-secondary, #64748B)' }}>
                    {item.uae_vat_rate > 0 ? '5.0% (Input VAT)' : '0.0% (Exempt)'}
                  </span>
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{ padding: '2px 8px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 800, background: item.fta_ct_deductible ? 'var(--color-ecfdf5, #ECFDF5)' : 'var(--color-fef2f2, #FEF2F2)', color: item.fta_ct_deductible ? 'var(--color-047857, #047857)' : 'var(--accent-red, #B91C1C)' }}>
                    {item.fta_ct_deductible ? '✓ 100% CT Deductible' : '✗ Capital Asset (Non-Deductible)'}
                  </span>
                </td>
                <td style={{ padding: '12px 16px', color: 'var(--text-secondary, #64748B)', fontSize: '0.78rem' }}>
                  Wio Corporate / Director Advance
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Record Expense Modal */}
      {showAddExpenseModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div style={{ background: 'var(--white, #FFFFFF)', padding: '2rem', borderRadius: '16px', width: '520px', maxWidth: '90%', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-1e293b, #1E293B)' }}>
                Record Operating Outlay / Advance
              </h3>
              <button onClick={() => setShowAddExpenseModal(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>
                <X size={20} color="#64748B" />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--color-475569, #475569)', display: 'block', marginBottom: '4px' }}>
                  Select Master Expense Classification (42 Catalog)
                </label>
                <select
                  value={newExpense.expense_id}
                  onChange={(e) => setNewExpense({ ...newExpense, expense_id: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--text-secondary, #CBD5E1)', fontSize: '0.85rem', fontWeight: 700 }}
                >
                  {allCatalogItems.map(i => (
                    <option key={i.expense_id} value={i.expense_id}>
                      [{i.expense_id}] {i.name} ({i.uae_vat_rate}% VAT)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--color-475569, #475569)', display: 'block', marginBottom: '4px' }}>
                  Payment Source / Funding Account
                </label>
                <select
                  value={newExpense.payment_source}
                  onChange={(e) => setNewExpense({ ...newExpense, payment_source: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--text-secondary, #CBD5E1)', fontSize: '0.85rem', fontWeight: 700 }}
                >
                  <option value="DIRECTORS_LOAN_ACCOUNT_OWNERS_EQUITY">
                    💳 Director's Loan Account (Personal Card Advance)
                  </option>
                  <option value="CORPORATE_BANK_ACCOUNT_WIO">
                    🏦 Wio Business Corporate Account (AED Main)
                  </option>
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--color-475569, #475569)', display: 'block', marginBottom: '4px' }}>
                    Net Amount (AED)
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 5000"
                    value={newExpense.amount}
                    onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--text-secondary, #CBD5E1)', fontSize: '0.85rem' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--color-475569, #475569)', display: 'block', marginBottom: '4px' }}>
                    Transaction Date
                  </label>
                  <input
                    type="date"
                    value={newExpense.date}
                    onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--text-secondary, #CBD5E1)', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              <div style={{ background: 'var(--color-f8fafc, #F8FAFC)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--text-secondary, #E2E8F0)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-secondary, #64748B)' }}>
                  <span>Input VAT ({vatRate}%):</span>
                  <strong>AED {computedVat}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', fontWeight: 800, color: 'var(--color-1e293b, #1E293B)', marginTop: '4px' }}>
                  <span>Total Gross Outlay:</span>
                  <strong>AED {computedGross}</strong>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--color-475569, #475569)', display: 'block', marginBottom: '4px' }}>
                  Vendor & Notes
                </label>
                <input
                  type="text"
                  placeholder="e.g. Property Finder LLC - August 2026 Credits"
                  value={newExpense.notes}
                  onChange={(e) => setNewExpense({ ...newExpense, notes: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--text-secondary, #CBD5E1)', fontSize: '0.85rem' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button
                  onClick={() => setShowAddExpenseModal(false)}
                  style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid var(--text-secondary, #CBD5E1)', background: 'var(--white, #FFFFFF)', color: 'var(--color-475569, #475569)', fontWeight: 700, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowAddExpenseModal(false);
                  }}
                  style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', background: 'var(--accent-purple, #8B5CF6)', color: 'var(--white, #FFFFFF)', fontWeight: 800, cursor: 'pointer' }}
                >
                  Confirm & Post to Ledger
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpensesTab;
