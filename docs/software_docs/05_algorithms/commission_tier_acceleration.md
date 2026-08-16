# Dynamic Commission Tier Accelerator Algorithm Specification

> **Algorithm Code:** `ALG-FIN-02`  
> **Associated Department:** Revenue, Finance & Treasury (`finance`)  
> **Mathematical Model:** Threshold-Trigger Split Transition Math (50/50 Baseline to 70/30 Accelerator Split)  
> **Cross-Linked SDD Reference:** `../02_software_design/database_architecture_sdd.md`  

---

## 1. Overview & Objective

The Dynamic Commission Tier Accelerator automatically calculates broker earnings splits and corporate revenue retention across quarterly closing thresholds, dynamically scaling split ratios when sales parameters surpass target revenue benchmarks.

---

## 2. Commission Split Calculation Formula

For a transaction with gross agency commission \( C_{\text{gross}} \), accumulated quarterly volume \( V \), and tier threshold \( T_1 = \text{AED } 5,000,000 \):

$$\text{Commission}_{\text{broker}} = \begin{cases} 
C_{\text{gross}} \times 0.50 & \text{if } V < T_1 \\
(C_{\text{base}} \times 0.50) + (C_{\text{overflow}} \times 0.70) & \text{if } V \ge T_1 
\end{cases}$$

Where:
- \( C_{\text{base}} \): Portion of deal volume below \( T_1 \).
- \( C_{\text{overflow}} \): Portion of deal volume exceeding \( T_1 \).
- **UAE VAT (5%)**: Applied to gross agency invoice before net split disbursement.

---

## 3. Tier Threshold Structure Matrix

| Quarterly Revenue Volume (\( V \)) | Broker Split % | Corporate Split % | Incentive Tier |
| :--- | :--- | :--- | :--- |
| **AED 0 – AED 4,999,999** | 50% | 50% | Standard Baseline Tier |
| **AED 5,000,000 – AED 9,999,999** | 60% | 40% | Performance Tier 1 |
| **AED 10,000,000+** | **70%** | **30%** | **Sovereign Accelerator Tier** |

---

## 4. Operational TypeScript Engine

```typescript
export interface CommissionSplitResult {
  grossCommissionAed: number;
  vatAmountAed: number;
  netAgencyRevenueAed: number;
  brokerSplitAmountAed: number;
  corporateRetentionAed: number;
  activeTierLabel: string;
}

export function calculateCommissionSplit(
  dealValueAed: number,
  commissionRatePercent: number,
  priorQuarterVolumeAed: number
): CommissionSplitResult {
  const grossCommission = dealValueAed * (commissionRatePercent / 100);
  const vatAmount = grossCommission * 0.05; // 5% UAE VAT
  const netRevenue = grossCommission - vatAmount;

  let brokerRatio = 0.50;
  let tierLabel = 'Standard Baseline (50/50)';

  if (priorQuarterVolumeAed >= 10000000) {
    brokerRatio = 0.70;
    tierLabel = 'Sovereign Accelerator (70/30)';
  } else if (priorQuarterVolumeAed >= 5000000) {
    brokerRatio = 0.60;
    tierLabel = 'Performance Tier 1 (60/40)';
  }

  const brokerSplit = netRevenue * brokerRatio;
  const corporateRetention = netRevenue * (1 - brokerRatio);

  return {
    grossCommissionAed: grossCommission,
    vatAmountAed: vatAmount,
    netAgencyRevenueAed: netRevenue,
    brokerSplitAmountAed: brokerSplit,
    corporateRetentionAed: corporateRetention,
    activeTierLabel: tierLabel,
  };
}
```
