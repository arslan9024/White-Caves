export const DOCUMENT_TYPES = {
  PDF: 'pdf',
  HTML: 'html',
};

export const DOCUMENT_SOURCES = {
  COMPANY: 'company',
  AI_ASSISTANT: 'ai_assistant',
  AURORA: 'aurora',
};

export const DOCUMENT_REGISTRY = {
  aurora_srs: {
    id: 'aurora_srs',
    title: 'Software Requirements Specification (SRS)',
    source: DOCUMENT_SOURCES.AURORA,
    type: DOCUMENT_TYPES.HTML,
    category: 'Technical Documentation',
    description: 'Complete functional and non-functional requirements for White Caves platform',
    version: '2.5',
    lastUpdated: '2026-01-09',
    author: 'Aurora (CTO Intelligence)',
    content: `
      <div class="doc-content">
        <h1>Software Requirements Specification</h1>
        <p class="doc-meta">Version 2.5 | Last Updated: January 9, 2026 | Author: Aurora</p>
        
        <h2>1. Introduction</h2>
        <h3>1.1 Purpose</h3>
        <p>This document specifies the functional and non-functional requirements for the White Caves Real Estate Platform, a comprehensive digital solution for luxury property transactions in Dubai.</p>
        
        <h3>1.2 Scope</h3>
        <p>The platform serves 6 user types with 40 services across 8 categories, implementing a 5-tier access model (Basic, Essential, Premium, Ultra-Premium, Corporate).</p>
        
        <h2>2. System Overview</h2>
        <h3>2.1 System Context</h3>
        <ul>
          <li><strong>Primary Users:</strong> Property buyers, sellers, landlords, tenants</li>
          <li><strong>Internal Users:</strong> Agents, admins, MD (Super Admin)</li>
          <li><strong>AI Assistants:</strong> 38 specialized assistants across 11 departments</li>
        </ul>
        
        <h3>2.2 Key Metrics</h3>
        <table>
          <tr><th>Metric</th><th>Value</th></tr>
          <tr><td>Active Properties</td><td>9,378+</td></tr>
          <tr><td>Registered Users</td><td>2,500+</td></tr>
          <tr><td>AI Assistants</td><td>38</td></tr>
          <tr><td>Services</td><td>40</td></tr>
          <tr><td>Departments</td><td>11</td></tr>
        </table>
        
        <h2>3. Functional Requirements</h2>
        <h3>3.1 Property Management</h3>
        <ul>
          <li>FR-001: System shall support property listing with 50+ attributes</li>
          <li>FR-002: System shall provide advanced search with filters for location, price, type, bedrooms</li>
          <li>FR-003: System shall integrate with DAMAC inventory for off-plan properties</li>
          <li>FR-004: System shall support virtual tours via Matterport integration</li>
        </ul>
        
        <h3>3.2 Transaction Management</h3>
        <ul>
          <li>FR-010: System shall manage sales pipeline with stage progression</li>
          <li>FR-011: System shall generate Ejari-compliant tenancy contracts</li>
          <li>FR-012: System shall support digital signatures</li>
          <li>FR-013: System shall store signed documents in Google Drive</li>
        </ul>
        
        <h3>3.3 Payment Processing</h3>
        <ul>
          <li>FR-020: System shall process payments via Stripe</li>
          <li>FR-021: System shall support Mashreq NEOBiz bank transfers</li>
          <li>FR-022: System shall generate Aani QR codes for UAE bank apps</li>
          <li>FR-023: System shall calculate agent commissions automatically</li>
        </ul>
        
        <h3>3.4 AI Assistant System</h3>
        <ul>
          <li>FR-030: System shall provide 38 specialized AI assistants</li>
          <li>FR-031: Assistants shall communicate via event bus middleware</li>
          <li>FR-032: Zoe shall aggregate suggestions from all departments</li>
          <li>FR-033: Aurora shall maintain system documentation</li>
        </ul>
        
        <h2>4. Non-Functional Requirements</h2>
        <h3>4.1 Performance</h3>
        <ul>
          <li>NFR-001: Page load time shall be under 2 seconds</li>
          <li>NFR-002: API response time shall be under 100ms average</li>
          <li>NFR-003: System uptime shall be 99.97%</li>
        </ul>
        
        <h3>4.2 Security</h3>
        <ul>
          <li>NFR-010: Authentication via Firebase with social logins</li>
          <li>NFR-011: Role-based access control for all features</li>
          <li>NFR-012: PCI-DSS Level 1 compliance for payments</li>
          <li>NFR-013: UAE PDPL compliance for data protection</li>
        </ul>
        
        <h3>4.3 Compliance</h3>
        <ul>
          <li>NFR-020: RERA certification for real estate operations</li>
          <li>NFR-021: Ejari compliance for tenancy contracts</li>
          <li>NFR-022: KYC/AML monitoring for transactions</li>
        </ul>
      </div>
    `,
  },

  aurora_sad: {
    id: 'aurora_sad',
    title: 'System Architecture Document (SAD)',
    source: DOCUMENT_SOURCES.AURORA,
    type: DOCUMENT_TYPES.HTML,
    category: 'Technical Documentation',
    description: 'High-level architecture patterns and system design',
    version: '2.5',
    lastUpdated: '2026-01-09',
    author: 'Aurora (CTO Intelligence)',
    content: `
      <div class="doc-content">
        <h1>System Architecture Document</h1>
        <p class="doc-meta">Version 2.5 | Last Updated: January 9, 2026 | Author: Aurora</p>
        
        <h2>1. Architecture Overview</h2>
        <h3>1.1 High-Level Architecture</h3>
        <p>White Caves follows a modern three-tier architecture with React frontend, Express.js backend, and MongoDB database.</p>
        
        <h3>1.2 Technology Stack</h3>
        <table>
          <tr><th>Layer</th><th>Technologies</th></tr>
          <tr><td>Frontend</td><td>React 18, Redux Toolkit, Vite 7.3, React Router v6</td></tr>
          <tr><td>Backend</td><td>Express.js, Node.js 20, JWT Auth</td></tr>
          <tr><td>Database</td><td>MongoDB Atlas, PostgreSQL (Neon)</td></tr>
          <tr><td>Auth</td><td>Firebase Authentication</td></tr>
          <tr><td>Payments</td><td>Stripe, Mashreq NEOBiz, Aani</td></tr>
          <tr><td>Storage</td><td>Google Drive API</td></tr>
        </table>
        
        <h2>2. Component Architecture</h2>
        <h3>2.1 Frontend Components</h3>
        <ul>
          <li><strong>DashboardShell:</strong> Main layout for authenticated users</li>
          <li><strong>CRMShell:</strong> MD-only CRM interface with accordion navigation</li>
          <li><strong>AICommandCenter:</strong> 38 AI assistants in right sidebar</li>
          <li><strong>ContextualDashboardRenderer:</strong> Dynamic view routing</li>
        </ul>
        
        <h3>2.2 State Management</h3>
        <ul>
          <li>Redux Toolkit for global state</li>
          <li>Slices: auth, properties, leads, crm, compliance, payments</li>
          <li>Event bus middleware for AI assistant communication</li>
        </ul>
        
        <h2>3. Data Flow</h2>
        <h3>3.1 AI Assistant Event Flow</h3>
        <pre>
User Action → Redux Dispatch → Event Bus Middleware
    → Target Assistant(s) → State Update → UI Refresh
        </pre>
        
        <h3>3.2 Document Flow</h3>
        <pre>
Create Document → Digital Signature → PDF Generation
    → Google Drive Upload → Notification
        </pre>
        
        <h2>4. Integration Points</h2>
        <h3>4.1 External Services</h3>
        <ul>
          <li>Stripe: Payment processing</li>
          <li>Firebase: Authentication</li>
          <li>Google Drive: Document storage</li>
          <li>Google Maps: Property locations</li>
          <li>WhatsApp Business: Customer communication</li>
        </ul>
        
        <h2>5. Deployment Architecture</h2>
        <h3>5.1 Infrastructure</h3>
        <ul>
          <li><strong>Hosting:</strong> Replit Deployments</li>
          <li><strong>Database:</strong> MongoDB Atlas M10</li>
          <li><strong>CDN:</strong> Cloudflare</li>
          <li><strong>Monitoring:</strong> Vercel Speed Insights</li>
        </ul>
      </div>
    `,
  },

  aurora_api: {
    id: 'aurora_api',
    title: 'API Specification',
    source: DOCUMENT_SOURCES.AURORA,
    type: DOCUMENT_TYPES.HTML,
    category: 'Technical Documentation',
    description: 'Complete REST API endpoints documentation',
    version: '2.5',
    lastUpdated: '2026-01-09',
    author: 'Aurora (CTO Intelligence)',
    content: `
      <div class="doc-content">
        <h1>API Specification</h1>
        <p class="doc-meta">Version 2.5 | Base URL: /api</p>
        
        <h2>1. Authentication</h2>
        <h3>POST /api/auth/login</h3>
        <pre>
Request:
{
  "email": "user@example.com",
  "password": "********"
}

Response:
{
  "token": "jwt_token",
  "user": { "id", "email", "role" }
}
        </pre>
        
        <h2>2. Properties</h2>
        <h3>GET /api/properties</h3>
        <p>Retrieve properties with filters</p>
        <pre>
Query Parameters:
- type: villa|apartment|penthouse|townhouse|commercial
- location: string
- minPrice: number
- maxPrice: number
- bedrooms: number
- status: available|sold|rented
        </pre>
        
        <h3>POST /api/properties</h3>
        <p>Create new property listing (Agent/Admin only)</p>
        
        <h2>3. Leads</h2>
        <h3>GET /api/leads</h3>
        <p>Retrieve leads pipeline</p>
        
        <h3>POST /api/leads</h3>
        <p>Create new lead</p>
        
        <h3>PATCH /api/leads/:id/status</h3>
        <p>Update lead status in pipeline</p>
        
        <h2>4. Transactions</h2>
        <h3>GET /api/transactions</h3>
        <p>Retrieve transactions list</p>
        
        <h3>POST /api/transactions/tenancy</h3>
        <p>Create tenancy agreement</p>
        
        <h2>5. Payments</h2>
        <h3>POST /api/payments/create-intent</h3>
        <p>Create Stripe payment intent</p>
        
        <h3>POST /api/payments/aani/generate</h3>
        <p>Generate Aani QR code for payment</p>
        
        <h2>6. Documents</h2>
        <h3>POST /api/documents/sign</h3>
        <p>Submit digital signature</p>
        
        <h3>GET /api/documents/:id</h3>
        <p>Retrieve signed document</p>
      </div>
    `,
  },

  aurora_database: {
    id: 'aurora_database',
    title: 'Database Schema & Data Dictionary',
    source: DOCUMENT_SOURCES.AURORA,
    type: DOCUMENT_TYPES.HTML,
    category: 'Technical Documentation',
    description: 'Complete database schema with entity relationships',
    version: '2.5',
    lastUpdated: '2026-01-09',
    author: 'Aurora (CTO Intelligence)',
    content: `
      <div class="doc-content">
        <h1>Database Schema & Data Dictionary</h1>
        <p class="doc-meta">Version 2.5 | Database: MongoDB Atlas</p>
        
        <h2>1. Core Collections</h2>
        
        <h3>1.1 Users Collection</h3>
        <table>
          <tr><th>Field</th><th>Type</th><th>Description</th></tr>
          <tr><td>_id</td><td>ObjectId</td><td>Unique identifier</td></tr>
          <tr><td>email</td><td>String</td><td>User email (unique)</td></tr>
          <tr><td>role</td><td>String</td><td>buyer|seller|landlord|tenant|agent|admin|md</td></tr>
          <tr><td>firebaseUid</td><td>String</td><td>Firebase Auth UID</td></tr>
          <tr><td>profile</td><td>Object</td><td>User profile details</td></tr>
          <tr><td>permissions</td><td>Array</td><td>Access permissions</td></tr>
          <tr><td>createdAt</td><td>Date</td><td>Account creation date</td></tr>
        </table>
        
        <h3>1.2 Properties Collection</h3>
        <table>
          <tr><th>Field</th><th>Type</th><th>Description</th></tr>
          <tr><td>_id</td><td>ObjectId</td><td>Unique identifier</td></tr>
          <tr><td>title</td><td>String</td><td>Property title</td></tr>
          <tr><td>type</td><td>String</td><td>villa|apartment|penthouse|townhouse|commercial</td></tr>
          <tr><td>location</td><td>Object</td><td>Address, coordinates, community</td></tr>
          <tr><td>price</td><td>Number</td><td>Listing price in AED</td></tr>
          <tr><td>bedrooms</td><td>Number</td><td>Number of bedrooms</td></tr>
          <tr><td>bathrooms</td><td>Number</td><td>Number of bathrooms</td></tr>
          <tr><td>area</td><td>Number</td><td>Area in sqft</td></tr>
          <tr><td>images</td><td>Array</td><td>Image URLs</td></tr>
          <tr><td>status</td><td>String</td><td>available|sold|rented|reserved</td></tr>
          <tr><td>developer</td><td>String</td><td>Developer name (off-plan)</td></tr>
          <tr><td>agentId</td><td>ObjectId</td><td>Assigned agent reference</td></tr>
        </table>
        
        <h3>1.3 Leads Collection</h3>
        <table>
          <tr><th>Field</th><th>Type</th><th>Description</th></tr>
          <tr><td>_id</td><td>ObjectId</td><td>Unique identifier</td></tr>
          <tr><td>name</td><td>String</td><td>Lead name</td></tr>
          <tr><td>email</td><td>String</td><td>Contact email</td></tr>
          <tr><td>phone</td><td>String</td><td>Contact phone</td></tr>
          <tr><td>source</td><td>String</td><td>Lead source (website, whatsapp, referral)</td></tr>
          <tr><td>status</td><td>String</td><td>new|contacted|qualified|proposal|negotiation|won|lost</td></tr>
          <tr><td>score</td><td>Number</td><td>AI-calculated lead score (0-100)</td></tr>
          <tr><td>assignedAgent</td><td>ObjectId</td><td>Assigned agent reference</td></tr>
          <tr><td>propertyInterests</td><td>Array</td><td>Property preferences</td></tr>
        </table>
        
        <h3>1.4 Transactions Collection</h3>
        <table>
          <tr><th>Field</th><th>Type</th><th>Description</th></tr>
          <tr><td>_id</td><td>ObjectId</td><td>Unique identifier</td></tr>
          <tr><td>type</td><td>String</td><td>sale|rental</td></tr>
          <tr><td>propertyId</td><td>ObjectId</td><td>Property reference</td></tr>
          <tr><td>buyerId/tenantId</td><td>ObjectId</td><td>Client reference</td></tr>
          <tr><td>agentId</td><td>ObjectId</td><td>Agent reference</td></tr>
          <tr><td>amount</td><td>Number</td><td>Transaction amount</td></tr>
          <tr><td>stage</td><td>String</td><td>Current transaction stage</td></tr>
          <tr><td>documents</td><td>Array</td><td>Associated document references</td></tr>
          <tr><td>ejariNumber</td><td>String</td><td>Ejari registration (rentals)</td></tr>
        </table>
        
        <h2>2. Relationships</h2>
        <pre>
Users (1) ──< Properties (many) [as agent]
Users (1) ──< Leads (many) [as assigned agent]
Properties (1) ──< Transactions (many)
Users (1) ──< Transactions (many) [as client]
        </pre>
      </div>
    `,
  },

  aurora_ai_catalog: {
    id: 'aurora_ai_catalog',
    title: 'AI Strategy & Assistant Catalog',
    source: DOCUMENT_SOURCES.AURORA,
    type: DOCUMENT_TYPES.HTML,
    category: 'Technical Documentation',
    description: 'Complete catalog of 38 AI assistants with capabilities',
    version: '2.5',
    lastUpdated: '2026-01-09',
    author: 'Aurora (CTO Intelligence)',
    content: `
      <div class="doc-content">
        <h1>AI Strategy & Assistant Catalog</h1>
        <p class="doc-meta">Version 2.5 | Total Assistants: 38</p>
        
        <h2>1. AI Strategy Overview</h2>
        <p>White Caves employs 38 specialized AI assistants across 11 departments to automate operations, enhance decision-making, and improve customer experience.</p>
        
        <h2>2. Department Structure</h2>
        <h3>Executive (2 Assistants)</h3>
        <table>
          <tr><th>Name</th><th>Role</th><th>Capabilities</th></tr>
          <tr><td>Zoe</td><td>Executive AI</td><td>Strategic intelligence, cross-department analytics, suggestion aggregation</td></tr>
          <tr><td>Phoenix</td><td>Crisis Management</td><td>Emergency response, escalation handling</td></tr>
        </table>
        
        <h3>Technology (8 Assistants)</h3>
        <table>
          <tr><th>Name</th><th>Role</th><th>Capabilities</th></tr>
          <tr><td>Aurora</td><td>CTO Intelligence</td><td>System monitoring, documentation, SDLC management</td></tr>
          <tr><td>Hazel</td><td>Frontend Support</td><td>Component library, UI documentation</td></tr>
          <tr><td>Willow</td><td>Backend Support</td><td>API management, server architecture</td></tr>
          <tr><td>Stella</td><td>Backend Engineer</td><td>API & Server Architecture</td></tr>
          <tr><td>Nova</td><td>Backend Engineer</td><td>Data Processing & Integration</td></tr>
          <tr><td>Ember</td><td>Frontend Engineer</td><td>UI Documentation & Standards</td></tr>
          <tr><td>Marina</td><td>DevOps Engineer</td><td>Deployment & Operations</td></tr>
          <tr><td>Celeste</td><td>AI/ML Engineer</td><td>ML Pipeline Documentation</td></tr>
        </table>
        
        <h3>Sales (5 Assistants)</h3>
        <table>
          <tr><th>Name</th><th>Role</th><th>Capabilities</th></tr>
          <tr><td>Clara</td><td>Lead Manager</td><td>Lead pipeline, qualification, scoring</td></tr>
          <tr><td>Hunter</td><td>Lead Prospecting</td><td>Lead sources, acquisition</td></tr>
          <tr><td>Oliver</td><td>Negotiation AI</td><td>Deal negotiation support</td></tr>
          <tr><td>Kairos</td><td>Luxury Specialist</td><td>VIP client services</td></tr>
          <tr><td>Chloe</td><td>Client Relations</td><td>Customer relationship management</td></tr>
        </table>
        
        <h3>Operations (5 Assistants)</h3>
        <table>
          <tr><th>Name</th><th>Role</th><th>Capabilities</th></tr>
          <tr><td>Mary</td><td>Inventory Manager</td><td>Property data, DAMAC integration</td></tr>
          <tr><td>Daisy</td><td>Property Coordinator</td><td>Property operations</td></tr>
          <tr><td>Sentinel</td><td>Property Analytics</td><td>Property performance metrics</td></tr>
          <tr><td>Atlas</td><td>Project Management</td><td>Off-plan project tracking</td></tr>
          <tr><td>Aria</td><td>Scheduling Assistant</td><td>Appointment management</td></tr>
        </table>
        
        <h3>Communications (5 Assistants)</h3>
        <table>
          <tr><th>Name</th><th>Role</th><th>Capabilities</th></tr>
          <tr><td>Linda</td><td>WhatsApp Manager</td><td>23+ agent WhatsApp accounts</td></tr>
          <tr><td>Nina</td><td>WhatsApp Bot</td><td>Chatbot automation</td></tr>
          <tr><td>Laila</td><td>Arabic Communications</td><td>Arabic language support</td></tr>
          <tr><td>Juno</td><td>Community Manager</td><td>Community engagement</td></tr>
          <tr><td>Echo</td><td>Voice Assistant</td><td>Voice-based queries</td></tr>
        </table>
        
        <h2>3. Event Bus Architecture</h2>
        <p>All assistants communicate via Redux middleware event bus, enabling:</p>
        <ul>
          <li>Cross-department suggestions to Zoe</li>
          <li>Real-time status updates</li>
          <li>Coordinated workflows</li>
          <li>Audit logging</li>
        </ul>
      </div>
    `,
  },

  aurora_roadmap: {
    id: 'aurora_roadmap',
    title: 'Project Roadmap',
    source: DOCUMENT_SOURCES.AURORA,
    type: DOCUMENT_TYPES.HTML,
    category: 'Technical Documentation',
    description: 'Platform development roadmap and milestones',
    version: '2.5',
    lastUpdated: '2026-01-09',
    author: 'Aurora (CTO Intelligence)',
    content: `
      <div class="doc-content">
        <h1>Project Roadmap</h1>
        <p class="doc-meta">Version 2.5 | Current Phase: Production</p>
        
        <h2>Completed Milestones</h2>
        <table>
          <tr><th>Date</th><th>Milestone</th><th>Status</th></tr>
          <tr><td>Jun 2025</td><td>Project Kickoff</td><td>✅ Completed</td></tr>
          <tr><td>Jul 2025</td><td>Core Platform Development</td><td>✅ Completed</td></tr>
          <tr><td>Aug 2025</td><td>Property Management Module</td><td>✅ Completed</td></tr>
          <tr><td>Sep 2025</td><td>Stripe Payment Integration</td><td>✅ Completed</td></tr>
          <tr><td>Oct 2025</td><td>Production Launch v1.0</td><td>✅ Completed</td></tr>
          <tr><td>Oct 2025</td><td>AI Assistants Phase 1 (8)</td><td>✅ Completed</td></tr>
          <tr><td>Nov 2025</td><td>WhatsApp Business Integration</td><td>✅ Completed</td></tr>
          <tr><td>Dec 2025</td><td>AI Assistants Phase 2 (16)</td><td>✅ Completed</td></tr>
          <tr><td>Dec 2025</td><td>DAMAC Inventory Integration</td><td>✅ Completed</td></tr>
          <tr><td>Jan 2026</td><td>AI Assistants Complete (38)</td><td>✅ Completed</td></tr>
        </table>
        
        <h2>Current Sprint</h2>
        <table>
          <tr><th>Feature</th><th>Status</th><th>Target</th></tr>
          <tr><td>Organization Dashboard</td><td>🔄 In Progress</td><td>Jan 2026</td></tr>
          <tr><td>CRM Document Viewer</td><td>🔄 In Progress</td><td>Jan 2026</td></tr>
          <tr><td>Enhanced Navigation</td><td>🔄 In Progress</td><td>Jan 2026</td></tr>
        </table>
        
        <h2>Upcoming Features</h2>
        <table>
          <tr><th>Feature</th><th>Target</th></tr>
          <tr><td>Mobile App (iOS/Android)</td><td>Feb 2026</td></tr>
          <tr><td>UAE Pass Integration</td><td>Mar 2026</td></tr>
          <tr><td>AR Property Tours</td><td>Apr 2026</td></tr>
          <tr><td>Voice Assistant</td><td>May 2026</td></tr>
        </table>
      </div>
    `,
  },

  aurora_feature_registry: {
    id: 'aurora_feature_registry',
    title: 'Feature Registry',
    source: DOCUMENT_SOURCES.AURORA,
    type: DOCUMENT_TYPES.HTML,
    category: 'Technical Documentation',
    description: 'Complete catalog of platform features with status',
    version: '2.5',
    lastUpdated: '2026-01-09',
    author: 'Aurora (CTO Intelligence)',
  },

  aurora_release_history: {
    id: 'aurora_release_history',
    title: 'Release History',
    source: DOCUMENT_SOURCES.AURORA,
    type: DOCUMENT_TYPES.HTML,
    category: 'Technical Documentation',
    description: 'Version release notes and changelog',
    version: '2.5',
    lastUpdated: '2026-01-09',
    author: 'Aurora (CTO Intelligence)',
  },

  company_rera_compliance: {
    id: 'company_rera_compliance',
    title: 'RERA Compliance Guidelines',
    source: DOCUMENT_SOURCES.COMPANY,
    type: DOCUMENT_TYPES.HTML,
    category: 'Compliance',
    description: 'Dubai Real Estate Regulatory Agency compliance requirements',
    version: '1.0',
    lastUpdated: '2025-12-01',
    author: 'Compliance Department',
    content: `
      <div class="doc-content">
        <h1>RERA Compliance Guidelines</h1>
        <p class="doc-meta">Version 1.0 | Dubai Real Estate Regulatory Agency</p>
        
        <h2>1. Overview</h2>
        <p>All real estate activities must comply with RERA regulations to maintain our license and protect clients.</p>
        
        <h2>2. Agent Requirements</h2>
        <ul>
          <li>Valid RERA broker card</li>
          <li>Annual license renewal</li>
          <li>Mandatory training completion</li>
          <li>Commission disclosure requirements</li>
        </ul>
        
        <h2>3. Transaction Requirements</h2>
        <ul>
          <li>Form A/B for sales transactions</li>
          <li>Ejari registration for all rentals</li>
          <li>DLD registration within 30 days</li>
          <li>Proper escrow account usage</li>
        </ul>
        
        <h2>4. Documentation</h2>
        <ul>
          <li>Title deed verification for all properties</li>
          <li>Developer NOC for off-plan sales</li>
          <li>Service charge clearance certificates</li>
          <li>PDC handling procedures</li>
        </ul>
      </div>
    `,
  },

  company_ejari_guide: {
    id: 'company_ejari_guide',
    title: 'Ejari Registration Guide',
    source: DOCUMENT_SOURCES.COMPANY,
    type: DOCUMENT_TYPES.HTML,
    category: 'Procedures',
    description: 'Step-by-step guide for Ejari tenancy registration',
    version: '1.0',
    lastUpdated: '2025-12-01',
    author: 'Leasing Department',
    content: `
      <div class="doc-content">
        <h1>Ejari Registration Guide</h1>
        <p class="doc-meta">Version 1.0 | Tenancy Contract Registration</p>
        
        <h2>1. What is Ejari?</h2>
        <p>Ejari is the official system for registering tenancy contracts in Dubai, mandatory for all rental agreements.</p>
        
        <h2>2. Required Documents</h2>
        <h3>From Landlord:</h3>
        <ul>
          <li>Title deed copy</li>
          <li>Emirates ID copy</li>
          <li>Passport copy</li>
        </ul>
        
        <h3>From Tenant:</h3>
        <ul>
          <li>Emirates ID copy</li>
          <li>Passport copy</li>
          <li>Visa page copy</li>
        </ul>
        
        <h2>3. Registration Steps</h2>
        <ol>
          <li>Create tenancy contract in system</li>
          <li>Collect digital signatures from both parties</li>
          <li>Upload to RERA portal</li>
          <li>Pay registration fee (AED 220)</li>
          <li>Receive Ejari certificate</li>
        </ol>
        
        <h2>4. Timeline</h2>
        <p>Registration must be completed within 14 days of contract signing.</p>
      </div>
    `,
  },

  company_service_catalog: {
    id: 'company_service_catalog',
    title: 'Service Catalog',
    source: DOCUMENT_SOURCES.COMPANY,
    type: DOCUMENT_TYPES.HTML,
    category: 'Services',
    description: 'Complete catalog of 40 services across 8 categories',
    version: '1.0',
    lastUpdated: '2026-01-01',
    author: 'Operations Department',
    content: `
      <div class="doc-content">
        <h1>Service Catalog</h1>
        <p class="doc-meta">Version 1.0 | 40 Services | 8 Categories</p>
        
        <h2>1. Sales Services</h2>
        <ul>
          <li>Property Sale Consultation</li>
          <li>Market Valuation</li>
          <li>Buyer Matching</li>
          <li>Negotiation Support</li>
          <li>Transaction Management</li>
        </ul>
        
        <h2>2. Rental Services</h2>
        <ul>
          <li>Rental Listing</li>
          <li>Tenant Screening</li>
          <li>Lease Agreement</li>
          <li>Ejari Registration</li>
          <li>Renewal Management</li>
        </ul>
        
        <h2>3. Property Management</h2>
        <ul>
          <li>Maintenance Coordination</li>
          <li>Rent Collection</li>
          <li>Inspection Services</li>
          <li>Handover Coordination</li>
          <li>Snagging Reports</li>
        </ul>
        
        <h2>4. Financial Services</h2>
        <ul>
          <li>Mortgage Consultation</li>
          <li>Payment Processing</li>
          <li>Invoice Generation</li>
          <li>Commission Calculation</li>
        </ul>
        
        <h2>5. Legal Services</h2>
        <ul>
          <li>Contract Review</li>
          <li>Title Deed Transfer</li>
          <li>NOC Processing</li>
          <li>Dispute Resolution</li>
        </ul>
      </div>
    `,
  },
};

export const getDocumentById = (docId) => DOCUMENT_REGISTRY[docId] || null;

export const getDocumentsBySource = (source) => 
  Object.values(DOCUMENT_REGISTRY).filter(doc => doc.source === source);

export const getDocumentsByCategory = (category) =>
  Object.values(DOCUMENT_REGISTRY).filter(doc => doc.category === category);

export const getAuroraDocuments = () => getDocumentsBySource(DOCUMENT_SOURCES.AURORA);

export const getCompanyDocuments = () => getDocumentsBySource(DOCUMENT_SOURCES.COMPANY);

export const getAllDocuments = () => Object.values(DOCUMENT_REGISTRY);

export const AURORA_DOCUMENT_INDEX = [
  { id: 'aurora_srs', title: 'Software Requirements Specification', icon: 'FileText' },
  { id: 'aurora_sad', title: 'System Architecture Document', icon: 'Network' },
  { id: 'aurora_api', title: 'API Specification', icon: 'Code' },
  { id: 'aurora_database', title: 'Database Schema', icon: 'Database' },
  { id: 'aurora_ai_catalog', title: 'AI Assistant Catalog', icon: 'Bot' },
  { id: 'aurora_roadmap', title: 'Project Roadmap', icon: 'Map' },
  { id: 'aurora_feature_registry', title: 'Feature Registry', icon: 'List' },
  { id: 'aurora_release_history', title: 'Release History', icon: 'History' },
];

export const COMPANY_DOCUMENT_INDEX = [
  { id: 'company_rera_compliance', title: 'RERA Compliance Guidelines', icon: 'Shield' },
  { id: 'company_ejari_guide', title: 'Ejari Registration Guide', icon: 'FileCheck' },
  { id: 'company_service_catalog', title: 'Service Catalog', icon: 'Briefcase' },
];

export default DOCUMENT_REGISTRY;
