# Software Design Document — Algorithms & Predictive Engine Specifications

**Document Class:** SDD-002 (System Design Document)  
**Module:** Intelligence & SLA Operations Core  
**Version:** 2026.08-SDD-V2  
**Owner:** @Ada (Chief Architect) + @Joelle (ML Lead)  
**RUP Phase:** Elaboration Gate Document  
**Status:** ✅ Active — Production Aligned  

---

## 1. Lead-SLA Decay Algorithm Specification

**File:** `src/utils/LeadSLADecayEngine.ts`  
**Hook:** `src/hooks/useLeadSLADecay.ts`  

### 1.1 Mathematical State Model
The Lead-SLA Decay Engine models the degradation of lead conversion probability over time elapsed from inbound webhook ingestion ($t$ in minutes):

$$\text{Decay}(t) = \begin{cases} 
\frac{t}{15} \times 20\% & \text{if } t \le 15 \text{ (EXCELLENT)} \\
20\% + \frac{t-15}{15} \times 40\% & \text{if } 15 < t \le 30 \text{ (WARNING)} \\
60\% + \frac{t-30}{30} \times 30\% & \text{if } 30 < t \le 60 \text{ (CRITICAL)} \\
95\% & \text{if } t > 60 \text{ (EXPIRED\_ESCALATED)}
\end{cases}$$

### 1.2 Escalation Contract
Leads breaching $t = 15$ minutes automatically trigger an alert to the squad's Department Manager (@Sophia / @Victoria) for instant round-robin reassignment.

---

## 2. Predictive ROI & Price Appreciation Matrix Specification

**File:** `src/utils/PredictiveROIMatrix.ts`  
**Hook:** `src/hooks/usePredictiveROI.ts`  

### 2.1 Formulae
- **Gross Rental Yield:** $\text{Yield}_{\text{gross}} = \frac{\text{Rent}_{\text{annual}}}{\text{Price}_{\text{purchase}}} \times 100$
- **Net Rental Yield:** $\text{Yield}_{\text{net}} = \frac{\text{Rent}_{\text{annual}} \times 0.95}{\text{Price}_{\text{purchase}} \times 1.04 + 4200} \times 100$
- **Capital Gain (3-Yr):** $\text{Price}_{\text{future}} = \text{Price}_{\text{purchase}} \times (1 + r)^3$
