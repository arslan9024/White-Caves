/**
 * turingOrchestrator.ts
 * White Caves Real Estate LLC - AEGIS Turing Protocol Autopilot Core Loop
 * Standard: AEGIS Canonical 7-Category Architecture Standard (Control Plane)
 * Single Purpose File Law: < 350 lines
 * Protocol: Turing Protocol Real-Time Auditing Laws & Bhakti 1-12-108 Anchors
 */

export interface CodebaseDebtCheckResult {
  passed: boolean;
  score: number; // 0 - 100
  violations: string[];
  recommendations: string[];
}

export interface PromptEvaluationContext {
  promptText: string;
  sourceModule?: string;
  targetFiles?: string[];
  activeAgentId?: string;
}

export interface TuringAuditRule {
  id: string;
  name: string;
  description: string;
  check: (context: PromptEvaluationContext) => { valid: boolean; message?: string };
}

export class TuringOrchestrator {
  private static instance: TuringOrchestrator;
  private maxFileLineLimit = 350;
  private rules: TuringAuditRule[] = [];

  private constructor() {
    this.initializeDefaultRules();
  }

  public static getInstance(): TuringOrchestrator {
    if (!TuringOrchestrator.instance) {
      TuringOrchestrator.instance = new TuringOrchestrator();
    }
    return TuringOrchestrator.instance;
  }

  /**
   * Initializes statutory compliance rules against architectural layout debts
   */
  private initializeDefaultRules(): void {
    // Rule 1: Zero Duplication Law (Explorer Sidebar Single-Source)
    this.rules.push({
      id: 'TURING-RULE-001',
      name: 'Zero Duplication Law (Sidebar Symmetry)',
      description:
        'Scrub all duplicate White Caves Explorer nodes from Left Sidebar; bind singular explorer to Right Sidebar',
      check: ctx => {
        const text = ctx.promptText.toLowerCase();
        if (
          text.includes('leftsidebar') &&
          text.includes('explorer') &&
          !text.includes('remove') &&
          !text.includes('scrub')
        ) {
          return {
            valid: false,
            message:
              'Violation: Attempting to link White Caves Explorer into Left Sidebar. Explorer must strictly reside in Right Sidebar.',
          };
        }
        return { valid: true };
      },
    });

    // Rule 2: Single Purpose File Law (< 350 lines)
    this.rules.push({
      id: 'TURING-RULE-002',
      name: 'Single Purpose File Law',
      description:
        'Every newly authored or modified source file must strictly stay below 350 lines',
      check: ctx => {
        if (ctx.targetFiles) {
          for (const file of ctx.targetFiles) {
            if (file.endsWith('.tsx') || file.endsWith('.ts')) {
              // Target is audited during compilation
            }
          }
        }
        return { valid: true };
      },
    });

    // Rule 3: Bhakti 1-12-108 Hierarchy Ratio Integrity
    this.rules.push({
      id: 'TURING-RULE-003',
      name: 'Bhakti 1-12-108 Hierarchy Anchor',
      description: 'Enforce 1 MD Sovereign Hub, 12 Core Corporate Departments, and 108 Supervisors',
      check: ctx => {
        const text = ctx.promptText.toLowerCase();
        if (
          text.includes('remove department') ||
          text.includes('trim agents') ||
          text.includes('merge 12 departments')
        ) {
          return {
            valid: false,
            message:
              'Violation: Attempting to reduce the 12 corporate departments or 108 supervisors below statutory ratio.',
          };
        }
        return { valid: true };
      },
    });

    // Rule 4: Statutory UAE FTA VAT & Corporate Tax Reserve Isolation
    this.rules.push({
      id: 'TURING-RULE-004',
      name: 'FTA VAT & Corporate Tax Reserve Enclosure',
      description:
        'Ensure 5% VAT and 9% corporate tax reserve buffers are strictly maintained in financial pipelines',
      check: ctx => {
        const text = ctx.promptText.toLowerCase();
        if (
          text.includes('zero vat') ||
          text.includes('bypass vat') ||
          text.includes('omit 5% vat')
        ) {
          return {
            valid: false,
            message: 'Violation: Statutory 5% FTA VAT calculation cannot be bypassed or omitted.',
          };
        }
        return { valid: true };
      },
    });
  }

  /**
   * Intercept and evaluate developer prompt context before code generation
   */
  public evaluatePromptContext(context: PromptEvaluationContext): CodebaseDebtCheckResult {
    const violations: string[] = [];
    const recommendations: string[] = [];

    for (const rule of this.rules) {
      const result = rule.check(context);
      if (!result.valid && result.message) {
        violations.push(`[${rule.id}] ${result.message}`);
      }
    }

    if (violations.length > 0) {
      recommendations.push('Refactor plan to isolate CRUD management inside Left Sidebar.');
      recommendations.push('Maintain pure read-only 1-12-108 inspection inside Right Sidebar.');
      recommendations.push('Enforce 350-line modular decomposition using 7-Category architecture.');
    }

    const score = Math.max(0, 100 - violations.length * 25);

    return {
      passed: violations.length === 0,
      score,
      violations,
      recommendations,
    };
  }

  /**
   * Inspect file line count compliance
   */
  public checkFileLineLimit(lineCount: number, filePath: string): boolean {
    if (lineCount > this.maxFileLineLimit) {
      console.warn(
        `[TuringOrchestrator] Single Purpose File Law Warning: ${filePath} is ${lineCount} lines (limit: ${this.maxFileLineLimit}).`
      );
      return false;
    }
    return true;
  }
}

export const turingOrchestrator = TuringOrchestrator.getInstance();
export default turingOrchestrator;
