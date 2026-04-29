/**
 * ApprovalWorkflowService.js
 * Manages digital approval workflows for compliance documents
 * Supports multi-stage approvals, signature tracking, and audit trails
 */

const ApprovalWorkflow = require('../models/compliance/ApprovalWorkflow');
const CompliancePolicy = require('../models/compliance/CompliancePolicy');
const ComplianceOfficerDesignation = require('../models/compliance/ComplianceOfficerDesignation');
const logger = require('../../config/logger');
const emailService = require('./EmailService');

class ApprovalWorkflowService {
  /**
   * Create a new approval workflow for a compliance document
   * @param {Object} workflowData - Workflow initialization data
   * @returns {Promise<Object>} Created workflow document
   */
  async createWorkflow(workflowData) {
    try {
      const {
        documentType,
        documentId,
        documentTitle,
        documentContent,
        initiatorId,
        initiatorName,
        approvalStages,
        requiredApprovers,
        dueDate,
      } = workflowData;

      // Validate required fields
      if (!documentType || !documentId || !initiatorId || !approvalStages || approvalStages.length === 0) {
        throw new Error('Missing required workflow fields');
      }

      // Create workflow object
      const workflow = new ApprovalWorkflow({
        documentType,
        documentId,
        documentTitle,
        documentContent,
        initiatorId,
        initiatorName,
        approvalStages: approvalStages.map((stage, index) => ({
          stageNumber: index + 1,
          stageName: stage.name,
          requiredApprovers: stage.approvers || [],
          status: 'pending',
          completedAt: null,
          approvals: [],
        })),
        requiredApprovers: requiredApprovers || [],
        status: 'pending',
        dueDate: dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Default: 30 days
        auditTrail: [
          {
            action: 'workflow_created',
            actor: initiatorName,
            actorId: initiatorId,
            details: `Approval workflow initiated for ${documentTitle}`,
            timestamp: new Date(),
          },
        ],
      });

      // Save to database
      await workflow.save();

      logger.info(`Approval workflow created: ${workflow._id} for ${documentType} ${documentId}`);

      // Notify first stage approvers
      await this.notifyApprovers(workflow._id, 1);

      return workflow;
    } catch (error) {
      logger.error(`Error creating approval workflow: ${error.message}`);
      throw error;
    }
  }

  /**
   * Approve a document at the current stage
   * @param {string} workflowId - Approval workflow ID
   * @param {Object} approvalData - Approval details
   * @returns {Promise<Object>} Updated workflow
   */
  async approveDocument(workflowId, approvalData) {
    try {
      const {
        approverId,
        approverName,
        approverTitle,
        approverEmail,
        comments,
        signatureMethod, // 'digital', 'esignature', 'manual'
        signatureData, // Base64 or digital signature
      } = approvalData;

      const workflow = await ApprovalWorkflow.findById(workflowId);
      if (!workflow) {
        throw new Error('Workflow not found');
      }

      // Find current stage
      const currentStage = workflow.approvalStages.find((s) => s.status === 'pending');
      if (!currentStage) {
        throw new Error('No pending approval stages found');
      }

      // Check if approver is authorized for this stage
      const isAuthorized = currentStage.requiredApprovers.some(
        (approver) =>
          approver.approverId === approverId || approver.email === approverEmail
      );

      if (!isAuthorized) {
        throw new Error('User is not authorized to approve at this stage');
      }

      // Add approval record
      currentStage.approvals.push({
        approverId,
        approverName,
        approverTitle,
        approverEmail,
        status: 'approved',
        comments: comments || '',
        signatureMethod,
        signatureData: signatureData || null,
        approvalTimestamp: new Date(),
      });

      // Check if all required approvers have approved
      const approversForStage = currentStage.requiredApprovers.length;
      const approvalsCount = currentStage.approvals.filter((a) => a.status === 'approved').length;

      if (approvalsCount === approversForStage) {
        // Move to next stage or complete workflow
        currentStage.status = 'completed';
        currentStage.completedAt = new Date();

        const nextStageIndex = workflow.approvalStages.findIndex((s) => s.status === 'pending');

        if (nextStageIndex === -1) {
          // All stages completed
          workflow.status = 'approved';
          workflow.approvedAt = new Date();

          // Add completion audit trail
          workflow.auditTrail.push({
            action: 'workflow_approved',
            actor: approverName,
            actorId: approverId,
            details: 'All approval stages completed successfully',
            timestamp: new Date(),
          });
        } else {
          // Notify next stage approvers
          workflow.auditTrail.push({
            action: 'stage_completed',
            actor: approverName,
            actorId: approverId,
            details: `Stage ${currentStage.stageNumber} completed. Moving to stage ${nextStageIndex + 1}`,
            timestamp: new Date(),
          });

          await this.notifyApprovers(workflowId, nextStageIndex + 1);
        }
      }

      // Add approval audit trail
      workflow.auditTrail.push({
        action: 'document_approved',
        actor: approverName,
        actorId: approverId,
        details: `${approverName} (${approverTitle}) approved the document${comments ? ': ' + comments : ''}`,
        timestamp: new Date(),
      });

      // Save updated workflow
      await workflow.save();

      logger.info(`Document approved in workflow ${workflowId} by ${approverName}`);

      return workflow;
    } catch (error) {
      logger.error(`Error approving document: ${error.message}`);
      throw error;
    }
  }

  /**
   * Reject a document with reason
   * @param {string} workflowId - Approval workflow ID
   * @param {Object} rejectionData - Rejection details
   * @returns {Promise<Object>} Updated workflow
   */
  async rejectDocument(workflowId, rejectionData) {
    try {
      const {
        approverId,
        approverName,
        rejectionReason,
        requirementsForResubmission,
      } = rejectionData;

      const workflow = await ApprovalWorkflow.findById(workflowId);
      if (!workflow) {
        throw new Error('Workflow not found');
      }

      const currentStage = workflow.approvalStages.find((s) => s.status === 'pending');
      if (!currentStage) {
        throw new Error('No pending approval stages');
      }

      // Record rejection
      currentStage.status = 'rejected';
      currentStage.rejectionReason = rejectionReason;
      currentStage.requirementsForResubmission = requirementsForResubmission || [];

      // Update workflow status
      workflow.status = 'rejected';
      workflow.rejectedAt = new Date();

      // Add audit trail
      workflow.auditTrail.push({
        action: 'document_rejected',
        actor: approverName,
        actorId: approverId,
        details: `Rejection Reason: ${rejectionReason}. Requirements: ${(requirementsForResubmission || []).join(', ')}`,
        timestamp: new Date(),
      });

      await workflow.save();

      // Notify initiator
      await emailService.sendRejectionNotification(workflow, rejectionReason, requirementsForResubmission);

      logger.info(`Document rejected in workflow ${workflowId} by ${approverName}`);

      return workflow;
    } catch (error) {
      logger.error(`Error rejecting document: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get workflow status and history
   * @param {string} workflowId - Approval workflow ID
   * @returns {Promise<Object>} Workflow details
   */
  async getWorkflowStatus(workflowId) {
    try {
      const workflow = await ApprovalWorkflow.findById(workflowId)
        .select(
          'documentType documentTitle status approvalStages auditTrail initiatorName initiatorId createdAt dueDate'
        )
        .lean();

      if (!workflow) {
        throw new Error('Workflow not found');
      }

      // Calculate progress
      const totalStages = workflow.approvalStages.length;
      const completedStages = workflow.approvalStages.filter((s) => s.status === 'completed').length;
      const progressPercentage = (completedStages / totalStages) * 100;

      return {
        ...workflow,
        progressPercentage: Math.round(progressPercentage),
        completedStages,
        totalStages,
      };
    } catch (error) {
      logger.error(`Error retrieving workflow status: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get all workflows for a document
   * @param {string} documentId - Document ID
   * @param {string} documentType - Document type
   * @returns {Promise<Array>} List of workflows
   */
  async getDocumentWorkflows(documentId, documentType) {
    try {
      const workflows = await ApprovalWorkflow.find({
        documentId,
        documentType,
      })
        .select(
          'status documentTitle initiatorName createdAt approvedAt rejectedAt approvalStages'
        )
        .lean();

      return workflows;
    } catch (error) {
      logger.error(`Error retrieving document workflows: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get audit trail for a workflow
   * @param {string} workflowId - Approval workflow ID
   * @returns {Promise<Array>} Audit trail entries
   */
  async getAuditTrail(workflowId) {
    try {
      const workflow = await ApprovalWorkflow.findById(workflowId)
        .select('auditTrail documentTitle')
        .lean();

      if (!workflow) {
        throw new Error('Workflow not found');
      }

      return {
        documentTitle: workflow.documentTitle,
        auditTrail: workflow.auditTrail.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)),
      };
    } catch (error) {
      logger.error(`Error retrieving audit trail: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get pending approvals for a user
   * @param {string} userId - User ID
   * @param {string} userEmail - User email
   * @returns {Promise<Array>} Pending workflows
   */
  async getPendingApprovalsForUser(userId, userEmail) {
    try {
      // Find workflows where this user is an approver in a pending stage
      const workflows = await ApprovalWorkflow.find({
        status: 'pending',
        'approvalStages.status': 'pending',
      })
        .select(
          'documentType documentTitle initiatorName createdAt dueDate approvalStages'
        )
        .lean();

      // Filter to only workflows where user is an approver
      const pendingForUser = workflows.filter((workflow) => {
        const pendingStage = workflow.approvalStages.find((s) => s.status === 'pending');
        if (!pendingStage) return false;

        return pendingStage.requiredApprovers.some(
          (approver) => approver.approverId === userId || approver.email === userEmail
        );
      });

      return pendingForUser;
    } catch (error) {
      logger.error(`Error retrieving pending approvals: ${error.message}`);
      throw error;
    }
  }

  /**
   * Send notifications to approvers for a specific stage
   * @param {string} workflowId - Workflow ID
   * @param {number} stageNumber - Stage number
   * @returns {Promise<void>}
   */
  async notifyApprovers(workflowId, stageNumber) {
    try {
      const workflow = await ApprovalWorkflow.findById(workflowId);
      if (!workflow) {
        throw new Error('Workflow not found');
      }

      const stage = workflow.approvalStages.find((s) => s.stageNumber === stageNumber);
      if (!stage) {
        throw new Error('Stage not found');
      }

      // Send notification to each approver
      for (const approver of stage.requiredApprovers) {
        await emailService.sendApprovalNotification(
          {
            approverName: approver.name,
            approverEmail: approver.email,
            workflowId,
            documentTitle: workflow.documentTitle,
            documentType: workflow.documentType,
            stageNumber,
            dueDate: workflow.dueDate,
          }
        );
      }

      logger.info(`Approval notifications sent for stage ${stageNumber} of workflow ${workflowId}`);
    } catch (error) {
      logger.error(`Error notifying approvers: ${error.message}`);
      // Don't throw - notification failure shouldn't block workflow
    }
  }

  /**
   * Generate compliance certificate after approval
   * @param {string} workflowId - Approval workflow ID
   * @returns {Promise<Object>} Certificate data
   */
  async generateApprovalCertificate(workflowId) {
    try {
      const workflow = await ApprovalWorkflow.findById(workflowId);

      if (!workflow || workflow.status !== 'approved') {
        throw new Error('Workflow must be fully approved to generate certificate');
      }

      // Build certificate
      const certificate = {
        certificateNumber: `CERT-${workflowId.substring(0, 8)}-${Date.now()}`,
        documentTitle: workflow.documentTitle,
        documentType: workflow.documentType,
        issuedDate: new Date(),
        approvalDate: workflow.approvedAt,
        allApprovers: workflow.approvalStages.flatMap((stage) =>
          stage.approvals.map((approval) => ({
            name: approval.approverName,
            title: approval.approverTitle,
            approvalDate: approval.approvalTimestamp,
            signatureMethod: approval.signatureMethod,
          }))
        ),
        certificateValidity: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
      };

      // Store certificate reference in workflow
      workflow.certificate = certificate;
      await workflow.save();

      logger.info(`Approval certificate generated for workflow ${workflowId}`);

      return certificate;
    } catch (error) {
      logger.error(`Error generating approval certificate: ${error.message}`);
      throw error;
    }
  }

  /**
   * Export workflow as PDF (integration with PDF service)
   * @param {string} workflowId - Approval workflow ID
   * @returns {Promise<Buffer>} PDF buffer
   */
  async exportWorkflowAsPDF(workflowId) {
    try {
      const workflow = await ApprovalWorkflow.findById(workflowId);
      if (!workflow) {
        throw new Error('Workflow not found');
      }

      // Build PDF content (would integrate with PDF library)
      const pdfContent = {
        title: `Approval Workflow Report: ${workflow.documentTitle}`,
        documentType: workflow.documentType,
        status: workflow.status,
        stages: workflow.approvalStages,
        auditTrail: workflow.auditTrail,
        generatedDate: new Date(),
      };

      logger.info(`Workflow PDF export initiated for ${workflowId}`);

      // Return PDF buffer (integration with actual PDF library)
      return pdfContent;
    } catch (error) {
      logger.error(`Error exporting workflow as PDF: ${error.message}`);
      throw error;
    }
  }
}

module.exports = new ApprovalWorkflowService();
