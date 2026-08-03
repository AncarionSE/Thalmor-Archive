# Adding a report

## Quick start

```bash
npm run new-report -- 01_intelligence "Report: Something Happened in Whiterun"
```

This creates a stub file in the right category folder with the frontmatter
filled in and the next filing number (`order`) already computed. Open it,
replace the `TODO`s, and write the report as plain Markdown — paragraphs,
`##` headings, `- ` lists, and tables all work. **Don't insert page breaks by
hand.**

When you're done writing:

```bash
npm run paginate   # inserts <!--page--> breaks so nothing overflows or scrolls
npm run dev        # preview at localhost:4321, click through the book
```

That's the whole workflow. `npm run paginate` is safe to run as often as you
like — re-running it on files that don't need changes is a no-op, and it
never touches your prose, only where the page breaks fall.

## Categories

Run `npm run new-report` with no arguments to print the current list of
category keys. As of writing:

| Category key | Folder | Shown as |
|---|---|---|
| `01_intelligence` | `01_Intelligence` | Intelligence Reports |
| `02_incident_reports` | `02_Incident_Reports` | Patrol & Incident Reports |
| `03_diplomatic_correspondence` | `03_Diplomatic_Correspondence` | Diplomatic Correspondence |
| `04_administrative_orders` | `04_Administrative_Orders` | Administrative Orders |
| `05_promotions_and_appointments` | `05_Promotions_and_Appointments` | Promotions & Appointments |
| `06_procurement_and_trade` | `06_Procurement_and_Trade` | Procurement & Trade |
| `07_mining_and_supply` | `07_Mining_and_Supply` | Mining & Supply |
| `08_training` | `08_Training` | Training |
| `09_personnel_files` | `09_Personnel_Files` | Personnel Files |
| `10_meeting_minutes` | `10_Meeting_Minutes` | Meeting Minutes |
| `11_ledger_audits` | `11_Ledger_Audits` | Ledger Audits |
| `appendix` | `Appendix` | Appendix |

A report's category is just which folder it's in — there's no separate
frontmatter field to keep in sync. The shelf on the homepage only shows
categories that have at least one report filed, so nothing needs to be
"activated" anywhere.

### Adding a brand new category

Add an entry to `CATEGORIES` in `src/lib/categories.ts` (label, spine color,
icon) *and* to the `CATEGORIES` map at the top of `scripts/new-report.mjs`
(folder name, default classification) — the two are intentionally kept in
plain JS/data rather than sharing an import, so update both.

## Frontmatter reference

```yaml
---
title: "Report: Something Happened in Whiterun"
author: "Canonreeve Ancarion Saelthar"
date: "4th of Frostfall, 4E 205"       # in-world date, free text
classification: "Thalmor Eyes Only"    # or "Internal"
summary: "One sentence shown in the ledger listing."
order: 61                              # higher = newer, sorts to the top
---
```

- `order` just needs to be higher than whatever should appear above it in
  its category's ledger — `new-report` computes the next value automatically
  across *all* reports, so you don't need to think about it.
- `classification` is cosmetic (the red stamp on the title page) — pick
  whichever reads right for the report.

## Why the pagination script exists

The book reader turns a report's body into fixed-height pages: whatever you
write gets measured and split so each page fits without scrolling. Placing
`<!--page-->` markers by hand is exactly how this used to work, and it was
the single biggest source of bugs in this repo's history — pages silently
overflowing into a scrollbar, or pages left half-empty. `npm run paginate`
replaced all of that: write naturally, run the script, done.

If you ever need to regenerate just one file instead of the whole archive:

```bash
npm run paginate -- src/content/reports/01_Intelligence/some-report.md
```

## Manual page breaks (rare)

You generally shouldn't need this — but if you want to *force* a break at a
specific spot (e.g. a dramatic reveal that should start a fresh page), add
a line containing only `<!--force-page-->` (not `<!--page-->` — that one is
the script's own output and gets regenerated fresh every run). A forced
break survives any number of `npm run paginate` runs; the script only ever
rewrites the plain `<!--page-->` breaks it inserted itself.
