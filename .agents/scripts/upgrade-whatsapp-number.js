#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(__dirname, '..');

const oldNumber = '971563616136';
const newNumber = '971505110636';

const filesToUpdate = [
  'src/shared/components/property/PropertyDetailModal.jsx',
  'src/pages/ContactPage.jsx',
  'src/components/WhatsAppButton.jsx',
  'src/components/Footer.jsx',
  'src/components/ContactForm.jsx',
  'src/components/homepage/Contact/ContactCTA.jsx',
  'src/components/ClickToChat.jsx',
  '.env.example',
  'plans/DEPLOYMENT.md'
];

let totalReplacements = 0;
let filesUpdated = 0;
const errors = [];

console.log('\n' + '='.repeat(60));
console.log('🚀 PRIORITY 1: WhatsApp Number Upgrade');
console.log('='.repeat(60));
console.log(`Old Number: +${oldNumber}`);
console.log(`New Number: +${newNumber}`);
console.log('='.repeat(60) + '\n');

filesToUpdate.forEach(filePath => {
  const fullPath = path.join(projectRoot, filePath);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`⚠️  Skipped: ${filePath} (not found)`);
    return;
  }

  try {
    let content = fs.readFileSync(fullPath, 'utf-8');
    const originalContent = content;
    const regex = new RegExp(oldNumber, 'g');
    content = content.replace(regex, newNumber);
    const replacementCount = (originalContent.match(regex) || []).length;
    
    if (replacementCount > 0) {
      fs.writeFileSync(fullPath, content, 'utf-8');
      filesUpdated++;
      totalReplacements += replacementCount;
      console.log(`✅ ${filePath} (${replacementCount} replacements)`);
    }
  } catch (error) {
    errors.push({ file: filePath, error: error.message });
    console.log(`❌ ${filePath}: ${error.message}`);
  }
});

console.log('\n' + '='.repeat(60));
console.log(`Files Updated: ${filesUpdated}/${filesToUpdate.length}`);
console.log(`Total Replacements: ${totalReplacements}`);
console.log('='.repeat(60) + '\n');
process.exit(totalReplacements > 0 ? 0 : 1);
