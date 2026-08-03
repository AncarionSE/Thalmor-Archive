# Change: Categorize the archive into a bookshelf of volumes

## Why
The flat ledger stopped scaling once the full field-report history (59
reports) was filed in one sitting. Canonreeve Ancarion's records also fall
into natural administrative categories (intelligence, incidents, diplomacy,
personnel, etc.) that deserve their own bound volumes rather than one long
scroll.

## What Changes
- Reports reorganized from `src/content/reports/*.md` into twelve category
  subfolders; category is derived from the folder, not a frontmatter field
- New `src/lib/categories.ts` mapping category keys to labels/spine
  colors/icons
- Landing page rebuilt as a shelf of clickable book-cover volumes (one per
  non-empty category) instead of a single flat ledger
- New `/category/<key>/` pages render the per-category ledger (extracted into
  a shared `ReportList` component)
- Report route moved from `[slug].astro` to `[...slug].astro` to allow
  category-prefixed slugs
- Added an original hand-drawn Thalmor eagle mark to the book title page
- Rebranded landing copy from "The Embassy Archive" / Quartermaster framing
  to "Canonreeve Archives", reflecting the archive's actual filer

## Impact
- Updated specs: report-archive, book-reader
- Changed code: `src/pages/index.astro`, new `src/pages/category/[category].astro`,
  new `src/components/ReportList.astro`, new `src/lib/categories.ts`,
  `src/pages/reports/[...slug].astro` (renamed from `[slug].astro`),
  all files under `src/content/reports/` moved into category subfolders
