const languageConfig = {
  storage: {
    key: 'whitecaves_language',
    default: 'en',
    supported: ['en', 'ar']
  },
  
  rtl: {
    ar: {
      direction: 'rtl',
      fontFamily: "'Cairo', 'Noto Sans Arabic', sans-serif",
      textAlign: 'right'
    },
    en: {
      direction: 'ltr',
      fontFamily: "'Montserrat', 'Open Sans', sans-serif",
      textAlign: 'left'
    }
  },
  
  formatting: {
    ar: {
      numberSystem: 'arab',
      dateFormat: 'dd/MM/yyyy',
      currencyFormat: {
        style: 'currency',
        currency: 'AED',
        currencyDisplay: 'symbol'
      }
    },
    en: {
      numberSystem: 'latn',
      dateFormat: 'MM/dd/yyyy',
      currencyFormat: {
        style: 'currency',
        currency: 'AED',
        currencyDisplay: 'symbol'
      }
    }
  },

  translations: {
    common: {
      en: {
        search: 'Search Properties',
        filter: 'Filter',
        viewDetails: 'View Details',
        contactAgent: 'Contact Agent',
        price: 'Price',
        bedrooms: 'Bedrooms',
        bathrooms: 'Bathrooms',
        area: 'Area',
        sqft: 'sq.ft',
        save: 'Save',
        cancel: 'Cancel',
        submit: 'Submit',
        loading: 'Loading...',
        noResults: 'No results found',
        error: 'Something went wrong',
        success: 'Success',
        forSale: 'For Sale',
        forRent: 'For Rent',
        available: 'Available',
        sold: 'Sold',
        rented: 'Rented',
        reserved: 'Reserved'
      },
      ar: {
        search: 'بحث عن عقارات',
        filter: 'تصفية',
        viewDetails: 'عرض التفاصيل',
        contactAgent: 'اتصل بالوكيل',
        price: 'السعر',
        bedrooms: 'غرف نوم',
        bathrooms: 'حمامات',
        area: 'المساحة',
        sqft: 'قدم مربع',
        save: 'حفظ',
        cancel: 'إلغاء',
        submit: 'إرسال',
        loading: 'جاري التحميل...',
        noResults: 'لم يتم العثور على نتائج',
        error: 'حدث خطأ ما',
        success: 'تم بنجاح',
        forSale: 'للبيع',
        forRent: 'للإيجار',
        available: 'متاح',
        sold: 'تم البيع',
        rented: 'مؤجر',
        reserved: 'محجوز'
      }
    },
    
    propertyTypes: {
      en: {
        Apartment: 'Apartment',
        Villa: 'Villa',
        Townhouse: 'Townhouse',
        Penthouse: 'Penthouse',
        Office: 'Office',
        Warehouse: 'Warehouse',
        Land: 'Land',
        Studio: 'Studio'
      },
      ar: {
        Apartment: 'شقة',
        Villa: 'فيلا',
        Townhouse: 'تاون هاوس',
        Penthouse: 'بنتهاوس',
        Office: 'مكتب',
        Warehouse: 'مستودع',
        Land: 'أرض',
        Studio: 'استوديو'
      }
    },
    
    emirates: {
      en: {
        'Dubai': 'Dubai',
        'Abu Dhabi': 'Abu Dhabi',
        'Sharjah': 'Sharjah',
        'Ajman': 'Ajman',
        'RAK': 'Ras Al Khaimah',
        'Fujairah': 'Fujairah',
        'UAQ': 'Umm Al Quwain'
      },
      ar: {
        'Dubai': 'دبي',
        'Abu Dhabi': 'أبو ظبي',
        'Sharjah': 'الشارقة',
        'Ajman': 'عجمان',
        'RAK': 'رأس الخيمة',
        'Fujairah': 'الفجيرة',
        'UAQ': 'أم القيوين'
      }
    },

    amenities: {
      en: {
        'Private Pool': 'Private Pool',
        'Gym': 'Gym',
        'Sea View': 'Sea View',
        'Balcony': 'Balcony',
        'Covered Parking': 'Covered Parking',
        'Central AC': 'Central A/C',
        'Security': '24/7 Security',
        'Concierge': 'Concierge Service'
      },
      ar: {
        'Private Pool': 'مسبح خاص',
        'Gym': 'صالة رياضية',
        'Sea View': 'إطلالة بحرية',
        'Balcony': 'شرفة',
        'Covered Parking': 'موقف سيارات مغطى',
        'Central AC': 'تكييف مركزي',
        'Security': 'أمن على مدار الساعة',
        'Concierge': 'خدمة الاستقبال'
      }
    }
  }
};

export const getTranslation = (key, language = 'en') => {
  const keys = key.split('.');
  let value = languageConfig.translations;
  
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      return key;
    }
  }
  
  if (typeof value === 'object' && language in value) {
    return value[language];
  }
  
  return key;
};

export const formatCurrency = (amount, language = 'en') => {
  const config = languageConfig.formatting[language];
  return new Intl.NumberFormat(language === 'ar' ? 'ar-AE' : 'en-AE', config.currencyFormat).format(amount);
};

export const formatNumber = (number, language = 'en') => {
  return new Intl.NumberFormat(language === 'ar' ? 'ar-AE' : 'en-AE').format(number);
};

export const isRTL = (language) => language === 'ar';

export default languageConfig;
