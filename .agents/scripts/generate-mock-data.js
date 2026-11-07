import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MOCK_DIR = path.join(__dirname, '../src/data/mock');

if (!fs.existsSync(MOCK_DIR)) {
  fs.mkdirSync(MOCK_DIR, { recursive: true });
}

// 1. Generate 100 High-Fidelity Properties
const generateProperties = () => {
  const properties = [];
  const communities = ['DAMAC Hills 2', 'Palm Jumeirah', 'Downtown Dubai', 'Dubai Marina', 'Emirates Hills'];
  const types = ['Villa', 'Penthouse', 'Apartment', 'Townhouse'];

  for (let i = 1; i <= 100; i++) {
    properties.push({
      id: `PROP-${1000 + i}`,
      title: `Luxury ${types[i % types.length]} in ${communities[i % communities.length]}`,
      priceAED: 2000000 + (Math.random() * 10000000),
      bedrooms: Math.floor(Math.random() * 5) + 1,
      bathrooms: Math.floor(Math.random() * 6) + 1,
      areaSqFt: 1200 + (Math.random() * 8000),
      community: communities[i % communities.length],
      status: i % 5 === 0 ? 'Sold' : 'Active',
      featured: i % 10 === 0
    });
  }
  
  fs.writeFileSync(path.join(MOCK_DIR, 'properties_portfolio.json'), JSON.stringify(properties, null, 2));
  console.log('[SEED] properties_portfolio.json generated (100 items)');
};

// 2. Generate 12 Managers and 108 Supervisors
const generatePersonnel = () => {
  const personnel = [];
  
  // 12 Managers
  for (let i = 1; i <= 12; i++) {
    personnel.push({
      id: `MGR-${i}`,
      role: 'Manager',
      department: `Dept-${String(i).padStart(2, '0')}`,
      name: `Manager Dummy ${i}`,
      level: 4
    });
  }

  // 108 Supervisors (9 per department)
  let supId = 1;
  for (let i = 1; i <= 12; i++) {
    for (let j = 1; j <= 9; j++) {
      personnel.push({
        id: `SUP-${supId}`,
        role: 'Supervisor',
        department: `Dept-${String(i).padStart(2, '0')}`,
        name: `Supervisor Dummy ${supId}`,
        reportsTo: `MGR-${i}`,
        level: 3
      });
      supId++;
    }
  }

  fs.writeFileSync(path.join(MOCK_DIR, 'personnel_directory.json'), JSON.stringify(personnel, null, 2));
  console.log(`[SEED] personnel_directory.json generated (12 Managers, 108 Supervisors)`);
};

// 3. Generate Currency Cache TTL
const generateCurrencyCache = () => {
  const cache = {
    timestamp: Date.now(),
    expiresAt: Date.now() + (4 * 60 * 60 * 1000), // 4 hours TTL
    rates: {
      AED: 1.0,
      USD: 0.2723,
      EUR: 0.2514,
      GBP: 0.2145,
      ARS: 270.5 // ARG Scaling Framework
    }
  };
  fs.writeFileSync(path.join(MOCK_DIR, 'currency_cache.json'), JSON.stringify(cache, null, 2));
  console.log(`[SEED] currency_cache.json generated (4-hour TTL)`);
};

generateProperties();
generatePersonnel();
generateCurrencyCache();
