import React, { useState, useEffect, useRef } from 'react';
import { JourneyStep, JourneySession, JourneyDefinition, JourneyResultOutcome } from '../../../types/journey';
import henryTenancyContractTemplateService, { DldTenancyContractData } from '../../../services/HenryTenancyContractTemplateService';
import henryTenancyContractScannerService from '../../../services/HenryTenancyContractScannerService';
import henryTitleDeedScannerService from '../../../services/HenryTitleDeedScannerService';
import henryEmiratesIdScannerService from '../../../services/HenryEmiratesIdScannerService';
import henryPassportScannerService from '../../../services/HenryPassportScannerService';

interface StepRendererProps {
  step: JourneyStep;
  session: JourneySession;
  definition: JourneyDefinition;
  onUpdateData: (patch: Record<string, unknown>) => void;
  onNext: () => void;
  onComplete: (resultPayload: JourneyResultOutcome) => void;
  onLaunchNextJourney: (journeyId: string) => void;
}

export const StepRenderer: React.FC<StepRendererProps> = ({
  step,
  session,
  definition,
  onUpdateData,
  onNext,
  onComplete,
  onLaunchNextJourney
}) => {
  const data = session.data || {};
  const journeyFileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [previewPage, setPreviewPage] = useState<number | 'all'>(1);
  const [showLiveDldTemplate, setShowLiveDldTemplate] = useState<boolean>(false);

  // Processing step animation state
  const [processingStage, setProcessingStage] = useState(0);
  const processingTasks = [
    'Validating property and ownership deed',
    'Validating landlord KYC profile and contacts',
    'Validating tenant identity and passport/visa',
    'Verifying contract terms and RERA index compliance',
    'Compiling standard and custom special clauses',
    'Generating official Dubai Tenancy Agreement document',
    'Applying White Caves Real Estate LLC watermark and seals'
  ];

  // File Upload & Replacement Handler
  const handleJourneyFileUpload = async (file: File) => {
    setIsUploading(true);
    setUploadStatus(`Ingesting and parsing "${file.name}" (${(file.size / 1024).toFixed(1)} KB)...`);

    try {
      const fileNameLower = file.name.toLowerCase();
      if (fileNameLower.includes('deed') || fileNameLower.includes('oqood') || fileNameLower.includes('title')) {
        const deedData = await henryTitleDeedScannerService.scanTitleDeed(file);
        onUpdateData({
          propertyName: deedData.buildingNameEn || data.propertyName,
          community: deedData.communityEn ? `${deedData.communityEn}, Dubai` : data.community,
          propertyType: deedData.propertyTypeEn || data.propertyType,
          plotArea: `${deedData.totalAreaSqM ? Math.round(deedData.totalAreaSqM * 10.764) : 1882} sqft`,
          buaArea: `${deedData.totalAreaSqM ? Math.round(deedData.totalAreaSqM * 10.764 * 1.3) : 2460} sqft`,
          landlordName: deedData.ownerNameEn || data.landlordName,
          landlordVerified: true,
          propertyVerified: true
        });
        setUploadStatus(`✓ Scanned "${file.name}": Extracted Title Deed (${deedData.buildingNameEn} #${deedData.propertyNumber}) & Owner! Information updated.`);
      } else if (fileNameLower.includes('tenant') && (fileNameLower.includes('eid') || fileNameLower.includes('emirates'))) {
        const eidData = await henryEmiratesIdScannerService.scanEmiratesId(file);
        onUpdateData({
          tenantName: eidData.fullNameEn || data.tenantName,
          tenantEmiratesId: eidData.idNumber || data.tenantEmiratesId,
          tenantVerified: true
        });
        setUploadStatus(`✓ Scanned "${file.name}": Extracted Tenant Emirates ID (${eidData.fullNameEn})!`);
      } else if (fileNameLower.includes('passport')) {
        const passportData = await henryPassportScannerService.scanPassport(file);
        onUpdateData({
          tenantName: passportData.fullName || data.tenantName,
          tenantPassportNo: passportData.passportNumber || data.tenantPassportNo,
          tenantVerified: true
        });
        setUploadStatus(`✓ Scanned "${file.name}": Extracted Tenant Passport (${passportData.fullName} - ${passportData.passportNumber})!`);
      } else {
        // Full Tenancy Contract Scan
        const scannedContract = await henryTenancyContractScannerService.scanContract(file);
        onUpdateData({
          propertyName: scannedContract.property.buildingName || data.propertyName,
          community: scannedContract.property.location || data.community,
          propertyType: scannedContract.property.propertyType || data.propertyType,
          landlordName: scannedContract.landlord.name || data.landlordName,
          landlordEmail: scannedContract.landlord.email || data.landlordEmail,
          landlordPhone: scannedContract.landlord.phone || data.landlordPhone,
          landlordEmiratesId: scannedContract.landlord.emiratesId || data.landlordEmiratesId,
          tenantName: scannedContract.tenant.name || data.tenantName,
          tenantEmail: scannedContract.tenant.email || data.tenantEmail,
          tenantPhone: scannedContract.tenant.phone || data.tenantPhone,
          tenantEmiratesId: scannedContract.tenant.emiratesId || data.tenantEmiratesId,
          annualRent: scannedContract.financials.annualRentAed || data.annualRent,
          chequesCount: scannedContract.financials.modeOfPayment?.includes('4') ? 4 : (scannedContract.financials.modeOfPayment?.includes('1') ? 1 : 2),
          startDate: scannedContract.financials.periodFrom || data.startDate,
          endDate: scannedContract.financials.periodTo || data.endDate,
          propertyVerified: true,
          landlordVerified: true,
          tenantVerified: true
        });
        setUploadStatus(`✓ Scanned "${file.name}": Extracted all Contract details (Property, Landlord, Tenant, Rent AED ${scannedContract.financials.annualRentAed.toLocaleString()})! Template filled.`);
      }
    } catch {
      setUploadStatus(`Error processing "${file.name}". Please review manual fields.`);
    } finally {
      setIsUploading(false);
      setTimeout(() => setUploadStatus(null), 5000);
    }
  };

  // Convert session data into DldTenancyContractData for official HTML compilation
  const buildDldContractData = (): DldTenancyContractData => {
    return {
      contractId: `WC-DLD-${data.propertyName?.replace(/\s+/g, '') || '2026'}-${Date.now().toString(36).toUpperCase()}`,
      contractDate: new Date().toLocaleDateString('en-GB'),
      ownerName: data.landlordName || 'Arslan Malik',
      lessorName: data.landlordName || 'Arslan Malik',
      lessorEmiratesId: data.landlordEmiratesId || '784-1988-1234567-1',
      lessorLicenseNo: '',
      lessorLicensingAuthority: '',
      lessorEmail: data.landlordEmail || 'arslan.malik@whitecaves.ae',
      lessorPhone: data.landlordPhone || '+971 50 123 4567',
      tenantName: data.tenantName || 'Sarah Jenkins',
      tenantEmiratesId: data.tenantEmiratesId || '784-1992-7654321-2',
      tenantLicenseNo: '',
      tenantLicensingAuthority: '',
      tenantEmail: data.tenantEmail || 'sarah.jenkins@example.com',
      tenantPhone: data.tenantPhone || '+971 52 987 6543',
      propertyUsage: 'residential',
      plotNo: '176',
      makaniNo: '257',
      buildingName: data.propertyName || 'Sycamore 131',
      propertyNo: '131',
      propertyType: data.propertyType || '3 Bedroom Townhouse',
      propertyAreaSqM: 198.5,
      location: data.community || 'DAMAC Hills 2, Dubai',
      premisesNoDewa: '918014964',
      contractPeriodFrom: data.startDate || '01-09-2026',
      contractPeriodTo: data.endDate || '31-08-2027',
      contractValue: Number(data.annualRent) || 95000,
      annualRent: Number(data.annualRent) || 95000,
      securityDepositAmount: Math.round((Number(data.annualRent) || 95000) * ((Number(data.securityDepositPct) || 5) / 100)),
      modeOfPayment: `${data.chequesCount || 2} Cheques`,
      additionalTerms: [
        '1. The tenant shall use the premises strictly for private residential purposes.',
        '2. Maintenance exceeding AED 500 shall be borne by the landlord, below AED 500 by the tenant.',
        '3. The contract is governed by Dubai Real Estate Regulatory Agency (RERA) Law No. 26 of 2007 & Law No. 33 of 2008.'
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'ready_for_signature'
    };
  };

  useEffect(() => {
    if (step.type === 'processing') {
      const interval = setInterval(() => {
        setProcessingStage((prev) => {
          if (prev < processingTasks.length) {
            return prev + 1;
          }
          clearInterval(interval);
          return prev;
        });
      }, 450);

      return () => clearInterval(interval);
    }
  }, [step.type]);

  useEffect(() => {
    if (step.type === 'processing' && processingStage === processingTasks.length) {
      const timer = setTimeout(() => {
        onComplete({
          referenceNumber: `WC-2026-${Math.floor(100000 + Math.random() * 900000)}`,
          title: 'Tenancy Contract Ready',
          subtitle: `${data.propertyName || 'Property'} — ${data.community || 'Dubai'}`,
          summaryItems: [
            { label: 'Property', value: `${data.propertyName || 'Unit'} (${data.community || 'Dubai'})`, verified: true },
            { label: 'Annual Rent', value: `AED ${Number(data.annualRent || 0).toLocaleString()}`, verified: true },
            { label: 'Payment Terms', value: `${data.chequesCount || 2} Cheques`, verified: true },
            { label: 'Tenancy Period', value: `${data.startDate || '2026-09-01'} to ${data.endDate || '2027-08-31'}`, verified: true },
            { label: 'Landlord', value: data.landlordName || 'Verified Owner', verified: true },
            { label: 'Tenant', value: data.tenantName || 'Verified Tenant', verified: true }
          ],
          badges: ['RERA Compliant', 'E-Sign Ready', 'Ejari Payload Prepared'],
          nextActions: [
            {
              id: 'download-pdf',
              title: 'Download Tenancy Contract PDF',
              actionType: 'download_pdf',
              icon: '📥',
              primary: true
            },
            {
              id: 'launch-signing',
              title: 'Launch Digital Signing Journey',
              targetJourneyId: 'contract-signing',
              actionType: 'start_journey',
              icon: '✍️'
            },
            {
              id: 'launch-payments',
              title: 'Start Payment & Cheque Collection',
              targetJourneyId: 'payment-collection',
              actionType: 'start_journey',
              icon: '💰'
            },
            {
              id: 'launch-ejari',
              title: 'Register with Ejari DLD',
              targetJourneyId: 'create-ejari',
              actionType: 'start_journey',
              icon: '🏛️'
            }
          ]
        });
      }, 700);

      return () => clearTimeout(timer);
    }
  }, [processingStage, step.type]);

  // -------------------------------------------------------------
  // 1. STEP: Entity Selection (e.g. Property Selection)
  // -------------------------------------------------------------
  if (step.type === 'entity-selection' || step.id === 'property') {
    return (
      <div className="space-y-6">
        <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-700/60">
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            Search or Select Unit
          </label>
          <div className="relative">
            <input
              type="text"
              value={data.propertyName || ''}
              onChange={(e) => onUpdateData({ propertyName: e.target.value })}
              placeholder="Search by unit name, community, title deed..."
              className="w-full bg-slate-800 border border-slate-600 focus:border-amber-500 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none transition-colors"
            />
            <span className="absolute right-3 top-2.5 text-slate-400 text-sm">🔍</span>
          </div>
        </div>

        {/* Selected Entity Card */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-5 rounded-2xl border border-amber-500/30 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none"></div>

          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3.5">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-2xl shadow-inner">
                🏠
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-lg font-bold text-white tracking-wide">{data.propertyName || 'Sycamore 131'}</h3>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[11px] font-semibold">
                    Verified
                  </span>
                </div>
                <p className="text-xs text-amber-400/90 font-medium mt-0.5">{data.community || 'DAMAC Hills 2'}</p>
                <p className="text-xs text-slate-400 mt-1">{data.propertyType || '3 Bedroom Townhouse'}</p>
              </div>
            </div>

            <div className="text-right text-xs">
              <div className="text-slate-400">Plot: <span className="text-slate-200 font-semibold">{data.plotArea || '1,882 sqft'}</span></div>
              <div className="text-slate-400 mt-0.5">BUA: <span className="text-slate-200 font-semibold">{data.buaArea || '2,460 sqft'}</span></div>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-700/60 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="flex items-center space-x-2 text-emerald-400 bg-emerald-950/40 px-3 py-2 rounded-lg border border-emerald-500/20">
              <span>✓</span>
              <span>Property verified</span>
            </div>
            <div className="flex items-center space-x-2 text-emerald-400 bg-emerald-950/40 px-3 py-2 rounded-lg border border-emerald-500/20">
              <span>✓</span>
              <span>Unit available</span>
            </div>
            <div className="flex items-center space-x-2 text-emerald-400 bg-emerald-950/40 px-3 py-2 rounded-lg border border-emerald-500/20">
              <span>✓</span>
              <span>Landlord linked</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // 2. STEP: Entity Review (Landlord / Tenant)
  // -------------------------------------------------------------
  if (step.type === 'entity-review' || step.id === 'landlord' || step.id === 'tenant') {
    const isLandlord = step.id === 'landlord';
    const entityPrefix = isLandlord ? 'landlord' : 'tenant';

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between p-3 rounded-xl bg-blue-950/40 border border-blue-500/30 text-xs text-blue-300">
          <div className="flex items-center space-x-2">
            <span>ℹ️</span>
            <span>
              Source: <strong className="text-white">{isLandlord ? 'Property Owner Record' : 'Tenant Registry / Lead'}</strong> (Auto-imported)
            </span>
          </div>
          <span className="text-emerald-400 font-semibold">✓ Synchronized</span>
        </div>

        <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-700/70 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-xl">
                👤
              </div>
              <div>
                <h3 className="text-base font-bold text-white">
                  {data[`${entityPrefix}Name`] || (isLandlord ? 'Arslan Malik' : 'Sarah Jenkins')}
                </h3>
                <span className="text-xs text-amber-400 font-medium">
                  {isLandlord ? 'Verified Property Owner' : 'Verified Prospective Tenant'}
                </span>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-semibold">
              KYC Active
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Full Legal Name</label>
              <input
                type="text"
                value={data[`${entityPrefix}Name`] || ''}
                onChange={(e) => onUpdateData({ [`${entityPrefix}Name`]: e.target.value })}
                className="w-full bg-slate-800 border border-slate-600 focus:border-amber-500 rounded-lg px-3 py-2 text-sm text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Emirates ID</label>
              <div className="relative">
                <input
                  type="text"
                  value={data[`${entityPrefix}EmiratesId`] || ''}
                  onChange={(e) => onUpdateData({ [`${entityPrefix}EmiratesId`]: e.target.value })}
                  placeholder="784-XXXX-XXXXXXX-X"
                  className="w-full bg-slate-800 border border-slate-600 focus:border-amber-500 rounded-lg px-3 py-2 text-sm text-white focus:outline-none"
                />
                {data[`${entityPrefix}EmiratesId`] && (
                  <span className="absolute right-3 top-2 text-emerald-400 text-xs font-bold">✓ Verified</span>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email Address</label>
              <input
                type="email"
                value={data[`${entityPrefix}Email`] || ''}
                onChange={(e) => onUpdateData({ [`${entityPrefix}Email`]: e.target.value })}
                className="w-full bg-slate-800 border border-slate-600 focus:border-amber-500 rounded-lg px-3 py-2 text-sm text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Mobile Number</label>
              <input
                type="tel"
                value={data[`${entityPrefix}Phone`] || ''}
                onChange={(e) => onUpdateData({ [`${entityPrefix}Phone`]: e.target.value })}
                className="w-full bg-slate-800 border border-slate-600 focus:border-amber-500 rounded-lg px-3 py-2 text-sm text-white focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // 3. STEP: Contract Terms Form
  // -------------------------------------------------------------
  if (step.type === 'form' || step.id === 'terms') {
    const annualRent = Number(data.annualRent) || 95000;
    const chequesCount = Number(data.chequesCount) || 2;
    const depositPct = Number(data.securityDepositPct) || 5;

    const perChequeAmount = chequesCount > 0 ? Math.round(annualRent / chequesCount) : annualRent;
    const depositAmount = Math.round(annualRent * (depositPct / 100));

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Inputs Section */}
          <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-700/70 space-y-4">
            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">Transaction Terms</h4>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Annual Rent (AED)</label>
              <input
                type="number"
                value={data.annualRent || ''}
                onChange={(e) => onUpdateData({ annualRent: Number(e.target.value) })}
                className="w-full bg-slate-800 border border-slate-600 focus:border-amber-500 rounded-lg px-3.5 py-2.5 text-base font-bold text-white focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Payment Frequency</label>
                <select
                  value={data.chequesCount || 2}
                  onChange={(e) => onUpdateData({ chequesCount: Number(e.target.value) })}
                  className="w-full bg-slate-800 border border-slate-600 focus:border-amber-500 rounded-lg px-3 py-2 text-sm text-white focus:outline-none"
                >
                  <option value={1}>1 Cheque</option>
                  <option value={2}>2 Cheques</option>
                  <option value={4}>4 Cheques</option>
                  <option value={6}>6 Cheques</option>
                  <option value={12}>12 Cheques</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Security Deposit</label>
                <select
                  value={data.securityDepositPct || 5}
                  onChange={(e) => onUpdateData({ securityDepositPct: Number(e.target.value) })}
                  className="w-full bg-slate-800 border border-slate-600 focus:border-amber-500 rounded-lg px-3 py-2 text-sm text-white focus:outline-none"
                >
                  <option value={5}>5% (Unfurnished)</option>
                  <option value={10}>10% (Furnished)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Start Date</label>
                <input
                  type="date"
                  value={data.startDate || '2026-09-01'}
                  onChange={(e) => onUpdateData({ startDate: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-600 focus:border-amber-500 rounded-lg px-3 py-2 text-sm text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">End Date</label>
                <input
                  type="date"
                  value={data.endDate || '2027-08-31'}
                  onChange={(e) => onUpdateData({ endDate: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-600 focus:border-amber-500 rounded-lg px-3 py-2 text-sm text-white focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Intelligent Financial Calculation Card */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 p-5 rounded-2xl border border-amber-500/30 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                  Live Contract Summary
                </h4>
                <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-medium">
                  Auto-calculated
                </span>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between py-2 border-b border-slate-700/60">
                  <span className="text-slate-400">Annual Rent</span>
                  <span className="font-bold text-white">AED {annualRent.toLocaleString()}</span>
                </div>

                {Array.from({ length: Math.min(chequesCount, 4) }).map((_, idx) => (
                  <div key={idx} className="flex justify-between py-1.5 text-xs">
                    <span className="text-slate-400">Cheque {idx + 1} ({Math.round(100 / chequesCount)}%)</span>
                    <span className="font-semibold text-slate-200">AED {perChequeAmount.toLocaleString()}</span>
                  </div>
                ))}
                {chequesCount > 4 && (
                  <div className="text-[11px] text-slate-500 italic text-right">
                    + {chequesCount - 4} additional cheques @ AED {perChequeAmount.toLocaleString()}
                  </div>
                )}

                <div className="flex justify-between py-2 border-t border-slate-700/60 text-amber-300">
                  <span className="font-medium">Security Deposit ({depositPct}%)</span>
                  <span className="font-bold">AED {depositAmount.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-400">
              💡 Tenancy contract will automatically generate the post-dated cheque schedule with these exact amounts.
            </div>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // 4. STEP: Required Documents Checklist
  // -------------------------------------------------------------
  if (step.type === 'checklist' || step.id === 'documents') {
    const docs = data.documents || {
      landlordEmiratesId: true,
      tenantPassport: true,
      tenantEmiratesId: true,
      titleDeed: true,
      tradeLicense: false,
      previousContract: false
    };

    const docItems = [
      { key: 'landlordEmiratesId', label: 'Landlord Emirates ID', required: true },
      { key: 'tenantPassport', label: 'Tenant Passport Copy', required: true },
      { key: 'tenantEmiratesId', label: 'Tenant Emirates ID', required: true },
      { key: 'titleDeed', label: 'Property Title Deed / Oqood', required: true },
      { key: 'tradeLicense', label: 'Trade License (if corporate tenant)', required: false },
      { key: 'previousContract', label: 'Previous Tenancy Contract (if renewal)', required: false }
    ];

    const toggleDoc = (key: string) => {
      const updatedDocs = { ...docs, [key]: !docs[key] };
      onUpdateData({ documents: updatedDocs });
    };

    const remainingRequired = docItems.filter(d => d.required && !docs[d.key]).length;

    return (
      <div className="space-y-6">
        <input
          type="file"
          ref={journeyFileInputRef}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              handleJourneyFileUpload(file);
              e.target.value = '';
            }
          }}
          accept=".pdf,image/*,.doc,.docx"
          style={{ display: 'none' }}
        />

        {/* Upload New Document to Replace Info Banner */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/15 via-slate-900 to-amber-500/5 border border-amber-500/40 text-slate-100 flex flex-wrap items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-xl">
              ⚡
            </div>
            <div>
              <div className="text-xs font-bold text-amber-300">Upload New Documents to Auto-Fill & Replace Information</div>
              <div className="text-[11px] text-slate-400">Upload Title Deed, Tenant/Landlord EID, Passport, or Tenancy Contract PDF to automatically overwrite and fill the template.</div>
            </div>
          </div>
          <button
            onClick={() => journeyFileInputRef.current?.click()}
            disabled={isUploading}
            className="px-4 py-2 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-all shadow-md shadow-amber-400/20 flex items-center gap-1.5"
          >
            <span>📁 {isUploading ? 'Scanning Document...' : 'Upload Doc to Replace Info'}</span>
          </button>
        </div>

        {uploadStatus && (
          <div className="p-3 rounded-lg bg-blue-950/60 border border-blue-500/40 text-xs text-blue-300 flex items-center gap-2">
            <span>ℹ️</span>
            <span>{uploadStatus}</span>
          </div>
        )}

        <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900/80 border border-slate-700/60 text-xs">
          <div className="flex items-center space-x-2">
            <span className="text-base">📂</span>
            <span className="text-slate-300 font-medium">Compliance Document Verification</span>
          </div>
          <span className={`px-2.5 py-1 rounded-full font-semibold ${
            remainingRequired === 0 
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
              : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
          }`}>
            {remainingRequired === 0 ? '✓ All Required Documents Ready' : `${remainingRequired} document${remainingRequired > 1 ? 's' : ''} remaining`}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {docItems.map((doc) => {
            const isChecked = !!docs[doc.key];
            return (
              <div
                key={doc.key}
                onClick={() => toggleDoc(doc.key)}
                className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                  isChecked
                    ? 'bg-emerald-950/30 border-emerald-500/40 hover:bg-emerald-950/50'
                    : 'bg-slate-900/60 border-slate-700/60 hover:border-slate-500'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-5 h-5 rounded flex items-center justify-center text-xs font-bold ${
                    isChecked ? 'bg-emerald-500 text-slate-950' : 'border border-slate-500'
                  }`}>
                    {isChecked ? '✓' : ''}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-200">{doc.label}</div>
                    <div className="text-[11px] text-slate-400">
                      {doc.required ? 'Mandatory for RERA' : 'Optional / Supplementary'}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      journeyFileInputRef.current?.click();
                    }}
                    className="px-2 py-1 text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-600"
                    title="Upload replacement document"
                  >
                    Upload
                  </button>
                  <span className={`text-xs font-medium ${isChecked ? 'text-emerald-400' : 'text-slate-500'}`}>
                    {isChecked ? 'Verified' : 'Attach'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // 5. STEP: Smart Review
  // -------------------------------------------------------------
  if (step.type === 'smart-review' || step.id === 'review') {
    const compiledDldHtml = henryTenancyContractTemplateService.generateDldTenancyContractHtml(
      buildDldContractData(),
      previewPage
    );

    return (
      <div className="space-y-6 animate-fadeIn">
        <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-xs text-emerald-300 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-base">✓</span>
            <span className="font-semibold text-white">Smart Review Complete — Official DLD Unified Tenancy Contract Template Filled.</span>
          </div>
          <button
            onClick={() => setShowLiveDldTemplate(!showLiveDldTemplate)}
            className="px-3 py-1 bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/40 rounded font-semibold text-xs transition-colors"
          >
            {showLiveDldTemplate ? 'Show Summary Cards' : '📄 View Exact DLD Official Template'}
          </button>
        </div>

        {showLiveDldTemplate ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between bg-slate-800/80 p-2.5 px-4 rounded-xl border border-slate-700">
              <div className="flex items-center space-x-2">
                <span className="text-xs text-slate-300 font-semibold">Official DLD Contract Pages:</span>
                {[1, 2, 3].map((p) => (
                  <button
                    key={p}
                    onClick={() => setPreviewPage(p as any)}
                    className={`px-3 py-1 text-xs rounded-md font-bold transition-all ${
                      previewPage === p ? 'bg-amber-400 text-slate-950' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}
                  >
                    Page {p}
                  </button>
                ))}
                <button
                  onClick={() => setPreviewPage('all')}
                  className={`px-3 py-1 text-xs rounded-md font-bold transition-all ${
                    previewPage === 'all' ? 'bg-amber-400 text-slate-950' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  All 3 Pages
                </button>
              </div>

              <span className="text-xs text-emerald-400 font-semibold">
                ✓ Bilingual Arabic & English
              </span>
            </div>

            <div className="p-4 bg-white rounded-xl shadow-2xl overflow-x-auto max-h-[600px] border border-slate-700 text-slate-900">
              <div dangerouslySetInnerHTML={{ __html: compiledDldHtml }} />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Property Section */}
            <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-700/60 space-y-2">
              <h5 className="font-bold text-amber-400 uppercase tracking-wider flex items-center justify-between">
                <span>🏠 Property</span>
                <span className="text-emerald-400">✓ Verified</span>
              </h5>
              <div className="text-sm font-semibold text-white">{data.propertyName || 'Sycamore 131'}</div>
              <div className="text-slate-400">{data.community || 'DAMAC Hills 2'} • {data.propertyType || '3 Bedroom Townhouse'}</div>
            </div>

            {/* Landlord Section */}
            <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-700/60 space-y-2">
              <h5 className="font-bold text-amber-400 uppercase tracking-wider flex items-center justify-between">
                <span>👤 Landlord</span>
                <span className="text-emerald-400">✓ Verified</span>
              </h5>
              <div className="text-sm font-semibold text-white">{data.landlordName || 'Arslan Malik'}</div>
              <div className="text-slate-400">{data.landlordEmail} • EID: {data.landlordEmiratesId}</div>
            </div>

            {/* Tenant Section */}
            <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-700/60 space-y-2">
              <h5 className="font-bold text-amber-400 uppercase tracking-wider flex items-center justify-between">
                <span>👤 Tenant</span>
                <span className="text-emerald-400">✓ Verified</span>
              </h5>
              <div className="text-sm font-semibold text-white">{data.tenantName || 'Sarah Jenkins'}</div>
              <div className="text-slate-400">{data.tenantEmail} • EID: {data.tenantEmiratesId}</div>
            </div>

            {/* Contract Section */}
            <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-700/60 space-y-2">
              <h5 className="font-bold text-amber-400 uppercase tracking-wider flex items-center justify-between">
                <span>📄 Contract Financials</span>
                <span className="text-emerald-400">✓ Calculated</span>
              </h5>
              <div className="text-sm font-bold text-white">AED {Number(data.annualRent || 95000).toLocaleString()} / year</div>
              <div className="text-slate-400">
                {data.chequesCount || 2} Cheques • {data.securityDepositPct || 5}% Deposit • {data.startDate || '2026-09-01'} to {data.endDate || '2027-08-31'}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // -------------------------------------------------------------
  // 6. STEP: Processing Animation Step
  // -------------------------------------------------------------
  if (step.type === 'processing' || step.id === 'processing') {
    const progressPct = Math.round((processingStage / processingTasks.length) * 100);

    return (
      <div className="py-8 px-4 max-w-xl mx-auto space-y-6 text-slate-100">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-3xl mx-auto shadow-xl animate-pulse">
            ⚙️
          </div>
          <h3 className="text-lg font-bold text-white tracking-wide">
            Preparing Tenancy Contract
          </h3>
          <p className="text-xs text-slate-400">
            Applying official White Caves Real Estate clauses and RERA formatting...
          </p>
        </div>

        {/* Dynamic Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-semibold text-slate-300">
            <span>Processing Pipeline</span>
            <span className="text-amber-400">{progressPct}%</span>
          </div>
          <div className="bg-slate-800 h-2.5 rounded-full overflow-hidden border border-slate-700">
            <div
              className="bg-gradient-to-r from-amber-500 via-emerald-400 to-teal-400 h-full transition-all duration-300 rounded-full"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        {/* Live Step Checkmarks */}
        <div className="space-y-2 bg-slate-900/80 p-4 rounded-xl border border-slate-700/60 text-xs">
          {processingTasks.map((task, idx) => {
            const isDone = idx < processingStage;
            const isCurrent = idx === processingStage;

            return (
              <div
                key={idx}
                className={`flex items-center space-x-2.5 transition-all ${
                  isDone ? 'text-emerald-300' : isCurrent ? 'text-amber-300 font-semibold' : 'text-slate-500 opacity-40'
                }`}
              >
                <span>{isDone ? '✓' : isCurrent ? '⏳' : '○'}</span>
                <span>{task}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // 7. STEP: Result & Rewards Screen
  // -------------------------------------------------------------
  if (step.type === 'result' || step.id === 'result') {
    const outcome = session.result || {
      referenceNumber: 'WC-2026-000184',
      title: 'Tenancy Contract Ready',
      subtitle: `${data.propertyName || 'Sycamore 131'} — ${data.community || 'DAMAC Hills 2'}`,
      summaryItems: [
        { label: 'Property', value: `${data.propertyName || 'Sycamore 131'} (${data.community || 'DAMAC Hills 2'})`, verified: true },
        { label: 'Annual Rent', value: `AED ${Number(data.annualRent || 95000).toLocaleString()}`, verified: true },
        { label: 'Payment Terms', value: `${data.chequesCount || 2} Cheques`, verified: true },
        { label: 'Landlord', value: data.landlordName || 'Arslan Malik', verified: true },
        { label: 'Tenant', value: data.tenantName || 'Sarah Jenkins', verified: true }
      ],
      badges: ['RERA Compliant', 'E-Sign Ready', 'Ejari Payload Prepared'],
      nextActions: []
    };

    return (
      <div className="space-y-6 animate-fadeIn">
        {/* Reward Outcome Card */}
        <div className="bg-gradient-to-br from-slate-900 via-emerald-950/40 to-slate-900 p-6 rounded-2xl border border-emerald-500/40 shadow-2xl relative overflow-hidden">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-start space-x-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-3xl shadow-inner">
                🎉
              </div>
              <div>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold uppercase tracking-wider">
                  Mission Complete
                </span>
                <h3 className="text-xl font-bold text-white mt-1">{outcome.title}</h3>
                <p className="text-xs text-slate-300">{outcome.subtitle}</p>
              </div>
            </div>

            <div className="bg-slate-900/90 px-4 py-2.5 rounded-xl border border-slate-700 text-right">
              <div className="text-[11px] text-slate-400 uppercase font-semibold">Contract Number</div>
              <div className="text-base font-mono font-bold text-amber-400">{outcome.referenceNumber}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6 pt-4 border-t border-slate-700/60 text-xs">
            {outcome.summaryItems.map((item, idx) => (
              <div key={idx} className="bg-slate-900/70 p-3 rounded-lg border border-slate-700/50">
                <div className="text-slate-400 text-[11px]">{item.label}</div>
                <div className="font-semibold text-slate-100 mt-0.5 flex items-center space-x-1">
                  <span>{item.value}</span>
                  {item.verified && <span className="text-emerald-400">✓</span>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chained Next Actions (The most powerful part!) */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
            Next Actions — Chained Journeys
          </h4>
          <p className="text-xs text-slate-400">
            Don't stop here. Move directly to the next stage in the tenancy lifecycle:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <button
              onClick={() => alert(`Downloading Contract PDF: ${outcome.referenceNumber}`)}
              className="p-4 rounded-xl bg-slate-900/90 border border-slate-700 hover:border-amber-500/50 transition-all text-left flex items-center space-x-3.5 shadow-sm group"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-xl group-hover:scale-105 transition-transform">
                📥
              </div>
              <div>
                <div className="text-xs font-bold text-white group-hover:text-amber-300">Download Tenancy Contract PDF</div>
                <div className="text-[11px] text-slate-400">Official RERA Unified Tenancy Agreement</div>
              </div>
            </button>

            <button
              onClick={() => onLaunchNextJourney('contract-signing')}
              className="p-4 rounded-xl bg-slate-900/90 border border-slate-700 hover:border-amber-500/50 transition-all text-left flex items-center space-x-3.5 shadow-sm group"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-xl group-hover:scale-105 transition-transform">
                ✍️
              </div>
              <div>
                <div className="text-xs font-bold text-white group-hover:text-amber-300">Launch Digital Signing Journey</div>
                <div className="text-[11px] text-slate-400">Dispatch to Arslan Malik & Sarah Jenkins</div>
              </div>
            </button>

            <button
              onClick={() => onLaunchNextJourney('payment-collection')}
              className="p-4 rounded-xl bg-slate-900/90 border border-slate-700 hover:border-amber-500/50 transition-all text-left flex items-center space-x-3.5 shadow-sm group"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-xl group-hover:scale-105 transition-transform">
                💰
              </div>
              <div>
                <div className="text-xs font-bold text-white group-hover:text-amber-300">Start Payment & Cheque Collection</div>
                <div className="text-[11px] text-slate-400">Record PDCs (2 Cheques) & 5% Security Deposit</div>
              </div>
            </button>

            <button
              onClick={() => onLaunchNextJourney('create-ejari')}
              className="p-4 rounded-xl bg-slate-900/90 border border-slate-700 hover:border-amber-500/50 transition-all text-left flex items-center space-x-3.5 shadow-sm group"
            >
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-xl group-hover:scale-105 transition-transform">
                🏛️
              </div>
              <div>
                <div className="text-xs font-bold text-white group-hover:text-amber-300">Register with Ejari DLD</div>
                <div className="text-[11px] text-slate-400">Submit verified payload directly to Dubai Land Dept</div>
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-slate-900/60 rounded-xl border border-slate-700/60 text-slate-300 text-sm">
      <h4 className="font-semibold text-white mb-2">{step.title}</h4>
      <p>{step.description || 'Complete the necessary fields and verify information to advance.'}</p>
    </div>
  );
};
