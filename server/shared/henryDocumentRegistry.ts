export type GenericDocumentType = 'ejari' | 'trade_licence' | 'company_document' | 'noc' |
  'agency_form' | 'sale_agreement' | 'invoice' | 'receipt' | 'cheque';
export interface DocumentField {
  key: string;
  label: string;
  aliases: string[];
  kind?: 'date' | 'amount' | 'reference';
  required?: boolean;
}
const field = (key: string, label: string, ar: string, required = true, kind?: DocumentField['kind']): DocumentField =>
  ({ key, label, aliases: [label, ar], required, kind });
const date = (key: string, label: string, ar: string, required = true) => field(key, label, ar, required, 'date');
const ref = (label: string, ar: string) => field('documentReference', label, ar, true, 'reference');
const amount = field('totalAmountAed', 'Total Amount AED', 'المبلغ الإجمالي', true, 'amount');
export const genericDocumentRegistry: Record<GenericDocumentType, {
  label: string; markers: string[]; fields: DocumentField[];
}> = {
  ejari: { label: 'Ejari certificate', markers: ['ejari certificate', 'شهادة إيجاري'], fields: [
    ref('Ejari Number', 'رقم إيجاري'), field('landlordName', 'Landlord Name', 'اسم المؤجر'),
    field('tenantName', 'Tenant Name', 'اسم المستأجر'), field('propertyNumber', 'Property Number', 'رقم العقار'),
    date('startDate', 'Start Date', 'تاريخ البداية'), date('endDate', 'End Date', 'تاريخ النهاية'),
  ] },
  trade_licence: { label: 'Trade licence', markers: ['trade licence', 'trade license', 'رخصة تجارية'], fields: [
    ref('Licence Number', 'رقم الرخصة'), field('companyName', 'Company Name', 'اسم الشركة'),
    field('issuingAuthority', 'Issuing Authority', 'جهة الإصدار'),
    date('issueDate', 'Issue Date', 'تاريخ الإصدار', false), date('expiryDate', 'Expiry Date', 'تاريخ الانتهاء'),
  ] },
  company_document: { label: 'Company document (select category manually)', markers: [], fields: [
    ref('Document Reference', 'مرجع المستند'), field('companyName', 'Company Name', 'اسم الشركة'),
    field('documentTitle', 'Document Title', 'عنوان المستند'),
    date('issueDate', 'Issue Date', 'تاريخ الإصدار', false),
  ] },
  noc: { label: 'No objection certificate', markers: ['no objection certificate', 'شهادة عدم ممانعة'], fields: [
    ref('NOC Reference', 'مرجع عدم الممانعة'), field('issuerName', 'Issuer Name', 'اسم المصدر'),
    field('recipientName', 'Recipient Name', 'اسم المستلم'), field('subject', 'Subject', 'الموضوع'),
    date('issueDate', 'Issue Date', 'تاريخ الإصدار'),
  ] },
  agency_form: { label: 'Agency form', markers: ['agency agreement', 'rera form a', 'rera form b', 'عقد وساطة'], fields: [
    ref('Agency Reference', 'مرجع الوكالة'), field('principalName', 'Principal Name', 'اسم الموكل'),
    field('agentName', 'Agent Name', 'اسم الوكيل'), field('formType', 'Form Type', 'نوع النموذج'),
    date('agreementDate', 'Agreement Date', 'تاريخ الاتفاقية'),
  ] },
  sale_agreement: { label: 'Sale agreement', markers: ['sale and purchase agreement', 'sale agreement', 'عقد بيع'], fields: [
    ref('Agreement Reference', 'مرجع الاتفاقية'), field('sellerName', 'Seller Name', 'اسم البائع'),
    field('buyerName', 'Buyer Name', 'اسم المشتري'), field('propertyNumber', 'Property Number', 'رقم العقار'),
    date('agreementDate', 'Agreement Date', 'تاريخ الاتفاقية'), amount,
  ] },
  invoice: { label: 'Invoice', markers: ['tax invoice', 'invoice number', 'فاتورة'], fields: [
    ref('Invoice Number', 'رقم الفاتورة'), field('issuerName', 'Issuer Name', 'اسم المصدر'),
    field('recipientName', 'Recipient Name', 'اسم المستلم'), date('issueDate', 'Issue Date', 'تاريخ الإصدار'), amount,
  ] },
  receipt: { label: 'Receipt', markers: ['payment receipt', 'receipt number', 'إيصال'], fields: [
    ref('Receipt Number', 'رقم الإيصال'), field('payerName', 'Payer Name', 'اسم الدافع'),
    field('recipientName', 'Recipient Name', 'اسم المستلم'), date('issueDate', 'Issue Date', 'تاريخ الإصدار'), amount,
  ] },
  cheque: { label: 'Cheque', markers: ['cheque number', 'check number', 'رقم الشيك'], fields: [
    ref('Cheque Number', 'رقم الشيك'), field('payeeName', 'Payee Name', 'اسم المستفيد'),
    field('bankName', 'Bank Name', 'اسم البنك'), date('chequeDate', 'Cheque Date', 'تاريخ الشيك'), amount,
  ] },
};
export const genericDocumentTypes = Object.keys(genericDocumentRegistry) as GenericDocumentType[];
export const supportedDocumentTypes = ['emirates_id', 'title_deed', 'passport', 'tenancy_contract', ...genericDocumentTypes] as const;
export const signatureDocumentTypes: readonly string[] = ['tenancy_contract', 'agency_form', 'sale_agreement', 'noc'];
export const isGenericDocumentType = (value: unknown): value is GenericDocumentType =>
  typeof value === 'string' && Object.hasOwn(genericDocumentRegistry, value);
export type GenericValues = Record<string, string | number>;
export type ReviewedGenericDocument = {
  [T in GenericDocumentType]: { documentType: T; documentReference: string; values: GenericValues;
    demoOnly: false; reviewConfirmed: boolean }
}[GenericDocumentType];

export function validRegistryDate(value: unknown): boolean {
  if (typeof value !== 'string') return false;
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value);
  if (!match) return false;
  const [day, month, year] = match.slice(1).map(Number);
  const dateValue = new Date(Date.UTC(year, month - 1, day));
  return year >= 1900 && dateValue.getUTCFullYear() === year &&
    dateValue.getUTCMonth() === month - 1 && dateValue.getUTCDate() === day;
}
export function genericValidation(type: GenericDocumentType, values: Record<string, unknown>): string[] {
  const errors: string[] = [];
  const present = (value: unknown) => typeof value === 'string' && !!value.trim() && value.length <= 500 &&
    !/^(?:unknown|n\/?a|null|undefined|not available|[-?]+)$/i.test(value.trim()) &&
    !/[\u0000-\u001f\u007f]/.test(value);
  for (const spec of genericDocumentRegistry[type].fields) {
    const value = values[spec.key];
    if ((value === '' || value === undefined) && !spec.required) continue;
    if (spec.kind === 'amount' ? typeof value !== 'number' || !Number.isFinite(value) || value < 0 || value > 1e12 ||
      Math.abs(value * 100 - Math.round(value * 100)) > 0.001
      : spec.kind === 'date' ? !validRegistryDate(value)
        : !present(value) || (spec.kind === 'reference' && (String(value).length > 100 ||
          !/^[\p{L}\p{N}][\p{L}\p{N} ._/-]*$/u.test(String(value)))))
      errors.push(spec.key);
  }
  if (validRegistryDate(values.startDate) && validRegistryDate(values.endDate) &&
    String(values.startDate).split('/').reverse().join('') >= String(values.endDate).split('/').reverse().join(''))
    errors.push('endDate');
  if (validRegistryDate(values.issueDate) && validRegistryDate(values.expiryDate) &&
    String(values.issueDate).split('/').reverse().join('') > String(values.expiryDate).split('/').reverse().join(''))
    errors.push('expiryDate');
  return errors;
}
