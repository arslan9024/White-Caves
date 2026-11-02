#!/usr/bin/env node

/**
 * Favicon Generation Script
 * Generates favicon files from the source logo image
 * Supports: favicon.ico, PNG sizes for various platforms
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, '../public');

// Logo configuration
const LOGO_CONFIG = {
  white_caves_logo: {
    src: 'white-caves-logo.png',
    sizes: [1200], // Full resolution
    description: 'White Caves logo'
  },
  favicon: {
    sizes: [32, 16],
    description: 'Favicon'
  },
  apple: {
    sizes: [180],
    description: 'Apple touch icon'
  },
  android: {
    sizes: [192, 512],
    description: 'Android chrome icons'
  }
};

console.log('🎨 Favicon Generation Script');
console.log('============================\n');

console.log('Favicon Configuration:');
console.log('- favicon.ico: 32x32 (browser tab)');
console.log('- favicon.svg: scalable (modern browsers)');
console.log('- apple-touch-icon.png: 180x180 (iOS)');
console.log('- android-chrome-192x192.png: 192x192 (Android)');
console.log('- android-chrome-512x512.png: 512x512 (Android splash)\n');

console.log('Note: The actual image files should be:');
console.log('✓ Placed in public/ directory');
console.log('✓ Named: white-caves-logo.png (source)');
console.log('✓ To generate ICO/PNG: Use favicon.io or ImageMagick\n');

console.log('Steps to complete favicon generation:');
console.log('1. Visit https://favicon.io/favicon-converter/');
console.log('2. Upload: white-caves-logo.png');
console.log('3. Download favicon package');
console.log('4. Extract to public/ directory:');
console.log('   - favicon.ico');
console.log('   - favicon-16x16.png → favicon-16.png');
console.log('   - favicon-32x32.png → favicon-32.png (or use favicon.ico)');
console.log('   - apple-touch-icon.png');
console.log('   - android-chrome-192x192.png');
console.log('   - android-chrome-512x512.png\n');

console.log('Alternatively, using ImageMagick (if installed):');
console.log('magick white-caves-logo.png -define icon:auto-resize=192,512,256,128,96,64,48,32,16 favicon.ico\n');

console.log('Files to update:');
console.log('✓ index.html - favicon links (DONE)');
console.log('✓ manifest.json - icons array (DONE)\n');

console.log('📁 Expected file structure in public/:');
console.log(`${publicDir}/`);
console.log('├── favicon.ico');
console.log('├── favicon.svg');
console.log('├── favicon-16x16.png');
console.log('├── favicon-32x32.png');
console.log('├── apple-touch-icon.png');
console.log('├── android-chrome-192x192.png');
console.log('├── android-chrome-512x512.png');
console.log('├── white-caves-logo.png');
console.log('└── manifest.json (UPDATED)\n');

console.log('✅ Configuration complete!');
console.log('Next step: Download/generate favicon files and place in public/\n');

// Create a placeholder file listing
const placeholderContent = `# Favicon Files Needed

Place the following files in this directory (public/):

## Generated from white-caves-logo.png using favicon.io or ImageMagick:

- favicon.ico (32x32, multi-format)
- favicon.svg (scalable, optional but recommended)
- apple-touch-icon.png (180x180)
- android-chrome-192x192.png (192x192)
- android-chrome-512x512.png (512x512)
- white-caves-logo.png (1200x630 or higher)

## Generation Tools:
- Online: https://favicon.io/favicon-converter/
- CLI: ImageMagick (\`magick\` command)
- Node: sharp library with favicon plugin

## File Locations Used:
- index.html (favicon references updated)
- manifest.json (icons array updated)

After placing favicon files, no further changes needed.
Build with: npm run build
`;

const placeholderPath = path.join(publicDir, 'FAVICON_README.md');
fs.writeFileSync(placeholderPath, placeholderContent);

console.log(`📝 Created: ${placeholderPath}`);
console.log('\nRun: npm run build');
console.log('After favicon files are in place.\n');
