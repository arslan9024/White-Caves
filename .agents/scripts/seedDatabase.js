import mongoose from 'mongoose';

import InventoryProperty from '../server/models/InventoryProperty.js';
import Owner from '../server/models/Owner.js';
import Lead from '../server/models/Lead.js';
import { Contract, WhatsAppContact, WhatsAppMessage } from '../server/lib/database.js';

import {
  DUBAI_COMMUNITIES,
  DAMAC_HILLS_2_CLUSTERS,
  PROPERTY_TYPES,
  PROPERTY_STATUSES,
  PROPERTY_PURPOSES,
  VIEW_TYPES,
  AMENITIES,
  AGENT_FIRST_NAMES,
  AGENT_LAST_NAMES,
  OWNER_FIRST_NAMES,
  OWNER_LAST_NAMES,
  NATIONALITIES,
  LEAD_SOURCES,
  LEAD_STATUSES,
  LEAD_STAGES,
  INTERACTION_TYPES,
  TAGS,
  randomElement,
  randomElements,
  randomBetween,
  randomPrice,
  generateUAEPhone,
  generateEmail,
  generatePNumber,
  generateReraNumber,
  generateEmiratesId,
  generateDate
} from './data/constants.js';

const AI_AGENTS = [
  { id: 'linda', name: 'Linda' },
  { id: 'clara', name: 'Clara' },
  { id: 'sophia', name: 'Sophia' },
  { id: 'daisy', name: 'Daisy' },
  { id: 'mary', name: 'Mary' },
  { id: 'hunter', name: 'Hunter' }
];

function generateOwner() {
  const firstName = randomElement(OWNER_FIRST_NAMES);
  const lastName = randomElement(OWNER_LAST_NAMES);
  const name = `${firstName} ${lastName}`;
  const phone = generateUAEPhone();
  const email = generateEmail(firstName, lastName);

  return {
    name,
    nameNormalized: name.toLowerCase().replace(/[^a-z0-9]/g, ''),
    nationality: randomElement(NATIONALITIES),
    emiratesId: Math.random() > 0.3 ? generateEmiratesId() : null,
    contacts: [
      { type: 'mobile', value: phone, isPrimary: true, isVerified: Math.random() > 0.5 },
      { type: 'email', value: email, isPrimary: false, isVerified: Math.random() > 0.3 },
      { type: 'whatsapp', value: phone, isPrimary: false, isVerified: Math.random() > 0.4 }
    ],
    notes: Math.random() > 0.7 ? 'VIP client, preferred communication via WhatsApp' : '',
    tags: randomElements(TAGS, 0, 3),
    source: randomElement(['manual', 'excel_import', 'api']),
    isActive: true,
    createdAt: generateDate(365),
    updatedAt: new Date()
  };
}

function generateProperty(ownerId) {
  const propertyType = randomElement(PROPERTY_TYPES);
  const isDamacHills2 = Math.random() > 0.3;
  const area = isDamacHills2 ? 'DAMAC Hills 2' : randomElement(DUBAI_COMMUNITIES);
  const cluster = isDamacHills2 ? randomElement(DAMAC_HILLS_2_CLUSTERS) : null;
  const purpose = randomElement(PROPERTY_PURPOSES);
  const status = randomElement(PROPERTY_STATUSES);
  
  let askingPrice;
  if (purpose === 'rent') {
    askingPrice = randomPrice(30000, 500000);
  } else {
    askingPrice = randomPrice(propertyType.minPrice, propertyType.maxPrice);
  }

  const rooms = propertyType.type === 'studio' ? 0 : 
                propertyType.type === 'apartment' ? randomBetween(1, 3) :
                propertyType.type === 'villa' ? randomBetween(3, 7) :
                propertyType.type === 'townhouse' ? randomBetween(2, 4) :
                propertyType.type === 'penthouse' ? randomBetween(3, 5) :
                propertyType.type === 'duplex' ? randomBetween(3, 4) : 0;

  const actualArea = propertyType.type === 'studio' ? randomBetween(400, 600) :
                     propertyType.type === 'apartment' ? randomBetween(600, 2500) :
                     propertyType.type === 'villa' ? randomBetween(3000, 15000) :
                     propertyType.type === 'townhouse' ? randomBetween(1800, 4000) :
                     propertyType.type === 'penthouse' ? randomBetween(3000, 8000) :
                     propertyType.type === 'plot' ? randomBetween(5000, 50000) :
                     randomBetween(1500, 3500);

  const agent = randomElement(AI_AGENTS);

  return {
    pNumber: generatePNumber(),
    area,
    project: isDamacHills2 ? 'DAMAC Hills 2' : area,
    masterProject: isDamacHills2 ? 'DAMAC' : null,
    cluster,
    plotNumber: `PLT-${randomBetween(100, 9999)}`,
    building: propertyType.type === 'apartment' || propertyType.type === 'studio' ? 
              `Tower ${randomElement(['A', 'B', 'C', 'D'])}` : null,
    unitNumber: `${randomBetween(100, 999)}`,
    floor: propertyType.type === 'apartment' || propertyType.type === 'penthouse' ? 
           randomBetween(1, 50) : null,
    layout: `${rooms} BR + ${randomBetween(1, rooms + 1)} BA`,
    viewType: randomElement(VIEW_TYPES),
    propertyType: propertyType.type,
    rooms,
    actualArea,
    areaUnit: 'sqft',
    status,
    purpose,
    askingPrice,
    currency: 'AED',
    registration: generateReraNumber(),
    municipalityNo: `MUN-${randomBetween(10000, 99999)}`,
    dewaPremiseNumber: `DEWA-${randomBetween(100000, 999999)}`,
    owners: [ownerId],
    primaryOwner: ownerId,
    agent: { id: agent.id, name: agent.name },
    images: [],
    notes: '',
    tags: randomElements(['Exclusive', 'Hot Deal', 'New Listing', 'Price Drop', 'Premium'], 0, 2),
    featured: Math.random() > 0.85,
    views: randomBetween(0, 500),
    inquiries: randomBetween(0, 50),
    source: 'manual',
    isActive: true,
    createdAt: generateDate(180),
    updatedAt: new Date()
  };
}

function generateLead(propertyId, property) {
  const firstName = randomElement([...OWNER_FIRST_NAMES, ...AGENT_FIRST_NAMES]);
  const lastName = randomElement([...OWNER_LAST_NAMES, ...AGENT_LAST_NAMES]);
  const name = `${firstName} ${lastName}`;
  const phone = generateUAEPhone();
  const email = generateEmail(firstName, lastName);
  const source = randomElement(LEAD_SOURCES);
  const status = randomElement(LEAD_STATUSES);
  
  const stageByStatus = {
    'new': 'inquiry',
    'contacted': randomElement(['inquiry', 'viewing-scheduled']),
    'qualified': randomElement(['viewing-completed', 'offer-made']),
    'negotiating': randomElement(['negotiation', 'documentation']),
    'converted': 'closed',
    'lost': randomElement(['inquiry', 'viewing-completed', 'offer-made'])
  };
  const stage = stageByStatus[status];

  const scoreByStatus = {
    'new': randomBetween(10, 40),
    'contacted': randomBetween(30, 55),
    'qualified': randomBetween(60, 85),
    'negotiating': randomBetween(75, 95),
    'converted': 100,
    'lost': randomBetween(5, 30)
  };
  const score = scoreByStatus[status];

  const agent = randomElement(AI_AGENTS);

  const interactionCount = randomBetween(0, 8);
  const interactions = [];
  for (let i = 0; i < interactionCount; i++) {
    interactions.push({
      type: randomElement(INTERACTION_TYPES),
      summary: randomElement([
        'Initial inquiry about property',
        'Discussed pricing and payment terms',
        'Scheduled property viewing',
        'Completed property tour',
        'Sent documents for review',
        'Follow-up call regarding interest',
        'Negotiated price adjustment',
        'Provided additional property details'
      ]),
      outcome: randomElement(['Positive', 'Neutral', 'Needs follow-up', 'Moved to next stage']),
      date: generateDate(90),
      agentId: agent.id
    });
  }

  return {
    name,
    email,
    phone,
    source,
    status,
    stage,
    score,
    propertyInterest: propertyId,
    propertyType: property ? property.propertyType : randomElement(PROPERTY_TYPES).type,
    budget: {
      min: property ? property.askingPrice * 0.8 : randomBetween(500000, 2000000),
      max: property ? property.askingPrice * 1.2 : randomBetween(2000000, 5000000),
      currency: 'AED'
    },
    preferredLocations: randomElements(DUBAI_COMMUNITIES, 1, 3),
    assignedAgent: { id: agent.id, name: agent.name },
    notes: Math.random() > 0.6 ? 'Interested in similar properties as well' : '',
    lastContactDate: generateDate(30),
    nextFollowUp: status !== 'converted' && status !== 'lost' ? 
                   new Date(Date.now() + randomBetween(1, 14) * 24 * 60 * 60 * 1000) : null,
    tags: randomElements(TAGS, 0, 3),
    interactions,
    isActive: true,
    convertedAt: status === 'converted' ? generateDate(30) : null,
    lostReason: status === 'lost' ? randomElement([
      'Budget constraints',
      'Found another property',
      'Changed location preference',
      'No response',
      'Timing not right'
    ]) : null,
    createdAt: generateDate(120),
    updatedAt: new Date()
  };
}

function generateWhatsAppContact() {
  const firstName = randomElement(OWNER_FIRST_NAMES);
  const lastName = randomElement(OWNER_LAST_NAMES);
  const phone = generateUAEPhone();
  const waId = phone.replace(/[^0-9]/g, '');

  return {
    waId,
    phoneNumber: phone,
    name: `${firstName} ${lastName}`,
    profilePicture: null,
    lastMessageAt: generateDate(30),
    unreadCount: randomBetween(0, 5),
    tags: randomElements(['Hot Lead', 'VIP', 'Investor', 'First Inquiry'], 0, 2),
    notes: '',
    leadScore: randomBetween(0, 100),
    detectedIntent: randomElement(['buy', 'rent', 'sell', 'inquire', 'general']),
    detectedLanguage: randomElement(['en', 'ar']),
    extractedEntities: {},
    assignedAgent: randomElement([null, ...AI_AGENTS.map(a => a.id)]),
    conversationStatus: randomElement(['active', 'pending', 'resolved', 'escalated']),
    createdAt: generateDate(90),
    updatedAt: new Date()
  };
}

function generateContract(propertyId, property) {
  const status = randomElement(['draft', 'partially_signed', 'fully_signed']);
  const contractNumber = `TC-${new Date().getFullYear()}-${randomBetween(1000, 9999)}`;
  
  const lessorFirstName = randomElement(OWNER_FIRST_NAMES);
  const lessorLastName = randomElement(OWNER_LAST_NAMES);
  const tenantFirstName = randomElement(OWNER_FIRST_NAMES);
  const tenantLastName = randomElement(OWNER_LAST_NAMES);

  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - randomBetween(0, 6));
  const endDate = new Date(startDate);
  endDate.setFullYear(endDate.getFullYear() + 1);

  return {
    contractNumber,
    status,
    ownerName: `${lessorFirstName} ${lessorLastName}`,
    lessorName: `${lessorFirstName} ${lessorLastName}`,
    lessorEmiratesId: generateEmiratesId(),
    lessorEmail: generateEmail(lessorFirstName, lessorLastName),
    lessorPhone: generateUAEPhone(),
    tenantName: `${tenantFirstName} ${tenantLastName}`,
    tenantEmiratesId: generateEmiratesId(),
    tenantEmail: generateEmail(tenantFirstName, tenantLastName),
    tenantPhone: generateUAEPhone(),
    propertyUsage: 'Residential',
    plotNo: property?.plotNumber || `PLT-${randomBetween(100, 9999)}`,
    makaniNo: `MAK-${randomBetween(10000, 99999)}`,
    buildingName: property?.building || 'N/A',
    propertyNo: property?.unitNumber || `${randomBetween(100, 999)}`,
    propertyType: property?.propertyType || 'apartment',
    propertyArea: property?.actualArea?.toString() || randomBetween(800, 2000).toString(),
    location: property?.area || randomElement(DUBAI_COMMUNITIES),
    premisesNo: `PRE-${randomBetween(1000, 9999)}`,
    contractPeriodFrom: startDate,
    contractPeriodTo: endDate,
    contractValue: property?.askingPrice || randomBetween(50000, 200000),
    annualRent: property?.askingPrice || randomBetween(50000, 200000),
    securityDeposit: (property?.askingPrice || randomBetween(50000, 200000)) * 0.05,
    modeOfPayment: randomElement(['Cheque', 'Bank Transfer', 'Cash']),
    numberOfCheques: randomElement(['1', '2', '4', '6', '12']),
    brokerName: `${randomElement(AGENT_FIRST_NAMES)} ${randomElement(AGENT_LAST_NAMES)}`,
    brokerEmail: generateEmail(randomElement(AGENT_FIRST_NAMES), randomElement(AGENT_LAST_NAMES)),
    brokerId: `BRK-${randomBetween(10000, 99999)}`,
    signatures: {
      lessor: status !== 'draft' ? {
        signature: 'data:image/png;base64,signature_placeholder',
        signerName: `${lessorFirstName} ${lessorLastName}`,
        signedAt: generateDate(30)
      } : null,
      tenant: status === 'fully_signed' ? {
        signature: 'data:image/png;base64,signature_placeholder',
        signerName: `${tenantFirstName} ${tenantLastName}`,
        signedAt: generateDate(15)
      } : null
    },
    createdAt: generateDate(60),
    updatedAt: new Date()
  };
}

async function clearCollections() {
  console.log('Clearing existing data...');
  await Promise.all([
    Owner.deleteMany({}),
    InventoryProperty.deleteMany({}),
    Lead.deleteMany({}),
    WhatsAppContact.deleteMany({}),
    Contract.deleteMany({})
  ]);
  console.log('All collections cleared.');
}

async function seed(options = {}) {
  const {
    ownerCount = 20,
    propertyCount = 50,
    leadCount = 100,
    whatsappContactCount = 30,
    contractCount = 15,
    clear = false
  } = options;

  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI environment variable not set');
    }

    console.log('Connecting to MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    if (clear) {
      await clearCollections();
    }

    console.log(`\nCreating ${ownerCount} owners...`);
    const owners = [];
    for (let i = 0; i < ownerCount; i++) {
      const owner = await Owner.create(generateOwner());
      owners.push(owner);
      if ((i + 1) % 10 === 0) console.log(`  Created ${i + 1} owners`);
    }
    console.log(`Created ${owners.length} owners`);

    console.log(`\nCreating ${propertyCount} properties...`);
    const properties = [];
    for (let i = 0; i < propertyCount; i++) {
      const owner = randomElement(owners);
      const propertyData = generateProperty(owner._id);
      const property = await InventoryProperty.create(propertyData);
      properties.push(property);
      
      await Owner.findByIdAndUpdate(owner._id, {
        $push: { properties: property._id }
      });
      
      if ((i + 1) % 10 === 0) console.log(`  Created ${i + 1} properties`);
    }
    console.log(`Created ${properties.length} properties`);

    console.log(`\nCreating ${leadCount} leads...`);
    const leads = [];
    for (let i = 0; i < leadCount; i++) {
      const property = randomElement(properties);
      const leadData = generateLead(property._id, property);
      const lead = await Lead.create(leadData);
      leads.push(lead);
      
      await InventoryProperty.findByIdAndUpdate(property._id, {
        $inc: { inquiries: 1 }
      });
      
      if ((i + 1) % 20 === 0) console.log(`  Created ${i + 1} leads`);
    }
    console.log(`Created ${leads.length} leads`);

    console.log(`\nCreating ${whatsappContactCount} WhatsApp contacts...`);
    for (let i = 0; i < whatsappContactCount; i++) {
      await WhatsAppContact.create(generateWhatsAppContact());
    }
    console.log(`Created ${whatsappContactCount} WhatsApp contacts`);

    console.log(`\nCreating ${contractCount} contracts...`);
    const rentProperties = properties.filter(p => p.purpose === 'rent' || p.purpose === 'both');
    for (let i = 0; i < contractCount; i++) {
      const property = rentProperties.length > 0 ? randomElement(rentProperties) : randomElement(properties);
      await Contract.create(generateContract(property._id, property));
    }
    console.log(`Created ${contractCount} contracts`);

    console.log('\n========== SEEDING COMPLETE ==========');
    console.log(`Owners:            ${ownerCount}`);
    console.log(`Properties:        ${propertyCount}`);
    console.log(`Leads:             ${leadCount}`);
    console.log(`WhatsApp Contacts: ${whatsappContactCount}`);
    console.log(`Contracts:         ${contractCount}`);
    console.log('=======================================\n');

    console.log('Dashboard Preview:');
    const summary = {
      totalProperties: await InventoryProperty.countDocuments(),
      availableProperties: await InventoryProperty.countDocuments({ status: 'available' }),
      forSale: await InventoryProperty.countDocuments({ purpose: 'sale' }),
      forRent: await InventoryProperty.countDocuments({ purpose: { $in: ['rent', 'both'] } }),
      totalLeads: await Lead.countDocuments(),
      newLeads: await Lead.countDocuments({ status: 'new' }),
      qualifiedLeads: await Lead.countDocuments({ status: 'qualified' }),
      convertedLeads: await Lead.countDocuments({ status: 'converted' }),
      pendingContracts: await Contract.countDocuments({ status: { $in: ['draft', 'partially_signed'] } }),
      signedContracts: await Contract.countDocuments({ status: 'fully_signed' })
    };
    console.log(summary);

  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  }
}

const args = process.argv.slice(2);
const options = {
  clear: args.includes('--clear'),
  ownerCount: 20,
  propertyCount: 50,
  leadCount: 100,
  whatsappContactCount: 30,
  contractCount: 15
};

const countIndex = args.indexOf('--count');
if (countIndex !== -1 && args[countIndex + 1]) {
  const multiplier = parseInt(args[countIndex + 1], 10) / 50;
  options.ownerCount = Math.max(5, Math.floor(20 * multiplier));
  options.propertyCount = parseInt(args[countIndex + 1], 10);
  options.leadCount = Math.floor(options.propertyCount * 2);
  options.whatsappContactCount = Math.floor(options.propertyCount * 0.6);
  options.contractCount = Math.floor(options.propertyCount * 0.3);
}

seed(options);
