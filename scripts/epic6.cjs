const fs = require('fs');
const path = require('path');

const mocksDir = path.join(__dirname, '../src/mocks');
if (!fs.existsSync(mocksDir)) {
  fs.mkdirSync(mocksDir, { recursive: true });
}

const ledger = [];
ledger.push({
  id: "EMP-001",
  name: "Arslan Malik Bashir Ahmad",
  role: "Managing Director",
  email: "arslanmalikgoraha@gmail.com",
  level: 5
});
for(let i=1; i<=12; i++) {
  ledger.push({ id: `MGR-${i}`, name: `Manager ${i}`, role: "Department Manager", level: 4 });
}
for(let i=1; i<=108; i++) {
  ledger.push({ id: `SUP-${i}`, name: `Supervisor ${i}`, role: "Supervisor", level: 3 });
}
fs.writeFileSync(path.join(mocksDir, 'companyMasterLedger.json'), JSON.stringify(ledger, null, 2));

let propertiesStr = `export const globalPropertyMocks = [\n`;
for(let i=1; i<=100; i++) {
  propertiesStr += `  { id: "PROP-${i}", title: "Luxury Villa ${i}", location: "DAMAC Hills 2", price: ${2000000 + (i * 10000)}, beds: 4, baths: 5, sqft: 3500 },\n`;
}
propertiesStr += `];\n`;
fs.writeFileSync(path.join(mocksDir, 'globalPropertyMocks.ts'), propertiesStr);

const financeEngine = `export const currencyCache = {
  timestamp: Date.now(),
  ttl: 4 * 60 * 60 * 1000,
  rates: {
    "AED": 1,
    "USD": 0.272,
    "ARS": 270.5
  }
};
`;
fs.writeFileSync(path.join(mocksDir, 'dubaiFinanceEngine.ts'), financeEngine);

console.log('Seeding complete.');
