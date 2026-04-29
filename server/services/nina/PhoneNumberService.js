const UAE_MOBILE_CODES = [
  { code: '50', network: 'Etisalat' },
  { code: '52', network: 'Du' },
  { code: '54', network: 'Etisalat' },
  { code: '55', network: 'Du' },
  { code: '56', network: 'Etisalat' },
  { code: '57', network: 'DOMC' },
  { code: '58', network: 'Du/Virgin Mobile' }
];

const COUNTRY_CODES = [
  { code: '971', country: 'UAE' },
  { code: '966', country: 'Saudi Arabia' },
  { code: '965', country: 'Kuwait' },
  { code: '968', country: 'Oman' },
  { code: '974', country: 'Qatar' },
  { code: '973', country: 'Bahrain' },
  { code: '91', country: 'India' },
  { code: '92', country: 'Pakistan' },
  { code: '44', country: 'UK' },
  { code: '1', country: 'USA/Canada' },
  { code: '20', country: 'Egypt' },
  { code: '962', country: 'Jordan' },
  { code: '961', country: 'Lebanon' },
  { code: '963', country: 'Syria' },
  { code: '964', country: 'Iraq' },
  { code: '86', country: 'China' },
  { code: '33', country: 'France' },
  { code: '49', country: 'Germany' },
  { code: '7', country: 'Russia' },
  { code: '90', country: 'Turkey' },
  { code: '234', country: 'Nigeria' },
  { code: '27', country: 'South Africa' },
  { code: '254', country: 'Kenya' },
  { code: '63', country: 'Philippines' },
  { code: '880', country: 'Bangladesh' }
];

class PhoneNumberService {
  cleanNumber(number) {
    if (!number) return '';
    return String(number)
      .replace(/[^\d]/g, '')
      .replace(/^0+/, '')
      .replace(/(?<=971)0+/g, '');
  }

  detectCountryCode(number) {
    const cleaned = this.cleanNumber(number);
    for (const { code, country } of COUNTRY_CODES) {
      if (cleaned.startsWith(code)) {
        return { code, country, number: cleaned };
      }
    }
    return null;
  }

  detectUAENetwork(number) {
    const cleaned = this.cleanNumber(number);
    let localNumber = cleaned;
    
    if (cleaned.startsWith('971')) {
      localNumber = cleaned.substring(3);
    }
    
    for (const { code, network } of UAE_MOBILE_CODES) {
      if (localNumber.startsWith(code)) {
        return { code, network, isUAE: true };
      }
    }
    return null;
  }

  validateAndFormat(number) {
    const cleaned = this.cleanNumber(number);
    
    if (cleaned.length < 7) {
      return {
        valid: false,
        category: 'too_short',
        original: number,
        cleaned
      };
    }

    const countryInfo = this.detectCountryCode(cleaned);
    if (countryInfo) {
      const networkInfo = countryInfo.code === '971' ? this.detectUAENetwork(cleaned) : null;
      return {
        valid: true,
        category: 'international',
        original: number,
        cleaned,
        formatted: cleaned,
        whatsappFormat: `${cleaned}@c.us`,
        country: countryInfo.country,
        countryCode: countryInfo.code,
        network: networkInfo?.network || null
      };
    }

    const networkInfo = this.detectUAENetwork(cleaned);
    if (networkInfo && cleaned.length === 9) {
      const formatted = `971${cleaned}`;
      return {
        valid: true,
        category: 'uae_local',
        original: number,
        cleaned,
        formatted,
        whatsappFormat: `${formatted}@c.us`,
        country: 'UAE',
        countryCode: '971',
        network: networkInfo.network
      };
    }

    if (cleaned.length >= 10) {
      const formatted = `971${cleaned}`;
      return {
        valid: true,
        category: 'assumed_uae',
        original: number,
        cleaned,
        formatted,
        whatsappFormat: `${formatted}@c.us`,
        country: 'UAE (assumed)',
        countryCode: '971',
        network: null
      };
    }

    return {
      valid: false,
      category: 'invalid',
      original: number,
      cleaned
    };
  }

  extractPhoneNumbers(row, columnIndices = { phone: 5, mobile: 7, secondary: 8 }) {
    const numbers = [];
    
    for (const [key, index] of Object.entries(columnIndices)) {
      const value = row[index];
      if (value) {
        const result = this.validateAndFormat(value);
        if (result.valid) {
          numbers.push({ ...result, source: key });
        }
      }
    }
    
    return numbers;
  }

  processSheetRows(rows, columnIndices) {
    const results = {
      valid: [],
      invalid: [],
      uaeNumbers: [],
      internationalNumbers: [],
      duplicates: new Set()
    };

    const seenNumbers = new Set();

    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      const numbers = this.extractPhoneNumbers(row, columnIndices);
      
      for (const num of numbers) {
        if (seenNumbers.has(num.formatted)) {
          results.duplicates.add(num.formatted);
          continue;
        }
        
        seenNumbers.add(num.formatted);
        
        if (num.valid) {
          results.valid.push(num);
          if (num.countryCode === '971') {
            results.uaeNumbers.push(num);
          } else {
            results.internationalNumbers.push(num);
          }
        } else {
          results.invalid.push(num);
        }
      }
    }

    results.duplicates = Array.from(results.duplicates);
    return results;
  }

  filterByBlocklist(numbers, blocklist) {
    const blockSet = new Set(blocklist.map(n => this.cleanNumber(n)));
    return numbers.filter(num => !blockSet.has(num.cleaned) && !blockSet.has(num.formatted));
  }

  getUAENetworks() {
    return UAE_MOBILE_CODES;
  }

  getCountryCodes() {
    return COUNTRY_CODES;
  }
}

export default new PhoneNumberService();
