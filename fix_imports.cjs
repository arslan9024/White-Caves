const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.js') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let modified = false;
      
      // Look for relative imports missing extension
      content = content.replace(/from\s+['"](\.[^'"]+)['"]/g, (match, p1) => {
        if (!p1.endsWith('.js') && !p1.endsWith('.ts') && !p1.endsWith('.json')) {
          modified = true;
          return `from '${p1}.js'`;
        }
        return match;
      });

      if (modified) {
        fs.writeFileSync(fullPath, content);
        console.log('Fixed imports in', fullPath);
      }
    }
  }
}

processDir('server');
