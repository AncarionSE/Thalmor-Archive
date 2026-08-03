# Project Context

## Purpose
A static website that presents in-character Elder Scrolls roleplay reports as
readable in-game Skyrim books: aged parchment, two-page spreads, a turning
leaf. The site is an archive — new reports are added as Markdown files and
appear automatically.

## Tech Stack
- Astro 5 (static output, content collections via glob loader)
- Markdown authoring (`marked` for per-page rendering)
- Vanilla JS for the page-turn interaction (no UI framework)
- Self-hosted fonts via Fontsource (IM Fell English, IM Fell English SC, Cinzel)

## Project Conventions

### Content
- One report = one file in `src/content/reports/<category>/*.md`, where
  `<category>` is one of the twelve archive volumes (`01_Intelligence`,
  `02_Incident_Reports`, `03_Diplomatic_Correspondence`,
  `04_Administrative_Orders`, `05_Promotions_and_Appointments`,
  `06_Procurement_and_Trade`, `07_Mining_and_Supply`, `08_Training`,
  `09_Personnel_Files`, `10_Meeting_Minutes`, `11_Ledger_Audits`, `Appendix`)
  defined in `src/lib/categories.ts`. The category a report belongs to is
  derived from its folder, not a frontmatter field.
- Frontmatter: `title`, `author`, `date` (in-world date string), `classification`, `summary`, `order`
- Page breaks inside a report are explicit: a line containing only `<!--page-->`
- The first page of a report body is treated as the title page (right-hand page of the first spread)

### Code Style
- No client-side framework; one script per interactive component
- All colors/typography flow from CSS custom properties in `src/styles/global.css`
- No Bethesda assets (fonts, textures, logos). All texture is CSS/SVG generated; all ornament is original.

### Accessibility / Quality floor
- Keyboard navigation (←/→) for page turns
- `prefers-reduced-motion`: instant page swap, no 3D flip
- Responsive: below 900px the spread collapses to a single page

## Domain Context
Reports are written in-character (Thalmor field intelligence, 4E 205).
The site never breaks character in reader-facing copy: navigation, labels and
empty states use ledger/archive vocabulary.

## Important Constraints
- Fully static; deployable to GitHub Pages / Netlify / Cloudflare Pages with no server
- Report text is the author's own creative writing and is reproduced verbatim
