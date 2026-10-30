/**
 * reportingCommon.ts
 * Shared helper types and defaults for reporting and dashboard controllers.
 */

export type OptionalReportGenerator = {
  generateReport?: (input: {
    type: 'agent_performance';
    format: 'xlsx' | 'pdf';
    filters: {
      agentId?: string;
      from?: string;
      to?: string;
      stage?: string;
    };
    jobId: string;
  }) => Promise<unknown>;
};
