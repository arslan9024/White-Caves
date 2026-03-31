# Developer Environment Setup Guide — White Caves CRM Platform

> **Document ID:** WC-DEV-001  
> **Version:** 1.0  
> **Date:** March 2026  
> **Audience:** New developers joining the project

---

## Prerequisites

| Tool | Required Version | Install |
|------|-----------------|---------|
| Node.js | 20.x LTS | https://nodejs.org |
| npm | 9.x+ (bundled with Node 20) | Bundled with Node.js |
| Git | Any recent | https://git-scm.com |
| VS Code | Latest | https://code.visualstudio.com |
| MongoDB Compass | Latest (optional) | https://mongodb.com/compass |
| Postman / Insomnia | Latest (optional) | For API testing |

---

## 1. Clone the Repository

```bash
git clone https://github.com/arslan9024/White-Caves.git
cd White-Caves
```

---

## 2. Install Dependencies

```bash
npm install
```

This installs all frontend and backend dependencies from `package.json`.

---

## 3. Configure Environment Variables

Create a `.env` file in the project root (never commit this file — it is in `.gitignore`):

```bash
cp .env.example .env
```

Edit `.env` with development values. Minimum required for local development:

```env
# Database — use MongoDB Atlas free tier or local MongoDB
DATABASE_URL=mongodb+srv://devuser:devpass@cluster.mongodb.net/whitecaves_dev

# Auth
JWT_SECRET=dev-secret-change-in-production-minimum-32-chars

# Firebase (get from Firebase console → Project Settings → Service Account)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_KEY\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@your-project.iam.gserviceaccount.com

# Firebase Web (get from Firebase console → Project Settings → Web App)
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id

# API URLs
VITE_API_URL=http://localhost:3001
NODE_ENV=development
PORT=3001

# Optional (features will be disabled in dev without these)
WHATSAPP_API_TOKEN=
SENDGRID_API_KEY=
STRIPE_SECRET_KEY=
EXCHANGE_RATE_API_KEY=
```

> **Note:** Ask the lead developer to share the `.env.example` file and development credential values.

---

## 4. Generate Prisma Client

```bash
npx prisma generate
```

This generates the TypeScript client from `prisma/schema.prisma`.

---

## 5. Seed the Database (Optional)

For development, seed the database with sample data:

```bash
npx prisma db seed
```

This runs `prisma/seed.ts` which creates sample users, properties, and leads.

---

## 6. Start Development Servers

The project uses two concurrent dev servers: Vite (frontend) and tsx (backend).

```bash
npm run dev
```

This command starts:
- **Frontend (Vite):** http://localhost:5173 — hot module replacement enabled
- **Backend (tsx watch):** http://localhost:3001 — auto-restarts on file changes

---

## 7. Project Structure

```
White-Caves/
├── src/                        # Frontend (React + TypeScript)
│   ├── components/
│   │   ├── crm/                # All AI assistant CRM components
│   │   │   ├── ClaraLeadsCRM_NEW/   # Lead management
│   │   │   ├── DaisyLeasingCRM_NEW/ # Tenancy management
│   │   │   ├── AuroraCTODashboard_NEW/ # Tech dashboard
│   │   │   └── ...             # Other assistant components
│   │   ├── shared/             # Reusable UI components
│   │   └── layout/             # Header, sidebar, layout wrapper
│   ├── pages/                  # Route-level page components
│   │   ├── crm/                # CRM pages
│   │   ├── owner/              # WhatsApp + system pages
│   │   ├── buyer/ seller/      # Buyer/seller tools
│   │   └── auth/               # Auth pages
│   ├── store/                  # Redux store + slices
│   ├── services/               # API service modules (Axios)
│   ├── hooks/                  # Shared React hooks
│   ├── types/                  # TypeScript type definitions
│   └── utils/                  # Helper functions
│
├── server/                     # Backend (Express + TypeScript)
│   ├── routes/                 # API route handlers
│   ├── middleware/             # Auth, error handling, etc.
│   ├── config/                 # Env config, pagination helpers
│   └── index.ts                # Express app entry point
│
├── prisma/
│   ├── schema.prisma           # Database schema (MongoDB)
│   └── seed.ts                 # Database seeder
│
├── business_docs/              # All business documentation
├── docs/adr/                   # Architecture Decision Records
├── public/                     # Static assets
├── vite.config.ts              # Vite configuration
├── tsconfig.json               # TypeScript config
└── package.json
```

---

## 8. Running Tests

```bash
# Run all tests (unit + integration)
npm test

# Run tests in watch mode
npm run test:watch

# Run with coverage report
npm run test:coverage

# Run E2E tests (requires staging environment)
npx playwright test
```

---

## 9. Code Quality

```bash
# Lint
npm run lint

# Fix auto-fixable lint issues
npm run lint:fix

# Type check (no emit)
npx tsc --noEmit

# Format with Prettier
npm run format
```

---

## 10. VS Code Recommended Extensions

Install these for the best development experience:

- **ESLint** — `dbaeumer.vscode-eslint`
- **Prettier** — `esbenp.prettier-vscode`
- **Prisma** — `Prisma.prisma`
- **Tailwind CSS IntelliSense** (if used) — `bradlc.vscode-tailwindcss`
- **GitLens** — `eamodio.gitlens`
- **Thunder Client** — `rangav.vscode-thunder-client` (in-editor API testing)

---

## 11. Branching Strategy

```
main              → Protected. Only merged from feature/hotfix branches. Auto-deploys to staging.
feature/<name>    → Your working branch. E.g., feature/nina-bot-intents
hotfix/<version>  → Emergency fixes. Branched from release tag.
```

**Workflow:**
1. Create feature branch from `main`
2. Make changes + write/update tests
3. Run `npm test` and `npm run lint` locally (must pass)
4. Open Pull Request against `main`
5. Request code review from at least 1 other developer
6. Merge after approval + CI passes

---

## 12. API Documentation

- Full REST API reference: `business_docs/06_design_architecture/api-reference.md`
- Base URL (local): `http://localhost:3001/api`
- All protected routes require: `Authorization: Bearer <jwt-token>`
- Get token from: `POST /api/auth/login`

---

**Document ID:** WC-DEV-001 | **Version:** 1.0 | **Date:** March 2026
