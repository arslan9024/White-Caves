/**
 * Phone Number Formatting Service - Priority 4
 * Standardizes phone numbers to E.164 format
 */
export class PhoneFormattingService {
  static formatForWhatsApp(phone) {
    if (!phone) return '';
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.startsWith('971')) return `+${cleaned}`;
    // Handle UAE numbers starting with 0
    if (cleaned.startsWith('0')) return `+971${cleaned.slice(1)}`;
    // Handle UAE numbers without country code
    if (cleaned.length === 9) return `+971${cleaned}`;
    return `+${cleaned}`;
  }

  static formatForDisplay(phone) {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 12) {
      return `+${cleaned.slice(0, 3)} ${cleaned.slice(3, 5)} ${cleaned.slice(5, 8)} ${cleaned.slice(8)}`;
    }
    return phone;
  }

  static getCountryCode(phone) {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.startsWith('971')) return '971';
    if (cleaned.startsWith('1')) return '1';
    if (cleaned.startsWith('44')) return '44';
    return null;
  }

  static isValid(phone) {
    const cleaned = phone.replace(/\D/g, '');
    return cleaned.length >= 9 && cleaned.length <= 15;
  }
}
export default PhoneFormattingService;
