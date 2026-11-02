import type { BusinessDocItem } from '../types';
import { corporateComplianceDocs } from './corporateCompliance.data';
import { leasingFinanceOpsDocs } from './leasingFinanceOps.data';
import { marketingTechStrategyDocs } from './marketingTechStrategy.data';
import { governanceAuditDocs } from './governanceAudit.data';

export const ZOE_BUSINESS_DOCS: BusinessDocItem[] = [
  ...corporateComplianceDocs,
  ...leasingFinanceOpsDocs,
  ...marketingTechStrategyDocs,
  ...governanceAuditDocs,
];
