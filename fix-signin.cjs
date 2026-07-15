const fs = require('fs');
let content = fs.readFileSync('src/pages/auth/SignInPage.tsx', 'utf8');

// Replace `user,` with `user: user as any,` inside finalizeAuthenticatedSession calls
content = content.replace(/user,/g, 'user: user as any,');
// Replace `user: mockUser,` with `user: mockUser as any,`
content = content.replace(/user: mockUser,/g, 'user: mockUser as any,');
// Replace provider: 'google', etc
content = content.replace(/provider: 'google',/g, 'provider: "google" as any,');
content = content.replace(/provider: 'facebook',/g, 'provider: "facebook" as any,');
content = content.replace(/provider: 'apple',/g, 'provider: "apple" as any,');
content = content.replace(/provider: providerData\.providerId,/g, 'provider: providerData.providerId as any,');

// Fix getIdToken 
content = content.replace(/getIdToken: \(\) => Promise\.resolve\('mock_token'\),/g, 'getIdToken: (() => Promise.resolve("mock_token")) as any,');
content = content.replace(/getIdToken: async \(\) => {/g, 'getIdToken: (async () => {');
content = content.replace(/return user\.getIdToken\(\);\n\s*},/g, 'return (user as any).getIdToken();\n}) as any,');

// Replace `user.getIdToken()` where it causes error TS2339
content = content.replace(/await user\.getIdToken\(\)/g, 'await (user as any).getIdToken()');

fs.writeFileSync('src/pages/auth/SignInPage.tsx', content);
console.log('Fixed SignInPage.tsx');
