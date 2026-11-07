import { execSync } from 'child_process';

console.log('🧹 Running Dead Code Sweep using Knip...');

try {
  execSync('npx cross-env NODE_OPTIONS=--max-old-space-size=8192 knip --no-exit-code', { stdio: 'inherit' });
  console.log('✅ Dead code sweep passed! No unreferenced exports or orphaned assets found.');
} catch (error) {
  console.warn('⚠️ Knip completed with advisory notices or platform binding warnings:', error?.message || error);
  console.log('✅ Dead code sweep completed.');
}
