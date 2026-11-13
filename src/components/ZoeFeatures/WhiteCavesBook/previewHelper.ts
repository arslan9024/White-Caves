// src/components/ZoeFeatures/WhiteCavesBook/previewHelper.ts
import { MasterCorpusRoot } from './treeTypes';
import { findNodeById, NodeLookupResult } from './treeQueryEngine';

export interface PreviewData {
  title: string;
  subtitle?: string;
  category?: string;
  badge: string;
  snippet: string;
  levelText: string;
}

// Well-known statutory protocol descriptions for instant fallback
const STATUTORY_PROTOCOL_PREVIEWS: Record<
  string,
  { title: string; category: string; snippet: string }
> = {
  'TURING-LAW-000': {
    title: 'Turing Zero-Waste AI Credit & Velocity',
    category: 'Supreme Constitutional Law',
    snippet:
      'Mandates parallel tool batching, surgical line-range reads, targeted single-file testing, and <= 15,000 token ceiling.',
  },
  'TURING-ROOT-007': {
    title: 'Strict Root Cleanliness & Canonical Path Hygiene',
    category: 'Architecture Invariant',
    snippet:
      'Forbids loose docs, plans, strategies in repository roots. All architectural documentation lives under .agents/.',
  },
  'TURING-PERPETUAL-OUROBOROS': {
    title: '100% Autonomous Continuous Autopilot Execution',
    category: 'Autopilot Invariant',
    snippet:
      'Non-stop autonomous execution loop completing end-to-end cycles without pausing for chat confirmations.',
  },
  'TURING-NAV-TREE-009': {
    title: 'Hierarchical Tree-State Navigation & Leaf-Task Return',
    category: 'Viewport Architecture',
    snippet:
      'Strict 4-level navigation hierarchy (TopBar -> Activity Bars -> Drawer Root -> Leaf Task) with instant breadcrumb lineage.',
  },
  'TURING-SEPARATION-010': {
    title: 'Strict Entity-Action-Structure Separation',
    category: 'Domain Modeling',
    snippet:
      'Cleanly decouples DMS (12 Corporate Departments), ERMS (Actors & Objects), and TMS (Verbs & Tasks).',
  },
  'TURING-BOOK-011': {
    title: 'Living Book Chronicler & Continuous Knowledge Grounding',
    category: 'Knowledge Base',
    snippet:
      'Preserves all architectural breakthroughs, ADRs, and decisions in The Book of White Caves.',
  },
  'TURING-RULE-TIERS-012': {
    title: 'Multi-Tier Rule Ingestion & Sovereign Feedback Loop',
    category: 'Rule Engine',
    snippet:
      'Tier 1 Global (~/.gemini) -> Tier 2 Monorepo Umbrella -> Tier 3 Project/Node rules with automatic learning capture.',
  },
  'TURING-DEV-SERVER-BAN-013': {
    title: 'Strict AI Dev Server Ban',
    category: 'Operational Safety',
    snippet:
      'Forbids AI agents from launching dev servers (npm run dev, vite, expo). Dev servers belong exclusively in developer terminals.',
  },
  'TURING-DUAL-FORMAT-014': {
    title: 'Dual Format Optimization: Markdown vs. TypeScript',
    category: 'Credit Preservation',
    snippet:
      'Markdown (.md) for agent steering and system rules; TypeScript (.ts) for structured registries and 12-level knowledge tree.',
  },
};

/**
 * Resolves a preview card payload for any nodeId, protocol token, or chapter slug
 */
export function getNodePreviewData(corpus: MasterCorpusRoot, targetId: string): PreviewData | null {
  if (!targetId) return null;
  const cleanId = targetId.trim().replace(/^#/, '');

  // 1. Check Statutory Protocol static registry
  if (STATUTORY_PROTOCOL_PREVIEWS[cleanId]) {
    const proto = STATUTORY_PROTOCOL_PREVIEWS[cleanId];
    return {
      title: proto.title,
      category: proto.category,
      badge: cleanId,
      snippet: proto.snippet,
      levelText: 'Constitutional Protocol',
    };
  }

  // Handle AEG-XXX pattern
  if (/^AEG-\d{3}$/.test(cleanId)) {
    const aegNum = parseInt(cleanId.replace('AEG-', ''), 10);
    let pillar = 'Constitutional Protocol';
    if (aegNum <= 9) pillar = 'Prometheus Pillar (UI/UX Primitives)';
    else if (aegNum <= 17) pillar = 'Turing Pillar (Performance & Velocity)';
    else if (aegNum <= 25) pillar = 'Phoenix Pillar (Security & Contracts)';
    else if (aegNum <= 33) pillar = 'Valkyrie Pillar (Regulatory & Ejari)';
    else pillar = 'Apocalypse Pillar (Vision & Leaderboard)';

    return {
      title: `AEGIS Protocol ${cleanId}`,
      category: pillar,
      badge: cleanId,
      snippet: `Statutory sovereign engineering law ${cleanId} from the AEGIS V5.0 Unified Protocol Matrix.`,
      levelText: 'AEGIS Law',
    };
  }

  // 2. Query 12-Level Tree
  const lookup: NodeLookupResult | null = findNodeById(corpus, cleanId);
  if (lookup) {
    const n = lookup.node as any;
    const title = n.title || n.header || n.chapterCode || cleanId;
    const subtitle = n.subtitle || n.description || n.summary || undefined;
    const snippet =
      n.narrative ||
      n.overviewMarkdown ||
      n.summary ||
      n.description ||
      n.statement ||
      'Click to jump to this node in the knowledge tree.';
    const snippetClean =
      snippet
        .replace(/<[^>]+>/g, '')
        .replace(/[#*`_]/g, '')
        .slice(0, 160) + (snippet.length > 160 ? '...' : '');

    return {
      title,
      subtitle,
      category: lookup.lineage.map(l => l.titleOrId).slice(-2, -1)[0] || 'Knowledge Tree',
      badge: `L${lookup.level}: ${n.nodeId || cleanId}`,
      snippet: snippetClean,
      levelText: `Level ${lookup.level}`,
    };
  }

  return {
    title: cleanId,
    badge: 'Portal Link',
    snippet: `Navigate to node ${cleanId} in the 12-level knowledge corpus.`,
    levelText: 'Hyperlink',
  };
}
