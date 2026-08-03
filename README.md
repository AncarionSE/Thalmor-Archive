# The Embassy Archive

Skyrim-book styled website for in-character RP reports. Static, built with Astro.

## Run locally
```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # outputs to dist/
```

## Add a new report
Create `src/content/reports/<slug>.md`:

```md
---
title: "Report: ..."
author: "Ancarion Saelthar, Quartermaster"
date: "4E 205"
classification: "Thalmor Eyes Only"
summary: "One-line summary shown in the archive ledger."
order: 2            # higher = newer, sorts to the top
---

## First Section
Text of the first page...

<!--page-->

## Second Section
Text of the second page...
```

- `<!--page-->` on its own line = a page break in the book.
- Keep each page to roughly what fits a book page (~180 words); overflow scrolls
  but a clean page break always looks better.
- The title page is generated automatically from the frontmatter.

## Deploy
Any static host. For GitHub Pages set `site` and `base` in `astro.config.mjs`
per the Astro docs, then publish `dist/`.

## Specs
Spec-driven via OpenSpec — see `openspec/project.md` and `openspec/specs/`.
Propose changes in `openspec/changes/` before modifying behavior.
