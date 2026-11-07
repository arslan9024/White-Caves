---
name: aegis-white-caves-chronicler
description: "Compiles and updates the official living hyperlinked HTML encyclopedia 'The Book of White Caves' inside .agents/book-white-caves/. Documents the entire software development journey, architectural marvels, AEGIS mesh, and tech stacks with dual-way interactive navigation for Zoe AI Assistant viewing."
triggers:
  - "aegis:compile:book"
  - "aegis:book:white:caves"
---

# 📖 The Chronicler: The Book of White Caves

> **Assigned Subagent:** `@Aurora` (Principal Systems CTO & Canonical Chronicler)  
> **Output Location:** `.agents/book-white-caves/`  
> **Viewer Component:** `src/components/ZoeFeatures/WhiteCavesBookViewer.tsx`

---

## 1. Vision & Purpose

This skill transforms continuous AEGIS autopilot cycles into a **monumental, interactive, living technical book** of software engineering excellence.

Each cycle of the autopilot loop records:
- **Chapter 1: The Genesis & System Architecture** (SRS, SAD, Monolith Structure, Next.js 15 & Vite dual runtime)
- **Chapter 2: The AEGIS Sovereign Mesh** (235 Agents, Dual 1-12-108 Roster, 42 Statutory Laws)
- **Chapter 3: The Engine of Perpetual Ouroboros** (100% Autopilot, Continuous 7-Phase Cycle)
- **Chapter 4: The 12 Engineering Departments** (Deep Dive into UI/UX, Backend, Vision OCR, SecOps, SQA)
- **Chapter 5: Dubai Real Estate & FinTech Engine** (Ejari Form 7, DLD APIs, UAE VAT, PDC Rent Schedules)
- **Chapter 6: The Living Chronology of Autonomous Cycles** (Real-time log of every completed wave and its architectural gains)

---

## 2. Formatting & Navigation Standard

Every HTML page generated in `.agents/book-white-caves/` must include:
1. **Dual-Way Navigation Header**:
   - `[⏮️ Previous Chapter] | [📑 Table of Contents] | [Next Chapter ⏭️]`
2. **Interactive Hyperlinks**:
   - Direct links between agents, services, Prisma models, and architecture diagrams.
3. **Executive Styling**:
   - Dark mode aesthetic matching White Caves brand tokens (`#020617` background, `#EF4444` White Caves red accent, `#38BDF8` cyber cyan).
4. **Zoe Integration**:
   - An embeddable iframe / viewer component mounted inside Zoe AI Assistant (`src/components/ZoeFeatures/WhiteCavesBookViewer.tsx`).

