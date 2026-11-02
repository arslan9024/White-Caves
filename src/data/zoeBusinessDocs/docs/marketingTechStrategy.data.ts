import type { BusinessDocItem } from '../types';

export const marketingTechStrategyDocs: BusinessDocItem[] = [
  {
    id: 'doc-zoe-08',
    code: 'DOC-BUS-08',
    title: 'Core Real Estate Services Catalog & Disaster Recovery Infrastructure',
    category: 'services',
    departmentFloor: 'Floor 02 / Floor 10 / Floor 11',
    primaryAssistant: '3.4 Zoe AI & Aurora CTO',
    lastUpdated: '2026-08-26',
    summary:
      '9 Core CRM and real estate brokerage services, Service Level Agreements (SLAs), and 99.9% Disaster Recovery Plan (RPO 1h / RTO 4h).',
    tags: ['Core Services', 'Disaster Recovery', 'RPO 1hr', 'RTO 4hr', 'Database Scaling', 'SLA'],
    subItems: [
      {
        id: 'sec-8-1',
        title: '1. 9 Core Brokerage Services Catalog',
        description: 'Primary sales, leasing, asset management, and VIP advisory offerings.',
      },
      {
        id: 'sec-8-2',
        title: '2. Disaster Recovery Strategy (RPO 1hr / RTO 4hr)',
        description: 'Backup schedule, automated failover, and data integrity protocols.',
      },
      {
        id: 'sec-8-3',
        title: '3. High-Performance Database Scaling Architecture',
        description: 'Read-replicas, connection pooling, sharding, and Redis caching.',
      },
      {
        id: 'sec-8-4',
        title: '4. Service Level Agreements (SLAs)',
        description: '99.9% platform availability guarantee and incident resolution matrix.',
      },
    ],
    htmlContent: `
<div class="doc-container">
  <div class="doc-header-badge">SERVICES & INFRASTRUCTURE · WHITE CAVES REAL ESTATE LLC · DOCS FOLDER 02</div>
  <h1 class="doc-title">🌟 Core Real Estate Services Catalog & Disaster Recovery Plan</h1>
  <p class="doc-lead">
    Detailed service specifications for all 9 White Caves commercial offerings combined with enterprise infrastructure standards enforcing 99.9% uptime, 1-hour Recovery Point Objective (RPO), and 4-hour Recovery Time Objective (RTO).
  </p>

  <h2 class="doc-section-heading" id="sec-8-1">1. 9 Core Brokerage Services Catalog</h2>
  <div class="doc-table-wrap">
    <table class="doc-table">
      <thead>
        <tr>
          <th>Service Code</th>
          <th>Service Name</th>
          <th>Target Market</th>
          <th>Fee Structure / Revenue Model</th>
        </tr>
      </thead>
      <tbody>
        <tr><td><strong>SRV-01</strong></td><td>Off-Plan Project Advisory</td><td>Global Investors & High-Net-Worth</td><td>4% – 7% Developer Commission + Escrow Safety Check</td></tr>
        <tr><td><strong>SRV-02</strong></td><td>Secondary Residential Resale</td><td>Dubai Homeowners & Buyers</td><td>2% Seller + 2% Buyer Brokerage Fee (RERA Unified Form F)</td></tr>
        <tr><td><strong>SRV-03</strong></td><td>Luxury Leasing & Ejari Attestation</td><td>Tenants & Landlords</td><td>5% Annual Rent Commission + AED 250 Ejari Registration</td></tr>
        <tr><td><strong>SRV-04</strong></td><td>Full-Service Property Management</td><td>Overseas & Institutional Landlords</td><td>8% – 10% Annual Rental Yield Management Fee</td></tr>
        <tr><td><strong>SRV-05</strong></td><td>UHNW Private Vault Acquisition</td><td>Ultra-High-Net-Worth (AED 20M+)</td><td>Bespoke Advisory Retainer + 2% Success Commission</td></tr>
      </tbody>
    </table>
  </div>
</div>
`,
  },

  // -------------------------------------------------------------
  // DOC-BUS-09: 06_design_architecture
  // -------------------------------------------------------------
  {
    id: 'doc-zoe-09',
    code: 'DOC-BUS-09',
    title: 'System Design Architecture, REST API Reference & Prisma Schema',
    category: 'design_arch',
    departmentFloor: 'Floor 03 / Floor 05 — Software Architecture Suite',
    primaryAssistant: '3.4 Zoe AI & 3.16 Aurora CTO',
    lastUpdated: '2026-08-26',
    summary:
      'Microservices architecture, REST API contracts, 17 Prisma models with 90+ database indexes, and Data Dictionary standard.',
    tags: [
      'System Architecture',
      'REST API Reference',
      'Prisma Schema',
      'Data Dictionary',
      'PostgreSQL',
    ],
    subItems: [
      {
        id: 'sec-9-1',
        title: '1. Microservices System Architecture',
        description: 'React 18 frontend, Express API gateway, Prisma ORM, and background workers.',
      },
      {
        id: 'sec-9-2',
        title: '2. REST API Reference & Contract Standard',
        description: 'Standardized JSON envelopes, error handling, and route endpoints.',
      },
      {
        id: 'sec-9-3',
        title: '3. Prisma Database Models (17 Master Entities)',
        description: 'Lead, Property, Transaction, Document, AuditLog, and Tenant models.',
      },
      {
        id: 'sec-9-4',
        title: '4. Enterprise Data Dictionary',
        description: 'Field definitions, validation constraints, and business meanings.',
      },
    ],
    htmlContent: `
<div class="doc-container">
  <div class="doc-header-badge">SYSTEM ARCHITECTURE · WHITE CAVES REAL ESTATE LLC · DOCS FOLDER 06</div>
  <h1 class="doc-title">📐 System Architecture, REST API Reference & Prisma Schema</h1>
  <p class="doc-lead">
    Complete architectural blue-print for the White Caves cloud platform, specifying API standards, database models, data flow pipelines, and UI/UX design token specifications.
  </p>

  <h2 class="doc-section-heading" id="sec-9-1">1. High-Level Technology Topology</h2>
  <div class="step-flow">
    <div class="step-box">React 18 / Vite / TypeScript Client</div>
    <div class="step-arrow">➔ JWT / HTTPS ➔</div>
    <div class="step-box">Express API Gateway + Zod Validation</div>
    <div class="step-arrow">➔ Prisma ORM ➔</div>
    <div class="step-box">PostgreSQL Cluster + Redis Cache</div>
  </div>
</div>
`,
  },

  // -------------------------------------------------------------
  // DOC-BUS-10: 08_integrations_and_research
  // -------------------------------------------------------------
  {
    id: 'doc-zoe-10',
    code: 'DOC-BUS-10',
    title: 'Dubai Real Estate Market Intelligence, Portals & Competitor Analysis',
    category: 'market_intel',
    departmentFloor: 'Floor 12 — Research & Intelligence Suite',
    primaryAssistant: '3.4 Zoe AI & 3.22 Cipher Market',
    lastUpdated: '2026-08-26',
    summary:
      'Dubai macroeconomic trends, PropertyFinder/Bayut API integration research, and competitive intelligence benchmarking.',
    tags: [
      'Market Research',
      'PropertyFinder API',
      'Bayut API',
      'Competitor Benchmark',
      'DLD Open Data',
    ],
    subItems: [
      {
        id: 'sec-10-1',
        title: '1. Dubai Real Estate Macro Trends 2026',
        description: 'AED 180B+ transaction volume, migration dynamics, and high-yield clusters.',
      },
      {
        id: 'sec-10-2',
        title: '2. Major Portal XML / REST Ingestion Specs',
        description: 'Property Finder Webhooks, Bayut Live Sync, and Dubizzle feeds.',
      },
      {
        id: 'sec-10-3',
        title: '3. Competitive Matrix & Strategic Moats',
        description: 'Comparison against traditional brokerages and PropTech platforms.',
      },
      {
        id: 'sec-10-4',
        title: '4. DLD Open Data Price Indices (Mo’asher)',
        description: 'Official transaction index synchronization and price heatmaps.',
      },
    ],
    htmlContent: `
<div class="doc-container">
  <div class="doc-header-badge">MARKET RESEARCH & INTELLIGENCE · WHITE CAVES REAL ESTATE LLC · DOCS FOLDER 08</div>
  <h1 class="doc-title">📊 Dubai Real Estate Market Intelligence & Portal APIs</h1>
  <p class="doc-lead">
    Comprehensive research into Dubai's luxury real estate macroeconomic climate, portal syndication protocols, and competitive landscape.
  </p>

  <h2 class="doc-section-heading" id="sec-10-1">1. Dubai Luxury Real Estate Catchment</h2>
  <div class="doc-card-grid">
    <div class="doc-card">
      <div class="doc-card-label">Primary Flagship Catchment</div>
      <div class="doc-card-value">DAMAC Hills 2</div>
      <div class="doc-card-sub">9,378+ Villa & Townhouse Portfolio</div>
    </div>
    <div class="doc-card">
      <div class="doc-card-label">Secondary Prime Corridors</div>
      <div class="doc-card-value">Palm & Downtown</div>
      <div class="doc-card-sub">Ultra-Luxury Penthouse & Villa Resale</div>
    </div>
  </div>
</div>
`,
  },

  // -------------------------------------------------------------
  // DOC-BUS-11: 03_ai_assistants
  // -------------------------------------------------------------
  {
    id: 'doc-zoe-11',
    code: 'DOC-BUS-11',
    title: 'AI Command Center Architecture & 44-Assistant Swarm Mesh',
    category: 'ai_command',
    departmentFloor: 'Floor 13 / Floor 05 — AI Operations Suite',
    primaryAssistant: '3.4 Zoe AI & 3.44 AEGIS AI',
    lastUpdated: '2026-08-26',
    summary:
      'Complete operating architecture for all 44 AI assistants (3.1 Nadia to 3.44 AEGIS), task routing, intent detection, and multi-agent coordination.',
    tags: ['44 AI Personas', 'AI Mesh', 'Nadia', 'Zoe', 'Aurora', 'Margaret', 'Ada', 'AEGIS'],
    subItems: [
      {
        id: 'sec-11-1',
        title: '1. Canonical 44-Assistant Roster (3.1 to 3.44)',
        description: 'Complete table of all 44 AI assistants with roles and floor coordinates.',
      },
      {
        id: 'sec-11-2',
        title: '2. Executive Council Governance Mesh',
        description: 'Zoe, Aurora, Margaret, Ada, and AEGIS executive coordination.',
      },
      {
        id: 'sec-11-3',
        title: '3. Intent Detection & Routing Engine',
        description: 'Natural language classification and zero-latency subagent dispatch.',
      },
      {
        id: 'sec-11-4',
        title: '4. Graceful Fallback & Human Escalation Matrix',
        description: 'Rule-based fail-safe handling and licensed broker handover.',
      },
    ],
    htmlContent: `
<div class="doc-container">
  <div class="doc-header-badge">AI SWARM INTELLIGENCE · WHITE CAVES REAL ESTATE LLC · DOCS FOLDER 03</div>
  <h1 class="doc-title">🤖 AI Command Center Architecture & 44-Assistant Mesh</h1>
  <p class="doc-lead">
    The White Caves AI Command Center coordinates 44 specialized artificial intelligence personas across all 12 corporate departments, executing automated deal processing, WhatsApp conversations, statutory compliance, and software engineering.
  </p>

  <h2 class="doc-section-heading" id="sec-11-1">1. Canonical AI Assistant Roster & Numbering (3.1 – 3.44)</h2>
  <div class="doc-table-wrap">
    <table class="doc-table">
      <thead>
        <tr>
          <th>Code</th>
          <th>Assistant Identity</th>
          <th>Corporate Floor</th>
          <th>Specialization & Role</th>
        </tr>
      </thead>
      <tbody>
        <tr><td><strong>3.1</strong></td><td>Nadia AI</td><td>Floor 06 (Marketing)</td><td>WhatsApp CRM, Broadcast Campaigns & 15-min SLA</td></tr>
        <tr><td><strong>3.2</strong></td><td>Nina AI</td><td>Floor 06 (Marketing)</td><td>WhatsApp Bot Flow Designer & Intent Simulator</td></tr>
        <tr><td><strong>3.3</strong></td><td>Sophia AI</td><td>Floor 11 (Sales)</td><td>Sales Deals Kanban & Commission Split Engine</td></tr>
        <tr><td><strong>3.4</strong></td><td>Zoe AI</td><td>Floor 13 (Executive)</td><td>Executive Briefing Desk, Operations & Business Docs</td></tr>
        <tr><td><strong>3.5</strong></td><td>Evangeline AI</td><td>Floor 09 (Legal)</td><td>DLD Unified Form A/B/F & NDA Studio</td></tr>
        <tr><td><strong>3.6</strong></td><td>Cassie AI</td><td>Floor 11 (Sales)</td><td>100-Point Predictive Lead Scoring Engine</td></tr>
        <tr><td><strong>3.7</strong></td><td>Atlas AI</td><td>Floor 12 (Off-Plan)</td><td>Off-Plan Project Intelligence & Capital Gain Simulator</td></tr>
        <tr><td><strong>3.8</strong></td><td>Clara AI</td><td>Floor 11 (Sales)</td><td>Lead Ingestion Webhook & Deduplication Engine</td></tr>
        <tr><td><strong>3.9</strong></td><td>Mary AI</td><td>Floor 10 (Leasing)</td><td>Master 9,378+ Inventory Grid & Area Clustering</td></tr>
        <tr><td><strong>3.10</strong></td><td>Linda AI</td><td>Floor 07 (VIP)</td><td>Agent WhatsApp Session Desk & Media Vault</td></tr>
        <tr><td><strong>3.11</strong></td><td>Olivia AI</td><td>Floor 06 (Marketing)</td><td>Multi-Portal Syndication & CPL Ad Optimizer</td></tr>
        <tr><td><strong>3.12</strong></td><td>Nancy AI</td><td>Floor 01 (HR)</td><td>HR Broker Sales Podium & RERA Card Expiry Guard</td></tr>
        <tr><td><strong>3.13</strong></td><td>Daisy AI</td><td>Floor 10 (Leasing)</td><td>Lease Renewals, Ejari Handover & PDC Vault</td></tr>
        <tr><td><strong>3.14</strong></td><td>Theodora AI</td><td>Floor 08 (Finance)</td><td>Finance, VAT 5% Accounting & 67 Master Reports</td></tr>
        <tr><td><strong>3.15</strong></td><td>Laila AI</td><td>Floor 09 (Legal)</td><td>RERA Compliance, Trakheesi Verifier & AML Audit</td></tr>
        <tr><td><strong>3.16</strong></td><td>Aurora AI</td><td>Floor 05 (Tech)</td><td>CTO Infrastructure, APIs & Software Architecture Hub</td></tr>
        <tr><td><strong>3.17</strong></td><td>Hazel AI</td><td>Floor 04 (Design)</td><td>Frontend & UX 100-Point Design Token Guard</td></tr>
        <tr><td><strong>3.18</strong></td><td>Willow AI</td><td>Floor 03 (Backend)</td><td>Backend Microservices, JWT Auth & Queue Desk</td></tr>
        <tr><td><strong>3.19</strong></td><td>Henry AI</td><td>Floor 09 (Legal)</td><td>Document Studio, Emirates ID / Title Deed OCR</td></tr>
        <tr><td><strong>3.20</strong></td><td>Sentinel AI</td><td>Floor 10 (Leasing)</td><td>Property State Machine & Asset Quality Gate</td></tr>
        <tr><td><strong>3.21</strong></td><td>Hunter AI</td><td>Floor 11 (Sales)</td><td>Outbound Luxury Prospecting & VIP Lead Matcher</td></tr>
        <tr><td><strong>3.22</strong></td><td>Cipher AI</td><td>Floor 12 (Off-Plan)</td><td>DLD Transaction Regressor & Market Pricing CMA</td></tr>
        <tr><td><strong>3.23</strong></td><td>Vesta AI</td><td>Floor 10 (Leasing)</td><td>Digital Snagging Photo Inspector & Move-In Checklist</td></tr>
        <tr><td><strong>3.24</strong></td><td>Juno AI</td><td>Floor 10 (Leasing)</td><td>Community Facilities Booking & Ticket SLA Router</td></tr>
        <tr><td><strong>3.25</strong></td><td>Kairos AI</td><td>Floor 07 (VIP)</td><td>UAE Golden Visa Eligibility & Crypto FX Advisory</td></tr>
        <tr><td><strong>3.26</strong></td><td>Maven AI</td><td>Floor 12 (Off-Plan)</td><td>10-Year DCF ROI & Portfolio Rebalancing</td></tr>
        <tr><td><strong>3.27</strong></td><td>Prism AI</td><td>Floor 11 (Sales)</td><td>Vector Property Matching & Ranked Top Picks</td></tr>
        <tr><td><strong>3.28</strong></td><td>Sage AI</td><td>Floor 08 (Finance)</td><td>Mortgage Affordability & CBUAE EIBOR Simulator</td></tr>
        <tr><td><strong>3.29</strong></td><td>Echo AI</td><td>Floor 06 (Marketing)</td><td>Unified Omnichannel Client Timeline & Inactivity Alerts</td></tr>
        <tr><td><strong>3.30</strong></td><td>Mira AI</td><td>Floor 06 (Marketing)</td><td>Real-Time Arabic-English Translation & DLD RTL</td></tr>
        <tr><td><strong>3.31</strong></td><td>Rex AI</td><td>Floor 09 (Legal)</td><td>Blockchain Title Deed Verifier & Anti-Fraud Guard</td></tr>
        <tr><td><strong>3.32</strong></td><td>Iris AI</td><td>Floor 04 (Design)</td><td>Generative AI Virtual Staging & 3D Floorplans</td></tr>
        <tr><td><strong>3.33</strong></td><td>Apex AI</td><td>Floor 01 (HR)</td><td>Agent Performance Coach & Incentive Tiering</td></tr>
        <tr><td><strong>3.34</strong></td><td>Halo AI</td><td>Floor 07 (VIP)</td><td>Client Satisfaction & Post-Handover NPS Tracker</td></tr>
        <tr><td><strong>3.35</strong></td><td>Oracle AI</td><td>Floor 12 (Off-Plan)</td><td>Market Narrative Intelligence & DLD Spike Detector</td></tr>
        <tr><td><strong>3.36</strong></td><td>Flux AI</td><td>Floor 05 (Tech)</td><td>Real-Time DLD Open API Stream & Portal Ingestion</td></tr>
        <tr><td><strong>3.37</strong></td><td>Nova AI</td><td>Floor 12 (Off-Plan)</td><td>Developer Launch Intelligence & Pre-Launch Radar</td></tr>
        <tr><td><strong>3.38</strong></td><td>Quill AI</td><td>Floor 09 (Legal)</td><td>Automated Bilingual SPA & Tenancy Form Generator</td></tr>
        <tr><td><strong>3.39</strong></td><td>Lumen AI</td><td>Floor 08 (Finance)</td><td>Geospatial Heatmaps & Board Deck PPT Exporter</td></tr>
        <tr><td><strong>3.40</strong></td><td>Crest AI</td><td>Floor 12 (Off-Plan)</td><td>Automated Valuation Model (AVM) & DLD Comps</td></tr>
        <tr><td><strong>3.41</strong></td><td>Archer AI</td><td>Floor 11 (Sales)</td><td>Lead Scoring Engine & Agent Auto-Assignment Queue</td></tr>
        <tr><td><strong>3.42</strong></td><td>Margaret AI</td><td>Floor 13 (Executive)</td><td>Master Strategic Plans Hub, Wave Backlogs & Roadmaps</td></tr>
        <tr><td><strong>3.43</strong></td><td>Ada AI</td><td>Floor 13 (Executive)</td><td>Chief Architecture Hub, Zero-Token Gates & SDLC</td></tr>
        <tr><td><strong>3.44</strong></td><td>AEGIS AI</td><td>Floor 13 (Executive)</td><td>Autonomous Autopilot, Swarm Orchestration & Telemetry</td></tr>
      </tbody>
    </table>
  </div>
</div>
`,
  },

  // -------------------------------------------------------------
  // DOC-BUS-12: 09_crm_features & 09_user_roles_permissions
  // -------------------------------------------------------------,
];
