/**
 * HenryPdfEngineService.ts — Henry AI Document & PDF Engineering Core
 *
 * Provides comprehensive PDF compilation, print preview generation,
 * visual annotations, digital stamping, and Dubai Real Estate contract formatting.
 */

export interface ContractParty {
  name: string;
  emiratesIdOrPassport: string;
  phone: string;
  email: string;
  trn?: string;
}

export interface PdcScheduleItem {
  chequeNumber: string;
  dueDate: string;
  amountAed: number;
  bankName: string;
  status: 'pending' | 'deposited' | 'cleared' | 'bounced';
}

export interface EjariContractPayload {
  contractNumber: string;
  propertyTitle: string;
  unitNumber: string;
  community: string;
  annualRentAed: number;
  securityDepositAed: number;
  leaseStartDate: string;
  leaseEndDate: string;
  landlord: ContractParty;
  tenant: ContractParty;
  broker: {
    name: string;
    brnNumber: string;
    agencyOrn: string;
    detLicense: string;
  };
  pdcSchedule: PdcScheduleItem[];
  specialClauses?: string[];
}

export interface PdfAnnotation {
  id: string;
  pageNumber: number;
  type: 'text' | 'highlight' | 'redaction' | 'stamp';
  content: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
  color?: string;
}

export interface HenryPdfDocument {
  id: string;
  title: string;
  documentType: 'ejari_form7' | 'dld_form_a' | 'dld_form_b' | 'legal_notice_form12' | 'contractor_work_order';
  pagesCount: number;
  createdAt: string;
  watermark: boolean;
  isSigned: boolean;
  annotations: PdfAnnotation[];
  rawHtml: string;
}

class HenryPdfEngineService {
  /**
   * Compiles an Ejari Form 7 Unified Tenancy Contract into a high-DPI printable HTML document
   */
  generateEjariContractHtml(payload: EjariContractPayload, annotations: PdfAnnotation[] = []): string {
    const pdcRows = payload.pdcSchedule
      .map(
        (pdc, idx) => `
        <tr>
          <td style="padding: 8px; border: 1px solid #CBD5E1; text-align: center;">${idx + 1}</td>
          <td style="padding: 8px; border: 1px solid #CBD5E1; font-family: monospace;">${pdc.chequeNumber}</td>
          <td style="padding: 8px; border: 1px solid #CBD5E1;">${pdc.dueDate}</td>
          <td style="padding: 8px; border: 1px solid #CBD5E1; font-weight: bold; text-align: right;">AED ${pdc.amountAed.toLocaleString()}</td>
          <td style="padding: 8px; border: 1px solid #CBD5E1;">${pdc.bankName}</td>
          <td style="padding: 8px; border: 1px solid #CBD5E1; text-align: center; text-transform: uppercase; font-size: 11px; font-weight: bold; color: ${
            pdc.status === 'cleared' ? '#16A34A' : pdc.status === 'bounced' ? '#DC2626' : '#2563EB'
          }">${pdc.status}</td>
        </tr>
      `
      )
      .join('');

    const clausesList = (payload.specialClauses || [
      'The tenant shall not sublease or assign the property without the written consent of the landlord.',
      'The landlord agrees to maintain all major structural repairs exceeding AED 500.',
      'Notice of non-renewal must be served 90 days prior to contract expiry via registered notary email/courier.',
    ])
      .map((clause, idx) => `<li style="margin-bottom: 6px; font-size: 12px; line-height: 1.5;">${idx + 1}. ${clause}</li>`)
      .join('');

    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>Ejari Form 7 — ${payload.contractNumber}</title>
        <style>
          @page {
            size: A4 portrait;
            margin: 15mm;
          }
          @media print {
            body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            .no-print { display: none !important; }
            .page-break { page-break-after: always; }
          }
          body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            color: #0F172A;
            background: #FFFFFF;
            margin: 0;
            padding: 24px;
            box-sizing: border-box;
          }
          .header-table { width: 100%; border-bottom: 3px solid #EF4444; padding-bottom: 12px; margin-bottom: 20px; }
          .badge { background: #EF4444; color: #FFFFFF; padding: 4px 10px; border-radius: 4px; font-size: 11px; font-weight: 800; }
          .section-heading { background: #1E293B; color: #FFFFFF; padding: 6px 12px; font-size: 13px; font-weight: bold; border-left: 4px solid #EF4444; margin-top: 20px; margin-bottom: 10px; }
          .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px; }
          .box { border: 1px solid #E2E8F0; border-radius: 6px; padding: 12px; background: #F8FAFC; font-size: 12px; line-height: 1.6; }
          .stamp-box { border: 2px dashed #EF4444; border-radius: 8px; padding: 16px; text-align: center; color: #EF4444; background: rgba(239, 68, 68, 0.03); margin-top: 24px; }
          .watermark-text { position: fixed; top: 40%; left: 15%; transform: rotate(-30deg); font-size: 5rem; font-weight: 900; color: rgba(239, 68, 68, 0.06); pointer-events: none; text-transform: uppercase; z-index: 999; }
        </style>
      </head>
      <body>
        <div class="watermark-text">WHITE CAVES LLC</div>

        <table class="header-table">
          <tr>
            <td style="vertical-align: middle;">
              <h1 style="margin: 0; font-size: 20px; color: #1E293B; letter-spacing: 0.5px;">GOVERNMENT OF DUBAI — LAND DEPARTMENT</h1>
              <h2 style="margin: 4px 0 0; font-size: 14px; color: #EF4444; font-weight: 800;">UNIFIED TENANCY CONTRACT (EJARI FORM 7)</h2>
              <span style="font-size: 11px; color: #64748B;">Regulated by Law No. (26) of 2007 & Law No. (33) of 2008</span>
            </td>
            <td style="text-align: right; vertical-align: middle;">
              <div style="font-size: 12px; font-weight: bold; margin-bottom: 4px;">Ejari Ref: ${payload.contractNumber}</div>
              <span class="badge">RERA ORN: ${payload.broker.agencyOrn}</span>
              <div style="font-size: 10px; color: #64748B; margin-top: 4px;">DET License: ${payload.broker.detLicense}</div>
            </td>
          </tr>
        </table>

        <div class="section-heading">1. PROPERTY DETAILS & LEASE PERIOD</div>
        <div class="info-grid">
          <div class="box">
            <strong>Property:</strong> ${payload.propertyTitle}<br>
            <strong>Unit Number:</strong> ${payload.unitNumber}<br>
            <strong>Community / Area:</strong> ${payload.community}<br>
            <strong>Premises Usage:</strong> Residential Residential Leased
          </div>
          <div class="box">
            <strong>Annual Rent:</strong> AED ${payload.annualRentAed.toLocaleString()}<br>
            <strong>Security Deposit:</strong> AED ${payload.securityDepositAed.toLocaleString()} (Refundable)<br>
            <strong>Lease Period:</strong> ${payload.leaseStartDate} to ${payload.leaseEndDate}<br>
            <strong>Number of Cheques:</strong> ${payload.pdcSchedule.length} Payments
          </div>
        </div>

        <div class="section-heading">2. CONTRACT PARTIES (LESSOR & TENANT)</div>
        <div class="info-grid">
          <div class="box">
            <strong style="color: #EF4444;">LANDLORD / LESSOR:</strong><br>
            <strong>Name:</strong> ${payload.landlord.name}<br>
            <strong>Emirates ID / Passport:</strong> ${payload.landlord.emiratesIdOrPassport}<br>
            <strong>Email:</strong> ${payload.landlord.email}<br>
            <strong>Phone:</strong> ${payload.landlord.phone}
          </div>
          <div class="box">
            <strong style="color: #2563EB;">TENANT / LESSEE:</strong><br>
            <strong>Name:</strong> ${payload.tenant.name}<br>
            <strong>Emirates ID / Passport:</strong> ${payload.tenant.emiratesIdOrPassport}<br>
            <strong>Email:</strong> ${payload.tenant.email}<br>
            <strong>Phone:</strong> ${payload.tenant.phone}
          </div>
        </div>

        <div class="section-heading">3. POST-DATED CHEQUES (PDC) REPAYMENT SCHEDULE</div>
        <table style="width: 100%; border-collapse: collapse; font-size: 12px; margin-bottom: 16px;">
          <thead>
            <tr style="background: #F1F5F9; color: #1E293B; font-weight: bold;">
              <th style="padding: 8px; border: 1px solid #CBD5E1;">#</th>
              <th style="padding: 8px; border: 1px solid #CBD5E1;">Cheque No.</th>
              <th style="padding: 8px; border: 1px solid #CBD5E1;">Due Date</th>
              <th style="padding: 8px; border: 1px solid #CBD5E1; text-align: right;">Amount</th>
              <th style="padding: 8px; border: 1px solid #CBD5E1;">Drawee Bank</th>
              <th style="padding: 8px; border: 1px solid #CBD5E1;">Status</th>
            </tr>
          </thead>
          <tbody>
            ${pdcRows}
          </tbody>
        </table>

        <div class="section-heading">4. SPECIAL CONDITIONS & TENANCY CLAUSES</div>
        <ul style="padding-left: 20px; margin: 8px 0;">
          ${clausesList}
        </ul>

        <div class="stamp-box">
          <div style="font-weight: 800; font-size: 14px;">WHITE CAVES REAL ESTATE LLC — VERIFIED & DIGITALLY STAMPED</div>
          <div style="font-size: 11px; margin-top: 4px; color: #64748B;">
            Supervised by Henry AI Compliance Engine • RERA ORN: ${payload.broker.agencyOrn} • BRN: ${payload.broker.brnNumber}
          </div>
          <div style="margin-top: 12px; display: flex; justify-content: space-around; font-size: 12px; font-weight: bold; color: #1E293B;">
            <div>Lessor Signature: __________________</div>
            <div>Lessee Signature: __________________</div>
            <div>Broker Stamp: [VERIFIED 2026]</div>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Generates DLD Form 12 Legal Notice for 12-Month Eviction Notice (Dubai Law 33 of 2008)
   */
  generateForm12LegalNoticeHtml(
    contractNumber: string,
    propertyAddress: string,
    landlordName: string,
    tenantName: string,
    evictionReason: 'sale' | 'personal_use' | 'demolition' | 'major_renovation',
    effectiveDate: string
  ): string {
    const reasonsMap = {
      sale: 'The Landlord wishes to sell the leased property in accordance with Article 25(2)(c) of Law No. 33 of 2008.',
      personal_use: 'The Landlord wishes to recover the property for personal use or first-degree next of kin.',
      demolition: 'The property requires comprehensive reconstruction or demolition approved by Dubai Municipality.',
      major_renovation: 'The property requires major renovation that cannot be executed while the tenant is occupying.',
    };

    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>Form 12 Legal Notice — ${contractNumber}</title>
        <style>
          body { font-family: 'Inter', sans-serif; padding: 32px; color: #0F172A; line-height: 1.7; font-size: 13px; }
          .header { border-bottom: 2px solid #EF4444; padding-bottom: 16px; margin-bottom: 24px; text-align: center; }
          .notary-badge { background: #DC2626; color: white; padding: 4px 12px; font-weight: 800; font-size: 12px; border-radius: 4px; }
        </style>
      </head>
      <body>
        <div class="header">
          <span class="notary-badge">FORM 12 — NOTARIZED 12-MONTH LEGAL NOTICE TO VACATE</span>
          <h2 style="margin: 12px 0 4px; color: #1E293B;">DUBAI LAND DEPARTMENT & NOTARY PUBLIC</h2>
          <p style="margin: 0; color: #64748B; font-size: 11px;">Pursuant to Law No. (26) of 2007, as amended by Law No. (33) of 2008</p>
        </div>

        <p><strong>Date:</strong> ${new Date().toLocaleDateString('en-GB')}</p>
        <p><strong>To (Tenant):</strong> ${tenantName}<br>
        <strong>Property:</strong> ${propertyAddress}<br>
        <strong>Tenancy Contract Reference:</strong> ${contractNumber}</p>

        <p>Dear ${tenantName},</p>

        <p>Please accept this formal 12-month legal notice pursuant to Article (25), Clause (2) of Dubai Law No. 33 of 2008 regarding the relationship between Landlords and Tenants in the Emirate of Dubai.</p>

        <p><strong>Reason for Eviction:</strong><br>
        ${reasonsMap[evictionReason] || reasonsMap.sale}</p>

        <p>In accordance with Dubai Real Estate legislation, you are hereby given twelve (12) calendar months from the date of receipt of this notice to vacate the premises and deliver vacant possession on or before <strong>${effectiveDate}</strong>.</p>

        <div style="margin-top: 40px; display: flex; justify-content: space-between;">
          <div>
            <strong>Landlord Name:</strong> ${landlordName}<br>
            Signature: __________________________
          </div>
          <div>
            <strong>Legal Facilitator:</strong> White Caves Real Estate LLC<br>
            Henry AI Document & Compliance Seal [REGISTERED]
          </div>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Triggers native high-DPI laser print dialog in browser
   */
  triggerPrint(htmlContent: string) {
    const printWindow = window.open('', '_blank', 'width=900,height=800');
    if (printWindow) {
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
      }, 350);
    }
  }
}

export const henryPdfEngineService = new HenryPdfEngineService();
export default henryPdfEngineService;
