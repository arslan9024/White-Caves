# Commission Tracking Feature

**Status**: Production Ready ✅  
**Last Updated**: February 2026  
**Priority**: High  
**Completion**: 100%

---

## Overview

Commission Tracking is a critical feature that automates calculation, approval, and payment tracking of commissions earned by agents. It provides transparency, prevents disputes, and ensures timely payments.

### Purpose
Enable agents to track their earnings in real-time while providing managers and accounting teams with a complete, auditable record of all commission transactions.

### Business Value
- **Transparency**: Agents see exactly how commissions are calculated
- **Dispute Prevention**: Automated calculation reduces manual errors
- **Compliance**: Audit trail for financial review and compliance
- **Efficiency**: Automated workflows reduce manual processing
- **Motivation**: Clear earning visibility motivates agent performance

---

## User Stories

### Agent Perspective
- **As an** agent, **I want to** see my real-time commission earnings, **so that** I understand my income
- **As an** agent, **I want to** track commission status (pending, approved, paid), **so that** I know when payments arrive
- **As an** agent, **I want to** dispute incorrect commissions, **so that** errors are corrected
- **As an** agent, **I want to** export my commission history, **so that** I can track for tax purposes

### Manager Perspective
- **As a** manager, **I want to** review and approve commissions, **so that** I ensure accuracy
- **As a** manager, **I want to** view team commission analytics, **so that** I understand team performance
- **As a** manager, **I want to** adjust commissions when needed, **so that** I can correct errors or adjust for special deals

### Accounting Perspective
- **As an** accountant, **I want to** export commission data for payroll, **so that** I can process payments
- **As an** accountant, **I want to** view audit trail of all commission changes, **so that** I ensure compliance
- **As an** accountant, **I want to** reconcile commission calculations, **so that** I catch discrepancies

---

## Key Capabilities

### Automatic Calculation
- **Calculate** commissions based on deal value and commission rules
- **Apply** different rates for different property types
- **Handle** splits between multiple agents on same deal
- **Track** bonuses, deductions, and adjustments
- **Process** recurring commissions (rentals, management fees)

### Commission Workflow
- **Pending**: Initial calculation, awaiting approval
- **Approved**: Manager approved, ready for payment
- **Paid**: Payment processed and tracked
- **Disputed**: Agent/manager flagged for review
- **Adjusted**: Commission modified with reason/note

### Rules Engine
- **Base Commission**: Percentage of deal value
- **Property Type Rates**: Different rates by property type
- **Agent Tiers**: Different rates by agent tenure/performance
- **Bonus Structure**: Bonuses for exceeding targets
- **Team Splits**: Splits when multiple agents involved
- **Manual Adjustments**: Special rates and accommodations

### Dispute Management
- **Create**: Agent/manager can create dispute
- **Document**: Provide evidence and explanation
- **Review**: Manager/accounting review and decision
- **Resolve**: Adjust commission and close dispute
- **History**: Keep complete dispute history

### Reporting & Analytics
- **Commission Summary**: By agent, period, property type
- **Performance Analysis**: Top earners, trends over time
- **Payment History**: When/how much paid to each agent
- **Variance Analysis**: Actual vs. expected commissions
- **Tax Reports**: Annual totals by agent for tax reporting

---

## User Interface

### Agent Commission Dashboard
**Screen**: My Commissions  
**Key Elements**:
- **Summary Cards**: Total earned, pending, approved, paid
- **Commission List**: All commissions with status indicators
- **Filter Options**: By date range, property type, status
- **Action Buttons**: View details, dispute, export
- **Timeline Chart**: Earnings trend over last 12 months

### Commission Detail View
**Screen**: Commission Details  
**Key Sections**:
- **Deal Info**: Property, client, closing date
- **Calculation Breakdown**: Base rate, adjustments, final amount
- **Status & Timeline**: Current status and dates
- **Payment Info**: Payment date, method, reference
- **Notes**: Any comments or disputes
- **Action Options**: Dispute or request adjustment

### Manager Review Dashboard
**Screen**: Commission Review  
**Key Elements**:
- **Pending Commissions**: Queue of submissions awaiting approval
- **Team Analytics**: Performance by agent and property type
- **Approval Interface**: Review calculations, approve/reject/adjust
- **Dispute Queue**: Open disputes requiring resolution
- **Reports**: Analytics and summary reports

### Commission Calculation Breakdown
**Display**: Transparent calculation showing:
```
Deal Value:              AED 500,000
Base Commission Rate:              3%
Calculation:             500,000 × 3% = AED 15,000

Adjustments:
  - Team Lead Bonus:     +AED 1,000
  - Performance Bonus:   +AED 500
  - Deduction (Discount): -AED 200
  
Final Commission:        AED 16,300
```

---

## Business Rules

### Commission Rates
**Property Sales**:
- Standard: 2-3% of sale price
- Senior Agents (3+ years): 3.5%
- Team Lead: Additional 0.5%

**Property Rentals**:
- One-time: 1% of annual rent
- Recurring (annual): 0.5% of annual rent

**Property Management**:
- Management Fee: 3-5% of collected rent
- Maintenance Coordination: Flat fees per service

### Commission Splits
- **Single Agent**: 100% to agent, 0% to company
- **Co-listing**: Split agreed by agents (50/50 typical)
- **Team Lead**: Team lead gets override percentage
- **Broker**: Company takes agreed percentage

### Payment Terms
- **Calculation Deadline**: Within 5 business days of closing
- **Approval Deadline**: Manager approval within 3 business days
- **Payment Date**: 15th or last day of month
- **Payment Method**: Direct bank transfer

### Approval Requirements
- **Agents**: Can view all their commissions
- **Managers**: Must approve all team commissions before payment
- **Finance**: Reviews before processing payment
- **CEO**: May override for special circumstances

### Dispute Handling
- **Timeframe**: Must dispute within 30 days of calculation
- **Evidence**: Must provide documentation supporting dispute
- **Resolution**: 10 business days target for review
- **Appeal**: One appeal allowed, then CEO final decision

---

## Integration Points

### With Other CRM Features
- **Deals/Leads**: Commissions tied to deal closing
- **Clients**: Track revenue by client
- **Agents**: Performance metrics by agent
- **Properties**: Revenue by property type

### With External Systems
- **Payroll**: Export for salary/payment processing
- **Accounting**: Export for financial statements
- **Tax**: Generate 1099 or equivalent reports
- **Analytics**: Feed into business intelligence

---

## Metrics & KPIs

### Agent Metrics
- **Total Commissions**: All-time earnings
- **YTD Commissions**: Year-to-date earnings
- **Monthly Average**: Average monthly commission
- **Commission Trend**: Performance trajectory
- **Conversion Rate**: Deals per interaction ratio

### Team Metrics
- **Team Commission Pool**: Total team earnings
- **Top Earner**: Highest earning agent
- **Average Commission**: Team average per agent
- **Payout Ratio**: Commission as % of revenue
- **Payment Timeliness**: % paid on schedule

### Business Metrics
- **Total Payouts**: All-time total commission payments
- **Monthly Trend**: Month-over-month comparison
- **Agent Count**: Number of earning agents
- **Revenue per Agent**: Total revenue ÷ agent count
- **Commission Rate Health**: Monitoring rate consistency

---

## Related Features

### Depends On
- **Deal/Lead Management**: Closing deals triggers commissions
- **Client Management**: Track revenue by client
- **Agent Management**: Track earnings by agent
- **Financial System**: Database of transactions

### Used By
- **Payroll System**: For payment processing
- **Financial Reporting**: For P&L and tax reports
- **Agent Analytics**: For performance evaluation
- **Business Intelligence**: For trend analysis

---

## FAQ

**Q: How are disputed commissions handled?**  
A: Both parties present evidence. Manager/CEO reviews and makes final decision within 10 business days.

**Q: Can commissions be adjusted after payment?**  
A: Yes, with proper documentation. Creates new adjustment record. Affects next payment.

**Q: What if a deal falls through after commission is paid?**  
A: Commission is clawed back from next payment or by mutual agreement.

**Q: How are team lead overrides applied?**  
A: Team lead receives percentage (usually 10-20%) of team members' commissions.

**Q: Can agents negotiate custom commission rates?**  
A: Special rates require manager/CEO approval and must be documented.

**Q: Is there a minimum commission threshold?**  
A: No, but very small deals may have fixed minimum commission.

**Q: How long is commission history maintained?**  
A: Permanently stored. Can export annual summaries for tax purposes.

---

## Technical Specifications

### Commission Calculation Engine
- **System**: Custom rules engine in backend service
- **Triggers**: Upon deal status change to "Closed"
- **Processing**: Async job within 5 minutes
- **Storage**: MongoDB collections for commissions
- **API**: RESTful endpoints for CRUD operations
- **Testing**: 100% test coverage for all scenarios

### Audit Trail
Every commission change logs:
- Timestamp
- User making change
- Previous value
- New value
- Reason/comment
- Related transaction ID

### Error Handling
- Invalid calculation → Manual review queue
- Missing required data → Notification to manager
- System failure → Retry with exponential backoff
- Overpayment → Flag for immediate review

---

## Change Log

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | Feb 2026 | Initial launch with core features |
| | | Auto calculation |
| | | Approval workflow |
| | | Dispute management |
| | | Basic reporting |
| | | Production-ready |

---

## Future Enhancements

- ⏳ Advanced bonus structures (Q2 2026)
- ⏳ Predictive earnings forecasting (Q2 2026)
- ⏳ Integration with accounting software (Q3 2026)
- ⏳ Mobile commission tracking app (Q3 2026)

---

**For Implementation Details**: See `/plans/API_DOCUMENTATION.md`  
**For Integration**: Contact backend development team  
**For Questions**: Email finance or product team
