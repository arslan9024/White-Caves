import { execSync } from 'child_process';

console.log('🧹 Running Dead Code Sweep using Knip...');

try {
  execSync('npx cross-env NODE_OPTIONS=--max-old-space-size=8192 knip', { stdio: 'inherit' });
  console.log('✅ Dead code sweep passed! No unreferenced exports or orphaned assets found.');
} catch (error) {
  console.error('❌ Dead code sweep failed! Please remove unused exports and dependencies.');
  process.exit(1);
}
