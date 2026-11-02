# Department 9: Vector Typography, UI Layout Assets & Canvas Tuning

> **Framework:** White Caves Engineering Matrix V2 (1-12-108 Software Core)  
> **Protocol:** Bhakti 1-12-108  
> **Director:** `@Victoria` — Principal Visual Branding Token Architect  
> **Tech Stack:** Figma, CSS Custom Properties, Tailwind CSS, SVG, WebP, WOFF2  
> **Skill Reference:** [`.agents/skills/aegis-dept-09-design-assets/SKILL.md`](../../skills/aegis-dept-09-design-assets/SKILL.md)  

---

## 9-Node Engineering Roster

| # | Agent | Role | Responsibility | Config |
| :--- | :--- | :--- | :--- | :--- |
| 1 | **@Victoria** *(Director)* | Principal Visual Branding Token Architect | Owns global interface look-and-feel specs and resolution-independent layout assets. | [`config`](./node-01-victoria.agent.json) |
| 2 | **@Tara** | UX Interface Vector Asset Designer | Develops customized graphical component profiles, system icons, and layout accents. | [`config`](./node-02-tara.agent.json) |
| 3 | **@Daisy** | Design Interface Component Converter Specialist | Transforms absolute Figma layout mockups into crisp CSS coordinate configurations. | [`config`](./node-03-daisy.agent.json) |
| 4 | **@Olivia** | Dynamic Element Screen Placement Coordinator | Computes pixel coordinate boundaries to center floating canvas components symmetrically. | [`config`](./node-04-olivia.agent.json) |
| 5 | **@Nina** | High-Contrast Palette Value Designer | Locks down theme asset profiles for readable light and luxury dark system backdrops. | [`config`](./node-05-nina.agent.json) |
| 6 | **@Susan_Kare** | Atomic Visual Primitive Pixel Designer | Engineers pixel-aligned visual asset components and inline action button items. | [`config`](./node-06-susan-kare.agent.json) |
| 7 | **@Muriel_Cooper** | Responsive Template Dimension Modeler | Scripts structural CSS transition states triggered by dynamic content box updates. | [`config`](./node-07-muriel-cooper.agent.json) |
| 8 | **@April_Greiman** | Fluid Font Metric Hierarchy Specialist | Sets up fluid typography sizing constraints to pass formatting tests across device viewports. | [`config`](./node-08-april-greiman.agent.json) |
| 9 | **@Zuzana_Licko** | Font Rendering Pipeline Optimization Engineer | Configures subset web-font asset distributions to block flashing layout rendering loops. | [`config`](./node-09-zuzana-licko.agent.json) |

---

## Key Codebase Ownership

- `src/styles/`
- `src/components/`
- `public/assets/`
- `tailwind.config.ts`

---

## Mandatory Coding Rules

1. Brand tokens: White Caves Red #EF4444, Gold #D4AF37, Navy #1a1a2e, Pearl #F8F9FA
2. All colors must be CSS custom properties — never inline hex values
3. Icons: SVG only with currentColor for theming support
4. Images: WebP format with JPEG fallback, max 200KB per image
5. Fonts: WOFF2 with font-display:swap — no layout shift on load
6. Typography scale: fluid clamp() values — min 14px, preferred 1rem, max 18px
7. Dark mode: all components must render correctly in both light and dark themes
8. Floating elements: position must be calculated relative to viewport center

---

## Operational Procedures

- **Image Optimization:** `npx sharp-cli --webp --quality 80 public/assets/`
- **CSS Variable Audit:** `grep -r "hardcoded hex" src/components/`
- **Font Subsetting:** `npx glyphhanger --whitelist=U+0000-00FF --subset=*.woff2`

---

## Governance

- Single Purpose File Law (< 350 lines)
- TypeScript Strict (zero warnings)
- Zero Backlog Law
- Continuous Deduplication
- Conventional Commits
