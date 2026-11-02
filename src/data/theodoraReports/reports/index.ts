import type { EnterpriseReport } from '../types';
import { overviewSalesReports } from './overviewSales.data';
import { receivablesPaymentsReports } from './receivablesPayments.data';
import { payablesExpensesReports } from './payablesExpenses.data';
import { projectsAccountantReports } from './projectsAccountant.data';
import { auditAutomationReports } from './auditAutomation.data';

export const THEODORA_67_REPORTS: EnterpriseReport[] = [
  ...overviewSalesReports,
  ...receivablesPaymentsReports,
  ...payablesExpensesReports,
  ...projectsAccountantReports,
  ...auditAutomationReports,
];
