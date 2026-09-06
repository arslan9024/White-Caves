import type { ExpenseClaimCategory } from '../expenseClaims.types';

export interface ExpenseClaimFormCopy {
  title: string;
  employeeId: string;
  category: string;
  amountAed: string;
  incurredOn: string;
  description: string;
  receiptReference: string;
  receiptFile: string;
  submit: string;
  reset: string;
  invalid: string;
}

export const EXPENSE_CLAIM_FORM_COPY: Record<'en' | 'ar', ExpenseClaimFormCopy> = {
  en: {
    title: 'Expense claim draft',
    employeeId: 'Employee ID',
    category: 'Category',
    amountAed: 'Amount (AED)',
    incurredOn: 'Incurred on',
    description: 'Description',
    receiptReference: 'Receipt reference (optional)',
    receiptFile: 'Receipt file (local validation only)',
    submit: 'Validate draft',
    reset: 'Reset',
    invalid: 'Review the highlighted fields.',
  },
  ar: {
    title: 'مسودة مطالبة مصروفات',
    employeeId: 'معرّف الموظف',
    category: 'الفئة',
    amountAed: 'المبلغ (درهم)',
    incurredOn: 'تاريخ المصروف',
    description: 'الوصف',
    receiptReference: 'مرجع الإيصال (اختياري)',
    receiptFile: 'ملف الإيصال (تحقق محلي فقط)',
    submit: 'التحقق من المسودة',
    reset: 'إعادة ضبط',
    invalid: 'يرجى مراجعة الحقول المحددة.',
  },
};

export const EXPENSE_CLAIM_CATEGORY_LABELS: Record<
  ExpenseClaimCategory,
  { en: string; ar: string }
> = {
  travel: { en: 'Travel', ar: 'السفر' },
  accommodation: { en: 'Accommodation', ar: 'الإقامة' },
  meals: { en: 'Meals', ar: 'الوجبات' },
  transport: { en: 'Transport', ar: 'النقل' },
  office_supplies: { en: 'Office supplies', ar: 'لوازم المكتب' },
  client_entertainment: { en: 'Client entertainment', ar: 'ضيافة العملاء' },
  software_subscription: { en: 'Software subscription', ar: 'اشتراك البرمجيات' },
  training: { en: 'Training', ar: 'التدريب' },
  utilities: { en: 'Utilities', ar: 'المرافق' },
  other: { en: 'Other', ar: 'أخرى' },
};
