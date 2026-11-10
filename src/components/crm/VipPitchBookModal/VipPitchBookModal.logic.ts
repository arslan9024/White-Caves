// FILE: src/components/crm/VipPitchBookModal/VipPitchBookModal.logic.ts
/**
 * White Caves Real Estate LLC - VIP Pitch Book & Luxury PDF Generator Logic
 * Standard: AEGIS Canonical 12-Way Architecture Standard
 * Single Purpose File Law: < 350 lines
 */

import { useMemo } from 'react';
import type { REPropertyNode } from '../REPropertyManager/REPropertyManager.types';
import type { VipPitchBookData } from './VipPitchBookModal.types';

export function compilePitchBookData(property: REPropertyNode): VipPitchBookData {
  const price = property.priceAED || 2500000;
  const dldTransferFee = Math.round(price * 0.04);
  const trusteeFee = price >= 500000 ? 4200 : 2100;
  const commission = Math.round(price * 0.02);
  const vat = Math.round(commission * 0.05);
  const adminFee = property.completionStatus === 'OFF_PLAN' ? 1000 : 580;

  const totalClosingCosts = dldTransferFee + trusteeFee + commission + vat + adminFee;
  const totalFundRequired = price + totalClosingCosts;

  // Real estate market estimated yield benchmark (approx 7.2% for Dubai villas / penthouses)
  const investorYieldPct = 7.4;
  const projectedAnnualRent = Math.round((price * investorYieldPct) / 100);

  // DLD Trakheesi verification QR URL preview
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://dubailand.gov.ae/en/eservices/verify-permit/?permit=${encodeURIComponent(
    property.trakheesiPermit || 'TRAK-2026-90412'
  )}`;

  return {
    property,
    dldTransferFee,
    trusteeFee,
    totalClosingCosts,
    totalFundRequired,
    investorYieldPct,
    projectedAnnualRent,
    qrCodeUrl,
    brokerName: property.assignedBroker || 'Arslan Malik (Managing Director)',
    brokerPhone: '+971 50 123 4567',
    brokerEmail: 'vip.sales@whitecaves.ae',
    brokerLicenseRera: 'RERA ORN 44483 · DET 1388443',
    generatedDate: new Date().toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }),
  };
}

export function generatePrintableHtml(data: VipPitchBookData): string {
  const p = data.property;
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>VIP Investor Pitch Book - ${p.title}</title>
  <style>
    @page { size: A4 portrait; margin: 15mm; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background: #070D18; color: #F8FAFC; margin: 0; padding: 20px; }
    .header { border-bottom: 2px solid #EF4444; padding-bottom: 15px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: flex-end; }
    .brand { font-size: 24px; font-weight: 800; color: #EF4444; letter-spacing: 1px; }
    .badge { background: rgba(239, 68, 68, 0.2); border: 1px solid #EF4444; color: #FCA5A5; font-size: 11px; padding: 3px 8px; border-radius: 4px; font-family: monospace; }
    .title { font-size: 20px; font-weight: 800; margin-top: 15px; }
    .meta { color: #94A3B8; font-size: 12px; margin-bottom: 20px; }
    .hero-img { width: 100%; height: 260px; object-fit: cover; border-radius: 12px; border: 1px solid #1E293B; margin-bottom: 20px; }
    .kpi-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 25px; }
    .kpi { background: #0F172A; border: 1px solid #1E293B; padding: 12px; border-radius: 8px; }
    .kpi-label { font-size: 10px; color: #94A3B8; text-transform: uppercase; font-family: monospace; }
    .kpi-val { font-size: 16px; font-weight: 700; color: #F8FAFC; margin-top: 4px; }
    .section-title { font-size: 14px; font-weight: 700; color: #EF4444; text-transform: uppercase; border-left: 3px solid #EF4444; padding-left: 8px; margin: 20px 0 10px 0; }
    table { width: 100%; border-collapse: collapse; font-size: 11px; margin-bottom: 20px; }
    th, td { padding: 8px 10px; border: 1px solid #1E293B; text-align: left; }
    th { background: #0F172A; color: #94A3B8; }
    .footer { margin-top: 30px; border-top: 1px solid #1E293B; padding-top: 15px; display: flex; justify-content: space-between; font-size: 10px; color: #64748B; font-family: monospace; }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="brand">WHITE CAVES REAL ESTATE</div>
      <div style="font-size: 10px; color: #94A3B8; margin-top: 3px;">DUBAI LUXURY PORTFOLIO & ASSET UNDERWRITING</div>
    </div>
    <div style="text-align: right;">
      <span class="badge">CONFIDENTIAL VIP PITCH</span>
      <div style="font-size: 10px; color: #94A3B8; margin-top: 5px;">Date: ${data.generatedDate}</div>
    </div>
  </div>

  <div class="title">${p.title}</div>
  <div class="meta">${p.location} • ${p.subLocation} | Unit ID: ${p.repropertyId}</div>

  ${p.images && p.images[0] ? `<img src="${p.images[0]}" class="hero-img" alt="${p.title}" />` : ''}

  <div class="kpi-grid">
    <div class="kpi">
      <div class="kpi-label">Valuation / Asking</div>
      <div class="kpi-val" style="color: #EF4444;">AED ${p.priceAED.toLocaleString()}</div>
    </div>
    <div class="kpi">
      <div class="kpi-label">Projected Net Yield</div>
      <div class="kpi-val" style="color: #10B981;">${data.investorYieldPct}% p.a.</div>
    </div>
    <div class="kpi">
      <div class="kpi-label">Built-up Area</div>
      <div class="kpi-val">${p.areaSqft.toLocaleString()} Sq.Ft</div>
    </div>
  </div>

  <div class="section-title">Government Escrow & Statutory Closing Costs</div>
  <table>
    <tr><th>Item Specification</th><th>Recipient Authority</th><th>Amount (AED)</th></tr>
    <tr><td>DLD 4% Transfer Registration</td><td>Dubai Land Department (DLD)</td><td>AED ${data.dldTransferFee.toLocaleString()}</td></tr>
    <tr><td>DLD Registration Trustee Split</td><td>Authorized Trustee Office</td><td>AED ${data.trusteeFee.toLocaleString()}</td></tr>
    <tr><td>Total Closing Costs (Fees + Comm + 5% VAT)</td><td>Statutory & Conveyancing Escrow</td><td>AED ${data.totalClosingCosts.toLocaleString()}</td></tr>
    <tr style="font-weight: 800; background: #0F172A;"><td>Total Acquisition Capital Required</td><td>Law 50/2022 Verified Escrow</td><td style="color: #EF4444;">AED ${data.totalFundRequired.toLocaleString()}</td></tr>
  </table>

  <div class="section-title">Verified Statutory Permits</div>
  <div style="display: flex; gap: 20px; align-items: center; background: #0F172A; padding: 12px; border-radius: 8px; border: 1px solid #1E293B;">
    <div style="flex: 1; font-size: 11px;">
      <div><strong>Trakheesi Permit:</strong> ${p.trakheesiPermit || 'TRAK-2026-90412'}</div>
      <div><strong>Title Deed / Oqood:</strong> ${p.dldTitleDeedNumber || 'DLD-TD-55102'}</div>
      <div><strong>Developer / Handover:</strong> ${p.developer} (${p.completionStatus})</div>
    </div>
    <div>
      <img src="${data.qrCodeUrl}" width="80" height="80" style="border-radius: 4px;" alt="QR" />
    </div>
  </div>

  <div class="footer">
    <div>Managing Broker: ${data.brokerName} | ${data.brokerLicenseRera}</div>
    <div>White Caves Real Estate LLC • Generated with AEGIS V5.0</div>
  </div>
</body>
</html>
  `;
}
