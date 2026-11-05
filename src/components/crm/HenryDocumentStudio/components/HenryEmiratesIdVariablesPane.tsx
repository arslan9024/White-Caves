import React, { FC } from 'react';
import {
  ShieldCheck,
  CreditCard,
  Calendar,
  Flag,
  User,
  Briefcase,
  Building,
  MapPin,
  Clock,
  ExternalLink,
  Trash2,
  Save,
  CheckCircle2,
  FileText,
  AlertCircle,
  CheckCheck,
} from 'lucide-react';
import {
  RightVariablesPane,
  VariableSectionCard,
  MrzTerminal,
  ActionButton,
} from '../styles/HenryEmiratesIdScannerView.style';
import { EmiratesIdExtractedData } from '../../../../services/HenryEmiratesIdScannerService';
import { canUseScan, scanExpiry } from '../../../../services/henryScanReview';

export interface HenryEmiratesIdVariablesPaneProps {
  extractedData: EmiratesIdExtractedData;
  isScanning: boolean;
  handleUpdateField: (field: keyof EmiratesIdExtractedData, value: string) => void;
  handleAutoFillAsTenant: () => void;
  handleAutoFillAsLandlord: () => void;
  handleDiscard: () => void;
  handleSaveToVault: () => Promise<void>;
}

export const HenryEmiratesIdVariablesPane: FC<HenryEmiratesIdVariablesPaneProps> = ({
  extractedData,
  isScanning,
  handleUpdateField,
  handleAutoFillAsTenant,
  handleAutoFillAsLandlord,
  handleDiscard,
  handleSaveToVault,
}) => {
  return (
    <RightVariablesPane>
      {/* SECTION 1: IDENTITY & CARD NUMBERS */}
      <VariableSectionCard>
        <div className="card-top">
          <span className="section-title">
            <ShieldCheck size={14} color="#EF4444" /> 1. Identity & Card Numbers
          </span>
          <span className="match-badge">
            <CheckCheck size={13} /> OCR candidate — check original
          </span>
        </div>
        <div className="value-row">
          <div className="field-box">
            <label>
              Emirates ID Number <span className="ar">رقم الهوية</span>
            </label>
            <input
              type="text"
              value={extractedData.idNumber}
              style={{
                fontFamily: 'monospace',
                color: 'var(--accent-green, #EF4444)',
                fontSize: '1rem',
              }}
              onChange={e => handleUpdateField('idNumber', e.target.value)}
            />
          </div>
          <div className="field-box">
            <label>
              Card Number <span className="ar">رقم البطاقة</span>
            </label>
            <input
              type="text"
              value={extractedData.cardNumber}
              onChange={e => handleUpdateField('cardNumber', e.target.value)}
            />
          </div>
        </div>
      </VariableSectionCard>

      {/* SECTION 2: BILINGUAL LEGAL NAMES */}
      <VariableSectionCard>
        <div className="card-top">
          <span className="section-title">
            <User size={14} color="#EF4444" /> 2. Full Legal Names (Bilingual)
          </span>
          <span className="match-badge">
            <CheckCheck size={13} /> Not authenticated
          </span>
        </div>
        <div className="value-row">
          <div className="field-box">
            <label>
              Full Legal Name (EN) <span className="ar">الاسم بالإنجليزية</span>
            </label>
            <input
              type="text"
              value={extractedData.fullNameEn}
              onChange={e => handleUpdateField('fullNameEn', e.target.value)}
            />
          </div>
          <div className="field-box">
            <label>
              Full Legal Name (AR) <span className="ar">الاسم بالعربية</span>
            </label>
            <input
              type="text"
              value={extractedData.fullNameAr || ''}
              style={{ direction: 'rtl' }}
              onChange={e => handleUpdateField('fullNameAr', e.target.value)}
            />
          </div>
        </div>
      </VariableSectionCard>

      {/* SECTION 3: DEMOGRAPHICS & NATIONALITY */}
      <VariableSectionCard>
        <div className="card-top">
          <span className="section-title">
            <Flag size={14} color="#EF4444" /> 3. Demographics & Nationality
          </span>
          <span className="match-badge">
            <CheckCheck size={13} /> Not authenticated
          </span>
        </div>
        <div className="value-row" style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
          <div className="field-box">
            <label>
              Nationality <span className="ar">الجنسية</span>
            </label>
            <input
              type="text"
              value={extractedData.nationalityEn}
              onChange={e => handleUpdateField('nationalityEn', e.target.value)}
            />
          </div>
          <div className="field-box">
            <label>
              Gender <span className="ar">الجنس</span>
            </label>
            <select
              value={extractedData.gender}
              onChange={e =>
                handleUpdateField('gender', e.target.value as EmiratesIdExtractedData['gender'])
              }
            >
              <option value="M">Male (ذكر)</option>
              <option value="F">Female (أنثى)</option>
            </select>
          </div>
          <div className="field-box">
            <label>
              Date of Birth <span className="ar">تاريخ الميلاد</span>
            </label>
            <input
              type="text"
              value={extractedData.dateOfBirth}
              onChange={e => handleUpdateField('dateOfBirth', e.target.value)}
            />
          </div>
        </div>
      </VariableSectionCard>

      {/* SECTION 4: VALIDITY DATES */}
      <VariableSectionCard>
        <div className="card-top">
          <span className="section-title">
            <Calendar size={14} color="#EF4444" /> 4. Document Validity Dates
          </span>
          <span className="match-badge">
            <Clock size={13} />{' '}
            {validScanDate(extractedData.expiryDate)
              ? `${scanExpiry(extractedData.expiryDate).daysUntilExpiry} days to expiry`
              : 'Unknown expiry'}
          </span>
        </div>
        <div className="value-row">
          <div className="field-box">
            <label>
              Issue Date <span className="ar">تاريخ الإصدار</span>
            </label>
            <input
              type="text"
              value={extractedData.issueDate}
              onChange={e => handleUpdateField('issueDate', e.target.value)}
            />
          </div>
          <div className="field-box">
            <label>
              Expiry Date <span className="ar">تاريخ الانتهاء</span>
            </label>
            <input
              type="text"
              value={extractedData.expiryDate}
              style={{ color: 'var(--accent-blue, #2563EB)', fontWeight: 800 }}
              onChange={e => handleUpdateField('expiryDate', e.target.value)}
            />
          </div>
        </div>
      </VariableSectionCard>

      {/* SECTION 5: OCCUPATION & EMPLOYER */}
      <VariableSectionCard>
        <div className="card-top">
          <span className="section-title">
            <Briefcase size={14} color="#EF4444" /> 5. Employment & Sponsor
          </span>
          <span className="match-badge">
            <Building size={13} /> Not authenticated
          </span>
        </div>
        <div className="value-row">
          <div className="field-box">
            <label>
              Occupation <span className="ar">المهنة</span>
            </label>
            <input
              type="text"
              value={extractedData.occupationEn}
              onChange={e => handleUpdateField('occupationEn', e.target.value)}
            />
          </div>
          <div className="field-box">
            <label>
              Employer <span className="ar">جهة العمل</span>
            </label>
            <input
              type="text"
              value={extractedData.employerEn}
              onChange={e => handleUpdateField('employerEn', e.target.value)}
            />
          </div>
        </div>
      </VariableSectionCard>

      {/* SECTION 6: ICAO 9303 TD1 MACHINE READABLE ZONE */}
      {extractedData.mrz && (
        <VariableSectionCard>
          <div className="card-top">
            <span className="section-title">
              <CreditCard size={14} color="#EF4444" /> 6. Machine Readable Zone (MRZ TD1)
            </span>
            <span className="match-badge">
              <CheckCheck size={13} /> MRZ text — not authenticity proof
            </span>
          </div>
          <MrzTerminal>
            {`${extractedData.mrz.line1}\n${extractedData.mrz.line2}\n${extractedData.mrz.line3}`}
          </MrzTerminal>
        </VariableSectionCard>
      )}

      {/* 1-Click Platform Cross-Injection Triggers */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '6px' }}>
        <ActionButton
          $variant="secondary"
          type="button"
          onClick={handleAutoFillAsTenant}
          disabled={!canUseScan(extractedData) || isScanning}
          style={{ fontSize: '0.8rem', padding: '8px 14px', flex: 1, justifyContent: 'center' }}
        >
          <FileText size={14} color="#EF4444" /> Auto-Fill Tenancy (as Tenant)
        </ActionButton>
        <ActionButton
          $variant="secondary"
          type="button"
          onClick={handleAutoFillAsLandlord}
          disabled={!canUseScan(extractedData) || isScanning}
          style={{ fontSize: '0.8rem', padding: '8px 14px', flex: 1, justifyContent: 'center' }}
        >
          <FileText size={14} color="#EF4444" /> Auto-Fill Tenancy (as Landlord)
        </ActionButton>
      </div>

      {/* Bottom Control Actions */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: '8px',
        }}
      >
        <ActionButton $variant="danger" onClick={handleDiscard}>
          <Trash2 size={14} /> Clear & Reset
        </ActionButton>

        <ActionButton
          $variant="primary"
          onClick={handleSaveToVault}
          disabled={!canUseScan(extractedData) || isScanning}
        >
          <Save size={15} /> Save Reviewed Variables to KYC Vault
        </ActionButton>
      </div>
    </RightVariablesPane>
  );
};
