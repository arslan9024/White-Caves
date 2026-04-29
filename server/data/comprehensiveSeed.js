/**
 * Comprehensive Demo Data Seed
 * Populates the platform with realistic Dubai real estate data
 */

export const DUBAI_COMMUNITIES = [
  'Palm Jumeirah', 'Downtown Dubai', 'Dubai Marina', 'Business Bay',
  'Jumeirah Beach Residence', 'DIFC', 'City Walk', 'Bluewaters Island',
  'Dubai Hills Estate', 'Arabian Ranches', 'The Springs', 'Emirates Hills',
  'Al Barari', 'Mohammed Bin Rashid City', 'Jumeirah Golf Estates',
  'Dubai Creek Harbour', 'Port de La Mer', 'La Mer', 'Tilal Al Ghaf'
];

export const DEVELOPERS = [
  'Emaar Properties', 'Nakheel', 'DAMAC Properties', 'Meraas',
  'Dubai Properties', 'Sobha Realty', 'Omniyat', 'Select Group',
  'Binghatti', 'Azizi Developments', 'Danube Properties'
];

export const EMPLOYEES_DEMO = [
  // Executive Team
  { employeeId: 'WC-001', name: 'Arslan Malik', email: 'arslan@whitecaves.ae', department: 'executive', jobTitle: 'Managing Director', level: 'C-Suite', responsibilities: ['Strategic Planning', 'Business Development', 'Investor Relations'], aiAssistant: 'zoe' },
  { employeeId: 'WC-002', name: 'Sarah Al Maktoum', email: 'sarah@whitecaves.ae', department: 'executive', jobTitle: 'Chief Operations Officer', level: 'C-Suite', responsibilities: ['Operations Management', 'Process Optimization', 'Team Leadership'] },
  
  // Sales Department
  { employeeId: 'WC-010', name: 'Ahmed Hassan', email: 'ahmed.h@whitecaves.ae', department: 'sales', jobTitle: 'Sales Director', level: 'Director', responsibilities: ['Sales Strategy', 'Team Management', 'Key Accounts'], aiAssistant: 'emma' },
  { employeeId: 'WC-011', name: 'Fatima Al Rashid', email: 'fatima@whitecaves.ae', department: 'sales', jobTitle: 'Senior Sales Agent', level: 'Senior', responsibilities: ['Luxury Villa Sales', 'HNWI Clients', 'Palm Jumeirah Specialist'] },
  { employeeId: 'WC-012', name: 'Michael Chen', email: 'michael@whitecaves.ae', department: 'sales', jobTitle: 'Sales Agent', level: 'Mid', responsibilities: ['Off-Plan Sales', 'International Clients', 'Dubai Marina Focus'] },
  { employeeId: 'WC-013', name: 'Priya Sharma', email: 'priya@whitecaves.ae', department: 'sales', jobTitle: 'Sales Agent', level: 'Mid', responsibilities: ['Secondary Market', 'Investment Properties'] },
  { employeeId: 'WC-014', name: 'Omar Khalifa', email: 'omar.k@whitecaves.ae', department: 'sales', jobTitle: 'Junior Sales Agent', level: 'Junior', responsibilities: ['Lead Follow-up', 'Property Viewings', 'CRM Updates'] },
  
  // Leasing Department
  { employeeId: 'WC-020', name: 'Nadia Hassan', email: 'nadia@whitecaves.ae', department: 'leasing', jobTitle: 'Leasing Manager', level: 'Senior', responsibilities: ['Leasing Strategy', 'Tenant Relations', 'Contract Negotiations'], aiAssistant: 'daisy' },
  { employeeId: 'WC-021', name: 'Raj Patel', email: 'raj@whitecaves.ae', department: 'leasing', jobTitle: 'Leasing Agent', level: 'Mid', responsibilities: ['Residential Leasing', 'Tenant Screening', 'Ejari Processing'] },
  { employeeId: 'WC-022', name: 'Anna Petrova', email: 'anna@whitecaves.ae', department: 'leasing', jobTitle: 'Leasing Agent', level: 'Mid', responsibilities: ['Commercial Leasing', 'Office Spaces'] },
  
  // Property Management
  { employeeId: 'WC-030', name: 'David Kim', email: 'david.k@whitecaves.ae', department: 'property_management', jobTitle: 'Property Manager', level: 'Senior', responsibilities: ['Portfolio Management', 'Maintenance Oversight', 'Owner Relations'], aiAssistant: 'nancy' },
  { employeeId: 'WC-031', name: 'Layla Mansour', email: 'layla@whitecaves.ae', department: 'property_management', jobTitle: 'Property Coordinator', level: 'Mid', responsibilities: ['Maintenance Requests', 'Vendor Management', 'Inspections'] },
  
  // Marketing
  { employeeId: 'WC-040', name: 'Emma Thompson', email: 'emma.t@whitecaves.ae', department: 'marketing', jobTitle: 'Marketing Manager', level: 'Senior', responsibilities: ['Digital Marketing', 'Brand Strategy', 'Lead Generation'], aiAssistant: 'kate' },
  { employeeId: 'WC-041', name: 'Yusuf Al Ahmed', email: 'yusuf@whitecaves.ae', department: 'marketing', jobTitle: 'Content Specialist', level: 'Mid', responsibilities: ['Property Photography', 'Virtual Tours', 'Social Media'] },
  
  // Finance
  { employeeId: 'WC-050', name: 'Jennifer Wong', email: 'jennifer@whitecaves.ae', department: 'finance', jobTitle: 'Finance Director', level: 'Director', responsibilities: ['Financial Planning', 'Reporting', 'Compliance'], aiAssistant: 'penny' },
  { employeeId: 'WC-051', name: 'Ali Ibrahim', email: 'ali.i@whitecaves.ae', department: 'finance', jobTitle: 'Accountant', level: 'Mid', responsibilities: ['Invoicing', 'Commission Tracking', 'VAT Compliance'] },
  
  // Legal & Compliance
  { employeeId: 'WC-060', name: 'Sofia Rodriguez', email: 'sofia@whitecaves.ae', department: 'legal', jobTitle: 'Legal Counsel', level: 'Senior', responsibilities: ['Contract Review', 'Legal Compliance', 'Dispute Resolution'], aiAssistant: 'carl' },
  
  // HR
  { employeeId: 'WC-070', name: 'Marcus Johnson', email: 'marcus@whitecaves.ae', department: 'hr', jobTitle: 'HR Manager', level: 'Senior', responsibilities: ['Recruitment', 'Employee Relations', 'Training'], aiAssistant: 'marcus' },
  
  // Technology
  { employeeId: 'WC-080', name: 'Alex Volkov', email: 'alex@whitecaves.ae', department: 'technology', jobTitle: 'Technology Lead', level: 'Senior', responsibilities: ['Platform Development', 'AI Integration', 'System Administration'], aiAssistant: 'aurora' }
];

export const USERS_DEMO = [
  // Buyers
  { name: 'Mohammed Al Nahyan', email: 'mohammed.n@gmail.com', phone: '+971501234567', role: 'buyer', nationality: 'UAE', preferences: { propertyType: 'villa', budget: { min: 5000000, max: 20000000 }, locations: ['Palm Jumeirah', 'Emirates Hills'] } },
  { name: 'James Richardson', email: 'james.r@gmail.com', phone: '+447911234567', role: 'buyer', nationality: 'UK', preferences: { propertyType: 'apartment', budget: { min: 2000000, max: 5000000 }, locations: ['Dubai Marina', 'Downtown Dubai'] } },
  { name: 'Liu Wei', email: 'liu.wei@qq.com', phone: '+8613812345678', role: 'buyer', nationality: 'China', preferences: { propertyType: 'penthouse', budget: { min: 10000000, max: 50000000 }, locations: ['Palm Jumeirah', 'Bluewaters Island'] } },
  { name: 'Anna Kuznetsova', email: 'anna.k@yandex.ru', phone: '+79161234567', role: 'buyer', nationality: 'Russia', preferences: { propertyType: 'apartment', budget: { min: 1500000, max: 4000000 }, locations: ['JBR', 'Business Bay'] } },
  { name: 'Raj Malhotra', email: 'raj.m@gmail.com', phone: '+919821234567', role: 'buyer', nationality: 'India', preferences: { propertyType: 'apartment', budget: { min: 800000, max: 2000000 }, locations: ['Dubai Hills Estate', 'Downtown Dubai'] } },
  { name: 'Sophie Martin', email: 'sophie.m@gmail.com', phone: '+33612345678', role: 'buyer', nationality: 'France', preferences: { propertyType: 'villa', budget: { min: 3000000, max: 8000000 }, locations: ['Arabian Ranches', 'Dubai Hills Estate'] } },
  { name: 'Ahmed Al Sayed', email: 'ahmed.s@gmail.com', phone: '+966501234567', role: 'buyer', nationality: 'Saudi Arabia', preferences: { propertyType: 'villa', budget: { min: 8000000, max: 25000000 }, locations: ['Palm Jumeirah', 'Al Barari'] } },
  { name: 'David Miller', email: 'david.m@gmail.com', phone: '+12125551234', role: 'buyer', nationality: 'USA', preferences: { propertyType: 'apartment', budget: { min: 1000000, max: 3000000 }, locations: ['DIFC', 'Downtown Dubai'] } },
  
  // Sellers
  { name: 'Khalid Bin Rashid', email: 'khalid.br@gmail.com', phone: '+971504567890', role: 'seller', nationality: 'UAE', ownedProperties: 3 },
  { name: 'Robert Wilson', email: 'robert.w@gmail.com', phone: '+447912345678', role: 'seller', nationality: 'UK', ownedProperties: 2 },
  { name: 'Faisal Al Thani', email: 'faisal.t@gmail.com', phone: '+97455123456', role: 'seller', nationality: 'Qatar', ownedProperties: 5 },
  
  // Landlords
  { name: 'Sheikh Abdullah', email: 'abdullah@emirates.ae', phone: '+971505678901', role: 'landlord', nationality: 'UAE', ownedProperties: 12 },
  { name: 'Maria Fernandez', email: 'maria.f@gmail.com', phone: '+34612345678', role: 'landlord', nationality: 'Spain', ownedProperties: 4 },
  { name: 'George Chen', email: 'george.c@gmail.com', phone: '+8613912345678', role: 'landlord', nationality: 'China', ownedProperties: 8 },
  { name: 'Hamad Al Maktoum', email: 'hamad.m@gmail.com', phone: '+971506789012', role: 'landlord', nationality: 'UAE', ownedProperties: 15 },
  
  // Tenants
  { name: 'Sarah Johnson', email: 'sarah.j@gmail.com', phone: '+971507890123', role: 'tenant', nationality: 'USA', employer: 'Google Dubai', monthlyIncome: 45000 },
  { name: 'Priyanka Chopra', email: 'priyanka.c@gmail.com', phone: '+971508901234', role: 'tenant', nationality: 'India', employer: 'Emirates Airlines', monthlyIncome: 35000 },
  { name: 'Thomas Mueller', email: 'thomas.m@gmail.com', phone: '+971509012345', role: 'tenant', nationality: 'Germany', employer: 'SAP Middle East', monthlyIncome: 55000 },
  { name: 'Olga Ivanova', email: 'olga.i@gmail.com', phone: '+971501122334', role: 'tenant', nationality: 'Russia', employer: 'Jumeirah Hotels', monthlyIncome: 28000 },
  { name: 'Carlos Mendez', email: 'carlos.m@gmail.com', phone: '+971502233445', role: 'tenant', nationality: 'Spain', employer: 'Dubai Properties', monthlyIncome: 40000 },
  { name: 'Lisa Anderson', email: 'lisa.a@gmail.com', phone: '+971503344556', role: 'tenant', nationality: 'Australia', employer: 'HSBC Dubai', monthlyIncome: 50000 },
  { name: 'Yuki Tanaka', email: 'yuki.t@gmail.com', phone: '+971504455667', role: 'tenant', nationality: 'Japan', employer: 'Toyota Middle East', monthlyIncome: 38000 },
  { name: 'Mark Stevens', email: 'mark.s@gmail.com', phone: '+971505566778', role: 'tenant', nationality: 'UK', employer: 'KPMG Dubai', monthlyIncome: 42000 },
  
  // Agents (External)
  { name: 'Rami Al Hassan', email: 'rami@partner.ae', phone: '+971506677889', role: 'agent', company: 'Partner Realty', brnNumber: 'BRN-12345' },
  { name: 'Elena Kozlova', email: 'elena@luxprop.ae', phone: '+971507788990', role: 'agent', company: 'Luxury Properties', brnNumber: 'BRN-12346' }
];

export const PROPERTIES_DEMO = [
  // Palm Jumeirah Villas
  { pNumber: 'WC-P001', area: 'Palm Jumeirah', project: 'Signature Villas', propertyType: 'villa', rooms: 6, actualArea: 12500, status: 'available', purpose: 'sale', askingPrice: 45000000, building: 'Frond N', unitNumber: 'N12', featured: true, viewType: 'Full Sea View', images: ['/properties/palm-villa-1.jpg'], amenities: ['Private Beach', 'Pool', 'Garden', 'Smart Home'] },
  { pNumber: 'WC-P002', area: 'Palm Jumeirah', project: 'Garden Homes', propertyType: 'villa', rooms: 5, actualArea: 8200, status: 'available', purpose: 'sale', askingPrice: 28000000, building: 'Frond O', unitNumber: 'O8', featured: true, viewType: 'Sea View', images: ['/properties/palm-villa-2.jpg'] },
  { pNumber: 'WC-P003', area: 'Palm Jumeirah', project: 'FIVE Palm', propertyType: 'apartment', rooms: 3, actualArea: 3500, status: 'available', purpose: 'sale', askingPrice: 8500000, building: 'Tower A', floor: 35, unitNumber: '3501', featured: true, viewType: 'Beach View' },
  { pNumber: 'WC-P004', area: 'Palm Jumeirah', project: 'Atlantis The Royal', propertyType: 'penthouse', rooms: 4, actualArea: 7800, status: 'available', purpose: 'sale', askingPrice: 75000000, floor: 42, unitNumber: 'PH-1', featured: true, viewType: 'Full Sea Panorama' },
  
  // Downtown Dubai
  { pNumber: 'WC-P010', area: 'Downtown Dubai', project: 'Burj Khalifa', propertyType: 'apartment', rooms: 3, actualArea: 2800, status: 'available', purpose: 'sale', askingPrice: 15000000, floor: 120, unitNumber: '12001', featured: true, viewType: 'Fountain View' },
  { pNumber: 'WC-P011', area: 'Downtown Dubai', project: 'Address Sky View', propertyType: 'apartment', rooms: 2, actualArea: 1650, status: 'available', purpose: 'rent', askingPrice: 280000, floor: 45, unitNumber: '4502', viewType: 'Burj Khalifa View' },
  { pNumber: 'WC-P012', area: 'Downtown Dubai', project: 'Opera Grand', propertyType: 'apartment', rooms: 4, actualArea: 4200, status: 'rented', purpose: 'rent', askingPrice: 450000, floor: 38, unitNumber: '3801', viewType: 'Opera View' },
  { pNumber: 'WC-P013', area: 'Downtown Dubai', project: 'Act One Act Two', propertyType: 'penthouse', rooms: 5, actualArea: 6500, status: 'available', purpose: 'sale', askingPrice: 42000000, floor: 50, unitNumber: 'PH-2', featured: true },
  
  // Dubai Marina
  { pNumber: 'WC-P020', area: 'Dubai Marina', project: 'Marina Gate', propertyType: 'apartment', rooms: 2, actualArea: 1400, status: 'available', purpose: 'rent', askingPrice: 145000, floor: 28, unitNumber: '2804', viewType: 'Marina View' },
  { pNumber: 'WC-P021', area: 'Dubai Marina', project: 'Cayan Tower', propertyType: 'apartment', rooms: 3, actualArea: 2100, status: 'available', purpose: 'sale', askingPrice: 4500000, floor: 55, unitNumber: '5502', viewType: 'Full Marina View' },
  { pNumber: 'WC-P022', area: 'Dubai Marina', project: 'Princess Tower', propertyType: 'apartment', rooms: 4, actualArea: 3200, status: 'available', purpose: 'sale', askingPrice: 6800000, floor: 85, unitNumber: '8501', featured: true },
  { pNumber: 'WC-P023', area: 'Dubai Marina', project: 'Damac Heights', propertyType: 'apartment', rooms: 1, actualArea: 850, status: 'rented', purpose: 'rent', askingPrice: 85000, floor: 22, unitNumber: '2203' },
  
  // Emirates Hills
  { pNumber: 'WC-P030', area: 'Emirates Hills', project: 'Sector E', propertyType: 'villa', rooms: 7, actualArea: 15000, status: 'available', purpose: 'sale', askingPrice: 85000000, plotNumber: 'E15', featured: true, viewType: 'Golf Course View', amenities: ['Private Pool', 'Home Theater', 'Gym', 'Staff Quarters'] },
  { pNumber: 'WC-P031', area: 'Emirates Hills', project: 'Sector W', propertyType: 'villa', rooms: 6, actualArea: 11000, status: 'available', purpose: 'sale', askingPrice: 55000000, plotNumber: 'W22', viewType: 'Lake View' },
  
  // Dubai Hills Estate
  { pNumber: 'WC-P040', area: 'Dubai Hills Estate', project: 'Golf Place', propertyType: 'villa', rooms: 5, actualArea: 6500, status: 'available', purpose: 'sale', askingPrice: 12500000, plotNumber: 'GP-45', viewType: 'Golf Course View' },
  { pNumber: 'WC-P041', area: 'Dubai Hills Estate', project: 'Collective', propertyType: 'apartment', rooms: 2, actualArea: 1200, status: 'available', purpose: 'rent', askingPrice: 95000, floor: 8, unitNumber: '804' },
  { pNumber: 'WC-P042', area: 'Dubai Hills Estate', project: 'Park Heights', propertyType: 'apartment', rooms: 3, actualArea: 1800, status: 'available', purpose: 'sale', askingPrice: 2800000, floor: 15, unitNumber: '1503' },
  
  // Business Bay
  { pNumber: 'WC-P050', area: 'Business Bay', project: 'Volante Tower', propertyType: 'apartment', rooms: 2, actualArea: 1350, status: 'available', purpose: 'rent', askingPrice: 120000, floor: 32, unitNumber: '3205', viewType: 'Canal View' },
  { pNumber: 'WC-P051', area: 'Business Bay', project: 'The Pad', propertyType: 'apartment', rooms: 1, actualArea: 750, status: 'rented', purpose: 'rent', askingPrice: 75000, floor: 18, unitNumber: '1802' },
  { pNumber: 'WC-P052', area: 'Business Bay', project: 'Paramount Tower', propertyType: 'apartment', rooms: 3, actualArea: 2200, status: 'available', purpose: 'sale', askingPrice: 3500000, floor: 40, unitNumber: '4001' },
  
  // JBR
  { pNumber: 'WC-P060', area: 'Jumeirah Beach Residence', project: 'Sadaf', propertyType: 'apartment', rooms: 2, actualArea: 1550, status: 'available', purpose: 'rent', askingPrice: 165000, floor: 25, unitNumber: '2508', viewType: 'Sea View' },
  { pNumber: 'WC-P061', area: 'Jumeirah Beach Residence', project: 'Rimal', propertyType: 'apartment', rooms: 4, actualArea: 3800, status: 'available', purpose: 'sale', askingPrice: 7200000, floor: 38, unitNumber: '3801', featured: true, viewType: 'Full Sea View' },
  
  // DIFC
  { pNumber: 'WC-P070', area: 'DIFC', project: 'Index Tower', propertyType: 'apartment', rooms: 2, actualArea: 1800, status: 'available', purpose: 'rent', askingPrice: 195000, floor: 45, unitNumber: '4503', viewType: 'DIFC View' },
  { pNumber: 'WC-P071', area: 'DIFC', project: 'Burj Daman', propertyType: 'apartment', rooms: 3, actualArea: 2500, status: 'available', purpose: 'sale', askingPrice: 5800000, floor: 35, unitNumber: '3502' },
  
  // Arabian Ranches
  { pNumber: 'WC-P080', area: 'Arabian Ranches', project: 'Al Mahra', propertyType: 'villa', rooms: 5, actualArea: 5200, status: 'available', purpose: 'sale', askingPrice: 6500000, plotNumber: 'AR-125', viewType: 'Community View' },
  { pNumber: 'WC-P081', area: 'Arabian Ranches', project: 'Savannah', propertyType: 'villa', rooms: 4, actualArea: 4100, status: 'available', purpose: 'rent', askingPrice: 280000, plotNumber: 'SV-88' },
  { pNumber: 'WC-P082', area: 'Arabian Ranches', project: 'Polo Homes', propertyType: 'villa', rooms: 6, actualArea: 7500, status: 'available', purpose: 'sale', askingPrice: 11000000, plotNumber: 'PH-15', featured: true },
  
  // Al Barari
  { pNumber: 'WC-P090', area: 'Al Barari', project: 'The Nest', propertyType: 'villa', rooms: 5, actualArea: 8500, status: 'available', purpose: 'sale', askingPrice: 18500000, featured: true, viewType: 'Garden View', amenities: ['Private Garden', 'Pool', 'Nature Reserve'] },
  { pNumber: 'WC-P091', area: 'Al Barari', project: 'The Reserve', propertyType: 'villa', rooms: 6, actualArea: 12000, status: 'available', purpose: 'sale', askingPrice: 35000000, viewType: 'Lake View' },
  
  // Bluewaters Island
  { pNumber: 'WC-P100', area: 'Bluewaters Island', project: 'Bluewaters Residences', propertyType: 'apartment', rooms: 3, actualArea: 2800, status: 'available', purpose: 'sale', askingPrice: 8500000, floor: 12, unitNumber: '1204', featured: true, viewType: 'Ain Dubai View' },
  { pNumber: 'WC-P101', area: 'Bluewaters Island', project: 'Bluewaters Residences', propertyType: 'penthouse', rooms: 4, actualArea: 5500, status: 'available', purpose: 'sale', askingPrice: 25000000, floor: 18, unitNumber: 'PH-3' },
  
  // City Walk
  { pNumber: 'WC-P110', area: 'City Walk', project: 'Central Park', propertyType: 'apartment', rooms: 2, actualArea: 1400, status: 'available', purpose: 'rent', askingPrice: 155000, floor: 6, unitNumber: '602' },
  { pNumber: 'WC-P111', area: 'City Walk', project: 'The Residences', propertyType: 'apartment', rooms: 3, actualArea: 2100, status: 'rented', purpose: 'rent', askingPrice: 220000, floor: 10, unitNumber: '1005' },
  
  // Port de La Mer
  { pNumber: 'WC-P120', area: 'Port de La Mer', project: 'La Cote', propertyType: 'apartment', rooms: 2, actualArea: 1650, status: 'available', purpose: 'sale', askingPrice: 4200000, floor: 8, unitNumber: '805', viewType: 'Sea View' },
  { pNumber: 'WC-P121', area: 'Port de La Mer', project: 'La Rive', propertyType: 'townhouse', rooms: 4, actualArea: 3200, status: 'available', purpose: 'sale', askingPrice: 8500000, featured: true },
  
  // MBR City
  { pNumber: 'WC-P130', area: 'Mohammed Bin Rashid City', project: 'District One', propertyType: 'villa', rooms: 6, actualArea: 9500, status: 'available', purpose: 'sale', askingPrice: 28000000, featured: true, viewType: 'Crystal Lagoon View', amenities: ['Private Beach', 'Pool', 'Smart Home'] },
  { pNumber: 'WC-P131', area: 'Mohammed Bin Rashid City', project: 'Sobha Hartland', propertyType: 'villa', rooms: 5, actualArea: 5800, status: 'available', purpose: 'sale', askingPrice: 8500000 },
  
  // Dubai Creek Harbour
  { pNumber: 'WC-P140', area: 'Dubai Creek Harbour', project: 'Creek Rise', propertyType: 'apartment', rooms: 2, actualArea: 1250, status: 'available', purpose: 'sale', askingPrice: 2100000, floor: 20, unitNumber: '2003', viewType: 'Creek View' },
  { pNumber: 'WC-P141', area: 'Dubai Creek Harbour', project: 'Harbour Views', propertyType: 'apartment', rooms: 3, actualArea: 1850, status: 'available', purpose: 'rent', askingPrice: 140000, floor: 28, unitNumber: '2802' },
  
  // The Springs
  { pNumber: 'WC-P150', area: 'The Springs', project: 'Springs 8', propertyType: 'villa', rooms: 3, actualArea: 2400, status: 'available', purpose: 'rent', askingPrice: 145000, plotNumber: 'S8-45' },
  { pNumber: 'WC-P151', area: 'The Springs', project: 'Springs 14', propertyType: 'villa', rooms: 4, actualArea: 3200, status: 'rented', purpose: 'rent', askingPrice: 185000, plotNumber: 'S14-22' },
  
  // Jumeirah Golf Estates
  { pNumber: 'WC-P160', area: 'Jumeirah Golf Estates', project: 'Flame Tree Ridge', propertyType: 'villa', rooms: 5, actualArea: 6800, status: 'available', purpose: 'sale', askingPrice: 9500000, viewType: 'Golf Course View', featured: true },
  { pNumber: 'WC-P161', area: 'Jumeirah Golf Estates', project: 'Earth Course', propertyType: 'villa', rooms: 6, actualArea: 8500, status: 'available', purpose: 'sale', askingPrice: 15000000, viewType: 'Full Golf View' },
  
  // Studios and smaller units
  { pNumber: 'WC-P170', area: 'Dubai Marina', project: 'Marina Heights', propertyType: 'studio', rooms: 0, actualArea: 550, status: 'available', purpose: 'rent', askingPrice: 55000, floor: 12, unitNumber: '1205' },
  { pNumber: 'WC-P171', area: 'Business Bay', project: 'Bay Central', propertyType: 'studio', rooms: 0, actualArea: 480, status: 'rented', purpose: 'rent', askingPrice: 48000, floor: 8, unitNumber: '802' },
  { pNumber: 'WC-P172', area: 'Downtown Dubai', project: 'Standpoint', propertyType: 'studio', rooms: 0, actualArea: 520, status: 'available', purpose: 'sale', askingPrice: 950000, floor: 15, unitNumber: '1503' }
];

export const LEADS_DEMO = [
  // Hot Leads
  { name: 'Abdulrahman Al Faisal', email: 'abdulrahman@gmail.com', phone: '+966551234567', source: 'website', status: 'qualified', stage: 'viewing-scheduled', score: 92, propertyType: 'villa', budget: { min: 10000000, max: 30000000 }, preferredLocations: ['Palm Jumeirah', 'Emirates Hills'], assignedAgent: { id: 'WC-011', name: 'Fatima Al Rashid' }, notes: 'Cash buyer, looking for quick closing', tags: ['HNWI', 'Cash Buyer'] },
  { name: 'Ivan Petrov', email: 'ivan.p@yandex.ru', phone: '+79161234567', source: 'referral', status: 'negotiating', stage: 'offer-made', score: 88, propertyType: 'penthouse', budget: { min: 20000000, max: 50000000 }, preferredLocations: ['Palm Jumeirah', 'Bluewaters Island'], assignedAgent: { id: 'WC-010', name: 'Ahmed Hassan' }, notes: 'Interested in penthouse with sea view', tags: ['VIP', 'Investor'] },
  { name: 'Wei Chen', email: 'wei.chen@qq.com', phone: '+8613512345678', source: 'social-media', status: 'qualified', stage: 'viewing-completed', score: 85, propertyType: 'apartment', budget: { min: 5000000, max: 15000000 }, preferredLocations: ['Downtown Dubai', 'DIFC'], assignedAgent: { id: 'WC-012', name: 'Michael Chen' } },
  
  // Warm Leads
  { name: 'Sarah Williams', email: 'sarah.w@gmail.com', phone: '+447911234567', source: 'property-finder', status: 'contacted', stage: 'viewing-scheduled', score: 72, propertyType: 'apartment', budget: { min: 2000000, max: 4000000 }, preferredLocations: ['Dubai Marina', 'JBR'], assignedAgent: { id: 'WC-013', name: 'Priya Sharma' } },
  { name: 'Rashid Al Maktoum', email: 'rashid.m@emirates.ae', phone: '+971505678901', source: 'walk-in', status: 'contacted', stage: 'inquiry', score: 68, propertyType: 'villa', budget: { min: 3000000, max: 8000000 }, preferredLocations: ['Arabian Ranches', 'Dubai Hills Estate'] },
  { name: 'Maria Garcia', email: 'maria.g@gmail.com', phone: '+34612345678', source: 'bayut', status: 'qualified', stage: 'viewing-scheduled', score: 75, propertyType: 'apartment', budget: { min: 1500000, max: 3000000 }, preferredLocations: ['Business Bay', 'City Walk'], assignedAgent: { id: 'WC-012', name: 'Michael Chen' } },
  { name: 'John Smith', email: 'john.s@outlook.com', phone: '+12125551234', source: 'website', status: 'contacted', stage: 'inquiry', score: 65, propertyType: 'any', budget: { min: 1000000, max: 2500000 }, preferredLocations: ['Dubai Marina'] },
  { name: 'Aisha Khalil', email: 'aisha.k@gmail.com', phone: '+971507890123', source: 'referral', status: 'qualified', stage: 'viewing-completed', score: 78, propertyType: 'townhouse', budget: { min: 2500000, max: 5000000 }, preferredLocations: ['Port de La Mer', 'Dubai Hills Estate'], assignedAgent: { id: 'WC-011', name: 'Fatima Al Rashid' } },
  
  // Cold Leads
  { name: 'Peter Johnson', email: 'peter.j@gmail.com', phone: '+447912345678', source: 'dubizzle', status: 'new', stage: 'inquiry', score: 45, propertyType: 'apartment', budget: { min: 800000, max: 1500000 }, preferredLocations: ['JLT', 'Sports City'] },
  { name: 'Elena Volkova', email: 'elena.v@mail.ru', phone: '+79165678901', source: 'social-media', status: 'new', stage: 'inquiry', score: 38, propertyType: 'studio', budget: { min: 400000, max: 800000 }, preferredLocations: ['Dubai Marina', 'Business Bay'] },
  { name: 'Mohammed Al Hassan', email: 'mohammed.h@gmail.com', phone: '+966559876543', source: 'website', status: 'contacted', stage: 'inquiry', score: 52, propertyType: 'villa', budget: { min: 5000000, max: 10000000 }, preferredLocations: ['MBR City'] },
  
  // Rental Leads
  { name: 'David Lee', email: 'david.l@google.com', phone: '+971508901234', source: 'website', status: 'qualified', stage: 'viewing-scheduled', score: 80, propertyType: 'apartment', budget: { min: 150000, max: 250000, isRental: true }, preferredLocations: ['DIFC', 'Downtown Dubai'], assignedAgent: { id: 'WC-021', name: 'Raj Patel' }, notes: 'Relocating for work, needs by end of month' },
  { name: 'Anna Johansson', email: 'anna.j@outlook.com', phone: '+46701234567', source: 'referral', status: 'qualified', stage: 'offer-made', score: 82, propertyType: 'villa', budget: { min: 200000, max: 350000, isRental: true }, preferredLocations: ['Arabian Ranches', 'The Springs'], assignedAgent: { id: 'WC-020', name: 'Nadia Hassan' } },
  { name: 'Tom Brown', email: 'tom.b@yahoo.com', phone: '+61412345678', source: 'walk-in', status: 'contacted', stage: 'inquiry', score: 58, propertyType: 'apartment', budget: { min: 80000, max: 120000, isRental: true }, preferredLocations: ['Dubai Marina', 'JBR'] },
  
  // Converted
  { name: 'Hamad Al Nahyan', email: 'hamad.n@adnoc.ae', phone: '+971502345678', source: 'referral', status: 'converted', stage: 'closed', score: 95, propertyType: 'villa', budget: { min: 15000000, max: 40000000 }, preferredLocations: ['Palm Jumeirah'], convertedAt: new Date('2024-01-10'), tags: ['VIP', 'Converted'] },
  { name: 'Robert Chen', email: 'robert.c@gmail.com', phone: '+8613612345678', source: 'website', status: 'converted', stage: 'closed', score: 88, propertyType: 'apartment', budget: { min: 3000000, max: 6000000 }, preferredLocations: ['Downtown Dubai'], convertedAt: new Date('2024-01-08') },
  
  // Lost
  { name: 'Michael Brown', email: 'michael.b@gmail.com', phone: '+12125559876', source: 'property-finder', status: 'lost', stage: 'negotiation', score: 70, propertyType: 'apartment', budget: { min: 2000000, max: 4000000 }, preferredLocations: ['Dubai Marina'], lostReason: 'Purchased from competitor' },
  { name: 'Olga Smirnova', email: 'olga.s@yandex.ru', phone: '+79168765432', source: 'social-media', status: 'lost', stage: 'viewing-completed', score: 62, propertyType: 'villa', budget: { min: 5000000, max: 10000000 }, preferredLocations: ['Palm Jumeirah'], lostReason: 'Budget constraints' },
  
  // New incoming
  { name: 'Fatima Al Qasimi', email: 'fatima.q@gmail.com', phone: '+971509012345', source: 'website', status: 'new', stage: 'inquiry', score: 55, propertyType: 'apartment', budget: { min: 1000000, max: 2000000 }, preferredLocations: ['Business Bay', 'Dubai Creek Harbour'] },
  { name: 'James Wilson', email: 'james.w@outlook.com', phone: '+447913456789', source: 'bayut', status: 'new', stage: 'inquiry', score: 48, propertyType: 'villa', budget: { min: 4000000, max: 8000000 }, preferredLocations: ['Dubai Hills Estate'] },
  { name: 'Yuki Yamamoto', email: 'yuki.y@gmail.com', phone: '+819012345678', source: 'referral', status: 'new', stage: 'inquiry', score: 60, propertyType: 'apartment', budget: { min: 2000000, max: 4000000 }, preferredLocations: ['Downtown Dubai', 'DIFC'] }
];

export const TENANCY_DEALS_DEMO = [
  {
    dealNumber: 'TD-2024-001',
    status: 'ejari_registered',
    property: { address: 'Apt 4502, Address Sky View, Downtown Dubai', area: 'Downtown Dubai', type: 'apartment', bedrooms: 2, bathrooms: 2, size: 1650, annualRent: 280000, securityDeposit: 14000 },
    landlord: { name: 'Sheikh Abdullah', email: 'abdullah@emirates.ae', phone: '+971505678901', type: 'individual' },
    tenant: { name: 'Sarah Johnson', email: 'sarah.j@gmail.com', phone: '+971507890123', employer: 'Google Dubai', monthlyIncome: 45000, kycStatus: 'verified' },
    broker: { name: 'Raj Patel', brnNumber: 'BRN-45678', assignedBy: 'Daisy AI' },
    offer: { monthlyRent: 23333, securityDeposit: 14000, agencyFee: 14000, paymentSchedule: '4_cheques', startDate: new Date('2024-01-15'), endDate: new Date('2025-01-14'), duration: 12 },
    ejari: { ejariNumber: 'EJ-2024-789456', registeredAt: new Date('2024-01-12') }
  },
  {
    dealNumber: 'TD-2024-002',
    status: 'pending_signatures',
    property: { address: 'Villa S8-45, Springs 8', area: 'The Springs', type: 'villa', bedrooms: 3, bathrooms: 3, size: 2400, annualRent: 145000, securityDeposit: 7250 },
    landlord: { name: 'Maria Fernandez', email: 'maria.f@gmail.com', phone: '+34612345678', type: 'individual' },
    tenant: { name: 'Thomas Mueller', email: 'thomas.m@gmail.com', phone: '+971509012345', employer: 'SAP Middle East', monthlyIncome: 55000, kycStatus: 'verified' },
    broker: { name: 'Nadia Hassan', brnNumber: 'BRN-45679', assignedBy: 'Daisy AI' },
    offer: { monthlyRent: 12083, securityDeposit: 7250, agencyFee: 7250, paymentSchedule: '2_cheques', startDate: new Date('2024-02-01'), endDate: new Date('2025-01-31'), duration: 12 }
  },
  {
    dealNumber: 'TD-2024-003',
    status: 'viewing_scheduled',
    property: { address: 'Apt 2804, Marina Gate, Dubai Marina', area: 'Dubai Marina', type: 'apartment', bedrooms: 2, bathrooms: 2, size: 1400, annualRent: 145000, securityDeposit: 7250 },
    landlord: { name: 'George Chen', email: 'george.c@gmail.com', phone: '+8613912345678', type: 'individual' },
    tenant: { name: 'Olga Ivanova', email: 'olga.i@gmail.com', phone: '+971501122334', employer: 'Jumeirah Hotels', monthlyIncome: 28000, kycStatus: 'pending' },
    broker: { name: 'Anna Petrova', brnNumber: 'BRN-45680', assignedBy: 'System' }
  },
  {
    dealNumber: 'TD-2024-004',
    status: 'offer_accepted',
    property: { address: 'Apt 2508, Sadaf, JBR', area: 'Jumeirah Beach Residence', type: 'apartment', bedrooms: 2, bathrooms: 2, size: 1550, annualRent: 165000, securityDeposit: 8250 },
    landlord: { name: 'Hamad Al Maktoum', email: 'hamad.m@gmail.com', phone: '+971506789012', type: 'individual' },
    tenant: { name: 'Lisa Anderson', email: 'lisa.a@gmail.com', phone: '+971503344556', employer: 'HSBC Dubai', monthlyIncome: 50000, kycStatus: 'verified' },
    broker: { name: 'Raj Patel', brnNumber: 'BRN-45678', assignedBy: 'Daisy AI' },
    offer: { monthlyRent: 13750, securityDeposit: 8250, agencyFee: 8250, paymentSchedule: '4_cheques', startDate: new Date('2024-02-15'), endDate: new Date('2025-02-14'), duration: 12 }
  },
  {
    dealNumber: 'TD-2024-005',
    status: 'inquiry',
    property: { address: 'Apt 4503, Index Tower, DIFC', area: 'DIFC', type: 'apartment', bedrooms: 2, bathrooms: 2, size: 1800, annualRent: 195000, securityDeposit: 9750 },
    landlord: { name: 'Sheikh Abdullah', email: 'abdullah@emirates.ae', phone: '+971505678901', type: 'individual' },
    tenant: { name: 'Mark Stevens', email: 'mark.s@gmail.com', phone: '+971505566778', employer: 'KPMG Dubai', monthlyIncome: 42000, kycStatus: 'pending' },
    broker: { name: 'Anna Petrova', brnNumber: 'BRN-45680', assignedBy: 'System' }
  }
];

export const SALES_DEALS_DEMO = [
  {
    dealNumber: 'SD-2024-001',
    dealType: 'secondary',
    status: 'completed',
    property: { address: 'Villa N12, Signature Villas, Palm Jumeirah', area: 'Palm Jumeirah', project: 'Signature Villas', type: 'villa', bedrooms: 6, bathrooms: 7, size: 12500, askingPrice: 45000000, isOffPlan: false },
    seller: { name: 'Khalid Bin Rashid', email: 'khalid.br@gmail.com', phone: '+971504567890', type: 'individual' },
    buyer: { name: 'Mohammed Al Nahyan', email: 'mohammed.n@gmail.com', phone: '+971501234567', nationality: 'UAE', kycStatus: 'verified' },
    broker: { name: 'Fatima Al Rashid', brnNumber: 'BRN-12345', specialization: 'both', assignedBy: 'Emma AI' },
    offer: { offerPrice: 43000000, agreedPrice: 44000000, depositAmount: 4400000 },
    dld: { dldTransactionNumber: 'DLD-2024-123456', transferDate: new Date('2024-01-10'), titleDeedNumber: 'TD-PJ-2024-001', registrationFee: 176000, transferFee: 1760000, completedAt: new Date('2024-01-10') }
  },
  {
    dealNumber: 'SD-2024-002',
    dealType: 'off_plan',
    status: 'spa_signed',
    property: { address: 'Unit 3501, FIVE Palm, Palm Jumeirah', area: 'Palm Jumeirah', project: 'FIVE Palm', developer: 'FIVE Holdings', type: 'apartment', bedrooms: 3, bathrooms: 3, size: 3500, askingPrice: 8500000, isOffPlan: true },
    seller: { name: 'FIVE Holdings', email: 'sales@five.ae', phone: '+97145678901', type: 'developer' },
    buyer: { name: 'Liu Wei', email: 'liu.wei@qq.com', phone: '+8613812345678', nationality: 'China', kycStatus: 'verified' },
    broker: { name: 'Ahmed Hassan', brnNumber: 'BRN-12346', specialization: 'off_plan', assignedBy: 'Emma AI' },
    offer: { offerPrice: 8500000, agreedPrice: 8500000, depositAmount: 850000, paymentPlan: '60/40' },
    spa: { spaNumber: 'SPA-2024-002', generatedAt: new Date('2024-01-05'), sellerSignedAt: new Date('2024-01-06'), buyerSignedAt: new Date('2024-01-07') }
  },
  {
    dealNumber: 'SD-2024-003',
    dealType: 'secondary',
    status: 'noc_applied',
    property: { address: 'Apt 5502, Cayan Tower, Dubai Marina', area: 'Dubai Marina', project: 'Cayan Tower', type: 'apartment', bedrooms: 3, bathrooms: 3, size: 2100, askingPrice: 4500000, isOffPlan: false },
    seller: { name: 'Robert Wilson', email: 'robert.w@gmail.com', phone: '+447912345678', type: 'individual' },
    buyer: { name: 'Anna Kuznetsova', email: 'anna.k@yandex.ru', phone: '+79161234567', nationality: 'Russia', kycStatus: 'verified' },
    broker: { name: 'Priya Sharma', brnNumber: 'BRN-12347', specialization: 'secondary', assignedBy: 'System' },
    offer: { offerPrice: 4200000, counterPrice: 4400000, agreedPrice: 4350000, depositAmount: 435000 },
    noc: { nocNumber: 'NOC-2024-003', appliedAt: new Date('2024-01-12'), developerName: 'Cayan Group' }
  },
  {
    dealNumber: 'SD-2024-004',
    dealType: 'secondary',
    status: 'viewing_scheduled',
    property: { address: 'Villa E15, Sector E, Emirates Hills', area: 'Emirates Hills', project: 'Sector E', type: 'villa', bedrooms: 7, bathrooms: 8, size: 15000, askingPrice: 85000000, isOffPlan: false },
    seller: { name: 'Faisal Al Thani', email: 'faisal.t@gmail.com', phone: '+97455123456', type: 'individual' },
    buyer: { name: 'Ahmed Al Sayed', email: 'ahmed.s@gmail.com', phone: '+966501234567', nationality: 'Saudi Arabia', kycStatus: 'pending' },
    broker: { name: 'Ahmed Hassan', brnNumber: 'BRN-12346', specialization: 'both', assignedBy: 'Emma AI' },
    leadSource: { source: 'referral', leadScore: 90, qualification: 'hot' }
  },
  {
    dealNumber: 'SD-2024-005',
    dealType: 'off_plan',
    status: 'offer_submitted',
    property: { address: 'Villa D1-25, District One, MBR City', area: 'Mohammed Bin Rashid City', project: 'District One', developer: 'Meydan Sobha', type: 'villa', bedrooms: 6, bathrooms: 7, size: 9500, askingPrice: 28000000, isOffPlan: true },
    seller: { name: 'Meydan Sobha', email: 'sales@meydansobha.com', phone: '+97145678902', type: 'developer' },
    buyer: { name: 'James Richardson', email: 'james.r@gmail.com', phone: '+447911234567', nationality: 'UK', kycStatus: 'verified' },
    broker: { name: 'Michael Chen', brnNumber: 'BRN-12348', specialization: 'off_plan', assignedBy: 'System' },
    offer: { offerPrice: 27000000, validUntil: new Date('2024-01-20'), submittedAt: new Date('2024-01-13') },
    leadSource: { source: 'website', leadScore: 78, qualification: 'warm' }
  },
  {
    dealNumber: 'SD-2024-006',
    dealType: 'secondary',
    status: 'qualified',
    property: { address: 'Apt 12001, Burj Khalifa, Downtown Dubai', area: 'Downtown Dubai', project: 'Burj Khalifa', type: 'apartment', bedrooms: 3, bathrooms: 4, size: 2800, askingPrice: 15000000, isOffPlan: false },
    seller: { name: 'Khalid Bin Rashid', email: 'khalid.br@gmail.com', phone: '+971504567890', type: 'individual' },
    buyer: { name: 'David Miller', email: 'david.m@gmail.com', phone: '+12125551234', nationality: 'USA', kycStatus: 'pending' },
    broker: { name: 'Fatima Al Rashid', brnNumber: 'BRN-12345', specialization: 'both', assignedBy: 'Emma AI' },
    leadSource: { source: 'walk_in', leadScore: 72, qualification: 'warm' }
  }
];

export const SERVICES_CATALOG = [
  // Property Services
  { code: 'SVC-001', name: 'Property Valuation', category: 'property', description: 'Professional property valuation by certified valuers', price: 2500, duration: '2-3 days', status: 'active' },
  { code: 'SVC-002', name: 'Home Staging', category: 'property', description: 'Professional staging to maximize property appeal', price: 15000, duration: '1 week', status: 'active' },
  { code: 'SVC-003', name: 'Professional Photography', category: 'property', description: 'High-quality photography and virtual tours', price: 3500, duration: '1 day', status: 'active' },
  { code: 'SVC-004', name: 'Snagging Inspection', category: 'property', description: 'Detailed inspection for new properties', price: 1800, duration: '1 day', status: 'active' },
  
  // Legal Services
  { code: 'SVC-010', name: 'Contract Review', category: 'legal', description: 'Legal review of sale/purchase agreements', price: 5000, duration: '2-3 days', status: 'active' },
  { code: 'SVC-011', name: 'Title Deed Transfer', category: 'legal', description: 'Complete DLD transfer assistance', price: 8000, duration: '1-2 weeks', status: 'active' },
  { code: 'SVC-012', name: 'Ejari Registration', category: 'legal', description: 'Tenancy contract registration with Ejari', price: 500, duration: '1-2 days', status: 'active' },
  { code: 'SVC-013', name: 'POA Preparation', category: 'legal', description: 'Power of Attorney document preparation', price: 3000, duration: '3-5 days', status: 'active' },
  
  // Financial Services
  { code: 'SVC-020', name: 'Mortgage Consultation', category: 'financial', description: 'Expert mortgage advice and bank liaison', price: 0, duration: 'Ongoing', status: 'active', note: 'Commission-based' },
  { code: 'SVC-021', name: 'Investment Analysis', category: 'financial', description: 'ROI analysis and investment recommendations', price: 5000, duration: '1 week', status: 'active' },
  { code: 'SVC-022', name: 'Tax Advisory', category: 'financial', description: 'Property tax consultation for international buyers', price: 3500, duration: '1-2 days', status: 'active' },
  
  // Relocation Services
  { code: 'SVC-030', name: 'Visa Assistance', category: 'relocation', description: 'Golden Visa and investor visa support', price: 15000, duration: '2-4 weeks', status: 'active' },
  { code: 'SVC-031', name: 'Moving Services', category: 'relocation', description: 'Professional moving and storage', price: 5000, duration: '1-3 days', status: 'active' },
  { code: 'SVC-032', name: 'Concierge Services', category: 'relocation', description: 'DEWA, internet, and utilities setup', price: 1500, duration: '1-2 days', status: 'active' },
  
  // Property Management
  { code: 'SVC-040', name: 'Full Property Management', category: 'management', description: 'Complete property management package', price: 5, duration: 'Monthly', status: 'active', note: '5% of annual rent' },
  { code: 'SVC-041', name: 'Tenant Finding', category: 'management', description: 'Find and screen quality tenants', price: 5000, duration: '2-4 weeks', status: 'active' },
  { code: 'SVC-042', name: 'Maintenance Package', category: 'management', description: 'Regular maintenance and repairs', price: 2500, duration: 'Monthly', status: 'active' }
];

export default {
  DUBAI_COMMUNITIES,
  DEVELOPERS,
  EMPLOYEES_DEMO,
  USERS_DEMO,
  PROPERTIES_DEMO,
  LEADS_DEMO,
  TENANCY_DEALS_DEMO,
  SALES_DEALS_DEMO,
  SERVICES_CATALOG
};
