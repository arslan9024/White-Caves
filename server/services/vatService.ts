export enum VATTransactionType {
  RESIDENTIAL_SALES_COMMISSION = 'RESIDENTIAL_SALES_COMMISSION',
  COMMERCIAL_SALES_COMMISSION = 'COMMERCIAL_SALES_COMMISSION',
  LONG_TERM_RESIDENTIAL_RENT_COMMISSION = 'LONG_TERM_RESIDENTIAL_RENT_COMMISSION',
  SHORT_TERM_RENT_COMMISSION = 'SHORT_TERM_RENT_COMMISSION',
  PROPERTY_MANAGEMENT_FEE = 'PROPERTY_MANAGEMENT_FEE',
  DLD_TRANSFER_FEE = 'DLD_TRANSFER_FEE',
}

export interface VATCalculationResult {
  vatRate: number; // Percentage, e.g., 5 or 0
  baseAmount: number; // Amount before VAT
  vatAmount: number; // Calculated VAT amount
  totalAmount: number; // Base + VAT
  isTaxable: boolean;
}

export class VATService {
  /**
   * Calculate VAT based on the UAE FTA reference table.
   * @param transactionType The type of transaction
   * @param baseAmount The base amount (excluding VAT)
   */
  static calculateVAT(
    transactionType: VATTransactionType,
    baseAmount: number
  ): VATCalculationResult {
    let vatRate = 0;
    let isTaxable = false;

    switch (transactionType) {
      case VATTransactionType.RESIDENTIAL_SALES_COMMISSION:
      case VATTransactionType.COMMERCIAL_SALES_COMMISSION:
      case VATTransactionType.SHORT_TERM_RENT_COMMISSION:
      case VATTransactionType.PROPERTY_MANAGEMENT_FEE:
        vatRate = 5;
        isTaxable = true;
        break;
      case VATTransactionType.LONG_TERM_RESIDENTIAL_RENT_COMMISSION:
        vatRate = 0; // Exempt
        isTaxable = false;
        break;
      case VATTransactionType.DLD_TRANSFER_FEE:
        vatRate = 0; // Zero-rated
        isTaxable = true;
        break;
      default:
        // Default to 5% taxable to be safe if the transaction type is unrecognized
        vatRate = 5;
        isTaxable = true;
    }

    const vatAmount = (baseAmount * vatRate) / 100;
    const totalAmount = baseAmount + vatAmount;

    return {
      vatRate,
      baseAmount,
      vatAmount,
      totalAmount,
      isTaxable,
    };
  }

  /**
   * Helper to map a string type to VATTransactionType
   */
  static getTransactionType(type: string, isLongTerm: boolean = true): VATTransactionType {
    const t = type.toLowerCase();
    if (t === 'sale' || t === 'sales') {
      return VATTransactionType.RESIDENTIAL_SALES_COMMISSION;
    }
    if (t === 'rental' || t === 'rent' || t === 'lease') {
      return isLongTerm
        ? VATTransactionType.LONG_TERM_RESIDENTIAL_RENT_COMMISSION
        : VATTransactionType.SHORT_TERM_RENT_COMMISSION;
    }
    if (t === 'management' || t === 'management_fee') {
      return VATTransactionType.PROPERTY_MANAGEMENT_FEE;
    }
    if (t === 'dld_transfer') {
      return VATTransactionType.DLD_TRANSFER_FEE;
    }
    
    // Default to a taxable commission for unknown types
    return VATTransactionType.RESIDENTIAL_SALES_COMMISSION;
  }
}
