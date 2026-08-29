export interface Invoice {
  id: string;
  client: string;
  property: string;
  amount: number;
  status: string;
  date: string;
  dueDate: string;
}

export interface Expense {
  id: number;
  category: string;
  description: string;
  amount: number;
  date: string;
  status: string;
}

export const INVOICES: Invoice[] = [
  { id: 'INV-2024-0156', client: 'Ahmed Al Rashid', property: 'Villa 348', amount: 250000, status: 'paid', date: '2024-01-08', dueDate: '2024-01-15' },
  { id: 'INV-2024-0155', client: 'Sarah Johnson', property: 'Apt 1205', amount: 120000, status: 'pending', date: '2024-01-07', dueDate: '2024-01-14' },
  { id: 'INV-2024-0154', client: 'Mohammed Khan', property: 'Townhouse 12', amount: 95000, status: 'overdue', date: '2024-01-01', dueDate: '2024-01-08' },
  { id: 'INV-2024-0153', client: 'Maria Santos', property: 'Penthouse 501', amount: 350000, status: 'paid', date: '2024-01-05', dueDate: '2024-01-12' },
  { id: 'INV-2024-0152', client: 'James Wilson', property: 'Studio 302', amount: 45000, status: 'pending', date: '2024-01-04', dueDate: '2024-01-11' }
];

export const EXPENSES: Expense[] = [
  { id: 1, category: 'Advertising And Marketing', description: 'Meta Ads & Google PPC Campaign (5010)', amount: 15000, date: '2024-01-08', status: 'approved' },
  { id: 2, category: 'Rent Expense', description: 'Office D-72 Al Barsha Lease (5200)', amount: 45000, date: '2024-01-07', status: 'approved' },
  { id: 3, category: 'IT and Internet Expenses', description: 'AWS Cloud & Fiber Internet (5100)', amount: 3200, date: '2024-01-06', status: 'approved' },
  { id: 4, category: 'Salaries and Employee Wages', description: 'WPS Monthly Payroll Execution (5220)', amount: 450000, date: '2024-01-01', status: 'processed' },
  { id: 5, category: '[ Payroll-009 ] Air Travel Allowance Expense', description: 'Annual Executive Flight Provisions (5020)', amount: 18500, date: '2024-01-10', status: 'pending' },
  { id: 6, category: 'Automobile Expense', description: 'Company Fleet Servicing & Salik Tolls (5030)', amount: 4200, date: '2024-01-09', status: 'approved' },
  { id: 7, category: 'Furniture and Equipment', description: 'Meeting Room Smart Screens & Desks (1510)', amount: 28000, date: '2024-01-05', status: 'approved' },
  { id: 8, category: 'Cost of Goods Sold', description: 'Direct Property Listing Fulfilment (5000)', amount: 35000, date: '2024-01-04', status: 'processed' }
];
