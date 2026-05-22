# BiocharHub Website — Project Intelligence

This file is read automatically by Claude at the start of every session.
It defines project context, tech stack, and design standards.

---

## Project Overview

**BiocharHub** is a React + Vite + Tailwind CSS scientific web application for biochar CO₂ adsorption research. It is the UI layer for a Thai MS thesis on biochar machine learning.

- **Stack**: React 18, Vite, Tailwind CSS, Framer Motion, react-i18next, Recharts, lucide-react
- **Theme**: Light pastel — white/slate base with green (`#22c55e`), amber (`#f59e0b`), violet (`#8b5cf6`) accents
- **i18n**: All user-visible strings go through `useTranslation()` + `src/i18n/locales/en.json`
- **Scientific refs**: `src/components/home/ScientificReferences.jsx` — REFS array (IDs 1–19); use `<Cite ids={[n]} />` inline

---

## Designer / Artist / Web Designer Mindset

**When writing or editing any React component, think like a senior product designer + creative director.** Professional vs. amateur UI comes down to a small set of decisions — apply all of them by default.

### Visual Hierarchy
- Every section needs ONE clear focal point. Never compete with multiple bold elements.
- Size contrast: hero headings ≥ `text-4xl font-black`, supporting text ≤ `text-sm`.
- Whitespace is not waste — sections need `py-20` minimum, `py-24` for hero sections.
- Z-order: background texture → gradient blobs → cards → text → CTAs.

### Color & Gradients
- Never flat solid backgrounds alone — always layer a subtle radial or linear gradient behind sections.
- Brand palette: `#22c55e` (green), `#f59e0b` (amber), `#8b5cf6` (violet) — accent only; white/slate is the base.
- Gradient direction: `gradFrom → gradTo` differ by ~2 stops of darkness (e.g. `#22c55e → #15803d`).
- Glassmorphism: `backdrop-blur-md`, `bg-white/10–20`, `border-white/10–15`. Never opaque cards inside gradient sections.
- Glow shadows: `box-shadow: 0 8px 32px ${color}30` on CTAs and key icons only — overuse kills the effect.

### Typography
- Headings: `font-space font-bold` or `font-black`. Body: `font-sans`.
- Large headings: `leading-tight` or `leading-none`.
- Dark/gradient backgrounds: text is always white or `text-white/70` — never `text-slate-600` on dark.
- Light/white backgrounds: `text-slate-700` body, `text-slate-900` headings — never pure black.
- Gradient text (`text-gradient-green`): apply to 1–2 key words per heading only, never the whole sentence.

### Card Design
- Cards need a **clear visual layer system**: colored/image header zone (`h-36–h-48`) + white/light body zone.
- Colored header zones with overlaid content create instant professional feel.
- Stats rows: `divide-x divide-border`, equal columns (`grid-cols-3`), centered text.
- CTA buttons: `rounded-full` pill style with gradient background + subtle glow shadow.
- Hover states are mandatory: `hover:shadow-xl`, `hover:scale-[1.02]`, `group-hover:scale-105` on images.
- Card borders: `border border-border` or `border-${color}/20` — 1–1.5px, never 2px+.

### Spacing & Layout
- Grid gaps: `gap-6` or `gap-8` for cards — never `gap-4`.
- Section padding: `py-16` minimum, `py-24` for hero.
- Max widths: `max-w-7xl` content, `max-w-2xl` centered text blocks.
- Icon sizes: `w-5 h-5` in text, `w-6 h-6` in badges, `w-7 h-7` in feature zones.

### Animations (Framer Motion)
- Entrance: `initial={{ opacity: 0, y: 20 }}` + `whileInView={{ opacity: 1, y: 0 }}` + `viewport={{ once: true }}`.
- Stagger with `transition={{ delay: i * 0.1 }}` — cap total at 0.4s.
- **Never use `layout` prop on list/grid items** — causes sibling reflow on expand/collapse.
- Hover: `whileHover={{ scale: 1.02 }}` on cards, `hover:scale-105` on images.
- Only animate `opacity` and `scale` on items with siblings — avoid position/size animations.

### Images
- Always add `onError` handlers with a branded gradient fallback using the item's accent color:
  ```jsx
  onError={e => {
    e.target.style.display = 'none';
    e.target.parentElement.style.background = `linear-gradient(135deg, ${color}40, ${color}18)`;
  }}
  ```
- Hero images: `object-cover` + gradient overlay `from-black/60 to-transparent`.
- Never show broken alt-text in production — always fallback gracefully.
- Unsplash URLs: `?w=600&q=80` for cards, `?w=1200&q=85` for hero images.

### "Amateur vs. Professional" Checklist
Before finalising any component, verify:
- [ ] Section background is not flat white/slate (has subtle gradient or texture)
- [ ] Cards have coloured accents — not just grey borders
- [ ] At least one element per section has a glow or shadow
- [ ] Typography has clear 3-level hierarchy (heading / sub / body)
- [ ] All interactive elements have hover states
- [ ] Image loading errors are handled with `onError` fallback
- [ ] No dark-on-dark or light-on-light text
- [ ] Animated entrance present (`whileInView`)
- [ ] CTAs use gradient + pill shape, not plain bordered buttons
- [ ] Section badge (pill above heading) uses an appropriate icon + label

---

## File Map (Key Files)

| File | Purpose |
|---|---|
| `src/components/home/HeroSection.jsx` | Landing hero — font-black headings, tool strip, progress bar card |
| `src/components/home/ThailandContext.jsx` | Thai feedstock cards — 4 biomass species, image header, stats row |
| `src/components/home/TriplePhaseFlow.jsx` | 3 tool cards (Predictor, Database, Advisor) — colored gradient header zones |
| `src/components/home/HeatmapSection.jsx` | Temperature × activator heatmap — light theme text |
| `src/components/home/GlossarySection.jsx` | Expandable glossary cards — no `layout` prop on motion elements |
| `src/components/home/DocumentsSection.jsx` | Publication/doc cards — colorful category badges |
| `src/components/home/ScientificReferences.jsx` | REFS array (IDs 1–19) + `<Cite>` inline component |
| `src/i18n/locales/en.json` | All UI strings — always add new keys here, never hardcode text |
| `src/index.css` | Custom CSS — `glass-card`, `glass-modal`, `gradient-green`, `glow-green`, etc. |
| `src/lib/biocharKnowledgeBase.js` | BIOMASS_STATS, TOTAL_DATA_POINTS, TOTAL_EXPERIMENTS constants |
| `src/lib/database44.js` | DB44_RECORDS — 44 experiment records with BET surface area data |

---

## Known Patterns & Gotchas

- **`glass-dark`** is now white/light (not dark) — use **`glass-modal`** for dark overlays/modals.
- `<Cite ids={[n]} />` renders inline superscript citation links to `#references`.
- `font-space` = Space Grotesk (imported in index.css) — use for headings and data labels.
- `text-gradient-green` = CSS class in index.css for animated gradient text on headings.
- `gradient-green` / `glow-green` = Tailwind plugin classes for green gradient backgrounds and glow shadows on buttons.
- All page headers should be **pastel** (light gradient), not dark navy — the dark era is over.
