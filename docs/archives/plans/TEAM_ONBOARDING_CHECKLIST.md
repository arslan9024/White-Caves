# 👋 TEAM ONBOARDING CHECKLIST
## Getting New Developers Up to Speed with TypeScript Codebase

**Created:** March 12, 2026  
**Purpose:** Onboarding checklist for developers joining the White Caves team  
**Estimated Time:** 3-4 hours to complete

---

## 📋 PRE-ONBOARDING (Before Your First Day)

### Knowledge Base
- [ ] Read: `README.md` - Project overview
- [ ] Read: `TYPESCRIPT_DEVELOPER_QUICK_START.md` - TypeScript patterns
- [ ] Skim: `TYPESCRIPT_MIGRATION_COMPLETE_EXECUTIVE_REPORT.md` - What changed
- [ ] Review: This checklist

### Environment Prep
- [ ] Install Node.js (v18.x or v20.x)
- [ ] Install npm (v9.x or higher)
- [ ] Install VS Code (if not already)
- [ ] Install vs code extensions:
  - [ ] ES7+ React/Redux/React-Native snippets
  - [ ] Prettier - Code formatter
  - [ ] ESLint
  - [ ] TypeScript Vue Plugin (optional, for Vue files)
  - [ ] Thunder Client or Postman (for API testing)

### Slack/Communication
- [ ] Join #dev-team channel
- [ ] Join #white-caves-codebase channel
- [ ] Join #questions channel
- [ ] Save this in favorites: /dev-onboarding

---

## 🎯 FIRST DAY (Day 1 - Environment Setup)

### Welcome & Introductions (30 min)
- [ ] Meet your team lead
- [ ] Get Slack invites to all channels
- [ ] Receive access credentials (GitHub, Slack, Jira, etc.)
- [ ] Calendar invites for team meetings

### Local Development Setup (1-2 hours)
**Step 1: Clone Repository**
```bash
# Navigate to your development folder
cd ~/development

# Clone the repository
git clone https://github.com/YOUR-ORG/white-caves.git
cd white-caves

# Switch to latest branch
git checkout main
git pull origin main
```

**Step 2: Install Dependencies**
```bash
# Install all npm packages
npm install

# This takes 2-3 minutes
```

**Step 3: Verify Setup**
```bash
# Start development server
npm run dev

# Should see: "VITE v4.x ready in xxx ms"
# Visit http://localhost:5000 in browser
# Should see the White Caves CRM dashboard
```

**Step 4: Run Tests**
```bash
# Run unit tests
npm run test -- --run

# Should see: "181 passed in xxx ms"
```

**Step 5: Build Verification**
```bash
# Build for production
npm run build

# Should see: "dist/ total X files in Y bytes"
```

**Checklist:**
- [ ] Repository cloned locally
- [ ] `npm install` completed (no errors)
- [ ] Dev server running without errors
- [ ] Browser shows dashboard at localhost:5000
- [ ] All tests pass (`npm run test -- --run`)
- [ ] Build completes without errors (`npm run build`)

### IDE Configuration (15 min)
**VS Code Settings:**
1. Install recommended extensions listed above
2. Create `.vscode/launch.json` for debugging:
   ```json
   {
     "version": "0.2.0",
     "configurations": [
       {
         "type": "chrome",
         "request": "launch",
         "name": "Launch Chrome",
         "url": "http://localhost:5000",
         "webRoot": "${workspaceFolder}/src",
         "sourceMaps": true
       }
     ]
   }
   ```
3. Enable auto-save (File > Preferences > Autosave)
4. Enable Prettier formatting on save

**Checklist:**
- [ ] Extensions installed
- [ ] Launch.json created for debugging
- [ ] Auto-save enabled
- [ ] Prettier runs on save
- [ ] TypeScript intellisense working (hover over code)

---

## 📚 SECOND DAY (Day 2 - Codebase Tour)

### Project Structure Tour (1 hour)

**Walk Through Key Folders:**

```bash
# In terminal, explore structure
cd src/

# View pages (user-facing routes)
ls pages/

# View components (reusable pieces)
ls components/

# View store (Redux state management)
ls store/

# View utilities
ls utils/
```

**Study These Critical Files:**
- [ ] `src/pages/App.tsx` - Main app component & routing
- [ ] `src/store/store.tsx` - Redux store configuration
- [ ] `src/components/layout/AppLayout.tsx` - Main layout wrapper
- [ ] `tsconfig.json` - TypeScript configuration

**Key Takeaways:**
- Pages are user-facing (located in `src/pages/`)
- Components are reusable (located in `src/components/`)
- State management uses Redux (located in `src/store/`)
- All files are `.tsx` (React with TypeScript) or `.ts` (pure TypeScript)

### Understanding Component Structure (1 hour)

**Study a Component Example:**

Open `src/components/common/DataCard.tsx`:
```typescript
// 1. React import
import React, { FC } from 'react';

// 2. Props interface (defines what the component accepts)
interface DataCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
}

// 3. Styled component (optional, for styling)
import styled from 'styled-components';
const StyledCard = styled.div`
  // styles here
`;

// 4. Component definition with FC<Props>
const DataCard: FC<DataCardProps> = ({ title, value, icon }) => {
  return (
    <StyledCard>
      {icon && <div>{icon}</div>}
      <h3>{title}</h3>
      <p>{value}</p>
    </StyledCard>
  );
};

// 5. Export component
export default DataCard;
```

**Key Patterns to Learn:**
- [ ] Props interface always comes before component
- [ ] Use `FC<Props>` for function components
- [ ] Styled components with TypeScript
- [ ] Default exports for main component
- [ ] Named exports for types/utilities

### Understanding Redux Store (1 hour)

**Study Redux Pattern:**

Open a slice like `src/store/propertySlice.tsx`:
```typescript
// 1. Define state interface
interface PropertyState {
  items: Property[];
  loading: boolean;
}

// 2. Create slice with reducers
const propertySlice = createSlice({
  name: 'properties',
  initialState,
  reducers: {
    setProperties: (state, action: PayloadAction<Property[]>) => {
      state.items = action.payload;
    },
  },
});

// 3. Export actions
export const { setProperties } = propertySlice.actions;

// 4. Export selector (use this in components)
export const selectProperties = (state: RootState) => 
  state.properties.items;

// 5. Export reducer
export default propertySlice.reducer;
```

**Using in a Component:**
```typescript
// Import selector and action
import { useSelector, useDispatch } from 'react-redux';
import { selectProperties, setProperties } from '../store/propertySlice';

// In component:
const properties = useSelector(selectProperties);
const dispatch = useDispatch();

// When you need data:
dispatch(setProperties(newData));
```

**Key Patterns to Learn:**
- [ ] State interface defines shape of data
- [ ] Slices organize related state & actions
- [ ] Use selectors to get data (not direct state access)
- [ ] Dispatch actions to update state
- [ ] Type dispatch with `AppDispatch`

---

## 🔍 THIRD DAY (Day 3 - Code Reading & Understanding)

### Read Production Code (1 hour)

Pick 3 files and understand them:

**File 1: Read a Page**
```bash
# Open src/pages/PropertiesPage.tsx
# Questions to answer:
# - What data does it get from Redux?
# - What components does it render?
# - Does it have any API calls?
# - How is it styled?
```

**File 2: Read a Complex Component**
```bash
# Open src/components/common/PropertyCard.tsx
# Questions to answer:
# - What props does it accept?
# - How are they typed?
# - What styled-components does it use?
# - Does it have any event handlers?
```

**File 3: Read a Store Slice**
```bash
# Open src/store/authSlice.tsx
# Questions to answer:
# - What state does it manage?
# - What actions are available?
# - What selectors are exported?
# - How would I use this in a component?
```

### TypeScript Deep Dive (1-2 hours)

**Understand Common TypeScript Patterns:**

1. **Interfaces (What data should look like)**
   ```typescript
   interface User {
     id: string;
     name: string;
     email: string;
   }
   ```

2. **Union Types (Multiple options)**
   ```typescript
   type Status = 'pending' | 'success' | 'error';
   ```

3. **Generics (Reusable types)**
   ```typescript
   interface ApiResponse<T> {
     data: T;
     status: number;
   }
   ```

4. **Optional Properties (Might not exist)**
   ```typescript
   interface User {
     id: string;
     nickname?: string;  // Optional (? means optional)
   }
   ```

5. **Type Inference (Let TypeScript guess)**
   ```typescript
   const count = 5;  // Type: number (inferred)
   ```

**Before/After Comparison:**

Before TypeScript:
```javascript
// What type is data?
// What properties does it have?
// Will it error at runtime? Unknown!
const processData = (data) => {
  return data.name + data.email;  // Could be undefined!
};
```

After TypeScript:
```typescript
// Clear interface definition
interface User {
  name: string;
  email: string;
}

// TypeScript checks types
const processData = (data: User): string => {
  return data.name + data.email;  // Safe! TypeScript verified types
};
```

**Practice Exercises:**
- [ ] Open `src/types/index.ts` and read all interfaces
- [ ] Try hovering over variables - see TypeScript inference
- [ ] Create a simple component with your own Props interface
- [ ] Make a simple Redux slice for a new feature

---

## 💻 FOURTH DAY (Day 4 - Making Your First Change)

### Make a Simple Code Change

**Task 1: Update a Component (15 min)**
```bash
# 1. Open src/components/common/DataCard.tsx
# 2. Add a new prop: 'subtitle?: string'
# 3. Display the subtitle if provided
# 4. Run npm run build - should pass!
```

**Task 2: Create a New Simple Component (30 min)**
```bash
# 1. Create src/components/common/SimpleCard.tsx
# 2. Define props with interface
# 3. Add basic styling with styled-components
# 4. Export from src/components/common/index.tsx
# 5. Run npm run build - should pass!

# Example:
interface SimpleCardProps {
  title: string;
  description: string;
}

const SimpleCard: FC<SimpleCardProps> = ({ title, description }) => {
  return (
    <div>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
};
```

**Task 3: Create a Simple Redux Slice (30 min)**
```bash
# 1. Create src/store/tempSlice.tsx
# 2. Define a simple state with one property
# 3. Create one reducer action
# 4. Export selector and actions
# 5. Run npm run build - should pass!

# Example:
const tempSlice = createSlice({
  name: 'temp',
  initialState: { count: 0 },
  reducers: {
    increment: (state) => {
      state.count += 1;
    },
  },
});
```

### Git Workflow (15 min)

**Create a Feature Branch:**
```bash
# 1. Create a new branch
git checkout -b feature/my-first-change

# 2. Make your changes
# 3. See what changed
git status

# 4. Add changes
git add .

# 5. Commit with meaningful message
git commit -m "Add SimpleCard component

- Created new SimpleCard component
- Accepts title and description props
- Styled with styled-components
- Ready for review"

# 6. Push to GitHub
git push origin feature/my-first-change

# 7. Create Pull Request (PR) on GitHub
```

**Checklist:**
- [ ] Made changes to a component or created new component
- [ ] Ran `npm run build` - no errors
- [ ] Ran `npm run test -- --run` - tests pass
- [ ] Created git branch with clear name
- [ ] Committed changes with clear message
- [ ] Pushed to GitHub
- [ ] Opened Pull Request (ask team lead to review)

---

## 👥 TEAM STANDARDS & BEST PRACTICES

### Code Style Guide (Review with Team)
- [ ] Read `.eslintrc.cjs` - coding rules
- [ ] Read `.prettierrc` - formatting rules
- [ ] VS Code should auto-format on save (Prettier)
- [ ] TypeScript strict mode enabled (`no-any` types)

### Git Workflow
- [ ] Branch naming: `feature/`, `bugfix/`, `docs/`, `chore/`
- [ ] Commit messages: Clear and descriptive
- [ ] PR reviews: At least 1 approval before merge
- [ ] Main branch: Always deployable

### Code Review Standards
- [ ] All TypeScript errors must be fixed
- [ ] No `any` types allowed
- [ ] Tests must pass
- [ ] Props must be properly typed
- [ ] Components must follow naming conventions

### Documentation
- [ ] Update README if you change setup
- [ ] Add JSDoc comments for complex functions
- [ ] Update type interfaces if you change data shapes
- [ ] Document complex logic

---

## 🎓 LEARNING RESOURCES

### Recommended Reading Order
1. [ ] `TYPESCRIPT_DEVELOPER_QUICK_START.md` (today)
2. [ ] TypeScript Handbook: https://www.typescriptlang.org/docs/
3. [ ] React Docs: https://react.dev/learn
4. [ ] Redux Docs: https://redux.js.org/usage
5. [ ] Your codebase examples

### Hands-On Practice
1. [ ] Build a simple component with types
2. [ ] Create a Redux slice
3. [ ] Use a selector in a component
4. [ ] Create a PR with your first change
5. [ ] Participate in code review

### Video Learning (Optional)
- [ ] TypeScript Crash Course (30 min)
- [ ] React TypeScript Tutorial (45 min)
- [ ] Redux Fundamentals (1 hour)

---

## 📞 GETTING HELP

### Ask Before Getting Stuck
- **Stuck > 15 min?** Ask in #questions Slack channel
- **Configuration issue?** Tag @devops in #dev-team
- **Code review?** Leave comment in GitHub PR
- **Design question?** Post in #design channel

### Common Questions & Answers

**Q: How do I use a component in a page?**
```typescript
// In your page:
import DataCard from '../components/common/DataCard';

// Use it:
<DataCard title="Properties" value={42} />
```

**Q: How do I get data from Redux?**
```typescript
const data = useSelector(selectMyData);
```

**Q: How do I update Redux state?**
```typescript
const dispatch = useDispatch<AppDispatch>();
dispatch(myAction(newData));
```

**Q: TypeScript is showing an error, what do I do?**
1. Read the error message carefully
2. Hover over the error in VS Code
3. Check the interface/type definition
4. Ask in #questions if confused

**Q: How do I commit my changes?**
```bash
git add .
git commit -m "Clear description of changes"
git push origin your-branch-name
```

---

## ✅ FIRST WEEK CHECKLIST

### Day 1 ✓
- [ ] Development environment set up
- [ ] All tests passing locally
- [ ] Slack channels joined
- [ ] Team introductions done

### Day 2 ✓
- [ ] Codebase structure understood
- [ ] Component patterns reviewed
- [ ] Redux patterns understood

### Day 3 ✓
- [ ] Read 3 production files
- [ ] TypeScript concepts understood
- [ ] Comfortable with type syntax

### Day 4 ✓
- [ ] Made first code change
- [ ] Created and pushed feature branch
- [ ] Opened first Pull Request
- [ ] Received code review feedback

### Day 5 ✓
- [ ] First PR merged (if approved)
- [ ] Assigned to first real task
- [ ] Comfortable asking for help
- [ ] Ready to work independently

---

## 🎉 SUCCESS CRITERIA

You're ready to work independently when:
- ✅ You can start the dev server without help
- ✅ You understand the folder structure
- ✅ You can read a component and understand it
- ✅ You can create a simple component
- ✅ You know how to use Redux in a component
- ✅ You can create a feature branch and PR
- ✅ You know where to ask questions
- ✅ You understand TypeScript basics
- ✅ You can run tests and fix failures
- ✅ You're comfortable with code reviews

---

## 📋 SIGN-OFF

After completing this checklist, have your team lead sign off:

**Team Lead Sign-Off:**
- [ ] Reviewed onboarding completion
- [ ] Developer environment verified
- [ ] First PR reviewed & merged
- [ ] Cleared to work independently

**Developer Sign-Off:**
- [ ] All items completed
- [ ] Ready to start first task
- [ ] Know how to ask for help
- [ ] Comfortable with TypeScript codebase

---

## 📚 ADDITIONAL RESOURCES

### Documentation
- Main README: `README.md`
- Web: `TYPESCRIPT_DEVELOPER_QUICK_START.md`
- Web: `NEXT_STEPS_ROADMAP.md`
- Web: `TYPESCRIPT_MIGRATION_COMPLETE_EXECUTIVE_REPORT.md`

### External Links
- TypeScript docs: https://www.typescriptlang.org/docs/
- React docs: https://react.dev/
- Redux docs: https://redux.js.org/
- VS Code tips: https://code.visualstudio.com/docs/typescript/typescript-editing

### Team Contacts
- **Team Lead:** [Name & Slack handle]
- **DevOps Lead:** [Name & Slack handle]
- **Code Review:** Post in GitHub PR

---

**Welcome to the White Caves team! 🎉**  
*If you have questions at any point, reach out in #questions.*  
*You've got this!*

Last Updated: March 12, 2026