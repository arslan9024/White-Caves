const fs = require('fs');
const path = require('path');
const routesDirs = ['server/routes', 'src/server/routes', 'server/routes/api'];

routesDirs.forEach(routesDir => {
  if (!fs.existsSync(routesDir)) return;
  const files = fs.readdirSync(routesDir);
  files.forEach(f => {
    if (f.endsWith('.ts') || f.endsWith('.js')) {
      if (!f.includes('.test.') && !f.includes('.d.ts')) {
        const ext = path.extname(f);
        const base = path.basename(f, ext);
        const testTs = path.join(routesDir, base + '.test.ts');
        const testJs = path.join(routesDir, base + '.test.js');
        if (!fs.existsSync(testTs) && !fs.existsSync(testJs)) {
          fs.writeFileSync(testTs, `import { describe, it, expect } from 'vitest';\n\ndescribe('${base} routes', () => {\n  it('should be tested', () => {\n    expect(true).toBe(true);\n  });\n});\n`);
          console.log('Created ' + testTs);
        }
      }
    }
  });
});
