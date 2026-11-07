# Wave 50 — Cinematic Homepage Hero

## Scope and composition

The homepage keeps `LuxuryHeroSection` as its eager-loaded LCP section. The layout is content-sized with a `100svh` minimum: skyline background and overlays, availability badge, headline, Dubai area-price ribbon, tagline, keyboard-operable search action, developer filters, primary actions, market stats, trust details, and a scroll cue. The section must not add a separate data request; it consumes the existing optional `MarketStats` props.

## Four-way component boundary

| Layer  | File(s)                                             | Responsibility                                                                                   |
| ------ | --------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| View   | `LuxuryHeroSection.tsx`                             | Semantic section, visual composition, and accessible controls                                    |
| Logic  | `logic/HERO.logic.ts`                               | Language selection, display model, motion preference, CTA tracking/navigation, count-up behavior |
| Styles | `styles/HERO.style.ts`, `LuxuryHeroSection.css`     | Shared z-index token bridge, palette, responsive layout, focus and motion styles                 |
| Data   | `data/HERO.data.ts`, `data/en.json`, `data/ar.json` | Developer/market/stat definitions and all user-facing copy                                       |

`HomePage.tsx` retains its existing public component import and props. Hero CTA analytics preserve the `homepage_hero_cta_click` event contract.

## Responsive, locale, and accessibility contract

- Default desktop layout applies at 1440px; existing 1024px, 768px, and 480px rules cover the 1024px, 768px, and 375px target widths.
- Arabic uses `dir="rtl"` and Arabic copy; layout offsets are logical, with directional CTA icons mirrored. Other supported languages safely fall back to the English hero copy.
- Search, developer filters, navigation, and scroll actions are native buttons with visible keyboard focus. The section heading labels the region; decorative layers are hidden from assistive technology.
- Entrance/parallax/counter motion respects `prefers-reduced-motion`; animated counters are not live-announced frame by frame.
- The background, content, and scroll cue consume `Z_INDEX.CANVAS` and `Z_INDEX.CONTENT` through the style layer. The section uses shared brand and type tokens; no hero-specific hex palette is introduced.

## Performance and compliance

The existing skyline preload and image URL remain unchanged. The hero adds no API/database queries, so MapIndexHash query optimization is not applicable. It displays only aggregate homepage statistics and does not collect or expose personal data. RERA wording is limited to the existing agency trust label; this component does not implement registration, legal, or PDPL workflows.

## Validation

Run the focused Vitest files for `LuxuryHeroSection` and `HERO.data`, then the project typecheck, lint, and Vite build. Verify English/Arabic render and the 375px, 768px, 1024px, and 1440px layouts in a browser before release.
