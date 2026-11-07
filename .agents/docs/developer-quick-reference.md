# White Caves Compliance System - Developer Quick Reference Guide

## Quick Start: Using the Compliance APIs

### 1. Creating a CDD Record

```javascript
// POST /api/compliance/cdd
const cddPayload = {
  customerId: "CUST-001",
  customerName: "John Al Marri",
  customerType: "individual", // or "entity"
  customerEmail: "john@example.com",
  customerPhone: "+971-4-XXX-XXXX",
  nationality: "UAE",
  dateOfBirth: "1985-06-15",
  residentialAddress: {
    street: "123 Sheikh Zayed Road",
    city: "Dubai",
    emirate: "Dubai",
    country: "UAE"
  },
  sourceOfFunds: "salary_employment",
  sourceOfFundsDocumentation: [
    {
      documentType: "employment_letter",
      documentName: "Employment_Letter_2024.pdf",
      filePath: "/uploads/cdd/emp-letter.pdf"
    }
  ],
  pepStatus: "no",
  riskAssessmentOfficerId: "OFFICER-001",
  riskAssessmentOfficerName: "Sarah Ahmed"
};

// Response: Created CDD record with riskLevel, approval status
```

### 2. Performing PEP Screening

```javascript
// POST /api/compliance/cdd/{customerId}/pep-screening
const pepPayload = {
  customerName: "John Al Marri",
  nationality: "UAE"
};

// Response includes screening results from:
// - OFAC SDN List
// - UN Sanctions List
// - UAE FIU PEP List
// - DFSA Enforcement List
// - EU Consolidated Sanctions List
```

### 3. Approving a CDD Record

```javascript
// POST /api/compliance/cdd/{customerId}/approve
const approvalPayload = {
  comments: "Customer approved for transactions up to AED 5,000,000",
  conditions: [
    {
      condition: "Obtain updated address verification within 30 days",
      dueDate: "2024-01-20"
    }
  ]
};

// Response: Updated CDD with approval status and audit trail
```

### 4. Filing an STR with FIU

```javascript
// POST /api/compliance/goaml/str
const strPayload = {
  registrationId: "REG-WHITE-CAVES-001",
  transactionId: "TXN-12345",
  customerName: "John Al Marri",
  customerEmail: "john@example.com",
  transactionDate: "2024-12-15",
  transactionAmount: 8500000,
  suspiciousIndicators: [
    "unusual_transaction_amount",
    "offshore_involvement",
    "cash_transaction"
  ],
  detailedDescription: "Customer attempting to purchase property for cash above customer profile average. Third-party involvement unclear.",
  reportingOfficerId: "OFFICER-001",
  reportingOfficerName: "Sarah Ahmed"
};

// Response: STR number, FIU reference, submission confirmation
```

### 5. Creating an Approval Workflow

```javascript
// POST /api/compliance/workflow
const workflowPayload = {
  documentType: "compliance_policy",
  documentId: "POL-001",
  documentTitle: "Updated AML/CFT Policy 2024",
  documentContent: "<html>Policy content...</html>",
  initiatorId: "OFFICER-001",
  initiatorName: "Sarah Ahmed",
  approvalStages: [
    {
      name: "Compliance Officer Review",
      approvers: [
        {
          approverId: "OFFICER-001",
          name: "Sarah Ahmed",
          email: "sarah@whitecaves.ae"
        }
      ]
    },
    {
      name: "Management Approval",
      approvers: [
        {
          approverId: "MGR-001",
          name: "Hassan Al Mansoori",
          email: "hassan@whitecaves.ae"
        }
      ]
    }
  ],
  dueDate: "2024-12-31"
};

// Response: Workflow created, notifications sent to first stage approvers
```

### 6. Approving a Document in Workflow

```javascript
// POST /api/compliance/workflow/{workflowId}/approve
const approvePayload = {
  comments: "Policy reviewed and approved",
  signatureMethod: "digital", // or "esignature", "manual"
  signatureData: "base64_encoded_signature_data"
};

// Response: Workflow progresses to next stage, approvers notified
```

---

## Service Method Reference

### CustomerDueDiligenceService

```javascript
// Create CDD record
await CustomerDueDiligenceService.createCDDRecord(cddData);

// Perform PEP screening
await CustomerDueDiligenceService.performPEPScreening(customerId, customerName, nationality);

// Perform EDD
await CustomerDueDiligenceService.performEnhancedDueDiligence(customerId, eddData);

// Approve CDD
await CustomerDueDiligenceService.approveCDD(customerId, approvalData);

// Reject CDD
await CustomerDueDiligenceService.rejectCDD(customerId, rejectionData);

// Get CDD record
const cdd = await CustomerDueDiligenceService.getCDDRecord(customerId);

// Get audit trail
const trail = await CustomerDueDiligenceService.getCDDAuditTrail(customerId);

// Search CDD records
const records = await CustomerDueDiligenceService.searchCDDRecords({ riskLevel: 'high' });
```

### GoAMLRegistrationService

```javascript
// Initialize registration
await GoAMLRegistrationService.initializeCompanyRegistration(companyData);

// Validate data
const validation = await GoAMLRegistrationService.validateRegistrationData(registrationId);

// Submit to goAML
await GoAMLRegistrationService.submitToGoAMLPortal(registrationId, portalCredentials);

// File STR
await GoAMLRegistrationService.fileSuspiciousTransactionReport(strData);

// Check account status
await GoAMLRegistrationService.checkGoAMLAccountStatus(registrationId);

// Get registration details
await GoAMLRegistrationService.getRegistrationDetails(registrationId);

// Get registrations (with filters)
await GoAMLRegistrationService.getRegistrations({ status: 'submitted' });

// Get STR filing history
await GoAMLRegistrationService.getSTRFilingHistory(registrationId);

// Upload supporting documents
await GoAMLRegistrationService.uploadSupportingDocuments(registrationId, documents);
```

### ApprovalWorkflowService

```javascript
// Create workflow
await ApprovalWorkflowService.createWorkflow(workflowData);

// Approve document
await ApprovalWorkflowService.approveDocument(workflowId, approvalData);

// Reject document
await ApprovalWorkflowService.rejectDocument(workflowId, rejectionData);

// Get workflow status
await ApprovalWorkflowService.getWorkflowStatus(workflowId);

// Get document workflows
await ApprovalWorkflowService.getDocumentWorkflows(documentId, documentType);

// Get audit trail
await ApprovalWorkflowService.getAuditTrail(workflowId);

// Get pending approvals for user
await ApprovalWorkflowService.getPendingApprovalsForUser(userId, userEmail);

// Generate certificate
await ApprovalWorkflowService.generateApprovalCertificate(workflowId);

// Export as PDF
await ApprovalWorkflowService.exportWorkflowAsPDF(workflowId);
```

### CompliancePolicyService

```javascript
// Create policy
await CompliancePolicyService.createPolicy(policyData, officerId, officerName);

// Approve policy
await CompliancePolicyService.approvePolicy(policyId, approverId, approverName, comments);

// Get policies
await CompliancePolicyService.getPolicies(filters);

// Get policy by ID
await CompliancePolicyService.getPolicyById(policyId);

// Get policy audit trail
await CompliancePolicyService.getPolicyAuditTrail(policyId);
```

---

## Common Use Cases

### Use Case 1: New Customer Onboarding with Compliance Checks

```javascript
// Step 1: Create CDD record
const cddRecord = await CustomerDueDiligenceService.createCDDRecord({
  customerId: req.body.customerId,
  customerName: req.body.customerName,
  customerType: "individual",
  // ... other fields
});

// Step 2: Perform PEP screening
const pepResult = await CustomerDueDIligenceService.performPEPScreening(
  customerId,
  customerName,
  nationality
);

// Step 3: If high-risk, perform EDD
if (pepResult.overallResult === 'hit') {
  const eddResult = await CustomerDueDiligenceService.performEnhancedDueDiligence(
    customerId,
    { eddOfficerId, eddOfficerName, /* ... */ }
  );
}

// Step 4: Approve CDD
const approval = await CustomerDueDiligenceService.approveCDD(
  customerId,
  { approverId, approverName, /* ... */ }
);

// Step 5: Customer can now transact
return { success: true, cddStatus: approval.approvalStatus };
```

### Use Case 2: Suspicious Transaction Reporting

```javascript
// Step 1: Identify suspicious transaction
const suspiciousTransaction = await Transaction.findById(transactionId);

if (shouldFlagForSTR(suspiciousTransaction)) {
  // Step 2: Get goAML registration
  const registration = await GoAMLRegistrationService.getRegistrationDetails(registrationId);

  // Step 3: File STR
  const str = await GoAMLRegistrationService.fileSuspiciousTransactionReport({
    registrationId,
    transactionId: suspiciousTransaction._id,
    customerName: suspiciousTransaction.customerName,
    customerEmail: suspiciousTransaction.customerEmail,
    transactionDate: suspiciousTransaction.date,
    transactionAmount: suspiciousTransaction.amount,
    suspiciousIndicators: identifyIndicators(suspiciousTransaction),
    detailedDescription: generateSTRDescription(suspiciousTransaction),
    reportingOfficerId: req.user.id,
    reportingOfficerName: req.user.name
  });

  // Step 4: Block transaction from proceeding
  await Transaction.updateOne({ _id: transactionId }, { status: 'blocked_for_str' });

  // Step 5: Notify management
  notifyManagement(`STR filed: ${str.strNumber}`);
}
```

### Use Case 3: Policy Approval Workflow

```javascript
// Step 1: Create new AML policy
const policy = await CompliancePolicyService.createPolicy(
  { policyType: 'aml', policyContent: '...', /* ... */ },
  officerId,
  officerName
);

// Step 2: Create approval workflow
const workflow = await ApprovalWorkflowService.createWorkflow({
  documentType: 'compliance_policy',
  documentId: policy._id,
  documentTitle: policy.title,
  documentContent: policy.policyContent,
  initiatorId: officerId,
  initiatorName: officerName,
  approvalStages: [
    { name: 'Compliance Officer Review', approvers: [/* ... */] },
    { name: 'Management Approval', approvers: [/* ... */] }
  ]
});

// Step 3: Compliance officer approves
await ApprovalWorkflowService.approveDocument(workflow._id, {
  approverId: coId,
  approverName: coName,
  comments: 'Reviewed and approved',
  signatureMethod: 'digital'
});

// Step 4: Manager approves
await ApprovalWorkflowService.approveDocument(workflow._id, {
  approverId: mgmtId,
  approverName: mgmtName,
  comments: 'Approved for implementation',
  signatureMethod: 'digital'
});

// Step 5: Generate certificate
const certificate = await ApprovalWorkflowService.generateApprovalCertificate(workflow._id);

// Step 6: Policy becomes effective
await CompliancePolicyService.approvePolicy(policy._id, mgmtId, mgmtName);
```

---

## Error Handling Examples

```javascript
// Wrap service calls in try-catch
try {
  const cddRecord = await CustomerDueDiligenceService.createCDDRecord(cddData);
} catch (error) {
  if (error.message.includes('already exists')) {
    // CDD already created - get existing record
    const existingCDD = await CustomerDueDiligenceService.getCDDRecord(customerId);
    return res.status(409).json({ message: 'CDD already exists', data: existingCDD });
  } else if (error.message.includes('Missing required')) {
    // Validation error
    return res.status(400).json({ message: error.message });
  } else {
    // Server error
    logger.error(`CDD creation failed: ${error.message}`);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
```

---

## Database Query Examples

```javascript
// Find high-risk customers
const highRiskCustomers = await CustomerDueDiligence.find({
  riskLevel: 'high'
}).select('customerId customerName riskLevel pepStatus');

// Find pending CDD approvals
const pendingApprovals = await CustomerDueDiligence.find({
  approvalStatus: 'pending_approval'
}).sort({ createdDate: -1 });

// Find PEP hits
const pepCustomers = await CustomerDueDiligence.find({
  pepStatus: 'yes'
});

// Find STRs filed in last 30 days
const recentSTRs = await GoAMLRegistration.find({
  'str_filings.submissionDate': {
    $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  }
}).select('companyName str_filings');
```

---

## Frontend Integration Tips

### Redux State Structure
```javascript
{
  compliance: {
    cdd: {
      records: [],
      selectedRecord: null,
      loading: false,
      error: null
    },
    workflows: {
      pendingApprovals: [],
      completedWorkflows: [],
      loading: false
    },
    goaml: {
      registration: null,
      strHistory: [],
      loading: false
    }
  }
}
```

### Component Example
```javascript
// CDD Form Component
function CDDForm({ customerId }) {
  const dispatch = useDispatch();
  const { loading, error } = useSelector(state => state.compliance.cdd);

  const handleSubmit = async (formData) => {
    dispatch(createCDD(formData));
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <button type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'Create CDD'}
      </button>
      {error && <p className="error">{error}</p>}
    </form>
  );
}
```

---

## Testing Checklist

- [ ] Create CDD record for individual
- [ ] Create CDD record for entity with beneficial owners
- [ ] Perform PEP screening (should return "clear")
- [ ] Perform EDD for high-risk customer
- [ ] Approve CDD with conditions
- [ ] Reject CDD with correction requirements
- [ ] Create approval workflow with 2 stages
- [ ] Approve document at first stage
- [ ] Move to second stage and approve
- [ ] Generate approval certificate
- [ ] File STR for suspicious transaction
- [ ] Get STR filing history
- [ ] Search CDD records by risk level
- [ ] Get audit trail for workflow

---

## Common Status Values

### CDD Status
- `in_progress` - Being filled out
- `completed` - All information gathered
- `needs_update` - Requires customer re-verification

### Approval Status
- `pending_approval` - Awaiting approval
- `approved` - Approved by authorized user
- `rejected` - Rejected with reason
- `awaiting_correction` - Needs correction before resubmission

### Workflow Status
- `pending` - In progress
- `approved` - All stages completed
- `rejected` - Rejected at a stage

### GoAML Account Status
- `not_created` - Not yet registered
- `created` - Company registered on portal
- `inactive` - Account needs reactivation
- `suspended` - Contact FIU

---

## Important Security Notes

⚠️ **Never disclose STR filing to customer** - This is a criminal offense under UAE law  
⚠️ **Keep sensitive documents encrypted** - Customer IDs, source of funds details  
⚠️ **Maintain audit trails** - All compliance actions must be logged  
⚠️ **Verify approver authorization** - Always check user role before allowing approvals  
⚠️ **Document all decisions** - Every rejection or approval needs clear reasoning  

---

## Support Resources

- **API Documentation**: See each service's JSDoc comments
- **Compliance Master Plan**: `plans/COMPLIANCE/WHITE_CAVES_AML_FIU_COMPLIANCE_MASTER_PLAN.md`
- **Implementation Guide**: `plans/COMPLIANCE/PHASE_2_IMPLEMENTATION_SUMMARY.md`
- **Database Models**: `server/models/compliance/` directory

---

**Last Updated:** December 19, 2024  
**Version:** 1.0  
**Status:** Ready for Development
