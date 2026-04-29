import ZoeConversation from '../models/ZoeConversation.js';
import InventoryProperty from '../models/InventoryProperty.js';
import Lead from '../models/Lead.js';
import Owner from '../models/Owner.js';
import { Contract, WhatsAppContact } from '../lib/database.js';

const DEPARTMENTS = {
  EXEC: {
    id: 'EXEC',
    name: 'Executive Office',
    head: 'Managing Director',
    headName: 'Arslan Malik',
    contactEmail: 'executive@whitecaves.ae',
    internalPhone: 'Ext. 100'
  },
  SALES: {
    id: 'SALES',
    name: 'Sales & Leasing Division',
    head: 'Director of Sales',
    headName: 'Tariq Al-Farsi',
    contactEmail: 'sales@whitecaves.ae',
    internalPhone: 'Ext. 201',
    teams: ['Residential Sales', 'Commercial Leasing', 'Off-Plan & New Developments']
  },
  PROPMGMT: {
    id: 'PROPMGMT',
    name: 'Property Management Division',
    head: 'Head of Property Management',
    headName: 'Layla Hassan',
    contactEmail: 'management@whitecaves.ae',
    internalPhone: 'Ext. 301'
  },
  MARKETING: {
    id: 'MARKETING',
    name: 'Marketing & Business Development',
    head: 'Marketing Director',
    headName: 'Omar Khalid',
    contactEmail: 'marketing@whitecaves.ae',
    internalPhone: 'Ext. 401'
  },
  OPERATIONS: {
    id: 'OPERATIONS',
    name: 'Operations & Finance',
    head: 'Chief Financial Officer',
    headName: 'Fatima Al-Zahra',
    contactEmail: 'operations@whitecaves.ae',
    internalPhone: 'Ext. 501'
  }
};

const SERVICES = [
  { id: 'RES-SALE-001', name: 'Primary Market Sales (Off-Plan)', category: 'Residential', department: 'SALES', team: 'Off-Plan & New Developments' },
  { id: 'RES-SALE-002', name: 'Secondary Market Sales', category: 'Residential', department: 'SALES', team: 'Residential Sales' },
  { id: 'RES-SALE-003', name: 'Luxury Villa & Penthouse Sales', category: 'Residential', department: 'SALES', team: 'Residential Sales' },
  { id: 'COMM-LEASE-001', name: 'Office Space Leasing', category: 'Commercial', department: 'SALES', team: 'Commercial Leasing' },
  { id: 'COMM-LEASE-002', name: 'Retail Unit Acquisition', category: 'Commercial', department: 'SALES', team: 'Commercial Leasing' },
  { id: 'PM-001', name: 'Full-Service Property Management', category: 'Property Management', department: 'PROPMGMT', team: 'Client Relations' },
  { id: 'PM-002', name: 'Tenant Screening & Placement', category: 'Property Management', department: 'PROPMGMT', team: 'Tenant Management' },
  { id: 'PREMIUM-001', name: 'Real Estate Investment Consultation', category: 'Premium', department: 'EXEC', team: 'Executive Office' },
  { id: 'PREMIUM-004', name: 'DLD/RERA Transaction Facilitation', category: 'Premium', department: 'OPERATIONS', team: 'Transaction Processing' }
];

const INTENT_PATTERNS = {
  department_query: [
    /who (handles?|manages?|is responsible for|leads?)/i,
    /which department/i,
    /(head|director|manager) of/i,
    /contact.*(for|about)/i,
    /reports? to/i
  ],
  service_query: [
    /what (services?|do you offer)/i,
    /how (does|do).*(work|process)/i,
    /tell me about.*(service|offering)/i,
    /what('s| is) involved in/i,
    /list.*(services?|offerings?)/i
  ],
  process_query: [
    /(steps?|process|procedure|flow|journey)/i,
    /how (do|does|to).*(buy|sell|rent|lease|manage)/i,
    /walk me through/i,
    /what('s| is) the process/i
  ],
  contact_query: [
    /who should i (contact|call|email|reach)/i,
    /contact (info|information|details)/i,
    /how (can|do) i (reach|contact)/i,
    /email|phone|extension/i
  ],
  briefing: [
    /daily (briefing|summary|report)/i,
    /morning (briefing|update)/i,
    /what('s| is) happening today/i,
    /give me (a |an )?(overview|summary|update)/i,
    /brief me/i
  ],
  metrics: [
    /how many (properties|leads|contracts)/i,
    /(kpi|metrics|stats|statistics|performance)/i,
    /conversion rate/i,
    /current (numbers|figures)/i
  ]
};

class ZoeAIService {
  static classifyIntent(query) {
    const lowerQuery = query.toLowerCase();
    
    for (const [intent, patterns] of Object.entries(INTENT_PATTERNS)) {
      for (const pattern of patterns) {
        if (pattern.test(lowerQuery)) {
          return intent;
        }
      }
    }
    return 'general';
  }

  static extractEntities(query) {
    const entities = {
      departments: [],
      services: [],
      persons: [],
      keywords: []
    };

    const lowerQuery = query.toLowerCase();

    Object.values(DEPARTMENTS).forEach(dept => {
      if (lowerQuery.includes(dept.name.toLowerCase()) || 
          lowerQuery.includes(dept.id.toLowerCase()) ||
          lowerQuery.includes(dept.headName.toLowerCase())) {
        entities.departments.push(dept.id);
      }
    });

    SERVICES.forEach(service => {
      if (lowerQuery.includes(service.name.toLowerCase()) ||
          lowerQuery.includes(service.category.toLowerCase())) {
        entities.services.push(service.id);
      }
    });

    const keywords = ['commercial', 'residential', 'leasing', 'sales', 'property management', 
                      'investment', 'tenant', 'owner', 'villa', 'apartment', 'office'];
    keywords.forEach(kw => {
      if (lowerQuery.includes(kw)) {
        entities.keywords.push(kw);
      }
    });

    return entities;
  }

  static async processQuery(query, userId, sessionId) {
    const startTime = Date.now();
    const intent = this.classifyIntent(query);
    const entities = this.extractEntities(query);

    let response;
    let sourcesUsed = [];
    let matchedItems = 0;

    switch (intent) {
      case 'department_query':
        ({ response, sourcesUsed, matchedItems } = this.handleDepartmentQuery(query, entities));
        break;
      case 'service_query':
        ({ response, sourcesUsed, matchedItems } = this.handleServiceQuery(query, entities));
        break;
      case 'process_query':
        ({ response, sourcesUsed, matchedItems } = this.handleProcessQuery(query, entities));
        break;
      case 'contact_query':
        ({ response, sourcesUsed, matchedItems } = this.handleContactQuery(query, entities));
        break;
      case 'briefing':
        ({ response, sourcesUsed, matchedItems } = await this.generateDailyBriefing());
        break;
      case 'metrics':
        ({ response, sourcesUsed, matchedItems } = await this.getMetrics());
        break;
      default:
        ({ response, sourcesUsed, matchedItems } = this.handleGeneralQuery(query, entities));
    }

    const responseTime = Date.now() - startTime;
    const confidence = this.calculateConfidence(intent, matchedItems);

    try {
      await ZoeConversation.create({
        userId,
        sessionId,
        query,
        response,
        intent,
        entities,
        metadata: {
          responseTime,
          confidence,
          sourcesUsed,
          matchedItems
        }
      });
    } catch (error) {
      console.error('[Zoe] Error saving conversation:', error);
    }

    return {
      response,
      intent,
      entities,
      metadata: {
        responseTime,
        confidence,
        sourcesUsed
      }
    };
  }

  static handleDepartmentQuery(query, entities) {
    const lowerQuery = query.toLowerCase();
    let matchedDepts = [];

    if (lowerQuery.includes('commercial') || lowerQuery.includes('office') || lowerQuery.includes('retail')) {
      matchedDepts.push(DEPARTMENTS.SALES);
    }
    if (lowerQuery.includes('property management') || lowerQuery.includes('tenant') || lowerQuery.includes('maintenance')) {
      matchedDepts.push(DEPARTMENTS.PROPMGMT);
    }
    if (lowerQuery.includes('marketing') || lowerQuery.includes('lead') || lowerQuery.includes('campaign')) {
      matchedDepts.push(DEPARTMENTS.MARKETING);
    }
    if (lowerQuery.includes('finance') || lowerQuery.includes('dld') || lowerQuery.includes('transaction')) {
      matchedDepts.push(DEPARTMENTS.OPERATIONS);
    }
    if (lowerQuery.includes('investment') || lowerQuery.includes('strategic') || lowerQuery.includes('managing director')) {
      matchedDepts.push(DEPARTMENTS.EXEC);
    }

    if (matchedDepts.length === 0 && entities.departments.length > 0) {
      matchedDepts = entities.departments.map(id => DEPARTMENTS[id]);
    }

    if (matchedDepts.length === 0) {
      return {
        response: "I can help you find the right department. We have:\n\n• **Sales & Leasing** - Property sales and rentals\n• **Property Management** - Tenant and owner services\n• **Marketing** - Lead generation and campaigns\n• **Operations & Finance** - Transactions and compliance\n• **Executive Office** - Strategic matters\n\nWhat area are you interested in?",
        sourcesUsed: ['departments'],
        matchedItems: 0
      };
    }

    const dept = matchedDepts[0];
    const response = `**Department:** ${dept.name}\n**Head:** ${dept.headName} (${dept.head})\n**Contact:** ${dept.contactEmail} | ${dept.internalPhone}\n${dept.teams ? `**Teams:** ${dept.teams.join(', ')}` : ''}`;

    return {
      response,
      sourcesUsed: ['departments'],
      matchedItems: matchedDepts.length
    };
  }

  static handleServiceQuery(query, entities) {
    const lowerQuery = query.toLowerCase();
    let matchedServices = [];

    if (lowerQuery.includes('residential') || lowerQuery.includes('villa') || lowerQuery.includes('apartment')) {
      matchedServices = SERVICES.filter(s => s.category === 'Residential');
    } else if (lowerQuery.includes('commercial') || lowerQuery.includes('office')) {
      matchedServices = SERVICES.filter(s => s.category === 'Commercial');
    } else if (lowerQuery.includes('property management') || lowerQuery.includes('tenant')) {
      matchedServices = SERVICES.filter(s => s.category === 'Property Management');
    } else if (lowerQuery.includes('investment') || lowerQuery.includes('premium')) {
      matchedServices = SERVICES.filter(s => s.category === 'Premium');
    } else if (lowerQuery.includes('all') || lowerQuery.includes('list')) {
      matchedServices = SERVICES;
    }

    if (matchedServices.length === 0) {
      return {
        response: "We offer services across these categories:\n\n• **Residential Transactions** - Buy, sell, rent homes\n• **Commercial Real Estate** - Office & retail leasing\n• **Property Management** - Full property care\n• **Premium Services** - Investment advisory\n\nWhich category interests you?",
        sourcesUsed: ['services'],
        matchedItems: 0
      };
    }

    const serviceList = matchedServices.map(s => `• **${s.name}** - ${s.department} → ${s.team}`).join('\n');
    const response = `Here are the relevant services:\n\n${serviceList}`;

    return {
      response,
      sourcesUsed: ['services'],
      matchedItems: matchedServices.length
    };
  }

  static handleProcessQuery(query, entities) {
    const lowerQuery = query.toLowerCase();

    if (lowerQuery.includes('property management') || lowerQuery.includes('manage my property')) {
      return {
        response: `**Property Management Journey (9 Steps):**

1. **Owner Onboarding** - Initial meeting and contract signing
2. **Property Valuation** - Market analysis and rental assessment
3. **Marketing & Tenant Screening** - Listing and finding tenants
4. **Lease Agreement & Ejari** - Contract and registration
5. **Deposit Collection & Handover** - Move-in coordination
6. **Monthly Rent Collection** - Ongoing payment management
7. **Maintenance Management** - Issue resolution
8. **Quarterly Inspection** - Property condition checks
9. **Annual Renewal/Exit** - Contract renewal or move-out

**Contact:** management@whitecaves.ae | Ext. 301`,
        sourcesUsed: ['service_flows'],
        matchedItems: 1
      };
    }

    if (lowerQuery.includes('buy') || lowerQuery.includes('purchase') || lowerQuery.includes('sale')) {
      return {
        response: `**Residential Sales Journey (9 Steps):**

1. **Initial Consultation** - Understanding your needs
2. **Budget Finalization** - Financial qualification
3. **Property Shortlisting** - Curating options
4. **Viewings** - Physical or virtual tours
5. **Offer & Negotiation** - Price discussion
6. **MOU Signing** - Initial agreement
7. **Due Diligence** - Legal verification
8. **Sales Agreement** - Final contract
9. **DLD Transfer & Handover** - Ownership transfer

**Contact:** sales@whitecaves.ae | Ext. 201`,
        sourcesUsed: ['service_flows'],
        matchedItems: 1
      };
    }

    if (lowerQuery.includes('invest')) {
      return {
        response: `**Investment Consultation Journey (7 Steps):**

1. **Investor Profile Assessment** - Goals and risk tolerance
2. **Market Analysis** - Opportunity identification
3. **Strategy Development** - Portfolio planning
4. **Property Sourcing** - Finding opportunities
5. **Compliance Check** - Legal verification
6. **Transaction Support** - Acquisition help
7. **Performance Monitoring** - Ongoing tracking

**Contact:** executive@whitecaves.ae | Ext. 100`,
        sourcesUsed: ['service_flows'],
        matchedItems: 1
      };
    }

    return {
      response: "I can walk you through our processes for:\n\n• **Buying/Selling** - Residential sales journey\n• **Property Management** - Owner service flow\n• **Investment** - Advisory consultation process\n• **Commercial Leasing** - Office/retail journey\n\nWhich process would you like to know about?",
      sourcesUsed: ['service_flows'],
      matchedItems: 0
    };
  }

  static handleContactQuery(query, entities) {
    const lowerQuery = query.toLowerCase();
    let contacts = [];

    if (lowerQuery.includes('commercial') || lowerQuery.includes('office') || lowerQuery.includes('leasing')) {
      const dept = DEPARTMENTS.SALES;
      contacts.push(`**Commercial Leasing:**\n• ${dept.headName} (${dept.head})\n• Email: ${dept.contactEmail}\n• Phone: ${dept.internalPhone}`);
    }
    if (lowerQuery.includes('property management') || lowerQuery.includes('tenant complaint')) {
      const dept = DEPARTMENTS.PROPMGMT;
      contacts.push(`**Property Management:**\n• ${dept.headName} (${dept.head})\n• Email: ${dept.contactEmail}\n• Phone: ${dept.internalPhone}`);
    }
    if (lowerQuery.includes('investment') || lowerQuery.includes('executive')) {
      const dept = DEPARTMENTS.EXEC;
      contacts.push(`**Executive Office:**\n• ${dept.headName} (${dept.head})\n• Email: ${dept.contactEmail}\n• Phone: ${dept.internalPhone}`);
    }

    if (contacts.length === 0) {
      const allContacts = Object.values(DEPARTMENTS).map(d => 
        `• **${d.name}:** ${d.contactEmail} | ${d.internalPhone}`
      ).join('\n');
      return {
        response: `Here are our department contacts:\n\n${allContacts}`,
        sourcesUsed: ['departments'],
        matchedItems: Object.keys(DEPARTMENTS).length
      };
    }

    return {
      response: contacts.join('\n\n'),
      sourcesUsed: ['departments'],
      matchedItems: contacts.length
    };
  }

  static async generateDailyBriefing() {
    try {
      const [propertyStats, leadStats, contractStats] = await Promise.all([
        InventoryProperty.aggregate([
          { $match: { isActive: true } },
          {
            $group: {
              _id: null,
              total: { $sum: 1 },
              available: { $sum: { $cond: [{ $eq: ['$status', 'available'] }, 1, 0] } },
              forSale: { $sum: { $cond: [{ $eq: ['$purpose', 'sale'] }, 1, 0] } },
              forRent: { $sum: { $cond: [{ $eq: ['$purpose', 'rent'] }, 1, 0] } }
            }
          }
        ]),
        Lead.aggregate([
          {
            $group: {
              _id: null,
              total: { $sum: 1 },
              new: { $sum: { $cond: [{ $eq: ['$status', 'new'] }, 1, 0] } },
              qualified: { $sum: { $cond: [{ $eq: ['$status', 'qualified'] }, 1, 0] } },
              converted: { $sum: { $cond: [{ $eq: ['$status', 'converted'] }, 1, 0] } }
            }
          }
        ]),
        Contract.countDocuments({ status: { $in: ['draft', 'pending_signature'] } })
      ]);

      const props = propertyStats[0] || { total: 0, available: 0, forSale: 0, forRent: 0 };
      const leads = leadStats[0] || { total: 0, new: 0, qualified: 0, converted: 0 };
      const conversionRate = leads.total > 0 ? ((leads.converted / leads.total) * 100).toFixed(1) : 0;

      const today = new Date();
      const dateStr = today.toLocaleDateString('en-AE', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        timeZone: 'Asia/Dubai'
      });

      const response = `**Good Morning! Daily Briefing for ${dateStr}**

📊 **Property Portfolio**
• Total Properties: ${props.total}
• Available: ${props.available}
• For Sale: ${props.forSale} | For Rent: ${props.forRent}

👥 **Lead Pipeline**
• Total Leads: ${leads.total}
• New Today: ${leads.new}
• Qualified: ${leads.qualified}
• Converted: ${leads.converted}
• Conversion Rate: ${conversionRate}%

📝 **Pending Actions**
• Contracts Pending: ${contractStats}

💡 **AI Insights**
All systems operational. ${leads.new > 5 ? '⚡ High lead volume today - prioritize follow-ups.' : 'Normal activity levels.'}`;

      return {
        response,
        sourcesUsed: ['properties', 'leads', 'contracts'],
        matchedItems: 3
      };
    } catch (error) {
      console.error('[Zoe] Briefing error:', error);
      return {
        response: "I'm having trouble generating the briefing right now. Please try again in a moment.",
        sourcesUsed: [],
        matchedItems: 0
      };
    }
  }

  static async getMetrics() {
    try {
      const [propertyCount, leadCount, ownerCount] = await Promise.all([
        InventoryProperty.countDocuments({ isActive: true }),
        Lead.countDocuments({}),
        Owner.countDocuments({})
      ]);

      const response = `**Current Metrics:**

📈 **Inventory**
• Total Properties: ${propertyCount}

👥 **CRM**
• Total Leads: ${leadCount}
• Total Owners: ${ownerCount}

All data is real-time from our MongoDB database.`;

      return {
        response,
        sourcesUsed: ['properties', 'leads', 'owners'],
        matchedItems: 3
      };
    } catch (error) {
      return {
        response: "Unable to fetch metrics at this time.",
        sourcesUsed: [],
        matchedItems: 0
      };
    }
  }

  static handleGeneralQuery(query, entities) {
    return {
      response: `I'm Zoe, your Executive AI Assistant. I can help you with:

• **Department Info** - "Who handles commercial leasing?"
• **Services** - "What services do you offer for investors?"
• **Processes** - "Walk me through the sales journey"
• **Contacts** - "Who should I contact about property management?"
• **Daily Briefing** - "Give me today's briefing"
• **Metrics** - "Show me current statistics"

What would you like to know?`,
      sourcesUsed: [],
      matchedItems: 0
    };
  }

  static calculateConfidence(intent, matchedItems) {
    if (intent === 'unknown' || intent === 'general') return 0.3;
    if (matchedItems === 0) return 0.5;
    if (matchedItems === 1) return 0.8;
    return Math.min(0.95, 0.7 + (matchedItems * 0.05));
  }

  static async getConversationHistory(sessionId, limit = 10) {
    try {
      return await ZoeConversation.getSessionHistory(sessionId, limit);
    } catch (error) {
      console.error('[Zoe] Error getting history:', error);
      return [];
    }
  }
}

export default ZoeAIService;
