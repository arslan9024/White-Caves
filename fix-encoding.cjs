const fs = require('fs');
let c = fs.readFileSync('scripts/orchestrator/autopilot-unlimited.ps1', 'utf8');
c = c.replace(/[^\x00-\x7F]/g, '-');
fs.writeFileSync('scripts/orchestrator/autopilot-unlimited.ps1', c, 'utf8');
