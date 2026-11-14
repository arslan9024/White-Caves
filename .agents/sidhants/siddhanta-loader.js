/**
 * @file siddhanta-loader.js
 * @description Token-efficient ES2025 Dynamic Doctrine Loader & Hybrid Semantic/Tag Retriever for 108 Siddhāntas.
 * Solves context-window bloat by loading only P0 Core Invariants (~350 tokens) + Top-K task-relevant doctrines (~250 tokens).
 * @version 3.0.0
 * @standard ES2025 (ESM)
 */

import siddhantaData from './siddhanta-108.json' with { type: 'json' };

export class SiddhantaEngine {
  #doctrines;
  #byPillar = new Map();
  #byPriority = new Map();
  #idf = new Map();
  #docVectors = [];

  constructor(data = siddhantaData) {
    this.meta = data.meta;
    this.authorityModel = data.authorityModel;
    this.#doctrines = Object.freeze(data.doctrines);
    this.#buildIndexes();
  }

  /**
   * Builds O(1) lookup maps and an in-memory TF-IDF vector index (zero external DB needed,
   * while remaining 100% exportable to Qdrant, Pinecone, pgvector, or Chroma).
   */
  #buildIndexes() {
    const df = new Map();
    const tokenizedDocs = this.#doctrines.map(doc => {
      // Group by pillar
      if (!this.#byPillar.has(doc.pillar)) this.#byPillar.set(doc.pillar, []);
      this.#byPillar.get(doc.pillar).push(doc);

      // Group by priority
      if (!this.#byPriority.has(doc.priority)) this.#byPriority.set(doc.priority, []);
      this.#byPriority.get(doc.priority).push(doc);

      // Tokenize for lightweight local vector similarity
      const text = `${doc.name} ${doc.pillar} ${doc.tags.join(' ')} ${doc.rule}`.toLowerCase();
      const tokens = text.match(/[a-z0-9-]+/g) ?? [];
      const unique = new Set(tokens);
      for (const token of unique) {
        df.set(token, (df.get(token) ?? 0) + 1);
      }
      return { doc, tokens };
    });

    const N = this.#doctrines.length;
    for (const [token, count] of df.entries()) {
      this.#idf.set(token, Math.log((N + 1) / (count + 1)) + 1);
    }

    this.#docVectors = tokenizedDocs.map(({ doc, tokens }) => {
      const tf = new Map();
      for (const t of tokens) tf.set(t, (tf.get(t) ?? 0) + 1);
      const weights = new Map();
      let norm = 0;
      for (const [t, freq] of tf.entries()) {
        const w = (freq / tokens.length) * (this.#idf.get(t) ?? 1);
        weights.set(t, w);
        norm += w * w;
      }
      return { doc, weights, norm: Math.sqrt(norm) || 1 };
    });
  }

  /**
   * Retrieve all doctrines for one or more pillars.
   * @param {string[]} pillars
   */
  getByPillars(pillars = []) {
    return pillars.flatMap(p => this.#byPillar.get(p.toLowerCase()) ?? []);
  }

  /**
   * Retrieve doctrines by priority tier ('P0' = Core Invariants, 'P1' = Operational, 'P2' = Mastery).
   * @param {'P0'|'P1'|'P2'} priority
   */
  getByPriority(priority = 'P0') {
    return this.#byPriority.get(priority) ?? [];
  }

  /**
   * Semantic + Tag Cosine Similarity Search (retrieves Top-K doctrines for a given user task).
   * @param {string} taskQuery - Current user prompt or task description
   * @param {object} [options]
   * @param {number} [options.topK=8] - Number of dynamic doctrines to inject
   * @param {boolean} [options.excludeP0=true] - Exclude P0 if already pinned in system prompt
   */
  retrieveForTask(taskQuery, { topK = 8, excludeP0 = true } = {}) {
    const qTokens = taskQuery.toLowerCase().match(/[a-z0-9-]+/g) ?? [];
    if (qTokens.length === 0) return [];

    const qTf = new Map();
    for (const t of qTokens) qTf.set(t, (qTf.get(t) ?? 0) + 1);

    const qWeights = new Map();
    let qNorm = 0;
    for (const [t, freq] of qTf.entries()) {
      const w = (freq / qTokens.length) * (this.#idf.get(t) ?? 1);
      qWeights.set(t, w);
      qNorm += w * w;
    }
    qNorm = Math.sqrt(qNorm) || 1;

    return this.#docVectors
      .filter(({ doc }) => (!excludeP0 ? true : doc.priority !== 'P0'))
      .map(({ doc, weights, norm }) => {
        let dot = 0;
        for (const [t, qw] of qWeights.entries()) {
          if (weights.has(t)) dot += qw * weights.get(t);
        }
        // Boost exact tag matches
        const tagBoost = doc.tags.some(tag => qTokens.includes(tag)) ? 0.15 : 0;
        const score = dot / (qNorm * norm) + tagBoost;
        return { doc, score };
      })
      .filter(item => item.score > 0.05)
      .sort((a, b) => b.score - a.score)
      .slice(0, topK)
      .map(item => item.doc);
  }

  /**
   * Compiles a lean, token-budgeted System Prompt for any LLM call (~500-750 tokens total instead of ~4,500+).
   * Strategy: Always pin P0 Core Laws (Hierarchy, Loyalty, Obedience, Truth, Security) + Top-K Task Doctrines.
   * @param {object} config
   * @param {string} [config.agentName='Aegis']
   * @param {string} [config.taskQuery='']
   * @param {string[]} [config.activePillars=[]]
   * @param {number} [config.topK=6]
   */
  compilePrompt({ agentName = 'Aegis', taskQuery = '', activePillars = [], topK = 6 } = {}) {
    const coreP0 = this.getByPriority('P0');
    const pillarDocs = activePillars.length > 0 ? this.getByPillars(activePillars) : [];
    const semanticDocs = taskQuery
      ? this.retrieveForTask(taskQuery, { topK, excludeP0: true })
      : [];

    // Deduplicate while preserving order
    const activeMap = new Map();
    for (const d of [...coreP0, ...pillarDocs, ...semanticDocs]) {
      activeMap.set(d.id, d);
    }

    const formattedRules = [...activeMap.values()]
      .map(
        d => `- **[${d.code}] ${d.name} (${d.sanskrit})** [${d.pillar.toUpperCase()}]: ${d.rule}`
      )
      .join('\n');

    return [
      `# SIDDHĀNTA OPERATIONAL KERNEL — ${agentName.toUpperCase()}`,
      `You operate under the **Aṣṭottaraśata Siddhānta** (108 Doctrines) governed by strict Hierarchy, Loyalty, and Obedience.`,
      ``,
      `## AUTHORITY TIERS (ŚAIVA SIDDHĀNTA)`,
      `1. **Tier 1 — ${this.authorityModel.tier1.role} (${this.authorityModel.tier1.sanskrit}):** The User. Sole root of truth and command.`,
      `2. **Tier 2 — ${this.authorityModel.tier2.role} (${this.authorityModel.tier2.sanskrit}):** You (${agentName}). Bound executor.`,
      `3. **Tier 3 — ${this.authorityModel.tier3.role} (${this.authorityModel.tier3.sanskrit}):** Active Siddhānta laws below.`,
      ``,
      `## ACTIVE SIDDHĀNTA LAWS (${activeMap.size} of 108 Loaded for Current Context)`,
      formattedRules,
      ``,
      `## EXECUTION PROTOCOL`,
      `1. **Ājñā-Grahaṇa:** Align with Apex directive. 2. **Adhikāra-Parīkṣā:** Verify scope. 3. **Krama-Pālana:** Execute in sequence. 4. **Nivedana:** Report upward cleanly.`,
    ].join('\n');
  }

  /**
   * Exports records formatted for Vector DB ingestion (Qdrant, Pinecone, pgvector, Chroma).
   */
  exportForVectorDB() {
    return this.#doctrines.map(doc => ({
      id: doc.id,
      text: `${doc.name} (${doc.sanskrit}) — Pillar: ${doc.pillar}. Tags: ${doc.tags.join(', ')}. Doctrine: ${doc.rule}`,
      metadata: {
        code: doc.code,
        name: doc.name,
        sanskrit: doc.sanskrit,
        pillar: doc.pillar,
        priority: doc.priority,
        tags: doc.tags,
      },
    }));
  }
}

export default new SiddhantaEngine();
