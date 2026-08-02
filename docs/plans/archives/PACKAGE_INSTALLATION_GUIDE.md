# 📦 Package.json Installation Guide

## Required Packages to Install

Run the following commands to install all required dependencies for the new dashboard and sidebar architecture:

```bash
# Main dependencies
npm install styled-components

# Dev dependencies
npm install --save-dev @types/styled-components

# Verify installation
npm list styled-components
```

## Proposed package.json Dependencies Section

Add these to your `dependencies`:

```json
{
  "dependencies": {
    "styled-components": "^6.1.0"
  },
  "devDependencies": {
    "@types/styled-components": "^5.1.26"
  }
}
```

## Installation Steps

### Step 1: Install styled-components

```bash
npm install styled-components
```

### Step 2: Install TypeScript types

```bash
npm install --save-dev @types/styled-components
```

### Step 3: Verify Installation

Check that files are present:

```bash
# Should show styled-components in node_modules
ls node_modules | grep styled

# Verify package.json was updated
npm list styled-components
```

### Step 4: Create .babelrc (if needed)

For better styled-components integration with Babel:

```json
{
  "presets": ["@babel/preset-react"],
  "plugins": [
    [
      "babel-plugin-styled-components",
      {
        "displayName": true,
        "fileName": true
      }
    ]
  ]
}
```

If using Vite (which you are based on vite.config.js), you don't need extra Babel config.

## Vite Configuration

No special Vite configuration needed! Styled-components works out of the box with Vite.

### Optional: Vite Plugin for styled-components

For better HMR support with styled-components, you can optionally add:

```bash
npm install --save-dev vite-plugin-babel
```

Then update `vite.config.js`:

```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // styled-components works with react plugin automatically
});
```

## Verify Setup Works

Create a test file `src/components/test/TestStyledComponent.tsx`:

```typescript
import styled from 'styled-components';

const TestDiv = styled.div`
  color: ${props => props.theme.colors.text.primary};
  padding: 20px;
`;

export const TestComponent = () => (
  <TestDiv>If you see this with proper styling, setup is working!</TestDiv>
);

export default TestComponent;
```

Then import and use it to verify everything works.

## Troubleshooting Installation

### Issue: Cannot find module 'styled-components'

**Solution:**

```bash
# Clear npm cache
npm cache clean --force

# Reinstall
rm -rf node_modules package-lock.json
npm install
npm install styled-components
```

### Issue: TypeScript errors with styled-components

**Solution:**

```bash
# Install types
npm install --save-dev @types/styled-components

# Reload TypeScript
# In VS Code: Cmd+Shift+P → "TypeScript: Reload Projects"
```

### Issue: Styled-components not applying styles

**Solution:**

- Ensure ThemeProvider wraps your entire app
- Check that theme object is imported correctly
- Verify `createGlobalStyle` is called

### Issue: HMR not working with styled-components

**Solution:**

- This is normal - styled-components has slower HMR than inline CSS
- Refresh the page if styles don't update
- Consider using Vite's built-in CSS modules for rapid iteration

## Next Steps After Installation

1. **Add Theme Provider to App Root:**

```typescript
// src/App.tsx
import { ThemeProvider } from 'styled-components';
import { theme } from './styles/theme';
import GlobalStyle from './styles/globalStyles';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <YourAppComponents />
    </ThemeProvider>
  );
}
```

2. **Update Redux Store:**

```typescript
// src/store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import sidebarUIReducer from './slices/sidebarUISlice';

export const store = configureStore({
  reducer: {
    // ... other reducers
    sidebarUI: sidebarUIReducer,
  },
});
```

3. **Start Using Components:**

```typescript
import { BaseSidebar, SidebarSection, SidebarItem } from '@/components/shared/sidebars';
import { useSidebarState } from '@/hooks/useSidebarState';

// Use in your components!
```

## Dependency Tree

Here's what the styled-components dependency tree looks like:

```
styled-components@6.1.0
├── js-tokens@4.0.0
├── loose-envify@1.4.0
└── @emotion/stylis@0.8.5
```

These are automatically installed - no need to manually install sub-dependencies.

## Size Impact

| Package                  | Size       | Gzipped    |
| ------------------------ | ---------- | ---------- |
| styled-components        | ~16 KB     | ~5 KB      |
| @types/styled-components | ~30 KB     | ~5 KB      |
| **Total**                | **~46 KB** | **~10 KB** |

Minimal impact on bundle size!

## Compatibility

- **Node.js**: 14+ (recommended 16+)
- **React**: 16.8+ (hooks required)
- **TypeScript**: 4.0+ (for type definitions)
- **Browsers**: All modern browsers (ES6+)

## Update Existing Code

You don't need to update existing code immediately. The new components work alongside your current setup.

Gradually refactor:

1. First refactor LeftSidebar and RightSidebar
2. Then update DashboardWorkspace
3. Then create feature components
4. Finally, register all features

## Version Management

Check for updates:

```bash
# Check outdated packages
npm outdated

# Update styled-components if needed
npm update styled-components

# Or update to latest major version
npm install styled-components@latest
```

## Docker/Production Deployment

If using Docker, the build process handles styled-components automatically.

Add to `.dockerignore` (if you have one):

```
node_modules
npm-debug.log
```

## CI/CD Considerations

No special configuration needed for:

- GitHub Actions
- GitLab CI
- Jenkins
- Vercel (already configured)
- Netlify (already configured)

Styled-components compiles to regular CSS at build time.

## Summary

- **Install command**: `npm install styled-components`
- **Types command**: `npm install --save-dev @types/styled-components`
- **Total size**: ~10 KB gzipped
- **Setup time**: < 5 minutes
- **Breaking changes**: None - fully backwards compatible

You're now ready to use the new dashboard and sidebar architecture! 🎉
