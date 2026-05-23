# Phase 19: Environment Setup Checklist
**Complete by April 9, 10 AM | 60-90 minutes**

---

## ✅ **Pre-Setup Verification (5 minutes)**

Before starting, verify you have:

- [ ] **Corporate laptop** assigned (macOS, Linux, or Windows)
- [ ] **16GB+ RAM** (check: System > About on Mac or Settings > System > About on Windows)
- [ ] **200GB+ free disk space** (check: Disk Utility or Storage settings)
- [ ] **WiFi or ethernet connection** (stable, >10 Mbps)
- [ ] **GitHub account** with SSH key configured
- [ ] **Slack account** (you'll receive invite April 8 afternoon)

**If you're missing any of the above:** Contact IT or VP Engineering immediately → don't proceed.

---

## 🔧 **Required Software (10 minutes)**

Check that you have these installed. If not, install now:

### **1. Git (Version Control)**
```bash
# Check if installed
git --version

# Expected: git version 2.39.0 or higher
# If not installed: https://git-scm.com/downloads
```

✅ **Verification:** `git --version` returns 2.39.0+

### **2. Node.js LTS (JavaScript Runtime)**
```bash
# Check if installed
node --version
npm --version

# Expected: Node.js v20.x or v22.x (LTS)
# Expected: npm 10.x or higher
# If not installed: https://nodejs.org/
```

✅ **Verification:** `node --version` returns v20.x or v22.x

### **3. Your Code Editor (VSCode Recommended)**
```bash
# Check if installed
code --version

# Expected: 1.90.0 or higher
# If not installed: https://code.visualstudio.com/
```

Optional but recommended: Install VSCode extensions once you clone repo (will be suggested).

### **4. Podman (Container Runtime, Optional for Phase 19)**
```bash
# Check if installed
podman --version

# Expected: 4.5.0 or higher
# Optional for Phase 19 (use for local testing if needed)
# Installation: https://podman.io/docs/installation
```

✅ **Verification:** All core tools (Git, Node, npm) confirmed installed

---

## 📥 **Clone White Caves Repository (10 minutes)**

### **Step 1: Generate SSH Key (If Needed)**
```bash
# Check if SSH key exists
ls -la ~/.ssh/id_rsa

# If file doesn't exist, generate new key:
ssh-keygen -t rsa -b 4096 -C "your.email@example.com"
# Press Enter for all prompts (use default settings)
# No passphrase needed for development
```

### **Step 2: Add SSH Key to GitHub**
1. Copy your public key:
```bash
cat ~/.ssh/id_rsa.pub
```
2. Go to GitHub → Settings → SSH and GPG keys → New SSH key
3. Title: "Phase 19 Laptop"
4. Paste the key from `~/.ssh/id_rsa.pub`
5. Click "Add SSH key"

### **Step 3: Test SSH Connection**
```bash
ssh -T git@github.com

# Expected response:
# Hi [your-github-username]! You've successfully authenticated...
```

✅ **Verification:** SSH connection to GitHub successful

### **Step 4: Clone Repository**
```bash
# Navigate to your development folder
cd ~/Projects  # or wherever you keep code

# Clone the White Caves repo
git clone git@github.com:whitecaves/white-caves.git

# Navigate into the repo
cd white-caves

# Verify clone was successful
ls -la
# You should see: package.json, src/, public/, etc.
```

✅ **Verification:** Repository cloned, `git status` shows clean working directory

---

## 📦 **Install Dependencies (15 minutes)**

### **Step 1: Install Node Modules**
```bash
# In the white-caves directory
npm install --legacy-peer-deps

# This will:
# - Download all npm packages
# - Create node_modules/ folder
# - Generate package-lock.json (already committed)
# Time: 10-15 minutes depending on internet speed
```

**Expected Output:**
```
added 485 packages, and audited 500 packages in 2m
found 0 vulnerabilities
```

⚠️ **If you see npm audit vulnerabilities:**  
This is expected (Phase 19 will fix them). Don't worry.

### **Step 2: Verify Dependencies**
```bash
# Check if node_modules was created
ls -la node_modules | head -5
# Should show multiple package folders

# Verify key packages are present
npm ls react typescript vite

# Expected output shows version numbers for each
```

✅ **Verification:** node_modules created, key dependencies installed

---

## 🔑 **Environment Configuration (10 minutes)**

### **Step 1: Create .env.local (Development)**
```bash
# In the white-caves directory
cp .env.example .env.local

# Open .env.local in your editor
code .env.local
```

### **Step 2: Configure Local Environment Variables**
```
# .env.local should contain:

VITE_API_URL=http://localhost:3001
VITE_ENVIRONMENT=development
VITE_LOG_LEVEL=debug
VITE_FIREBASE_CONFIG={paste from shared creds}
VITE_STRIPE_KEY=pk_test_[your-test-key]

# Database (if running locally)
DATABASE_URL=mongodb://localhost:27017/white-caves-dev
NODE_ENV=development
```

**Where to get creds:**
- Slack: #phase-19-support pinned message "Shared Development Credentials"
- Ask your workstream lead for `credentials.json`
- Do NOT commit .env.local to git

### **Step 3: Verify Environment**
```bash
# Check if .env.local is ignored by git
cat .gitignore | grep .env

# Should output: .env.local
# This ensures credentials aren't accidentally committed
```

✅ **Verification:** .env.local created with correct values, ignored by git

---

## 🚀 **Start Development Server (10 minutes)**

### **Step 1: Start the Server**
```bash
# In the white-caves directory
npm run dev

# Expected output:
# VITE v5.0.0  ready in 245 ms
# ➜  Local:   http://localhost:5000/
# ➜  press h to show help
```

The server should start and stay running. You should see:
- App bundling in progress
- Server listening on http://localhost:5000
- HMR (Hot Module Reload) ready for development

### **Step 2: Open in Browser**
1. Open a new browser tab
2. Navigate to: **http://localhost:5000**
3. You should see the White Caves login page

### **Step 3: Test Login**
```
Email: test@whitecaves.io
Password: TestPassword123!
```

(These are test credentials in development mode. Phase 18 enabled local auth.)

**Expected:** Login succeeds, you see the dashboard

### **Step 4: Verify Hot Reload**
1. Keep the dev server running (don't close terminal)
2. Open: `src/components/Dashboard/Dashboard.tsx` in your editor
3. Find any `<h1>` or text element
4. Change text, save file
5. Browser should auto-refresh and show your change (within 1-2 seconds)

✅ **Verification:** Dev server running, login works, hot reload confirmed

---

## 🧪 **Run Test Suite (Optional, 10 minutes)**

### **Step 1: Start Test Runner**
```bash
# In a NEW terminal (keep dev server running in first terminal)
npm run test:watch

# Expected output:
# VITEST v1.0.0
# ✓ src/__tests__/sum.test.ts (1 test)
# Tests: 1 passed, 1 total
```

### **Step 2: Run All Tests**
```bash
# Single run (completeness check)
npm run test

# Expected: Most tests pass (Phase 19 improves coverage)
# Some failures are OK for now
```

### **Step 3: Check Test Coverage**
```bash
npm run test:coverage

# Generates coverage/ folder
# Open coverage/index.html to see detailed report
```

✅ **Verification:** Tests run without crashing, you can see results

---

## 🏗️ **Build Verification (Optional, 10 minutes)**

### **Step 1: Build for Production**
```bash
# In a terminal (can be same or different)
npm run build

# Expected output:
# ✓ 1234 modules transformed.
# dist/index.html              12.34 KiB
# dist/assets/index-[hash].js  456.78 KiB / gzip: 123.45 KiB
```

This creates a `dist/` folder with production build.

### **Step 2: Verify No Build Errors**
```bash
# Check build output
ls -la dist/

# Should show:
# index.html
# assets/ folder with .js and .css files
```

### **Step 3: Preview Production Build**
```bash
npm run preview

# Expected:
# ➜  Local preview server running at http://localhost:4173/
```

Navigate to http://localhost:4173 to verify build works.

✅ **Verification:** Build succeeds, preview loads without errors

---

## ✨ **Final Verification Checklist (5 minutes)**

Run this checklist to confirm everything is working:

```bash
# Terminal Session 1: Dev Server
npm run dev
# ✓ Should show "Local: http://localhost:5000/"

# Terminal Session 2: Check tools
git --version           # ✓ 2.39.0+
node --version          # ✓ v20.x or v22.x
npm --version           # ✓ 10.x+
npm run build           # ✓ Completes without errors

# Browser: Open http://localhost:5000
# ✓ Should see login page
# ✓ Test login with provided credentials
# ✓ Should see dashboard after login
# ✓ Modify a component, verify hot reload works
```

---

## 🐛 **Troubleshooting Guide**

### **Issue 1: "npm ERR! code ERESOLVE, unable to resolve dependency tree"**

**Solution:**
```bash
npm install --legacy-peer-deps
```

This is the correct command for this project (ESLint v10 + React compatibility).

### **Issue 2: "Port 5000 is already in use"**

**Solution:**
```bash
# Find process using port 5000
lsof -i :5000  # macOS/Linux
netstat -ano | findstr :5000  # Windows PowerShell

# Kill the process
kill -9 [PID]  # macOS/Linux
taskkill /PID [PID] /F  # Windows

# Restart dev server
npm run dev
```

### **Issue 3: "ENOENT: no such file or directory, open '.env.local'"**

**Solution:**
```bash
# Create .env.local from example
cp .env.example .env.local

# Verify it was created
ls -la .env.local

# Run dev server again
npm run dev
```

### **Issue 4: "SyntaxError: Unexpected token" or TypeScript errors**

**Solution:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
npm run build
```

If error persists, post in #phase-19-support with the error message.

### **Issue 5: "Git clone fails with 'Permission denied (publickey)'"**

**Solution:**
1. Verify SSH key was added to GitHub account (redo Step B if needed)
2. Test SSH: `ssh -T git@github.com`
3. If still fails: Use HTTPS instead `git clone https://github.com/whitecaves/white-caves.git`

### **Issue 6: Browser login fails or gets blank page**

**Solution:**
```bash
# 1. Check if dev server is still running
# (Should see "VITE vX.X.X ready in XXX ms")

# 2. Check browser console for errors
# (Open: F12 or Cmd+Option+K → Console tab)

# 3. Clear browser cache
# (Chrome: Cmd+Shift+Delete or Ctrl+Shift+Delete)

# 4. Hard refresh browser
# (Cmd+Shift+R on Mac, Ctrl+Shift+R on Windows)

# 5. If still broken: Kill dev server and restart
npm run dev
```

### **Issue 7: "Module not found" or import errors**

**Solution:**
```bash
# Verify file exists
ls -la src/components/Dashboard/

# Check for typos in import statement
# Compare against actual filename (case-sensitive!)

# If file is missing, you may need to pull latest code
git pull origin main
npm install --legacy-peer-deps
npm run dev
```

### **Issue 8: npm install takes very long time (>20 minutes)**

This is normal for first install (485 packages). Be patient. If it stalls (no output for 5+ minutes):
```bash
# Cancel (Ctrl+C)
rm -rf node_modules
npm cache clean --force
npm install --legacy-peer-deps --no-optional
```

---

## 📞 **Still Having Issues? Get Help!**

### **Slack Channels (Fastest Response):**
- `#phase-19-support` — Setup and environment issues
- `#general` — General questions
- Mention your workstream lead

### **Response Time:**
- 9 AM - 5 PM PT (Mon-Fri): <30 min response
- Outside hours: Next business day morning

### **Include in Your Support Request:**
1. **Issue:** What's not working?
2. **Steps taken:** What have you already tried?
3. **Error message:** Exact error from terminal/browser
4. **Environment:** OS (macOS/Linux/Windows), Node version, npm version
5. **Screenshot:** Screenshot of error if helpful

Example:
```
🆘 Help needed with npm install

Issue: npm install fails with peer dependency error
Steps: Ran npm install without flags in white-caves/ directory
Error: ERR! code ERESOLVE, unable to resolve dependency tree

Environment:
- macOS 13.4
- Node v20.10.0
- npm 10.2.0

Tried: clearing cache (npm cache clean --force)

Screenshot: [attached]
```

The team is NOT going to judge you for asking questions. Every team member had to set up their environment — you're not alone! 💪

---

## 🎯 **When You're Done: Final Sign-Off**

Once everything is working:

1. [ ] All 8 steps above completed
2. [ ] Dev server running at http://localhost:5000
3. [ ] Login works with test credentials
4. [ ] Hot reload verified
5. [ ] Tests run without crashing
6. [ ] Build completes without errors
7. [ ] No blocking issues remain
8. [ ] Ready for April 9 kickoff

**Confirmation:**
Post in `#phase-19-execution` Slack thread:
```
✅ Environment setup complete!
[Your Name] is ready for Phase 19 kickoff on April 9 🚀
```

---

## 📋 **Workstream-Specific Setup**

### **If on Performance Optimization Workstream:**
- [ ] Review: `PHASE_19_WEEK1_EXECUTION_PLAN.md` (Week 1, Day 1-2)
- [ ] Download: Chrome DevTools (already included in Chrome)
- [ ] Install: `npm run build && npm run preview` to test builds
- [ ] Bookmark: https://web.dev/vitals (Core Web Vitals reference)

### **If on Security Hardening Workstream:**
- [ ] Review: `PHASE_19_WEEK1_EXECUTION_PLAN.md` (Week 1, Day 1-2)
- [ ] Install (optional): `npm install -g npm-check-updates`
- [ ] Bookmark: https://owasp.org/www-project-top-ten/ (OWASP Top 10 reference)
- [ ] Bookmark: https://snyk.io/products/snyk-code (Vulnerability scanning)

### **If on Reliability Engineering Workstream:**
- [ ] Review: `PHASE_19_WEEK1_EXECUTION_PLAN.md` (Week 1, Day 1-2)
- [ ] Install: Podman (if not already) — see software section above
- [ ] Study: `podman-compose.yml` in repo root
- [ ] Bookmark: Docker/Podman best practices documentation

### **If on Cost Optimization Workstream:**
- [ ] Review: `PHASE_19_WEEK1_EXECUTION_PLAN.md` (Week 1, Day 1-2)
- [ ] Access: Cloud cost reports (request from Cloud Admin or Finance)
- [ ] Bookmark: Cloud provider cost calculator

### **If on Observability Enhancement Workstream:**
- [ ] Review: `PHASE_19_WEEK1_EXECUTION_PLAN.md` (Week 1, Day 1-2)
- [ ] Study: `src/services/metrics/` folder in codebase
- [ ] Install: Postman (for API testing) — https://www.postman.com/downloads/
- [ ] Bookmark: Prometheus documentation (metrics reference)

---

## 📞 **Support Hours (April 8-9)**

**April 8, 2026:**
- Morning: 8 AM - 12 PM PT (Setup issues)
- Afternoon: 1 PM - 6 PM PT (Intensive setup support + office hours by workstream)
- Evening: Available in Slack only

**April 9, 2026:**
- Morning: 8 AM - 9 AM PT (Last-minute setup fixes)
- 9 AM - 10 AM: All-hands kickoff (everyone required)
- 10 AM - 5 PM: Workstream launches + setup resolution as needed

**Get Help:**
- Slack: #phase-19-support (24-hour channels available)
- In-Person: [Office Location], [Address] (if you're local)
- Call: Team lead phone (emergency setup issues only)

---

## ✅ **Estimated Timeline**

| Step | Time | Total |
|------|------|-------|
| Pre-setup verification | 5 min | 5 min |
| Install required software | 10 min | 15 min |
| Clone repository | 10 min | 25 min |
| Install dependencies | 15 min | 40 min |
| Configure environment | 10 min | 50 min |
| Start dev server | 10 min | 60 min |
| Run tests (optional) | 10 min | 70 min |
| Build verification (optional) | 10 min | 80 min |
| Final verification | 5 min | 85 min |

**Total Time: 60-90 minutes** (depends on internet speed + OS)

**Recommended Timeline:**
- April 8, 10-11 AM: Complete core setup
- April 8, 2-3 PM: Run tests and build
- April 8, 3-5 PM: Final verification and troubleshooting
- By April 9, 9 AM: Everything working

---

## 🎉 **You've Done It!**

Your environment is ready for Phase 19. You're now:

✅ **Technically prepared** — All tools installed and configured  
✅ **Codebase familiar** — You've cloned, installed, and run the project  
✅ **Team-ready** — Joined Slack channels, received credentials  
✅ **Mindset-ready** — Understand Phase 19 mission and timeline  

**April 9, 9 AM: All-Hands Kickoff awaits!**

See you there, ready to build something legendary! 🚀

---

**Checklist Created:** March 7, 2026  
**Setup Deadline:** April 9, 10 AM PT  
**Support Channel:** #phase-19-support (Slack)  
**Questions?** Ask away — we're all in this together!
