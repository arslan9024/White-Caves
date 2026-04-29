import CompliancePolicy from '../../models/compliance/CompliancePolicy.js';
import ApprovalWorkflow from '../../models/compliance/ApprovalWorkflow.js';

/**
 * CompliancePolicyService
 * Manages creation, approval, versioning, and publication of AML/CFT compliance policies
 */

class CompliancePolicyService {
  /**
   * Create a new compliance policy
   */
  async createPolicy(policyData, createdBy, ipAddress) {
    try {
      const policy = new CompliancePolicy({
        ...policyData,
        createdBy,
        status: 'draft',
        version: { major: 1, minor: 0, patch: 0 }
      });

      // Add initial audit trail entry
      policy.auditTrail.push({
        action: 'policy_created',
        actor: createdBy,
        timestamp: new Date(),
        details: `Policy created: ${policyData.title}`,
        ipAddress
      });

      await policy.save();
      return policy;
    } catch (error) {
      throw new Error(`Failed to create policy: ${error.message}`);
    }
  }

  /**
   * Update policy content
   */
  async updatePolicyContent(policyId, newContent, updatedBy, ipAddress) {
    try {
      const policy = await CompliancePolicy.findById(policyId);
      if (!policy) throw new Error('Policy not found');

      // Save current version to history
      policy.versionHistory.push({
        version: policy.versionString,
        content: policy.content,
        createdDate: new Date(),
        createdBy: policy.updatedBy,
        status: policy.status
      });

      // Update content
      policy.content = newContent;
      policy.updatedBy = updatedBy;

      // Add audit trail
      policy.auditTrail.push({
        action: 'content_updated',
        actor: updatedBy,
        timestamp: new Date(),
        details: 'Policy content updated',
        ipAddress
      });

      await policy.save();
      return policy;
    } catch (error) {
      throw new Error(`Failed to update policy content: ${error.message}`);
    }
  }

  /**
   * Submit policy for review
   */
  async submitForReview(policyId, submittedBy, comments, ipAddress) {
    try {
      const policy = await CompliancePolicy.findById(policyId);
      if (!policy) throw new Error('Policy not found');

      if (policy.status !== 'draft') {
        throw new Error('Only draft policies can be submitted for review');
      }

      policy.status = 'under_review';
      policy.submittedBy = submittedBy;

      // Add audit trail
      policy.auditTrail.push({
        action: 'submitted_for_review',
        actor: submittedBy,
        timestamp: new Date(),
        details: comments || 'Policy submitted for review',
        ipAddress
      });

      await policy.save();

      // Create approval workflow
      await this.createApprovalWorkflow(policyId, policy.policyType, submittedBy);

      return policy;
    } catch (error) {
      throw new Error(`Failed to submit policy for review: ${error.message}`);
    }
  }

  /**
   * Create approval workflow for policy
   */
  async createApprovalWorkflow(policyId, policyType, submittedBy) {
    try {
      // Define approval stages based on policy type
      const stages = [
        {
          order: 1,
          stageName: 'Compliance Review',
          assignedTo: { name: 'Arslan Malik', role: 'Compliance Officer' },
          dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) // 3 days
        },
        {
          order: 2,
          stageName: 'Legal Review',
          assignedTo: { name: 'Anna Petrova', role: 'Legal Counsel' },
          dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000) // 5 days
        },
        {
          order: 3,
          stageName: 'CEO Review',
          assignedTo: { name: 'Arslan Malik', role: 'CEO/Owner' },
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
          signingRequired: true
        }
      ];

      if (policyType === 'AML_CFT') {
        stages.push({
          order: 4,
          stageName: 'Board Approval',
          assignedTo: { name: 'Board', role: 'Board of Directors' },
          dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days
          signingRequired: true
        });
      }

      const workflow = new ApprovalWorkflow({
        documentId: policyId,
        documentType: 'CompliancePolicy',
        workflowType: 'policy_approval',
        stages,
        currentStage: 1,
        overallStatus: 'in_progress',
        submittedBy: {
          name: submittedBy,
          submitDate: new Date()
        },
        sla: {
          daysAllowed: 7,
          daysUsed: 0
        }
      });

      await workflow.save();
      return workflow;
    } catch (error) {
      throw new Error(`Failed to create approval workflow: ${error.message}`);
    }
  }

  /**
   * Approve a policy stage
   */
  async approveStage(policyId, stageIndex, approverId, approverName, ipAddress) {
    try {
      const policy = await CompliancePolicy.findById(policyId);
      if (!policy) throw new Error('Policy not found');

      const workflow = await ApprovalWorkflow.findOne({ documentId: policyId });
      if (!workflow) throw new Error('Approval workflow not found');

      const stage = workflow.stages[stageIndex];
      if (!stage) throw new Error('Stage not found');

      // Update stage status
      stage.status = 'approved';
      stage.completedDate = new Date();
      stage.reviewedBy = {
        name: approverName,
        id: approverId,
        timestamp: new Date()
      };

      // Move to next stage if available
      if (stageIndex < workflow.stages.length - 1) {
        workflow.currentStage = stageIndex + 2;
        workflow.stages[stageIndex + 1].status = 'in_progress';
        workflow.stages[stageIndex + 1].startedDate = new Date();
      } else {
        // All stages completed
        workflow.overallStatus = 'completed';
        workflow.completionDetails = {
          completedDate: new Date(),
          completedBy: approverName,
          finalApprover: approverName,
          completionStatus: 'approved'
        };

        // Update policy status
        policy.status = 'approved';
        policy.lastReviewDate = new Date();

        // Add approval chain entry
        const approvalEntry = policy.approvalChain.find(a => a.stage === stage.stageName.toLowerCase().replace(' ', '_'));
        if (approvalEntry) {
          approvalEntry.status = 'approved';
          approvalEntry.approverName = approverName;
          approvalEntry.approverId = approverId;
          approvalEntry.approvalDate = new Date();
        }
      }

      // Add audit trails
      workflow.auditTrail.push({
        action: 'stage_approved',
        actor: approverName,
        actorId: approverId,
        timestamp: new Date(),
        details: `Stage "${stage.stageName}" approved`,
        ipAddress,
        stageNumber: stageIndex
      });

      policy.auditTrail.push({
        action: 'approval_stage_completed',
        actor: approverName,
        actorId: approverId,
        timestamp: new Date(),
        details: `${stage.stageName} stage approved by ${approverName}`,
        ipAddress
      });

      await workflow.save();
      await policy.save();

      return { policy, workflow };
    } catch (error) {
      throw new Error(`Failed to approve stage: ${error.message}`);
    }
  }

  /**
   * Reject a policy stage
   */
  async rejectStage(policyId, stageIndex, rejectorId, rejectorName, rejectionReason, ipAddress) {
    try {
      const policy = await CompliancePolicy.findById(policyId);
      if (!policy) throw new Error('Policy not found');

      const workflow = await ApprovalWorkflow.findOne({ documentId: policyId });
      if (!workflow) throw new Error('Approval workflow not found');

      const stage = workflow.stages[stageIndex];
      if (!stage) throw new Error('Stage not found');

      // Update stage status
      stage.status = 'rejected';
      stage.rejectionReason = rejectionReason;
      stage.completedDate = new Date();

      // Update workflow
      workflow.overallStatus = 'rejected';
      workflow.completionDetails = {
        completedDate: new Date(),
        completedBy: rejectorName,
        completionStatus: 'rejected',
        completionNotes: rejectionReason
      };

      // Update policy
      policy.status = 'draft'; // Return to draft for modifications

      // Add audit trails
      workflow.auditTrail.push({
        action: 'stage_rejected',
        actor: rejectorName,
        actorId: rejectorId,
        timestamp: new Date(),
        details: `Stage "${stage.stageName}" rejected: ${rejectionReason}`,
        ipAddress,
        stageNumber: stageIndex
      });

      policy.auditTrail.push({
        action: 'approval_stage_rejected',
        actor: rejectorName,
        actorId: rejectorId,
        timestamp: new Date(),
        details: `${stage.stageName} stage rejected. Reason: ${rejectionReason}`,
        ipAddress
      });

      await workflow.save();
      await policy.save();

      return { policy, workflow };
    } catch (error) {
      throw new Error(`Failed to reject stage: ${error.message}`);
    }
  }

  /**
   * Sign a policy (digital signature)
   */
  async signPolicy(policyId, stageIndex, signerName, signerId, signatureData, ipAddress, deviceInfo) {
    try {
      const policy = await CompliancePolicy.findById(policyId);
      if (!policy) throw new Error('Policy not found');

      const workflow = await ApprovalWorkflow.findOne({ documentId: policyId });
      if (!workflow) throw new Error('Approval workflow not found');

      const stage = workflow.stages[stageIndex];
      if (!stage) throw new Error('Stage not found');

      // Add signature to stage
      stage.signingDetails = {
        method: 'digital',
        signatureUrl: signatureData.url,
        signedBy: signerName,
        signedDate: new Date(),
        ipAddress,
        deviceInfo
      };
      stage.signatureStatus = 'signed';

      // Add signature to policy
      policy.signatures.push({
        signedBy: signerName,
        signerName,
        signerId,
        role: stage.stageName,
        signatureDate: new Date(),
        method: 'digital',
        signatureUrl: signatureData.url,
        ipAddress,
        deviceInfo
      });

      // Add audit trail
      policy.auditTrail.push({
        action: 'document_signed',
        actor: signerName,
        actorId: signerId,
        timestamp: new Date(),
        details: `Policy signed by ${signerName} (${stage.stageName})`,
        ipAddress
      });

      await workflow.save();
      await policy.save();

      return { policy, workflow };
    } catch (error) {
      throw new Error(`Failed to sign policy: ${error.message}`);
    }
  }

  /**
   * Publish policy (make it active)
   */
  async publishPolicy(policyId, publishedBy, ipAddress) {
    try {
      const policy = await CompliancePolicy.findById(policyId);
      if (!policy) throw new Error('Policy not found');

      if (policy.status !== 'approved' && policy.status !== 'signed') {
        throw new Error('Only approved/signed policies can be published');
      }

      policy.status = 'active';
      policy.publishedAt = new Date();
      policy.publishedBy = publishedBy;
      policy.effectiveDate = new Date();

      // Calculate next review date (1 year from now)
      const nextReview = new Date();
      nextReview.setFullYear(nextReview.getFullYear() + 1);
      policy.nextReviewDate = nextReview;

      policy.auditTrail.push({
        action: 'policy_published',
        actor: publishedBy,
        timestamp: new Date(),
        details: `Policy published and activated. Effective date: ${policy.effectiveDate}`,
        ipAddress
      });

      await policy.save();
      return policy;
    } catch (error) {
      throw new Error(`Failed to publish policy: ${error.message}`);
    }
  }

  /**
   * Generate PDF version of policy
   */
  async generatePDF(policyId) {
    try {
      const policy = await CompliancePolicy.findById(policyId);
      if (!policy) throw new Error('Policy not found');

      // This would integrate with a PDF generation library (pdfkit, puppeteer, etc.)
      // For now, return the HTML content
      return {
        title: policy.title,
        version: policy.versionString,
        status: policy.status,
        effectiveDate: policy.effectiveDate,
        content: policy.content,
        signatures: policy.signatures,
        createdAt: policy.createdAt
      };
    } catch (error) {
      throw new Error(`Failed to generate PDF: ${error.message}`);
    }
  }

  /**
   * Get version history
   */
  async getVersionHistory(policyId) {
    try {
      const policy = await CompliancePolicy.findById(policyId).select('versionHistory title policyType');
      if (!policy) throw new Error('Policy not found');

      return {
        policyTitle: policy.title,
        policyType: policy.policyType,
        versions: policy.versionHistory
      };
    } catch (error) {
      throw new Error(`Failed to get version history: ${error.message}`);
    }
  }

  /**
   * Archive policy
   */
  async archivePolicy(policyId, reason, archivedBy, ipAddress) {
    try {
      const policy = await CompliancePolicy.findById(policyId);
      if (!policy) throw new Error('Policy not found');

      policy.status = 'archived';
      policy.archivedAt = new Date();
      policy.archivedBy = archivedBy;
      policy.archivedReason = reason;

      policy.auditTrail.push({
        action: 'policy_archived',
        actor: archivedBy,
        timestamp: new Date(),
        details: `Policy archived. Reason: ${reason}`,
        ipAddress
      });

      await policy.save();
      return policy;
    } catch (error) {
      throw new Error(`Failed to archive policy: ${error.message}`);
    }
  }

  /**
   * Get compliance status summary
   */
  async getComplianceStatus() {
    try {
      const allPolicies = await CompliancePolicy.find({ status: { $in: ['active', 'approved'] } });
      
      const status = {
        activePolicies: allPolicies.filter(p => p.status === 'active').length,
        approvedPolicies: allPolicies.filter(p => p.status === 'approved').length,
        policiesNeedingReview: allPolicies.filter(p => p.nextReviewDate && p.nextReviewDate < new Date()).length,
        upcomingReviews: allPolicies.map(p => ({
          title: p.title,
          nextReviewDate: p.nextReviewDate,
          daysUntilReview: Math.ceil((p.nextReviewDate - new Date()) / (1000 * 60 * 60 * 24))
        })).sort((a, b) => a.daysUntilReview - b.daysUntilReview).slice(0, 5)
      };

      return status;
    } catch (error) {
      throw new Error(`Failed to get compliance status: ${error.message}`);
    }
  }
}

export default new CompliancePolicyService();
