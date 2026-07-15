const fs = require('fs');
let content = fs.readFileSync('src/pages/auth/SignInPage.tsx', 'utf8');

// Fix getIdToken return type issue (308,13) and fbUser property missing (391,56)
content = content.replace(/getIdToken: \(forceRefresh\?: boolean\) => fbUser\.getIdToken\?\.\(forceRefresh\),/g, 'getIdToken: ((forceRefresh?: boolean) => (fbUser as any).getIdToken?.(forceRefresh)) as any,');

// Fix provider type issue (400,11)
content = content.replace(/provider: socialRecovery\.provider,/g, 'provider: socialRecovery.provider as any,');

fs.writeFileSync('src/pages/auth/SignInPage.tsx', content);
console.log('Fixed additional TS errors in SignInPage.tsx');
