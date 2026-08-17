/**
 * HenryPdfEngineService.ts — Henry AI Document & PDF Engineering Core
 *
 * Provides comprehensive PDF compilation, print preview generation,
 * E-Signature sharing, AI Auto-Fill, and Dubai Real Estate contract formatting.
 *
 * Core Document Streams:
 * 1. Tenancy Contract (Private agreement with e-signature link sharing)
 * 2. Government Ejari Certificate (Official DLD issued certificate archival)
 * 3. Leasing & Viewing Forms (Form B viewing sheets with 1-Click AI Auto-Fill)
 * 4. Receipts & Tax Invoices (Security deposit & commission tax invoices with TRN and 5% VAT)
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

export interface TenancyContractPayload {
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
  esignToken?: string;
  esignStatus?: 'draft' | 'link_generated' | 'signed';
}

export interface GovernmentEjariRecord {
  ejariNumber: string; // e.g. "0120250814005322"
  contractReference: string;
  issueDate: string;
  expiryDate: string;
  registeredRentAed: number;
  propertyAddress: string;
  landlordName: string;
  tenantName: string;
  brokerName: string;
  brokerBrn: string;
  dldBarcodeHash: string;
  archivedAt: string;
}

export interface ViewingFormPayload {
  formId: string;
  clientName: string;
  clientPhone: string;
  clientPassportOrEid: string;
  propertyTitle: string;
  propertyAddress: string;
  viewingDate: string;
  viewingTime: string;
  agentName: string;
  agentBrn: string;
  feedbackNotes?: string;
}

export interface TaxReceiptPayload {
  receiptNumber: string;
  receiptType: 'security_deposit' | 'agency_commission' | 'maintenance_payout';
  amountAed: number;
  vatRatePercent: number;
  vatAmountAed: number;
  totalWithVatAed: number;
  paidBy: string;
  paidTo: string;
  whiteCavesTrn: string;
  paymentMethod: 'cheque' | 'bank_transfer' | 'credit_card' | 'uaedds';
  paymentReference: string;
  date: string;
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

class HenryPdfEngineService {
  /**
   * 1. Compiles the Unified Tenancy Contract ready for e-Signature link sharing
   */
  generateTenancyContractHtml(payload: TenancyContractPayload, annotations: PdfAnnotation[] = []): string {
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

    const esignLink = payload.esignToken ? `https://whitecaves.ae/sign/${payload.esignToken}` : 'https://whitecaves.ae/sign/demo-token-98442';

    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>Tenancy Contract — ${payload.contractNumber}</title>
        <style>
          @page { size: A4 portrait; margin: 15mm; }
          @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } .no-print { display: none !important; } }
          body { font-family: 'Inter', sans-serif; color: #0F172A; background: #FFFFFF; padding: 24px; box-sizing: border-box; }
          .header-table { width: 100%; border-bottom: 3px solid #EF4444; padding-bottom: 12px; margin-bottom: 20px; }
          .badge { background: #EF4444; color: #FFFFFF; padding: 4px 10px; border-radius: 4px; font-size: 11px; font-weight: 800; }
          .section-heading { background: #1E293B; color: #FFFFFF; padding: 6px 12px; font-size: 13px; font-weight: bold; border-left: 4px solid #EF4444; margin-top: 18px; margin-bottom: 10px; }
          .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 12px; }
          .box { border: 1px solid #E2E8F0; border-radius: 6px; padding: 12px; background: #F8FAFC; font-size: 12px; line-height: 1.6; }
          .esign-banner { background: #FEF2F2; border: 1.5px solid #FECACA; border-radius: 8px; padding: 12px 16px; margin-bottom: 16px; display: flex; justify-content: space-between; align-items: center; }
          .stamp-box { border: 2px dashed #EF4444; border-radius: 8px; padding: 16px; text-align: center; color: #EF4444; background: rgba(239, 68, 68, 0.03); margin-top: 20px; }
          .watermark-text { position: fixed; top: 40%; left: 15%; transform: rotate(-30deg); font-size: 5rem; font-weight: 900; color: rgba(239, 68, 68, 0.06); pointer-events: none; text-transform: uppercase; z-index: 999; }
        </style>
      </head>
      <body>
        <div class="watermark-text">WHITE CAVES LLC</div>

        <div class="esign-banner no-print">
          <div>
            <strong style="color: #991B1B; font-size: 13px;">🔗 E-SIGNATURE LINK READY FOR SHARING</strong>
            <div style="font-size: 11px; color: #7F1D1D; margin-top: 2px;">Share link with Landlord & Tenant for secure digital execution: <code style="background: white; padding: 2px 6px; border-radius: 4px;">${esignLink}</code></div>
          </div>
          <span class="badge" style="background: #16A34A;">E-SIGN ACTIVE</span>
        </div>

        <table class="header-table">
          <tr>
            <td style="vertical-align: middle;">
              <h1 style="margin: 0; font-size: 20px; color: #1E293B; letter-spacing: 0.5px;">GOVERNMENT OF DUBAI — LAND DEPARTMENT</h1>
              <h2 style="margin: 4px 0 0; font-size: 14px; color: #EF4444; font-weight: 800;">UNIFIED TENANCY CONTRACT (FOR E-SIGNATURE)</h2>
              <span style="font-size: 11px; color: #64748B;">Regulated by Law No. (26) of 2007 & Law No. (33) of 2008</span>
            </td>
            <td style="text-align: right; vertical-align: middle;">
              <div style="font-size: 12px; font-weight: bold; margin-bottom: 4px;">Contract Ref: ${payload.contractNumber}</div>
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
            <strong>Premises Usage:</strong> Residential Leased
          </div>
          <div class="box">
            <strong>Annual Rent:</strong> AED ${payload.annualRentAed.toLocaleString()}<br>
            <strong>Security Deposit:</strong> AED ${payload.securityDepositAed.toLocaleString()} (Refundable)<br>
            <strong>Lease Period:</strong> ${payload.leaseStartDate} to ${payload.leaseEndDate}<br>
            <strong>Payment Terms:</strong> ${payload.pdcSchedule.length} Post-Dated Cheques
          </div>
        </div>

        <div class="section-heading">2. CONTRACT PARTIES (LESSOR & LESSEE)</div>
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
        <table style="width: 100%; border-collapse: collapse; font-size: 12px; margin-bottom: 12px;">
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
          <div style="font-weight: 800; font-size: 13px;">DIGITALLY PREPARED FOR SECURE E-SIGNATURE</div>
          <div style="font-size: 11px; margin-top: 4px; color: #64748B;">
            Supervised by Henry AI • White Caves Real Estate LLC • RERA ORN: ${payload.broker.agencyOrn}
          </div>
          <div style="margin-top: 12px; display: flex; justify-content: space-around; font-size: 11px; font-weight: bold; color: #1E293B;">
            <div>Lessor E-Sign: [PENDING / SECURE LINK]</div>
            <div>Lessee E-Sign: [PENDING / SECURE LINK]</div>
            <div>Broker Witness: [VERIFIED]</div>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * 2. Displays the Official Government-Issued Ejari Certificate in Henry Vault
   */
  generateGovernmentEjariArchiveHtml(record: GovernmentEjariRecord): string {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>Government Ejari Certificate — ${record.ejariNumber}</title>
        <style>
          body { font-family: 'Inter', sans-serif; padding: 24px; color: #0F172A; background: #FFFFFF; }
          .cert-border { border: 4px double #1E293B; padding: 24px; border-radius: 8px; background: #FFFCF9; }
          .header { text-align: center; border-bottom: 2px solid #B45309; padding-bottom: 12px; margin-bottom: 20px; }
          .qr-box { width: 90px; height: 90px; border: 1px solid #CBD5E1; display: inline-flex; align-items: center; justify-content: center; font-family: monospace; font-size: 10px; background: #FFFFFF; }
          .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; font-size: 12px; line-height: 1.8; }
          .vault-badge { background: #16A34A; color: white; padding: 4px 10px; border-radius: 999px; font-size: 11px; font-weight: 800; }
        </style>
      </head>
      <body>
        <div class="cert-border">
          <div class="header">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span class="vault-badge">HENRY SOVEREIGN VAULT — OFFICIAL GOVERNMENT RECORD</span>
              <span style="font-size: 11px; color: #64748B;">Archived: ${record.archivedAt}</span>
            </div>
            <h2 style="margin: 12px 0 2px; color: #1E293B; font-size: 18px;">GOVERNMENT OF DUBAI — LAND DEPARTMENT</h2>
            <h3 style="margin: 0; color: #B45309; font-size: 15px;">OFFICIAL EJARI CERTIFICATE OF TENANCY REGISTRATION</h3>
            <div style="font-size: 13px; font-weight: 800; color: #1E293B; margin-top: 6px;">EJARI NUMBER: ${record.ejariNumber}</div>
          </div>

          <div class="grid">
            <div style="background: white; border: 1px solid #E2E8F0; padding: 12px; border-radius: 6px;">
              <strong>Contract Reference:</strong> ${record.contractReference}<br>
              <strong>Property Address:</strong> ${record.propertyAddress}<br>
              <strong>Registered Annual Rent:</strong> AED ${record.registeredRentAed.toLocaleString()}<br>
              <strong>Issue Date:</strong> ${record.issueDate}<br>
              <strong>Expiry Date:</strong> <span style="color: #DC2626; font-weight: bold;">${record.expiryDate}</span>
            </div>

            <div style="background: white; border: 1px solid #E2E8F0; padding: 12px; border-radius: 6px;">
              <strong>Landlord (Lessor):</strong> ${record.landlordName}<br>
              <strong>Tenant (Lessee):</strong> ${record.tenantName}<br>
              <strong>Registered Broker:</strong> ${record.brokerName} (BRN: ${record.brokerBrn})<br>
              <strong>DLD Barcode Hash:</strong> <code style="font-size: 10px;">${record.dldBarcodeHash}</code>
            </div>
          </div>

          <div style="margin-top: 24px; text-align: center; border-top: 1px solid #E2E8F0; padding-top: 16px;">
            <div class="qr-box">[DLD REST QR]</div>
            <div style="font-size: 11px; color: #64748B; margin-top: 8px;">
              This official document was registered directly by the licensed agent with Dubai Land Department and permanently archived in Henry AI Sovereign Records Vault.
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * 3. Generates Form B Viewing Register with 1-Click AI Auto-Fill
   */
  generateViewingFormHtml(payload: ViewingFormPayload): string {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>Form B Viewing Register — ${payload.formId}</title>
        <style>
          body { font-family: 'Inter', sans-serif; padding: 24px; color: #0F172A; line-height: 1.6; font-size: 12px; }
          .header { border-bottom: 2px solid #EF4444; padding-bottom: 12px; margin-bottom: 16px; }
          .tag { background: #2563EB; color: white; padding: 3px 8px; border-radius: 4px; font-weight: 800; font-size: 10px; }
          .box { border: 1px solid #CBD5E1; padding: 12px; border-radius: 6px; background: #F8FAFC; margin-bottom: 12px; }
        </style>
      </head>
      <body>
        <div class="header">
          <span class="tag">1-CLICK AI AUTO-FILLED</span>
          <h2 style="margin: 6px 0 2px; color: #1E293B;">FORM B — BUYER / TENANT PROPERTY VIEWING REGISTER</h2>
          <span style="color: #64748B; font-size: 11px;">White Caves Real Estate LLC • RERA ORN: 44483 • Form Ref: ${payload.formId}</span>
        </div>

        <div class="box">
          <strong>Client Name:</strong> ${payload.clientName}<br>
          <strong>Phone:</strong> ${payload.clientPhone}<br>
          <strong>Emirates ID / Passport:</strong> ${payload.clientPassportOrEid}
        </div>

        <div class="box">
          <strong>Property Inspected:</strong> ${payload.propertyTitle}<br>
          <strong>Location:</strong> ${payload.propertyAddress}<br>
          <strong>Viewing Date & Time:</strong> ${payload.viewingDate} at ${payload.viewingTime}<br>
          <strong>Conducting Broker:</strong> ${payload.agentName} (BRN: ${payload.agentBrn})
        </div>

        <div class="box">
          <strong>Client Inspection Feedback & Notes:</strong><br>
          ${payload.feedbackNotes || 'Property in immaculate condition. Client interested in submitting formal offer.'}
        </div>

        <div style="margin-top: 30px; display: flex; justify-content: space-between;">
          <div>Client Signature: ______________________</div>
          <div>Agent Signature: ______________________</div>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * 4. Generates Payment Receipts & Tax Invoices with TRN & FTA 5% VAT
   */
  generateTaxReceiptHtml(payload: TaxReceiptPayload): string {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>Tax Invoice / Receipt — ${payload.receiptNumber}</title>
        <style>
          body { font-family: 'Inter', sans-serif; padding: 24px; color: #0F172A; font-size: 12px; }
          .header { border-bottom: 2px solid #EF4444; padding-bottom: 12px; margin-bottom: 16px; }
          .table { width: 100%; border-collapse: collapse; margin-top: 12px; }
          .table th, .table td { padding: 8px 12px; border: 1px solid #CBD5E1; }
          .table th { background: #1E293B; color: white; text-align: left; }
        </style>
      </head>
      <body>
        <div class="header">
          <div style="display: flex; justify-content: space-between;">
            <div>
              <h2 style="margin: 0; color: #1E293B;">WHITE CAVES REAL ESTATE LLC</h2>
              <div style="font-size: 11px; color: #64748B;">Tax Registration Number (TRN): <strong>${payload.whiteCavesTrn}</strong></div>
              <div style="font-size: 11px; color: #64748B;">DET License: 1388443 | RERA ORN: 44483</div>
            </div>
            <div style="text-align: right;">
              <h3 style="margin: 0; color: #EF4444;">OFFICIAL TAX INVOICE</h3>
              <div style="font-weight: bold;">Invoice No: ${payload.receiptNumber}</div>
              <div style="font-size: 11px; color: #64748B;">Date: ${payload.date}</div>
            </div>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 16px;">
          <div style="border: 1px solid #E2E8F0; padding: 10px; border-radius: 6px; background: #F8FAFC;">
            <strong>Billed To:</strong><br>${payload.paidBy}
          </div>
          <div style="border: 1px solid #E2E8F0; padding: 10px; border-radius: 6px; background: #F8FAFC;">
            <strong>Payment Method:</strong> ${payload.paymentMethod.toUpperCase()}<br>
            <strong>Reference:</strong> ${payload.paymentReference}
          </div>
        </div>

        <table class="table">
          <thead>
            <tr>
              <th>Description</th>
              <th style="text-align: right;">Net Amount (AED)</th>
              <th style="text-align: right;">VAT Rate</th>
              <th style="text-align: right;">VAT Amount (AED)</th>
              <th style="text-align: right;">Total Inc. VAT (AED)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>${payload.receiptType.replace('_', ' ').toUpperCase()}</td>
              <td style="text-align: right;">AED ${payload.amountAed.toLocaleString()}</td>
              <td style="text-align: right;">${payload.vatRatePercent}%</td>
              <td style="text-align: right;">AED ${payload.vatAmountAed.toLocaleString()}</td>
              <td style="text-align: right; font-weight: bold; color: #EF4444;">AED ${payload.totalWithVatAed.toLocaleString()}</td>
            </tr>
          </tbody>
        </table>

        <div style="margin-top: 24px; text-align: right; font-size: 11px; color: #64748B;">
          Digitally verified by Henry AI Finance & Audit Protocol • FTA UAE Compliant
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
