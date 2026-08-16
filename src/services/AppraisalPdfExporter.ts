/**
 * AppraisalPdfExporter.ts — GOAL-020
 * Automated White Caves Investment Appraisal Deck PDF exporter.
 * Generates structured JSON data ready for a PDF renderer / print stylesheet.
 */

export interface AppraisalProperty {
  address: string;
  community: string;
  bedrooms: number;
  askingPrice: number;
  sqft: number;
  yearBuilt: number;
}

export interface AppraisalData {
  propertyId: string;
  generatedAt: string;
  property: AppraisalProperty;
  rentalYield: number;
  capitalAppreciation: number;
  holdPeriod: number;
  grossROI: number;
  netROI: number;
  recommendation: 'BUY' | 'HOLD' | 'PASS';
  sections: AppraisalSection[];
}

export interface AppraisalSection {
  title: string;
  rows: { label: string; value: string }[];
}

export function buildAppraisalData(
  property: AppraisalProperty,
  opts: {
    rentalYield: number;
    capitalAppreciation: number;
    holdPeriod: number;
  }
): AppraisalData {
  const { rentalYield, capitalAppreciation, holdPeriod } = opts;
  const grossROI = (rentalYield * holdPeriod) + (capitalAppreciation * holdPeriod);
  const netROI = grossROI * 0.85; // after costs
  const recommendation: 'BUY' | 'HOLD' | 'PASS' =
    netROI > 40 ? 'BUY' : netROI > 20 ? 'HOLD' : 'PASS';

  const annualRent = property.askingPrice * (rentalYield / 100);
  const capitalGain = property.askingPrice * Math.pow(1 + capitalAppreciation / 100, holdPeriod) - property.askingPrice;
  const dldFee = property.askingPrice * 0.04;
  const agentFee = property.askingPrice * 0.02;
  const totalAcquisitionCost = property.askingPrice + dldFee + agentFee + 4200;

  return {
    propertyId: `WC-${Date.now()}`,
    generatedAt: new Date().toISOString(),
    property,
    rentalYield,
    capitalAppreciation,
    holdPeriod,
    grossROI: parseFloat(grossROI.toFixed(2)),
    netROI: parseFloat(netROI.toFixed(2)),
    recommendation,
    sections: [
      {
        title: '🏠 Property Overview',
        rows: [
          { label: 'Address', value: property.address },
          { label: 'Community', value: property.community },
          { label: 'Configuration', value: `${property.bedrooms} BR` },
          { label: 'Area', value: `${property.sqft.toLocaleString()} sqft` },
          { label: 'Year Built', value: String(property.yearBuilt) },
          { label: 'Price/Sqft', value: `AED ${Math.round(property.askingPrice / property.sqft).toLocaleString()}` },
        ],
      },
      {
        title: '💰 Acquisition Costs',
        rows: [
          { label: 'Asking Price', value: `AED ${property.askingPrice.toLocaleString()}` },
          { label: 'DLD Transfer Fee (4%)', value: `AED ${dldFee.toLocaleString()}` },
          { label: 'Agent Commission (2%)', value: `AED ${agentFee.toLocaleString()}` },
          { label: 'Trustee Office Fee', value: 'AED 4,200' },
          { label: 'Total Acquisition', value: `AED ${Math.round(totalAcquisitionCost).toLocaleString()}` },
        ],
      },
      {
        title: '📈 Investment Returns',
        rows: [
          { label: 'Annual Rental Income', value: `AED ${Math.round(annualRent).toLocaleString()}` },
          { label: `${holdPeriod}-Year Capital Gain`, value: `AED ${Math.round(capitalGain).toLocaleString()}` },
          { label: 'Gross ROI', value: `${grossROI.toFixed(1)}%` },
          { label: 'Net ROI (after costs)', value: `${netROI.toFixed(1)}%` },
          { label: 'AEGIS Recommendation', value: recommendation },
        ],
      },
    ],
  };
}

export async function exportAppraisalToPdf(data: AppraisalData): Promise<string> {
  // In production: send to PDF render service (e.g. Puppeteer, PDFKit)
  // Returns a download URL or Blob URL
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  console.log('[AppraisalPdfExporter] Appraisal data ready for PDF rendering:', data.propertyId);
  return url;
}
