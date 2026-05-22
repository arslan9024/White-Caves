import React, { useState, useEffect } from 'react';
import { useLanguage, LANGUAGES } from '../context/LanguageContext';
import 'leaflet/dist/leaflet.css';
import MarketChoroplethMap from '../components/maps/MarketChoroplethMap';

interface PriceIndexRow {
  area: string;
  zone: string;
  avgPricePerSqft: number;
  avgAnnualRent: number;
  grossYield: number;
  transactionVol: number;
  daysOnMarket: number;
  source: string;
  dataDate: string | null;
}

interface IndicatorData {
  avgDaysOnMarket: number;
  absorptionRate: number;
  newListings: number;
  activeListings: number;
  areasIncluded?: number;
  source: string;
  note?: string;
}

interface ReraRow {
  area: string;
  propertyType: string;
  bedrooms: string;
  avgRentAed: number;
  allowedIncreaseBelow10Pct: string;
  allowedIncrease10to20Pct: string;
  allowedIncrease20to30Pct: string;
  allowedIncrease30to40Pct: string;
  allowedIncreaseAbove40Pct: string;
}

const zoneBadge = (z: string) => {
  const map: Record<string, string> = {
    premium: 'bg-yellow-100 text-yellow-800',
    prime: 'bg-purple-100 text-purple-800',
    mid: 'bg-blue-100 text-blue-800',
    affordable: 'bg-green-100 text-green-800',
  };
  return map[z] ?? 'bg-gray-100 text-gray-800';
};

const zoneLabel = (zone: string, isArabic: boolean) => {
  const map: Record<string, { en: string; ar: string }> = {
    premium: { en: 'Premium', ar: 'فاخر' },
    prime: { en: 'Prime', ar: 'رئيسي' },
    mid: { en: 'Mid-Market', ar: 'متوسط السوق' },
    affordable: { en: 'Affordable', ar: 'ميسور' },
  };

  const label = map[zone];
  if (!label) return zone;
  return isArabic ? label.ar : label.en;
};

const propertyTypeLabel = (propertyType: string, isArabic: boolean) => {
  const map: Record<string, { en: string; ar: string }> = {
    apartment: { en: 'Apartment', ar: 'شقة' },
    villa: { en: 'Villa', ar: 'فيلا' },
    townhouse: { en: 'Townhouse', ar: 'تاون هاوس' },
    penthouse: { en: 'Penthouse', ar: 'بنتهاوس' },
    office: { en: 'Office', ar: 'مكتب' },
  };

  const label = map[propertyType.toLowerCase()];
  if (!label) return propertyType;
  return isArabic ? label.ar : label.en;
};

type Tab = 'price-index' | 'indicators' | 'rera-index' | 'heatmap';

export default function MarketIntelligencePage() {
  const { language, isRTL, formatCurrency, formatNumber } = useLanguage();
  const isArabic = language === LANGUAGES.AR;
  const [activeTab, setActiveTab] = useState<Tab>('price-index');
  const [priceIndex, setPriceIndex] = useState<PriceIndexRow[]>([]);
  const [indicators, setIndicators] = useState<IndicatorData | null>(null);
  const [reraIndex, setReraIndex] = useState<ReraRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [zoneFilter, setZoneFilter] = useState('');
  const [sortBy, setSortBy] = useState<'avgPricePerSqft' | 'grossYield'>('grossYield');

  const token = localStorage.getItem('token') ?? '';
  const authFetch = (url: string) => fetch(url, { headers: { Authorization: `Bearer ${token}` } });

  const loadPriceIndex = async () => {
    setLoading(true);
    setError('');
    try {
      const url = `/api/market/price-index${zoneFilter ? `?zone=${zoneFilter}` : ''}`;
      const res = await authFetch(url);
      const json = await res.json();
      if (json.success) setPriceIndex(json.data);
      else
        setError(
          json.message ?? (isArabic ? 'تعذر تحميل مؤشر الأسعار.' : 'Failed to load price index.')
        );
    } catch {
      setError(
        isArabic ? 'خطأ في الشبكة أثناء تحميل مؤشر الأسعار.' : 'Network error loading price index.'
      );
    } finally {
      setLoading(false);
    }
  };

  const loadIndicators = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await authFetch('/api/market/indicators');
      const json = await res.json();
      if (json.success) setIndicators(json.data);
      else
        setError(
          json.message ?? (isArabic ? 'تعذر تحميل المؤشرات.' : 'Failed to load indicators.')
        );
    } catch {
      setError(
        isArabic ? 'خطأ في الشبكة أثناء تحميل المؤشرات.' : 'Network error loading indicators.'
      );
    } finally {
      setLoading(false);
    }
  };

  const loadReraIndex = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await authFetch('/api/market/rera-index');
      const json = await res.json();
      if (json.success) setReraIndex(json.data);
      else
        setError(
          json.message ?? (isArabic ? 'تعذر تحميل مؤشر ريرا.' : 'Failed to load RERA index.')
        );
    } catch {
      setError(
        isArabic ? 'خطأ في الشبكة أثناء تحميل مؤشر ريرا.' : 'Network error loading RERA index.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'price-index' || activeTab === 'heatmap') loadPriceIndex();
    if (activeTab === 'indicators') loadIndicators();
    if (activeTab === 'rera-index') loadReraIndex();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, zoneFilter]);

  const sortedIndex = [...priceIndex].sort((a, b) => b[sortBy] - a[sortBy]);
  const formatPercent = (value: number, decimals = 1) =>
    `${new Intl.NumberFormat(isArabic ? 'ar-AE' : 'en-AE', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(value)}%`;

  const content = isArabic
    ? {
        title: 'ذكاء السوق',
        subtitle: 'مؤشر أسعار عقارات دبي وبيانات المعاملات ومؤشر الإيجارات من ريرا',
        tabs: {
          priceIndex: 'مؤشر الأسعار',
          indicators: 'المؤشرات',
          reraIndex: 'مؤشر ريرا',
          heatmap: 'الخريطة الحرارية',
        },
        errors: {
          priceIndex: 'تعذر تحميل مؤشر الأسعار.',
          indicators: 'تعذر تحميل المؤشرات.',
          rera: 'تعذر تحميل مؤشر ريرا.',
          networkPrice: 'خطأ في الشبكة أثناء تحميل مؤشر الأسعار.',
          networkIndicators: 'خطأ في الشبكة أثناء تحميل المؤشرات.',
          networkRera: 'خطأ في الشبكة أثناء تحميل مؤشر ريرا.',
        },
        filters: {
          allZones: 'كل المناطق',
          premium: 'فاخر',
          prime: 'رئيسي',
          mid: 'متوسط السوق',
          affordable: 'ميسور',
          sortYield: 'ترتيب: العائد الإجمالي',
          sortPrice: 'ترتيب: السعر/قدم²',
          areas: 'مناطق',
        },
        table: {
          area: 'المنطقة',
          zone: 'الفئة',
          priceSqft: 'السعر/قدم² (درهم)',
          annualRent: 'متوسط الإيجار السنوي',
          grossYield: 'العائد الإجمالي',
          transactions: 'المعاملات',
          type: 'النوع',
          beds: 'غرف النوم',
          avgRent: 'متوسط الإيجار (درهم/سنوياً)',
          maxIncrease: 'الحد الأقصى للزيادة المسموحة',
        },
        loading: 'جارٍ التحميل…',
        indicators: {
          avgDaysOnMarket: 'متوسط أيام البقاء في السوق',
          days: 'يوماً',
          absorptionRate: 'معدل الامتصاص',
          absorptionNote: 'الوحدات المباعة / القوائم النشطة (%)',
          newListings: 'القوائم الجديدة',
          activeListings: 'القوائم النشطة',
          source: 'المصدر:',
          areasIncluded: 'مناطق مشمولة',
        },
        rera: {
          notice:
            '⚠️ استناداً إلى مؤشر الإيجارات من ريرا لعام 2024. يجب التحقق دائماً من بوابة ريرا الرسمية قبل إصدار النموذج 7 (إشعار زيادة الإيجار).',
          bands: ['<10%', '10-20%', '20-30%', '30-40%', '>40%'],
        },
      }
    : {
        title: 'Market Intelligence',
        subtitle: 'Dubai property price index, transaction data, and RERA rental index',
        tabs: {
          priceIndex: 'Price Index',
          indicators: 'Indicators',
          reraIndex: 'RERA Index',
          heatmap: 'Heatmap',
        },
        errors: {
          priceIndex: 'Failed to load price index.',
          indicators: 'Failed to load indicators.',
          rera: 'Failed to load RERA index.',
          networkPrice: 'Network error loading price index.',
          networkIndicators: 'Network error loading indicators.',
          networkRera: 'Network error loading RERA index.',
        },
        filters: {
          allZones: 'All Zones',
          premium: 'Premium',
          prime: 'Prime',
          mid: 'Mid-Market',
          affordable: 'Affordable',
          sortYield: 'Sort: Gross Yield',
          sortPrice: 'Sort: Price/sqft',
          areas: 'areas',
        },
        table: {
          area: 'Area',
          zone: 'Zone',
          priceSqft: 'Price/sqft (AED)',
          annualRent: 'Avg Annual Rent',
          grossYield: 'Gross Yield',
          transactions: 'Transactions',
          type: 'Type',
          beds: 'Beds',
          avgRent: 'Avg Rent (AED/yr)',
          maxIncrease: 'Max Allowed Increase',
        },
        loading: 'Loading…',
        indicators: {
          avgDaysOnMarket: 'Avg Days on Market',
          days: 'days',
          absorptionRate: 'Absorption Rate',
          absorptionNote: 'units sold / active listings (%)',
          newListings: 'New Listings',
          activeListings: 'Active Listings',
          source: 'Source:',
          areasIncluded: 'areas included',
        },
        rera: {
          notice:
            '⚠️ Based on RERA Rental Index 2024. Always verify with the official RERA portal before issuing Form 7 (Rent Increase Notice).',
          bands: ['<10%', '10-20%', '20-30%', '30-40%', '>40%'],
        },
      };

  return (
    <div
      dir={isRTL ? 'rtl' : 'ltr'}
      className={`min-h-screen bg-gray-950 text-gray-100 p-6 ${isRTL ? 'text-right' : ''}`}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-yellow-400">{content.title}</h1>
          <p className="text-gray-400 mt-1">{content.subtitle}</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-gray-800 p-1 rounded-xl w-fit">
          {(['price-index', 'indicators', 'rera-index', 'heatmap'] as Tab[]).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                activeTab === tab
                  ? 'bg-yellow-500 text-gray-900'
                  : 'text-gray-400 hover:text-gray-100'
              }`}
            >
              {tab === 'price-index'
                ? content.tabs.priceIndex
                : tab === 'indicators'
                  ? content.tabs.indicators
                  : tab === 'rera-index'
                    ? content.tabs.reraIndex
                    : content.tabs.heatmap}
            </button>
          ))}
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-900/50 border border-red-700 rounded-lg text-red-300">
            {error}
          </div>
        )}

        {/* Price Index Tab */}
        {activeTab === 'price-index' && (
          <div>
            <div className="flex gap-4 mb-4 items-center">
              <select
                value={zoneFilter}
                onChange={e => setZoneFilter(e.target.value)}
                className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-gray-100 text-sm"
                aria-label={content.table.zone}
              >
                <option value="">{content.filters.allZones}</option>
                <option value="premium">{content.filters.premium}</option>
                <option value="prime">{content.filters.prime}</option>
                <option value="mid">{content.filters.mid}</option>
                <option value="affordable">{content.filters.affordable}</option>
              </select>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as typeof sortBy)}
                className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-gray-100 text-sm"
                aria-label={isArabic ? 'ترتيب النتائج' : 'Sort results'}
              >
                <option value="grossYield">{content.filters.sortYield}</option>
                <option value="avgPricePerSqft">{content.filters.sortPrice}</option>
              </select>
              <span className="text-gray-500 text-sm">
                {formatNumber(sortedIndex.length)} {content.filters.areas}
              </span>
            </div>

            {loading ? (
              <div className="text-center py-12 text-gray-500">{content.loading}</div>
            ) : (
              <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-900 text-gray-400 text-xs">
                      <th className="px-4 py-3 text-left">{content.table.area}</th>
                      <th className="px-4 py-3 text-left">{content.table.zone}</th>
                      <th className="px-4 py-3 text-right">{content.table.priceSqft}</th>
                      <th className="px-4 py-3 text-right">{content.table.annualRent}</th>
                      <th className="px-4 py-3 text-right">{content.table.grossYield}</th>
                      <th className="px-4 py-3 text-right">{content.table.transactions}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {sortedIndex.map(row => (
                      <tr key={row.area} className="hover:bg-gray-700/40 transition">
                        <td className="px-4 py-3 font-medium">{row.area}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-2 py-0.5 rounded text-xs font-medium ${zoneBadge(row.zone)}`}
                          >
                            {zoneLabel(row.zone, isArabic)}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right text-yellow-400 font-semibold">
                          {formatNumber(row.avgPricePerSqft)}
                        </td>
                        <td className="px-4 py-3 text-right text-green-400">
                          {formatCurrency(row.avgAnnualRent)}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <span
                            className={`font-bold ${row.grossYield >= 7 ? 'text-green-400' : row.grossYield >= 5 ? 'text-yellow-400' : 'text-gray-400'}`}
                          >
                            {formatPercent(row.grossYield, 1)}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right text-gray-400">
                          {row.transactionVol ? formatNumber(row.transactionVol) : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Indicators Tab */}
        {activeTab === 'indicators' && (
          <div>
            {loading ? (
              <div className="text-center py-12 text-gray-500">{content.loading}</div>
            ) : indicators ? (
              <div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-gray-800 border border-gray-700 rounded-xl p-5 text-center">
                    <div className="text-gray-400 text-xs mb-2">
                      {content.indicators.avgDaysOnMarket}
                    </div>
                    <div className="text-3xl font-bold text-yellow-400">
                      {formatNumber(indicators.avgDaysOnMarket)}
                    </div>
                    <div className="text-gray-500 text-xs mt-1">{content.indicators.days}</div>
                  </div>
                  <div className="bg-gray-800 border border-gray-700 rounded-xl p-5 text-center">
                    <div className="text-gray-400 text-xs mb-2">
                      {content.indicators.absorptionRate}
                    </div>
                    <div className="text-3xl font-bold text-blue-400">
                      {formatPercent(indicators.absorptionRate, 1)}
                    </div>
                    <div className="text-gray-500 text-xs mt-1">
                      {content.indicators.absorptionNote}
                    </div>
                  </div>
                  <div className="bg-gray-800 border border-gray-700 rounded-xl p-5 text-center">
                    <div className="text-gray-400 text-xs mb-2">
                      {content.indicators.newListings}
                    </div>
                    <div className="text-3xl font-bold text-green-400">
                      {formatNumber(indicators.newListings)}
                    </div>
                  </div>
                  <div className="bg-gray-800 border border-gray-700 rounded-xl p-5 text-center">
                    <div className="text-gray-400 text-xs mb-2">
                      {content.indicators.activeListings}
                    </div>
                    <div className="text-3xl font-bold text-purple-400">
                      {formatNumber(indicators.activeListings)}
                    </div>
                  </div>
                </div>
                {indicators.note && (
                  <div className="p-4 bg-blue-900/30 border border-blue-700 rounded-lg text-blue-300 text-sm">
                    ℹ️ {indicators.note}
                  </div>
                )}
                <div className="mt-4 text-gray-500 text-xs">
                  {content.indicators.source} {indicators.source}
                  {indicators.areasIncluded &&
                    ` · ${formatNumber(indicators.areasIncluded)} ${content.indicators.areasIncluded}`}
                </div>
              </div>
            ) : null}
          </div>
        )}

        {/* RERA Index Tab */}
        {activeTab === 'rera-index' && (
          <div>
            {loading ? (
              <div className="text-center py-12 text-gray-500">{content.loading}</div>
            ) : (
              <div>
                <div className="mb-4 p-3 bg-yellow-900/30 border border-yellow-700 rounded-lg text-yellow-300 text-sm">
                  {content.rera.notice}
                </div>
                <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-900 text-gray-400 text-xs">
                        <th className="px-4 py-3 text-left">{content.table.area}</th>
                        <th className="px-4 py-3 text-left">{content.table.type}</th>
                        <th className="px-4 py-3 text-left">{content.table.beds}</th>
                        <th className="px-4 py-3 text-right">{content.table.avgRent}</th>
                        <th className="px-4 py-3 text-center" colSpan={5}>
                          {content.table.maxIncrease}
                        </th>
                      </tr>
                      <tr className="bg-gray-900 text-gray-500 text-xs">
                        <th colSpan={4} />
                        {content.rera.bands.map(band => (
                          <th key={band} className="px-2 py-1 text-center">
                            {band}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                      {reraIndex.map((r, i) => (
                        <tr key={i} className="hover:bg-gray-700/40">
                          <td className="px-4 py-3 font-medium">{r.area}</td>
                          <td className="px-4 py-3 text-gray-400">
                            {propertyTypeLabel(r.propertyType, isArabic)}
                          </td>
                          <td className="px-4 py-3 text-gray-400">{r.bedrooms}</td>
                          <td className="px-4 py-3 text-right text-yellow-400 font-semibold">
                            {formatCurrency(r.avgRentAed)}
                          </td>
                          <td className="px-2 py-3 text-center text-gray-400">
                            {r.allowedIncreaseBelow10Pct}
                          </td>
                          <td className="px-2 py-3 text-center text-yellow-400">
                            {r.allowedIncrease10to20Pct}
                          </td>
                          <td className="px-2 py-3 text-center text-orange-400">
                            {r.allowedIncrease20to30Pct}
                          </td>
                          <td className="px-2 py-3 text-center text-red-400">
                            {r.allowedIncrease30to40Pct}
                          </td>
                          <td className="px-2 py-3 text-center text-red-500">
                            {r.allowedIncreaseAbove40Pct}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Heatmap Tab */}
        {activeTab === 'heatmap' && (
          <div>
            {loading ? (
              <div className="text-center py-12 text-gray-500">{content.loading}</div>
            ) : (
              <div className="space-y-4">
                <div className="p-3 bg-blue-900/30 border border-blue-700 rounded-lg text-blue-300 text-sm">
                  {isArabic
                    ? 'خريطة حرارية تقريبية تعتمد على متوسط السعر لكل قدم مربعة بحسب المنطقة.'
                    : 'Approximate choropleth heatmap based on average price per sqft by area.'}
                </div>
                <MarketChoroplethMap rows={sortedIndex} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
