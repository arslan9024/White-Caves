/**
 * Document Templates — Handlebars HTML templates for all 6 document types
 *
 * Each template produces professional HTML that can be:
 *   1. Rendered in-browser
 *   2. Printed to PDF via window.print()
 *   3. Emailed as HTML body
 *
 * Template variables use {{double braces}} for Handlebars interpolation.
 *
 * Document types:
 *   1. MoU (Memorandum of Understanding) — buyer-seller agreement
 *   2. Form F — Dubai tenancy contract (RERA)
 *   3. NOC (No Objection Certificate) — property transfer clearance
 *   4. Commission Invoice — agent commission billing
 *   5. Viewing Report — property viewing summary
 *   6. Offer Letter — formal property offer from buyer
 */

// ─── Shared CSS ─────────────────────────────────────────────────────────

const SHARED_CSS = `
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Segoe UI', Arial, sans-serif; color: #1a1a2e; line-height: 1.6; }
  .document { max-width: 800px; margin: 0 auto; padding: 40px; }
  .header { text-align: center; border-bottom: 3px solid #0f3460; padding-bottom: 20px; margin-bottom: 30px; }
  .header h1 { color: #0f3460; font-size: 24px; margin-bottom: 5px; }
  .header .subtitle { color: #666; font-size: 14px; }
  .logo { font-size: 28px; font-weight: bold; color: #0f3460; }
  .section { margin-bottom: 25px; }
  .section h2 { color: #0f3460; font-size: 16px; border-bottom: 1px solid #e0e0e0; padding-bottom: 5px; margin-bottom: 10px; }
  .field-row { display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px dotted #eee; }
  .field-label { font-weight: 600; color: #333; min-width: 180px; }
  .field-value { color: #555; text-align: right; }
  .amount { font-size: 20px; font-weight: bold; color: #0f3460; }
  .footer { margin-top: 40px; padding-top: 20px; border-top: 2px solid #0f3460; text-align: center; font-size: 12px; color: #888; }
  .signature-block { display: flex; justify-content: space-between; margin-top: 50px; }
  .signature-line { width: 200px; text-align: center; }
  .signature-line .line { border-top: 1px solid #333; margin-top: 60px; padding-top: 5px; }
  .stamp { color: #0f3460; font-weight: bold; font-size: 14px; text-transform: uppercase; border: 2px solid #0f3460; padding: 5px 15px; display: inline-block; }
  .terms { font-size: 12px; color: #666; margin-top: 15px; }
  .terms li { margin-bottom: 5px; }
  table { width: 100%; border-collapse: collapse; margin: 10px 0; }
  th, td { padding: 8px 12px; text-align: left; border: 1px solid #ddd; }
  th { background: #f5f5f5; font-weight: 600; color: #333; }
  .highlight { background: #f0f7ff; padding: 15px; border-radius: 5px; border-left: 4px solid #0f3460; }
  @media print { .document { padding: 20px; } .no-print { display: none; } }
`;

// ─── 1. MoU (Memorandum of Understanding) ──────────────────────────────

export const MOU_TEMPLATE = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><title>Memorandum of Understanding</title>
<style>${SHARED_CSS}</style></head>
<body><div class="document">
  <div class="header">
    <div class="logo">WHITE CAVES</div>
    <h1>Memorandum of Understanding</h1>
    <div class="subtitle">Real Estate Transaction Agreement</div>
  </div>

  <div class="section">
    <p>This Memorandum of Understanding ("MoU") is entered into on <strong>{{date}}</strong> between:</p>
  </div>

  <div class="section">
    <h2>Seller / Landlord</h2>
    <div class="field-row"><span class="field-label">Name</span><span class="field-value">{{sellerName}}</span></div>
    <div class="field-row"><span class="field-label">Contact</span><span class="field-value">{{sellerPhone}}</span></div>
    <div class="field-row"><span class="field-label">Emirates ID</span><span class="field-value">{{sellerEmiratesId}}</span></div>
  </div>

  <div class="section">
    <h2>Buyer / Tenant</h2>
    <div class="field-row"><span class="field-label">Name</span><span class="field-value">{{buyerName}}</span></div>
    <div class="field-row"><span class="field-label">Contact</span><span class="field-value">{{buyerPhone}}</span></div>
    <div class="field-row"><span class="field-label">Emirates ID</span><span class="field-value">{{buyerEmiratesId}}</span></div>
  </div>

  <div class="section">
    <h2>Property Details</h2>
    <div class="field-row"><span class="field-label">Property</span><span class="field-value">{{propertyTitle}}</span></div>
    <div class="field-row"><span class="field-label">Location</span><span class="field-value">{{propertyLocation}}</span></div>
    <div class="field-row"><span class="field-label">Type</span><span class="field-value">{{propertyType}}</span></div>
    <div class="field-row"><span class="field-label">Area (sq ft)</span><span class="field-value">{{propertyArea}}</span></div>
  </div>

  <div class="section">
    <h2>Transaction Terms</h2>
    <div class="field-row"><span class="field-label">Transaction Type</span><span class="field-value">{{transactionType}}</span></div>
    <div class="highlight">
      <div class="field-row"><span class="field-label">Agreed Price</span><span class="field-value amount">AED {{agreedPrice}}</span></div>
    </div>
    <div class="field-row"><span class="field-label">Deposit Amount</span><span class="field-value">AED {{depositAmount}}</span></div>
    <div class="field-row"><span class="field-label">Closing Date</span><span class="field-value">{{closingDate}}</span></div>
    <div class="field-row"><span class="field-label">Payment Plan</span><span class="field-value">{{paymentPlan}}</span></div>
  </div>

  <div class="section">
    <h2>Terms & Conditions</h2>
    <ol class="terms">
      <li>Both parties agree to the terms outlined in this MoU and commit to proceeding in good faith.</li>
      <li>The deposit of AED {{depositAmount}} is non-refundable upon signing unless mutually agreed otherwise.</li>
      <li>The transaction shall be completed on or before {{closingDate}}.</li>
      <li>All regulatory fees (DLD, RERA, NOC) shall be borne by the respective parties as per Dubai law.</li>
      <li>White Caves Real Estate acts as the facilitating broker and is entitled to the agreed commission.</li>
    </ol>
  </div>

  <div class="signature-block">
    <div class="signature-line"><div class="line">Seller / Landlord</div></div>
    <div class="signature-line"><div class="line">Buyer / Tenant</div></div>
    <div class="signature-line"><div class="line">Witness (Broker)</div></div>
  </div>

  <div class="footer">
    <div class="stamp">WHITE CAVES REAL ESTATE</div>
    <p>Document Ref: MOU-{{referenceNumber}} | Generated: {{generatedAt}}</p>
    <p>White Caves Real Estate LLC — Dubai, UAE | RERA Registered</p>
  </div>
</div></body></html>`;

// ─── 2. Form F (RERA Tenancy Contract) ─────────────────────────────────

export const FORM_F_TEMPLATE = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><title>Form F — Tenancy Contract</title>
<style>${SHARED_CSS}</style></head>
<body><div class="document">
  <div class="header">
    <div class="logo">WHITE CAVES</div>
    <h1>Form F — Tenancy Contract</h1>
    <div class="subtitle">As per RERA Regulations — Dubai Land Department</div>
  </div>

  <div class="section">
    <h2>Landlord Details</h2>
    <div class="field-row"><span class="field-label">Name</span><span class="field-value">{{landlordName}}</span></div>
    <div class="field-row"><span class="field-label">Nationality</span><span class="field-value">{{landlordNationality}}</span></div>
    <div class="field-row"><span class="field-label">Emirates ID</span><span class="field-value">{{landlordEmiratesId}}</span></div>
    <div class="field-row"><span class="field-label">Phone</span><span class="field-value">{{landlordPhone}}</span></div>
  </div>

  <div class="section">
    <h2>Tenant Details</h2>
    <div class="field-row"><span class="field-label">Name</span><span class="field-value">{{tenantName}}</span></div>
    <div class="field-row"><span class="field-label">Nationality</span><span class="field-value">{{tenantNationality}}</span></div>
    <div class="field-row"><span class="field-label">Emirates ID</span><span class="field-value">{{tenantEmiratesId}}</span></div>
    <div class="field-row"><span class="field-label">Phone</span><span class="field-value">{{tenantPhone}}</span></div>
  </div>

  <div class="section">
    <h2>Property Details</h2>
    <div class="field-row"><span class="field-label">Unit</span><span class="field-value">{{propertyTitle}}</span></div>
    <div class="field-row"><span class="field-label">Building</span><span class="field-value">{{buildingName}}</span></div>
    <div class="field-row"><span class="field-label">Area</span><span class="field-value">{{propertyLocation}}</span></div>
    <div class="field-row"><span class="field-label">Property Type</span><span class="field-value">{{propertyType}}</span></div>
    <div class="field-row"><span class="field-label">Size (sq ft)</span><span class="field-value">{{propertyArea}}</span></div>
    <div class="field-row"><span class="field-label">Ejari Number</span><span class="field-value">{{ejariNumber}}</span></div>
  </div>

  <div class="section">
    <h2>Lease Terms</h2>
    <div class="field-row"><span class="field-label">Lease Start</span><span class="field-value">{{leaseStart}}</span></div>
    <div class="field-row"><span class="field-label">Lease End</span><span class="field-value">{{leaseEnd}}</span></div>
    <div class="highlight">
      <div class="field-row"><span class="field-label">Annual Rent</span><span class="field-value amount">AED {{annualRent}}</span></div>
    </div>
    <div class="field-row"><span class="field-label">Payment Frequency</span><span class="field-value">{{paymentFrequency}}</span></div>
    <div class="field-row"><span class="field-label">Security Deposit</span><span class="field-value">AED {{securityDeposit}}</span></div>
    <div class="field-row"><span class="field-label">Commission</span><span class="field-value">AED {{commissionAmount}}</span></div>
  </div>

  <div class="signature-block">
    <div class="signature-line"><div class="line">Landlord</div></div>
    <div class="signature-line"><div class="line">Tenant</div></div>
    <div class="signature-line"><div class="line">Broker (White Caves)</div></div>
  </div>

  <div class="footer">
    <div class="stamp">RERA REGISTERED</div>
    <p>Ref: FF-{{referenceNumber}} | {{generatedAt}}</p>
    <p>This contract is subject to the Dubai Rental Law No. (26) of 2007 and its amendments.</p>
  </div>
</div></body></html>`;

// ─── 3. NOC (No Objection Certificate) ─────────────────────────────────

export const NOC_TEMPLATE = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><title>No Objection Certificate</title>
<style>${SHARED_CSS}</style></head>
<body><div class="document">
  <div class="header">
    <div class="logo">WHITE CAVES</div>
    <h1>No Objection Certificate (NOC)</h1>
    <div class="subtitle">Property Transfer Clearance</div>
  </div>

  <div class="section">
    <p>This is to certify that <strong>White Caves Real Estate LLC</strong>, as the managing agent / developer representative, has <strong>No Objection</strong> to the following property transfer:</p>
  </div>

  <div class="section">
    <h2>Property Details</h2>
    <div class="field-row"><span class="field-label">Property</span><span class="field-value">{{propertyTitle}}</span></div>
    <div class="field-row"><span class="field-label">Location</span><span class="field-value">{{propertyLocation}}</span></div>
    <div class="field-row"><span class="field-label">Type</span><span class="field-value">{{propertyType}}</span></div>
    <div class="field-row"><span class="field-label">Title Deed No.</span><span class="field-value">{{titleDeedNumber}}</span></div>
  </div>

  <div class="section">
    <h2>Transfer Details</h2>
    <div class="field-row"><span class="field-label">Current Owner</span><span class="field-value">{{currentOwner}}</span></div>
    <div class="field-row"><span class="field-label">New Owner</span><span class="field-value">{{newOwner}}</span></div>
    <div class="field-row"><span class="field-label">Transfer Amount</span><span class="field-value amount">AED {{transferAmount}}</span></div>
    <div class="field-row"><span class="field-label">Outstanding Dues</span><span class="field-value">AED {{outstandingDues}}</span></div>
  </div>

  <div class="section">
    <h2>Clearance Status</h2>
    <div class="highlight">
      <div class="field-row"><span class="field-label">Service Charges</span><span class="field-value">{{serviceChargesStatus}}</span></div>
      <div class="field-row"><span class="field-label">Utility Charges</span><span class="field-value">{{utilityStatus}}</span></div>
      <div class="field-row"><span class="field-label">Mortgage Status</span><span class="field-value">{{mortgageStatus}}</span></div>
    </div>
  </div>

  <div class="section">
    <p>This NOC is valid for <strong>30 days</strong> from the date of issuance and is issued for the sole purpose of property transfer with the Dubai Land Department.</p>
  </div>

  <div class="signature-block">
    <div class="signature-line"><div class="line">Authorized Signatory</div></div>
    <div class="signature-line"><div class="line">Date: {{date}}</div></div>
  </div>

  <div class="footer">
    <div class="stamp">NOC ISSUED</div>
    <p>Ref: NOC-{{referenceNumber}} | Valid until: {{validUntil}}</p>
    <p>White Caves Real Estate LLC — Dubai, UAE</p>
  </div>
</div></body></html>`;

// ─── 4. Commission Invoice ──────────────────────────────────────────────

export const COMMISSION_INVOICE_TEMPLATE = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><title>Commission Invoice</title>
<style>${SHARED_CSS}</style></head>
<body><div class="document">
  <div class="header">
    <div class="logo">WHITE CAVES</div>
    <h1>Commission Invoice</h1>
    <div class="subtitle">Tax Invoice — VAT Registered</div>
  </div>

  <div class="section" style="display:flex;justify-content:space-between;">
    <div>
      <h2>From</h2>
      <p><strong>White Caves Real Estate LLC</strong></p>
      <p>Dubai, UAE</p>
      <p>TRN: {{trnNumber}}</p>
    </div>
    <div style="text-align:right;">
      <div class="field-row"><span class="field-label">Invoice #</span><span class="field-value">{{invoiceNumber}}</span></div>
      <div class="field-row"><span class="field-label">Date</span><span class="field-value">{{invoiceDate}}</span></div>
      <div class="field-row"><span class="field-label">Due Date</span><span class="field-value">{{dueDate}}</span></div>
    </div>
  </div>

  <div class="section">
    <h2>Bill To</h2>
    <div class="field-row"><span class="field-label">Client</span><span class="field-value">{{clientName}}</span></div>
    <div class="field-row"><span class="field-label">Company</span><span class="field-value">{{clientCompany}}</span></div>
    <div class="field-row"><span class="field-label">Email</span><span class="field-value">{{clientEmail}}</span></div>
  </div>

  <div class="section">
    <h2>Commission Details</h2>
    <table>
      <thead>
        <tr><th>Description</th><th>Property</th><th>Rate</th><th>Amount (AED)</th></tr>
      </thead>
      <tbody>
        <tr>
          <td>{{commissionType}} Commission</td>
          <td>{{propertyTitle}}</td>
          <td>{{commissionRate}}%</td>
          <td style="text-align:right">{{commissionAmount}}</td>
        </tr>
      </tbody>
    </table>
  </div>

  <div class="section" style="text-align:right;">
    <div class="field-row"><span class="field-label">Subtotal</span><span class="field-value">AED {{subtotal}}</span></div>
    <div class="field-row"><span class="field-label">VAT (5%)</span><span class="field-value">AED {{vatAmount}}</span></div>
    <div class="highlight" style="text-align:right;margin-top:10px;">
      <div class="field-row"><span class="field-label">Total Due</span><span class="field-value amount">AED {{totalAmount}}</span></div>
    </div>
  </div>

  <div class="section">
    <h2>Payment Details</h2>
    <div class="field-row"><span class="field-label">Bank</span><span class="field-value">{{bankName}}</span></div>
    <div class="field-row"><span class="field-label">Account Name</span><span class="field-value">White Caves Real Estate LLC</span></div>
    <div class="field-row"><span class="field-label">IBAN</span><span class="field-value">{{iban}}</span></div>
    <div class="field-row"><span class="field-label">SWIFT</span><span class="field-value">{{swiftCode}}</span></div>
  </div>

  <div class="footer">
    <p>Ref: INV-{{referenceNumber}} | Generated: {{generatedAt}}</p>
    <p>White Caves Real Estate LLC — Licensed Broker, Dubai, UAE</p>
  </div>
</div></body></html>`;

// ─── 5. Viewing Report ──────────────────────────────────────────────────

export const VIEWING_REPORT_TEMPLATE = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><title>Viewing Report</title>
<style>${SHARED_CSS}</style></head>
<body><div class="document">
  <div class="header">
    <div class="logo">WHITE CAVES</div>
    <h1>Property Viewing Report</h1>
    <div class="subtitle">Agent Feedback & Assessment</div>
  </div>

  <div class="section">
    <h2>Viewing Information</h2>
    <div class="field-row"><span class="field-label">Date</span><span class="field-value">{{viewingDate}}</span></div>
    <div class="field-row"><span class="field-label">Time</span><span class="field-value">{{viewingTime}}</span></div>
    <div class="field-row"><span class="field-label">Agent</span><span class="field-value">{{agentName}}</span></div>
    <div class="field-row"><span class="field-label">Status</span><span class="field-value">{{viewingStatus}}</span></div>
  </div>

  <div class="section">
    <h2>Client Details</h2>
    <div class="field-row"><span class="field-label">Name</span><span class="field-value">{{clientName}}</span></div>
    <div class="field-row"><span class="field-label">Phone</span><span class="field-value">{{clientPhone}}</span></div>
    <div class="field-row"><span class="field-label">Budget</span><span class="field-value">AED {{clientBudget}}</span></div>
    <div class="field-row"><span class="field-label">Lead Score</span><span class="field-value">{{leadScore}}/100</span></div>
  </div>

  <div class="section">
    <h2>Property Viewed</h2>
    <div class="field-row"><span class="field-label">Property</span><span class="field-value">{{propertyTitle}}</span></div>
    <div class="field-row"><span class="field-label">Location</span><span class="field-value">{{propertyLocation}}</span></div>
    <div class="field-row"><span class="field-label">Price</span><span class="field-value">AED {{propertyPrice}}</span></div>
    <div class="field-row"><span class="field-label">Type</span><span class="field-value">{{propertyType}}</span></div>
    <div class="field-row"><span class="field-label">Size</span><span class="field-value">{{propertyArea}} sq ft</span></div>
  </div>

  <div class="section">
    <h2>Agent Assessment</h2>
    <div class="highlight">
      <div class="field-row"><span class="field-label">Client Interest Level</span><span class="field-value">{{interestLevel}}/10</span></div>
      <div class="field-row"><span class="field-label">Likelihood to Proceed</span><span class="field-value">{{likelihood}}</span></div>
    </div>
  </div>

  <div class="section">
    <h2>Feedback & Notes</h2>
    <p>{{feedback}}</p>
  </div>

  <div class="section">
    <h2>Follow-Up Action</h2>
    <p>{{followUpAction}}</p>
    <div class="field-row"><span class="field-label">Next Contact Date</span><span class="field-value">{{nextContactDate}}</span></div>
  </div>

  <div class="footer">
    <p>Ref: VR-{{referenceNumber}} | Generated: {{generatedAt}}</p>
    <p>White Caves Real Estate LLC — Property Viewing Report</p>
  </div>
</div></body></html>`;

// ─── 6. Offer Letter ────────────────────────────────────────────────────

export const OFFER_LETTER_TEMPLATE = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><title>Offer Letter</title>
<style>${SHARED_CSS}</style></head>
<body><div class="document">
  <div class="header">
    <div class="logo">WHITE CAVES</div>
    <h1>Property Offer Letter</h1>
    <div class="subtitle">Formal Purchase / Lease Offer</div>
  </div>

  <div class="section">
    <p>Date: <strong>{{date}}</strong></p>
    <p>To: <strong>{{sellerName}}</strong></p>
    <p>From: <strong>{{buyerName}}</strong></p>
  </div>

  <div class="section">
    <h2>Property</h2>
    <div class="field-row"><span class="field-label">Property</span><span class="field-value">{{propertyTitle}}</span></div>
    <div class="field-row"><span class="field-label">Location</span><span class="field-value">{{propertyLocation}}</span></div>
    <div class="field-row"><span class="field-label">Type</span><span class="field-value">{{propertyType}}</span></div>
    <div class="field-row"><span class="field-label">Listed Price</span><span class="field-value">AED {{listedPrice}}</span></div>
  </div>

  <div class="section">
    <h2>Offer Details</h2>
    <div class="highlight">
      <div class="field-row"><span class="field-label">Offered Price</span><span class="field-value amount">AED {{offeredPrice}}</span></div>
    </div>
    <div class="field-row"><span class="field-label">Earnest Deposit</span><span class="field-value">AED {{earnestDeposit}}</span></div>
    <div class="field-row"><span class="field-label">Payment Method</span><span class="field-value">{{paymentMethod}}</span></div>
    <div class="field-row"><span class="field-label">Proposed Closing</span><span class="field-value">{{proposedClosing}}</span></div>
    <div class="field-row"><span class="field-label">Offer Valid Until</span><span class="field-value">{{validUntil}}</span></div>
  </div>

  <div class="section">
    <h2>Conditions</h2>
    <ol class="terms">
      <li>This offer is subject to satisfactory property inspection.</li>
      <li>The buyer agrees to provide proof of funds within 5 business days of acceptance.</li>
      <li>{{additionalConditions}}</li>
    </ol>
  </div>

  <div class="section">
    <h2>Buyer Information</h2>
    <div class="field-row"><span class="field-label">Name</span><span class="field-value">{{buyerName}}</span></div>
    <div class="field-row"><span class="field-label">Contact</span><span class="field-value">{{buyerPhone}}</span></div>
    <div class="field-row"><span class="field-label">Email</span><span class="field-value">{{buyerEmail}}</span></div>
  </div>

  <div class="signature-block">
    <div class="signature-line"><div class="line">Buyer Signature</div></div>
    <div class="signature-line"><div class="line">Date</div></div>
  </div>

  <div class="footer">
    <p>Ref: OL-{{referenceNumber}} | Generated: {{generatedAt}}</p>
    <p>Facilitated by White Caves Real Estate LLC — Dubai, UAE</p>
  </div>
</div></body></html>`;

// ─── Template Registry ──────────────────────────────────────────────────

export const DOCUMENT_TEMPLATES: Record<string, string> = {
  mou: MOU_TEMPLATE,
  form_f: FORM_F_TEMPLATE,
  noc: NOC_TEMPLATE,
  commission_invoice: COMMISSION_INVOICE_TEMPLATE,
  viewing_report: VIEWING_REPORT_TEMPLATE,
  offer_letter: OFFER_LETTER_TEMPLATE,
};

export const DOCUMENT_TYPE_LABELS: Record<string, string> = {
  mou: 'Memorandum of Understanding',
  form_f: 'Form F — Tenancy Contract',
  noc: 'No Objection Certificate',
  commission_invoice: 'Commission Invoice',
  viewing_report: 'Property Viewing Report',
  offer_letter: 'Property Offer Letter',
};
